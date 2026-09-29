# =============================================================================
# LeafGuard AI — Smart Farming Platform
# app.py — Flask Web Application (Main Entry Point)
# =============================================================================
#
# This is the main web server for LeafGuard AI.  It:
#   1. Serves the web interface (HTML pages).
#   2. Accepts leaf image uploads from farmers.
#   3. Runs disease prediction (real or demo mode).
#   4. Returns results as JSON to the frontend.
#   5. Serves multi-language content from JSON files.
#
# To start the server, run:
#     python app.py
#
# Then open your browser and go to:
#     http://localhost:5000
# =============================================================================

import os
import json
import logging
import time
import uuid
from datetime import datetime
from PIL import Image as PILImage
from flask import Flask, request, jsonify, render_template, url_for
from werkzeug.utils import secure_filename

# Import our custom prediction module (predict.py in the same folder)
from predict import load_model, predict_disease, get_disease_info, load_crop_model, predict_crop_disease, get_crop_disease_info, CROP_CLASSES, CROP_MODEL_PATHS, validate_crop_image, VALIDATION_CONFIG, get_all_disease_translations, get_localized_crop_name

# =============================================================================
# APP CONFIGURATION
# =============================================================================

# Create the Flask application instance
# __name__ tells Flask where to look for templates and static files
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'leafguard-dev-key-2025')

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('leafguard')

# ---------------------------------------------------------------------------
# Upload settings
# ---------------------------------------------------------------------------

# Where uploaded images will be saved on the server
UPLOAD_FOLDER = 'static/uploads'

# Maximum file size: 16 MB (prevents huge files from crashing the server)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 megabytes

# Allowed image file extensions (only accept real image formats)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Tell Flask where to save uploads
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create the upload directory if it doesn't exist yet
# exist_ok=True means "don't crash if the folder already exists"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------------------------------------------------------------------
# Load the AI model at startup
# ---------------------------------------------------------------------------
# The model file is expected at 'model/trained_model.h5'.
# If the file is missing or TensorFlow isn't installed, model will be None
# and the app will run in DEMO mode with random predictions.
# ---------------------------------------------------------------------------
MODEL_PATH = os.path.join('model', 'trained_model.h5')
model = load_model(MODEL_PATH)

prediction_history = []

# Print a clear startup message so the developer/farmer knows what mode is active
print("\n" + "=" * 60)
print("  LeafGuard AI -- Smart Farming Platform")
print("  " + "-" * 54)
if model is not None:
    print("  [OK] Legacy model loaded from: {}".format(MODEL_PATH))
else:
    print("  [!!] Legacy model not found -- using demo mode")
for crop_name in CROP_CLASSES:
    keras_p = CROP_MODEL_PATHS[crop_name]
    h5_p = keras_p.replace('.keras', '.h5')
    if os.path.exists(keras_p) or os.path.exists(h5_p):
        print("  [OK] {} model ready".format(crop_name.capitalize()))
    else:
        print("  [!!] {} model not found -- demo mode".format(crop_name.capitalize()))
print("=" * 60 + "\n")

# Pre-load available crop models for faster first predictions
from predict import warmup_models
try:
    warmup_models()
except Exception as e:
    logger.warning("Model warmup failed: %s", e)


# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

def allowed_file(filename):
    """
    Check if an uploaded file has an allowed image extension.

    Parameters
    ----------
    filename : str
        The original filename from the upload (e.g. 'leaf_photo.jpg').

    Returns
    -------
    bool
        True if the file extension is in ALLOWED_EXTENSIONS, False otherwise.

    How it works
    ------------
    1. Check that there's a dot in the filename (so it has an extension).
    2. Split on the LAST dot and grab the extension part.
    3. Convert to lowercase and check against our allowed set.

    Example
    -------
    >>> allowed_file('my_leaf.jpg')
    True
    >>> allowed_file('virus.exe')
    False
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


_prediction_count = 0

def cleanup_old_uploads(max_age_hours=24):
    """
    Remove uploaded images older than max_age_hours to prevent disk bloat.
    Called at startup and periodically during prediction.
    """
    upload_dir = app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_dir):
        return 0
    
    removed = 0
    cutoff_time = time.time() - (max_age_hours * 3600)
    for fname in os.listdir(upload_dir):
        fpath = os.path.join(upload_dir, fname)
        if os.path.isfile(fpath):
            try:
                if os.path.getmtime(fpath) < cutoff_time:
                    os.remove(fpath)
                    removed += 1
            except OSError:
                pass
    if removed > 0:
        logger.info("Cleaned up %d old upload(s)", removed)
    return removed

# Run cleanup at startup
cleanup_old_uploads()

# =============================================================================
# ROUTES — These define what happens when a user visits each URL
# =============================================================================

# ── HOME PAGE ──────────────────────────────────────────────────────────────
@app.route('/')
def index():
    """
    Serve the main homepage.

    When a user visits http://localhost:5000/, Flask renders the
    'index.html' template from the 'templates/' folder.
    """
    return render_template('index.html')


# ── PREDICTION ENDPOINT ───────────────────────────────────────────────────
@app.route('/predict', methods=['POST'])
def predict():
    """
    Handle leaf image upload and return disease prediction as JSON.

    This endpoint:
    1. Receives an image file via a POST request (multipart form data).
    2. Validates the file (exists? allowed extension?).
    3. Saves it to the uploads folder with a safe filename.
    4. Runs the AI prediction (real or demo mode).
    5. Looks up disease information (causes, treatment, prevention).
    6. Returns everything as a JSON response.

    Expected form field name: 'file'

    Returns
    -------
    JSON response with:
        - disease      : str   — predicted disease name
        - confidence   : float — prediction confidence (%)
        - all_predictions : dict — all class probabilities
        - causes       : str   — what causes the disease
        - treatment    : list  — treatment recommendations
        - prevention   : list  — prevention tips
        - image_url    : str   — URL to the uploaded image

    Error responses:
        - 400 if no file is provided or filename is empty
        - 400 if file type is not allowed
        - 500 if prediction fails
    """
    # --- Step 1: Check that a file was included in the request ---
    if 'file' not in request.files:
        return jsonify({
            'error': 'No file provided. Please upload a leaf image.'
        }), 400

    file = request.files['file']

    # --- Step 2: Check that the file has a name (not an empty submission) ---
    if file.filename == '':
        return jsonify({
            'error': 'No file selected. Please choose an image to upload.'
        }), 400

    # --- Step 3: Validate the file extension ---
    if not allowed_file(file.filename):
        return jsonify({
            'error': 'File type not allowed. Please upload a PNG, JPG, JPEG, GIF, or WebP image.'
        }), 400

    try:
        global _prediction_count
        _prediction_count += 1
        if _prediction_count % 100 == 0:
            cleanup_old_uploads()

        # --- Step 4: Save the file safely ---
        # secure_filename removes dangerous characters from the filename
        # e.g., "../../../etc/passwd" → "etc_passwd"
        filename = secure_filename(file.filename)
        # Add unique prefix to prevent filename collisions
        unique_prefix = uuid.uuid4().hex[:8]
        filename = '{}_{}'.format(unique_prefix, filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        print("[UPLOAD] Image saved to: {}".format(filepath))

        # Validate the file is a real image
        try:
            with PILImage.open(filepath) as test_img:
                test_img.verify()  # Raises exception if not a valid image
        except Exception:
            os.remove(filepath)  # Clean up invalid file
            return jsonify({
                'error': 'The uploaded file is not a valid image. Please upload a real leaf photo.'
            }), 400

        crop = request.form.get('crop', '').strip().lower()
        lang = request.form.get('lang', 'en').strip().lower()
        if lang not in ('en', 'hi', 'gu'):
            lang = 'en'

        if crop and crop in CROP_CLASSES:
            # --- Validate image before prediction ---
            validation = validate_crop_image(crop, filepath, lang=lang)
            if not validation['valid']:
                logger.warning("Image validation failed for crop %s: %s", crop, validation.get('reason', 'Unknown'))
                reason_code = validation.get('reason_code', 'not_potato' if crop == 'potato' else 'invalid_image')
                msg = validation.get('reason') or 'Please upload a valid {} leaf image.'.format(get_localized_crop_name(crop, lang))
                return jsonify({
                    'success': False,
                    'valid_image': False,
                    'image_valid': False,
                    'error_type': validation.get('error_type', 'INVALID_CROP_IMAGE'),
                    'reason': reason_code,
                    'message': msg,
                    'crop': crop.capitalize(),
                    'crop_name': get_localized_crop_name(crop, lang)
                }), 400
            
            prediction = predict_crop_disease(crop, filepath)
            
            # --- Check disease confidence ---
            if prediction['confidence'] < VALIDATION_CONFIG['disease_low_confidence']:
                logger.info("Low confidence prediction for %s: %.1f%%", crop, prediction['confidence'])
                crop_disp = get_localized_crop_name(crop, lang)
                if lang == 'gu':
                    if crop == 'potato':
                        msg = "બટાકાના પાનની છબી ઓળખી શકાઈ નથી ({:.1f}%). કૃપા કરીને બટાકાના પાનની સ્પષ્ટ છબી અપલોડ કરો.".format(prediction['confidence'])
                    else:
                        msg = "{}ના પાનની છબી ઓળખી શકાઈ નથી ({:.1f}%). કૃપા કરીને સ્પષ્ટ છબી અપલોડ કરો.".format(crop_disp, prediction['confidence'])
                elif lang == 'hi':
                    if crop == 'potato':
                        msg = "आलू की पत्ती की पहचान नहीं हो सकी ({:.1f}%)। कृपया आलू की पत्ती की स्पष्ट तस्वीर अपलोड करें।".format(prediction['confidence'])
                    else:
                        msg = "{} की पत्ती की पहचान नहीं हो सकी ({:.1f}%)। कृपया स्पष्ट तस्वीर अपलोड करें।".format(crop_disp, prediction['confidence'])
                else:
                    msg = "Unable to identify {} disease ({:.1f}% confidence). Please upload a clearer image of the leaf.".format(crop.capitalize(), prediction['confidence'])

                return jsonify({
                    'success': False,
                    'valid_image': False,
                    'image_valid': False,
                    'error_type': 'LOW_CONFIDENCE',
                    'reason': 'low_confidence',
                    'message': msg,
                    'crop': crop.capitalize(),
                    'crop_name': crop_disp,
                    'confidence': prediction['confidence']
                })
            
            disease_key = prediction['disease']
            disease_info = get_crop_disease_info(disease_key, crop, lang=lang)
            all_translations = get_all_disease_translations(disease_key, crop)
            
            image_url = url_for('static', filename='uploads/' + filename)
            causes = disease_info.get('causes', [])
            if isinstance(causes, str):
                causes = [causes]
            result = {
                'success': True,
                'image_valid': True,
                'valid_image': True,
                'disease': disease_info.get('display_name', disease_key),
                'disease_key': disease_key,
                'confidence': prediction['confidence'],
                'all_predictions': prediction.get('all_predictions', {}),
                'causes': causes,
                'treatment': disease_info.get('treatment', []),
                'prevention': disease_info.get('prevention', []),
                'image_url': image_url,
                'crop': crop.capitalize(),
                'crop_name': get_localized_crop_name(crop, lang),
                'prediction_time_ms': prediction.get('prediction_time_ms', 0),
                'description': disease_info.get('description', ''),
                'symptoms': disease_info.get('symptoms', []),
                'translations': all_translations,
                'message': 'Analysis complete!'
            }
            logger.info("Prediction complete for crop %s: %s (%.2f%%)", crop, prediction['disease'], prediction['confidence'])
            prediction_history.append({
                'crop': crop,
                'disease': disease_key,
                'confidence': prediction['confidence'],
                'timestamp': datetime.now().isoformat(),
                'prediction_time_ms': prediction.get('prediction_time_ms', 0)
            })
            # Keep history manageable — retain only the last 50 predictions
            if len(prediction_history) > 50:
                prediction_history.pop(0)
        else:
            # --- Step 5: Run AI prediction ---
            crop = 'groundnut'
            prediction = predict_disease(model, filepath)
            disease_key = prediction['disease']
            disease_info = get_crop_disease_info(disease_key, crop, lang=lang)
            all_translations = get_all_disease_translations(disease_key, crop)
    
            # --- Step 7: Build the image URL for the frontend ---
            image_url = url_for('static', filename='uploads/' + filename)
    
            causes = disease_info.get('causes', [])
            if isinstance(causes, str):
                causes = [causes]
            result = {
                'success': True,
                'disease': disease_info.get('display_name', disease_key),
                'disease_key': disease_key,
                'confidence': prediction['confidence'],
                'all_predictions': prediction.get('all_predictions', {}),
                'causes': causes,
                'treatment': disease_info.get('treatment', []),
                'prevention': disease_info.get('prevention', []),
                'image_url': image_url,
                'crop': crop,
                'crop_name': get_localized_crop_name(crop, lang),
                'prediction_time_ms': 0,
                'description': disease_info.get('description', ''),
                'symptoms': disease_info.get('symptoms', []),
                'translations': all_translations
            }
            
            prediction_history.append({
                'crop': 'groundnut',
                'disease': disease_key,
                'confidence': prediction['confidence'],
                'timestamp': datetime.now().isoformat(),
                'prediction_time_ms': 0
            })
            if len(prediction_history) > 50:
                prediction_history.pop(0)
    
            print("[OK] Prediction complete: {} ({:.2f}%)".format(
                prediction['disease'], prediction['confidence']
            ))

        return jsonify(result)

    except Exception as e:
        # Something went wrong during prediction
        logger.error("Prediction failed: %s", str(e), exc_info=True)
        return jsonify({
            'error': 'An error occurred during prediction: {}'.format(str(e))
        }), 500


# ── LANGUAGE / TRANSLATION ENDPOINT ───────────────────────────────────────
@app.route('/api/language/<lang>', methods=['GET'])
def get_language(lang):
    """
    Return translation strings for the requested language.

    The frontend calls this endpoint to get UI text in the farmer's
    preferred language (e.g., Hindi, Gujarati, English).

    Parameters
    ----------
    lang : str
        Language code from the URL, e.g. 'en', 'hi', 'gu'.

    Returns
    -------
    JSON with all translated UI strings, loaded from
    static/languages/{lang}.json

    Error responses:
        - 404 if the language file doesn't exist
        - 500 if the file can't be read
    """
    # Build the path to the language JSON file
    lang_file = os.path.join('static', 'languages', '{}.json'.format(lang))

    # Check if the requested language file exists
    if not os.path.exists(lang_file):
        return jsonify({
            'error': "Language '{}' is not available. File '{}' not found.".format(
                lang, lang_file
            )
        }), 404

    try:
        # Read the JSON file with UTF-8 encoding (important for non-Latin scripts)
        with open(lang_file, 'r', encoding='utf-8') as f:
            translations = json.load(f)

        return jsonify(translations)

    except json.JSONDecodeError as e:
        print("[ERROR] JSON parse error in '{}': {}".format(lang_file, str(e)))
        return jsonify({
            'error': 'Language file is corrupted or has invalid JSON.'
        }), 500
    except Exception as e:
        print("[ERROR] Error reading language file: {}".format(str(e)))
        return jsonify({
            'error': 'Could not load language file: {}'.format(str(e))
        }), 500


@app.route('/api/disease-info', methods=['GET'])
def api_disease_info():
    """
    Return translated disease information for a given disease, crop, and language.
    Parameters (query string):
        - disease : str (e.g. 'Tomato_Early_blight' or 'Early Blight')
        - crop    : str (e.g. 'tomato')
        - lang    : str ('en', 'hi', 'gu')
    """
    disease = request.args.get('disease', '').strip()
    crop = request.args.get('crop', 'groundnut').strip().lower()
    lang = request.args.get('lang', 'en').strip().lower()
    if lang not in ('en', 'hi', 'gu'):
        lang = 'en'
    
    if not disease:
        return jsonify({'error': 'Disease name is required.'}), 400
        
    info = get_crop_disease_info(disease, crop, lang=lang)
    all_trans = get_all_disease_translations(disease, crop)
    
    causes = info.get('causes', [])
    if isinstance(causes, str):
        causes = [causes]
        
    return jsonify({
        'disease': info.get('display_name', disease),
        'disease_key': disease,
        'crop': crop,
        'crop_name': get_localized_crop_name(crop, lang),
        'description': info.get('description', ''),
        'symptoms': info.get('symptoms', []),
        'causes': causes,
        'treatment': info.get('treatment', []),
        'prevention': info.get('prevention', []),
        'translations': all_trans
    })


@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(prediction_history)

@app.route('/api/history/clear', methods=['POST'])
def clear_history():
    prediction_history.clear()
    return jsonify({'message': 'History cleared', 'count': 0})

@app.route('/api/crops', methods=['GET'])
def get_crops():
    crops_info = {}
    for crop_name, classes in CROP_CLASSES.items():
        model_path_keras = CROP_MODEL_PATHS[crop_name]
        model_path_h5 = model_path_keras.replace('.keras', '.h5')
        has_model = os.path.exists(model_path_keras) or os.path.exists(model_path_h5)
        crops_info[crop_name] = {
            'classes': classes,
            'model_available': has_model,
            'display_name': crop_name.capitalize()
        }
    response = jsonify(crops_info)
    response.headers['Cache-Control'] = 'public, max-age=3600'  # Cache for 1 hour
    return response

# =============================================================================
# ERROR HANDLERS — Friendly error pages instead of ugly defaults
# =============================================================================

@app.errorhandler(400)
def bad_request(error):
    """Handle 400 Bad Request errors."""
    return jsonify({
        'error': 'Bad request. Please check your input and try again.'
    }), 400


@app.errorhandler(404)
def not_found(error):
    """Handle 404 Not Found errors."""
    return jsonify({
        'error': 'Page not found. The URL you requested does not exist.'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 Internal Server Error."""
    return jsonify({
        'error': 'Internal server error. Please try again later.'
    }), 500


# =============================================================================
# START THE SERVER
# =============================================================================
if __name__ == '__main__':
    # Print helpful startup info
    print("[SERVER] Starting LeafGuard AI web server...")
    print("[URL] Open your browser and go to: http://localhost:5000")
    print("[STOP] Press Ctrl+C to stop the server.\n")

    # Run the Flask development server
    # - debug=True  → auto-reload on code changes + detailed error pages
    # - host='0.0.0.0' → accessible from other devices on the same network
    # - port=5000   → the default Flask port
    app.run(debug=True, host='0.0.0.0', port=5000)
