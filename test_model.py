# =============================================================================
# LeafGuard AI - Model Testing Script
# =============================================================================
# Evaluates the trained model on the held-out test set and generates:
#   - Overall accuracy & loss
#   - Per-class precision, recall, F1-score
#   - Confusion matrix (saved as image)
#   - Sample predictions with images
#
# Usage:
#   python test_model.py
# =============================================================================

import os
import sys
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# TensorFlow & Keras
import tensorflow as tf
from keras.src.legacy.preprocessing.image import ImageDataGenerator  # noqa: E501

# Scikit-learn for metrics
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay
)

# =============================================================================
# CONFIGURATION
# =============================================================================
IMG_SIZE = 224
BATCH_SIZE = 32
MODEL_PATH = os.path.join('model', 'trained_model.h5')
LABELS_PATH = os.path.join('model', 'labels.txt')
TEST_DIR = os.path.join('dataset', 'split', 'test')
OUTPUT_DIR = 'model'

# =============================================================================
# HELPER: Load class labels from labels.txt
# =============================================================================
def load_labels(labels_path):
    """Read labels.txt and return a dict of {index: class_name}."""
    labels = {}
    with open(labels_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and ':' in line:
                idx, name = line.split(':', 1)
                labels[int(idx.strip())] = name.strip()
    return labels


# =============================================================================
# MAIN TEST FUNCTION
# =============================================================================
def main():
    print("\n" + "=" * 60)
    print("  LeafGuard AI - Model Testing & Evaluation")
    print("=" * 60)
    print("  TensorFlow version: {}".format(tf.__version__))
    print("  GPU available: {}".format(
        "Yes" if tf.config.list_physical_devices('GPU') else "No (using CPU)"
    ))
    print("=" * 60 + "\n")

    # =========================================================================
    # STEP 1: Verify paths
    # =========================================================================
    if not os.path.exists(MODEL_PATH):
        print("[ERROR] Model file not found: '{}'".format(os.path.abspath(MODEL_PATH)))
        print("        Please train the model first with: python train_model.py")
        sys.exit(1)

    if not os.path.exists(TEST_DIR):
        print("[ERROR] Test directory not found: '{}'".format(os.path.abspath(TEST_DIR)))
        sys.exit(1)

    print("[OK] Model file: '{}'".format(os.path.abspath(MODEL_PATH)))
    print("[OK] Test data:  '{}'".format(os.path.abspath(TEST_DIR)))

    # =========================================================================
    # STEP 2: Load the trained model
    # =========================================================================
    print("\n[LOAD] Loading trained model...")
    model = tf.keras.models.load_model(MODEL_PATH)
    print("[OK] Model loaded successfully.")
    print("   Input shape:  {}".format(model.input_shape))
    print("   Output shape: {}".format(model.output_shape))
    print("   Total params: {:,}".format(model.count_params()))

    # =========================================================================
    # STEP 3: Load labels
    # =========================================================================
    if os.path.exists(LABELS_PATH):
        labels = load_labels(LABELS_PATH)
        print("\n[OK] Labels loaded: {}".format(labels))
    else:
        labels = None
        print("\n[INFO] No labels.txt found, will use folder names.")

    # =========================================================================
    # STEP 4: Set up test data generator
    # =========================================================================
    print("\n[INFO] Setting up test data generator...")

    test_datagen = ImageDataGenerator(rescale=1.0 / 255.0)

    test_generator = test_datagen.flow_from_directory(
        TEST_DIR,
        target_size=(IMG_SIZE, IMG_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=False   # IMPORTANT: keep order for metrics
    )

    num_classes = len(test_generator.class_indices)
    class_names = list(test_generator.class_indices.keys())
    num_samples = test_generator.samples

    print("   Test samples:  {}".format(num_samples))
    print("   Classes ({}):  {}".format(num_classes, class_names))

    # Per-class count
    print("\n   Per-class sample counts:")
    for cls_name, cls_idx in sorted(test_generator.class_indices.items(), key=lambda x: x[1]):
        count = np.sum(test_generator.classes == cls_idx)
        print("     [{}] {}: {} images".format(cls_idx, cls_name, count))

    # =========================================================================
    # STEP 5: Evaluate overall accuracy & loss
    # =========================================================================
    print("\n" + "=" * 60)
    print("  EVALUATING MODEL ON TEST SET...")
    print("=" * 60 + "\n")

    test_loss, test_accuracy = model.evaluate(test_generator, verbose=1)

    print("\n" + "-" * 40)
    print("  TEST LOSS:     {:.4f}".format(test_loss))
    print("  TEST ACCURACY: {:.2f}%".format(test_accuracy * 100))
    print("-" * 40)

    # =========================================================================
    # STEP 6: Get predictions & generate classification report
    # =========================================================================
    print("\n[INFO] Generating predictions for all test images...")

    test_generator.reset()
    predictions = model.predict(test_generator, verbose=1)
    predicted_classes = np.argmax(predictions, axis=1)
    true_classes = test_generator.classes

    # Classification report
    print("\n" + "=" * 60)
    print("  CLASSIFICATION REPORT")
    print("=" * 60)

    report = classification_report(
        true_classes,
        predicted_classes,
        target_names=class_names,
        digits=4
    )
    print(report)

    # Save report to file
    report_path = os.path.join(OUTPUT_DIR, 'test_report.txt')
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("LeafGuard AI - Model Test Report\n")
        f.write("=" * 60 + "\n\n")
        f.write("Test Loss:     {:.4f}\n".format(test_loss))
        f.write("Test Accuracy: {:.2f}%\n\n".format(test_accuracy * 100))
        f.write("Classification Report:\n")
        f.write("-" * 60 + "\n")
        f.write(report)
        f.write("\n")
    print("[SAVE] Report saved to: '{}'".format(os.path.abspath(report_path)))

    # =========================================================================
    # STEP 7: Confusion Matrix
    # =========================================================================
    print("\n[PLOT] Generating confusion matrix...")

    cm = confusion_matrix(true_classes, predicted_classes)

    fig, ax = plt.subplots(figsize=(10, 8))
    disp = ConfusionMatrixDisplay(
        confusion_matrix=cm,
        display_labels=class_names
    )
    disp.plot(ax=ax, cmap='Blues', values_format='d', xticks_rotation=45)
    ax.set_title('LeafGuard AI - Confusion Matrix\nTest Accuracy: {:.2f}%'.format(
        test_accuracy * 100
    ), fontsize=14, fontweight='bold')
    plt.tight_layout()

    cm_path = os.path.join(OUTPUT_DIR, 'confusion_matrix.png')
    plt.savefig(cm_path, dpi=150, bbox_inches='tight')
    plt.close()
    print("[OK] Confusion matrix saved: '{}'".format(os.path.abspath(cm_path)))

    # =========================================================================
    # STEP 8: Per-class accuracy breakdown
    # =========================================================================
    print("\n" + "=" * 60)
    print("  PER-CLASS ACCURACY")
    print("=" * 60)
    print("  {:<35s} {:>8s} {:>8s} {:>8s}".format(
        "Class", "Correct", "Total", "Acc %"
    ))
    print("  " + "-" * 62)

    for i, cls_name in enumerate(class_names):
        mask = (true_classes == i)
        total = np.sum(mask)
        correct = np.sum(predicted_classes[mask] == i)
        acc = (correct / total * 100) if total > 0 else 0
        print("  {:<35s} {:>8d} {:>8d} {:>7.2f}%".format(cls_name, correct, total, acc))

    # =========================================================================
    # STEP 9: Show some sample predictions
    # =========================================================================
    print("\n" + "=" * 60)
    print("  SAMPLE PREDICTIONS (first 5 per class)")
    print("=" * 60)

    test_generator.reset()
    file_paths = test_generator.filepaths

    for cls_idx, cls_name in enumerate(class_names):
        # Get indices for this class
        cls_mask = (true_classes == cls_idx)
        cls_indices = np.where(cls_mask)[0]

        print("\n  --- {} ---".format(cls_name))
        for j, idx in enumerate(cls_indices[:5]):
            pred_idx = predicted_classes[idx]
            pred_name = class_names[pred_idx]
            conf = predictions[idx][pred_idx] * 100
            status = "OK" if pred_idx == cls_idx else "WRONG"
            fname = os.path.basename(file_paths[idx])
            print("    [{}] {} -> {} ({:.1f}%)".format(status, fname, pred_name, conf))

    # =========================================================================
    # STEP 10: Misclassified images summary
    # =========================================================================
    misclassified = np.where(predicted_classes != true_classes)[0]
    total_wrong = len(misclassified)
    total_right = num_samples - total_wrong

    print("\n" + "=" * 60)
    print("  FINAL SUMMARY")
    print("=" * 60)
    print("  Total test images:    {}".format(num_samples))
    print("  Correctly classified: {} ({:.1f}%)".format(
        total_right, total_right / num_samples * 100
    ))
    print("  Misclassified:        {} ({:.1f}%)".format(
        total_wrong, total_wrong / num_samples * 100
    ))
    print("  Test Accuracy:        {:.2f}%".format(test_accuracy * 100))
    print("  Test Loss:            {:.4f}".format(test_loss))
    print("=" * 60)

    if total_wrong > 0:
        print("\n  Misclassified images:")
        for idx in misclassified[:20]:  # Show first 20
            true_name = class_names[true_classes[idx]]
            pred_name = class_names[predicted_classes[idx]]
            conf = predictions[idx][predicted_classes[idx]] * 100
            fname = os.path.basename(file_paths[idx])
            print("    {} : TRUE={} -> PRED={} ({:.1f}%)".format(
                fname, true_name, pred_name, conf
            ))
        if total_wrong > 20:
            print("    ... and {} more".format(total_wrong - 20))

    print("\n  Output files:")
    print("    - Test report:      '{}'".format(os.path.abspath(report_path)))
    print("    - Confusion matrix: '{}'".format(os.path.abspath(cm_path)))
    print("\n  Testing complete!\n")


# =============================================================================
# ENTRY POINT
# =============================================================================
if __name__ == '__main__':
    main()
