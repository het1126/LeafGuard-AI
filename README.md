# 🌿 LeafGuard AI — Smart Farming Platform

![LeafGuard Banner](static/logo/leafguard_logo.png)

**AI-powered crop disease detection** that helps farmers identify plant diseases from leaf images and provides treatment suggestions in multiple Indian languages.

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| 🔬 **AI Disease Detection** | Detect groundnut leaf diseases using MobileNetV2 deep learning |
| 📸 **Image Upload & Camera** | Upload images or use phone camera directly |
| 🌍 **Multi-Language Support** | English, हिन्दी (Hindi), ગુજરાતી (Gujarati) |
| 💊 **Treatment Suggestions** | Detailed treatment and prevention tips per disease |
| 📱 **Mobile Responsive** | Fully responsive design, works on all devices |
| 🎨 **Modern UI** | Premium design with animations, glassmorphism, dark agriculture theme |
| 🚀 **Demo Mode** | Works instantly without a trained model (uses simulated predictions) |

---

## 🦠 Supported Diseases (Groundnut)

| # | Disease | Key Symptom |
|---|---------|-------------|
| 1 | ✅ Healthy | No disease — leaf looks normal |
| 2 | 🔴 Leaf Spot | Circular dark spots (Cercospora fungus) |
| 3 | 🟠 Rust | Orange-brown pustules on undersides (Puccinia fungus) |
| 4 | 🟤 Alternaria Leaf Spot | Irregular brown lesions with concentric rings |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python 3.10+, Flask 3.1 |
| **AI/ML** | TensorFlow 2.19, Keras, MobileNetV2 |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Fonts** | Google Fonts (Outfit, Inter) |
| **Image Processing** | Pillow (PIL) |
| **Production Server** | Waitress (Windows) / Gunicorn (Linux) |

---

## 📁 Project Structure

```
LeafGuard/
│
├── app.py                  # Flask web server (main entry)
├── predict.py              # Prediction module (real + demo mode)
├── train_model.py          # Model training script (MobileNetV2)
├── requirements.txt        # Python dependencies
├── README.md               # This file
│
├── dataset/                # Training images (user-provided)
│   ├── train/
│   │   ├── Healthy/
│   │   ├── Leaf_Spot/
│   │   ├── Rust/
│   │   └── Alternaria_Leaf_Spot/
│   └── test/
│       ├── Healthy/
│       ├── Leaf_Spot/
│       ├── Rust/
│       └── Alternaria_Leaf_Spot/
│
├── model/                  # Trained model files (auto-generated)
│   ├── trained_model.h5
│   ├── labels.txt
│   ├── training_accuracy.png
│   └── training_loss.png
│
├── static/
│   ├── css/style.css       # Stylesheet
│   ├── js/
│   │   ├── main.js         # App logic (upload, prediction, UI)
│   │   └── language.js     # Multi-language system
│   ├── languages/
│   │   ├── en.json         # English translations
│   │   ├── hi.json         # Hindi translations
│   │   └── gu.json         # Gujarati translations
│   ├── logo/
│   │   └── leafguard_logo.png
│   └── uploads/            # Uploaded images (auto-created)
│
└── templates/
    ├── index.html          # Main page (upload + results)
    └── result.html         # Standalone result page
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Python 3.10 or higher** — [Download Python](https://www.python.org/downloads/)
- **pip** (comes with Python)
- **Git** (optional) — [Download Git](https://git-scm.com/)

### Step 1: Clone / Download the Project

```bash
# Clone with Git
git clone https://github.com/your-username/LeafGuard.git
cd LeafGuard

# Or download and extract the ZIP file, then navigate into the folder
```

### Step 2: Create a Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate it:
# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

> **Note:** TensorFlow is ~500 MB. If you just want to see the demo (no real AI), you can skip TensorFlow:
> ```bash
> pip install Flask Pillow numpy waitress
> ```
> The app will automatically run in **demo mode** with simulated predictions.

### Step 4: Run the App

```bash
python app.py
```

Open your browser and go to: **http://localhost:5000**

You should see the LeafGuard homepage! 🎉

---

## 📊 Dataset Setup (For Training)

### Recommended Datasets

| Dataset | Source | Images | Link |
|---------|--------|--------|------|
| Groundnut Leaf Disease Dataset | Kaggle | ~1,000+ | [Download](https://www.kaggle.com/datasets/nirmalsankalana/groundnut-leaf-disease-dataset) |
| Novel Groundnut Leaf Dataset | Mendeley | 1,720 | [Download](https://data.mendeley.com/datasets/v52z675g27/1) |
| Large-Scale Groundnut Dataset | Mendeley | 10,361 | [Download](https://data.mendeley.com/datasets/22p2vcbxfk/3) |

### Organize the Dataset

After downloading, organize images into this structure:

```
dataset/
├── train/
│   ├── Healthy/           # ~70% of healthy leaf images
│   ├── Leaf_Spot/         # ~70% of leaf spot images
│   ├── Rust/              # ~70% of rust images
│   └── Alternaria_Leaf_Spot/  # ~70% of alternaria images
└── test/
    ├── Healthy/           # ~30% of healthy leaf images
    ├── Leaf_Spot/         # ~30% of leaf spot images
    ├── Rust/              # ~30% of rust images
    └── Alternaria_Leaf_Spot/  # ~30% of alternaria images
```

> **Tip:** Put approximately 70% of images in `train/` and 30% in `test/`. The training script automatically creates a validation split from the training data.

---

## 🧠 Model Training

Once your dataset is organized:

```bash
python train_model.py
```

### What happens:

1. **Phase 1** — Feature extraction: Frozen MobileNetV2 base, trains custom head (15 epochs)
2. **Phase 2** — Fine-tuning: Unfreezes top layers, trains at lower learning rate (10 epochs)
3. **Saves** model to `model/trained_model.h5`
4. **Generates** training graphs: `model/training_accuracy.png`, `model/training_loss.png`
5. **Prints** classification report with precision, recall, F1-score

### Training Configuration

| Parameter | Value |
|-----------|-------|
| Input Size | 224 × 224 px |
| Batch Size | 32 |
| Phase 1 Epochs | 15 |
| Phase 2 Epochs | 10 |
| Optimizer | Adam |
| Loss Function | Categorical Crossentropy |
| Augmentation | Rotation, zoom, flip, brightness |

---

## 🌐 Running the Web App

### Development Mode

```bash
python app.py
```
Opens at http://localhost:5000 with auto-reload enabled.

### Production Mode (Windows)

```bash
pip install waitress
waitress-serve --port=5000 app:app
```

### Production Mode (Linux/macOS)

```bash
pip install gunicorn
gunicorn -w 2 -b 0.0.0.0:5000 app:app
```

---

## 🌍 Language Support

The platform supports three languages with a one-click switcher:

| Language | Code | Native Name |
|----------|------|-------------|
| English | `en` | English |
| Hindi | `hi` | हिन्दी |
| Gujarati | `gu` | ગુજરાતી |

### Adding a New Language

1. Create a new JSON file in `static/languages/` (e.g., `mr.json` for Marathi)
2. Copy the structure from `en.json` and translate all values
3. Add the language option to the `<select>` dropdown in `templates/index.html`
4. Add the language to `SUPPORTED_LANGUAGES` in `static/js/language.js`

---

## 📡 API Documentation

### `POST /predict`

Upload a leaf image for disease prediction.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` — image file (JPG, PNG, WEBP, GIF)

**Response (JSON):**
```json
{
  "disease": "Leaf_Spot",
  "confidence": 94.5,
  "all_predictions": {
    "Healthy": 2.1,
    "Leaf_Spot": 94.5,
    "Rust": 1.8,
    "Alternaria_Leaf_Spot": 1.6
  },
  "causes": ["Caused by Cercospora arachidicola fungus.", "..."],
  "treatment": ["Apply Mancozeb (2.5 g/L) fungicide spray.", "..."],
  "prevention": ["Use disease-resistant groundnut varieties.", "..."],
  "image_url": "/static/uploads/leaf_photo.jpg"
}
```

### `GET /api/language/<lang>`

Get translation strings for a language.

**Example:** `GET /api/language/hi`

**Response:** JSON object with all Hindi translation keys.

---

## 🚢 Deployment

### Render

1. Create a `render.yaml` or use the Render dashboard
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `gunicorn -b 0.0.0.0:$PORT app:app`

### Railway

1. Connect your GitHub repo
2. Railway auto-detects Python projects
3. Set start command in Procfile: `web: gunicorn app:app`

### PythonAnywhere

1. Upload project files
2. Create a new web app → Manual configuration → Python 3.10
3. Set WSGI file to point to `app.py`
4. Install requirements: `pip install -r requirements.txt`

---

## 🔮 Future Roadmap

- [ ] 🌾 More crop support (Potato, Tomato, Cotton, Wheat, Rice)
- [ ] 🤖 AI Chatbot for farming queries
- [ ] 🌤️ Weather integration
- [ ] 🧪 Fertilizer recommendation engine
- [ ] 📊 Farmer dashboard with history
- [ ] 📹 Real-time camera detection
- [ ] 📱 Mobile app (React Native / Flutter)
- [ ] 📈 Yield prediction
- [ ] 🗣️ Voice assistant support
- [ ] 🏥 Disease history tracking

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **TensorFlow / Keras** for deep learning framework
- **MobileNetV2** architecture by Google
- **Kaggle & Mendeley** for agricultural datasets
- **Flask** for the lightweight web framework
- All **farmers** who inspire smarter agriculture 🌾

---

<p align="center">
  <b>🌿 LeafGuard — Protecting Crops, Empowering Farmers 🌿</b>
</p>
