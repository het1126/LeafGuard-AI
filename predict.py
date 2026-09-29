# =============================================================================
# LeafGuard AI — Smart Farming Platform
# predict.py — Disease Prediction Module
# =============================================================================
#
# This file handles everything related to predicting groundnut leaf diseases.
# It can work in TWO modes:
#   1. REAL MODE  — Uses a trained TensorFlow/Keras deep-learning model (.h5)
#   2. DEMO MODE  — If no model file is found (or TensorFlow isn't installed),
#                   it returns random mock predictions so you can still test
#                   the web interface without a GPU or trained model.
#
# Supported diseases (4 classes):
#   • Healthy              — The leaf is fine, no disease detected
#   • Leaf Spot            — Caused by Cercospora arachidicola fungus
#   • Rust                 — Caused by Puccinia arachidis fungus
#   • Alternaria Leaf Spot — Caused by Alternaria alternata fungus
# =============================================================================

import os
import random
import numpy as np
import time
import threading
from PIL import Image

_model_lock = threading.Lock()

# ---------------------------------------------------------------------------
# Try to import TensorFlow.  On machines without a GPU or without TensorFlow
# installed we gracefully fall back to demo mode instead of crashing.
# ---------------------------------------------------------------------------
# Reduce TF logging noise in production
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

try:
    import tensorflow as tf
    TENSORFLOW_AVAILABLE = True
    print("[OK] TensorFlow loaded successfully (version {}).".format(tf.__version__))
    
    # Optimize GPU memory if available
    gpus = tf.config.list_physical_devices('GPU')
    for gpu in gpus:
        try:
            tf.config.experimental.set_memory_growth(gpu, True)
        except RuntimeError:
            pass
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("[INFO] TensorFlow is NOT installed -- running in DEMO mode.")

# ---------------------------------------------------------------------------
# The four classes our model can predict.  The order MUST match the order
# used during training (alphabetical by folder name in the dataset).
# ---------------------------------------------------------------------------
DISEASE_CLASSES = ['Healthy', 'Leaf_Spot', 'Rust', 'Alternaria_Leaf_Spot']


# =============================================================================
# FUNCTION 1 — load_model
# =============================================================================
def load_model(model_path):
    """
    Load a trained TensorFlow / Keras model from an .h5 file.

    Parameters
    ----------
    model_path : str
        Path to the .h5 model file (e.g. 'model/trained_model.h5').

    Returns
    -------
    model : keras.Model or None
        The loaded model, or None if the file doesn't exist or TensorFlow
        is not installed.

    How it works
    ------------
    1. Check if TensorFlow is available at all.
    2. Check if the model file exists on disk.
    3. If both conditions are met, load and return the model.
    4. Otherwise, return None (the rest of the app will use demo mode).
    """
    # Guard: TensorFlow must be installed
    if not TENSORFLOW_AVAILABLE:
        print("[INFO] Cannot load model -- TensorFlow is not installed.")
        return None

    # Guard: the .h5 file must actually exist
    if not os.path.exists(model_path):
        print("[INFO] Model file '{}' not found -- switching to DEMO mode.".format(model_path))
        return None

    try:
        # tf.keras.models.load_model reads the architecture + weights
        model = tf.keras.models.load_model(model_path)
        print("[OK] Model loaded successfully from '{}'.".format(model_path))
        return model
    except Exception as e:
        print("[ERROR] Error loading model: {}".format(e))
        return None


# =============================================================================
# FUNCTION 2 — preprocess_image
# =============================================================================
def preprocess_image(image_path):
    """
    Open an image file, resize it to 224×224, and normalize pixel values.

    Parameters
    ----------
    image_path : str
        Path to the image file (jpg, png, etc.).

    Returns
    -------
    img_array : numpy.ndarray
        A NumPy array of shape (1, 224, 224, 3) ready to be fed into the model.
        Pixel values are scaled to the [0, 1] range.

    Step-by-step
    ------------
    1. Open the image with Pillow (PIL).
    2. Convert to RGB (in case it's grayscale or RGBA).
    3. Resize to 224×224 — the size MobileNetV2 expects.
    4. Convert to a NumPy float32 array.
    5. Normalize: divide every pixel value by 255.0 so values are in [0, 1].
    6. Add a batch dimension with np.expand_dims (model expects a batch).
    """
    img = Image.open(image_path).convert('RGB')
    img = img.resize((224, 224), Image.LANCZOS)  # High-quality downscale
    img_array = np.array(img, dtype=np.float32) / 255.0  # Combine steps 4+5
    return np.expand_dims(img_array, axis=0)


# =============================================================================
# FUNCTION 3 — predict_disease
# =============================================================================
def predict_disease(model, image_path):
    """
    Predict which disease (if any) is present in a groundnut leaf image.

    Parameters
    ----------
    model : keras.Model or None
        The loaded Keras model.  If None, demo mode is used.
    image_path : str
        Path to the uploaded leaf image.

    Returns
    -------
    result : dict
        {
            'disease'         : str   — predicted class name (e.g. 'Leaf_Spot'),
            'confidence'      : float — confidence % for the top prediction,
            'all_predictions' : dict  — {class_name: confidence_%, ...}
        }

    How it works
    ------------
    • DEMO MODE (model is None):
        – Generate random probabilities for each class.
        – Pick the class with the highest random probability.
        – This lets you test the full web UI without a trained model.

    • REAL MODE (model exists):
        – Preprocess the image (resize, normalize).
        – Run model.predict() to get probability scores.
        – Pick the class with the highest probability.
    """
    if model is None:
        # ----- DEMO MODE ----- #
        # Generate random confidence values and normalize to sum to 1
        raw_scores = [random.uniform(0.01, 1.0) for _ in DISEASE_CLASSES]
        total = sum(raw_scores)
        probabilities = [score / total for score in raw_scores]

        # Make one class clearly dominant so the demo looks realistic
        dominant_index = random.randint(0, len(DISEASE_CLASSES) - 1)
        probabilities[dominant_index] = random.uniform(0.70, 0.97)

        # Re-distribute the remaining probability among other classes
        remaining = 1.0 - probabilities[dominant_index]
        other_indices = [i for i in range(len(DISEASE_CLASSES)) if i != dominant_index]
        for i in other_indices:
            probabilities[i] = remaining / len(other_indices)

        # Build a nice dict of class → confidence %
        all_predictions = {}
        for i, class_name in enumerate(DISEASE_CLASSES):
            all_predictions[class_name] = round(probabilities[i] * 100, 2)

        predicted_class = DISEASE_CLASSES[dominant_index]
        confidence = round(probabilities[dominant_index] * 100, 2)

        print("[DEMO] Predicted: {} ({:.2f}%)".format(predicted_class, confidence))
    else:
        # ----- REAL MODE ----- #
        # Preprocess the uploaded image into a model-ready tensor
        img_array = preprocess_image(image_path)

        # Run inference — model() direct call is 3-5x faster for single images
        # (avoids model.predict() batch overhead, equivalent to verbose=0)
        predictions = model(img_array, training=False)

        # predictions[0] is the probability array for our single image
        probabilities = predictions[0].numpy()

        # Find the index of the highest probability
        predicted_index = int(np.argmax(probabilities))
        predicted_class = DISEASE_CLASSES[predicted_index]
        confidence = round(float(probabilities[predicted_index]) * 100, 2)

        # Build dict of all class probabilities
        all_predictions = {}
        for i, class_name in enumerate(DISEASE_CLASSES):
            all_predictions[class_name] = round(float(probabilities[i]) * 100, 2)

        print("[REAL] Predicted: {} ({:.2f}%)".format(predicted_class, confidence))

    # Return the prediction result as a dictionary
    return {
        'disease': predicted_class,
        'confidence': confidence,
        'all_predictions': all_predictions
    }


# =============================================================================
# FUNCTION 4 — get_disease_info
# =============================================================================
def get_disease_info(disease_name, lang='en'):
    """
    Return detailed information about a groundnut leaf disease in the requested language.
    Delegates to get_crop_disease_info for full multilingual support.
    """
    return get_crop_disease_info(disease_name, 'groundnut', lang=lang)


    # ── Knowledge base: one entry per disease ──────────────────────────
    disease_database = {

        # ── 1. HEALTHY ─────────────────────────────────────────────────
        'Healthy': {
            'causes': 'No disease detected. The leaf appears healthy and normal.',
            'treatment': [
                'No treatment is needed — the plant looks great!',
                'Continue your regular watering and fertilization schedule.',
                'Keep monitoring leaves weekly for any early signs of disease.',
                'Maintain good soil health with organic compost or manure.'
            ],
            'prevention': [
                'Practice crop rotation every 2-3 seasons to keep soil healthy.',
                'Use certified disease-free seeds from a trusted supplier.',
                'Keep the field clean by removing weeds and plant debris.',
                'Apply balanced NPK fertilizer to strengthen plant immunity.'
            ]
        },

        # ── 2. LEAF SPOT ───────────────────────────────────────────────
        'Leaf_Spot': {
            'causes': (
                'Caused by the fungus Cercospora arachidicola. '
                'This fungus thrives in warm, humid conditions and spreads '
                'through wind-blown spores and rain splashes. Brown or dark '
                'spots appear on the upper surface of leaves.'
            ),
            'treatment': [
                'Apply fungicides such as Mancozeb (2.5 g/L) or Chlorothalonil as a foliar spray.',
                'Remove and destroy heavily infected leaves to reduce spore load.',
                'Spray fungicide every 10-14 days during the rainy season.',
                'Use a combination of contact and systemic fungicides for best results.'
            ],
            'prevention': [
                'Practice crop rotation with non-host crops (cereals like maize or sorghum).',
                'Avoid overhead irrigation — use drip irrigation to keep leaves dry.',
                'Plant resistant or tolerant groundnut varieties recommended for your region.',
                'Maintain proper plant spacing (30 × 10 cm) to improve air circulation.'
            ]
        },

        # ── 3. RUST ───────────────────────────────────────────────────
        'Rust': {
            'causes': (
                'Caused by the fungus Puccinia arachidis. '
                'Orange-brown pustules (tiny raised bumps) appear on the '
                'underside of leaves. The fungus spreads rapidly in warm, '
                'moist weather through airborne spores called urediniospores.'
            ),
            'treatment': [
                'Apply systemic fungicides like Triadimefon (1 g/L) or Hexaconazole (2 mL/L).',
                'Spray at the first sign of orange pustules — early action is critical.',
                'Repeat fungicide application every 10-15 days during active infection.',
                'Combine fungicide sprays with neem oil (5 mL/L) for an integrated approach.'
            ],
            'prevention': [
                'Grow rust-resistant groundnut varieties (e.g., GPBD-4, ICGV 86590).',
                'Sow early in the season to avoid peak rust infection periods.',
                'Remove volunteer groundnut plants and crop residues after harvest.',
                'Avoid excessive nitrogen fertilizer — it makes plants more susceptible.'
            ]
        },

        # ── 4. ALTERNARIA LEAF SPOT ────────────────────────────────────
        'Alternaria_Leaf_Spot': {
            'causes': (
                'Caused by the fungus Alternaria alternata (and related species). '
                'Irregular brown lesions with concentric rings (target-board pattern) '
                'appear on leaves. The fungus survives in crop debris and spreads '
                'through wind and rain in warm, humid conditions.'
            ),
            'treatment': [
                'Apply copper-based fungicides (Copper Oxychloride 3 g/L) as foliar spray.',
                'Alternatively, use Mancozeb (2.5 g/L) or Iprodione for effective control.',
                'Remove and burn heavily infected plant parts to stop the spread.',
                'Apply fungicide within 48 hours of spotting the first symptoms.'
            ],
            'prevention': [
                'Maintain proper spacing between plants (30 × 10 cm) for good air flow.',
                'Avoid waterlogging — ensure fields have proper drainage.',
                'Use disease-free, certified seeds treated with Thiram (3 g/kg seed).',
                'Practice crop rotation with cereals and avoid continuous groundnut cropping.'
            ]
        }
    }

    # ── Look up the disease in our database ────────────────────────────
    if disease_name in disease_database:
        return disease_database[disease_name]
    else:
        # Fallback for an unknown disease name (shouldn't happen normally)
        return {
            'causes': 'Information not available for this disease.',
            'treatment': [
                'Consult your local agricultural extension officer for advice.',
                'Take a clear photo of the affected leaf and visit the nearest agri-clinic.',
                'Avoid applying any chemical without expert recommendation.'
            ],
            'prevention': [
                'Practice good field hygiene — remove debris after harvest.',
                'Use certified seeds and follow recommended planting practices.',
                'Monitor your crop regularly and act at the first sign of trouble.'
            ]
        }


# =============================================================================
# NEW MULTI-CROP PREDICTION SYSTEM
# =============================================================================

CROP_CLASSES = {
    'groundnut': ['Alternaria_Leaf_Spot', 'Healthy', 'Leaf_Spot_Early_and_Late', 'Rosette', 'Rust'],
    'potato': ['Bacteria', 'Fungi', 'Healthy', 'Nematode', 'Pest', 'Phytopthora', 'Virus'],
    'pepper': ['Pepper__bell___Bacterial_spot', 'Pepper__bell___healthy'],
    'tomato': ['Tomato_Bacterial_spot', 'Tomato_Early_blight', 'Tomato_Late_blight',
               'Tomato_Leaf_Mold', 'Tomato_Septoria_leaf_spot',
               'Tomato_Spider_mites_Two_spotted_spider_mite',
               'Tomato__Target_Spot', 'Tomato__Tomato_YellowLeaf__Curl_Virus',
               'Tomato__Tomato_mosaic_virus', 'Tomato_healthy']
}

CROP_MODEL_PATHS = {
    'groundnut': 'model/groundnut_model.keras',
    'potato': 'model/potato_model.keras',
    'pepper': 'model/pepper_model.keras',
    'tomato': 'model/tomato_model.keras'
}

MODEL_CACHE = {}

def load_crop_model(crop_name):
    if crop_name not in CROP_CLASSES:
        print("[ERROR] Invalid crop name: {}".format(crop_name))
        return None
    
    # Fast path: return cached model without lock
    if crop_name in MODEL_CACHE:
        return MODEL_CACHE[crop_name]
    
    with _model_lock:
        # Double-check after acquiring lock
        if crop_name in MODEL_CACHE:
            return MODEL_CACHE[crop_name]
        
        keras_path = CROP_MODEL_PATHS.get(crop_name)
        h5_path = keras_path.replace('.keras', '.h5')
        
        model_path_to_load = None
        if os.path.exists(keras_path):
            model_path_to_load = keras_path
        elif os.path.exists(h5_path):
            model_path_to_load = h5_path
            
        if not TENSORFLOW_AVAILABLE or not model_path_to_load:
            print("[INFO] Model for '{}' not found or TF not available, using DEMO mode.".format(crop_name))
            MODEL_CACHE[crop_name] = None  # Cache demo mode to avoid repeated filesystem checks
            return None
            
        try:
            load_start = time.time()
            model = tf.keras.models.load_model(model_path_to_load)
            load_time = (time.time() - load_start) * 1000
            print("[OK] Model loaded for '{}' from '{}' ({:.0f}ms).".format(crop_name, model_path_to_load, load_time))
            MODEL_CACHE[crop_name] = model
            return model
        except Exception as e:
            print("[ERROR] Error loading model for '{}': {}".format(crop_name, e))
            MODEL_CACHE[crop_name] = None  # Cache failure to avoid retrying
            return None

def predict_crop_disease(crop_name, image_path):
    start_time = time.time()
    
    model = load_crop_model(crop_name)
    classes = CROP_CLASSES.get(crop_name, DISEASE_CLASSES)
    
    if model is None:
        # DEMO MODE
        raw_scores = [random.uniform(0.01, 1.0) for _ in classes]
        total = sum(raw_scores)
        probabilities = [score / total for score in raw_scores]

        dominant_index = random.randint(0, len(classes) - 1)
        probabilities[dominant_index] = random.uniform(0.70, 0.97)

        remaining = 1.0 - probabilities[dominant_index]
        other_indices = [i for i in range(len(classes)) if i != dominant_index]
        for i in other_indices:
            probabilities[i] = remaining / len(other_indices)

        all_predictions = {}
        for i, class_name in enumerate(classes):
            all_predictions[class_name] = round(probabilities[i] * 100, 2)

        predicted_class = classes[dominant_index]
        confidence = round(probabilities[dominant_index] * 100, 2)
        print("[DEMO] Predicted: {} ({:.2f}%) for crop {}".format(predicted_class, confidence, crop_name))
    else:
        # REAL MODE
        pil_img = Image.open(image_path)
        img_array = preprocess_image(image_path)
        predictions = model(img_array, training=False)
        probabilities = predictions[0].numpy()

        predicted_index = int(np.argmax(probabilities))
        predicted_class = classes[predicted_index]
        confidence = round(float(probabilities[predicted_index]) * 100, 2)

        all_predictions = {}
        for i, class_name in enumerate(classes):
            all_predictions[class_name] = round(float(probabilities[i]) * 100, 2)

        print("\n=== [DEBUG] PREDICTION PIPELINE ===")
        print("Uploaded file:       {}".format(image_path))
        print("Image shape:         {}".format(pil_img.size))
        print("Image mode:          {}".format(pil_img.mode))
        print("Preprocessed shape:  {}".format(img_array.shape))
        print("Model:               {} (classes: {})".format(crop_name, len(classes)))
        print("Prediction array:    {}".format([round(float(p), 4) for p in probabilities]))
        print("Predicted index:     {}".format(predicted_index))
        print("Predicted class:     {}".format(predicted_class))
        print("Confidence:          {:.2f}%".format(confidence))
        print("===================================\n")
        
        print("[REAL] Predicted: {} ({:.2f}%) for crop {}".format(predicted_class, confidence, crop_name))
        
    prediction_time_ms = (time.time() - start_time) * 1000

    return {
        'disease': predicted_class,
        'confidence': confidence,
        'all_predictions': all_predictions,
        'crop': crop_name,
        'prediction_time_ms': prediction_time_ms
    }

DISEASE_DATABASE = {
    # Groundnut
    'Alternaria_Leaf_Spot': {
        'crop': 'groundnut',
        'display_name': 'Alternaria Leaf Spot',
        'description': 'Caused by the fungus Alternaria alternata. Irregular brown lesions with concentric rings appear on leaves. It survives in crop debris.',
        'symptoms': ['Irregular brown lesions', 'Concentric rings (target-board pattern) on leaves', 'Leaves drying up and dropping off'],
        'causes': 'Caused by the fungus Alternaria alternata in warm, humid conditions.',
        'prevention': ['Maintain proper spacing (30 × 10 cm)', 'Avoid waterlogging', 'Use disease-free certified seeds', 'Practice crop rotation with cereals'],
        'treatment': ['Apply copper-based fungicides (Copper Oxychloride 3 g/L)', 'Use Mancozeb (2.5 g/L)', 'Remove and burn infected plant parts', 'Apply fungicide within 48 hours of symptoms']
    },
    'Healthy': {
        'crop': 'any',
        'display_name': 'Healthy',
        'description': 'The plant appears healthy with no signs of disease.',
        'symptoms': ['None', 'Vibrant green leaves', 'Normal growth'],
        'causes': 'Optimal growing conditions and absence of pathogens.',
        'prevention': ['Continue good farming practices', 'Use certified seeds', 'Maintain field hygiene', 'Practice crop rotation'],
        'treatment': ['No treatment needed', 'Continue regular watering', 'Monitor leaves weekly', 'Maintain soil health']
    },
    'Leaf_Spot_Early_and_Late': {
        'crop': 'groundnut',
        'display_name': 'Leaf Spot (Early and Late)',
        'description': 'Caused by Cercospora arachidicola (early) and Cercosporidium personatum (late). Brown or black spots appear on leaves.',
        'symptoms': ['Brown or dark spots on upper leaf surface', 'Yellow halo around spots', 'Premature leaf drop'],
        'causes': 'Fungal infection thriving in warm, humid conditions.',
        'prevention': ['Crop rotation with non-host crops', 'Avoid overhead irrigation', 'Plant resistant varieties', 'Maintain proper plant spacing'],
        'treatment': ['Apply fungicides such as Mancozeb', 'Remove heavily infected leaves', 'Spray fungicide every 10-14 days', 'Use contact and systemic fungicides']
    },
    'Rosette': {
        'crop': 'groundnut',
        'display_name': 'Groundnut Rosette Disease',
        'description': 'A viral disease transmitted by aphids. Causes severe stunting of plants and yellowing of leaves.',
        'symptoms': ['Severe stunting', 'Yellowing of leaves', 'Curled or distorted leaves'],
        'causes': 'Viral infection transmitted by the groundnut aphid.',
        'prevention': ['Plant early in the season', 'Maintain high plant density', 'Remove volunteer plants', 'Use resistant varieties'],
        'treatment': ['Control aphid vectors with insecticides', 'Remove and destroy infected plants', 'No cure once infected', 'Apply systemic insecticides early']
    },
    'Rust': {
        'crop': 'groundnut',
        'display_name': 'Rust',
        'description': 'Caused by the fungus Puccinia arachidis. Orange-brown pustules appear on the underside of leaves.',
        'symptoms': ['Orange-brown pustules on leaf underside', 'Leaves turn brown and dry up', 'Pustules rupture releasing powdery spores'],
        'causes': 'Fungus Puccinia arachidis spreading via airborne spores.',
        'prevention': ['Grow rust-resistant varieties', 'Sow early', 'Remove crop residues', 'Avoid excessive nitrogen'],
        'treatment': ['Apply systemic fungicides (Triadimefon)', 'Spray at first sign of pustules', 'Repeat every 10-15 days', 'Combine with neem oil']
    },
    
    # Potato
    'Bacteria': {
        'crop': 'potato',
        'display_name': 'Bacterial Wilt',
        'description': 'Caused by Ralstonia solanacearum. Plants wilt rapidly even with adequate soil moisture.',
        'symptoms': ['Rapid wilting of leaves and stems', 'Stems may show brown discoloration inside', 'White bacterial ooze from cut stems'],
        'causes': 'Bacterial infection through roots or wounded plant parts.',
        'prevention': ['Use certified disease-free seed tubers', 'Practice 3-5 year crop rotation', 'Improve soil drainage', 'Sanitize farm equipment'],
        'treatment': ['Remove and destroy infected plants', 'No chemical cure available', 'Solarize soil if heavily infested', 'Apply bio-control agents preventatively']
    },
    'Fungi': {
        'crop': 'potato',
        'display_name': 'Fungal Blight (Early Blight)',
        'description': 'Caused by Alternaria solani. Dark, concentric spots appear on older leaves first.',
        'symptoms': ['Dark brown spots with concentric rings', 'Yellowing around spots', 'Leaves drying and dying'],
        'causes': 'Fungus spreading in warm, moist environments.',
        'prevention': ['Use disease-free seed', 'Avoid overhead irrigation', 'Provide adequate fertilization', 'Rotate crops with non-solanaceous plants'],
        'treatment': ['Apply protectant fungicides (Chlorothalonil)', 'Apply systemic fungicides', 'Spray early in the season', 'Remove infected debris']
    },
    'Nematode': {
        'crop': 'potato',
        'display_name': 'Potato Cyst Nematode',
        'description': 'Microscopic worms that feed on potato roots, causing poor growth and yield loss.',
        'symptoms': ['Stunted plant growth', 'Yellowing of leaves', 'Tiny white/yellow cysts on roots'],
        'causes': 'Infestation of Globodera species in the soil.',
        'prevention': ['Strict quarantine measures', 'Long crop rotations (up to 7 years)', 'Plant resistant varieties', 'Clean equipment to prevent soil spread'],
        'treatment': ['Apply nematicides before planting', 'Use trap crops', 'Solarize soil', 'Fumigate soil in severe cases']
    },
    'Pest': {
        'crop': 'potato',
        'display_name': 'Pest Infestation (Colorado Potato Beetle)',
        'description': 'Insects feeding on potato foliage, which can completely defoliate the plant.',
        'symptoms': ['Holes in leaves', 'Skeletonized leaves', 'Presence of larvae or adult beetles'],
        'causes': 'Insect pests multiplying rapidly in favorable conditions.',
        'prevention': ['Use row covers', 'Practice crop rotation', 'Encourage natural predators', 'Plant early to avoid peak pest populations'],
        'treatment': ['Hand-pick beetles and larvae', 'Apply Spinosad or Neem oil', 'Use specific chemical insecticides', 'Apply Bacillus thuringiensis (Bt) for larvae']
    },
    'Phytopthora': {
        'crop': 'potato',
        'display_name': 'Late Blight (Phytophthora)',
        'description': 'A devastating disease caused by Phytophthora infestans. Can destroy a crop in days under cool, wet conditions.',
        'symptoms': ['Water-soaked, dark green spots on leaves', 'White fungal growth on leaf underside', 'Brown, rot on tubers'],
        'causes': 'Oomycete pathogen thriving in cool, wet weather.',
        'prevention': ['Plant resistant varieties', 'Destroy volunteer potatoes', 'Ensure good soil drainage', 'Avoid late harvesting'],
        'treatment': ['Apply contact fungicides preventatively', 'Use systemic fungicides like Metalaxyl', 'Destroy infected vines before harvest', 'Harvest in dry conditions']
    },
    'Virus': {
        'crop': 'potato',
        'display_name': 'Potato Virus (PVY/PLRV)',
        'description': 'Viral diseases transmitted by aphids, causing mosaic patterns or leaf rolling.',
        'symptoms': ['Mottled or mosaic patterns on leaves', 'Rolling of leaves upward', 'Stunted growth and reduced yield'],
        'causes': 'Viruses transmitted by aphid vectors or infected seed tubers.',
        'prevention': ['Use certified virus-free seed', 'Control aphid populations', 'Remove (rogue) infected plants early', 'Avoid planting near infected fields'],
        'treatment': ['No chemical cure for viruses', 'Use insecticides to control vectors', 'Apply mineral oils to reduce transmission', 'Destroy heavily infected crops']
    },
    'Potato___Early_blight': {
        'crop': 'potato',
        'display_name': 'Early Blight',
        'description': 'Caused by Alternaria solani. Concentric dark rings (target spots) form on older leaves first.',
        'symptoms': ['Dark brown spots with concentric rings on older leaves', 'Yellow area around spots', 'Leaves wither and drop', 'Stem lesions possible'],
        'causes': 'Fungus Alternaria solani thriving in warm, humid conditions.',
        'prevention': ['Use disease-free certified seed tubers', 'Avoid overhead irrigation', 'Provide adequate fertilization', 'Rotate crops with non-solanaceous plants'],
        'treatment': ['Apply protectant fungicides (Chlorothalonil or Mancozeb)', 'Apply systemic fungicides', 'Spray early in the season', 'Remove infected debris']
    },
    'Potato___Late_blight': {
        'crop': 'potato',
        'display_name': 'Late Blight',
        'description': 'A devastating disease caused by Phytophthora infestans. Can destroy a crop in days under cool, wet conditions.',
        'symptoms': ['Water-soaked, dark green spots on leaves', 'White fungal growth on leaf underside', 'Brown, rot on tubers'],
        'causes': 'Oomycete pathogen thriving in cool, wet weather.',
        'prevention': ['Plant resistant varieties', 'Destroy volunteer potatoes', 'Ensure good soil drainage', 'Avoid late harvesting'],
        'treatment': ['Apply contact fungicides preventatively', 'Use systemic fungicides like Metalaxyl', 'Destroy infected vines before harvest', 'Harvest in dry conditions']
    },
    'Potato___healthy': {
        'crop': 'potato',
        'display_name': 'Healthy',
        'description': 'No signs of disease. The potato plant appears normal with healthy foliage and growth.',
        'symptoms': ['Vibrant green leaves', 'No spots or lesions', 'Normal vigorous growth'],
        'causes': 'Optimal growing conditions and absence of pathogens.',
        'prevention': ['Continue good farming practices', 'Use certified disease-free seed', 'Maintain field hygiene', 'Practice crop rotation'],
        'treatment': ['No treatment needed', 'Continue regular watering', 'Monitor leaves weekly', 'Maintain soil health']
    },
    
    # Pepper (Bell Pepper)
    'Pepper__bell___Bacterial_spot': {
        'crop': 'pepper',
        'display_name': 'Bacterial Spot',
        'description': 'Caused by Xanthomonas campestris. Water-soaked spots appear on leaves, stems, and fruit.',
        'symptoms': ['Small, dark, water-soaked spots on leaves', 'Spots enlarge and turn brown with yellow halo', 'Leaf drop in severe cases', 'Raised scab-like spots on fruit'],
        'causes': 'Bacterial infection (Xanthomonas campestris pv. vesicatoria) spread by rain splash and contaminated seeds.',
        'prevention': ['Use certified disease-free seeds', 'Avoid overhead irrigation', 'Practice crop rotation (2-3 years)', 'Remove infected plant debris'],
        'treatment': ['Apply copper-based bactericides', 'Spray Streptomycin if permitted', 'Remove heavily infected plants', 'Improve air circulation around plants']
    },
    'Pepper__bell___healthy': {
        'crop': 'pepper',
        'display_name': 'Healthy',
        'description': 'The pepper plant appears healthy with no signs of disease.',
        'symptoms': ['Vibrant green leaves', 'No spots or lesions', 'Normal growth and fruit development'],
        'causes': 'Optimal growing conditions and absence of pathogens.',
        'prevention': ['Continue good farming practices', 'Use certified seeds', 'Maintain field hygiene', 'Practice crop rotation'],
        'treatment': ['No treatment needed', 'Continue regular watering', 'Monitor leaves weekly', 'Maintain soil health']
    },

    # Tomato
    'Tomato_Bacterial_spot': {
        'crop': 'tomato',
        'display_name': 'Bacterial Spot',
        'description': 'Caused by Xanthomonas species. Small, dark, water-soaked lesions appear on leaves and fruit.',
        'symptoms': ['Small dark spots on leaves', 'Spots may have yellow halo', 'Leaf yellowing and drop', 'Raised scabby spots on fruit'],
        'causes': 'Bacterial infection spread by rain splash, overhead irrigation, and contaminated seeds.',
        'prevention': ['Use disease-free seeds and transplants', 'Avoid overhead watering', 'Rotate crops for 2-3 years', 'Remove crop debris after harvest'],
        'treatment': ['Apply copper-based sprays', 'Use copper + mancozeb combination', 'Remove heavily infected plants', 'Avoid working in wet fields']
    },
    'Tomato_Early_blight': {
        'crop': 'tomato',
        'display_name': 'Early Blight',
        'description': 'Caused by Alternaria solani. Concentric dark rings (target spots) form on older leaves first.',
        'symptoms': ['Dark concentric ring spots on lower leaves', 'Yellow area around spots', 'Leaves wither and drop', 'Stem lesions possible'],
        'causes': 'Fungus Alternaria solani thriving in warm, humid conditions with heavy dew.',
        'prevention': ['Stake plants for air circulation', 'Mulch around base', 'Water at soil level', 'Remove lower infected leaves'],
        'treatment': ['Apply chlorothalonil or mancozeb fungicides', 'Spray copper-based fungicides', 'Remove infected leaves promptly', 'Apply fungicide every 7-10 days in wet weather']
    },
    'Tomato_Late_blight': {
        'crop': 'tomato',
        'display_name': 'Late Blight',
        'description': 'Caused by Phytophthora infestans. Can devastate entire crops rapidly in cool, wet conditions.',
        'symptoms': ['Large, irregularly shaped, water-soaked lesions', 'White fuzzy mold on leaf undersides', 'Dark brown firm rot on fruit', 'Rapid plant collapse'],
        'causes': 'Oomycete Phytophthora infestans favored by cool (15-22°C), wet weather.',
        'prevention': ['Destroy volunteer plants', 'Provide good air circulation', 'Avoid overhead irrigation', 'Use resistant varieties'],
        'treatment': ['Apply systemic fungicides (Metalaxyl)', 'Spray preventive copper fungicides', 'Destroy infected plants immediately', 'Harvest remaining fruit quickly']
    },
    'Tomato_Leaf_Mold': {
        'crop': 'tomato',
        'display_name': 'Leaf Mold',
        'description': 'Caused by Passalora fulva (Cladosporium fulvum). Mainly affects greenhouse tomatoes.',
        'symptoms': ['Pale green to yellow spots on upper leaf surface', 'Olive-green to brown velvety mold on underside', 'Leaves curl and wither', 'Reduced fruit set'],
        'causes': 'Fungus Passalora fulva thriving in high humidity (>85%) and moderate temperatures.',
        'prevention': ['Improve greenhouse ventilation', 'Reduce humidity below 85%', 'Space plants adequately', 'Use resistant varieties'],
        'treatment': ['Improve air circulation immediately', 'Apply fungicides (chlorothalonil)', 'Remove severely affected leaves', 'Reduce watering frequency']
    },
    'Tomato_Septoria_leaf_spot': {
        'crop': 'tomato',
        'display_name': 'Septoria Leaf Spot',
        'description': 'Caused by Septoria lycopersici. Small circular spots with dark borders and gray centers.',
        'symptoms': ['Numerous small circular spots (1-3mm)', 'Dark brown borders with gray/tan centers', 'Tiny black dots (pycnidia) in spot centers', 'Lower leaves affected first'],
        'causes': 'Fungus Septoria lycopersici spread by rain splash and overhead irrigation.',
        'prevention': ['Mulch around plants', 'Avoid overhead watering', 'Rotate crops for 3 years', 'Remove infected plant debris'],
        'treatment': ['Apply fungicides (chlorothalonil or copper)', 'Remove lower infected leaves', 'Spray at first sign of disease', 'Continue treatment every 7-14 days']
    },
    'Tomato_Spider_mites_Two_spotted_spider_mite': {
        'crop': 'tomato',
        'display_name': 'Spider Mite Damage',
        'description': 'Caused by Tetranychus urticae. Tiny mites feed on leaf cells causing stippling and webbing.',
        'symptoms': ['Fine stippling/speckling on leaves', 'Yellowing and bronzing of leaves', 'Fine webbing on undersides', 'Leaf drop in severe cases'],
        'causes': 'Infestation by two-spotted spider mites, favored by hot, dry conditions.',
        'prevention': ['Maintain adequate humidity', 'Avoid dusty conditions', 'Introduce predatory mites', 'Keep plants well-watered'],
        'treatment': ['Spray with strong water jet to dislodge mites', 'Apply insecticidal soap or neem oil', 'Use miticides (abamectin)', 'Release predatory mites (Phytoseiulus persimilis)']
    },
    'Tomato__Target_Spot': {
        'crop': 'tomato',
        'display_name': 'Target Spot',
        'description': 'Caused by Corynespora cassiicola. Concentric ring patterns appear on leaves, stems, and fruit.',
        'symptoms': ['Small brown spots with concentric rings', 'Spots enlarge up to 1cm', 'Leaf yellowing around spots', 'Fruit lesions with sunken centers'],
        'causes': 'Fungus Corynespora cassiicola thriving in warm, humid environments.',
        'prevention': ['Improve air circulation', 'Avoid overhead irrigation', 'Remove crop debris', 'Practice crop rotation'],
        'treatment': ['Apply fungicides (azoxystrobin or chlorothalonil)', 'Remove infected leaves', 'Spray preventively in wet seasons', 'Ensure good plant spacing']
    },
    'Tomato__Tomato_YellowLeaf__Curl_Virus': {
        'crop': 'tomato',
        'display_name': 'Yellow Leaf Curl Virus (TYLCV)',
        'description': 'A devastating viral disease transmitted by whiteflies (Bemisia tabaci).',
        'symptoms': ['Upward curling and cupping of leaves', 'Yellowing of leaf margins', 'Severe stunting of plant', 'Flower drop and reduced fruit set'],
        'causes': 'Tomato Yellow Leaf Curl Virus transmitted by silverleaf whitefly vectors.',
        'prevention': ['Use whitefly-resistant varieties', 'Install insect-proof netting', 'Control whitefly populations', 'Remove infected plants immediately'],
        'treatment': ['No cure once infected — remove plants', 'Control whitefly vectors with imidacloprid', 'Use yellow sticky traps for monitoring', 'Apply neem oil to reduce whitefly populations']
    },
    'Tomato__Tomato_mosaic_virus': {
        'crop': 'tomato',
        'display_name': 'Tomato Mosaic Virus (ToMV)',
        'description': 'A highly contagious virus that causes mottled patterns and distorted growth.',
        'symptoms': ['Light and dark green mosaic patterns on leaves', 'Leaf curling and distortion', 'Stunted plant growth', 'Reduced and distorted fruit'],
        'causes': 'Tomato Mosaic Virus spread mechanically through contaminated tools, hands, and seeds.',
        'prevention': ['Use virus-free seeds', 'Disinfect tools with 10% bleach solution', 'Wash hands before handling plants', 'Use resistant varieties'],
        'treatment': ['No chemical cure available', 'Remove and destroy infected plants', 'Disinfect all tools and stakes', 'Do not smoke near plants (tobacco mosaic cross-infection)']
    },
    'Tomato_healthy': {
        'crop': 'tomato',
        'display_name': 'Healthy',
        'description': 'The tomato plant appears healthy with no signs of disease or pest damage.',
        'symptoms': ['Vibrant green foliage', 'No spots, lesions, or discoloration', 'Normal fruit development'],
        'causes': 'Optimal growing conditions and absence of pathogens.',
        'prevention': ['Continue good farming practices', 'Rotate crops regularly', 'Monitor for early signs of disease', 'Maintain balanced nutrition'],
        'treatment': ['No treatment needed', 'Continue regular care', 'Monitor weekly for changes', 'Maintain consistent watering']
    }
}

# =============================================================================
# HINDI DISEASE DATABASE — हिन्दी रोग डेटाबेस
# =============================================================================
DISEASE_DATABASE_HI = {
    'Alternaria_Leaf_Spot': {
        'crop': 'groundnut', 'display_name': 'अल्टरनेरिया पत्ती धब्बा',
        'description': 'अल्टरनेरिया अल्टरनाटा कवक के कारण होता है। पत्तियों पर समकेंद्रित वलयों वाले अनियमित भूरे घाव दिखाई देते हैं। यह फसल अवशेषों में जीवित रहता है।',
        'symptoms': ['अनियमित भूरे घाव', 'पत्तियों पर समकेंद्रित वलय (लक्ष्य-पैटर्न)', 'पत्तियों का सूखना और गिरना'],
        'causes': 'गर्म, नम परिस्थितियों में अल्टरनेरिया अल्टरनाटा कवक के कारण।',
        'prevention': ['उचित अंतर (30 × 10 सेमी) बनाए रखें', 'जलभराव से बचें', 'रोग-मुक्त प्रमाणित बीज का उपयोग करें', 'अनाज फसलों के साथ फसल चक्र अपनाएं'],
        'treatment': ['कॉपर-आधारित कवकनाशी (कॉपर ऑक्सीक्लोराइड 3 ग्राम/लीटर) लगाएं', 'मैनकोज़ेब (2.5 ग्राम/लीटर) का उपयोग करें', 'संक्रमित पौधों के हिस्से हटाकर जलाएं', 'लक्षण दिखने के 48 घंटे के भीतर कवकनाशी लगाएं']
    },
    'Healthy': {
        'crop': 'any', 'display_name': 'स्वस्थ',
        'description': 'पौधा स्वस्थ दिखाई देता है, रोग का कोई लक्षण नहीं।',
        'symptoms': ['कोई नहीं', 'जीवंत हरी पत्तियाँ', 'सामान्य वृद्धि'],
        'causes': 'अनुकूल बढ़ती परिस्थितियाँ और रोगजनकों की अनुपस्थिति।',
        'prevention': ['अच्छी खेती पद्धतियाँ जारी रखें', 'प्रमाणित बीज का उपयोग करें', 'खेत की स्वच्छता बनाए रखें', 'फसल चक्र अपनाएं'],
        'treatment': ['कोई उपचार आवश्यक नहीं', 'नियमित सिंचाई जारी रखें', 'साप्ताहिक पत्तियों की निगरानी करें', 'मिट्टी का स्वास्थ्य बनाए रखें']
    },
    'Leaf_Spot_Early_and_Late': {
        'crop': 'groundnut', 'display_name': 'पत्ती धब्बा (प्रारंभिक और देर से)',
        'description': 'सर्कोस्पोरा एराकिडिकोला (प्रारंभिक) और सर्कोस्पोरिडियम पर्सोनेटम (देर से) के कारण। पत्तियों पर भूरे या काले धब्बे दिखाई देते हैं।',
        'symptoms': ['पत्ती की ऊपरी सतह पर भूरे या काले धब्बे', 'धब्बों के चारों ओर पीला हाला', 'समय से पहले पत्ती गिरना'],
        'causes': 'गर्म, नम परिस्थितियों में पनपने वाला कवक संक्रमण।',
        'prevention': ['गैर-मेज़बान फसलों के साथ फसल चक्र अपनाएं', 'ऊपरी सिंचाई से बचें', 'प्रतिरोधी किस्में लगाएं', 'उचित पौधों का अंतर बनाए रखें'],
        'treatment': ['मैनकोज़ेब जैसे कवकनाशी लगाएं', 'भारी संक्रमित पत्तियाँ हटाएं', 'हर 10-14 दिन में कवकनाशी स्प्रे करें', 'संपर्क और प्रणालीगत कवकनाशी का उपयोग करें']
    },
    'Rosette': {
        'crop': 'groundnut', 'display_name': 'रोज़ेट रोग',
        'description': 'एफिड्स द्वारा प्रसारित वायरल रोग। पौधों का गंभीर बौनापन और पत्तियों का पीलापन होता है।',
        'symptoms': ['गंभीर बौनापन', 'पत्तियों का पीलापन', 'मुड़ी या विकृत पत्तियाँ'],
        'causes': 'मूंगफली एफिड द्वारा प्रसारित वायरल संक्रमण।',
        'prevention': ['मौसम में जल्दी बुआई करें', 'उच्च पौधा घनत्व बनाए रखें', 'स्वयंसेवी पौधे हटाएं', 'प्रतिरोधी किस्मों का उपयोग करें'],
        'treatment': ['कीटनाशकों से एफिड वाहकों को नियंत्रित करें', 'संक्रमित पौधे हटाकर नष्ट करें', 'एक बार संक्रमित होने पर कोई इलाज नहीं', 'जल्दी प्रणालीगत कीटनाशक लगाएं']
    },
    'Rust': {
        'crop': 'groundnut', 'display_name': 'रतुआ रोग',
        'description': 'पुसीनिया एराकिडिस कवक के कारण। पत्तियों के निचले हिस्से पर नारंगी-भूरे रंग के दाने दिखाई देते हैं।',
        'symptoms': ['पत्ती के निचले हिस्से पर नारंगी-भूरे दाने', 'पत्तियाँ भूरी होकर सूख जाती हैं', 'दाने फटकर पाउडर जैसे बीजाणु छोड़ते हैं'],
        'causes': 'हवा से फैलने वाले बीजाणुओं से पुसीनिया एराकिडिस कवक का प्रसार।',
        'prevention': ['रतुआ प्रतिरोधी किस्में उगाएं', 'जल्दी बुआई करें', 'फसल अवशेष हटाएं', 'अत्यधिक नाइट्रोजन से बचें'],
        'treatment': ['प्रणालीगत कवकनाशी (ट्रायडिमेफॉन) लगाएं', 'दानों के पहले लक्षण पर स्प्रे करें', 'हर 10-15 दिन दोहराएं', 'नीम तेल के साथ मिलाएं']
    },
    'Bacteria': {
        'crop': 'potato', 'display_name': 'बैक्टीरियल विल्ट',
        'description': 'राल्स्टोनिया सोलानेसीरम के कारण। पर्याप्त मिट्टी नमी होने पर भी पौधे तेजी से मुरझाते हैं।',
        'symptoms': ['पत्तियों और तनों का तेजी से मुरझाना', 'तने के अंदर भूरा रंग दिखना', 'कटे तने से सफेद बैक्टीरियल रिसाव'],
        'causes': 'जड़ों या घायल पौधों के हिस्सों से बैक्टीरियल संक्रमण।',
        'prevention': ['प्रमाणित रोग-मुक्त बीज कंदों का उपयोग करें', '3-5 साल का फसल चक्र अपनाएं', 'मिट्टी की जल निकासी सुधारें', 'खेती उपकरण साफ करें'],
        'treatment': ['संक्रमित पौधे हटाकर नष्ट करें', 'कोई रासायनिक इलाज उपलब्ध नहीं', 'भारी संक्रमित मिट्टी को सोलराइज़ करें', 'जैव-नियंत्रण एजेंटों का निवारक उपयोग करें']
    },
    'Fungi': {
        'crop': 'potato', 'display_name': 'कवक ब्लाइट (अर्ली ब्लाइट)',
        'description': 'अल्टरनेरिया सोलानी के कारण। पुरानी पत्तियों पर पहले गहरे, समकेंद्रित धब्बे दिखाई देते हैं।',
        'symptoms': ['समकेंद्रित वलयों वाले गहरे भूरे धब्बे', 'धब्बों के चारों ओर पीलापन', 'पत्तियाँ सूखना और मरना'],
        'causes': 'गर्म, नम वातावरण में फैलने वाला कवक।',
        'prevention': ['रोग-मुक्त बीज का उपयोग करें', 'ऊपरी सिंचाई से बचें', 'पर्याप्त उर्वरीकरण करें', 'गैर-सोलानेसी पौधों के साथ फसल चक्र करें'],
        'treatment': ['सुरक्षात्मक कवकनाशी (क्लोरोथैलोनिल) लगाएं', 'प्रणालीगत कवकनाशी लगाएं', 'मौसम की शुरुआत में स्प्रे करें', 'संक्रमित अवशेष हटाएं']
    },
    'Nematode': {
        'crop': 'potato', 'display_name': 'आलू सिस्ट नेमाटोड',
        'description': 'सूक्ष्म कीड़े जो आलू की जड़ों पर खाते हैं, खराब वृद्धि और उपज हानि का कारण बनते हैं।',
        'symptoms': ['बौनी पौधा वृद्धि', 'पत्तियों का पीलापन', 'जड़ों पर छोटे सफेद/पीले सिस्ट'],
        'causes': 'मिट्टी में ग्लोबोडेरा प्रजातियों का संक्रमण।',
        'prevention': ['सख्त संगरोध उपाय', 'लंबा फसल चक्र (7 साल तक)', 'प्रतिरोधी किस्में लगाएं', 'मिट्टी फैलाव रोकने के लिए उपकरण साफ करें'],
        'treatment': ['बुआई से पहले नेमाटिसाइड लगाएं', 'जाल फसलों का उपयोग करें', 'मिट्टी को सोलराइज़ करें', 'गंभीर मामलों में मिट्टी को धूमित करें']
    },
    'Pest': {
        'crop': 'potato', 'display_name': 'कीट संक्रमण',
        'description': 'आलू की पत्तियों पर खाने वाले कीड़े, जो पौधे को पूरी तरह पत्तीहीन कर सकते हैं।',
        'symptoms': ['पत्तियों में छेद', 'पत्तियों का कंकाल बनना', 'लार्वा या वयस्क भृंगों की उपस्थिति'],
        'causes': 'अनुकूल परिस्थितियों में तेजी से बढ़ने वाले कीट।',
        'prevention': ['पंक्ति कवर का उपयोग करें', 'फसल चक्र अपनाएं', 'प्राकृतिक शिकारियों को प्रोत्साहित करें', 'चरम कीट आबादी से बचने के लिए जल्दी लगाएं'],
        'treatment': ['भृंगों और लार्वा को हाथ से चुनें', 'स्पिनोसैड या नीम तेल लगाएं', 'विशिष्ट रासायनिक कीटनाशकों का उपयोग करें', 'लार्वा के लिए बैसिलस थुरिंगिएंसिस (Bt) लगाएं']
    },
    'Phytopthora': {
        'crop': 'potato', 'display_name': 'लेट ब्लाइट (फाइटोफ्थोरा)',
        'description': 'फाइटोफ्थोरा इंफेस्टांस के कारण विनाशकारी रोग। ठंडी, गीली परिस्थितियों में कुछ दिनों में फसल नष्ट कर सकता है।',
        'symptoms': ['पत्तियों पर पानी से भीगे, गहरे हरे धब्बे', 'पत्ती के निचले हिस्से पर सफेद कवक वृद्धि', 'कंदों पर भूरी सड़न'],
        'causes': 'ठंडे, गीले मौसम में पनपने वाला ऊमाइसीट रोगजनक।',
        'prevention': ['प्रतिरोधी किस्में लगाएं', 'स्वयंसेवी आलू नष्ट करें', 'अच्छी मिट्टी जल निकासी सुनिश्चित करें', 'देर से कटाई से बचें'],
        'treatment': ['निवारक संपर्क कवकनाशी लगाएं', 'मेटालैक्सिल जैसे प्रणालीगत कवकनाशी लगाएं', 'कटाई से पहले संक्रमित बेलें नष्ट करें', 'सूखी परिस्थितियों में कटाई करें']
    },
    'Virus': {
        'crop': 'potato', 'display_name': 'आलू वायरस (PVY/PLRV)',
        'description': 'एफिड्स द्वारा प्रसारित वायरल रोग, मोज़ेक पैटर्न या पत्ती मुड़ने का कारण बनता है।',
        'symptoms': ['पत्तियों पर मोज़ेक या धब्बेदार पैटर्न', 'पत्तियों का ऊपर की ओर मुड़ना', 'बौनी वृद्धि और कम उपज'],
        'causes': 'एफिड वाहकों या संक्रमित बीज कंदों द्वारा प्रसारित वायरस।',
        'prevention': ['प्रमाणित वायरस-मुक्त बीज का उपयोग करें', 'एफिड आबादी नियंत्रित करें', 'संक्रमित पौधे जल्दी हटाएं', 'संक्रमित खेतों के पास बुआई से बचें'],
        'treatment': ['वायरस का कोई रासायनिक इलाज नहीं', 'वाहकों को नियंत्रित करने के लिए कीटनाशक लगाएं', 'संचरण कम करने के लिए खनिज तेल लगाएं', 'भारी संक्रमित फसलों को नष्ट करें']
    },
    'Potato___Early_blight': {
        'crop': 'potato', 'display_name': 'अर्ली ब्लाइट',
        'description': 'Alternaria solani कवक के कारण होता है। पुरानी पत्तियों पर पहले समकेंद्रित गहरे वलय (टारगेट स्पॉट्स) दिखाई देते हैं।',
        'symptoms': ['पुरानी पत्तियों पर समकेंद्रित वलयों वाले गहरे भूरे धब्बे', 'धब्बों के चारों ओर पीलापन', 'पत्तियाँ सूखना और गिरना', 'तने पर भी घाव संभव'],
        'causes': 'गर्म, नम परिस्थितियों में पनपने वाला Alternaria solani कवक।',
        'prevention': ['प्रमाणित रोग-मुक्त बीज का उपयोग करें', 'ऊपरी सिंचाई से बचें', 'संतुलित उर्वरीकरण करें', 'गैर-सोलानेसी फसलों के साथ फसल चक्र अपनाएं'],
        'treatment': ['क्लोरोथैलोनिल या मैनकोज़ेब कवकनाशी का छिड़काव करें', 'प्रणालीगत कवकनाशी स्प्रे करें', 'लक्षण दिखते ही स्प्रे करें', 'संक्रमित अवशेष हटाएं']
    },
    'Potato___Late_blight': {
        'crop': 'potato', 'display_name': 'लेट ब्लाइट',
        'description': 'Phytophthora infestans कवक के कारण विनाशकारी रोग। ठंडी, गीली परिस्थितियों में कुछ दिनों में फसल नष्ट कर सकता है।',
        'symptoms': ['पत्तियों पर पानी से भीगे, गहरे हरे धब्बे', 'पत्ती के निचले हिस्से पर सफेद कवक वृद्धि', 'कंदों पर भूरी सड़न'],
        'causes': 'ठंडे, गीले मौसम में पनपने वाला Phytophthora infestans रोगजनक।',
        'prevention': ['प्रतिरोधी किस्में लगाएं', 'स्वयंसेवी पौधे नष्ट करें', 'अच्छी मिट्टी जल निकासी रखें', 'देर से कटाई से बचें'],
        'treatment': ['निवारक संपर्क कवकनाशी लगाएं', 'मेटालैक्सिल जैसे प्रणालीगत कवकनाशी लगाएं', 'कटाई से पहले संक्रमित बेलें नष्ट करें', 'सूखी परिस्थितियों में कटाई करें']
    },
    'Potato___healthy': {
        'crop': 'potato', 'display_name': 'स्वस्थ',
        'description': 'रोग का कोई लक्षण नहीं। आलू का पौधा सामान्य और स्वस्थ पत्तियों के साथ दिखाई देता है।',
        'symptoms': ['जीवंत हरी पत्तियाँ', 'कोई धब्बे या घाव नहीं', 'सामान्य सशक्त वृद्धि'],
        'causes': 'अनुकूल बढ़ती परिस्थितियाँ और रोगजनकों की अनुपस्थिति।',
        'prevention': ['अच्छी खेती पद्धतियाँ जारी रखें', 'प्रमाणित बीज का उपयोग करें', 'खेत की स्वच्छता बनाए रखें', 'फसल चक्र अपनाएं'],
        'treatment': ['कोई उपचार आवश्यक नहीं', 'नियमित सिंचाई जारी रखें', 'साप्ताहिक पत्तियों की निगरानी करें', 'मिट्टी का स्वास्थ्य बनाए रखें']
    },
    'Pepper__bell___Bacterial_spot': {
        'crop': 'pepper', 'display_name': 'बैक्टीरियल स्पॉट',
        'description': 'ज़ैंथोमोनास कैम्पेस्ट्रिस के कारण। पत्तियों, तनों और फलों पर पानी से भीगे धब्बे दिखाई देते हैं।',
        'symptoms': ['पत्तियों पर छोटे, गहरे, पानी से भीगे धब्बे', 'धब्बे बड़े होकर पीले हालो के साथ भूरे होते हैं', 'गंभीर मामलों में पत्ती गिरना', 'फलों पर उभरे पपड़ीदार धब्बे'],
        'causes': 'बारिश की बूंदों और दूषित बीजों से फैलने वाला बैक्टीरियल संक्रमण।',
        'prevention': ['प्रमाणित रोग-मुक्त बीज का उपयोग करें', 'ऊपरी सिंचाई से बचें', 'फसल चक्र (2-3 साल) अपनाएं', 'संक्रमित पौधों के अवशेष हटाएं'],
        'treatment': ['कॉपर-आधारित जीवाणुनाशक लगाएं', 'अनुमति हो तो स्ट्रेप्टोमाइसिन स्प्रे करें', 'भारी संक्रमित पौधे हटाएं', 'पौधों के चारों ओर वायु संचार सुधारें']
    },
    'Pepper__bell___healthy': {
        'crop': 'pepper', 'display_name': 'स्वस्थ',
        'description': 'मिर्च का पौधा स्वस्थ दिखाई देता है, रोग का कोई लक्षण नहीं।',
        'symptoms': ['जीवंत हरी पत्तियाँ', 'कोई धब्बे या घाव नहीं', 'सामान्य वृद्धि और फल विकास'],
        'causes': 'अनुकूल बढ़ती परिस्थितियाँ और रोगजनकों की अनुपस्थिति।',
        'prevention': ['अच्छी खेती पद्धतियाँ जारी रखें', 'प्रमाणित बीज का उपयोग करें', 'खेत की स्वच्छता बनाए रखें', 'फसल चक्र अपनाएं'],
        'treatment': ['कोई उपचार आवश्यक नहीं', 'नियमित सिंचाई जारी रखें', 'साप्ताहिक पत्तियों की निगरानी करें', 'मिट्टी का स्वास्थ्य बनाए रखें']
    },
    'Tomato_Bacterial_spot': {
        'crop': 'tomato', 'display_name': 'बैक्टीरियल स्पॉट',
        'description': 'ज़ैंथोमोनास प्रजातियों के कारण। पत्तियों और फलों पर छोटे, गहरे, पानी से भीगे घाव दिखाई देते हैं।',
        'symptoms': ['पत्तियों पर छोटे गहरे धब्बे', 'धब्बों पर पीला हाला हो सकता है', 'पत्ती पीली होकर गिरना', 'फलों पर उभरे पपड़ीदार धब्बे'],
        'causes': 'बारिश की बूंदों, ऊपरी सिंचाई और दूषित बीजों से फैलने वाला बैक्टीरियल संक्रमण।',
        'prevention': ['रोग-मुक्त बीज और रोपाई का उपयोग करें', 'ऊपरी सिंचाई से बचें', '2-3 साल फसल चक्र अपनाएं', 'कटाई के बाद फसल अवशेष हटाएं'],
        'treatment': ['कॉपर-आधारित स्प्रे लगाएं', 'कॉपर + मैनकोज़ेब मिश्रण का उपयोग करें', 'भारी संक्रमित पौधे हटाएं', 'गीले खेतों में काम करने से बचें']
    },
    'Tomato_Early_blight': {
        'crop': 'tomato', 'display_name': 'अर्ली ब्लाइट',
        'description': 'Alternaria solani कवक के कारण होता है। पुरानी पत्तियों पर पहले समकेंद्रित गहरे वलय (टारगेट स्पॉट्स) दिखाई देते हैं।',
        'symptoms': ['निचली पत्तियों पर गहरे समकेंद्रित वलय वाले धब्बे', 'धब्बों के चारों ओर पीला क्षेत्र', 'पत्तियाँ मुरझाकर गिरती हैं', 'तने पर भी घाव संभव हैं'],
        'causes': 'गर्म, नम परिस्थितियों और भारी ओस में Alternaria solani कवक का प्रकोप बढ़ता है।',
        'prevention': ['वायु संचार के लिए पौधों को सहारा दें', 'आधार के चारों ओर मल्चिंग करें', 'मिट्टी स्तर पर पानी दें (ऊपर से छिड़काव से बचें)', 'निचली संक्रमित पत्तियां तुरंत हटाएं'],
        'treatment': ['Chlorothalonil या Mancozeb कवकनाशी का छिड़काव करें', 'कॉपर-आधारित कवकनाशी स्प्रे करें', 'संक्रमित पत्तियां तुरंत हटाएं', 'गीले मौसम में हर 7-10 दिन पर उपचार जारी रखें']
    },
    'Tomato_Late_blight': {
        'crop': 'tomato', 'display_name': 'लेट ब्लाइट',
        'description': 'फाइटोफ्थोरा इंफेस्टांस के कारण। ठंडी, गीली परिस्थितियों में पूरी फसल तेजी से नष्ट कर सकता है।',
        'symptoms': ['बड़े, अनियमित आकार के, पानी से भीगे घाव', 'पत्ती के निचले हिस्से पर सफेद रोएंदार फफूंद', 'फलों पर गहरी भूरी सख्त सड़न', 'तेजी से पौधा गिरना'],
        'causes': 'ठंडे (15-22°C), गीले मौसम में पनपने वाला ऊमाइसीट फाइटोफ्थोरा इंफेस्टांस।',
        'prevention': ['स्वयंसेवी पौधे नष्ट करें', 'अच्छा वायु संचार प्रदान करें', 'ऊपरी सिंचाई से बचें', 'प्रतिरोधी किस्मों का उपयोग करें'],
        'treatment': ['प्रणालीगत कवकनाशी (मेटालैक्सिल) लगाएं', 'निवारक कॉपर कवकनाशी स्प्रे करें', 'संक्रमित पौधे तुरंत नष्ट करें', 'शेष फल जल्दी तोड़ लें']
    },
    'Tomato_Leaf_Mold': {
        'crop': 'tomato', 'display_name': 'पत्ती फफूंद',
        'description': 'पासालोरा फुल्वा (क्लैडोस्पोरियम फुल्वम) के कारण। मुख्य रूप से ग्रीनहाउस टमाटरों को प्रभावित करता है।',
        'symptoms': ['ऊपरी पत्ती की सतह पर हल्के हरे से पीले धब्बे', 'निचले हिस्से पर जैतूनी-हरे से भूरे मखमली फफूंद', 'पत्तियाँ मुड़कर मुरझाना', 'फल लगने में कमी'],
        'causes': 'उच्च आर्द्रता (>85%) और मध्यम तापमान में पनपने वाला पासालोरा फुल्वा कवक।',
        'prevention': ['ग्रीनहाउस वेंटिलेशन सुधारें', 'आर्द्रता 85% से नीचे रखें', 'पौधों को पर्याप्त दूरी पर लगाएं', 'प्रतिरोधी किस्मों का उपयोग करें'],
        'treatment': ['तुरंत वायु संचार सुधारें', 'कवकनाशी (क्लोरोथैलोनिल) लगाएं', 'भारी प्रभावित पत्तियाँ हटाएं', 'सिंचाई की आवृत्ति कम करें']
    },
    'Tomato_Septoria_leaf_spot': {
        'crop': 'tomato', 'display_name': 'सेप्टोरिया पत्ती धब्बा',
        'description': 'सेप्टोरिया लाइकोपर्सिसी के कारण। गहरे किनारों और भूरे केंद्रों वाले छोटे गोलाकार धब्बे।',
        'symptoms': ['कई छोटे गोलाकार धब्बे (1-3 मिमी)', 'गहरे भूरे किनारे और भूरे/कत्थई केंद्र', 'धब्बों के केंद्र में छोटे काले बिंदु (पिक्निडिया)', 'निचली पत्तियाँ पहले प्रभावित'],
        'causes': 'बारिश की बूंदों और ऊपरी सिंचाई से फैलने वाला सेप्टोरिया लाइकोपर्सिसी कवक।',
        'prevention': ['पौधों के चारों ओर मल्चिंग करें', 'ऊपरी सिंचाई से बचें', '3 साल फसल चक्र अपनाएं', 'संक्रमित पौधों के अवशेष हटाएं'],
        'treatment': ['कवकनाशी (क्लोरोथैलोनिल या कॉपर) लगाएं', 'निचली संक्रमित पत्तियाँ हटाएं', 'रोग के पहले लक्षण पर स्प्रे करें', 'हर 7-14 दिन उपचार जारी रखें']
    },
    'Tomato_Spider_mites_Two_spotted_spider_mite': {
        'crop': 'tomato', 'display_name': 'मकड़ी माइट क्षति',
        'description': 'टेट्रानिकस उर्टिके के कारण। सूक्ष्म माइट पत्ती की कोशिकाओं पर खाते हैं जिससे धब्बे और जाले बनते हैं।',
        'symptoms': ['पत्तियों पर बारीक धब्बे/छिड़काव', 'पत्तियों का पीला और कांस्य रंग होना', 'निचले हिस्से पर बारीक जाले', 'गंभीर मामलों में पत्ती गिरना'],
        'causes': 'गर्म, शुष्क परिस्थितियों में दो-धब्बेदार मकड़ी माइट का संक्रमण।',
        'prevention': ['पर्याप्त आर्द्रता बनाए रखें', 'धूलभरी परिस्थितियों से बचें', 'शिकारी माइट पेश करें', 'पौधों को अच्छी तरह सींचें'],
        'treatment': ['माइट हटाने के लिए तेज पानी की धार मारें', 'कीटनाशक साबुन या नीम तेल लगाएं', 'माइटिसाइड (एबामेक्टिन) का उपयोग करें', 'शिकारी माइट (फाइटोसीलस पर्सिमिलिस) छोड़ें']
    },
    'Tomato__Target_Spot': {
        'crop': 'tomato', 'display_name': 'लक्ष्य धब्बा',
        'description': 'कोरिनेस्पोरा कैसीकोला के कारण। पत्तियों, तनों और फलों पर समकेंद्रित वलय पैटर्न दिखाई देते हैं।',
        'symptoms': ['समकेंद्रित वलयों वाले छोटे भूरे धब्बे', 'धब्बे 1 सेमी तक बड़े होते हैं', 'धब्बों के चारों ओर पत्ती पीली होना', 'धंसे केंद्रों वाले फल घाव'],
        'causes': 'गर्म, नम वातावरण में पनपने वाला कोरिनेस्पोरा कैसीकोला कवक।',
        'prevention': ['वायु संचार सुधारें', 'ऊपरी सिंचाई से बचें', 'फसल अवशेष हटाएं', 'फसल चक्र अपनाएं'],
        'treatment': ['कवकनाशी (एज़ोक्सिस्ट्रोबिन या क्लोरोथैलोनिल) लगाएं', 'संक्रमित पत्तियाँ हटाएं', 'गीले मौसम में निवारक स्प्रे करें', 'अच्छा पौधा अंतर सुनिश्चित करें']
    },
    'Tomato__Tomato_YellowLeaf__Curl_Virus': {
        'crop': 'tomato', 'display_name': 'पीली पत्ती मोड़ वायरस (TYLCV)',
        'description': 'सफेद मक्खी (बेमिसिया टाबैसी) द्वारा प्रसारित विनाशकारी वायरल रोग।',
        'symptoms': ['पत्तियों का ऊपर की ओर मुड़ना और कप बनना', 'पत्ती के किनारों का पीलापन', 'पौधे का गंभीर बौनापन', 'फूल गिरना और फल कम लगना'],
        'causes': 'सिल्वरलीफ सफेद मक्खी वाहकों द्वारा प्रसारित टमाटर पीली पत्ती मोड़ वायरस।',
        'prevention': ['सफेद मक्खी प्रतिरोधी किस्मों का उपयोग करें', 'कीट-रोधी जाली लगाएं', 'सफेद मक्खी आबादी नियंत्रित करें', 'संक्रमित पौधे तुरंत हटाएं'],
        'treatment': ['एक बार संक्रमित होने पर कोई इलाज नहीं — पौधे हटाएं', 'इमिडाक्लोप्रिड से सफेद मक्खी वाहक नियंत्रित करें', 'निगरानी के लिए पीली चिपकने वाली जालें लगाएं', 'सफेद मक्खी कम करने के लिए नीम तेल लगाएं']
    },
    'Tomato__Tomato_mosaic_virus': {
        'crop': 'tomato', 'display_name': 'टमाटर मोज़ेक वायरस (ToMV)',
        'description': 'अत्यधिक संक्रामक वायरस जो धब्बेदार पैटर्न और विकृत वृद्धि का कारण बनता है।',
        'symptoms': ['पत्तियों पर हल्के और गहरे हरे मोज़ेक पैटर्न', 'पत्ती का मुड़ना और विकृति', 'बौनी पौधा वृद्धि', 'कम और विकृत फल'],
        'causes': 'दूषित उपकरणों, हाथों और बीजों से यांत्रिक रूप से फैलने वाला टमाटर मोज़ेक वायरस।',
        'prevention': ['वायरस-मुक्त बीज का उपयोग करें', '10% ब्लीच घोल से उपकरण कीटाणुरहित करें', 'पौधे छूने से पहले हाथ धोएं', 'प्रतिरोधी किस्मों का उपयोग करें'],
        'treatment': ['कोई रासायनिक इलाज उपलब्ध नहीं', 'संक्रमित पौधे हटाकर नष्ट करें', 'सभी उपकरण और डंडे कीटाणुरहित करें', 'पौधों के पास धूम्रपान न करें (तंबाकू मोज़ेक क्रॉस-संक्रमण)']
    },
    'Tomato_healthy': {
        'crop': 'tomato', 'display_name': 'स्वस्थ',
        'description': 'टमाटर का पौधा स्वस्थ दिखाई देता है, रोग या कीट क्षति का कोई लक्षण नहीं।',
        'symptoms': ['जीवंत हरी पत्तियाँ', 'कोई धब्बे, घाव या रंग बदलना नहीं', 'सामान्य फल विकास'],
        'causes': 'अनुकूल बढ़ती परिस्थितियाँ और रोगजनकों की अनुपस्थिति।',
        'prevention': ['अच्छी खेती पद्धतियाँ जारी रखें', 'नियमित फसल चक्र करें', 'रोग के शुरुआती लक्षणों की निगरानी करें', 'संतुलित पोषण बनाए रखें'],
        'treatment': ['कोई उपचार आवश्यक नहीं', 'नियमित देखभाल जारी रखें', 'परिवर्तनों के लिए साप्ताहिक निगरानी करें', 'लगातार सिंचाई बनाए रखें']
    }
}

# =============================================================================
# GUJARATI DISEASE DATABASE — ગુજરાતી રોગ ડેટાબેસ
# =============================================================================
DISEASE_DATABASE_GU = {
    'Alternaria_Leaf_Spot': {
        'crop': 'groundnut', 'display_name': 'અલ્ટરનેરિયા પાન ડાઘ',
        'description': 'અલ્ટરનેરિયા અલ્ટરનાટા ફૂગને કારણે થાય છે. પાન પર સમકેન્દ્રિત વલયો સાથે અનિયમિત ભૂરા ઘા દેખાય છે. તે પાક અવશેષોમાં ટકી રહે છે.',
        'symptoms': ['અનિયમિત ભૂરા ઘા', 'પાન પર સમકેન્દ્રિત વલયો (ટાર્ગેટ-પેટર્ન)', 'પાન સૂકાઈને ખરી પડવા'],
        'causes': 'ગરમ, ભેજવાળી પરિસ્થિતિમાં અલ્ટરનેરિયા અલ્ટરનાટા ફૂગને કારણે.',
        'prevention': ['યોગ્ય અંતર (30 × 10 સેમી) જાળવો', 'જળભરાવ ટાળો', 'રોગ-મુક્ત પ્રમાણિત બીજ વાપરો', 'અનાજ પાકો સાથે પાક ફેરબદલી કરો'],
        'treatment': ['કોપર-આધારિત ફૂગનાશક (કોપર ઓક્સિક્લોરાઈડ 3 ગ્રામ/લીટર) લગાવો', 'મેન્કોઝેબ (2.5 ગ્રામ/લીટર) વાપરો', 'ચેપગ્રસ્ત ભાગ દૂર કરીને બાળો', 'લક્ષણ દેખાયાના 48 કલાકમાં ફૂગનાશક લગાવો']
    },
    'Healthy': {
        'crop': 'any', 'display_name': 'સ્વસ્થ',
        'description': 'છોડ સ્વસ્થ દેખાય છે, રોગના કોઈ ચિહ્નો નથી.',
        'symptoms': ['કોઈ નહીં', 'જીવંત લીલા પાન', 'સામાન્ય વૃદ્ધિ'],
        'causes': 'શ્રેષ્ઠ ઉગાડવાની પરિસ્થિતિઓ અને રોગકારકોની ગેરહાજરી.',
        'prevention': ['સારી ખેતી પદ્ધતિઓ ચાલુ રાખો', 'પ્રમાણિત બીજ વાપરો', 'ખેતરની સ્વચ્છતા જાળવો', 'પાક ફેરબદલી કરો'],
        'treatment': ['કોઈ ઉપચારની જરૂર નથી', 'નિયમિત સિંચાઈ ચાલુ રાખો', 'સાપ્તાહિક પાનનું નિરીક્ષણ કરો', 'જમીનનું સ્વાસ્થ્ય જાળવો']
    },
    'Leaf_Spot_Early_and_Late': {
        'crop': 'groundnut', 'display_name': 'પાન ડાઘ (વહેલો અને મોડો)',
        'description': 'સર્કોસ્પોરા એરાકિડિકોલા (વહેલો) અને સર્કોસ્પોરિડિયમ પર્સોનેટમ (મોડો) ને કારણે. પાન પર ભૂરા અથવા કાળા ડાઘ દેખાય છે.',
        'symptoms': ['પાનની ઉપરની સપાટી પર ભૂરા અથવા કાળા ડાઘ', 'ડાઘની આસપાસ પીળો હાલો', 'સમય પહેલાં પાન ખરવું'],
        'causes': 'ગરમ, ભેજવાળી પરિસ્થિતિમાં ખીલતો ફૂગ ચેપ.',
        'prevention': ['બિન-યજમાન પાકો સાથે પાક ફેરબદલી કરો', 'ઉપરથી સિંચાઈ ટાળો', 'પ્રતિરોધક જાતો વાવો', 'યોગ્ય છોડ અંતર જાળવો'],
        'treatment': ['મેન્કોઝેબ જેવા ફૂગનાશક લગાવો', 'ભારે ચેપગ્રસ્ત પાન દૂર કરો', 'દર 10-14 દિવસે ફૂગનાશક છંટકાવ કરો', 'સંપર્ક અને પ્રણાલીગત ફૂગનાશક વાપરો']
    },
    'Rosette': {
        'crop': 'groundnut', 'display_name': 'રોઝેટ રોગ',
        'description': 'મોલો દ્વારા ફેલાતો વાયરલ રોગ. છોડની ગંભીર વામનતા અને પાનની પીળાશ થાય છે.',
        'symptoms': ['ગંભીર વામનતા', 'પાનની પીળાશ', 'વળેલા અથવા વિકૃત પાન'],
        'causes': 'મગફળીના મોલો દ્વારા ફેલાતો વાયરલ ચેપ.',
        'prevention': ['મોસમમાં વહેલા વાવો', 'ઊંચી છોડ ઘનતા જાળવો', 'સ્વયંસેવી છોડ દૂર કરો', 'પ્રતિરોધક જાતો વાપરો'],
        'treatment': ['જંતુનાશકથી મોલો વાહકોને નિયંત્રિત કરો', 'ચેપગ્રસ્ત છોડ દૂર કરીને નાશ કરો', 'એકવાર ચેપ લાગે પછી કોઈ ઈલાજ નથી', 'વહેલા પ્રણાલીગત જંતુનાશક લગાવો']
    },
    'Rust': {
        'crop': 'groundnut', 'display_name': 'રસ્ટ રોગ',
        'description': 'પુસીનિયા એરાકિડિસ ફૂગને કારણે. પાનની નીચેની બાજુએ નારંગી-ભૂરા દાણા દેખાય છે.',
        'symptoms': ['પાનની નીચે નારંગી-ભૂરા દાણા', 'પાન ભૂરા થઈને સૂકાય છે', 'દાણા ફાટીને પાવડર જેવા બીજાણુ છોડે છે'],
        'causes': 'હવાથી ફેલાતા બીજાણુઓ દ્વારા પુસીનિયા એરાકિડિસ ફૂગનો ફેલાવો.',
        'prevention': ['રસ્ટ પ્રતિરોધક જાતો ઉગાડો', 'વહેલા વાવો', 'પાક અવશેષો દૂર કરો', 'વધુ પડતા નાઈટ્રોજનથી બચો'],
        'treatment': ['પ્રણાલીગત ફૂગનાશક (ટ્રાયડીમેફોન) લગાવો', 'દાણાના પ્રથમ ચિહ્ને છંટકાવ કરો', 'દર 10-15 દિવસે પુનરાવર્તન કરો', 'લીમડાના તેલ સાથે ભેળવો']
    },
    'Bacteria': {
        'crop': 'potato', 'display_name': 'બેક્ટેરિયલ વિલ્ટ',
        'description': 'રાલ્સ્ટોનિયા સોલાનેસીરમને કારણે. પૂરતી જમીન ભેજ હોવા છતાં છોડ ઝડપથી સુકાય છે.',
        'symptoms': ['પાન અને દાંડીનું ઝડપી સુકાવું', 'દાંડીની અંદર ભૂરો રંગ', 'કાપેલી દાંડીમાંથી સફેદ બેક્ટેરિયલ ઝરણ'],
        'causes': 'મૂળ અથવા ઘાયલ છોડના ભાગોથી બેક્ટેરિયલ ચેપ.',
        'prevention': ['પ્રમાણિત રોગ-મુક્ત બીજ કંદ વાપરો', '3-5 વર્ષની પાક ફેરબદલી કરો', 'જમીનની જળ નિકાલ સુધારો', 'ખેતી સાધનો સાફ કરો'],
        'treatment': ['ચેપગ્રસ્ત છોડ દૂર કરીને નાશ કરો', 'કોઈ રાસાયણિક ઈલાજ ઉપલબ્ધ નથી', 'ભારે ચેપગ્રસ્ત જમીન સોલરાઈઝ કરો', 'જૈવ-નિયંત્રણ એજન્ટો નિવારક રીતે વાપરો']
    },
    'Fungi': {
        'crop': 'potato', 'display_name': 'ફૂગ બ્લાઈટ (અર્લી બ્લાઈટ)',
        'description': 'અલ્ટરનેરિયા સોલાનીને કારણે. જૂના પાન પર પહેલાં ઘેરા, સમકેન્દ્રિત ડાઘ દેખાય છે.',
        'symptoms': ['સમકેન્દ્રિત વલયો સાથે ઘેરા ભૂરા ડાઘ', 'ડાઘની આસપાસ પીળાશ', 'પાન સૂકાવું અને મરવું'],
        'causes': 'ગરમ, ભેજવાળા વાતાવરણમાં ફેલાતી ફૂગ.',
        'prevention': ['રોગ-મુક્ત બીજ વાપરો', 'ઉપરથી સિંચાઈ ટાળો', 'પૂરતું ખાતર આપો', 'બિન-સોલાનેસી છોડ સાથે પાક ફેરબદલી કરો'],
        'treatment': ['રક્ષણાત્મક ફૂગનાશક (ક્લોરોથેલોનિલ) લગાવો', 'પ્રણાલીગત ફૂગનાશક લગાવો', 'મોસમની શરૂઆતમાં છંટકાવ કરો', 'ચેપગ્રસ્ત અવશેષો દૂર કરો']
    },
    'Nematode': {
        'crop': 'potato', 'display_name': 'બટાટા સિસ્ટ નેમેટોડ',
        'description': 'બટાટાના મૂળ પર ખાનારા સૂક્ષ્મ કીડા, ખરાબ વૃદ્ધિ અને ઉપજ ઘટાડાનું કારણ.',
        'symptoms': ['વામન છોડ વૃદ્ધિ', 'પાનની પીળાશ', 'મૂળ પર નાના સફેદ/પીળા સિસ્ટ'],
        'causes': 'જમીનમાં ગ્લોબોડેરા પ્રજાતિઓનો ચેપ.',
        'prevention': ['કડક ક્વોરન્ટાઈન પગલાં', 'લાંબી પાક ફેરબદલી (7 વર્ષ સુધી)', 'પ્રતિરોધક જાતો વાવો', 'જમીન ફેલાવ રોકવા સાધનો સાફ કરો'],
        'treatment': ['વાવણી પહેલાં નેમેટિસાઈડ લગાવો', 'જાળ પાકો વાપરો', 'જમીન સોલરાઈઝ કરો', 'ગંભીર કિસ્સામાં જમીન ધૂમિત કરો']
    },
    'Pest': {
        'crop': 'potato', 'display_name': 'જીવાત ઉપદ્રવ',
        'description': 'બટાટાના પાન ખાનારા જીવાત, જે છોડને સંપૂર્ણ પાનવિહીન કરી શકે છે.',
        'symptoms': ['પાનમાં છિદ્રો', 'પાનનું હાડપિંજર બનવું', 'લાર્વા અથવા પુખ્ત ભૃંગની હાજરી'],
        'causes': 'અનુકૂળ પરિસ્થિતિમાં ઝડપથી વધતા કીટ જીવાત.',
        'prevention': ['હરોળ આવરણ વાપરો', 'પાક ફેરબદલી કરો', 'કુદરતી શિકારીઓને પ્રોત્સાહિત કરો', 'ટોચની જીવાત વસ્તી ટાળવા વહેલા વાવો'],
        'treatment': ['ભૃંગો અને લાર્વા હાથથી ચૂંટો', 'સ્પિનોસેડ અથવા લીમડાનું તેલ લગાવો', 'ચોક્કસ રાસાયણિક જંતુનાશક વાપરો', 'લાર્વા માટે બેસિલસ થુરિંગિએન્સિસ (Bt) લગાવો']
    },
    'Phytopthora': {
        'crop': 'potato', 'display_name': 'લેટ બ્લાઈટ (ફાઈટોફ્થોરા)',
        'description': 'ફાઈટોફ્થોરા ઈન્ફેસ્ટન્સને કારણે વિનાશકારી રોગ. ઠંડી, ભીની પરિસ્થિતિમાં થોડા દિવસોમાં પાક નાશ કરી શકે છે.',
        'symptoms': ['પાન પર પાણીથી ભીંજાયેલા, ઘેરા લીલા ડાઘ', 'પાનની નીચે સફેદ ફૂગ વૃદ્ધિ', 'કંદ પર ભૂરી સડો'],
        'causes': 'ઠંડા, ભીના હવામાનમાં ખીલતો ઊમાઈસીટ રોગકારક.',
        'prevention': ['પ્રતિરોધક જાતો વાવો', 'સ્વયંસેવી બટાટા નાશ કરો', 'સારી જમીન જળ નિકાલ સુનિશ્ચિત કરો', 'મોડી લણણી ટાળો'],
        'treatment': ['નિવારક સંપર્ક ફૂગનાશક લગાવો', 'મેટાલેક્સિલ જેવા પ્રણાલીગત ફૂગનાશક વાપરો', 'લણણી પહેલાં ચેપગ્રસ્ત વેલા નાશ કરો', 'સૂકી પરિસ્થિતિમાં લણણી કરો']
    },
    'Virus': {
        'crop': 'potato', 'display_name': 'બટાટા વાયરસ (PVY/PLRV)',
        'description': 'મોલો દ્વારા ફેલાતા વાયરલ રોગો, મોઝેક પેટર્ન અથવા પાન વળાંકનું કારણ.',
        'symptoms': ['પાન પર મોઝેક અથવા ડાઘવાળી પેટર્ન', 'પાનનું ઉપર તરફ વળવું', 'વામન વૃદ્ધિ અને ઓછી ઉપજ'],
        'causes': 'મોલો વાહકો અથવા ચેપગ્રસ્ત બીજ કંદ દ્વારા ફેલાતા વાયરસ.',
        'prevention': ['પ્રમાણિત વાયરસ-મુક્ત બીજ વાપરો', 'મોલો વસ્તી નિયંત્રિત કરો', 'ચેપગ્રસ્ત છોડ વહેલા દૂર કરો', 'ચેપગ્રસ્ત ખેતર પાસે વાવણી ટાળો'],
        'treatment': ['વાયરસ માટે કોઈ રાસાયણિક ઈલાજ નથી', 'વાહકો નિયંત્રિત કરવા જંતુનાશક વાપરો', 'ફેલાવ ઘટાડવા ખનિજ તેલ લગાવો', 'ભારે ચેપગ્રસ્ત પાક નાશ કરો']
    },
    'Potato___Early_blight': {
        'crop': 'potato', 'display_name': 'અર્લી બ્લાઈટ',
        'description': 'Alternaria solani નામની ફૂગને કારણે થાય છે. જૂના પાંદડાઓ પર શરૂઆતમાં ગોળાકાર ઘેરા રિંગ જેવા ડાઘ (ટાર્ગેટ સ્પોટ્સ) જોવા મળે છે.',
        'symptoms': ['જૂના પાંદડાઓ પર ઘેરા સમકેન્દ્રિત રિંગ જેવા ડાઘ', 'ડાઘની આસપાસ પીળો વિસ્તાર', 'પાંદડા કરમાઈ જાય છે અને ખરી પડે છે', 'કાંડ પર પણ ડાઘ શક્ય છે'],
        'causes': 'ગરમ, ભેજવાળી પરિસ્થિતિઓ અને ભારે ઝાકળમાં Alternaria solani ફૂગનો ઉપદ્રવ વધે છે.',
        'prevention': ['પ્રમાણિત રોગ-મુક્ત બીજ કંદ વાપરો', 'ઉપરથી સિંચાઈ ટાળો', 'સંતુલિત ખાતર આપો', 'બિન-સોલાનેસી પાકો સાથે પાક ફેરબદલી કરો'],
        'treatment': ['Chlorothalonil અથવા Mancozeb ફૂગનાશકનો છંટકાવ કરો', 'પ્રણાલીગત ફૂગનાશક લગાવો', 'લક્ષણો દેખાતાં જ છંટકાવ કરો', 'ચેપગ્રસ્ત અવશેષો દૂર કરો']
    },
    'Potato___Late_blight': {
        'crop': 'potato', 'display_name': 'લેટ બ્લાઈટ',
        'description': 'Phytophthora infestans ફૂગને કારણે થતો વિનાશકારી રોગ. ઠંડી, ભીની પરિસ્થિતિમાં થોડા દિવસોમાં પાક નાશ કરી શકે છે.',
        'symptoms': ['પાન પર પાણીથી ભીંજાયેલા, ઘેરા લીલા ડાઘ', 'પાનની નીચે સફેદ ફૂગ વૃદ્ધિ', 'કંદ પર ભૂરી સડો'],
        'causes': 'ઠંડા, ભીના હવામાનમાં ખીલતો Phytophthora infestans ઊમાઈસીટ રોગકારક.',
        'prevention': ['પ્રતિરોધક જાતો વાવો', 'સ્વયંસેવી બટાટા નાશ કરો', 'સારી જમીન જળ નિકાલ સુનિશ્ચિત કરો', 'મોડી લણણી ટાળો'],
        'treatment': ['નિવારક સંપર્ક ફૂગનાશક લગાવો', 'મેટાલેક્સિલ જેવા પ્રણાલીગત ફૂગનાશક વાપરો', 'લણણી પહેલાં ચેપગ્રસ્ત વેલા નાશ કરો', 'સૂકી પરિસ્થિતિમાં લણણી કરો']
    },
    'Potato___healthy': {
        'crop': 'potato', 'display_name': 'સ્વસ્થ',
        'description': 'રોગના કોઈ ચિહ્નો નથી. બટાટાનો છોડ સામાન્ય દેખાય છે, સ્વસ્થ પાન અને વૃદ્ધિ સાથે.',
        'symptoms': ['જીવંત લીલા પાન', 'કોઈ ડાઘ અથવા ઘા નથી', 'સામાન્ય સશક્ત વૃદ્ધિ'],
        'causes': 'શ્રેષ્ઠ ઉગાડવાની પરિસ્થિતિઓ અને રોગકારકોની ગેરહાજરી.',
        'prevention': ['સારી ખેતી પદ્ધતિઓ ચાલુ રાખો', 'પ્રમાણિત બીજ વાપરો', 'ખેતરની સ્વચ્છતા જાળવો', 'પાક ફેરબદલી કરો'],
        'treatment': ['કોઈ ઉપચારની જરૂર નથી', 'નિયમિત સિંચાઈ ચાલુ રાખો', 'સાપ્તાહિક પાનનું નિરીક્ષણ કરો', 'જમીનનું સ્વાસ્થ્ય જાળવો']
    },
    'Pepper__bell___Bacterial_spot': {
        'crop': 'pepper', 'display_name': 'બેક્ટેરિયલ સ્પોટ',
        'description': 'ઝેન્થોમોનાસ કેમ્પેસ્ટ્રિસને કારણે. પાન, દાંડી અને ફળ પર પાણીથી ભીંજાયેલા ડાઘ દેખાય છે.',
        'symptoms': ['પાન પર નાના, ઘેરા, પાણીથી ભીંજાયેલા ડાઘ', 'ડાઘ મોટા થઈને પીળા હાલો સાથે ભૂરા થાય છે', 'ગંભીર કિસ્સામાં પાન ખરવું', 'ફળ પર ઊભરેલા ખરબચડા ડાઘ'],
        'causes': 'વરસાદના છાંટા અને દૂષિત બીજથી ફેલાતો બેક્ટેરિયલ ચેપ.',
        'prevention': ['પ્રમાણિત રોગ-મુક્ત બીજ વાપરો', 'ઉપરથી સિંચાઈ ટાળો', 'પાક ફેરબદલી (2-3 વર્ષ) કરો', 'ચેપગ્રસ્ત છોડના અવશેષો દૂર કરો'],
        'treatment': ['કોપર-આધારિત બેક્ટેરિસાઈડ લગાવો', 'પરવાનગી હોય તો સ્ટ્રેપ્ટોમાઈસિન છંટકાવ કરો', 'ભારે ચેપગ્રસ્ત છોડ દૂર કરો', 'છોડની આસપાસ હવા પરિભ્રમણ સુધારો']
    },
    'Pepper__bell___healthy': {
        'crop': 'pepper', 'display_name': 'સ્વસ્થ',
        'description': 'મરચાંનો છોડ સ્વસ્થ દેખાય છે, રોગના કોઈ ચિહ્નો નથી.',
        'symptoms': ['જીવંત લીલા પાન', 'કોઈ ડાઘ અથવા ઘા નથી', 'સામાન્ય વૃદ્ધિ અને ફળ વિકાસ'],
        'causes': 'શ્રેષ્ઠ ઉગાડવાની પરિસ્થિતિઓ અને રોગકારકોની ગેરહાજરી.',
        'prevention': ['સારી ખેતી પદ્ધતિઓ ચાલુ રાખો', 'પ્રમાણિત બીજ વાપરો', 'ખેતરની સ્વચ્છતા જાળવો', 'પાક ફેરબદલી કરો'],
        'treatment': ['કોઈ ઉપચારની જરૂર નથી', 'નિયમિત સિંચાઈ ચાલુ રાખો', 'સાપ્તાહિક પાનનું નિરીક્ષણ કરો', 'જમીનનું સ્વાસ્થ્ય જાળવો']
    },
    'Tomato_Bacterial_spot': {
        'crop': 'tomato', 'display_name': 'બેક્ટેરિયલ સ્પોટ',
        'description': 'ઝેન્થોમોનાસ પ્રજાતિઓને કારણે. પાન અને ફળ પર નાના, ઘેરા, પાણીથી ભીંજાયેલા ઘા.',
        'symptoms': ['પાન પર નાના ઘેરા ડાઘ', 'ડાઘ પર પીળો હાલો હોઈ શકે', 'પાન પીળું થઈને ખરવું', 'ફળ પર ઊભરેલા ખરબચડા ડાઘ'],
        'causes': 'વરસાદના છાંટા, ઉપરથી સિંચાઈ અને દૂષિત બીજથી ફેલાતો બેક્ટેરિયલ ચેપ.',
        'prevention': ['રોગ-મુક્ત બીજ અને રોપા વાપરો', 'ઉપરથી સિંચાઈ ટાળો', '2-3 વર્ષ પાક ફેરબદલી કરો', 'લણણી પછી પાક અવશેષો દૂર કરો'],
        'treatment': ['કોપર-આધારિત છંટકાવ લગાવો', 'કોપર + મેન્કોઝેબ મિશ્રણ વાપરો', 'ભારે ચેપગ્રસ્ત છોડ દૂર કરો', 'ભીના ખેતરમાં કામ કરવાથી બચો']
    },
    'Tomato_Early_blight': {
        'crop': 'tomato', 'display_name': 'અર્લી બ્લાઈટ',
        'description': 'Alternaria solani નામની ફૂગને કારણે થાય છે. જૂના પાંદડાઓ પર શરૂઆતમાં ગોળાકાર ઘેરા રિંગ જેવા ડાઘ (ટાર્ગેટ સ્પોટ્સ) જોવા મળે છે.',
        'symptoms': [
            'નીચલા પાંદડાઓ પર ઘેરા સમકેન્દ્રિત રિંગ જેવા ડાઘ',
            'ડાઘની આસપાસ પીળો વિસ્તાર',
            'પાંદડા કરમાઈ જાય છે અને ખરી પડે છે',
            'કાંડ પર પણ ડાઘ શક્ય છે'
        ],
        'causes': 'ગરમ, ભેજવાળી પરિસ્થિતિઓ અને ભારે ઝાકળમાં Alternaria solani ફૂગનો ઉપદ્રવ વધે છે.',
        'prevention': [
            'હવાના સારા પરિભ્રમણ માટે છોડને ટેકો આપો',
            'છોડના થડ આસપાસ મલ્ચિંગ કરો',
            'જમીન સ્તરે પાણી આપો (ઉપરથી છંટકાવ ટાળો)',
            'નીચલા ચેપગ્રસ્ત પાંદડા તાત્કાલિક દૂર કરો'
        ],
        'treatment': [
            'Chlorothalonil અથવા Mancozeb ફૂગનાશકનો છંટકાવ કરો',
            'કોપર-આધારિત ફૂગનાશકનો છંટકાવ કરો',
            'ચેપગ્રસ્ત પાંદડા તાત્કાલિક દૂર કરો',
            'ભીના હવામાનમાં દર 7-10 દિવસે ફૂગનાશકનો છંટકાવ ચાલુ રાખો'
        ]
    },
    'Tomato_Late_blight': {
        'crop': 'tomato', 'display_name': 'લેટ બ્લાઈટ',
        'description': 'ફાઈટોફ્થોરા ઈન્ફેસ્ટન્સને કારણે. ઠંડી, ભીની પરિસ્થિતિમાં આખા પાકને ઝડપથી નાશ કરી શકે છે.',
        'symptoms': ['મોટા, અનિયમિત આકારના, પાણીથી ભીંજાયેલા ઘા', 'પાનની નીચે સફેદ રૂંવાટીદાર ફૂગ', 'ફળ પર ઘેરી ભૂરી સખત સડો', 'છોડનું ઝડપી પતન'],
        'causes': 'ઠંડા (15-22°C), ભીના હવામાનમાં ખીલતો ઊમાઈસીટ ફાઈટોફ્થોરા ઈન્ફેસ્ટન્સ.',
        'prevention': ['સ્વયંસેવી છોડ નાશ કરો', 'સારું હવા પરિભ્રમણ આપો', 'ઉપરથી સિંચાઈ ટાળો', 'પ્રતિરોધક જાતો વાપરો'],
        'treatment': ['પ્રણાલીગત ફૂગનાશક (મેટાલેક્સિલ) લગાવો', 'નિવારક કોપર ફૂગનાશક છંટકાવ કરો', 'ચેપગ્રસ્ત છોડ તરત નાશ કરો', 'બાકીના ફળ ઝડપથી લણો']
    },
    'Tomato_Leaf_Mold': {
        'crop': 'tomato', 'display_name': 'પાન ફૂગ',
        'description': 'પાસાલોરા ફુલ્વા (ક્લેડોસ્પોરિયમ ફુલ્વમ) ને કારણે. મુખ્યત્વે ગ્રીનહાઉસ ટમેટાને અસર કરે છે.',
        'symptoms': ['ઉપરના પાનની સપાટી પર આછા લીલાથી પીળા ડાઘ', 'નીચેની બાજુએ ઓલિવ-લીલાથી ભૂરી મખમલી ફૂગ', 'પાન વળીને સુકાય છે', 'ફળ લાગવામાં ઘટાડો'],
        'causes': 'ઊંચી ભેજ (>85%) અને મધ્યમ તાપમાનમાં ખીલતી પાસાલોરા ફુલ્વા ફૂગ.',
        'prevention': ['ગ્રીનહાઉસ વેન્ટિલેશન સુધારો', 'ભેજ 85% થી નીચે રાખો', 'છોડને પૂરતા અંતરે વાવો', 'પ્રતિરોધક જાતો વાપરો'],
        'treatment': ['તરત હવા પરિભ્રમણ સુધારો', 'ફૂગનાશક (ક્લોરોથેલોનિલ) લગાવો', 'ભારે અસરગ્રસ્ત પાન દૂર કરો', 'સિંચાઈની આવર્તન ઘટાડો']
    },
    'Tomato_Septoria_leaf_spot': {
        'crop': 'tomato', 'display_name': 'સેપ્ટોરિયા પાન ડાઘ',
        'description': 'સેપ્ટોરિયા લાઈકોપર્સિસીને કારણે. ઘેરા કિનારા અને ભૂખરા કેન્દ્રો સાથે નાના ગોળ ડાઘ.',
        'symptoms': ['અસંખ્ય નાના ગોળ ડાઘ (1-3 મિમી)', 'ઘેરા ભૂરા કિનારા અને ભૂખરા/કથ્થાઈ કેન્દ્રો', 'ડાઘના કેન્દ્રમાં નાના કાળા બિંદુઓ (પિક્નિડિયા)', 'નીચલા પાન પહેલાં અસરગ્રસ્ત'],
        'causes': 'વરસાદના છાંટા અને ઉપરથી સિંચાઈથી ફેલાતી સેપ્ટોરિયા લાઈકોપર્સિસી ફૂગ.',
        'prevention': ['છોડની આસપાસ મલ્ચિંગ કરો', 'ઉપરથી સિંચાઈ ટાળો', '3 વર્ષ પાક ફેરબદલી કરો', 'ચેપગ્રસ્ત છોડના અવશેષો દૂર કરો'],
        'treatment': ['ફૂગનાશક (ક્લોરોથેલોનિલ અથવા કોપર) લગાવો', 'નીચલા ચેપગ્રસ્ત પાન દૂર કરો', 'રોગના પ્રથમ ચિહ્ને છંટકાવ કરો', 'દર 7-14 દિવસે ઉપચાર ચાલુ રાખો']
    },
    'Tomato_Spider_mites_Two_spotted_spider_mite': {
        'crop': 'tomato', 'display_name': 'સ્પાઈડર માઈટ નુકસાન',
        'description': 'ટેટ્રાનિકસ ઉર્ટિકીને કારણે. સૂક્ષ્મ માઈટ પાનના કોષો ખાય છે જેનાથી ડાઘ અને જાળા બને છે.',
        'symptoms': ['પાન પર ઝીણા ડાઘ/છંટકાવ', 'પાનનું પીળું અને કાંસ્ય રંગ થવું', 'નીચેની બાજુએ ઝીણા જાળા', 'ગંભીર કિસ્સામાં પાન ખરવું'],
        'causes': 'ગરમ, સૂકી પરિસ્થિતિમાં બે-ડાઘવાળી સ્પાઈડર માઈટનો ચેપ.',
        'prevention': ['પૂરતી ભેજ જાળવો', 'ધૂળભરી પરિસ્થિતિ ટાળો', 'શિકારી માઈટ છોડો', 'છોડને સારી રીતે સિંચો'],
        'treatment': ['માઈટ દૂર કરવા તેજ પાણીની ધાર મારો', 'જંતુનાશક સાબુ અથવા લીમડાનું તેલ લગાવો', 'માઈટિસાઈડ (એબામેક્ટિન) વાપરો', 'શિકારી માઈટ (ફાઈટોસીલસ પર્સિમિલિસ) છોડો']
    },
    'Tomato__Target_Spot': {
        'crop': 'tomato', 'display_name': 'ટાર્ગેટ સ્પોટ',
        'description': 'કોરિનેસ્પોરા કેસીકોલાને કારણે. પાન, દાંડી અને ફળ પર સમકેન્દ્રિત વલય પેટર્ન દેખાય છે.',
        'symptoms': ['સમકેન્દ્રિત વલયો સાથે નાના ભૂરા ડાઘ', 'ડાઘ 1 સેમી સુધી મોટા થાય', 'ડાઘની આસપાસ પાન પીળું થવું', 'ધંસેલા કેન્દ્રો સાથે ફળ ઘા'],
        'causes': 'ગરમ, ભેજવાળા વાતાવરણમાં ખીલતી કોરિનેસ્પોરા કેસીકોલા ફૂગ.',
        'prevention': ['હવા પરિભ્રમણ સુધારો', 'ઉપરથી સિંચાઈ ટાળો', 'પાક અવશેષો દૂર કરો', 'પાક ફેરબદલી કરો'],
        'treatment': ['ફૂગનાશક (એઝોક્સિસ્ટ્રોબિન અથવા ક્લોરોથેલોનિલ) લગાવો', 'ચેપગ્રસ્ત પાન દૂર કરો', 'ભીની મોસમમાં નિવારક છંટકાવ કરો', 'સારું છોડ અંતર સુનિશ્ચિત કરો']
    },
    'Tomato__Tomato_YellowLeaf__Curl_Virus': {
        'crop': 'tomato', 'display_name': 'પીળા પાન વળાંક વાયરસ (TYLCV)',
        'description': 'સફેદ માખી (બેમિસિયા ટેબેસી) દ્વારા ફેલાતો વિનાશકારી વાયરલ રોગ.',
        'symptoms': ['પાનનું ઉપર તરફ વળવું અને કપ બનવું', 'પાનના કિનારાની પીળાશ', 'છોડની ગંભીર વામનતા', 'ફૂલ ખરવું અને ફળ ઓછા લાગવા'],
        'causes': 'સિલ્વરલીફ સફેદ માખી વાહકો દ્વારા ફેલાતો ટમેટા પીળા પાન વળાંક વાયરસ.',
        'prevention': ['સફેદ માખી પ્રતિરોધક જાતો વાપરો', 'જંતુ-રોધક જાળી લગાવો', 'સફેદ માખી વસ્તી નિયંત્રિત કરો', 'ચેપગ્રસ્ત છોડ તરત દૂર કરો'],
        'treatment': ['એકવાર ચેપ લાગે તો કોઈ ઈલાજ નથી — છોડ દૂર કરો', 'ઈમિડાક્લોપ્રિડથી સફેદ માખી વાહક નિયંત્રિત કરો', 'નિરીક્ષણ માટે પીળી ચીકણી જાળી લગાવો', 'સફેદ માખી ઘટાડવા લીમડાનું તેલ લગાવો']
    },
    'Tomato__Tomato_mosaic_virus': {
        'crop': 'tomato', 'display_name': 'ટમેટા મોઝેક વાયરસ (ToMV)',
        'description': 'ડાઘવાળી પેટર્ન અને વિકૃત વૃદ્ધિનું કારણ બનતો ખૂબ ચેપી વાયરસ.',
        'symptoms': ['પાન પર આછા અને ઘેરા લીલા મોઝેક પેટર્ન', 'પાનનું વળવું અને વિકૃતિ', 'વામન છોડ વૃદ્ધિ', 'ઓછા અને વિકૃત ફળ'],
        'causes': 'દૂષિત સાધનો, હાથ અને બીજ દ્વારા યાંત્રિક રીતે ફેલાતો ટમેટા મોઝેક વાયરસ.',
        'prevention': ['વાયરસ-મુક્ત બીજ વાપરો', '10% બ્લીચ દ્રાવણથી સાધનો જંતુમુક્ત કરો', 'છોડ સ્પર્શ કરતાં પહેલાં હાથ ધોવો', 'પ્રતિરોધક જાતો વાપરો'],
        'treatment': ['કોઈ રાસાયણિક ઈલાજ ઉપલબ્ધ નથી', 'ચેપગ્રસ્ત છોડ દૂર કરીને નાશ કરો', 'બધા સાધનો અને ટેકા જંતુમુક્ત કરો', 'છોડ પાસે ધૂમ્રપાન ન કરો (તમાકુ મોઝેક ક્રોસ-ચેપ)']
    },
    'Tomato_healthy': {
        'crop': 'tomato', 'display_name': 'સ્વસ્થ',
        'description': 'ટમેટાનો છોડ સ્વસ્થ દેખાય છે, રોગ અથવા જીવાત નુકસાનના કોઈ ચિહ્નો નથી.',
        'symptoms': ['જીવંત લીલા પાન', 'કોઈ ડાઘ, ઘા અથવા રંગ બદલાવ નથી', 'સામાન્ય ફળ વિકાસ'],
        'causes': 'શ્રેષ્ઠ ઉગાડવાની પરિસ્થિતિઓ અને રોગકારકોની ગેરહાજરી.',
        'prevention': ['સારી ખેતી પદ્ધતિઓ ચાલુ રાખો', 'નિયમિત પાક ફેરબદલી કરો', 'રોગના પ્રારંભિક ચિહ્નો માટે નિરીક્ષણ કરો', 'સંતુલિત પોષણ જાળવો'],
        'treatment': ['કોઈ ઉપચારની જરૂર નથી', 'નિયમિત સંભાળ ચાલુ રાખો', 'ફેરફારો માટે સાપ્તાહિક નિરીક્ષણ કરો', 'સુસંગત સિંચાઈ જાળવો']
    }
}

# Map language codes to their disease databases
DISEASE_DATABASES = {
    'en': DISEASE_DATABASE,
    'hi': DISEASE_DATABASE_HI,
    'gu': DISEASE_DATABASE_GU
}

def normalize_disease_key(disease_name, crop_name=''):
    """
    Map disease names and common aliases to canonical keys in DISEASE_DATABASE.
    """
    if not disease_name:
        return 'Healthy'
    raw = str(disease_name).strip()

    c_low = (crop_name or '').lower()

    # Crop-specific healthy keys
    if raw.lower() in ('healthy', 'normal', 'potato___healthy', 'potato_healthy'):
        if c_low == 'pepper':
            return 'Pepper__bell___healthy'
        elif c_low == 'tomato':
            return 'Tomato_healthy'
        else:
            return 'Healthy'

    # Aliases
    aliases = {
        'Leaf_Spot': 'Leaf_Spot_Early_and_Late',
        'Leaf Spot': 'Leaf_Spot_Early_and_Late',
        'Leaf Spot (Early & Late)': 'Leaf_Spot_Early_and_Late',
        'Leaf Spot (Early and Late)': 'Leaf_Spot_Early_and_Late',
        'Early Blight': 'Fungi' if c_low == 'potato' else 'Tomato_Early_blight',
        'Early_Blight': 'Fungi' if c_low == 'potato' else 'Tomato_Early_blight',
        'Potato___Early_blight': 'Fungi',
        'Potato_Early_blight': 'Fungi',
        'Late Blight': 'Phytopthora' if c_low == 'potato' else 'Tomato_Late_blight',
        'Late_Blight': 'Phytopthora' if c_low == 'potato' else 'Tomato_Late_blight',
        'Potato___Late_blight': 'Phytopthora',
        'Potato_Late_blight': 'Phytopthora',
        'Fungal Blight': 'Fungi',
        'Fungal_Blight': 'Fungi',
        'Fungal Blight (Early Blight)': 'Fungi',
        'Late Blight (Phytophthora)': 'Phytopthora',
        'Leaf Mold': 'Tomato_Leaf_Mold',
        'Leaf_Mold': 'Tomato_Leaf_Mold',
        'Septoria Leaf Spot': 'Tomato_Septoria_leaf_spot',
        'Septoria_Leaf_Spot': 'Tomato_Septoria_leaf_spot',
        'Spider Mite Damage': 'Tomato_Spider_mites_Two_spotted_spider_mite',
        'Spider Mites': 'Tomato_Spider_mites_Two_spotted_spider_mite',
        'Target Spot': 'Tomato__Target_Spot',
        'Yellow Leaf Curl Virus': 'Tomato__Tomato_YellowLeaf__Curl_Virus',
        'Tomato Mosaic Virus': 'Tomato__Tomato_mosaic_virus',
        'Mosaic Virus': 'Tomato__Tomato_mosaic_virus',
        'Bacterial Spot': 'Tomato_Bacterial_spot' if c_low == 'tomato' else 'Pepper__bell___Bacterial_spot',
        'Bacterial_Spot': 'Tomato_Bacterial_spot' if c_low == 'tomato' else 'Pepper__bell___Bacterial_spot',
        'Bacterial Wilt': 'Bacteria',
        'Potato Cyst Nematode': 'Nematode',
        'Pest Infestation': 'Pest',
        'Potato Virus': 'Virus',
    }
    if raw in aliases:
        return aliases[raw]
    return raw

def get_localized_crop_name(crop_name, lang='en'):
    """
    Return translated crop name for the given language ('en', 'hi', 'gu').
    """
    crop_map = {
        'groundnut': {'en': 'Groundnut', 'hi': 'मूंगफली', 'gu': 'મગફળી'},
        'potato': {'en': 'Potato', 'hi': 'आलू', 'gu': 'બટાટા'},
        'pepper': {'en': 'Pepper', 'hi': 'मिर्च', 'gu': 'મરચાં'},
        'tomato': {'en': 'Tomato', 'hi': 'टमाटर', 'gu': 'ટમેટા'}
    }
    c_lower = (crop_name or '').lower()
    if c_lower in crop_map:
        return crop_map[c_lower].get(lang, crop_map[c_lower]['en'])
    return crop_name.capitalize() if crop_name else 'Groundnut'

def get_crop_disease_info(disease_name, crop_name, lang='en'):
    """
    Return disease info in the requested language ('en', 'hi', 'gu').
    Falls back to English if translation is not available.
    """
    if lang not in ('en', 'hi', 'gu'):
        lang = 'en'

    db = DISEASE_DATABASES.get(lang, DISEASE_DATABASE)
    key = normalize_disease_key(disease_name, crop_name)

    info = None
    if key in db:
        info = db[key]
    else:
        for k in db:
            if k.lower() == key.lower() or k.lower() == str(disease_name).lower():
                info = db[k]
                break

    # Fallback to English database if not found in requested language
    if info is None and lang != 'en':
        en_db = DISEASE_DATABASES['en']
        if key in en_db:
            info = en_db[key]
        else:
            for k in en_db:
                if k.lower() == key.lower() or k.lower() == str(disease_name).lower():
                    info = en_db[k]
                    break

    # Ultimate fallback if completely unknown
    if info is None:
        info = {
            'crop': crop_name,
            'display_name': str(disease_name).replace('_', ' '),
            'description': 'Information not available for this disease.',
            'symptoms': ['Consult a local expert for specific symptoms.'],
            'causes': ['Unknown.'],
            'prevention': ['Maintain field hygiene', 'Use certified seeds', 'Monitor crop regularly', 'Consult agricultural extension officer'],
            'treatment': ['Avoid applying chemicals without expert advice', 'Take clear photos for diagnosis', 'Remove heavily infected plants', 'Maintain optimal watering']
        }

    res = dict(info)
    causes = res.get('causes', [])
    if isinstance(causes, str):
        causes = [causes]
    res['causes'] = causes
    if 'display_name' not in res:
        res['display_name'] = key.replace('_', ' ')
    if 'crop' not in res:
        res['crop'] = crop_name
    return res

def get_all_disease_translations(disease_name, crop_name):
    """
    Return disease info across all supported languages ('en', 'hi', 'gu')
    so that frontend can dynamically switch languages instantly.
    """
    translations = {}
    for lang_code in ('en', 'hi', 'gu'):
        info = get_crop_disease_info(disease_name, crop_name, lang=lang_code)
        translations[lang_code] = {
            'disease': info.get('display_name', disease_name),
            'display_name': info.get('display_name', disease_name),
            'crop_name': get_localized_crop_name(crop_name, lang_code),
            'description': info.get('description', ''),
            'symptoms': list(info.get('symptoms', [])),
            'causes': list(info.get('causes', [])),
            'treatment': list(info.get('treatment', [])),
            'prevention': list(info.get('prevention', []))
        }
    return translations


# =============================================================================
# IMAGE VALIDATION SYSTEM
# =============================================================================

VALIDATION_CONFIG = {
    # Image quality thresholds
    'min_image_size': 50,
    'max_image_size': 10000,
    'min_brightness': 20,
    'max_brightness': 240,
    'min_contrast': 15,
    'min_sharpness': 10,
    # Plant detection (ImageNet gate)
    'non_plant_rejection_threshold': 0.40,
    # Crop verification (cross-model)
    'crop_validation_threshold': 0.40,
    'cross_crop_margin': 0.15,
    # Disease confidence
    'disease_high_confidence': 60.0,
    'disease_low_confidence': 40.0,
}

# ImageNet class labels that are clearly NOT plants/leaves
# If the ImageNet model's top prediction matches these with high confidence, reject
NON_PLANT_KEYWORDS = {
    # Vehicles
    'car', 'sports_car', 'racer', 'convertible', 'limousine', 'minivan',
    'cab', 'taxi', 'jeep', 'ambulance', 'pickup', 'truck', 'trailer_truck',
    'tow_truck', 'fire_engine', 'garbage_truck', 'moving_van',
    'bus', 'school_bus', 'trolleybus', 'minibus',
    'airliner', 'warplane', 'wing',
    'speedboat', 'catamaran', 'sailboat', 'canoe', 'gondola',
    'bicycle', 'mountain_bike', 'moped', 'motor_scooter',
    # People / Clothing
    'jersey', 'suit', 'jean', 'kimono', 'bikini', 'brassiere',
    'military_uniform', 'academic_gown', 'lab_coat', 'bow_tie',
    'swimming_trunks', 'miniskirt', 'hoopskirt', 'sarong',
    'running_shoe', 'sandal', 'clog', 'cowboy_boot', 'loafer',
    # Buildings / Structures
    'church', 'castle', 'palace', 'mosque', 'monastery',
    'cinema', 'library', 'barn', 'boathouse', 'dome',
    'triumphal_arch', 'steel_arch_bridge', 'suspension_bridge',
    'dam', 'breakwater', 'dock', 'pier', 'beacon', 'lighthouse',
    'mobile_home', 'prison', 'grocery_store', 'bookshop',
    # Electronics
    'laptop', 'desktop_computer', 'monitor', 'screen',
    'keyboard', 'mouse', 'modem', 'printer',
    'cellular_telephone', 'dial_telephone', 'pay_phone',
    'iPod', 'remote_control', 'joystick',
    'television', 'CRT_screen', 'projector',
    'hard_disc', 'CD_player', 'cassette_player',
    # Animals
    'golden_retriever', 'Labrador_retriever', 'German_shepherd',
    'poodle', 'dalmatian', 'beagle', 'boxer', 'bulldog', 'husky',
    'tabby', 'Persian_cat', 'Siamese_cat', 'Egyptian_cat',
    'tiger', 'lion', 'cheetah', 'leopard', 'jaguar',
    'elephant', 'rhinoceros', 'hippopotamus', 'zebra', 'horse',
    'cow', 'ox', 'bison', 'ram', 'llama', 'pig', 'hog',
    'monkey', 'gorilla', 'chimpanzee', 'orangutan', 'baboon',
    'panda', 'bear', 'polar_bear', 'brown_bear',
    'rabbit', 'hamster', 'guinea_pig', 'squirrel', 'fox', 'wolf',
    'eagle', 'vulture', 'owl', 'penguin', 'flamingo', 'pelican',
    'cock', 'hen', 'peacock', 'magpie', 'jay', 'robin',
    'snake', 'cobra', 'rattlesnake', 'boa', 'iguana', 'gecko',
    'turtle', 'tortoise', 'crocodile', 'alligator',
    'frog', 'tree_frog', 'toad', 'salamander', 'newt',
    'goldfish', 'shark', 'whale', 'dolphin', 'jellyfish',
    'starfish', 'sea_urchin', 'sea_cucumber', 'coral',
    'spider', 'scorpion', 'tick', 'centipede',
    'bee', 'wasp', 'ant', 'fly', 'dragonfly', 'butterfly', 'moth',
    'beetle', 'cockroach', 'cricket', 'grasshopper', 'mantis',
    'snail', 'slug', 'worm',
    # Furniture / Indoor
    'desk', 'chair', 'rocking_chair', 'folding_chair',
    'bookcase', 'filing_cabinet', 'wardrobe', 'chest',
    'table', 'pool_table', 'dining_table',
    'bed', 'cradle', 'crib',
    'toilet', 'bathtub', 'washbasin', 'shower_curtain',
    'refrigerator', 'washer', 'dishwasher', 'microwave', 'oven',
    'toaster', 'espresso_maker', 'coffeepot',
    # Tools / Objects
    'hammer', 'screwdriver', 'wrench', 'plunger', 'shovel',
    'chain_saw', 'power_drill', 'lawn_mower',
    'gun', 'rifle', 'revolver', 'assault_rifle',
    'sword', 'cleaver', 'hatchet',
    'umbrella', 'parachute', 'sleeping_bag', 'backpack',
    'suitcase', 'wallet', 'purse', 'handbag',
    'bucket', 'barrel', 'crate', 'basket',
    'bottle', 'wine_bottle', 'beer_bottle', 'water_bottle',
    'cup', 'coffee_mug', 'beer_glass', 'goblet',
    'plate', 'bowl', 'soup_bowl', 'mixing_bowl',
    'pan', 'wok', 'frying_pan', 'pot', 'caldron',
    'fork', 'spoon', 'spatula', 'ladle',
    'book', 'notebook', 'envelope', 'newspaper', 'comic_book',
    'pen', 'pencil', 'ruler', 'eraser',
    'ball', 'basketball', 'football', 'soccer_ball', 'tennis_ball',
    'baseball', 'volleyball', 'golf_ball', 'ping-pong_ball',
    'racket', 'bat',
    'guitar', 'electric_guitar', 'acoustic_guitar',
    'piano', 'organ', 'violin', 'cello', 'drum', 'harmonica',
    'flute', 'saxophone', 'trumpet', 'trombone',
    'mask', 'gas_mask', 'ski_mask',
    'helmet', 'football_helmet', 'crash_helmet',
    'hat', 'sombrero', 'cowboy_hat', 'bonnet',
    'sunglasses', 'sunglass',
    'watch', 'digital_watch', 'analog_clock', 'digital_clock', 'wall_clock',
    'hourglass',
    'camera', 'Polaroid_camera', 'reflex_camera',
    'binoculars', 'telescope', 'microscope',
    'stethoscope', 'syringe', 'Band_Aid',
    'chain', 'necklace', 'ring',
    'candle', 'torch', 'lamp', 'lampshade', 'chandelier',
    'jack-o-lantern',
    'barbell', 'dumbbell',
    'iron', 'sewing_machine', 'vacuum',
    'slot', 'pinball_machine',
    'jigsaw_puzzle', 'crossword_puzzle',
    'teddy', 'doll',
    # Food (non-plant raw food)
    'pizza', 'hamburger', 'hotdog', 'cheeseburger',
    'meat_loaf', 'burrito', 'taco',
    'ice_cream', 'chocolate_sauce', 'pretzel',
    'bagel', 'French_loaf', 'dough',
}

def _load_imagenet_model():
    """
    Load the full ImageNet MobileNetV2 classifier for plant/leaf validation.
    Cached in MODEL_CACHE['_imagenet_validator'].
    """
    cache_key = '_imagenet_validator'
    if cache_key in MODEL_CACHE:
        return MODEL_CACHE[cache_key]
    
    if not TENSORFLOW_AVAILABLE:
        MODEL_CACHE[cache_key] = None
        return None
    
    with _model_lock:
        if cache_key in MODEL_CACHE:
            return MODEL_CACHE[cache_key]
        try:
            load_start = time.time()
            imagenet_model = tf.keras.applications.MobileNetV2(
                weights='imagenet',
                include_top=True,
                input_shape=(224, 224, 3)
            )
            load_time = (time.time() - load_start) * 1000
            print("[OK] ImageNet validation model loaded ({:.0f}ms).".format(load_time))
            MODEL_CACHE[cache_key] = imagenet_model
            return imagenet_model
        except Exception as e:
            print("[ERROR] Failed to load ImageNet validation model: {}".format(e))
            MODEL_CACHE[cache_key] = None
            return None

def validate_image_quality(image_path, crop_name='potato', lang='en'):
    """
    Check basic image quality using PIL (no ML model needed).
    
    Returns dict: {'valid': bool, 'reason': str or None, 'reason_code': str or None}
    """
    crop_disp = get_localized_crop_name(crop_name, lang)
    try:
        img = Image.open(image_path).convert('RGB')
    except Exception as e:
        if lang == 'gu':
            msg = "છબી ફાઇલ ખોલી શકાતી નથી."
        elif lang == 'hi':
            msg = "छवि फ़ाइल नहीं खोली जा सकी।"
        else:
            msg = "Cannot open image file: {}".format(str(e))
        return {'valid': False, 'reason': msg, 'reason_code': 'invalid_file'}
    
    width, height = img.size
    config = VALIDATION_CONFIG
    
    # Check dimensions
    if width < config['min_image_size'] or height < config['min_image_size']:
        if lang == 'gu':
            msg = "છબી ખૂબ નાની છે ({}x{}). કૃપા કરીને સ્પષ્ટ છબી અપલોડ કરો.".format(width, height)
        elif lang == 'hi':
            msg = "छवि बहुत छोटी है ({}x{})। कृपया स्पष्ट तस्वीर अपलोड करें।".format(width, height)
        else:
            msg = "Image is too small ({}x{}). Minimum size is {}x{} pixels.".format(
                width, height, config['min_image_size'], config['min_image_size'])
        return {'valid': False, 'reason': msg, 'reason_code': 'image_quality'}
    
    if width > config['max_image_size'] or height > config['max_image_size']:
        return {'valid': False, 'reason': 'Image is too large ({}x{}).'.format(width, height), 'reason_code': 'image_quality'}
    
    # Convert to numpy for statistical checks
    img_array = np.array(img, dtype=np.float32)
    
    # Check brightness (average pixel value)
    mean_brightness = np.mean(img_array)
    if mean_brightness < config['min_brightness']:
        if lang == 'gu':
            msg = "છબી ખૂબ ઘેરી/અંધારી છે. કૃપા કરીને યોગ્ય પ્રકાશવાળી સ્પષ્ટ છબી અપલોડ કરો."
        elif lang == 'hi':
            msg = "छवि बहुत गहरी/अंधेरी है। कृपया अच्छी रोशनी वाली स्पष्ट तस्वीर अपलोड करें।"
        else:
            msg = "Image is too dark. Please upload a well-lit photo."
        return {'valid': False, 'reason': msg, 'reason_code': 'image_quality'}
    if mean_brightness > config['max_brightness']:
        if lang == 'gu':
            msg = "છબી ખૂબ તેજસ્વી/ઓવરએક્સપોઝ્ડ છે. કૃપા કરીને સ્પષ્ટ છબી અપલોડ કરો."
        elif lang == 'hi':
            msg = "छवि बहुत अधिक चमकीली है। कृपया स्पष्ट तस्वीर अपलोड करें।"
        else:
            msg = "Image is too bright or overexposed."
        return {'valid': False, 'reason': msg, 'reason_code': 'image_quality'}
    
    # Check contrast (standard deviation of pixel values)
    contrast = np.std(img_array)
    if contrast < config['min_contrast']:
        if lang == 'gu':
            msg = "છબીમાં કોન્ટ્રાસ્ટ ઓછો છે. કૃપા કરીને પાનની સ્પષ્ટ છબી અપલોડ કરો."
        elif lang == 'hi':
            msg = "छवि में कंट्रास्ट बहुत कम है। कृपया स्पष्ट तस्वीर अपलोड करें।"
        else:
            msg = "Image has very low contrast. It may be blank or uniform."
        return {'valid': False, 'reason': msg, 'reason_code': 'image_quality'}
    
    # Check sharpness using Laplacian variance (blur detection)
    gray = np.mean(img_array, axis=2)
    laplacian_var = np.var(
        gray[1:-1, 1:-1] * 4 - gray[:-2, 1:-1] - gray[2:, 1:-1] - gray[1:-1, :-2] - gray[1:-1, 2:]
    )
    if laplacian_var < config['min_sharpness']:
        if lang == 'gu':
            if (crop_name or '').lower() == 'potato':
                msg = "છબી સ્પષ્ટ નથી. કૃપા કરીને બટાકાના પાનની વધુ સ્પષ્ટ છબી અપલોડ કરો."
            else:
                msg = "છબી સ્પષ્ટ નથી. કૃપા કરીને {}ના પાનની વધુ સ્પષ્ટ છબી અપલોડ કરો.".format(crop_disp)
        elif lang == 'hi':
            if (crop_name or '').lower() == 'potato':
                msg = "छवि स्पष्ट नहीं है। कृपया आलू की पत्ती की अधिक स्पष्ट तस्वीर अपलोड करें।"
            else:
                msg = "छवि स्पष्ट नहीं है। कृपया {} की पत्ती की अधिक स्पष्ट तस्वीर अपलोड करें।".format(crop_disp)
        else:
            msg = "Image appears blurry. Please upload a clearer image of a {} leaf.".format(crop_disp)
        return {'valid': False, 'reason': msg, 'reason_code': 'image_quality'}
    
    return {'valid': True, 'reason': None, 'reason_code': None}

def validate_plant_image(image_path, crop_name='potato', lang='en'):
    """
    Use ImageNet MobileNetV2 to check if the image contains a plant/leaf.
    Rejects images that are clearly non-plant objects (cars, people, buildings, etc.).
    
    Returns dict: {'valid': bool, 'is_plant': bool, 'top_prediction': str, 'confidence': float, 'reason': str or None, 'reason_code': str or None}
    """
    imagenet_model = _load_imagenet_model()
    crop_disp = get_localized_crop_name(crop_name, lang)
    
    if imagenet_model is None:
        # If ImageNet model unavailable, skip this check (allow through)
        return {'valid': True, 'is_plant': True, 'top_prediction': 'unknown',
                'confidence': 0.0, 'reason': None, 'reason_code': None}
    
    try:
        # Preprocess for ImageNet
        img = Image.open(image_path).convert('RGB')
        img = img.resize((224, 224), Image.LANCZOS)
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        # ImageNet MobileNetV2 expects pixels in [-1, 1] range
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
        
        # Run ImageNet prediction
        predictions = imagenet_model(img_array, training=False)
        decoded = tf.keras.applications.mobilenet_v2.decode_predictions(
            predictions.numpy(), top=5
        )[0]
        
        top_label = decoded[0][1]  # e.g. 'golden_retriever'
        top_confidence = float(decoded[0][2])  # e.g. 0.95
        
        # Check if top prediction is clearly a non-plant object
        threshold = VALIDATION_CONFIG['non_plant_rejection_threshold']
        
        # Check top-3 predictions for non-plant matches
        for _, label, conf in decoded[:3]:
            label_lower = label.lower()
            label_words = set(label_lower.replace('-', '_').split('_'))
            keyword_match = label_words & {k.lower() for k in NON_PLANT_KEYWORDS}
            full_match = label in NON_PLANT_KEYWORDS or label_lower in {k.lower() for k in NON_PLANT_KEYWORDS}
            
            if (keyword_match or full_match) and conf > threshold:
                if lang == 'gu':
                    if (crop_name or '').lower() == 'potato':
                        msg = "આ છબી બટાકાના પાનની લાગતી નથી. કૃપા કરીને બટાકાના પાનની સ્પષ્ટ છબી અપલોડ કરો."
                    else:
                        msg = "આ છબી {}ના પાનની લાગતી નથી. કૃપા કરીને {}ના પાનની સ્પષ્ટ છબી અપલોડ કરો.".format(crop_disp, crop_disp)
                elif lang == 'hi':
                    if (crop_name or '').lower() == 'potato':
                        msg = "यह छवि आलू की पत्ती जैसी नहीं लग रही है। कृपया आलू की पत्ती की स्पष्ट तस्वीर अपलोड करें।"
                    else:
                        msg = "यह छवि {} की पत्ती जैसी नहीं लग रही है। कृपया {} की पत्ती की स्पष्ट तस्वीर अपलोड करें।".format(crop_disp, crop_disp)
                else:
                    msg = "This image does not appear to be a plant leaf (detected: {}). Please upload a clear image of a {} leaf.".format(
                        label.replace('_', ' '), crop_disp)

                return {
                    'valid': False,
                    'is_plant': False,
                    'top_prediction': label,
                    'confidence': conf,
                    'reason': msg,
                    'reason_code': 'not_potato' if (crop_name or '').lower() == 'potato' else 'not_plant'
                }
        
        return {
            'valid': True,
            'is_plant': True,
            'top_prediction': top_label,
            'confidence': top_confidence,
            'reason': None,
            'reason_code': None
        }
        
    except Exception as e:
        print("[WARN] Plant validation failed: {}".format(e))
        return {'valid': True, 'is_plant': True, 'top_prediction': 'error',
                'confidence': 0.0, 'reason': None, 'reason_code': None}

def validate_crop_match(crop_name, image_path, lang='en'):
    """
    Crop verification layer.
    
    CRITICAL ARCHITECTURAL NOTE:
    We DO NOT run independent single-crop disease models against each other
    (e.g., comparing a 2-class Pepper disease model with a 7-class Potato model).
    Softmax outputs across different class cardinalities are uncalibrated and
    cause 2-class models to falsely dominate with ~98% confidence on out-of-distribution
    leaves, producing the broken 'appears to be Pepper' bug.
    
    If a dedicated multi-crop classification model exists (model/crop_classifier.keras),
    it is invoked here. Otherwise, the system safely passes the image to the selected
    crop model and enforces strict confidence thresholding to prevent false predictions.
    """
    crop_disp = get_localized_crop_name(crop_name, lang)
    crop_classifier_path = 'model/crop_classifier.keras'
    
    if os.path.exists(crop_classifier_path):
        try:
            m = tf.keras.models.load_model(crop_classifier_path)
            img_arr = preprocess_image(image_path)
            preds = m(img_arr, training=False)[0].numpy()
            predicted_crop_idx = int(np.argmax(preds))
            crop_list = ['groundnut', 'pepper', 'potato', 'tomato']
            predicted_crop = crop_list[predicted_crop_idx] if predicted_crop_idx < len(crop_list) else crop_name
            max_conf = float(preds[predicted_crop_idx])
            
            if predicted_crop != crop_name and max_conf >= 0.70:
                pred_disp = get_localized_crop_name(predicted_crop, lang)
                if lang == 'gu':
                    msg = "આ છબી {}ના બદલે {}ના પાનની લાગે છે. કૃપા કરીને {}ના પાનની છબી અપલોડ કરો.".format(crop_disp, pred_disp, crop_disp)
                elif lang == 'hi':
                    msg = "यह छवि {} के बजाय {} की पत्ती प्रतीत होती है। कृपया {} की पत्ती अपलोड करें।".format(crop_disp, pred_disp, crop_disp)
                else:
                    msg = "The uploaded image appears to be a {} leaf, not {}. Please upload a {} leaf image.".format(pred_disp, crop_disp, crop_disp)
                return {
                    'valid': False,
                    'best_crop': predicted_crop,
                    'confidence': max_conf,
                    'reason': msg,
                    'reason_code': 'wrong_crop'
                }
        except Exception as e:
            print("[WARN] Crop classifier evaluation failed: {}".format(e))
    
    # Safe fallback when no dedicated crop classifier exists:
    # Do not execute pseudo-cross-model checks that cause false Pepper detections.
    return {
        'valid': True,
        'best_crop': crop_name,
        'confidences': {},
        'reason': None,
        'reason_code': None
    }

def validate_crop_image(crop_name, image_path, lang='en'):
    """
    Main validation orchestrator. Runs validation layers in sequence:
        1. Image Quality (PIL-based)
        2. Plant/Leaf Detection (ImageNet MobileNetV2)
        3. Dedicated Crop Verification (if classifier available)
    """
    print("[VALIDATE] Starting validation for crop '{}' (lang: {}): {}".format(crop_name, lang, image_path))
    
    # Layer 1: Image Quality
    quality = validate_image_quality(image_path, crop_name=crop_name, lang=lang)
    if not quality['valid']:
        print("[VALIDATE] REJECTED (quality): {}".format(quality['reason']))
        return {
            'valid': False,
            'error_type': 'IMAGE_QUALITY',
            'reason_code': quality.get('reason_code', 'image_quality'),
            'reason': quality['reason'],
            'crop': crop_name,
            'details': quality
        }
    
    # Layer 2: Plant/Leaf Detection
    plant_check = validate_plant_image(image_path, crop_name=crop_name, lang=lang)
    if not plant_check['valid']:
        print("[VALIDATE] REJECTED (not plant): {} (conf={:.2f})".format(
            plant_check['top_prediction'], plant_check['confidence']))
        return {
            'valid': False,
            'error_type': 'NOT_PLANT',
            'reason_code': plant_check.get('reason_code', 'not_plant'),
            'reason': plant_check['reason'],
            'crop': crop_name,
            'details': plant_check
        }
    
    # Layer 3: Crop Verification
    crop_check = validate_crop_match(crop_name, image_path, lang=lang)
    if not crop_check['valid']:
        error_type = 'WRONG_CROP' if crop_check.get('best_crop') != crop_name else 'INVALID_CROP_IMAGE'
        print("[VALIDATE] REJECTED (crop mismatch): best={}, selected={}".format(
            crop_check.get('best_crop'), crop_name))
        return {
            'valid': False,
            'error_type': error_type,
            'reason_code': crop_check.get('reason_code', 'wrong_crop'),
            'reason': crop_check['reason'],
            'crop': crop_name,
            'details': crop_check
        }
    
    print("[VALIDATE] PASSED all checks for '{}'".format(crop_name))
    return {
        'valid': True,
        'error_type': None,
        'reason_code': None,
        'reason': None,
        'crop': crop_name,
        'details': {
            'quality': quality,
            'plant_check': plant_check,
            'crop_check': crop_check
        }
    }

def warmup_models():
    """
    Pre-load all available crop models at startup for faster first predictions.
    Called by app.py during server initialization.
    """
    loaded = 0
    for crop_name in CROP_CLASSES:
        m = load_crop_model(crop_name)
        if m is not None:
            loaded += 1
            # Warm up with a dummy prediction to compile the graph
            dummy_input = np.zeros((1, 224, 224, 3), dtype=np.float32)
            _ = m(dummy_input, training=False)
    # Also preload the ImageNet validation model
    imagenet_m = _load_imagenet_model()
    if imagenet_m is not None:
        dummy = np.zeros((1, 224, 224, 3), dtype=np.float32)
        _ = imagenet_m(dummy, training=False)
        print("[WARMUP] ImageNet validation model ready.")
    print("[WARMUP] Pre-loaded {} model(s), {} in demo mode.".format(
        loaded, len(CROP_CLASSES) - loaded))
    return loaded

# =============================================================================
# Quick self-test — run this file directly to see a demo prediction
# =============================================================================
if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("  LeafGuard AI — predict.py self-test")
    print("=" * 60)

    # Try to load the model (will likely be None if not trained yet)
    model = load_model('model/trained_model.h5')

    # Show the mode we're in
    if model is None:
        print("\n[INFO] Running in DEMO mode (no trained model found).\n")
    else:
        print("\n[INFO] Running in REAL mode (model loaded).\n")

    # Show disease info for each class
    for disease in DISEASE_CLASSES:
        info = get_disease_info(disease)
        print("Disease: {}".format(disease))
        print("  Causes: {}".format(info['causes'][:80]) + "...")
        print("  Treatment steps: {}".format(len(info['treatment'])))
        print("  Prevention steps: {}".format(len(info['prevention'])))
        print()

    print("[OK] Self-test complete.")
