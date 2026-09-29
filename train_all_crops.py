# =============================================================================
# LeafGuard AI -- Smart Farming Platform
# train_all_crops.py -- Multi-Crop Model Training Script
# =============================================================================
#
# This script trains a separate MobileNetV2 model for each crop:
#   - Groundnut  (5 classes)   — from local dataset
#   - Potato     (7 classes)   — from local dataset
#   - Pepper     (2 classes)   — from archive dataset
#   - Tomato     (10 classes)  — from archive dataset
#
# For each crop it:
#   1. Auto-splits the raw dataset into train/val/test (80/10/10)
#      OR uses pre-split data if train/validation/test folders exist
#   2. Phase 1: Feature extraction (base frozen, lr=0.001)
#   3. Phase 2: Fine-tuning top layers (lr=0.00001)
#   4. Evaluates on the test set
#   5. Saves the model as model/{crop}_model.keras
#
# Dataset structure expected:
#   dataset/
#   |-- groundnut/
#   |   |-- ALTERNARIA LEAF SPOT/
#   |   |-- HEALTHY/
#   |   |-- LEAF SPOT (EARLY AND LATE)/
#   |   |-- ROSETTE/
#   |   +-- RUST/
#   |-- Potato/
#   |   |-- Bacteria/
#   |   |-- Fungi/
#   |   |-- Healthy/
#   |   |-- Nematode/
#   |   |-- Pest/
#   |   |-- Phytopthora/
#   |   +-- Virus/
#
# Archive dataset (pre-split into train/validation/test):
#   d:\downloads\archive\dataset\
#   |-- train/
#   |   |-- Pepper__bell___Bacterial_spot/
#   |   |-- Pepper__bell___healthy/
#   |   |-- Tomato_Bacterial_spot/
#   |   |-- ... (other tomato classes)
#   |-- validation/
#   |-- test/
#
# Usage:
#   python train_all_crops.py              # Train ALL crops
#   python train_all_crops.py groundnut    # Train only groundnut
#   python train_all_crops.py potato       # Train only potato
#   python train_all_crops.py pepper       # Train only pepper
#   python train_all_crops.py tomato       # Train only tomato
#
# Output per crop:
#   model/{crop}_model.keras         -- trained model
#   model/{crop}_labels.txt          -- class names
#   model/{crop}_accuracy.png        -- accuracy plot
#   model/{crop}_loss.png            -- loss plot
#   model/{crop}_report.txt          -- classification report
# =============================================================================

import os
import sys
import shutil
import random
import numpy as np
import time

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

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
from sklearn.metrics import classification_report
from sklearn.utils.class_weight import compute_class_weight


# =============================================================================
# CONFIGURATION
# =============================================================================

IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS_PHASE1 = 15
EPOCHS_PHASE2 = 10
MODEL_DIR = 'model'
SEED = 42

TRAIN_RATIO = 0.80
VAL_RATIO   = 0.10
TEST_RATIO  = 0.10

# Crop definitions: crop_name -> dataset directory
# For pre-split datasets (archive), point directly to the parent containing train/validation/test
CROP_DATASETS = {
    'groundnut': os.path.join('dataset', 'groundnut'),
    'potato':    os.path.join('dataset', 'Potato'),
    'pepper':    r'd:\downloads\archive\dataset',
    'tomato':    r'd:\downloads\archive\dataset',
}

# Crops whose datasets are already pre-split into train/validation/test folders
# and contain multiple crops (class names are prefixed, e.g., Pepper__bell___*)
PRE_SPLIT_CROPS = {
    'pepper': ['Pepper__bell___Bacterial_spot', 'Pepper__bell___healthy'],
    'tomato': ['Tomato_Bacterial_spot', 'Tomato_Early_blight', 'Tomato_Late_blight',
               'Tomato_Leaf_Mold', 'Tomato_Septoria_leaf_spot',
               'Tomato_Spider_mites_Two_spotted_spider_mite',
               'Tomato__Target_Spot', 'Tomato__Tomato_YellowLeaf__Curl_Virus',
               'Tomato__Tomato_mosaic_virus', 'Tomato_healthy'],
}


# =============================================================================
# STEP 1 -- Split dataset into train / val / test
# =============================================================================
def split_dataset(source_dir, dest_dir, train_ratio, val_ratio, test_ratio, seed=42):
    """
    Split a flat class-folder dataset into train/val/test subdirectories.

    Parameters
    ----------
    source_dir : str
        Path to folder with one subfolder per class.
    dest_dir : str
        Where train/, val/, test/ subfolders will be created.
    train_ratio, val_ratio, test_ratio : float
        Must sum to 1.0.
    seed : int
        Random seed for reproducibility.

    Returns
    -------
    dict : {class_name: {train: N, val: N, test: N}, ...}
    """
    assert abs(train_ratio + val_ratio + test_ratio - 1.0) < 1e-6, \
        "Split ratios must sum to 1.0 (got {})".format(
            train_ratio + val_ratio + test_ratio)

    random.seed(seed)
    splits = ['train', 'val', 'test']
    summary = {}

    # Discover class folders
    class_names = sorted([
        d for d in os.listdir(source_dir)
        if os.path.isdir(os.path.join(source_dir, d))
    ])

    if not class_names:
        raise ValueError("No class folders found in '{}'".format(source_dir))

    print("   Found {} classes: {}".format(len(class_names), class_names))

    for class_name in class_names:
        class_path = os.path.join(source_dir, class_name)

        # Collect image files
        images = [
            f for f in os.listdir(class_path)
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff', '.webp'))
        ]
        random.shuffle(images)

        total = len(images)
        if total == 0:
            print("   [WARN] Class '{}' has 0 images -- skipping".format(class_name))
            continue

        # Split indices
        train_end = int(total * train_ratio)
        val_end   = train_end + int(total * val_ratio)

        split_images = {
            'train': images[:train_end],
            'val':   images[train_end:val_end],
            'test':  images[val_end:]
        }

        summary[class_name] = {}

        for split_name in splits:
            split_class_dir = os.path.join(dest_dir, split_name, class_name)
            os.makedirs(split_class_dir, exist_ok=True)

            for img_name in split_images[split_name]:
                src = os.path.join(class_path, img_name)
                dst = os.path.join(split_class_dir, img_name)
                if not os.path.exists(dst):
                    shutil.copy2(src, dst)

            summary[class_name][split_name] = len(split_images[split_name])

    return summary


def print_split_summary(summary):
    """Pretty-print the split summary table."""
    print("\n   {:30s} {:>6s} {:>6s} {:>6s} {:>6s}".format(
        "Class", "Train", "Val", "Test", "Total"))
    print("   " + "-" * 58)

    total_train = total_val = total_test = 0
    for cls_name, counts in summary.items():
        t  = counts.get('train', 0)
        v  = counts.get('val', 0)
        te = counts.get('test', 0)
        total_train += t
        total_val   += v
        total_test  += te
        print("   {:30s} {:>6d} {:>6d} {:>6d} {:>6d}".format(
            cls_name, t, v, te, t + v + te))

    print("   " + "-" * 58)
    print("   {:30s} {:>6d} {:>6d} {:>6d} {:>6d}".format(
        "TOTAL", total_train, total_val, total_test,
        total_train + total_val + total_test))


# =============================================================================
# STEP 2 -- Build MobileNetV2 transfer learning model
# =============================================================================
def build_model(num_classes):
    """
    Build a MobileNetV2 transfer learning model.

    Returns
    -------
    model : keras.Model
    base_model : keras.Model (for unfreezing later)
    """
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(IMG_SIZE, IMG_SIZE, 3)
    )
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = BatchNormalization()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)
    return model, base_model


# =============================================================================
# STEP 3 -- Train a single crop
# =============================================================================
def train_crop(crop_name, raw_dataset_dir):
    """
    Full training pipeline for one crop.

    Steps:
      1. Split dataset
      2. Build data generators
      3. Build model
      4. Phase 1: feature extraction
      5. Phase 2: fine-tuning
      6. Evaluate on test set
      7. Save model, labels, plots, report
    """
    start_time = time.time()

    print("\n" + "#" * 60)
    print("  TRAINING: {} crop".format(crop_name.upper()))
    print("  Dataset:  {}".format(os.path.abspath(raw_dataset_dir)))
    print("#" * 60)

    # Validate dataset exists
    if not os.path.exists(raw_dataset_dir):
        print("[ERROR] Dataset directory not found: '{}'".format(raw_dataset_dir))
        print("   Skipping {} ...".format(crop_name))
        return False

    # -----------------------------------------------------------------
    # 1. Split dataset (or use pre-split data for archive crops)
    # -----------------------------------------------------------------
    if crop_name in PRE_SPLIT_CROPS:
        # Archive dataset: already pre-split, but contains multiple crops.
        # We need to filter only the relevant class folders.
        print("\n[SPLIT] Using pre-split archive dataset for {} ...".format(crop_name))
        
        allowed_classes = PRE_SPLIT_CROPS[crop_name]
        
        # The archive uses 'validation' instead of 'val'
        archive_train = os.path.join(raw_dataset_dir, 'train')
        archive_val   = os.path.join(raw_dataset_dir, 'validation')
        archive_test  = os.path.join(raw_dataset_dir, 'test')
        
        # Create filtered split directories with symlinks/copies
        split_dir = os.path.join('dataset', 'split_{}'.format(crop_name))
        train_dir = os.path.join(split_dir, 'train')
        val_dir   = os.path.join(split_dir, 'val')
        test_dir  = os.path.join(split_dir, 'test')
        
        if os.path.exists(train_dir) and len(os.listdir(train_dir)) > 0:
            print("   Split already exists at '{}'".format(os.path.abspath(split_dir)))
            print("   (Delete '{}' folder to re-create)".format(split_dir))
        else:
            # Copy only the relevant class folders from the archive
            for split_name, archive_split_dir in [('train', archive_train), ('val', archive_val), ('test', archive_test)]:
                for class_name in allowed_classes:
                    src_class = os.path.join(archive_split_dir, class_name)
                    dst_class = os.path.join(split_dir, split_name, class_name)
                    if os.path.exists(src_class):
                        os.makedirs(dst_class, exist_ok=True)
                        for img_file in os.listdir(src_class):
                            if img_file.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tiff', '.webp')):
                                src = os.path.join(src_class, img_file)
                                dst = os.path.join(dst_class, img_file)
                                if not os.path.exists(dst):
                                    shutil.copy2(src, dst)
                        count = len([f for f in os.listdir(dst_class) if os.path.isfile(os.path.join(dst_class, f))])
                        print("   Copied {} -> {}/{}: {} images".format(class_name, split_name, class_name, count))
                    else:
                        print("   [WARN] Class folder not found: '{}'".format(src_class))
            
            print("\n   [OK] {} dataset prepared from archive!".format(crop_name.capitalize()))
    else:
        split_dir = os.path.join('dataset', 'split_{}'.format(crop_name))
        train_dir = os.path.join(split_dir, 'train')
        val_dir   = os.path.join(split_dir, 'val')
        test_dir  = os.path.join(split_dir, 'test')

        if os.path.exists(train_dir) and len(os.listdir(train_dir)) > 0:
            print("\n[SPLIT] Split already exists at '{}'".format(
                os.path.abspath(split_dir)))
            print("   (Delete '{}' folder to re-split)".format(split_dir))
        else:
            print("\n[SPLIT] Splitting {} dataset ({}% / {}% / {}%) ...".format(
                crop_name,
                int(TRAIN_RATIO * 100),
                int(VAL_RATIO * 100),
                int(TEST_RATIO * 100)))

            summary = split_dataset(
                source_dir=raw_dataset_dir,
                dest_dir=split_dir,
                train_ratio=TRAIN_RATIO,
                val_ratio=VAL_RATIO,
                test_ratio=TEST_RATIO,
                seed=SEED
            )
            print_split_summary(summary)
            print("\n   [OK] {} dataset split complete!".format(crop_name.capitalize()))

    # -----------------------------------------------------------------
    # 2. Data generators
    # -----------------------------------------------------------------
    print("\n[DATA] Setting up data generators for {} ...".format(crop_name))

    train_datagen = ImageDataGenerator(
        rescale=1.0 / 255.0,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        brightness_range=[0.8, 1.2],
        shear_range=0.15,
        fill_mode='nearest'
    )

    val_test_datagen = ImageDataGenerator(rescale=1.0 / 255.0)

    train_gen = train_datagen.flow_from_directory(
        train_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=True
    )

    val_gen = val_test_datagen.flow_from_directory(
        val_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=False
    )

    test_gen = val_test_datagen.flow_from_directory(
        test_dir,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=False
    )

    num_classes = len(train_gen.class_indices)
    print("\n   Training:   {} images".format(train_gen.samples))
    print("   Validation: {} images".format(val_gen.samples))
    print("   Test:       {} images".format(test_gen.samples))
    print("   Classes:    {} -> {}".format(num_classes, list(train_gen.class_indices.keys())))

    # -----------------------------------------------------------------
    # 3. Class weights (handle imbalanced datasets)
    # -----------------------------------------------------------------
    print("\n[BALANCE] Computing class weights ...")
    class_weights_array = compute_class_weight(
        class_weight='balanced',
        classes=np.unique(train_gen.classes),
        y=train_gen.classes
    )
    class_weights = dict(enumerate(class_weights_array))
    print("   Weights: {}".format(
        {list(train_gen.class_indices.keys())[k]: round(v, 3)
         for k, v in class_weights.items()}
    ))

    # -----------------------------------------------------------------
    # 4. Build model
    # -----------------------------------------------------------------
    print("\n[BUILD] Building MobileNetV2 model for {} ({} classes) ...".format(
        crop_name, num_classes))
    model, base_model = build_model(num_classes)
    print("   Total layers: {}  |  Base layers (frozen): {}".format(
        len(model.layers), len(base_model.layers)))

    # -----------------------------------------------------------------
    # 5. Phase 1 -- Feature Extraction
    # -----------------------------------------------------------------
    print("\n" + "=" * 60)
    print("  PHASE 1: Feature Extraction ({})".format(crop_name.upper()))
    print("  Epochs: {} | LR: 0.001 | Base: FROZEN".format(EPOCHS_PHASE1))
    print("=" * 60 + "\n")

    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    p1_checkpoint = os.path.join(MODEL_DIR, '{}_best_phase1.keras'.format(crop_name))
    callbacks_p1 = [
        EarlyStopping(monitor='val_loss', patience=5,
                      restore_best_weights=True, verbose=1),
        ModelCheckpoint(p1_checkpoint, monitor='val_accuracy',
                        save_best_only=True, verbose=1),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5,
                          patience=3, min_lr=1e-7, verbose=1)
    ]

    history_p1 = model.fit(
        train_gen,
        epochs=EPOCHS_PHASE1,
        validation_data=val_gen,
        callbacks=callbacks_p1,
        class_weight=class_weights,
        verbose=1
    )
    print("\n[OK] Phase 1 complete for {}!".format(crop_name))

    # -----------------------------------------------------------------
    # 6. Phase 2 -- Fine-Tuning
    # -----------------------------------------------------------------
    print("\n" + "=" * 60)
    print("  PHASE 2: Fine-Tuning ({})".format(crop_name.upper()))
    print("  Epochs: {} | LR: 0.00001 | Unfreezing layers 100+".format(EPOCHS_PHASE2))
    print("=" * 60 + "\n")

    base_model.trainable = True
    for layer in base_model.layers[:100]:
        layer.trainable = False

    trainable = sum(1 for l in model.layers if l.trainable)
    frozen    = sum(1 for l in model.layers if not l.trainable)
    print("   Trainable: {} | Frozen: {}".format(trainable, frozen))

    model.compile(
        optimizer=Adam(learning_rate=1e-5),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    p2_checkpoint = os.path.join(MODEL_DIR, '{}_best_phase2.keras'.format(crop_name))
    callbacks_p2 = [
        EarlyStopping(monitor='val_loss', patience=5,
                      restore_best_weights=True, verbose=1),
        ModelCheckpoint(p2_checkpoint, monitor='val_accuracy',
                        save_best_only=True, verbose=1),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5,
                          patience=3, min_lr=1e-8, verbose=1)
    ]

    history_p2 = model.fit(
        train_gen,
        epochs=EPOCHS_PHASE2,
        validation_data=val_gen,
        callbacks=callbacks_p2,
        class_weight=class_weights,
        verbose=1
    )
    print("\n[OK] Phase 2 complete for {}!".format(crop_name))

    # -----------------------------------------------------------------
    # 7. Save final model + labels
    # -----------------------------------------------------------------
    final_model_path = os.path.join(MODEL_DIR, '{}_model.keras'.format(crop_name))
    model.save(final_model_path)
    print("\n[SAVE] Model saved: '{}'".format(os.path.abspath(final_model_path)))

    # Save labels
    labels_path = os.path.join(MODEL_DIR, '{}_labels.txt'.format(crop_name))
    class_indices = train_gen.class_indices
    sorted_classes = sorted(class_indices.items(), key=lambda x: x[1])
    with open(labels_path, 'w', encoding='utf-8') as f:
        for class_name_label, index in sorted_classes:
            f.write("{}: {}\n".format(index, class_name_label))
    print("[SAVE] Labels saved: '{}'".format(os.path.abspath(labels_path)))

    # -----------------------------------------------------------------
    # 8. Evaluate on test set
    # -----------------------------------------------------------------
    print("\n" + "=" * 60)
    print("  Evaluating {} on test data ...".format(crop_name.upper()))
    print("=" * 60 + "\n")

    test_loss, test_accuracy = model.evaluate(test_gen, verbose=1)
    print("\n[RESULTS] {} Test Results:".format(crop_name.capitalize()))
    print("   Test Loss:     {:.4f}".format(test_loss))
    print("   Test Accuracy: {:.2f}%".format(test_accuracy * 100))

    # Classification report
    test_gen.reset()
    predictions = model.predict(test_gen, verbose=1)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = test_gen.classes
    class_labels = list(test_gen.class_indices.keys())

    report = classification_report(
        true_classes,
        predicted_classes,
        target_names=class_labels,
        digits=4
    )
    print("\n[REPORT] Classification Report for {}:".format(crop_name.capitalize()))
    print("-" * 60)
    print(report)

    # Save report to file
    report_path = os.path.join(MODEL_DIR, '{}_report.txt'.format(crop_name))
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("LeafGuard AI -- {} Classification Report\n".format(crop_name.capitalize()))
        f.write("=" * 60 + "\n")
        f.write("Test Loss:     {:.4f}\n".format(test_loss))
        f.write("Test Accuracy: {:.2f}%\n\n".format(test_accuracy * 100))
        f.write(report)
    print("[SAVE] Report saved: '{}'".format(os.path.abspath(report_path)))

    # -----------------------------------------------------------------
    # 9. Training plots
    # -----------------------------------------------------------------
    print("[PLOT] Generating training plots for {} ...".format(crop_name))

    # Combine Phase 1 + Phase 2 histories
    acc     = history_p1.history.get('accuracy', []) + history_p2.history.get('accuracy', [])
    val_acc = history_p1.history.get('val_accuracy', []) + history_p2.history.get('val_accuracy', [])
    loss    = history_p1.history.get('loss', []) + history_p2.history.get('loss', [])
    val_loss = history_p1.history.get('val_loss', []) + history_p2.history.get('val_loss', [])

    epochs_range = range(1, len(acc) + 1)
    p1_end = len(history_p1.history.get('accuracy', []))

    # Accuracy plot
    plt.figure(figsize=(10, 6))
    plt.plot(epochs_range, acc, 'b-o', label='Training Accuracy', markersize=4)
    plt.plot(epochs_range, val_acc, 'r-o', label='Validation Accuracy', markersize=4)
    plt.axvline(x=p1_end, color='green', linestyle='--', label='Phase 2 Start')
    plt.title('LeafGuard AI - {} Accuracy'.format(crop_name.capitalize()), fontsize=14)
    plt.xlabel('Epoch', fontsize=12)
    plt.ylabel('Accuracy', fontsize=12)
    plt.legend(fontsize=11)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    acc_plot = os.path.join(MODEL_DIR, '{}_accuracy.png'.format(crop_name))
    plt.savefig(acc_plot, dpi=150)
    plt.close()
    print("   [OK] Accuracy plot: '{}'".format(os.path.abspath(acc_plot)))

    # Loss plot
    plt.figure(figsize=(10, 6))
    plt.plot(epochs_range, loss, 'b-o', label='Training Loss', markersize=4)
    plt.plot(epochs_range, val_loss, 'r-o', label='Validation Loss', markersize=4)
    plt.axvline(x=p1_end, color='green', linestyle='--', label='Phase 2 Start')
    plt.title('LeafGuard AI - {} Loss'.format(crop_name.capitalize()), fontsize=14)
    plt.xlabel('Epoch', fontsize=12)
    plt.ylabel('Loss', fontsize=12)
    plt.legend(fontsize=11)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    loss_plot = os.path.join(MODEL_DIR, '{}_loss.png'.format(crop_name))
    plt.savefig(loss_plot, dpi=150)
    plt.close()
    print("   [OK] Loss plot: '{}'".format(os.path.abspath(loss_plot)))

    # Cleanup phase checkpoints
    for cp in [p1_checkpoint, p2_checkpoint]:
        if os.path.exists(cp):
            try:
                os.remove(cp)
            except OSError:
                pass

    elapsed = (time.time() - start_time) / 60
    print("\n[DONE] {} training complete in {:.1f} minutes!".format(
        crop_name.capitalize(), elapsed))
    print("   Model:    {}".format(final_model_path))
    print("   Accuracy: {:.2f}%".format(test_accuracy * 100))

    return True


# =============================================================================
# MAIN
# =============================================================================
def main():
    print("\n" + "=" * 60)
    print("  LeafGuard AI -- Multi-Crop Model Training")
    print("=" * 60)
    print("  TensorFlow: {}".format(tf.__version__))
    print("  GPU: {}".format(
        "Yes" if tf.config.list_physical_devices('GPU') else "No (using CPU)"))
    print("  Split: {}% train / {}% val / {}% test".format(
        int(TRAIN_RATIO * 100), int(VAL_RATIO * 100), int(TEST_RATIO * 100)))
    print("=" * 60)

    os.makedirs(MODEL_DIR, exist_ok=True)

    # Allow training a single crop via command line argument
    if len(sys.argv) > 1:
        crop_arg = sys.argv[1].strip().lower()
        if crop_arg not in CROP_DATASETS:
            print("[ERROR] Unknown crop '{}'. Choose from: {}".format(
                crop_arg, list(CROP_DATASETS.keys())))
            sys.exit(1)
        crops_to_train = {crop_arg: CROP_DATASETS[crop_arg]}
    else:
        crops_to_train = CROP_DATASETS

    total_start = time.time()
    results = {}

    for crop_name, raw_dir in crops_to_train.items():
        success = train_crop(crop_name, raw_dir)
        results[crop_name] = success

    total_elapsed = (time.time() - total_start) / 60

    # Final summary
    print("\n" + "=" * 60)
    print("  TRAINING COMPLETE -- ALL CROPS")
    print("=" * 60)
    for crop_name, success in results.items():
        status = "OK" if success else "FAILED"
        model_path = os.path.join(MODEL_DIR, '{}_model.keras'.format(crop_name))
        exists = "[saved]" if os.path.exists(model_path) else "[missing]"
        print("  [{}] {:12s} {}".format(status, crop_name.capitalize(), exists))
    print("  Total time: {:.1f} minutes".format(total_elapsed))
    print("=" * 60)
    print("\n  Next: Run 'python app.py' to start the web server!")
    print("  The app will automatically detect and load your trained models.\n")


if __name__ == '__main__':
    main()
