# =============================================================================
# LeafGuard AI — Smart Farming Platform
# train_model.py — Model Training Script
# =============================================================================
#
# This script trains a deep learning model to classify groundnut leaf diseases
# using Transfer Learning with MobileNetV2 (pre-trained on ImageNet).
#
# Training Strategy (Two Phases):
#   Phase 1 — Feature Extraction:
#       Freeze the MobileNetV2 base and only train the custom classification
#       head.  This is fast and lets the new layers learn to use the features
#       that MobileNetV2 already knows.
#
#   Phase 2 — Fine-Tuning:
#       Unfreeze the top layers of MobileNetV2 and train the whole network
#       with a very small learning rate.  This adapts the pre-trained features
#       to our specific groundnut leaf images.
#
# Dataset structure (auto-detected):
#   dataset/
#   └── A novel groundnut leaf dataset.../
#       ├── ALTERNARIA LEAF SPOT/   (450 images)
#       ├── HEALTHY/                (600 images)
#       ├── LEAF SPOT (EARLY AND LATE)/ (450 images)
#       ├── ROSETTE/                (100 images)
#       └── RUST/                   (120 images)
#
# The script automatically splits this into train/val/test sets (80/10/10).
#
# Output:
#   model/trained_model.h5      — final trained model
#   model/labels.txt            — list of class names
#   model/training_accuracy.png — accuracy plot
#   model/training_loss.png     — loss plot
#
# Usage:
#   python train_model.py
# =============================================================================

import os
import shutil
import random
import numpy as np
import matplotlib
# Use non-interactive backend so plots can be saved without a display/GUI
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# TensorFlow & Keras imports
import tensorflow as tf
from keras.src.legacy.preprocessing.image import ImageDataGenerator  # noqa: E501
from keras.applications import MobileNetV2
from keras.layers import (
    GlobalAveragePooling2D,
    BatchNormalization,
    Dense,
    Dropout
)
from keras.models import Model
from keras.optimizers import Adam
from keras.callbacks import (
    EarlyStopping,
    ModelCheckpoint,
    ReduceLROnPlateau
)

# Scikit-learn for evaluation metrics
from sklearn.metrics import classification_report
from sklearn.utils.class_weight import compute_class_weight

# =============================================================================
# CONSTANTS — Easy to change in one place
# =============================================================================

# Image size expected by MobileNetV2
IMG_SIZE = 224

# Number of images per training batch
# Smaller batch = less memory needed, but slower training
BATCH_SIZE = 32

# Phase 1: Train only the custom head (base model frozen)
EPOCHS_PHASE1 = 15

# Phase 2: Fine-tune top layers of the base model
EPOCHS_PHASE2 = 10

# Path to the raw dataset folder (all classes in one directory)
RAW_DATASET_DIR = os.path.join(
    'dataset',
    'A novel groundnut leaf dataset for detection and classification of groundnut leaf diseases'
)

# Path where the auto-split dataset will be created
SPLIT_DATASET_DIR = os.path.join('dataset', 'split')

# Path where the trained model and outputs will be saved
MODEL_DIR = 'model'

# Train / Validation / Test split ratios
TRAIN_RATIO = 0.80
VAL_RATIO   = 0.10
TEST_RATIO  = 0.10

# Random seed for reproducibility
SEED = 42


# =============================================================================
# HELPER: Auto-split dataset into train / val / test
# =============================================================================
def split_dataset(source_dir, dest_dir, train_ratio, val_ratio, test_ratio, seed=42):
    """
    Split a flat class-folder dataset into train/val/test subdirectories.

    Args:
        source_dir: Path to the folder containing one subfolder per class.
        dest_dir:   Path where train/, val/, test/ subfolders will be created.
        train_ratio, val_ratio, test_ratio: Split proportions (must sum to 1).
        seed: Random seed for reproducibility.

    Returns:
        dict: Summary of how many images went into each split per class.
    """
    assert abs(train_ratio + val_ratio + test_ratio - 1.0) < 1e-6, \
        "Split ratios must sum to 1.0"

    random.seed(seed)
    splits = ['train', 'val', 'test']
    summary = {}

    # Get all class folders
    class_names = sorted([
        d for d in os.listdir(source_dir)
        if os.path.isdir(os.path.join(source_dir, d))
    ])

    print("   Found {} classes: {}".format(len(class_names), class_names))

    for class_name in class_names:
        class_path = os.path.join(source_dir, class_name)

        # Collect all image files in this class folder
        images = [
            f for f in os.listdir(class_path)
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff', '.webp'))
        ]
        random.shuffle(images)

        # Calculate split indices
        total = len(images)
        train_end = int(total * train_ratio)
        val_end   = train_end + int(total * val_ratio)

        split_images = {
            'train': images[:train_end],
            'val':   images[train_end:val_end],
            'test':  images[val_end:]
        }

        summary[class_name] = {}

        for split_name in splits:
            # Create destination directory
            split_class_dir = os.path.join(dest_dir, split_name, class_name)
            os.makedirs(split_class_dir, exist_ok=True)

            # Copy images
            for img_name in split_images[split_name]:
                src = os.path.join(class_path, img_name)
                dst = os.path.join(split_class_dir, img_name)
                if not os.path.exists(dst):
                    shutil.copy2(src, dst)

            summary[class_name][split_name] = len(split_images[split_name])

    return summary


# =============================================================================
# MAIN TRAINING FUNCTION
# =============================================================================
def main():
    """
    Main training pipeline — call this function to train the model.

    Steps:
    1. Create output directories
    2. Auto-split dataset into train/val/test
    3. Set up data generators with augmentation
    4. Build the MobileNetV2 transfer learning model
    5. Phase 1: Train the custom head (base frozen)
    6. Phase 2: Fine-tune top layers of MobileNetV2
    7. Evaluate on the test set
    8. Save the model, labels, and plots
    """

    print("\n" + "=" * 60)
    print("  [LEAFGUARD] LeafGuard AI - Model Training")
    print("=" * 60)
    print("  TensorFlow version: {}".format(tf.__version__))
    print("  GPU available: {}".format(
        "Yes" if tf.config.list_physical_devices('GPU') else "No (using CPU)"
    ))
    print("=" * 60 + "\n")

    # =========================================================================
    # STEP 1: Create output directories
    # =========================================================================
    os.makedirs(MODEL_DIR, exist_ok=True)
    print("[DIR] Model output directory: '{}'".format(os.path.abspath(MODEL_DIR)))

    # =========================================================================
    # STEP 2: Auto-split dataset into train / val / test
    # =========================================================================
    # If the split directory already exists and has data, skip splitting.
    # Delete the split/ folder to re-split from scratch.
    # =========================================================================

    train_dir = os.path.join(SPLIT_DATASET_DIR, 'train')
    val_dir   = os.path.join(SPLIT_DATASET_DIR, 'val')
    test_dir  = os.path.join(SPLIT_DATASET_DIR, 'test')

    if os.path.exists(train_dir) and len(os.listdir(train_dir)) > 0:
        print("\n[DIR] Split dataset already exists at '{}'".format(
            os.path.abspath(SPLIT_DATASET_DIR)
        ))
        print("   (Delete the 'dataset/split' folder to re-split from scratch)")
    else:
        print("\n[SPLIT] Splitting dataset into train/val/test ({}/{}/{})...".format(
            int(TRAIN_RATIO * 100),
            int(VAL_RATIO * 100),
            int(TEST_RATIO * 100)
        ))
        print("   Source: '{}'".format(os.path.abspath(RAW_DATASET_DIR)))

        summary = split_dataset(
            source_dir=RAW_DATASET_DIR,
            dest_dir=SPLIT_DATASET_DIR,
            train_ratio=TRAIN_RATIO,
            val_ratio=VAL_RATIO,
            test_ratio=TEST_RATIO,
            seed=SEED
        )

        print("\n   Split Summary:")
        print("   {:<30s} {:>6s} {:>6s} {:>6s} {:>6s}".format(
            "Class", "Train", "Val", "Test", "Total"
        ))
        print("   " + "-" * 58)
        total_train = total_val = total_test = 0
        for cls_name, counts in summary.items():
            t, v, te = counts['train'], counts['val'], counts['test']
            total_train += t
            total_val   += v
            total_test  += te
            print("   {:<30s} {:>6d} {:>6d} {:>6d} {:>6d}".format(
                cls_name, t, v, te, t + v + te
            ))
        print("   " + "-" * 58)
        print("   {:<30s} {:>6d} {:>6d} {:>6d} {:>6d}".format(
            "TOTAL", total_train, total_val, total_test,
            total_train + total_val + total_test
        ))
        print("\n   [OK] Dataset split complete!")

    # =========================================================================
    # STEP 3: Set up Data Generators with Augmentation
    # =========================================================================
    # Data augmentation artificially increases the diversity of our training
    # data by applying random transformations (rotation, zoom, flip, etc.).
    # This helps the model generalize better and reduces overfitting.
    # =========================================================================

    print("\n[INFO] Setting up data generators...")

    # --- Training data generator WITH augmentation ---
    # These random transformations are only applied during training,
    # NOT during validation or testing.
    train_datagen = ImageDataGenerator(
        # Normalize pixel values to [0, 1]
        rescale=1.0 / 255.0,

        # Randomly rotate images up to 30 degrees
        rotation_range=30,

        # Randomly shift images horizontally by up to 20% of width
        width_shift_range=0.2,

        # Randomly shift images vertically by up to 20% of height
        height_shift_range=0.2,

        # Randomly zoom in/out by up to 20%
        zoom_range=0.2,

        # Randomly flip images horizontally (leaf can face either way)
        horizontal_flip=True,

        # Randomly adjust brightness (80% to 120% of original)
        brightness_range=[0.8, 1.2],

        # Random shear transformation
        shear_range=0.15,

        # Fill mode for points outside the boundaries
        fill_mode='nearest'
    )

    # --- Validation / Test data generator (NO augmentation) ---
    # For validation and testing we only normalize — no random transforms.
    # We want to evaluate on "clean" images.
    val_test_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0
    )

    # --- Create data flows ---
    print("[DIR] Training data:   '{}'".format(os.path.abspath(train_dir)))
    print("[DIR] Validation data: '{}'".format(os.path.abspath(val_dir)))
    print("[DIR] Test data:       '{}'".format(os.path.abspath(test_dir)))

    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(IMG_SIZE, IMG_SIZE),    # Resize all images to 224×224
        batch_size=BATCH_SIZE,
        class_mode='categorical',            # One-hot encoded labels
        shuffle=True                         # Shuffle for better training
    )

    validation_generator = val_test_datagen.flow_from_directory(
        val_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=False                        # No shuffle for consistent evaluation
    )

    test_generator = val_test_datagen.flow_from_directory(
        test_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=False                        # Keep order for classification report
    )

    # Print dataset summary
    num_classes = len(train_generator.class_indices)
    print("\n[INFO] Dataset Summary:")
    print("   Training samples:   {}".format(train_generator.samples))
    print("   Validation samples: {}".format(validation_generator.samples))
    print("   Test samples:       {}".format(test_generator.samples))
    print("   Number of classes:  {}".format(num_classes))
    print("   Class mapping:      {}".format(train_generator.class_indices))

    # =========================================================================
    # STEP 3b: Compute Class Weights (handle imbalanced classes)
    # =========================================================================
    # ROSETTE (100) and RUST (120) have far fewer images than HEALTHY (600).
    # Class weights tell the model to "pay more attention" to rare classes
    # so it doesn't just predict the majority class all the time.
    # =========================================================================

    print("\n[BALANCE] Computing class weights for imbalanced classes...")
    class_weights_array = compute_class_weight(
        class_weight='balanced',
        classes=np.unique(train_generator.classes),
        y=train_generator.classes
    )
    class_weights = dict(enumerate(class_weights_array))
    print("   Class weights: {}".format(
        {list(train_generator.class_indices.keys())[k]: round(v, 3)
         for k, v in class_weights.items()}
    ))

    # =========================================================================
    # STEP 4: Build the MobileNetV2 Transfer Learning Model
    # =========================================================================
    # Transfer learning = take a model trained on millions of images (ImageNet)
    # and adapt it to our specific task (groundnut leaf diseases).
    #
    # MobileNetV2 is a lightweight model perfect for agricultural applications
    # because it:
    #   - Works well even on modest hardware (no expensive GPU needed)
    #   - Is fast enough for real-time predictions
    #   - Still achieves high accuracy
    # =========================================================================

    print("\n[BUILD] Building MobileNetV2 transfer learning model...")

    # Load MobileNetV2 with ImageNet weights, WITHOUT the top classification layer
    # include_top=False means we'll add our own classification head
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(IMG_SIZE, IMG_SIZE, 3)  # 224×224 RGB images
    )

    # Freeze ALL layers in the base model for Phase 1
    # This prevents the pre-trained weights from being modified
    base_model.trainable = False

    # --- Add our custom classification head ---
    # This is the part that learns to classify groundnut diseases
    x = base_model.output

    # GlobalAveragePooling2D: Reduces each feature map to a single number
    # This converts the spatial features into a flat vector
    x = GlobalAveragePooling2D()(x)

    # BatchNormalization: Normalizes the outputs for more stable training
    x = BatchNormalization()(x)

    # Dense(256): A fully connected layer with 256 neurons
    # ReLU activation: outputs 0 for negative inputs, keeps positive values
    x = Dense(256, activation='relu')(x)

    # Dropout(0.5): Randomly turns off 50% of neurons during training
    # This prevents overfitting (the model memorizing training data)
    x = Dropout(0.5)(x)

    # Dense(128): Another fully connected layer with 128 neurons
    x = Dense(128, activation='relu')(x)

    # Dropout(0.3): 30% dropout — less aggressive in the later layer
    x = Dropout(0.3)(x)

    # Final output layer: num_classes neurons with softmax activation
    # Softmax ensures outputs sum to 1.0 (probabilities)
    predictions = Dense(num_classes, activation='softmax')(x)

    # Create the complete model
    model = Model(inputs=base_model.input, outputs=predictions)

    print("[OK] Model architecture built successfully.")
    print("   Total layers: {}".format(len(model.layers)))
    print("   Base model layers (frozen): {}".format(len(base_model.layers)))

    # =========================================================================
    # STEP 5: Phase 1 — Train the Custom Head (Base Frozen)
    # =========================================================================
    # In this phase we only train our new layers while keeping MobileNetV2
    # frozen.  We use a moderate learning rate (0.001) since only the new
    # layers are being updated.
    # =========================================================================

    print("\n" + "=" * 60)
    print("  PHASE 1: Feature Extraction (base model frozen)")
    print("  Epochs: {} | Learning rate: 0.001".format(EPOCHS_PHASE1))
    print("=" * 60 + "\n")

    # Compile the model with optimizer, loss function, and metrics
    model.compile(
        optimizer=Adam(learning_rate=0.001),     # Adam optimizer with lr=0.001
        loss='categorical_crossentropy',          # Standard loss for multi-class
        metrics=['accuracy']                      # Track accuracy during training
    )

    # --- Set up training callbacks ---
    # Callbacks are functions that run automatically during training

    # EarlyStopping: Stop training if validation loss doesn't improve
    # patience=5 means "wait 5 epochs before giving up"
    # restore_best_weights=True means "go back to the best model weights"
    early_stopping = EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True,
        verbose=1
    )

    # ModelCheckpoint: Save the model whenever validation accuracy improves
    checkpoint_path = os.path.join(MODEL_DIR, 'best_model_phase1.h5')
    model_checkpoint = ModelCheckpoint(
        checkpoint_path,
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1
    )

    # ReduceLROnPlateau: Reduce learning rate when training plateaus
    # If val_loss doesn't improve for 3 epochs, multiply lr by 0.5
    reduce_lr = ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=3,
        min_lr=1e-7,
        verbose=1
    )

    # --- Train Phase 1 ---
    history_phase1 = model.fit(
        train_generator,
        epochs=EPOCHS_PHASE1,
        validation_data=validation_generator,
        callbacks=[early_stopping, model_checkpoint, reduce_lr],
        class_weight=class_weights,   # Handle class imbalance
        verbose=1
    )

    print("\n[OK] Phase 1 complete!")

    # =========================================================================
    # STEP 6: Phase 2 — Fine-Tune Top Layers of MobileNetV2
    # =========================================================================
    # Now we unfreeze the top layers of MobileNetV2 (layers 100+) and
    # train them with a VERY small learning rate.  This gently adjusts
    # the pre-trained features to work better for our specific images.
    #
    # Why only top layers?
    #   - Bottom layers learn generic features (edges, colors) — keep frozen
    #   - Top layers learn task-specific features — these need fine-tuning
    #
    # Why a tiny learning rate (1e-5)?
    #   - We don't want to destroy the pre-trained knowledge
    #   - Small updates = gentle adaptation
    # =========================================================================

    print("\n" + "=" * 60)
    print("  PHASE 2: Fine-Tuning (top layers unfrozen)")
    print("  Epochs: {} | Learning rate: 0.00001".format(EPOCHS_PHASE2))
    print("  Unfreezing layers 100+ of MobileNetV2")
    print("=" * 60 + "\n")

    # Unfreeze the base model
    base_model.trainable = True

    # Freeze all layers BEFORE layer 100 (keep early features frozen)
    for layer in base_model.layers[:100]:
        layer.trainable = False

    # Count trainable vs frozen layers
    trainable_count = sum(1 for layer in model.layers if layer.trainable)
    frozen_count = sum(1 for layer in model.layers if not layer.trainable)
    print("   Trainable layers: {}".format(trainable_count))
    print("   Frozen layers: {}".format(frozen_count))

    # Recompile with a MUCH smaller learning rate for fine-tuning
    model.compile(
        optimizer=Adam(learning_rate=1e-5),       # Very small lr for fine-tuning
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # Update callbacks for Phase 2
    checkpoint_path_phase2 = os.path.join(MODEL_DIR, 'best_model_phase2.h5')
    model_checkpoint_phase2 = ModelCheckpoint(
        checkpoint_path_phase2,
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1
    )

    early_stopping_phase2 = EarlyStopping(
        monitor='val_loss',
        patience=5,
        restore_best_weights=True,
        verbose=1
    )

    reduce_lr_phase2 = ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=3,
        min_lr=1e-8,
        verbose=1
    )

    # --- Train Phase 2 ---
    history_phase2 = model.fit(
        train_generator,
        epochs=EPOCHS_PHASE2,
        validation_data=validation_generator,
        callbacks=[early_stopping_phase2, model_checkpoint_phase2, reduce_lr_phase2],
        class_weight=class_weights,   # Continue using class weights
        verbose=1
    )

    print("\n[OK] Phase 2 complete!")

    # =========================================================================
    # STEP 7: Save the Final Model and Labels
    # =========================================================================

    # Save the complete model (architecture + weights) as an .h5 file
    final_model_path = os.path.join(MODEL_DIR, 'trained_model.h5')
    model.save(final_model_path)
    print("\n[SAVE] Final model saved to: '{}'".format(os.path.abspath(final_model_path)))

    # Save the class labels to a text file
    # This is useful for reference — which index maps to which disease
    labels_path = os.path.join(MODEL_DIR, 'labels.txt')
    with open(labels_path, 'w', encoding='utf-8') as f:
        # Get the class-to-index mapping and sort by index
        class_indices = train_generator.class_indices
        sorted_classes = sorted(class_indices.items(), key=lambda x: x[1])
        for class_name, index in sorted_classes:
            f.write("{}: {}\n".format(index, class_name))
    print("[SAVE] Labels saved to: '{}'".format(os.path.abspath(labels_path)))

    # =========================================================================
    # STEP 8: Evaluate on the Test Set
    # =========================================================================
    print("\n" + "=" * 60)
    print("  Evaluating model on test data...")
    print("=" * 60 + "\n")

    # Get test set loss and accuracy
    test_loss, test_accuracy = model.evaluate(test_generator, verbose=1)
    print("\n[RESULTS] Test Results:")
    print("   Test Loss:     {:.4f}".format(test_loss))
    print("   Test Accuracy: {:.2f}%".format(test_accuracy * 100))

    # --- Generate Classification Report ---
    # This shows precision, recall, and F1-score for each disease class
    print("\n[REPORT] Classification Report:")
    print("-" * 60)

    # Get predictions for all test images
    test_generator.reset()
    predictions = model.predict(test_generator, verbose=1)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = test_generator.classes

    # Get class names in the correct order
    class_labels = list(test_generator.class_indices.keys())

    # Print the scikit-learn classification report
    report = classification_report(
        true_classes,
        predicted_classes,
        target_names=class_labels,
        digits=4
    )
    print(report)

    # =========================================================================
    # STEP 9: Plot and Save Training Graphs
    # =========================================================================
    print("[PLOT] Generating training plots...")

    # Combine history from both phases for complete plots
    # Phase 1 history
    acc_phase1 = history_phase1.history.get('accuracy', [])
    val_acc_phase1 = history_phase1.history.get('val_accuracy', [])
    loss_phase1 = history_phase1.history.get('loss', [])
    val_loss_phase1 = history_phase1.history.get('val_loss', [])

    # Phase 2 history
    acc_phase2 = history_phase2.history.get('accuracy', [])
    val_acc_phase2 = history_phase2.history.get('val_accuracy', [])
    loss_phase2 = history_phase2.history.get('loss', [])
    val_loss_phase2 = history_phase2.history.get('val_loss', [])

    # Combine both phases
    total_acc = acc_phase1 + acc_phase2
    total_val_acc = val_acc_phase1 + val_acc_phase2
    total_loss = loss_phase1 + loss_phase2
    total_val_loss = val_loss_phase1 + val_loss_phase2

    total_epochs = range(1, len(total_acc) + 1)
    phase1_end = len(acc_phase1)

    # --- Plot 1: Training & Validation Accuracy ---
    plt.figure(figsize=(10, 6))
    plt.plot(total_epochs, total_acc, 'b-o', label='Training Accuracy', markersize=4)
    plt.plot(total_epochs, total_val_acc, 'r-o', label='Validation Accuracy', markersize=4)
    # Draw a vertical line where Phase 2 begins
    plt.axvline(x=phase1_end, color='green', linestyle='--', label='Phase 2 Start')
    plt.title('LeafGuard AI - Training & Validation Accuracy', fontsize=14)
    plt.xlabel('Epoch', fontsize=12)
    plt.ylabel('Accuracy', fontsize=12)
    plt.legend(fontsize=11)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    accuracy_plot_path = os.path.join(MODEL_DIR, 'training_accuracy.png')
    plt.savefig(accuracy_plot_path, dpi=150)
    plt.close()
    print("   [OK] Accuracy plot saved: '{}'".format(os.path.abspath(accuracy_plot_path)))

    # --- Plot 2: Training & Validation Loss ---
    plt.figure(figsize=(10, 6))
    plt.plot(total_epochs, total_loss, 'b-o', label='Training Loss', markersize=4)
    plt.plot(total_epochs, total_val_loss, 'r-o', label='Validation Loss', markersize=4)
    plt.axvline(x=phase1_end, color='green', linestyle='--', label='Phase 2 Start')
    plt.title('LeafGuard AI - Training & Validation Loss', fontsize=14)
    plt.xlabel('Epoch', fontsize=12)
    plt.ylabel('Loss', fontsize=12)
    plt.legend(fontsize=11)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    loss_plot_path = os.path.join(MODEL_DIR, 'training_loss.png')
    plt.savefig(loss_plot_path, dpi=150)
    plt.close()
    print("   [OK] Loss plot saved: '{}'".format(os.path.abspath(loss_plot_path)))

    # =========================================================================
    # DONE!
    # =========================================================================
    print("\n" + "=" * 60)
    print("  Training Complete!")
    print("=" * 60)
    print("  Model saved to:  {}".format(os.path.abspath(final_model_path)))
    print("  Labels saved to: {}".format(os.path.abspath(labels_path)))
    print("  Test Accuracy:   {:.2f}%".format(test_accuracy * 100))
    print("=" * 60)
    print("\n  Next step: Run 'python app.py' to start the web server!")
    print("     The app will automatically use your trained model.\n")


# =============================================================================
# ENTRY POINT — Run training when this script is executed directly
# =============================================================================
if __name__ == '__main__':
    main()
