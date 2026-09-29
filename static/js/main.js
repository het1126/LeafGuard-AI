/* ============================================
   LeafGuard AI — Main Application JavaScript
   Upload, Predict, Display Results, Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initUpload();
  initScrollAnimations();
  initMobileMenu();
  initSmoothScroll();
  initNavbarScroll();
  initHistory();
  initCropSwitcher();
  initLanguageSync();
});

/* ────────────────────────────────────
   Constants
   ──────────────────────────────────── */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB

/* ────────────────────────────────────
   Toast Notification System
   ──────────────────────────────────── */
function getToastContainer() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

const TOAST_ICONS = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️'
};

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {'success'|'error'|'info'|'warning'} type - Toast type
 * @param {number} duration - Auto-dismiss duration in ms (default 4000)
 */
function showToast(message, type = 'info', duration = 4000) {
  const container = getToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  // Auto-remove after duration
  const timer = setTimeout(() => {
    removeToast(toast);
  }, duration);

  // Click to dismiss early
  toast.addEventListener('click', () => {
    clearTimeout(timer);
    removeToast(toast);
  });
}

function removeToast(toast) {
  if (!toast || toast.classList.contains('removing')) return;
  toast.classList.add('removing');
  toast.addEventListener('animationend', () => {
    toast.remove();
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ────────────────────────────────────
   Image Upload Handling
   ──────────────────────────────────── */
function initUpload() {
  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const cameraInput = document.getElementById('cameraInput');
  const imagePreview = document.getElementById('imagePreview');
  const previewImg = document.getElementById('previewImg');
  const removeBtn = document.getElementById('removeImage');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const uploadForm = document.getElementById('uploadForm');

  if (!uploadZone || !fileInput) return;

  let selectedFile = null;

  // ── Drag and Drop ──
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadZone.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });

  // Click on upload zone opens file dialog
  uploadZone.addEventListener('click', (e) => {
    // Don't trigger if clicking on actual buttons/labels inside
    if (e.target.closest('label') || e.target.closest('button')) return;
    fileInput.click();
  });

  // ── File Input Change ──
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  // ── Camera Input Change ──
  if (cameraInput) {
    cameraInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    });
  }

  // ── Remove Image ──
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      resetUpload();
    });
  }

  // ── Form Submit (Analyze) ──
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!selectedFile) {
        showToast(t('toast_no_file', 'Please select an image first.'), 'warning');
        return;
      }
      submitPrediction(selectedFile);
    });
  }

  // ── Analyze Another ──
  const analyzeAnother = document.getElementById('analyzeAnother');
  if (analyzeAnother) {
    analyzeAnother.addEventListener('click', () => {
      resetToUpload();
    });
  }

  /**
   * Handle a selected file — validate & preview
   */
  function handleFile(file) {
    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast(
        t('toast_invalid_type', 'Invalid file type. Please upload an image (JPG, PNG, WEBP, GIF).'),
        'error'
      );
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      showToast(
        t('toast_file_too_large', 'File too large. Maximum size is 16MB.'),
        'error'
      );
      return;
    }

    selectedFile = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (previewImg) previewImg.src = e.target.result;
      if (imagePreview) imagePreview.style.display = 'block';
      if (uploadZone) uploadZone.style.display = 'none';
      if (analyzeBtn) analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);

    showToast(t('toast_upload_success', 'Image uploaded successfully!'), 'success');
  }

  /**
   * Reset the upload form
   */
  function resetUpload() {
    selectedFile = null;
    if (fileInput) fileInput.value = '';
    if (cameraInput) cameraInput.value = '';
    if (previewImg) previewImg.src = '';
    if (imagePreview) imagePreview.style.display = 'none';
    if (uploadZone) uploadZone.style.display = '';
    if (analyzeBtn) analyzeBtn.disabled = true;
  }

  /**
   * Reset view back to the upload section
   */
  function resetToUpload() {
    currentPredictionData = null;
    currentPredictionFile = null;
    const validationError = document.getElementById('validationError');
    const resultGrid = document.querySelector('.result-grid');
    const analyzeAnotherBtn = document.getElementById('analyzeAnother');
    if (validationError) validationError.style.display = 'none';
    if (resultGrid) resultGrid.style.display = '';
    if (analyzeAnotherBtn) analyzeAnotherBtn.style.display = '';

    const uploadSection = document.getElementById('upload');
    const resultSection = document.getElementById('result');

    if (resultSection) resultSection.style.display = 'none';
    if (uploadSection) uploadSection.style.display = '';

    resetUpload();

    // Scroll to upload section smoothly
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/* ────────────────────────────────────
   Prediction Flow
   ──────────────────────────────────── */
async function submitPrediction(file) {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const btnText = analyzeBtn?.querySelector('.btn-text');
  const btnLoader = analyzeBtn?.querySelector('.btn-loader');
  const uploadSection = document.getElementById('upload');
  const resultSection = document.getElementById('result');

  // Reset previous prediction and error state immediately
  currentPredictionData = null;
  currentValidationErrorData = null;
  const prevValErr = document.getElementById('validationError');
  const prevResGrid = document.querySelector('.result-grid');
  if (prevValErr) prevValErr.style.display = 'none';
  if (prevResGrid) prevResGrid.style.display = 'none';

  // Show loading state
  if (analyzeBtn) analyzeBtn.disabled = true;
  if (btnText) btnText.style.display = 'none';
  if (btnLoader) btnLoader.style.display = 'inline-block';

  // Show loading overlay
  const overlay = createLoadingOverlay();
  document.body.appendChild(overlay);

  try {
    const formData = new FormData();
    formData.append('file', file);

    // Get selected crop
    const cropRadio = document.querySelector('input[name="crop"]:checked');
    const selectedCrop = cropRadio ? cropRadio.value : 'groundnut';
    formData.append('crop', selectedCrop);

    // Send current language for translated results
    const lang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'en';
    formData.append('lang', lang);

    const response = await fetch('/predict', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Check if this is a validation error with structured data
      if (data.error_type || data.reason || data.success === false) {
        showValidationError(data, file);
        if (uploadSection) uploadSection.style.display = 'none';
        if (resultSection) {
          resultSection.style.display = '';
          resultSection.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    // Check for validation failure (200 responses like LOW_CONFIDENCE)
    if (data.success === false || data.error_type) {
      showValidationError(data, file);
      if (uploadSection) uploadSection.style.display = 'none';
      if (resultSection) {
        resultSection.style.display = '';
        resultSection.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    // Populate result section
    populateResult(data, file);

    // Switch view
    if (uploadSection) uploadSection.style.display = 'none';
    if (resultSection) {
      resultSection.style.display = '';
      resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    showToast('Analysis complete!', 'success');

    // Refresh history after new prediction
    loadHistory();

  } catch (error) {
    console.error('Prediction error:', error);
    showToast(
      t('toast_analysis_error', 'Analysis failed. Please try again.') + ' ' + error.message,
      'error',
      6000
    );
  } finally {
    // Reset button state
    if (analyzeBtn) analyzeBtn.disabled = false;
    if (btnText) btnText.style.display = '';
    if (btnLoader) btnLoader.style.display = 'none';

    // Remove loading overlay
    overlay.remove();
  }
}

/**
 * Create a full-screen loading overlay
 */
function createLoadingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="spinner-leaf">🍃</div>
    <p class="loading-text">${t('loading_text', 'Analyzing your leaf...')}</p>
  `;
  return overlay;
}

// Cached prediction data for instant multilingual re-rendering
let currentPredictionData = null;
let currentPredictionFile = null;
let currentValidationErrorData = null;
let currentValidationErrorFile = null;

/**
 * Populate the result section with prediction data
 */
function populateResult(data, file) {
  currentPredictionData = data;
  currentPredictionFile = file;
  currentValidationErrorData = null;
  currentValidationErrorFile = null;

  // Make sure validation error is hidden and result grid is visible
  const validationError = document.getElementById('validationError');
  const resultGrid = document.querySelector('.result-grid');
  const analyzeAnotherBtn = document.getElementById('analyzeAnother');
  if (validationError) validationError.style.display = 'none';
  if (resultGrid) resultGrid.style.display = '';
  if (analyzeAnotherBtn) analyzeAnotherBtn.style.display = '';

  const resultImg = document.getElementById('resultImg');
  if (resultImg) {
    if (data.image_url) {
      resultImg.src = data.image_url;
    } else if (file) {
      const reader = new FileReader();
      reader.onload = (e) => { resultImg.src = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  const currentLang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'en';
  renderReport(data, currentLang);
}

/**
 * Render/re-render the entire report in the specified language
 */
function renderReport(data, lang) {
  if (!data) return;

  const localized = (typeof localizeReportData === 'function')
    ? localizeReportData(data, lang)
    : (data.translations && data.translations[lang] ? data.translations[lang] : data);

  const diseaseName = document.getElementById('diseaseName');
  const resultCropName = document.getElementById('resultCropName');
  const resultPredTime = document.getElementById('resultPredTime');
  const confidenceFill = document.getElementById('confidenceFill');
  const confidenceText = document.getElementById('confidenceText');
  const causesList = document.getElementById('causesList');
  const treatmentList = document.getElementById('treatmentList');
  const preventionList = document.getElementById('preventionList');
  const descBlock = document.getElementById('descriptionBlock');
  const descText = document.getElementById('diseaseDescription');
  const sympBlock = document.getElementById('symptomsBlock');
  const sympList = document.getElementById('symptomsList');

  // Disease name with color coding
  if (diseaseName) {
    const disease = localized.display_name || localized.disease || data.disease || 'Unknown';
    diseaseName.textContent = disease;
    diseaseName.classList.remove('healthy', 'diseased');

    const rawKey = (data.disease_key || data.disease || '').toLowerCase();
    if (rawKey.includes('healthy') || rawKey.includes('normal')) {
      diseaseName.classList.add('healthy');
    } else {
      diseaseName.classList.add('diseased');
    }
  }

  // Confidence bar
  const confidence = data.confidence || 0;
  const confidencePercent = typeof confidence === 'number'
    ? (confidence > 1 ? confidence : confidence * 100)
    : parseFloat(confidence) || 0;

  if (confidenceFill) {
    confidenceFill.style.width = '0%';
    confidenceFill.offsetHeight; // reflow
    requestAnimationFrame(() => {
      setTimeout(() => {
        confidenceFill.style.width = `${Math.min(confidencePercent, 100)}%`;
      }, 100);
    });
  }

  if (confidenceText) {
    confidenceText.textContent = `${confidencePercent.toFixed(1)}%`;
  }

  // Crop name
  if (resultCropName) {
    const cropName = localized.crop_name || (typeof getCropDisplayName === 'function' ? getCropDisplayName(data.crop, lang) : data.crop_name);
    resultCropName.textContent = cropName || 'Groundnut';
  }

  // Prediction time
  if (resultPredTime) {
    const predTime = data.prediction_time_ms;
    resultPredTime.textContent = predTime ? `${predTime.toFixed(0)} ms` : 'N/A';
  }

  // Description
  const description = localized.description || '';
  if (descBlock && descText) {
    if (description) {
      descText.textContent = description;
      descBlock.style.display = '';
    } else {
      descBlock.style.display = 'none';
    }
  } else if (descBlock) {
    descBlock.style.display = 'none';
  }

  // Symptoms
  const symptoms = localized.symptoms;
  if (sympBlock && sympList) {
    if (symptoms && Array.isArray(symptoms) && symptoms.length > 0) {
      populateList(sympList, symptoms);
      sympBlock.style.display = '';
    } else {
      sympBlock.style.display = 'none';
    }
  } else if (sympBlock) {
    sympBlock.style.display = 'none';
  }

  // Causes, Treatment, Prevention
  populateList(causesList, localized.causes);
  populateList(treatmentList, localized.treatment);
  populateList(preventionList, localized.prevention);
}

/**
 * Populate a <ul> element with list items
 */
function populateList(ulElement, items) {
  if (!ulElement) return;
  ulElement.innerHTML = '';

  if (!items || !Array.isArray(items) || items.length === 0) {
    const li = document.createElement('li');
    li.textContent = (typeof t === 'function') ? t('no_info_available', 'No information available') : 'No information available';
    ulElement.appendChild(li);
    return;
  }

  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ulElement.appendChild(li);
  });
}

/* ────────────────────────────────────
   Scroll Animations (IntersectionObserver)
   ──────────────────────────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally stop observing once visible
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ────────────────────────────────────
   Mobile Menu
   ──────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  // Toggle menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#navbar')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });
}

/* ────────────────────────────────────
   Smooth Scrolling for Anchor Links
   ──────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ────────────────────────────────────
   Navbar Scroll Effect
   ──────────────────────────────────── */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ────────────────────────────────────
   Prediction History
   ──────────────────────────────────── */
function initHistory() {
  loadHistory();

  const clearBtn = document.getElementById('clearHistoryBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      try {
        await fetch('/api/history/clear', { method: 'POST' });
        loadHistory();
        showToast(t('history_cleared', 'History cleared!'), 'success');
      } catch (e) {
        showToast('Failed to clear history', 'error');
      }
    });
  }
}

async function loadHistory() {
  const tbody = document.getElementById('historyTableBody');
  const emptyDiv = document.getElementById('historyEmpty');
  const tableWrapper = document.getElementById('historyTableWrapper');
  const countSpan = document.getElementById('historyCount');

  if (!tbody) return;

  try {
    const response = await fetch('/api/history');
    const history = await response.json();

    if (countSpan) {
      countSpan.textContent = `${history.length} prediction${history.length !== 1 ? 's' : ''}`;
    }

    if (history.length === 0) {
      if (emptyDiv) emptyDiv.style.display = '';
      if (tableWrapper) tableWrapper.style.display = 'none';
      return;
    }

    if (emptyDiv) emptyDiv.style.display = 'none';
    if (tableWrapper) tableWrapper.style.display = '';

    tbody.innerHTML = '';
    const currentLang = (typeof getCurrentLanguage === 'function') ? getCurrentLanguage() : 'en';

    if (countSpan) {
      if (currentLang === 'gu') {
        countSpan.textContent = `${history.length} ઓળખ`;
      } else if (currentLang === 'hi') {
        countSpan.textContent = `${history.length} पहचान`;
      } else {
        countSpan.textContent = `${history.length} prediction${history.length !== 1 ? 's' : ''}`;
      }
    }

    // Show newest first
    const reversed = [...history].reverse();
    reversed.forEach(entry => {
      const tr = document.createElement('tr');
      const dateStr = entry.timestamp
        ? new Date(entry.timestamp).toLocaleString()
        : 'N/A';
      const cropDisplay = (typeof getCropDisplayName === 'function')
        ? getCropDisplayName(entry.crop, currentLang)
        : (entry.crop ? entry.crop.charAt(0).toUpperCase() + entry.crop.slice(1) : 'Unknown');
      const diseaseDisplay = (typeof getDiseaseDisplayName === 'function')
        ? getDiseaseDisplayName(entry.disease, entry.crop, currentLang)
        : (entry.disease || 'Unknown');
      tr.innerHTML = `
        <td>${escapeHtml(dateStr)}</td>
        <td>${escapeHtml(cropDisplay)}</td>
        <td>${escapeHtml(diseaseDisplay)}</td>
        <td>${entry.confidence != null ? entry.confidence.toFixed(1) + '%' : 'N/A'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.warn('Could not load history:', e);
  }
}

/**
 * Listen for language changes and re-render report & history dynamically
 */
function initLanguageSync() {
  window.addEventListener('languageChanged', (e) => {
    const newLang = e.detail?.language || (typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en');
    if (currentPredictionData) {
      renderReport(currentPredictionData, newLang);
    }
    loadHistory();
  });
}

/* ────────────────────────────────────
   Crop Switcher — Disease Section
   ──────────────────────────────────── */

/**
 * Titles for each crop's disease section
 */
const CROP_DISEASE_TITLES = {
  groundnut: 'diseases_title_groundnut',
  potato: 'diseases_title_potato',
  pepper: 'diseases_title_pepper',
  tomato: 'diseases_title_tomato'
};

const CROP_DISEASE_TITLES_FALLBACK = {
  groundnut: 'Groundnut Diseases We Detect',
  potato: 'Potato Diseases We Detect',
  pepper: 'Pepper Diseases We Detect',
  tomato: 'Tomato Diseases We Detect'
};

/**
 * Initialize crop radio button listeners to switch the disease info section
 */
function initCropSwitcher() {
  const cropRadios = document.querySelectorAll('input[name="crop"]');
  if (cropRadios.length === 0) return;

  cropRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      switchDiseaseSection(radio.value);
    });
  });
}

/**
 * Show the disease grid for the selected crop, hide others.
 * Also updates the section title.
 */
function switchDiseaseSection(cropName) {
  // Toggle disease grids
  const allGrids = document.querySelectorAll('[data-crop-diseases]');
  allGrids.forEach(grid => {
    if (grid.getAttribute('data-crop-diseases') === cropName) {
      grid.style.display = '';
    } else {
      grid.style.display = 'none';
    }
  });

  // Update section title
  const titleEl = document.getElementById('diseasesSectionTitle');
  if (titleEl) {
    const i18nKey = CROP_DISEASE_TITLES[cropName] || 'diseases_title_groundnut';
    titleEl.setAttribute('data-i18n', i18nKey);
    // Apply translated text or fallback
    titleEl.textContent = t(i18nKey, CROP_DISEASE_TITLES_FALLBACK[cropName] || 'Diseases We Detect');
  }
}

/* ────────────────────────────────────
   Validation Error Display
   ──────────────────────────────────── */

function showValidationError(data, file) {
  const validationError = document.getElementById('validationError');
  const validationIcon = document.getElementById('validationIcon');
  const validationTitle = document.getElementById('validationTitle');
  const validationMessage = document.getElementById('validationMessage');
  const resultCard = document.querySelector('.result-card');
  const resultGrid = document.querySelector('.result-grid');
  const analyzeAnotherBtn = document.getElementById('analyzeAnother');
  const validationRetry = document.getElementById('validationRetry');

  // Hide the normal result grid, show validation error
  if (resultGrid) resultGrid.style.display = 'none';
  if (analyzeAnotherBtn) analyzeAnotherBtn.style.display = 'none';
  if (validationError) validationError.style.display = '';

  // Set icon based on error type
  const errorType = data.error_type || 'INVALID_CROP_IMAGE';
  const icons = {
    'IMAGE_QUALITY': '📷',
    'NOT_PLANT': '🚫',
    'WRONG_CROP': '🔄',
    'INVALID_CROP_IMAGE': '⚠️',
    'LOW_CONFIDENCE': '🔍'
  };
  const titles = {
    'IMAGE_QUALITY': t('validation_quality_title', 'Image Quality Issue'),
    'NOT_PLANT': t('validation_invalid_title', 'Invalid Image'),
    'WRONG_CROP': t('validation_wrong_crop_title', 'Wrong Crop Detected'),
    'INVALID_CROP_IMAGE': t('validation_invalid_title', 'Invalid Image'),
    'LOW_CONFIDENCE': t('validation_low_confidence_title', 'Unable to Identify Disease')
  };

  if (validationIcon) validationIcon.textContent = icons[errorType] || '⚠️';
  if (validationTitle) validationTitle.textContent = titles[errorType] || 'Validation Failed';
  if (validationMessage) validationMessage.textContent = data.message || 'Please try again with a different image.';

  // Set up retry button
  if (validationRetry) {
    validationRetry.onclick = () => {
      // Reset everything back to upload view
      if (validationError) validationError.style.display = 'none';
      if (resultGrid) resultGrid.style.display = '';
      if (analyzeAnotherBtn) analyzeAnotherBtn.style.display = '';
      resetToUpload();
    };
  }

  // Show a toast too
  const toastType = errorType === 'LOW_CONFIDENCE' ? 'warning' : 'error';
  showToast(data.message || 'Image validation failed.', toastType, 5000);
}
