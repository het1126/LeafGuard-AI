/* ============================================
   LeafGuard AI — Multi-Language System
   Supports: English, Hindi, Gujarati
   ============================================ */

// Language configuration
const SUPPORTED_LANGUAGES = {
  'en': { name: 'English', nativeName: 'English' },
  'hi': { name: 'Hindi', nativeName: 'हिन्दी' },
  'gu': { name: 'Gujarati', nativeName: 'ગુજરાતી' }
};

// Fallback translations (English) — used when server is unavailable
const FALLBACK_TRANSLATIONS = {
  // Navbar
  nav_home: 'Home',
  nav_detect: 'Detect Disease',
  nav_diseases: 'Diseases',
  nav_how: 'How It Works',

  // Hero
  hero_title: 'LeafGuard',
  hero_subtitle: 'AI-Powered Crop Disease Detection for Smart Farming',
  hero_cta: 'Start Detection',

  // Upload
  upload_title: 'Upload Leaf Image',
  upload_desc: 'Take a clear photo of the affected leaf and upload it for instant AI analysis',
  upload_drag: 'Drag & drop your leaf image here',
  upload_or: 'or',
  upload_browse: 'Browse Files',
  upload_camera: '📷 Use Camera',
  upload_analyze: '🔬 Analyze Leaf',

  // Result
  result_title: 'Analysis Result',
  result_disease: 'Disease Detected',
  result_confidence: 'Confidence',
  result_causes: '📋 Possible Causes',
  result_treatment: '💊 Treatment Suggestions',
  result_prevention: '🛡️ Prevention Tips',
  result_another: '🔄 Analyze Another Leaf',

  // Diseases — Section Titles (per crop)
  diseases_title: 'Groundnut Diseases We Detect',
  diseases_title_groundnut: 'Groundnut Diseases We Detect',
  diseases_title_potato: 'Potato Diseases We Detect',
  diseases_title_pepper: 'Pepper Diseases We Detect',
  diseases_title_tomato: 'Tomato Diseases We Detect',

  // Diseases — Groundnut
  disease_healthy: 'Healthy',
  disease_healthy_desc: 'No signs of disease. The leaf appears normal and healthy with good color and texture.',
  disease_leaf_spot: 'Leaf Spot (Early & Late)',
  disease_leaf_spot_desc: 'Circular dark spots on leaves caused by Cercospora fungus. Can reduce yield by 50% if untreated.',
  disease_rust: 'Rust',
  disease_rust_desc: 'Orange-brown pustules on leaf undersides caused by Puccinia arachidis. Spreads rapidly in humid conditions.',
  disease_alternaria: 'Alternaria Leaf Spot',
  disease_alternaria_desc: 'Irregular brown lesions with concentric rings. Caused by Alternaria alternata in warm, humid weather.',
  disease_rosette: 'Rosette',
  disease_rosette_desc: 'Viral disease transmitted by aphids causing severe stunting, yellowing, and curling of leaves.',

  // Diseases — Potato
  disease_potato_healthy: 'Healthy',
  disease_potato_healthy_desc: 'No signs of disease. The potato plant appears normal with healthy foliage and growth.',
  disease_potato_bacteria: 'Bacterial Wilt',
  disease_potato_bacteria_desc: 'Caused by Ralstonia solanacearum. Plants wilt rapidly even with adequate soil moisture.',
  disease_potato_fungi: 'Fungal Blight',
  disease_potato_fungi_desc: 'Caused by Alternaria solani. Dark concentric spots on older leaves leading to defoliation.',
  disease_potato_nematode: 'Potato Cyst Nematode',
  disease_potato_nematode_desc: 'Microscopic worms feeding on roots causing stunted growth, yellowing, and yield loss.',
  disease_potato_pest: 'Pest Infestation',
  disease_potato_pest_desc: 'Insects like Colorado Potato Beetle feeding on foliage, causing defoliation and yield loss.',
  disease_potato_phytopthora: 'Late Blight (Phytophthora)',
  disease_potato_phytopthora_desc: 'Devastating disease caused by Phytophthora infestans. Can destroy a crop in days under cool, wet conditions.',
  disease_potato_virus: 'Potato Virus (PVY/PLRV)',
  disease_potato_virus_desc: 'Viral diseases transmitted by aphids causing mosaic patterns, leaf rolling, and stunted growth.',

  // Diseases — Pepper
  disease_pepper_healthy: 'Healthy',
  disease_pepper_healthy_desc: 'The pepper plant appears healthy with no signs of disease. Vibrant green leaves and normal growth.',
  disease_pepper_bacterial: 'Bacterial Spot',
  disease_pepper_bacterial_desc: 'Caused by Xanthomonas campestris. Water-soaked spots on leaves that enlarge and turn brown with yellow halos.',

  // Diseases — Tomato
  disease_tomato_healthy: 'Healthy',
  disease_tomato_healthy_desc: 'The tomato plant appears healthy with vibrant green foliage and no signs of disease.',
  disease_tomato_bacterial: 'Bacterial Spot',
  disease_tomato_bacterial_desc: 'Small, dark, water-soaked lesions on leaves and fruit caused by Xanthomonas species.',
  disease_tomato_early_blight: 'Early Blight',
  disease_tomato_early_blight_desc: 'Concentric dark ring spots (target pattern) on older leaves caused by Alternaria solani.',
  disease_tomato_late_blight: 'Late Blight',
  disease_tomato_late_blight_desc: 'Devastating disease by Phytophthora infestans. Water-soaked lesions with white fuzzy mold underneath.',
  disease_tomato_leaf_mold: 'Leaf Mold',
  disease_tomato_leaf_mold_desc: 'Yellow spots on upper surface with olive-green velvety mold underneath. Common in greenhouses.',
  disease_tomato_septoria: 'Septoria Leaf Spot',
  disease_tomato_septoria_desc: 'Numerous small circular spots with dark borders and gray centers. Tiny black dots visible in spot centers.',
  disease_tomato_spider_mite: 'Spider Mite Damage',
  disease_tomato_spider_mite_desc: 'Fine stippling and webbing on leaves caused by two-spotted spider mites in hot, dry conditions.',
  disease_tomato_target_spot: 'Target Spot',
  disease_tomato_target_spot_desc: 'Brown spots with concentric ring patterns on leaves, stems, and fruit by Corynespora cassiicola.',
  disease_tomato_ylcv: 'Yellow Leaf Curl Virus',
  disease_tomato_ylcv_desc: 'Devastating viral disease causing upward leaf curling, yellowing, and severe stunting. Spread by whiteflies.',
  disease_tomato_mosaic: 'Tomato Mosaic Virus',
  disease_tomato_mosaic_desc: 'Highly contagious virus causing light/dark green mosaic patterns, leaf distortion, and stunted growth.',

  // How it works
  how_title: 'How It Works',
  how_step1_title: 'Capture',
  how_step1_desc: 'Take a clear photo of the affected leaf using your phone camera or upload an existing image.',
  how_step2_title: 'Analyze',
  how_step2_desc: 'Our AI model powered by MobileNetV2 analyzes the leaf image and identifies any diseases.',
  how_step3_title: 'Get Treatment',
  how_step3_desc: 'Receive instant treatment suggestions and prevention tips in your preferred language.',

  // Footer
  footer_desc: 'AI-powered crop disease detection for smarter, healthier farming.',

  // Toasts
  toast_upload_success: 'Image uploaded successfully!',
  toast_invalid_type: 'Invalid file type. Please upload an image (JPG, PNG, WEBP, GIF).',
  toast_file_too_large: 'File too large. Maximum size is 16MB.',
  toast_analysis_error: 'Analysis failed. Please try again.',
  toast_no_file: 'Please select an image first.',

  // Loading
  loading_text: 'Analyzing your leaf...',

  // Crop selection
  upload_crop_label: 'Select Crop',
  crop_groundnut: 'Groundnut',
  crop_potato: 'Potato',
  crop_pepper: 'Pepper',
  crop_tomato: 'Tomato',

  // Result extras
  result_crop: 'Crop',
  result_pred_time: 'Prediction Time',
  result_description: '📝 Description',
  result_symptoms: '🔍 Symptoms',

  // Validation
  validation_invalid_title: 'Invalid Image',
  validation_wrong_crop_title: 'Wrong Crop Detected',
  validation_low_confidence_title: 'Unable to Identify Disease',
  validation_quality_title: 'Image Quality Issue',
  validation_retry: 'Try Again',

  // History
  nav_history: 'History',
  history_title: 'Prediction History',
  history_desc: 'View your past predictions and results',
  history_clear: '🗑️ Clear History',
  history_empty: 'No predictions yet. Upload a leaf image to get started!',
  history_col_date: 'Date & Time',
  history_col_crop: 'Crop',
  history_col_disease: 'Disease',
  history_col_confidence: 'Confidence',
  history_cleared: 'History cleared!',
  no_info_available: 'No information available'
};

// ── Built-in Hindi translations (client-side fallback) ──
const HINDI_TRANSLATIONS = {
  nav_home: 'होम', nav_detect: 'रोग पहचानें', nav_diseases: 'रोग', nav_how: 'कैसे काम करता है',
  hero_title: 'लीफगार्ड', hero_subtitle: 'स्मार्ट खेती के लिए AI-संचालित फसल रोग पहचान', hero_cta: 'पहचान शुरू करें',
  upload_title: 'पत्ते की तस्वीर अपलोड करें', upload_desc: 'प्रभावित पत्ते की स्पष्ट तस्वीर लें और तुरंत AI विश्लेषण के लिए अपलोड करें',
  upload_drag: 'अपनी पत्ते की तस्वीर यहाँ खींचें और छोड़ें', upload_or: 'या', upload_browse: 'फ़ाइलें चुनें',
  upload_camera: '📷 कैमरा उपयोग करें', upload_analyze: '🔬 पत्ता विश्लेषण करें',
  result_title: 'विश्लेषण परिणाम', result_disease: 'रोग की पहचान हुई', result_confidence: 'विश्वास स्तर',
  result_causes: '📋 संभावित कारण', result_treatment: '💊 उपचार सुझाव', result_prevention: '🛡️ रोकथाम के उपाय',
  result_another: '🔄 दूसरा पत्ता विश्लेषण करें',
  diseases_title: 'मूंगफली के रोग जो हम पहचानते हैं',
  diseases_title_groundnut: 'मूंगफली के रोग जो हम पहचानते हैं', diseases_title_potato: 'आलू के रोग जो हम पहचानते हैं',
  diseases_title_pepper: 'मिर्च के रोग जो हम पहचानते हैं', diseases_title_tomato: 'टमाटर के रोग जो हम पहचानते हैं',
  disease_healthy: 'स्वस्थ', disease_healthy_desc: 'रोग का कोई लक्षण नहीं। पत्ता सामान्य और स्वस्थ दिखाई देता है, अच्छे रंग और बनावट के साथ।',
  disease_leaf_spot: 'पत्ती धब्बा रोग (प्रारंभिक और देर से)', disease_leaf_spot_desc: 'सर्कोस्पोरा कवक के कारण पत्तियों पर गोलाकार काले धब्बे। उपचार न करने पर उपज 50% तक कम हो सकती है।',
  disease_rust: 'रतुआ रोग', disease_rust_desc: 'पत्तियों के निचले हिस्से पर नारंगी-भूरे रंग के दाने। पुसीनिया एराकिडिस कवक के कारण। नम परिस्थितियों में तेजी से फैलता है।',
  disease_alternaria: 'अल्टरनेरिया पत्ती धब्बा', disease_alternaria_desc: 'समकेंद्रित वलयों के साथ अनियमित भूरे घाव। गर्म, नम मौसम में अल्टरनेरिया अल्टरनाटा के कारण।',
  disease_rosette: 'रोज़ेट', disease_rosette_desc: 'एफिड्स द्वारा प्रसारित वायरल रोग जो गंभीर बौनापन, पीलापन और पत्तियों के मुड़ने का कारण बनता है।',
  disease_potato_healthy: 'स्वस्थ', disease_potato_healthy_desc: 'रोग का कोई लक्षण नहीं। आलू का पौधा सामान्य दिखाई देता है, स्वस्थ पत्तियों और वृद्धि के साथ।',
  disease_potato_bacteria: 'बैक्टीरियल विल्ट', disease_potato_bacteria_desc: 'राल्स्टोनिया सोलानेसीरम के कारण। पर्याप्त मिट्टी नमी होने पर भी पौधे तेजी से मुरझाते हैं।',
  disease_potato_fungi: 'कवक ब्लाइट', disease_potato_fungi_desc: 'अल्टरनेरिया सोलानी के कारण। पुरानी पत्तियों पर गहरे समकेंद्रित धब्बे जो पत्तों के गिरने का कारण बनते हैं।',
  disease_potato_nematode: 'आलू सिस्ट नेमाटोड', disease_potato_nematode_desc: 'जड़ों पर खाने वाले सूक्ष्म कीड़े जो बौनी वृद्धि, पीलापन और उपज हानि का कारण बनते हैं।',
  disease_potato_pest: 'कीट संक्रमण', disease_potato_pest_desc: 'कोलोराडो आलू भृंग जैसे कीड़े पत्तियों को खाते हैं, जिससे पत्ते गिरते हैं और उपज कम होती है।',
  disease_potato_phytopthora: 'लेट ब्लाइट (फाइटोफ्थोरा)', disease_potato_phytopthora_desc: 'फाइटोफ्थोरा इंफेस्टांस के कारण होने वाला विनाशकारी रोग। ठंडी, गीली परिस्थितियों में कुछ ही दिनों में फसल नष्ट कर सकता है।',
  disease_potato_virus: 'आलू वायरस (PVY/PLRV)', disease_potato_virus_desc: 'एफिड्स द्वारा प्रसारित वायरल रोग जो मोज़ेक पैटर्न, पत्ती मुड़ना और बौनी वृद्धि का कारण बनते हैं।',
  disease_pepper_healthy: 'स्वस्थ', disease_pepper_healthy_desc: 'मिर्च का पौधा स्वस्थ दिखाई देता है, रोग का कोई लक्षण नहीं। जीवंत हरी पत्तियाँ और सामान्य वृद्धि।',
  disease_pepper_bacterial: 'बैक्टीरियल स्पॉट', disease_pepper_bacterial_desc: 'ज़ैंथोमोनास कैम्पेस्ट्रिस के कारण। पत्तियों पर पानी से भीगे धब्बे जो बड़े होते हैं और पीले हालों के साथ भूरे हो जाते हैं।',
  disease_tomato_healthy: 'स्वस्थ', disease_tomato_healthy_desc: 'टमाटर का पौधा जीवंत हरी पत्तियों के साथ स्वस्थ दिखाई देता है और रोग का कोई लक्षण नहीं।',
  disease_tomato_bacterial: 'बैक्टीरियल स्पॉट', disease_tomato_bacterial_desc: 'ज़ैंथोमोनास प्रजातियों के कारण पत्तियों और फलों पर छोटे, गहरे, पानी से भीगे घाव।',
  disease_tomato_early_blight: 'अर्ली ब्लाइट', disease_tomato_early_blight_desc: 'अल्टरनेरिया सोलानी के कारण पुरानी पत्तियों पर समकेंद्रित गहरे छल्ले वाले धब्बे (लक्ष्य पैटर्न)।',
  disease_tomato_late_blight: 'लेट ब्लाइट', disease_tomato_late_blight_desc: 'फाइटोफ्थोरा इंफेस्टांस द्वारा विनाशकारी रोग। नीचे सफेद रोएंदार फफूंद के साथ पानी से भीगे घाव।',
  disease_tomato_leaf_mold: 'पत्ती फफूंद', disease_tomato_leaf_mold_desc: 'ऊपरी सतह पर पीले धब्बे और नीचे जैतूनी-हरे मखमली फफूंद। ग्रीनहाउस में सामान्य।',
  disease_tomato_septoria: 'सेप्टोरिया पत्ती धब्बा', disease_tomato_septoria_desc: 'गहरे किनारों और भूरे केंद्रों के साथ कई छोटे गोलाकार धब्बे। धब्बों के केंद्र में छोटे काले बिंदु दिखाई देते हैं।',
  disease_tomato_spider_mite: 'मकड़ी माइट क्षति', disease_tomato_spider_mite_desc: 'गर्म, शुष्क परिस्थितियों में दो-धब्बेदार मकड़ी माइट के कारण पत्तियों पर बारीक धब्बे और जाले।',
  disease_tomato_target_spot: 'लक्ष्य धब्बा', disease_tomato_target_spot_desc: 'कोरिनेस्पोरा कैसीकोला द्वारा पत्तियों, तनों और फलों पर समकेंद्रित छल्ले पैटर्न वाले भूरे धब्बे।',
  disease_tomato_ylcv: 'पीली पत्ती मोड़ वायरस', disease_tomato_ylcv_desc: 'ऊपर की ओर पत्ती मुड़ना, पीलापन और गंभीर बौनापन पैदा करने वाला विनाशकारी वायरल रोग। सफेद मक्खी द्वारा फैलता है।',
  disease_tomato_mosaic: 'टमाटर मोज़ेक वायरस', disease_tomato_mosaic_desc: 'हल्के/गहरे हरे मोज़ेक पैटर्न, पत्ती विकृति और बौनी वृद्धि का कारण बनने वाला अत्यधिक संक्रामक वायरस।',
  how_title: 'यह कैसे काम करता है', how_step1_title: 'तस्वीर लें', how_step1_desc: 'अपने फोन कैमरे से प्रभावित पत्ते की स्पष्ट तस्वीर लें या मौजूदा तस्वीर अपलोड करें।',
  how_step2_title: 'विश्लेषण', how_step2_desc: 'हमारा MobileNetV2 AI मॉडल पत्ते की तस्वीर का विश्लेषण करता है और रोगों की पहचान करता है।',
  how_step3_title: 'उपचार पाएं', how_step3_desc: 'अपनी पसंदीदा भाषा में तुरंत उपचार सुझाव और रोकथाम के उपाय प्राप्त करें।',
  footer_desc: 'स्मार्ट और स्वस्थ खेती के लिए AI-संचालित फसल रोग पहचान।',
  toast_upload_success: 'तस्वीर सफलतापूर्वक अपलोड हुई!', toast_invalid_type: 'अमान्य फ़ाइल प्रकार। कृपया एक तस्वीर (JPG, PNG, WEBP, GIF) अपलोड करें।',
  toast_file_too_large: 'फ़ाइल बहुत बड़ी है। अधिकतम आकार 16MB है।', toast_analysis_error: 'विश्लेषण विफल। कृपया पुनः प्रयास करें।',
  toast_no_file: 'कृपया पहले एक तस्वीर चुनें।', loading_text: 'आपके पत्ते का विश्लेषण हो रहा है...',
  upload_crop_label: 'फसल चुनें', crop_groundnut: 'मूंगफली', crop_potato: 'आलू', crop_pepper: 'मिर्च', crop_tomato: 'टमाटर',
  result_crop: 'फसल', result_pred_time: 'पहचान समय', result_description: '📝 विवरण', result_symptoms: '🔍 लक्षण',
  validation_invalid_title: 'अमान्य तस्वीर', validation_wrong_crop_title: 'गलत फसल का पता चला',
  validation_low_confidence_title: 'रोग पहचानने में असमर्थ', validation_quality_title: 'तस्वीर गुणवत्ता समस्या', validation_retry: '🔄 पुनः प्रयास करें',
  nav_history: 'इतिहास', history_title: 'पहचान इतिहास', history_desc: 'अपनी पिछली पहचान और परिणाम देखें',
  history_clear: '🗑️ इतिहास मिटाएं', history_empty: 'अभी तक कोई पहचान नहीं। शुरू करने के लिए पत्ते की तस्वीर अपलोड करें!',
  history_col_date: 'तारीख और समय', history_col_crop: 'फसल', history_col_disease: 'रोग', history_col_confidence: 'विश्वास स्तर',
  history_cleared: 'इतिहास मिटा दिया गया!',
  no_info_available: 'कोई जानकारी उपलब्ध नहीं'
};

// ── Built-in Gujarati translations (client-side fallback) ──
const GUJARATI_TRANSLATIONS = {
  nav_home: 'હોમ', nav_detect: 'રોગ ઓળખો', nav_diseases: 'રોગો', nav_how: 'કેવી રીતે કામ કરે છે',
  hero_title: 'લીફગાર્ડ', hero_subtitle: 'સ્માર્ટ ખેતી માટે AI-સંચાલિત પાક રોગ ઓળખ', hero_cta: 'ઓળખ શરૂ કરો',
  upload_title: 'પાનની તસ્વીર અપલોડ કરો', upload_desc: 'અસરગ્રસ્ત પાનની સ્પષ્ટ તસ્વીર લો અને તાત્કાલિક AI વિશ્લેષણ માટે અપલોડ કરો',
  upload_drag: 'તમારી પાનની તસ્વીર અહીં ખેંચો અને છોડો', upload_or: 'અથવા', upload_browse: 'ફાઇલો પસંદ કરો',
  upload_camera: '📷 કેમેરા વાપરો', upload_analyze: '🔬 પાનનું વિશ્લેષણ કરો',
  result_title: 'વિશ્લેષણ પરિણામ', result_disease: 'રોગ ઓળખાયો', result_confidence: 'વિશ્વાસ સ્તર',
  result_causes: '📋 સંભવિત કારણો', result_treatment: '💊 ઉપચાર સૂચનો', result_prevention: '🛡️ રોકથામ ટિપ્સ',
  result_another: '🔄 બીજા પાનનું વિશ્લેષણ કરો',
  diseases_title: 'અમે ઓળખીએ છીએ તે મગફળીના રોગો',
  diseases_title_groundnut: 'અમે ઓળખીએ છીએ તે મગફળીના રોગો', diseases_title_potato: 'અમે ઓળખીએ છીએ તે બટાટાના રોગો',
  diseases_title_pepper: 'અમે ઓળખીએ છીએ તે મરચાંના રોગો', diseases_title_tomato: 'અમે ઓળખીએ છીએ તે ટમેટાના રોગો',
  disease_healthy: 'સ્વસ્થ', disease_healthy_desc: 'રોગના કોઈ ચિહ્નો નથી. પાન સામાન્ય અને સ્વસ્થ દેખાય છે, સારા રંગ અને બનાવટ સાથે.',
  disease_leaf_spot: 'પાન પર ડાઘ (વહેલો અને મોડો)', disease_leaf_spot_desc: 'સર્કોસ્પોરા ફૂગને કારણે પાન પર ગોળ કાળા ડાઘ. સારવાર ન કરવામાં આવે તો ઉપજ 50% સુધી ઘટી શકે છે.',
  disease_rust: 'રસ્ટ રોગ', disease_rust_desc: 'પાનની નીચેની બાજુએ નારંગી-ભૂરા રંગના દાણા. પુસીનિયા એરાકિડિસ ફૂગને કારણે. ભેજવાળી પરિસ્થિતિમાં ઝડપથી ફેલાય છે.',
  disease_alternaria: 'અલ્ટરનેરિયા પાન ડાઘ', disease_alternaria_desc: 'સમકેન્દ્રિત વલયો સાથે અનિયમિત ભૂરા ઘા. ગરમ, ભેજવાળા હવામાનમાં અલ્ટરનેરિયા અલ્ટરનાટાને કારણે.',
  disease_rosette: 'રોઝેટ', disease_rosette_desc: 'મોલો દ્વારા ફેલાતો વાયરલ રોગ જે ગંભીર વામનતા, પીળાશ અને પાનના વળાંકનું કારણ બને છે.',
  disease_potato_healthy: 'સ્વસ્થ', disease_potato_healthy_desc: 'રોગના કોઈ ચિહ્નો નથી. બટાટાનો છોડ સામાન્ય દેખાય છે, સ્વસ્થ પાન અને વૃદ્ધિ સાથે.',
  disease_potato_bacteria: 'બેક્ટેરિયલ વિલ્ટ', disease_potato_bacteria_desc: 'રાલ્સ્ટોનિયા સોલાનેસીરમને કારણે. પૂરતી જમીન ભેજ હોવા છતાં છોડ ઝડપથી સુકાય છે.',
  disease_potato_fungi: 'ફૂગ બ્લાઈટ', disease_potato_fungi_desc: 'અલ્ટરનેરિયા સોલાનીને કારણે. જૂના પાન પર ઘેરા સમકેન્દ્રિત ડાઘ જે પાન ખરવાનું કારણ બને છે.',
  disease_potato_nematode: 'બટાટા સિસ્ટ નેમેટોડ', disease_potato_nematode_desc: 'મૂળ પર ખાનારા સૂક્ષ્મ કીડા જે વામન વૃદ્ધિ, પીળાશ અને ઉપજ ઘટાડાનું કારણ બને છે.',
  disease_potato_pest: 'જીવાત ઉપદ્રવ', disease_potato_pest_desc: 'કોલોરાડો બટાટા ભૃંગ જેવા જીવાત પાન ખાય છે, જેથી પાન ખરે છે અને ઉપજ ઘટે છે.',
  disease_potato_phytopthora: 'લેટ બ્લાઈટ (ફાઈટોફ્થોરા)', disease_potato_phytopthora_desc: 'ફાઈટોફ્થોરા ઈન્ફેસ્ટન્સને કારણે થતો વિનાશકારી રોગ. ઠંડી, ભીની પરિસ્થિતિમાં થોડા દિવસોમાં પાક નાશ કરી શકે છે.',
  disease_potato_virus: 'બટાટા વાયરસ (PVY/PLRV)', disease_potato_virus_desc: 'મોલો દ્વારા ફેલાતા વાયરલ રોગો જે મોઝેક પેટર્ન, પાન વળાંક અને વામન વૃદ્ધિનું કારણ બને છે.',
  disease_pepper_healthy: 'સ્વસ્થ', disease_pepper_healthy_desc: 'મરચાંનો છોડ સ્વસ્થ દેખાય છે, રોગના કોઈ ચિહ્નો નથી. જીવંત લીલા પાન અને સામાન્ય વૃદ્ધિ.',
  disease_pepper_bacterial: 'બેક્ટેરિયલ સ્પોટ', disease_pepper_bacterial_desc: 'ઝેન્થોમોનાસ કેમ્પેસ્ટ્રિસને કારણે. પાન પર પાણીથી ભીંજાયેલા ડાઘ જે મોટા થાય છે અને પીળા હાલો સાથે ભૂરા થાય છે.',
  disease_tomato_healthy: 'સ્વસ્થ', disease_tomato_healthy_desc: 'ટમેટાનો છોડ જીવંત લીલા પાન સાથે સ્વસ્થ દેખાય છે અને રોગના કોઈ ચિહ્નો નથી.',
  disease_tomato_bacterial: 'બેક્ટેરિયલ સ્પોટ', disease_tomato_bacterial_desc: 'ઝેન્થોમોનાસ પ્રજાતિઓને કારણે પાન અને ફળ પર નાના, ઘેરા, પાણીથી ભીંજાયેલા ઘા.',
  disease_tomato_early_blight: 'અર્લી બ્લાઈટ', disease_tomato_early_blight_desc: 'અલ્ટરનેરિયા સોલાનીને કારણે જૂના પાન પર સમકેન્દ્રિત ઘેરા રિંગ ડાઘ (ટાર્ગેટ પેટર્ન).',
  disease_tomato_late_blight: 'લેટ બ્લાઈટ', disease_tomato_late_blight_desc: 'ફાઈટોફ્થોરા ઈન્ફેસ્ટન્સ દ્વારા વિનાશકારી રોગ. નીચે સફેદ રૂંવાટીદાર ફૂગ સાથે પાણીથી ભીંજાયેલા ઘા.',
  disease_tomato_leaf_mold: 'પાન ફૂગ', disease_tomato_leaf_mold_desc: 'ઉપરની સપાટી પર પીળા ડાઘ અને નીચે ઓલિવ-લીલા મખમલી ફૂગ. ગ્રીનહાઉસમાં સામાન્ય.',
  disease_tomato_septoria: 'સેપ્ટોરિયા પાન ડાઘ', disease_tomato_septoria_desc: 'ઘેરા કિનારા અને ભૂખરા કેન્દ્રો સાથે અસંખ્ય નાના ગોળ ડાઘ. ડાઘના કેન્દ્રમાં નાના કાળા બિંદુઓ દેખાય છે.',
  disease_tomato_spider_mite: 'સ્પાઈડર માઈટ નુકસાન', disease_tomato_spider_mite_desc: 'ગરમ, સૂકી પરિસ્થિતિમાં બે-ડાઘવાળી સ્પાઈડર માઈટને કારણે પાન પર ઝીણા ડાઘ અને જાળા.',
  disease_tomato_target_spot: 'ટાર્ગેટ સ્પોટ', disease_tomato_target_spot_desc: 'કોરિનેસ્પોરા કેસીકોલા દ્વારા પાન, દાંડી અને ફળ પર સમકેન્દ્રિત રિંગ પેટર્ન સાથે ભૂરા ડાઘ.',
  disease_tomato_ylcv: 'પીળા પાન વળાંક વાયરસ', disease_tomato_ylcv_desc: 'ઉપર તરફ પાન વળાંક, પીળાશ અને ગંભીર વામનતાનું કારણ બનતો વિનાશકારી વાયરલ રોગ. સફેદ માખી દ્વારા ફેલાય છે.',
  disease_tomato_mosaic: 'ટમેટા મોઝેક વાયરસ', disease_tomato_mosaic_desc: 'હળવા/ઘેરા લીલા મોઝેક પેટર્ન, પાન વિકૃતિ અને વામન વૃદ્ધિનું કારણ બનતો ખૂબ ચેપી વાયરસ.',
  how_title: 'આ કેવી રીતે કામ કરે છે', how_step1_title: 'તસ્વીર લો', how_step1_desc: 'તમારા ફોન કેમેરાથી અસરગ્રસ્ત પાનની સ્પષ્ટ તસ્વીર લો અથવા હાલની તસ્વીર અપલોડ કરો.',
  how_step2_title: 'વિશ્લેષણ', how_step2_desc: 'અમારું MobileNetV2 AI મોડેલ પાનની તસ્વીરનું વિશ્લેષણ કરે છે અને રોગો ઓળખે છે.',
  how_step3_title: 'ઉપચાર મેળવો', how_step3_desc: 'તમારી પસંદગીની ભાષામાં તાત્કાલિક ઉપચાર સૂચનો અને રોકથામ ટિપ્સ મેળવો.',
  footer_desc: 'સ્માર્ટ અને સ્વસ્થ ખેતી માટે AI-સંચાલિત પાક રોગ ઓળખ.',
  toast_upload_success: 'તસ્વીર સફળતાપૂર્વક અપલોડ થઈ!', toast_invalid_type: 'અમાન્ય ફાઇલ પ્રકાર. કૃપા કરીને એક તસ્વીર (JPG, PNG, WEBP, GIF) અપલોડ કરો.',
  toast_file_too_large: 'ફાઇલ ખૂબ મોટી છે. મહત્તમ કદ 16MB છે.', toast_analysis_error: 'વિશ્લેષણ નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.',
  toast_no_file: 'કૃપા કરીને પહેલાં એક તસ્વીર પસંદ કરો.', loading_text: 'તમારા પાનનું વિશ્લેષણ થઈ રહ્યું છે...',
  upload_crop_label: 'પાક પસંદ કરો', crop_groundnut: 'મગફળી', crop_potato: 'બટાટા', crop_pepper: 'મરચાં', crop_tomato: 'ટમેટા',
  result_crop: 'પાક', result_pred_time: 'ઓળખ સમય', result_description: '📝 વર્ણન', result_symptoms: '🔍 લક્ષણો',
  validation_invalid_title: 'અમાન્ય તસ્વીર', validation_wrong_crop_title: 'ખોટા પાકની ઓળખ થઈ',
  validation_low_confidence_title: 'રોગ ઓળખવામાં અસમર્થ', validation_quality_title: 'તસ્વીર ગુણવત્તા સમસ્યા', validation_retry: '🔄 ફરી પ્રયાસ કરો',
  nav_history: 'ઇતિહાસ', history_title: 'ઓળખ ઇતિહાસ', history_desc: 'તમારી ભૂતકાળની ઓળખ અને પરિણામો જુઓ',
  history_clear: '🗑️ ઇતિહાસ સાફ કરો', history_empty: 'હજુ સુધી કોઈ ઓળખ નથી. શરૂ કરવા માટે પાનની તસ્વીર અપલોડ કરો!',
  history_col_date: 'તારીખ અને સમય', history_col_crop: 'પાક', history_col_disease: 'રોગ', history_col_confidence: 'વિશ્વાસ સ્તર',
  history_cleared: 'ઇતિહાસ સાફ થયો!',
  no_info_available: 'કોઈ માહિતી ઉપલબ્ધ નથી'
};

// Map language codes to their built-in translation objects
const CLIENT_TRANSLATIONS = {
  'en': FALLBACK_TRANSLATIONS,
  'hi': HINDI_TRANSLATIONS,
  'gu': GUJARATI_TRANSLATIONS
};

// Current translations cache
let currentTranslations = { ...FALLBACK_TRANSLATIONS };
let currentLanguage = 'en';

/**
 * Load language translations from the server
 * Falls back to built-in client-side translations if server is unavailable
 */
async function loadLanguage(langCode) {
  if (!SUPPORTED_LANGUAGES[langCode]) {
    console.warn(`Language "${langCode}" is not supported. Falling back to English.`);
    langCode = 'en';
  }

  // Get the built-in fallback for this language (always available)
  const builtInTranslations = CLIENT_TRANSLATIONS[langCode] || FALLBACK_TRANSLATIONS;

  try {
    const response = await fetch(`/api/language/${langCode}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();

    if (data && data.translations) {
      currentTranslations = { ...FALLBACK_TRANSLATIONS, ...builtInTranslations, ...data.translations };
    } else if (data) {
      currentTranslations = { ...FALLBACK_TRANSLATIONS, ...builtInTranslations, ...data };
    }

    currentLanguage = langCode;
    applyTranslations(currentTranslations);
    return currentTranslations;

  } catch (error) {
    console.warn(`Could not load translations for "${langCode}" from server:`, error.message);
    console.info(`Using built-in ${SUPPORTED_LANGUAGES[langCode]?.name || langCode} translations.`);

    // Use built-in translations for ANY language (not just English)
    currentTranslations = { ...FALLBACK_TRANSLATIONS, ...builtInTranslations };
    currentLanguage = langCode;
    applyTranslations(currentTranslations);

    return currentTranslations;
  }
}

/**
 * Apply translations to all elements with [data-i18n] attribute
 */
function applyTranslations(translations) {
  const elements = document.querySelectorAll('[data-i18n]');

  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] !== undefined) {
      // Handle different element types
      if (el.tagName === 'INPUT' && el.type !== 'hidden') {
        el.placeholder = translations[key];
      } else if (el.tagName === 'IMG') {
        el.alt = translations[key];
      } else if (el.hasAttribute('data-i18n-attr')) {
        const attr = el.getAttribute('data-i18n-attr');
        el.setAttribute(attr, translations[key]);
      } else {
        el.textContent = translations[key];
      }
    }
  });

  // Update the lang attribute on the html element
  document.documentElement.lang = currentLanguage;

  // Dispatch a custom event so other scripts can react
  window.dispatchEvent(new CustomEvent('languageChanged', {
    detail: { language: currentLanguage, translations }
  }));
}

/**
 * Get translated text by key
 * Useful for dynamic content that isn't in the DOM
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback text if key not found
 * @returns {string} Translated text
 */
function t(key, fallback = '') {
  return currentTranslations[key] || fallback || key;
}

/**
 * Set language, persist to localStorage, and load translations
 * @param {string} langCode - Language code ('en', 'hi', 'gu')
 */
async function setLanguage(langCode) {
  if (!SUPPORTED_LANGUAGES[langCode]) {
    console.warn(`Language "${langCode}" not supported.`);
    return;
  }

  // Save preference
  try {
    localStorage.setItem('leafguard_language', langCode);
  } catch (e) {
    console.warn('Could not save language preference to localStorage:', e);
  }

  // Update language switcher UI
  const switcher = document.getElementById('languageSwitcher');
  if (switcher) {
    switcher.value = langCode;
  }

  // Load and apply translations
  await loadLanguage(langCode);
}

/**
 * Initialize language system on page load
 * Reads saved preference from localStorage or defaults to 'en'
 */
async function initLanguage() {
  let savedLang = 'en';

  try {
    savedLang = localStorage.getItem('leafguard_language') || 'en';
  } catch (e) {
    console.warn('Could not read language preference from localStorage:', e);
  }

  // Validate saved language
  if (!SUPPORTED_LANGUAGES[savedLang]) {
    savedLang = 'en';
  }

  currentLanguage = savedLang;

  // Update switcher to reflect saved preference
  const switcher = document.getElementById('languageSwitcher');
  if (switcher) {
    switcher.value = savedLang;
  }

  // Apply fallback translations immediately for instant UI
  applyTranslations(currentTranslations);

  // Then try to load from server (will update if available)
  await loadLanguage(savedLang);

  // Setup event listeners
  setupLanguageSwitcher();
}

/**
 * Setup language switcher event listeners
 */
function setupLanguageSwitcher() {
  const switcher = document.getElementById('languageSwitcher');
  if (!switcher) return;

  switcher.addEventListener('change', (e) => {
    const langCode = e.target.value;
    setLanguage(langCode);
  });
}

/**
 * Get current language code
 * @returns {string}
 */
function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Get all supported languages
 * @returns {object}
 */
function getSupportedLanguages() {
  return { ...SUPPORTED_LANGUAGES };
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initLanguage);


// =============================================================================
// MULTILINGUAL DISEASE REPORT LOCALIZATION LAYER
// =============================================================================

const DISEASE_TRANSLATIONS_DATABASE = {
  "en": {
    "Alternaria_Leaf_Spot": {
      "disease": "Alternaria Leaf Spot",
      "display_name": "Alternaria Leaf Spot",
      "crop_name": "Groundnut",
      "description": "Caused by the fungus Alternaria alternata. Irregular brown lesions with concentric rings appear on leaves. It survives in crop debris.",
      "symptoms": [
        "Irregular brown lesions",
        "Concentric rings (target-board pattern) on leaves",
        "Leaves drying up and dropping off"
      ],
      "causes": [
        "Caused by the fungus Alternaria alternata in warm, humid conditions."
      ],
      "treatment": [
        "Apply copper-based fungicides (Copper Oxychloride 3 g/L)",
        "Use Mancozeb (2.5 g/L)",
        "Remove and burn infected plant parts",
        "Apply fungicide within 48 hours of symptoms"
      ],
      "prevention": [
        "Maintain proper spacing (30 × 10 cm)",
        "Avoid waterlogging",
        "Use disease-free certified seeds",
        "Practice crop rotation with cereals"
      ]
    },
    "Healthy": {
      "disease": "Healthy",
      "display_name": "Healthy",
      "crop_name": "Potato",
      "description": "The plant appears healthy with no signs of disease.",
      "symptoms": [
        "None",
        "Vibrant green leaves",
        "Normal growth"
      ],
      "causes": [
        "Optimal growing conditions and absence of pathogens."
      ],
      "treatment": [
        "No treatment needed",
        "Continue regular watering",
        "Monitor leaves weekly",
        "Maintain soil health"
      ],
      "prevention": [
        "Continue good farming practices",
        "Use certified seeds",
        "Maintain field hygiene",
        "Practice crop rotation"
      ]
    },
    "Leaf_Spot_Early_and_Late": {
      "disease": "Leaf Spot (Early and Late)",
      "display_name": "Leaf Spot (Early and Late)",
      "crop_name": "Groundnut",
      "description": "Caused by Cercospora arachidicola (early) and Cercosporidium personatum (late). Brown or black spots appear on leaves.",
      "symptoms": [
        "Brown or dark spots on upper leaf surface",
        "Yellow halo around spots",
        "Premature leaf drop"
      ],
      "causes": [
        "Fungal infection thriving in warm, humid conditions."
      ],
      "treatment": [
        "Apply fungicides such as Mancozeb",
        "Remove heavily infected leaves",
        "Spray fungicide every 10-14 days",
        "Use contact and systemic fungicides"
      ],
      "prevention": [
        "Crop rotation with non-host crops",
        "Avoid overhead irrigation",
        "Plant resistant varieties",
        "Maintain proper plant spacing"
      ]
    },
    "Rosette": {
      "disease": "Groundnut Rosette Disease",
      "display_name": "Groundnut Rosette Disease",
      "crop_name": "Groundnut",
      "description": "A viral disease transmitted by aphids. Causes severe stunting of plants and yellowing of leaves.",
      "symptoms": [
        "Severe stunting",
        "Yellowing of leaves",
        "Curled or distorted leaves"
      ],
      "causes": [
        "Viral infection transmitted by the groundnut aphid."
      ],
      "treatment": [
        "Control aphid vectors with insecticides",
        "Remove and destroy infected plants",
        "No cure once infected",
        "Apply systemic insecticides early"
      ],
      "prevention": [
        "Plant early in the season",
        "Maintain high plant density",
        "Remove volunteer plants",
        "Use resistant varieties"
      ]
    },
    "Rust": {
      "disease": "Rust",
      "display_name": "Rust",
      "crop_name": "Groundnut",
      "description": "Caused by the fungus Puccinia arachidis. Orange-brown pustules appear on the underside of leaves.",
      "symptoms": [
        "Orange-brown pustules on leaf underside",
        "Leaves turn brown and dry up",
        "Pustules rupture releasing powdery spores"
      ],
      "causes": [
        "Fungus Puccinia arachidis spreading via airborne spores."
      ],
      "treatment": [
        "Apply systemic fungicides (Triadimefon)",
        "Spray at first sign of pustules",
        "Repeat every 10-15 days",
        "Combine with neem oil"
      ],
      "prevention": [
        "Grow rust-resistant varieties",
        "Sow early",
        "Remove crop residues",
        "Avoid excessive nitrogen"
      ]
    },
    "Bacteria": {
      "disease": "Bacterial Wilt",
      "display_name": "Bacterial Wilt",
      "crop_name": "Potato",
      "description": "Caused by Ralstonia solanacearum. Plants wilt rapidly even with adequate soil moisture.",
      "symptoms": [
        "Rapid wilting of leaves and stems",
        "Stems may show brown discoloration inside",
        "White bacterial ooze from cut stems"
      ],
      "causes": [
        "Bacterial infection through roots or wounded plant parts."
      ],
      "treatment": [
        "Remove and destroy infected plants",
        "No chemical cure available",
        "Solarize soil if heavily infested",
        "Apply bio-control agents preventatively"
      ],
      "prevention": [
        "Use certified disease-free seed tubers",
        "Practice 3-5 year crop rotation",
        "Improve soil drainage",
        "Sanitize farm equipment"
      ]
    },
    "Fungi": {
      "disease": "Fungal Blight (Early Blight)",
      "display_name": "Fungal Blight (Early Blight)",
      "crop_name": "Potato",
      "description": "Caused by Alternaria solani. Dark, concentric spots appear on older leaves first.",
      "symptoms": [
        "Dark brown spots with concentric rings",
        "Yellowing around spots",
        "Leaves drying and dying"
      ],
      "causes": [
        "Fungus spreading in warm, moist environments."
      ],
      "treatment": [
        "Apply protectant fungicides (Chlorothalonil)",
        "Apply systemic fungicides",
        "Spray early in the season",
        "Remove infected debris"
      ],
      "prevention": [
        "Use disease-free seed",
        "Avoid overhead irrigation",
        "Provide adequate fertilization",
        "Rotate crops with non-solanaceous plants"
      ]
    },
    "Nematode": {
      "disease": "Potato Cyst Nematode",
      "display_name": "Potato Cyst Nematode",
      "crop_name": "Potato",
      "description": "Microscopic worms that feed on potato roots, causing poor growth and yield loss.",
      "symptoms": [
        "Stunted plant growth",
        "Yellowing of leaves",
        "Tiny white/yellow cysts on roots"
      ],
      "causes": [
        "Infestation of Globodera species in the soil."
      ],
      "treatment": [
        "Apply nematicides before planting",
        "Use trap crops",
        "Solarize soil",
        "Fumigate soil in severe cases"
      ],
      "prevention": [
        "Strict quarantine measures",
        "Long crop rotations (up to 7 years)",
        "Plant resistant varieties",
        "Clean equipment to prevent soil spread"
      ]
    },
    "Pest": {
      "disease": "Pest Infestation (Colorado Potato Beetle)",
      "display_name": "Pest Infestation (Colorado Potato Beetle)",
      "crop_name": "Potato",
      "description": "Insects feeding on potato foliage, which can completely defoliate the plant.",
      "symptoms": [
        "Holes in leaves",
        "Skeletonized leaves",
        "Presence of larvae or adult beetles"
      ],
      "causes": [
        "Insect pests multiplying rapidly in favorable conditions."
      ],
      "treatment": [
        "Hand-pick beetles and larvae",
        "Apply Spinosad or Neem oil",
        "Use specific chemical insecticides",
        "Apply Bacillus thuringiensis (Bt) for larvae"
      ],
      "prevention": [
        "Use row covers",
        "Practice crop rotation",
        "Encourage natural predators",
        "Plant early to avoid peak pest populations"
      ]
    },
    "Phytopthora": {
      "disease": "Late Blight (Phytophthora)",
      "display_name": "Late Blight (Phytophthora)",
      "crop_name": "Potato",
      "description": "A devastating disease caused by Phytophthora infestans. Can destroy a crop in days under cool, wet conditions.",
      "symptoms": [
        "Water-soaked, dark green spots on leaves",
        "White fungal growth on leaf underside",
        "Brown, rot on tubers"
      ],
      "causes": [
        "Oomycete pathogen thriving in cool, wet weather."
      ],
      "treatment": [
        "Apply contact fungicides preventatively",
        "Use systemic fungicides like Metalaxyl",
        "Destroy infected vines before harvest",
        "Harvest in dry conditions"
      ],
      "prevention": [
        "Plant resistant varieties",
        "Destroy volunteer potatoes",
        "Ensure good soil drainage",
        "Avoid late harvesting"
      ]
    },
    "Virus": {
      "disease": "Potato Virus (PVY/PLRV)",
      "display_name": "Potato Virus (PVY/PLRV)",
      "crop_name": "Potato",
      "description": "Viral diseases transmitted by aphids, causing mosaic patterns or leaf rolling.",
      "symptoms": [
        "Mottled or mosaic patterns on leaves",
        "Rolling of leaves upward",
        "Stunted growth and reduced yield"
      ],
      "causes": [
        "Viruses transmitted by aphid vectors or infected seed tubers."
      ],
      "treatment": [
        "No chemical cure for viruses",
        "Use insecticides to control vectors",
        "Apply mineral oils to reduce transmission",
        "Destroy heavily infected crops"
      ],
      "prevention": [
        "Use certified virus-free seed",
        "Control aphid populations",
        "Remove (rogue) infected plants early",
        "Avoid planting near infected fields"
      ]
    },
    "Pepper__bell___Bacterial_spot": {
      "disease": "Bacterial Spot",
      "display_name": "Bacterial Spot",
      "crop_name": "Pepper",
      "description": "Caused by Xanthomonas campestris. Water-soaked spots appear on leaves, stems, and fruit.",
      "symptoms": [
        "Small, dark, water-soaked spots on leaves",
        "Spots enlarge and turn brown with yellow halo",
        "Leaf drop in severe cases",
        "Raised scab-like spots on fruit"
      ],
      "causes": [
        "Bacterial infection (Xanthomonas campestris pv. vesicatoria) spread by rain splash and contaminated seeds."
      ],
      "treatment": [
        "Apply copper-based bactericides",
        "Spray Streptomycin if permitted",
        "Remove heavily infected plants",
        "Improve air circulation around plants"
      ],
      "prevention": [
        "Use certified disease-free seeds",
        "Avoid overhead irrigation",
        "Practice crop rotation (2-3 years)",
        "Remove infected plant debris"
      ]
    },
    "Pepper__bell___healthy": {
      "disease": "Healthy",
      "display_name": "Healthy",
      "crop_name": "Pepper",
      "description": "The pepper plant appears healthy with no signs of disease.",
      "symptoms": [
        "Vibrant green leaves",
        "No spots or lesions",
        "Normal growth and fruit development"
      ],
      "causes": [
        "Optimal growing conditions and absence of pathogens."
      ],
      "treatment": [
        "No treatment needed",
        "Continue regular watering",
        "Monitor leaves weekly",
        "Maintain soil health"
      ],
      "prevention": [
        "Continue good farming practices",
        "Use certified seeds",
        "Maintain field hygiene",
        "Practice crop rotation"
      ]
    },
    "Tomato_Bacterial_spot": {
      "disease": "Bacterial Spot",
      "display_name": "Bacterial Spot",
      "crop_name": "Tomato",
      "description": "Caused by Xanthomonas species. Small, dark, water-soaked lesions appear on leaves and fruit.",
      "symptoms": [
        "Small dark spots on leaves",
        "Spots may have yellow halo",
        "Leaf yellowing and drop",
        "Raised scabby spots on fruit"
      ],
      "causes": [
        "Bacterial infection spread by rain splash, overhead irrigation, and contaminated seeds."
      ],
      "treatment": [
        "Apply copper-based sprays",
        "Use copper + mancozeb combination",
        "Remove heavily infected plants",
        "Avoid working in wet fields"
      ],
      "prevention": [
        "Use disease-free seeds and transplants",
        "Avoid overhead watering",
        "Rotate crops for 2-3 years",
        "Remove crop debris after harvest"
      ]
    },
    "Tomato_Early_blight": {
      "disease": "Early Blight",
      "display_name": "Early Blight",
      "crop_name": "Tomato",
      "description": "Caused by Alternaria solani. Concentric dark rings (target spots) form on older leaves first.",
      "symptoms": [
        "Dark concentric ring spots on lower leaves",
        "Yellow area around spots",
        "Leaves wither and drop",
        "Stem lesions possible"
      ],
      "causes": [
        "Fungus Alternaria solani thriving in warm, humid conditions with heavy dew."
      ],
      "treatment": [
        "Apply chlorothalonil or mancozeb fungicides",
        "Spray copper-based fungicides",
        "Remove infected leaves promptly",
        "Apply fungicide every 7-10 days in wet weather"
      ],
      "prevention": [
        "Stake plants for air circulation",
        "Mulch around base",
        "Water at soil level",
        "Remove lower infected leaves"
      ]
    },
    "Tomato_Late_blight": {
      "disease": "Late Blight",
      "display_name": "Late Blight",
      "crop_name": "Tomato",
      "description": "Caused by Phytophthora infestans. Can devastate entire crops rapidly in cool, wet conditions.",
      "symptoms": [
        "Large, irregularly shaped, water-soaked lesions",
        "White fuzzy mold on leaf undersides",
        "Dark brown firm rot on fruit",
        "Rapid plant collapse"
      ],
      "causes": [
        "Oomycete Phytophthora infestans favored by cool (15-22°C), wet weather."
      ],
      "treatment": [
        "Apply systemic fungicides (Metalaxyl)",
        "Spray preventive copper fungicides",
        "Destroy infected plants immediately",
        "Harvest remaining fruit quickly"
      ],
      "prevention": [
        "Destroy volunteer plants",
        "Provide good air circulation",
        "Avoid overhead irrigation",
        "Use resistant varieties"
      ]
    },
    "Tomato_Leaf_Mold": {
      "disease": "Leaf Mold",
      "display_name": "Leaf Mold",
      "crop_name": "Tomato",
      "description": "Caused by Passalora fulva (Cladosporium fulvum). Mainly affects greenhouse tomatoes.",
      "symptoms": [
        "Pale green to yellow spots on upper leaf surface",
        "Olive-green to brown velvety mold on underside",
        "Leaves curl and wither",
        "Reduced fruit set"
      ],
      "causes": [
        "Fungus Passalora fulva thriving in high humidity (>85%) and moderate temperatures."
      ],
      "treatment": [
        "Improve air circulation immediately",
        "Apply fungicides (chlorothalonil)",
        "Remove severely affected leaves",
        "Reduce watering frequency"
      ],
      "prevention": [
        "Improve greenhouse ventilation",
        "Reduce humidity below 85%",
        "Space plants adequately",
        "Use resistant varieties"
      ]
    },
    "Tomato_Septoria_leaf_spot": {
      "disease": "Septoria Leaf Spot",
      "display_name": "Septoria Leaf Spot",
      "crop_name": "Tomato",
      "description": "Caused by Septoria lycopersici. Small circular spots with dark borders and gray centers.",
      "symptoms": [
        "Numerous small circular spots (1-3mm)",
        "Dark brown borders with gray/tan centers",
        "Tiny black dots (pycnidia) in spot centers",
        "Lower leaves affected first"
      ],
      "causes": [
        "Fungus Septoria lycopersici spread by rain splash and overhead irrigation."
      ],
      "treatment": [
        "Apply fungicides (chlorothalonil or copper)",
        "Remove lower infected leaves",
        "Spray at first sign of disease",
        "Continue treatment every 7-14 days"
      ],
      "prevention": [
        "Mulch around plants",
        "Avoid overhead watering",
        "Rotate crops for 3 years",
        "Remove infected plant debris"
      ]
    },
    "Tomato_Spider_mites_Two_spotted_spider_mite": {
      "disease": "Spider Mite Damage",
      "display_name": "Spider Mite Damage",
      "crop_name": "Tomato",
      "description": "Caused by Tetranychus urticae. Tiny mites feed on leaf cells causing stippling and webbing.",
      "symptoms": [
        "Fine stippling/speckling on leaves",
        "Yellowing and bronzing of leaves",
        "Fine webbing on undersides",
        "Leaf drop in severe cases"
      ],
      "causes": [
        "Infestation by two-spotted spider mites, favored by hot, dry conditions."
      ],
      "treatment": [
        "Spray with strong water jet to dislodge mites",
        "Apply insecticidal soap or neem oil",
        "Use miticides (abamectin)",
        "Release predatory mites (Phytoseiulus persimilis)"
      ],
      "prevention": [
        "Maintain adequate humidity",
        "Avoid dusty conditions",
        "Introduce predatory mites",
        "Keep plants well-watered"
      ]
    },
    "Tomato__Target_Spot": {
      "disease": "Target Spot",
      "display_name": "Target Spot",
      "crop_name": "Tomato",
      "description": "Caused by Corynespora cassiicola. Concentric ring patterns appear on leaves, stems, and fruit.",
      "symptoms": [
        "Small brown spots with concentric rings",
        "Spots enlarge up to 1cm",
        "Leaf yellowing around spots",
        "Fruit lesions with sunken centers"
      ],
      "causes": [
        "Fungus Corynespora cassiicola thriving in warm, humid environments."
      ],
      "treatment": [
        "Apply fungicides (azoxystrobin or chlorothalonil)",
        "Remove infected leaves",
        "Spray preventively in wet seasons",
        "Ensure good plant spacing"
      ],
      "prevention": [
        "Improve air circulation",
        "Avoid overhead irrigation",
        "Remove crop debris",
        "Practice crop rotation"
      ]
    },
    "Tomato__Tomato_YellowLeaf__Curl_Virus": {
      "disease": "Yellow Leaf Curl Virus (TYLCV)",
      "display_name": "Yellow Leaf Curl Virus (TYLCV)",
      "crop_name": "Tomato",
      "description": "A devastating viral disease transmitted by whiteflies (Bemisia tabaci).",
      "symptoms": [
        "Upward curling and cupping of leaves",
        "Yellowing of leaf margins",
        "Severe stunting of plant",
        "Flower drop and reduced fruit set"
      ],
      "causes": [
        "Tomato Yellow Leaf Curl Virus transmitted by silverleaf whitefly vectors."
      ],
      "treatment": [
        "No cure once infected — remove plants",
        "Control whitefly vectors with imidacloprid",
        "Use yellow sticky traps for monitoring",
        "Apply neem oil to reduce whitefly populations"
      ],
      "prevention": [
        "Use whitefly-resistant varieties",
        "Install insect-proof netting",
        "Control whitefly populations",
        "Remove infected plants immediately"
      ]
    },
    "Tomato__Tomato_mosaic_virus": {
      "disease": "Tomato Mosaic Virus (ToMV)",
      "display_name": "Tomato Mosaic Virus (ToMV)",
      "crop_name": "Tomato",
      "description": "A highly contagious virus that causes mottled patterns and distorted growth.",
      "symptoms": [
        "Light and dark green mosaic patterns on leaves",
        "Leaf curling and distortion",
        "Stunted plant growth",
        "Reduced and distorted fruit"
      ],
      "causes": [
        "Tomato Mosaic Virus spread mechanically through contaminated tools, hands, and seeds."
      ],
      "treatment": [
        "No chemical cure available",
        "Remove and destroy infected plants",
        "Disinfect all tools and stakes",
        "Do not smoke near plants (tobacco mosaic cross-infection)"
      ],
      "prevention": [
        "Use virus-free seeds",
        "Disinfect tools with 10% bleach solution",
        "Wash hands before handling plants",
        "Use resistant varieties"
      ]
    },
    "Tomato_healthy": {
      "disease": "Healthy",
      "display_name": "Healthy",
      "crop_name": "Tomato",
      "description": "The tomato plant appears healthy with no signs of disease or pest damage.",
      "symptoms": [
        "Vibrant green foliage",
        "No spots, lesions, or discoloration",
        "Normal fruit development"
      ],
      "causes": [
        "Optimal growing conditions and absence of pathogens."
      ],
      "treatment": [
        "No treatment needed",
        "Continue regular care",
        "Monitor weekly for changes",
        "Maintain consistent watering"
      ],
      "prevention": [
        "Continue good farming practices",
        "Rotate crops regularly",
        "Monitor for early signs of disease",
        "Maintain balanced nutrition"
      ]
    }
  },
  "hi": {
    "Alternaria_Leaf_Spot": {
      "disease": "अल्टरनेरिया पत्ती धब्बा",
      "display_name": "अल्टरनेरिया पत्ती धब्बा",
      "crop_name": "मूंगफली",
      "description": "अल्टरनेरिया अल्टरनाटा कवक के कारण होता है। पत्तियों पर समकेंद्रित वलयों वाले अनियमित भूरे घाव दिखाई देते हैं। यह फसल अवशेषों में जीवित रहता है।",
      "symptoms": [
        "अनियमित भूरे घाव",
        "पत्तियों पर समकेंद्रित वलय (लक्ष्य-पैटर्न)",
        "पत्तियों का सूखना और गिरना"
      ],
      "causes": [
        "गर्म, नम परिस्थितियों में अल्टरनेरिया अल्टरनाटा कवक के कारण।"
      ],
      "treatment": [
        "कॉपर-आधारित कवकनाशी (कॉपर ऑक्सीक्लोराइड 3 ग्राम/लीटर) लगाएं",
        "मैनकोज़ेब (2.5 ग्राम/लीटर) का उपयोग करें",
        "संक्रमित पौधों के हिस्से हटाकर जलाएं",
        "लक्षण दिखने के 48 घंटे के भीतर कवकनाशी लगाएं"
      ],
      "prevention": [
        "उचित अंतर (30 × 10 सेमी) बनाए रखें",
        "जलभराव से बचें",
        "रोग-मुक्त प्रमाणित बीज का उपयोग करें",
        "अनाज फसलों के साथ फसल चक्र अपनाएं"
      ]
    },
    "Healthy": {
      "disease": "स्वस्थ",
      "display_name": "स्वस्थ",
      "crop_name": "आलू",
      "description": "पौधा स्वस्थ दिखाई देता है, रोग का कोई लक्षण नहीं।",
      "symptoms": [
        "कोई नहीं",
        "जीवंत हरी पत्तियाँ",
        "सामान्य वृद्धि"
      ],
      "causes": [
        "अनुकूल बढ़ती परिस्थितियाँ और रोगजनकों की अनुपस्थिति।"
      ],
      "treatment": [
        "कोई उपचार आवश्यक नहीं",
        "नियमित सिंचाई जारी रखें",
        "साप्ताहिक पत्तियों की निगरानी करें",
        "मिट्टी का स्वास्थ्य बनाए रखें"
      ],
      "prevention": [
        "अच्छी खेती पद्धतियाँ जारी रखें",
        "प्रमाणित बीज का उपयोग करें",
        "खेत की स्वच्छता बनाए रखें",
        "फसल चक्र अपनाएं"
      ]
    },
    "Leaf_Spot_Early_and_Late": {
      "disease": "पत्ती धब्बा (प्रारंभिक और देर से)",
      "display_name": "पत्ती धब्बा (प्रारंभिक और देर से)",
      "crop_name": "मूंगफली",
      "description": "सर्कोस्पोरा एराकिडिकोला (प्रारंभिक) और सर्कोस्पोरिडियम पर्सोनेटम (देर से) के कारण। पत्तियों पर भूरे या काले धब्बे दिखाई देते हैं।",
      "symptoms": [
        "पत्ती की ऊपरी सतह पर भूरे या काले धब्बे",
        "धब्बों के चारों ओर पीला हाला",
        "समय से पहले पत्ती गिरना"
      ],
      "causes": [
        "गर्म, नम परिस्थितियों में पनपने वाला कवक संक्रमण।"
      ],
      "treatment": [
        "मैनकोज़ेब जैसे कवकनाशी लगाएं",
        "भारी संक्रमित पत्तियाँ हटाएं",
        "हर 10-14 दिन में कवकनाशी स्प्रे करें",
        "संपर्क और प्रणालीगत कवकनाशी का उपयोग करें"
      ],
      "prevention": [
        "गैर-मेज़बान फसलों के साथ फसल चक्र अपनाएं",
        "ऊपरी सिंचाई से बचें",
        "प्रतिरोधी किस्में लगाएं",
        "उचित पौधों का अंतर बनाए रखें"
      ]
    },
    "Rosette": {
      "disease": "रोज़ेट रोग",
      "display_name": "रोज़ेट रोग",
      "crop_name": "मूंगफली",
      "description": "एफिड्स द्वारा प्रसारित वायरल रोग। पौधों का गंभीर बौनापन और पत्तियों का पीलापन होता है।",
      "symptoms": [
        "गंभीर बौनापन",
        "पत्तियों का पीलापन",
        "मुड़ी या विकृत पत्तियाँ"
      ],
      "causes": [
        "मूंगफली एफिड द्वारा प्रसारित वायरल संक्रमण।"
      ],
      "treatment": [
        "कीटनाशकों से एफिड वाहकों को नियंत्रित करें",
        "संक्रमित पौधे हटाकर नष्ट करें",
        "एक बार संक्रमित होने पर कोई इलाज नहीं",
        "जल्दी प्रणालीगत कीटनाशक लगाएं"
      ],
      "prevention": [
        "मौसम में जल्दी बुआई करें",
        "उच्च पौधा घनत्व बनाए रखें",
        "स्वयंसेवी पौधे हटाएं",
        "प्रतिरोधी किस्मों का उपयोग करें"
      ]
    },
    "Rust": {
      "disease": "रतुआ रोग",
      "display_name": "रतुआ रोग",
      "crop_name": "मूंगफली",
      "description": "पुसीनिया एराकिडिस कवक के कारण। पत्तियों के निचले हिस्से पर नारंगी-भूरे रंग के दाने दिखाई देते हैं।",
      "symptoms": [
        "पत्ती के निचले हिस्से पर नारंगी-भूरे दाने",
        "पत्तियाँ भूरी होकर सूख जाती हैं",
        "दाने फटकर पाउडर जैसे बीजाणु छोड़ते हैं"
      ],
      "causes": [
        "हवा से फैलने वाले बीजाणुओं से पुसीनिया एराकिडिस कवक का प्रसार।"
      ],
      "treatment": [
        "प्रणालीगत कवकनाशी (ट्रायडिमेफॉन) लगाएं",
        "दानों के पहले लक्षण पर स्प्रे करें",
        "हर 10-15 दिन दोहराएं",
        "नीम तेल के साथ मिलाएं"
      ],
      "prevention": [
        "रतुआ प्रतिरोधी किस्में उगाएं",
        "जल्दी बुआई करें",
        "फसल अवशेष हटाएं",
        "अत्यधिक नाइट्रोजन से बचें"
      ]
    },
    "Bacteria": {
      "disease": "बैक्टीरियल विल्ट",
      "display_name": "बैक्टीरियल विल्ट",
      "crop_name": "आलू",
      "description": "राल्स्टोनिया सोलानेसीरम के कारण। पर्याप्त मिट्टी नमी होने पर भी पौधे तेजी से मुरझाते हैं।",
      "symptoms": [
        "पत्तियों और तनों का तेजी से मुरझाना",
        "तने के अंदर भूरा रंग दिखना",
        "कटे तने से सफेद बैक्टीरियल रिसाव"
      ],
      "causes": [
        "जड़ों या घायल पौधों के हिस्सों से बैक्टीरियल संक्रमण।"
      ],
      "treatment": [
        "संक्रमित पौधे हटाकर नष्ट करें",
        "कोई रासायनिक इलाज उपलब्ध नहीं",
        "भारी संक्रमित मिट्टी को सोलराइज़ करें",
        "जैव-नियंत्रण एजेंटों का निवारक उपयोग करें"
      ],
      "prevention": [
        "प्रमाणित रोग-मुक्त बीज कंदों का उपयोग करें",
        "3-5 साल का फसल चक्र अपनाएं",
        "मिट्टी की जल निकासी सुधारें",
        "खेती उपकरण साफ करें"
      ]
    },
    "Fungi": {
      "disease": "कवक ब्लाइट (अर्ली ब्लाइट)",
      "display_name": "कवक ब्लाइट (अर्ली ब्लाइट)",
      "crop_name": "आलू",
      "description": "अल्टरनेरिया सोलानी के कारण। पुरानी पत्तियों पर पहले गहरे, समकेंद्रित धब्बे दिखाई देते हैं।",
      "symptoms": [
        "समकेंद्रित वलयों वाले गहरे भूरे धब्बे",
        "धब्बों के चारों ओर पीलापन",
        "पत्तियाँ सूखना और मरना"
      ],
      "causes": [
        "गर्म, नम वातावरण में फैलने वाला कवक।"
      ],
      "treatment": [
        "सुरक्षात्मक कवकनाशी (क्लोरोथैलोनिल) लगाएं",
        "प्रणालीगत कवकनाशी लगाएं",
        "मौसम की शुरुआत में स्प्रे करें",
        "संक्रमित अवशेष हटाएं"
      ],
      "prevention": [
        "रोग-मुक्त बीज का उपयोग करें",
        "ऊपरी सिंचाई से बचें",
        "पर्याप्त उर्वरीकरण करें",
        "गैर-सोलानेसी पौधों के साथ फसल चक्र करें"
      ]
    },
    "Nematode": {
      "disease": "आलू सिस्ट नेमाटोड",
      "display_name": "आलू सिस्ट नेमाटोड",
      "crop_name": "आलू",
      "description": "सूक्ष्म कीड़े जो आलू की जड़ों पर खाते हैं, खराब वृद्धि और उपज हानि का कारण बनते हैं।",
      "symptoms": [
        "बौनी पौधा वृद्धि",
        "पत्तियों का पीलापन",
        "जड़ों पर छोटे सफेद/पीले सिस्ट"
      ],
      "causes": [
        "मिट्टी में ग्लोबोडेरा प्रजातियों का संक्रमण।"
      ],
      "treatment": [
        "बुआई से पहले नेमाटिसाइड लगाएं",
        "जाल फसलों का उपयोग करें",
        "मिट्टी को सोलराइज़ करें",
        "गंभीर मामलों में मिट्टी को धूमित करें"
      ],
      "prevention": [
        "सख्त संगरोध उपाय",
        "लंबा फसल चक्र (7 साल तक)",
        "प्रतिरोधी किस्में लगाएं",
        "मिट्टी फैलाव रोकने के लिए उपकरण साफ करें"
      ]
    },
    "Pest": {
      "disease": "कीट संक्रमण",
      "display_name": "कीट संक्रमण",
      "crop_name": "आलू",
      "description": "आलू की पत्तियों पर खाने वाले कीड़े, जो पौधे को पूरी तरह पत्तीहीन कर सकते हैं।",
      "symptoms": [
        "पत्तियों में छेद",
        "पत्तियों का कंकाल बनना",
        "लार्वा या वयस्क भृंगों की उपस्थिति"
      ],
      "causes": [
        "अनुकूल परिस्थितियों में तेजी से बढ़ने वाले कीट।"
      ],
      "treatment": [
        "भृंगों और लार्वा को हाथ से चुनें",
        "स्पिनोसैड या नीम तेल लगाएं",
        "विशिष्ट रासायनिक कीटनाशकों का उपयोग करें",
        "लार्वा के लिए बैसिलस थुरिंगिएंसिस (Bt) लगाएं"
      ],
      "prevention": [
        "पंक्ति कवर का उपयोग करें",
        "फसल चक्र अपनाएं",
        "प्राकृतिक शिकारियों को प्रोत्साहित करें",
        "चरम कीट आबादी से बचने के लिए जल्दी लगाएं"
      ]
    },
    "Phytopthora": {
      "disease": "लेट ब्लाइट (फाइटोफ्थोरा)",
      "display_name": "लेट ब्लाइट (फाइटोफ्थोरा)",
      "crop_name": "आलू",
      "description": "फाइटोफ्थोरा इंफेस्टांस के कारण विनाशकारी रोग। ठंडी, गीली परिस्थितियों में कुछ दिनों में फसल नष्ट कर सकता है।",
      "symptoms": [
        "पत्तियों पर पानी से भीगे, गहरे हरे धब्बे",
        "पत्ती के निचले हिस्से पर सफेद कवक वृद्धि",
        "कंदों पर भूरी सड़न"
      ],
      "causes": [
        "ठंडे, गीले मौसम में पनपने वाला ऊमाइसीट रोगजनक।"
      ],
      "treatment": [
        "निवारक संपर्क कवकनाशी लगाएं",
        "मेटालैक्सिल जैसे प्रणालीगत कवकनाशी लगाएं",
        "कटाई से पहले संक्रमित बेलें नष्ट करें",
        "सूखी परिस्थितियों में कटाई करें"
      ],
      "prevention": [
        "प्रतिरोधी किस्में लगाएं",
        "स्वयंसेवी आलू नष्ट करें",
        "अच्छी मिट्टी जल निकासी सुनिश्चित करें",
        "देर से कटाई से बचें"
      ]
    },
    "Virus": {
      "disease": "आलू वायरस (PVY/PLRV)",
      "display_name": "आलू वायरस (PVY/PLRV)",
      "crop_name": "आलू",
      "description": "एफिड्स द्वारा प्रसारित वायरल रोग, मोज़ेक पैटर्न या पत्ती मुड़ने का कारण बनता है।",
      "symptoms": [
        "पत्तियों पर मोज़ेक या धब्बेदार पैटर्न",
        "पत्तियों का ऊपर की ओर मुड़ना",
        "बौनी वृद्धि और कम उपज"
      ],
      "causes": [
        "एफिड वाहकों या संक्रमित बीज कंदों द्वारा प्रसारित वायरस।"
      ],
      "treatment": [
        "वायरस का कोई रासायनिक इलाज नहीं",
        "वाहकों को नियंत्रित करने के लिए कीटनाशक लगाएं",
        "संचरण कम करने के लिए खनिज तेल लगाएं",
        "भारी संक्रमित फसलों को नष्ट करें"
      ],
      "prevention": [
        "प्रमाणित वायरस-मुक्त बीज का उपयोग करें",
        "एफिड आबादी नियंत्रित करें",
        "संक्रमित पौधे जल्दी हटाएं",
        "संक्रमित खेतों के पास बुआई से बचें"
      ]
    },
    "Pepper__bell___Bacterial_spot": {
      "disease": "बैक्टीरियल स्पॉट",
      "display_name": "बैक्टीरियल स्पॉट",
      "crop_name": "मिर्च",
      "description": "ज़ैंथोमोनास कैम्पेस्ट्रिस के कारण। पत्तियों, तनों और फलों पर पानी से भीगे धब्बे दिखाई देते हैं।",
      "symptoms": [
        "पत्तियों पर छोटे, गहरे, पानी से भीगे धब्बे",
        "धब्बे बड़े होकर पीले हालो के साथ भूरे होते हैं",
        "गंभीर मामलों में पत्ती गिरना",
        "फलों पर उभरे पपड़ीदार धब्बे"
      ],
      "causes": [
        "बारिश की बूंदों और दूषित बीजों से फैलने वाला बैक्टीरियल संक्रमण।"
      ],
      "treatment": [
        "कॉपर-आधारित जीवाणुनाशक लगाएं",
        "अनुमति हो तो स्ट्रेप्टोमाइसिन स्प्रे करें",
        "भारी संक्रमित पौधे हटाएं",
        "पौधों के चारों ओर वायु संचार सुधारें"
      ],
      "prevention": [
        "प्रमाणित रोग-मुक्त बीज का उपयोग करें",
        "ऊपरी सिंचाई से बचें",
        "फसल चक्र (2-3 साल) अपनाएं",
        "संक्रमित पौधों के अवशेष हटाएं"
      ]
    },
    "Pepper__bell___healthy": {
      "disease": "स्वस्थ",
      "display_name": "स्वस्थ",
      "crop_name": "मिर्च",
      "description": "मिर्च का पौधा स्वस्थ दिखाई देता है, रोग का कोई लक्षण नहीं।",
      "symptoms": [
        "जीवंत हरी पत्तियाँ",
        "कोई धब्बे या घाव नहीं",
        "सामान्य वृद्धि और फल विकास"
      ],
      "causes": [
        "अनुकूल बढ़ती परिस्थितियाँ और रोगजनकों की अनुपस्थिति।"
      ],
      "treatment": [
        "कोई उपचार आवश्यक नहीं",
        "नियमित सिंचाई जारी रखें",
        "साप्ताहिक पत्तियों की निगरानी करें",
        "मिट्टी का स्वास्थ्य बनाए रखें"
      ],
      "prevention": [
        "अच्छी खेती पद्धतियाँ जारी रखें",
        "प्रमाणित बीज का उपयोग करें",
        "खेत की स्वच्छता बनाए रखें",
        "फसल चक्र अपनाएं"
      ]
    },
    "Tomato_Bacterial_spot": {
      "disease": "बैक्टीरियल स्पॉट",
      "display_name": "बैक्टीरियल स्पॉट",
      "crop_name": "टमाटर",
      "description": "ज़ैंथोमोनास प्रजातियों के कारण। पत्तियों और फलों पर छोटे, गहरे, पानी से भीगे घाव दिखाई देते हैं।",
      "symptoms": [
        "पत्तियों पर छोटे गहरे धब्बे",
        "धब्बों पर पीला हाला हो सकता है",
        "पत्ती पीली होकर गिरना",
        "फलों पर उभरे पपड़ीदार धब्बे"
      ],
      "causes": [
        "बारिश की बूंदों, ऊपरी सिंचाई और दूषित बीजों से फैलने वाला बैक्टीरियल संक्रमण।"
      ],
      "treatment": [
        "कॉपर-आधारित स्प्रे लगाएं",
        "कॉपर + मैनकोज़ेब मिश्रण का उपयोग करें",
        "भारी संक्रमित पौधे हटाएं",
        "गीले खेतों में काम करने से बचें"
      ],
      "prevention": [
        "रोग-मुक्त बीज और रोपाई का उपयोग करें",
        "ऊपरी सिंचाई से बचें",
        "2-3 साल फसल चक्र अपनाएं",
        "कटाई के बाद फसल अवशेष हटाएं"
      ]
    },
    "Tomato_Early_blight": {
      "disease": "अर्ली ब्लाइट",
      "display_name": "अर्ली ब्लाइट",
      "crop_name": "टमाटर",
      "description": "Alternaria solani कवक के कारण होता है। पुरानी पत्तियों पर पहले समकेंद्रित गहरे वलय (टारगेट स्पॉट्स) दिखाई देते हैं।",
      "symptoms": [
        "निचली पत्तियों पर गहरे समकेंद्रित वलय वाले धब्बे",
        "धब्बों के चारों ओर पीला क्षेत्र",
        "पत्तियाँ मुरझाकर गिरती हैं",
        "तने पर भी घाव संभव हैं"
      ],
      "causes": [
        "गर्म, नम परिस्थितियों और भारी ओस में Alternaria solani कवक का प्रकोप बढ़ता है।"
      ],
      "treatment": [
        "Chlorothalonil या Mancozeb कवकनाशी का छिड़काव करें",
        "कॉपर-आधारित कवकनाशी स्प्रे करें",
        "संक्रमित पत्तियां तुरंत हटाएं",
        "गीले मौसम में हर 7-10 दिन पर उपचार जारी रखें"
      ],
      "prevention": [
        "वायु संचार के लिए पौधों को सहारा दें",
        "आधार के चारों ओर मल्चिंग करें",
        "मिट्टी स्तर पर पानी दें (ऊपर से छिड़काव से बचें)",
        "निचली संक्रमित पत्तियां तुरंत हटाएं"
      ]
    },
    "Tomato_Late_blight": {
      "disease": "लेट ब्लाइट",
      "display_name": "लेट ब्लाइट",
      "crop_name": "टमाटर",
      "description": "फाइटोफ्थोरा इंफेस्टांस के कारण। ठंडी, गीली परिस्थितियों में पूरी फसल तेजी से नष्ट कर सकता है।",
      "symptoms": [
        "बड़े, अनियमित आकार के, पानी से भीगे घाव",
        "पत्ती के निचले हिस्से पर सफेद रोएंदार फफूंद",
        "फलों पर गहरी भूरी सख्त सड़न",
        "तेजी से पौधा गिरना"
      ],
      "causes": [
        "ठंडे (15-22°C), गीले मौसम में पनपने वाला ऊमाइसीट फाइटोफ्थोरा इंफेस्टांस।"
      ],
      "treatment": [
        "प्रणालीगत कवकनाशी (मेटालैक्सिल) लगाएं",
        "निवारक कॉपर कवकनाशी स्प्रे करें",
        "संक्रमित पौधे तुरंत नष्ट करें",
        "शेष फल जल्दी तोड़ लें"
      ],
      "prevention": [
        "स्वयंसेवी पौधे नष्ट करें",
        "अच्छा वायु संचार प्रदान करें",
        "ऊपरी सिंचाई से बचें",
        "प्रतिरोधी किस्मों का उपयोग करें"
      ]
    },
    "Tomato_Leaf_Mold": {
      "disease": "पत्ती फफूंद",
      "display_name": "पत्ती फफूंद",
      "crop_name": "टमाटर",
      "description": "पासालोरा फुल्वा (क्लैडोस्पोरियम फुल्वम) के कारण। मुख्य रूप से ग्रीनहाउस टमाटरों को प्रभावित करता है।",
      "symptoms": [
        "ऊपरी पत्ती की सतह पर हल्के हरे से पीले धब्बे",
        "निचले हिस्से पर जैतूनी-हरे से भूरे मखमली फफूंद",
        "पत्तियाँ मुड़कर मुरझाना",
        "फल लगने में कमी"
      ],
      "causes": [
        "उच्च आर्द्रता (>85%) और मध्यम तापमान में पनपने वाला पासालोरा फुल्वा कवक।"
      ],
      "treatment": [
        "तुरंत वायु संचार सुधारें",
        "कवकनाशी (क्लोरोथैलोनिल) लगाएं",
        "भारी प्रभावित पत्तियाँ हटाएं",
        "सिंचाई की आवृत्ति कम करें"
      ],
      "prevention": [
        "ग्रीनहाउस वेंटिलेशन सुधारें",
        "आर्द्रता 85% से नीचे रखें",
        "पौधों को पर्याप्त दूरी पर लगाएं",
        "प्रतिरोधी किस्मों का उपयोग करें"
      ]
    },
    "Tomato_Septoria_leaf_spot": {
      "disease": "सेप्टोरिया पत्ती धब्बा",
      "display_name": "सेप्टोरिया पत्ती धब्बा",
      "crop_name": "टमाटर",
      "description": "सेप्टोरिया लाइकोपर्सिसी के कारण। गहरे किनारों और भूरे केंद्रों वाले छोटे गोलाकार धब्बे।",
      "symptoms": [
        "कई छोटे गोलाकार धब्बे (1-3 मिमी)",
        "गहरे भूरे किनारे और भूरे/कत्थई केंद्र",
        "धब्बों के केंद्र में छोटे काले बिंदु (पिक्निडिया)",
        "निचली पत्तियाँ पहले प्रभावित"
      ],
      "causes": [
        "बारिश की बूंदों और ऊपरी सिंचाई से फैलने वाला सेप्टोरिया लाइकोपर्सिसी कवक।"
      ],
      "treatment": [
        "कवकनाशी (क्लोरोथैलोनिल या कॉपर) लगाएं",
        "निचली संक्रमित पत्तियाँ हटाएं",
        "रोग के पहले लक्षण पर स्प्रे करें",
        "हर 7-14 दिन उपचार जारी रखें"
      ],
      "prevention": [
        "पौधों के चारों ओर मल्चिंग करें",
        "ऊपरी सिंचाई से बचें",
        "3 साल फसल चक्र अपनाएं",
        "संक्रमित पौधों के अवशेष हटाएं"
      ]
    },
    "Tomato_Spider_mites_Two_spotted_spider_mite": {
      "disease": "मकड़ी माइट क्षति",
      "display_name": "मकड़ी माइट क्षति",
      "crop_name": "टमाटर",
      "description": "टेट्रानिकस उर्टिके के कारण। सूक्ष्म माइट पत्ती की कोशिकाओं पर खाते हैं जिससे धब्बे और जाले बनते हैं।",
      "symptoms": [
        "पत्तियों पर बारीक धब्बे/छिड़काव",
        "पत्तियों का पीला और कांस्य रंग होना",
        "निचले हिस्से पर बारीक जाले",
        "गंभीर मामलों में पत्ती गिरना"
      ],
      "causes": [
        "गर्म, शुष्क परिस्थितियों में दो-धब्बेदार मकड़ी माइट का संक्रमण।"
      ],
      "treatment": [
        "माइट हटाने के लिए तेज पानी की धार मारें",
        "कीटनाशक साबुन या नीम तेल लगाएं",
        "माइटिसाइड (एबामेक्टिन) का उपयोग करें",
        "शिकारी माइट (फाइटोसीलस पर्सिमिलिस) छोड़ें"
      ],
      "prevention": [
        "पर्याप्त आर्द्रता बनाए रखें",
        "धूलभरी परिस्थितियों से बचें",
        "शिकारी माइट पेश करें",
        "पौधों को अच्छी तरह सींचें"
      ]
    },
    "Tomato__Target_Spot": {
      "disease": "लक्ष्य धब्बा",
      "display_name": "लक्ष्य धब्बा",
      "crop_name": "टमाटर",
      "description": "कोरिनेस्पोरा कैसीकोला के कारण। पत्तियों, तनों और फलों पर समकेंद्रित वलय पैटर्न दिखाई देते हैं।",
      "symptoms": [
        "समकेंद्रित वलयों वाले छोटे भूरे धब्बे",
        "धब्बे 1 सेमी तक बड़े होते हैं",
        "धब्बों के चारों ओर पत्ती पीली होना",
        "धंसे केंद्रों वाले फल घाव"
      ],
      "causes": [
        "गर्म, नम वातावरण में पनपने वाला कोरिनेस्पोरा कैसीकोला कवक।"
      ],
      "treatment": [
        "कवकनाशी (एज़ोक्सिस्ट्रोबिन या क्लोरोथैलोनिल) लगाएं",
        "संक्रमित पत्तियाँ हटाएं",
        "गीले मौसम में निवारक स्प्रे करें",
        "अच्छा पौधा अंतर सुनिश्चित करें"
      ],
      "prevention": [
        "वायु संचार सुधारें",
        "ऊपरी सिंचाई से बचें",
        "फसल अवशेष हटाएं",
        "फसल चक्र अपनाएं"
      ]
    },
    "Tomato__Tomato_YellowLeaf__Curl_Virus": {
      "disease": "पीली पत्ती मोड़ वायरस (TYLCV)",
      "display_name": "पीली पत्ती मोड़ वायरस (TYLCV)",
      "crop_name": "टमाटर",
      "description": "सफेद मक्खी (बेमिसिया टाबैसी) द्वारा प्रसारित विनाशकारी वायरल रोग।",
      "symptoms": [
        "पत्तियों का ऊपर की ओर मुड़ना और कप बनना",
        "पत्ती के किनारों का पीलापन",
        "पौधे का गंभीर बौनापन",
        "फूल गिरना और फल कम लगना"
      ],
      "causes": [
        "सिल्वरलीफ सफेद मक्खी वाहकों द्वारा प्रसारित टमाटर पीली पत्ती मोड़ वायरस।"
      ],
      "treatment": [
        "एक बार संक्रमित होने पर कोई इलाज नहीं — पौधे हटाएं",
        "इमिडाक्लोप्रिड से सफेद मक्खी वाहक नियंत्रित करें",
        "निगरानी के लिए पीली चिपकने वाली जालें लगाएं",
        "सफेद मक्खी कम करने के लिए नीम तेल लगाएं"
      ],
      "prevention": [
        "सफेद मक्खी प्रतिरोधी किस्मों का उपयोग करें",
        "कीट-रोधी जाली लगाएं",
        "सफेद मक्खी आबादी नियंत्रित करें",
        "संक्रमित पौधे तुरंत हटाएं"
      ]
    },
    "Tomato__Tomato_mosaic_virus": {
      "disease": "टमाटर मोज़ेक वायरस (ToMV)",
      "display_name": "टमाटर मोज़ेक वायरस (ToMV)",
      "crop_name": "टमाटर",
      "description": "अत्यधिक संक्रामक वायरस जो धब्बेदार पैटर्न और विकृत वृद्धि का कारण बनता है।",
      "symptoms": [
        "पत्तियों पर हल्के और गहरे हरे मोज़ेक पैटर्न",
        "पत्ती का मुड़ना और विकृति",
        "बौनी पौधा वृद्धि",
        "कम और विकृत फल"
      ],
      "causes": [
        "दूषित उपकरणों, हाथों और बीजों से यांत्रिक रूप से फैलने वाला टमाटर मोज़ेक वायरस।"
      ],
      "treatment": [
        "कोई रासायनिक इलाज उपलब्ध नहीं",
        "संक्रमित पौधे हटाकर नष्ट करें",
        "सभी उपकरण और डंडे कीटाणुरहित करें",
        "पौधों के पास धूम्रपान न करें (तंबाकू मोज़ेक क्रॉस-संक्रमण)"
      ],
      "prevention": [
        "वायरस-मुक्त बीज का उपयोग करें",
        "10% ब्लीच घोल से उपकरण कीटाणुरहित करें",
        "पौधे छूने से पहले हाथ धोएं",
        "प्रतिरोधी किस्मों का उपयोग करें"
      ]
    },
    "Tomato_healthy": {
      "disease": "स्वस्थ",
      "display_name": "स्वस्थ",
      "crop_name": "टमाटर",
      "description": "टमाटर का पौधा स्वस्थ दिखाई देता है, रोग या कीट क्षति का कोई लक्षण नहीं।",
      "symptoms": [
        "जीवंत हरी पत्तियाँ",
        "कोई धब्बे, घाव या रंग बदलना नहीं",
        "सामान्य फल विकास"
      ],
      "causes": [
        "अनुकूल बढ़ती परिस्थितियाँ और रोगजनकों की अनुपस्थिति।"
      ],
      "treatment": [
        "कोई उपचार आवश्यक नहीं",
        "नियमित देखभाल जारी रखें",
        "परिवर्तनों के लिए साप्ताहिक निगरानी करें",
        "लगातार सिंचाई बनाए रखें"
      ],
      "prevention": [
        "अच्छी खेती पद्धतियाँ जारी रखें",
        "नियमित फसल चक्र करें",
        "रोग के शुरुआती लक्षणों की निगरानी करें",
        "संतुलित पोषण बनाए रखें"
      ]
    }
  },
  "gu": {
    "Alternaria_Leaf_Spot": {
      "disease": "અલ્ટરનેરિયા પાન ડાઘ",
      "display_name": "અલ્ટરનેરિયા પાન ડાઘ",
      "crop_name": "મગફળી",
      "description": "અલ્ટરનેરિયા અલ્ટરનાટા ફૂગને કારણે થાય છે. પાન પર સમકેન્દ્રિત વલયો સાથે અનિયમિત ભૂરા ઘા દેખાય છે. તે પાક અવશેષોમાં ટકી રહે છે.",
      "symptoms": [
        "અનિયમિત ભૂરા ઘા",
        "પાન પર સમકેન્દ્રિત વલયો (ટાર્ગેટ-પેટર્ન)",
        "પાન સૂકાઈને ખરી પડવા"
      ],
      "causes": [
        "ગરમ, ભેજવાળી પરિસ્થિતિમાં અલ્ટરનેરિયા અલ્ટરનાટા ફૂગને કારણે."
      ],
      "treatment": [
        "કોપર-આધારિત ફૂગનાશક (કોપર ઓક્સિક્લોરાઈડ 3 ગ્રામ/લીટર) લગાવો",
        "મેન્કોઝેબ (2.5 ગ્રામ/લીટર) વાપરો",
        "ચેપગ્રસ્ત ભાગ દૂર કરીને બાળો",
        "લક્ષણ દેખાયાના 48 કલાકમાં ફૂગનાશક લગાવો"
      ],
      "prevention": [
        "યોગ્ય અંતર (30 × 10 સેમી) જાળવો",
        "જળભરાવ ટાળો",
        "રોગ-મુક્ત પ્રમાણિત બીજ વાપરો",
        "અનાજ પાકો સાથે પાક ફેરબદલી કરો"
      ]
    },
    "Healthy": {
      "disease": "સ્વસ્થ",
      "display_name": "સ્વસ્થ",
      "crop_name": "બટાટા",
      "description": "છોડ સ્વસ્થ દેખાય છે, રોગના કોઈ ચિહ્નો નથી.",
      "symptoms": [
        "કોઈ નહીં",
        "જીવંત લીલા પાન",
        "સામાન્ય વૃદ્ધિ"
      ],
      "causes": [
        "શ્રેષ્ઠ ઉગાડવાની પરિસ્થિતિઓ અને રોગકારકોની ગેરહાજરી."
      ],
      "treatment": [
        "કોઈ ઉપચારની જરૂર નથી",
        "નિયમિત સિંચાઈ ચાલુ રાખો",
        "સાપ્તાહિક પાનનું નિરીક્ષણ કરો",
        "જમીનનું સ્વાસ્થ્ય જાળવો"
      ],
      "prevention": [
        "સારી ખેતી પદ્ધતિઓ ચાલુ રાખો",
        "પ્રમાણિત બીજ વાપરો",
        "ખેતરની સ્વચ્છતા જાળવો",
        "પાક ફેરબદલી કરો"
      ]
    },
    "Leaf_Spot_Early_and_Late": {
      "disease": "પાન ડાઘ (વહેલો અને મોડો)",
      "display_name": "પાન ડાઘ (વહેલો અને મોડો)",
      "crop_name": "મગફળી",
      "description": "સર્કોસ્પોરા એરાકિડિકોલા (વહેલો) અને સર્કોસ્પોરિડિયમ પર્સોનેટમ (મોડો) ને કારણે. પાન પર ભૂરા અથવા કાળા ડાઘ દેખાય છે.",
      "symptoms": [
        "પાનની ઉપરની સપાટી પર ભૂરા અથવા કાળા ડાઘ",
        "ડાઘની આસપાસ પીળો હાલો",
        "સમય પહેલાં પાન ખરવું"
      ],
      "causes": [
        "ગરમ, ભેજવાળી પરિસ્થિતિમાં ખીલતો ફૂગ ચેપ."
      ],
      "treatment": [
        "મેન્કોઝેબ જેવા ફૂગનાશક લગાવો",
        "ભારે ચેપગ્રસ્ત પાન દૂર કરો",
        "દર 10-14 દિવસે ફૂગનાશક છંટકાવ કરો",
        "સંપર્ક અને પ્રણાલીગત ફૂગનાશક વાપરો"
      ],
      "prevention": [
        "બિન-યજમાન પાકો સાથે પાક ફેરબદલી કરો",
        "ઉપરથી સિંચાઈ ટાળો",
        "પ્રતિરોધક જાતો વાવો",
        "યોગ્ય છોડ અંતર જાળવો"
      ]
    },
    "Rosette": {
      "disease": "રોઝેટ રોગ",
      "display_name": "રોઝેટ રોગ",
      "crop_name": "મગફળી",
      "description": "મોલો દ્વારા ફેલાતો વાયરલ રોગ. છોડની ગંભીર વામનતા અને પાનની પીળાશ થાય છે.",
      "symptoms": [
        "ગંભીર વામનતા",
        "પાનની પીળાશ",
        "વળેલા અથવા વિકૃત પાન"
      ],
      "causes": [
        "મગફળીના મોલો દ્વારા ફેલાતો વાયરલ ચેપ."
      ],
      "treatment": [
        "જંતુનાશકથી મોલો વાહકોને નિયંત્રિત કરો",
        "ચેપગ્રસ્ત છોડ દૂર કરીને નાશ કરો",
        "એકવાર ચેપ લાગે પછી કોઈ ઈલાજ નથી",
        "વહેલા પ્રણાલીગત જંતુનાશક લગાવો"
      ],
      "prevention": [
        "મોસમમાં વહેલા વાવો",
        "ઊંચી છોડ ઘનતા જાળવો",
        "સ્વયંસેવી છોડ દૂર કરો",
        "પ્રતિરોધક જાતો વાપરો"
      ]
    },
    "Rust": {
      "disease": "રસ્ટ રોગ",
      "display_name": "રસ્ટ રોગ",
      "crop_name": "મગફળી",
      "description": "પુસીનિયા એરાકિડિસ ફૂગને કારણે. પાનની નીચેની બાજુએ નારંગી-ભૂરા દાણા દેખાય છે.",
      "symptoms": [
        "પાનની નીચે નારંગી-ભૂરા દાણા",
        "પાન ભૂરા થઈને સૂકાય છે",
        "દાણા ફાટીને પાવડર જેવા બીજાણુ છોડે છે"
      ],
      "causes": [
        "હવાથી ફેલાતા બીજાણુઓ દ્વારા પુસીનિયા એરાકિડિસ ફૂગનો ફેલાવો."
      ],
      "treatment": [
        "પ્રણાલીગત ફૂગનાશક (ટ્રાયડીમેફોન) લગાવો",
        "દાણાના પ્રથમ ચિહ્ને છંટકાવ કરો",
        "દર 10-15 દિવસે પુનરાવર્તન કરો",
        "લીમડાના તેલ સાથે ભેળવો"
      ],
      "prevention": [
        "રસ્ટ પ્રતિરોધક જાતો ઉગાડો",
        "વહેલા વાવો",
        "પાક અવશેષો દૂર કરો",
        "વધુ પડતા નાઈટ્રોજનથી બચો"
      ]
    },
    "Bacteria": {
      "disease": "બેક્ટેરિયલ વિલ્ટ",
      "display_name": "બેક્ટેરિયલ વિલ્ટ",
      "crop_name": "બટાટા",
      "description": "રાલ્સ્ટોનિયા સોલાનેસીરમને કારણે. પૂરતી જમીન ભેજ હોવા છતાં છોડ ઝડપથી સુકાય છે.",
      "symptoms": [
        "પાન અને દાંડીનું ઝડપી સુકાવું",
        "દાંડીની અંદર ભૂરો રંગ",
        "કાપેલી દાંડીમાંથી સફેદ બેક્ટેરિયલ ઝરણ"
      ],
      "causes": [
        "મૂળ અથવા ઘાયલ છોડના ભાગોથી બેક્ટેરિયલ ચેપ."
      ],
      "treatment": [
        "ચેપગ્રસ્ત છોડ દૂર કરીને નાશ કરો",
        "કોઈ રાસાયણિક ઈલાજ ઉપલબ્ધ નથી",
        "ભારે ચેપગ્રસ્ત જમીન સોલરાઈઝ કરો",
        "જૈવ-નિયંત્રણ એજન્ટો નિવારક રીતે વાપરો"
      ],
      "prevention": [
        "પ્રમાણિત રોગ-મુક્ત બીજ કંદ વાપરો",
        "3-5 વર્ષની પાક ફેરબદલી કરો",
        "જમીનની જળ નિકાલ સુધારો",
        "ખેતી સાધનો સાફ કરો"
      ]
    },
    "Fungi": {
      "disease": "ફૂગ બ્લાઈટ (અર્લી બ્લાઈટ)",
      "display_name": "ફૂગ બ્લાઈટ (અર્લી બ્લાઈટ)",
      "crop_name": "બટાટા",
      "description": "અલ્ટરનેરિયા સોલાનીને કારણે. જૂના પાન પર પહેલાં ઘેરા, સમકેન્દ્રિત ડાઘ દેખાય છે.",
      "symptoms": [
        "સમકેન્દ્રિત વલયો સાથે ઘેરા ભૂરા ડાઘ",
        "ડાઘની આસપાસ પીળાશ",
        "પાન સૂકાવું અને મરવું"
      ],
      "causes": [
        "ગરમ, ભેજવાળા વાતાવરણમાં ફેલાતી ફૂગ."
      ],
      "treatment": [
        "રક્ષણાત્મક ફૂગનાશક (ક્લોરોથેલોનિલ) લગાવો",
        "પ્રણાલીગત ફૂગનાશક લગાવો",
        "મોસમની શરૂઆતમાં છંટકાવ કરો",
        "ચેપગ્રસ્ત અવશેષો દૂર કરો"
      ],
      "prevention": [
        "રોગ-મુક્ત બીજ વાપરો",
        "ઉપરથી સિંચાઈ ટાળો",
        "પૂરતું ખાતર આપો",
        "બિન-સોલાનેસી છોડ સાથે પાક ફેરબદલી કરો"
      ]
    },
    "Nematode": {
      "disease": "બટાટા સિસ્ટ નેમેટોડ",
      "display_name": "બટાટા સિસ્ટ નેમેટોડ",
      "crop_name": "બટાટા",
      "description": "બટાટાના મૂળ પર ખાનારા સૂક્ષ્મ કીડા, ખરાબ વૃદ્ધિ અને ઉપજ ઘટાડાનું કારણ.",
      "symptoms": [
        "વામન છોડ વૃદ્ધિ",
        "પાનની પીળાશ",
        "મૂળ પર નાના સફેદ/પીળા સિસ્ટ"
      ],
      "causes": [
        "જમીનમાં ગ્લોબોડેરા પ્રજાતિઓનો ચેપ."
      ],
      "treatment": [
        "વાવણી પહેલાં નેમેટિસાઈડ લગાવો",
        "જાળ પાકો વાપરો",
        "જમીન સોલરાઈઝ કરો",
        "ગંભીર કિસ્સામાં જમીન ધૂમિત કરો"
      ],
      "prevention": [
        "કડક ક્વોરન્ટાઈન પગલાં",
        "લાંબી પાક ફેરબદલી (7 વર્ષ સુધી)",
        "પ્રતિરોધક જાતો વાવો",
        "જમીન ફેલાવ રોકવા સાધનો સાફ કરો"
      ]
    },
    "Pest": {
      "disease": "જીવાત ઉપદ્રવ",
      "display_name": "જીવાત ઉપદ્રવ",
      "crop_name": "બટાટા",
      "description": "બટાટાના પાન ખાનારા જીવાત, જે છોડને સંપૂર્ણ પાનવિહીન કરી શકે છે.",
      "symptoms": [
        "પાનમાં છિદ્રો",
        "પાનનું હાડપિંજર બનવું",
        "લાર્વા અથવા પુખ્ત ભૃંગની હાજરી"
      ],
      "causes": [
        "અનુકૂળ પરિસ્થિતિમાં ઝડપથી વધતા કીટ જીવાત."
      ],
      "treatment": [
        "ભૃંગો અને લાર્વા હાથથી ચૂંટો",
        "સ્પિનોસેડ અથવા લીમડાનું તેલ લગાવો",
        "ચોક્કસ રાસાયણિક જંતુનાશક વાપરો",
        "લાર્વા માટે બેસિલસ થુરિંગિએન્સિસ (Bt) લગાવો"
      ],
      "prevention": [
        "હરોળ આવરણ વાપરો",
        "પાક ફેરબદલી કરો",
        "કુદરતી શિકારીઓને પ્રોત્સાહિત કરો",
        "ટોચની જીવાત વસ્તી ટાળવા વહેલા વાવો"
      ]
    },
    "Phytopthora": {
      "disease": "લેટ બ્લાઈટ (ફાઈટોફ્થોરા)",
      "display_name": "લેટ બ્લાઈટ (ફાઈટોફ્થોરા)",
      "crop_name": "બટાટા",
      "description": "ફાઈટોફ્થોરા ઈન્ફેસ્ટન્સને કારણે વિનાશકારી રોગ. ઠંડી, ભીની પરિસ્થિતિમાં થોડા દિવસોમાં પાક નાશ કરી શકે છે.",
      "symptoms": [
        "પાન પર પાણીથી ભીંજાયેલા, ઘેરા લીલા ડાઘ",
        "પાનની નીચે સફેદ ફૂગ વૃદ્ધિ",
        "કંદ પર ભૂરી સડો"
      ],
      "causes": [
        "ઠંડા, ભીના હવામાનમાં ખીલતો ઊમાઈસીટ રોગકારક."
      ],
      "treatment": [
        "નિવારક સંપર્ક ફૂગનાશક લગાવો",
        "મેટાલેક્સિલ જેવા પ્રણાલીગત ફૂગનાશક વાપરો",
        "લણણી પહેલાં ચેપગ્રસ્ત વેલા નાશ કરો",
        "સૂકી પરિસ્થિતિમાં લણણી કરો"
      ],
      "prevention": [
        "પ્રતિરોધક જાતો વાવો",
        "સ્વયંસેવી બટાટા નાશ કરો",
        "સારી જમીન જળ નિકાલ સુનિશ્ચિત કરો",
        "મોડી લણણી ટાળો"
      ]
    },
    "Virus": {
      "disease": "બટાટા વાયરસ (PVY/PLRV)",
      "display_name": "બટાટા વાયરસ (PVY/PLRV)",
      "crop_name": "બટાટા",
      "description": "મોલો દ્વારા ફેલાતા વાયરલ રોગો, મોઝેક પેટર્ન અથવા પાન વળાંકનું કારણ.",
      "symptoms": [
        "પાન પર મોઝેક અથવા ડાઘવાળી પેટર્ન",
        "પાનનું ઉપર તરફ વળવું",
        "વામન વૃદ્ધિ અને ઓછી ઉપજ"
      ],
      "causes": [
        "મોલો વાહકો અથવા ચેપગ્રસ્ત બીજ કંદ દ્વારા ફેલાતા વાયરસ."
      ],
      "treatment": [
        "વાયરસ માટે કોઈ રાસાયણિક ઈલાજ નથી",
        "વાહકો નિયંત્રિત કરવા જંતુનાશક વાપરો",
        "ફેલાવ ઘટાડવા ખનિજ તેલ લગાવો",
        "ભારે ચેપગ્રસ્ત પાક નાશ કરો"
      ],
      "prevention": [
        "પ્રમાણિત વાયરસ-મુક્ત બીજ વાપરો",
        "મોલો વસ્તી નિયંત્રિત કરો",
        "ચેપગ્રસ્ત છોડ વહેલા દૂર કરો",
        "ચેપગ્રસ્ત ખેતર પાસે વાવણી ટાળો"
      ]
    },
    "Pepper__bell___Bacterial_spot": {
      "disease": "બેક્ટેરિયલ સ્પોટ",
      "display_name": "બેક્ટેરિયલ સ્પોટ",
      "crop_name": "મરચાં",
      "description": "ઝેન્થોમોનાસ કેમ્પેસ્ટ્રિસને કારણે. પાન, દાંડી અને ફળ પર પાણીથી ભીંજાયેલા ડાઘ દેખાય છે.",
      "symptoms": [
        "પાન પર નાના, ઘેરા, પાણીથી ભીંજાયેલા ડાઘ",
        "ડાઘ મોટા થઈને પીળા હાલો સાથે ભૂરા થાય છે",
        "ગંભીર કિસ્સામાં પાન ખરવું",
        "ફળ પર ઊભરેલા ખરબચડા ડાઘ"
      ],
      "causes": [
        "વરસાદના છાંટા અને દૂષિત બીજથી ફેલાતો બેક્ટેરિયલ ચેપ."
      ],
      "treatment": [
        "કોપર-આધારિત બેક્ટેરિસાઈડ લગાવો",
        "પરવાનગી હોય તો સ્ટ્રેપ્ટોમાઈસિન છંટકાવ કરો",
        "ભારે ચેપગ્રસ્ત છોડ દૂર કરો",
        "છોડની આસપાસ હવા પરિભ્રમણ સુધારો"
      ],
      "prevention": [
        "પ્રમાણિત રોગ-મુક્ત બીજ વાપરો",
        "ઉપરથી સિંચાઈ ટાળો",
        "પાક ફેરબદલી (2-3 વર્ષ) કરો",
        "ચેપગ્રસ્ત છોડના અવશેષો દૂર કરો"
      ]
    },
    "Pepper__bell___healthy": {
      "disease": "સ્વસ્થ",
      "display_name": "સ્વસ્થ",
      "crop_name": "મરચાં",
      "description": "મરચાંનો છોડ સ્વસ્થ દેખાય છે, રોગના કોઈ ચિહ્નો નથી.",
      "symptoms": [
        "જીવંત લીલા પાન",
        "કોઈ ડાઘ અથવા ઘા નથી",
        "સામાન્ય વૃદ્ધિ અને ફળ વિકાસ"
      ],
      "causes": [
        "શ્રેષ્ઠ ઉગાડવાની પરિસ્થિતિઓ અને રોગકારકોની ગેરહાજરી."
      ],
      "treatment": [
        "કોઈ ઉપચારની જરૂર નથી",
        "નિયમિત સિંચાઈ ચાલુ રાખો",
        "સાપ્તાહિક પાનનું નિરીક્ષણ કરો",
        "જમીનનું સ્વાસ્થ્ય જાળવો"
      ],
      "prevention": [
        "સારી ખેતી પદ્ધતિઓ ચાલુ રાખો",
        "પ્રમાણિત બીજ વાપરો",
        "ખેતરની સ્વચ્છતા જાળવો",
        "પાક ફેરબદલી કરો"
      ]
    },
    "Tomato_Bacterial_spot": {
      "disease": "બેક્ટેરિયલ સ્પોટ",
      "display_name": "બેક્ટેરિયલ સ્પોટ",
      "crop_name": "ટમેટા",
      "description": "ઝેન્થોમોનાસ પ્રજાતિઓને કારણે. પાન અને ફળ પર નાના, ઘેરા, પાણીથી ભીંજાયેલા ઘા.",
      "symptoms": [
        "પાન પર નાના ઘેરા ડાઘ",
        "ડાઘ પર પીળો હાલો હોઈ શકે",
        "પાન પીળું થઈને ખરવું",
        "ફળ પર ઊભરેલા ખરબચડા ડાઘ"
      ],
      "causes": [
        "વરસાદના છાંટા, ઉપરથી સિંચાઈ અને દૂષિત બીજથી ફેલાતો બેક્ટેરિયલ ચેપ."
      ],
      "treatment": [
        "કોપર-આધારિત છંટકાવ લગાવો",
        "કોપર + મેન્કોઝેબ મિશ્રણ વાપરો",
        "ભારે ચેપગ્રસ્ત છોડ દૂર કરો",
        "ભીના ખેતરમાં કામ કરવાથી બચો"
      ],
      "prevention": [
        "રોગ-મુક્ત બીજ અને રોપા વાપરો",
        "ઉપરથી સિંચાઈ ટાળો",
        "2-3 વર્ષ પાક ફેરબદલી કરો",
        "લણણી પછી પાક અવશેષો દૂર કરો"
      ]
    },
    "Tomato_Early_blight": {
      "disease": "અર્લી બ્લાઈટ",
      "display_name": "અર્લી બ્લાઈટ",
      "crop_name": "ટમેટા",
      "description": "Alternaria solani નામની ફૂગને કારણે થાય છે. જૂના પાંદડાઓ પર શરૂઆતમાં ગોળાકાર ઘેરા રિંગ જેવા ડાઘ (ટાર્ગેટ સ્પોટ્સ) જોવા મળે છે.",
      "symptoms": [
        "નીચલા પાંદડાઓ પર ઘેરા સમકેન્દ્રિત રિંગ જેવા ડાઘ",
        "ડાઘની આસપાસ પીળો વિસ્તાર",
        "પાંદડા કરમાઈ જાય છે અને ખરી પડે છે",
        "કાંડ પર પણ ડાઘ શક્ય છે"
      ],
      "causes": [
        "ગરમ, ભેજવાળી પરિસ્થિતિઓ અને ભારે ઝાકળમાં Alternaria solani ફૂગનો ઉપદ્રવ વધે છે."
      ],
      "treatment": [
        "Chlorothalonil અથવા Mancozeb ફૂગનાશકનો છંટકાવ કરો",
        "કોપર-આધારિત ફૂગનાશકનો છંટકાવ કરો",
        "ચેપગ્રસ્ત પાંદડા તાત્કાલિક દૂર કરો",
        "ભીના હવામાનમાં દર 7-10 દિવસે ફૂગનાશકનો છંટકાવ ચાલુ રાખો"
      ],
      "prevention": [
        "હવાના સારા પરિભ્રમણ માટે છોડને ટેકો આપો",
        "છોડના થડ આસપાસ મલ્ચિંગ કરો",
        "જમીન સ્તરે પાણી આપો (ઉપરથી છંટકાવ ટાળો)",
        "નીચલા ચેપગ્રસ્ત પાંદડા તાત્કાલિક દૂર કરો"
      ]
    },
    "Tomato_Late_blight": {
      "disease": "લેટ બ્લાઈટ",
      "display_name": "લેટ બ્લાઈટ",
      "crop_name": "ટમેટા",
      "description": "ફાઈટોફ્થોરા ઈન્ફેસ્ટન્સને કારણે. ઠંડી, ભીની પરિસ્થિતિમાં આખા પાકને ઝડપથી નાશ કરી શકે છે.",
      "symptoms": [
        "મોટા, અનિયમિત આકારના, પાણીથી ભીંજાયેલા ઘા",
        "પાનની નીચે સફેદ રૂંવાટીદાર ફૂગ",
        "ફળ પર ઘેરી ભૂરી સખત સડો",
        "છોડનું ઝડપી પતન"
      ],
      "causes": [
        "ઠંડા (15-22°C), ભીના હવામાનમાં ખીલતો ઊમાઈસીટ ફાઈટોફ્થોરા ઈન્ફેસ્ટન્સ."
      ],
      "treatment": [
        "પ્રણાલીગત ફૂગનાશક (મેટાલેક્સિલ) લગાવો",
        "નિવારક કોપર ફૂગનાશક છંટકાવ કરો",
        "ચેપગ્રસ્ત છોડ તરત નાશ કરો",
        "બાકીના ફળ ઝડપથી લણો"
      ],
      "prevention": [
        "સ્વયંસેવી છોડ નાશ કરો",
        "સારું હવા પરિભ્રમણ આપો",
        "ઉપરથી સિંચાઈ ટાળો",
        "પ્રતિરોધક જાતો વાપરો"
      ]
    },
    "Tomato_Leaf_Mold": {
      "disease": "પાન ફૂગ",
      "display_name": "પાન ફૂગ",
      "crop_name": "ટમેટા",
      "description": "પાસાલોરા ફુલ્વા (ક્લેડોસ્પોરિયમ ફુલ્વમ) ને કારણે. મુખ્યત્વે ગ્રીનહાઉસ ટમેટાને અસર કરે છે.",
      "symptoms": [
        "ઉપરના પાનની સપાટી પર આછા લીલાથી પીળા ડાઘ",
        "નીચેની બાજુએ ઓલિવ-લીલાથી ભૂરી મખમલી ફૂગ",
        "પાન વળીને સુકાય છે",
        "ફળ લાગવામાં ઘટાડો"
      ],
      "causes": [
        "ઊંચી ભેજ (>85%) અને મધ્યમ તાપમાનમાં ખીલતી પાસાલોરા ફુલ્વા ફૂગ."
      ],
      "treatment": [
        "તરત હવા પરિભ્રમણ સુધારો",
        "ફૂગનાશક (ક્લોરોથેલોનિલ) લગાવો",
        "ભારે અસરગ્રસ્ત પાન દૂર કરો",
        "સિંચાઈની આવર્તન ઘટાડો"
      ],
      "prevention": [
        "ગ્રીનહાઉસ વેન્ટિલેશન સુધારો",
        "ભેજ 85% થી નીચે રાખો",
        "છોડને પૂરતા અંતરે વાવો",
        "પ્રતિરોધક જાતો વાપરો"
      ]
    },
    "Tomato_Septoria_leaf_spot": {
      "disease": "સેપ્ટોરિયા પાન ડાઘ",
      "display_name": "સેપ્ટોરિયા પાન ડાઘ",
      "crop_name": "ટમેટા",
      "description": "સેપ્ટોરિયા લાઈકોપર્સિસીને કારણે. ઘેરા કિનારા અને ભૂખરા કેન્દ્રો સાથે નાના ગોળ ડાઘ.",
      "symptoms": [
        "અસંખ્ય નાના ગોળ ડાઘ (1-3 મિમી)",
        "ઘેરા ભૂરા કિનારા અને ભૂખરા/કથ્થાઈ કેન્દ્રો",
        "ડાઘના કેન્દ્રમાં નાના કાળા બિંદુઓ (પિક્નિડિયા)",
        "નીચલા પાન પહેલાં અસરગ્રસ્ત"
      ],
      "causes": [
        "વરસાદના છાંટા અને ઉપરથી સિંચાઈથી ફેલાતી સેપ્ટોરિયા લાઈકોપર્સિસી ફૂગ."
      ],
      "treatment": [
        "ફૂગનાશક (ક્લોરોથેલોનિલ અથવા કોપર) લગાવો",
        "નીચલા ચેપગ્રસ્ત પાન દૂર કરો",
        "રોગના પ્રથમ ચિહ્ને છંટકાવ કરો",
        "દર 7-14 દિવસે ઉપચાર ચાલુ રાખો"
      ],
      "prevention": [
        "છોડની આસપાસ મલ્ચિંગ કરો",
        "ઉપરથી સિંચાઈ ટાળો",
        "3 વર્ષ પાક ફેરબદલી કરો",
        "ચેપગ્રસ્ત છોડના અવશેષો દૂર કરો"
      ]
    },
    "Tomato_Spider_mites_Two_spotted_spider_mite": {
      "disease": "સ્પાઈડર માઈટ નુકસાન",
      "display_name": "સ્પાઈડર માઈટ નુકસાન",
      "crop_name": "ટમેટા",
      "description": "ટેટ્રાનિકસ ઉર્ટિકીને કારણે. સૂક્ષ્મ માઈટ પાનના કોષો ખાય છે જેનાથી ડાઘ અને જાળા બને છે.",
      "symptoms": [
        "પાન પર ઝીણા ડાઘ/છંટકાવ",
        "પાનનું પીળું અને કાંસ્ય રંગ થવું",
        "નીચેની બાજુએ ઝીણા જાળા",
        "ગંભીર કિસ્સામાં પાન ખરવું"
      ],
      "causes": [
        "ગરમ, સૂકી પરિસ્થિતિમાં બે-ડાઘવાળી સ્પાઈડર માઈટનો ચેપ."
      ],
      "treatment": [
        "માઈટ દૂર કરવા તેજ પાણીની ધાર મારો",
        "જંતુનાશક સાબુ અથવા લીમડાનું તેલ લગાવો",
        "માઈટિસાઈડ (એબામેક્ટિન) વાપરો",
        "શિકારી માઈટ (ફાઈટોસીલસ પર્સિમિલિસ) છોડો"
      ],
      "prevention": [
        "પૂરતી ભેજ જાળવો",
        "ધૂળભરી પરિસ્થિતિ ટાળો",
        "શિકારી માઈટ છોડો",
        "છોડને સારી રીતે સિંચો"
      ]
    },
    "Tomato__Target_Spot": {
      "disease": "ટાર્ગેટ સ્પોટ",
      "display_name": "ટાર્ગેટ સ્પોટ",
      "crop_name": "ટમેટા",
      "description": "કોરિનેસ્પોરા કેસીકોલાને કારણે. પાન, દાંડી અને ફળ પર સમકેન્દ્રિત વલય પેટર્ન દેખાય છે.",
      "symptoms": [
        "સમકેન્દ્રિત વલયો સાથે નાના ભૂરા ડાઘ",
        "ડાઘ 1 સેમી સુધી મોટા થાય",
        "ડાઘની આસપાસ પાન પીળું થવું",
        "ધંસેલા કેન્દ્રો સાથે ફળ ઘા"
      ],
      "causes": [
        "ગરમ, ભેજવાળા વાતાવરણમાં ખીલતી કોરિનેસ્પોરા કેસીકોલા ફૂગ."
      ],
      "treatment": [
        "ફૂગનાશક (એઝોક્સિસ્ટ્રોબિન અથવા ક્લોરોથેલોનિલ) લગાવો",
        "ચેપગ્રસ્ત પાન દૂર કરો",
        "ભીની મોસમમાં નિવારક છંટકાવ કરો",
        "સારું છોડ અંતર સુનિશ્ચિત કરો"
      ],
      "prevention": [
        "હવા પરિભ્રમણ સુધારો",
        "ઉપરથી સિંચાઈ ટાળો",
        "પાક અવશેષો દૂર કરો",
        "પાક ફેરબદલી કરો"
      ]
    },
    "Tomato__Tomato_YellowLeaf__Curl_Virus": {
      "disease": "પીળા પાન વળાંક વાયરસ (TYLCV)",
      "display_name": "પીળા પાન વળાંક વાયરસ (TYLCV)",
      "crop_name": "ટમેટા",
      "description": "સફેદ માખી (બેમિસિયા ટેબેસી) દ્વારા ફેલાતો વિનાશકારી વાયરલ રોગ.",
      "symptoms": [
        "પાનનું ઉપર તરફ વળવું અને કપ બનવું",
        "પાનના કિનારાની પીળાશ",
        "છોડની ગંભીર વામનતા",
        "ફૂલ ખરવું અને ફળ ઓછા લાગવા"
      ],
      "causes": [
        "સિલ્વરલીફ સફેદ માખી વાહકો દ્વારા ફેલાતો ટમેટા પીળા પાન વળાંક વાયરસ."
      ],
      "treatment": [
        "એકવાર ચેપ લાગે તો કોઈ ઈલાજ નથી — છોડ દૂર કરો",
        "ઈમિડાક્લોપ્રિડથી સફેદ માખી વાહક નિયંત્રિત કરો",
        "નિરીક્ષણ માટે પીળી ચીકણી જાળી લગાવો",
        "સફેદ માખી ઘટાડવા લીમડાનું તેલ લગાવો"
      ],
      "prevention": [
        "સફેદ માખી પ્રતિરોધક જાતો વાપરો",
        "જંતુ-રોધક જાળી લગાવો",
        "સફેદ માખી વસ્તી નિયંત્રિત કરો",
        "ચેપગ્રસ્ત છોડ તરત દૂર કરો"
      ]
    },
    "Tomato__Tomato_mosaic_virus": {
      "disease": "ટમેટા મોઝેક વાયરસ (ToMV)",
      "display_name": "ટમેટા મોઝેક વાયરસ (ToMV)",
      "crop_name": "ટમેટા",
      "description": "ડાઘવાળી પેટર્ન અને વિકૃત વૃદ્ધિનું કારણ બનતો ખૂબ ચેપી વાયરસ.",
      "symptoms": [
        "પાન પર આછા અને ઘેરા લીલા મોઝેક પેટર્ન",
        "પાનનું વળવું અને વિકૃતિ",
        "વામન છોડ વૃદ્ધિ",
        "ઓછા અને વિકૃત ફળ"
      ],
      "causes": [
        "દૂષિત સાધનો, હાથ અને બીજ દ્વારા યાંત્રિક રીતે ફેલાતો ટમેટા મોઝેક વાયરસ."
      ],
      "treatment": [
        "કોઈ રાસાયણિક ઈલાજ ઉપલબ્ધ નથી",
        "ચેપગ્રસ્ત છોડ દૂર કરીને નાશ કરો",
        "બધા સાધનો અને ટેકા જંતુમુક્ત કરો",
        "છોડ પાસે ધૂમ્રપાન ન કરો (તમાકુ મોઝેક ક્રોસ-ચેપ)"
      ],
      "prevention": [
        "વાયરસ-મુક્ત બીજ વાપરો",
        "10% બ્લીચ દ્રાવણથી સાધનો જંતુમુક્ત કરો",
        "છોડ સ્પર્શ કરતાં પહેલાં હાથ ધોવો",
        "પ્રતિરોધક જાતો વાપરો"
      ]
    },
    "Tomato_healthy": {
      "disease": "સ્વસ્થ",
      "display_name": "સ્વસ્થ",
      "crop_name": "ટમેટા",
      "description": "ટમેટાનો છોડ સ્વસ્થ દેખાય છે, રોગ અથવા જીવાત નુકસાનના કોઈ ચિહ્નો નથી.",
      "symptoms": [
        "જીવંત લીલા પાન",
        "કોઈ ડાઘ, ઘા અથવા રંગ બદલાવ નથી",
        "સામાન્ય ફળ વિકાસ"
      ],
      "causes": [
        "શ્રેષ્ઠ ઉગાડવાની પરિસ્થિતિઓ અને રોગકારકોની ગેરહાજરી."
      ],
      "treatment": [
        "કોઈ ઉપચારની જરૂર નથી",
        "નિયમિત સંભાળ ચાલુ રાખો",
        "ફેરફારો માટે સાપ્તાહિક નિરીક્ષણ કરો",
        "સુસંગત સિંચાઈ જાળવો"
      ],
      "prevention": [
        "સારી ખેતી પદ્ધતિઓ ચાલુ રાખો",
        "નિયમિત પાક ફેરબદલી કરો",
        "રોગના પ્રારંભિક ચિહ્નો માટે નિરીક્ષણ કરો",
        "સંતુલિત પોષણ જાળવો"
      ]
    }
  }
};

const PHRASE_TRANSLATIONS = {
  "hi": {
    "Caused by the fungus Alternaria alternata. Irregular brown lesions with concentric rings appear on leaves. It survives in crop debris.": "अल्टरनेरिया अल्टरनाटा कवक के कारण होता है। पत्तियों पर समकेंद्रित वलयों वाले अनियमित भूरे घाव दिखाई देते हैं। यह फसल अवशेषों में जीवित रहता है।",
    "Alternaria Leaf Spot": "अल्टरनेरिया पत्ती धब्बा",
    "Irregular brown lesions": "अनियमित भूरे घाव",
    "Concentric rings (target-board pattern) on leaves": "पत्तियों पर समकेंद्रित वलय (लक्ष्य-पैटर्न)",
    "Leaves drying up and dropping off": "पत्तियों का सूखना और गिरना",
    "Caused by the fungus Alternaria alternata in warm, humid conditions.": "गर्म, नम परिस्थितियों में अल्टरनेरिया अल्टरनाटा कवक के कारण।",
    "Apply copper-based fungicides (Copper Oxychloride 3 g/L)": "कॉपर-आधारित कवकनाशी (कॉपर ऑक्सीक्लोराइड 3 ग्राम/लीटर) लगाएं",
    "Use Mancozeb (2.5 g/L)": "मैनकोज़ेब (2.5 ग्राम/लीटर) का उपयोग करें",
    "Remove and burn infected plant parts": "संक्रमित पौधों के हिस्से हटाकर जलाएं",
    "Apply fungicide within 48 hours of symptoms": "लक्षण दिखने के 48 घंटे के भीतर कवकनाशी लगाएं",
    "Maintain proper spacing (30 × 10 cm)": "उचित अंतर (30 × 10 सेमी) बनाए रखें",
    "Avoid waterlogging": "जलभराव से बचें",
    "Use disease-free certified seeds": "रोग-मुक्त प्रमाणित बीज का उपयोग करें",
    "Practice crop rotation with cereals": "अनाज फसलों के साथ फसल चक्र अपनाएं",
    "The plant appears healthy with no signs of disease.": "पौधा स्वस्थ दिखाई देता है, रोग का कोई लक्षण नहीं।",
    "Healthy": "स्वस्थ",
    "None": "कोई नहीं",
    "Vibrant green leaves": "जीवंत हरी पत्तियाँ",
    "Normal growth": "सामान्य वृद्धि",
    "Optimal growing conditions and absence of pathogens.": "अनुकूल बढ़ती परिस्थितियाँ और रोगजनकों की अनुपस्थिति।",
    "No treatment needed": "कोई उपचार आवश्यक नहीं",
    "Continue regular watering": "नियमित सिंचाई जारी रखें",
    "Monitor leaves weekly": "साप्ताहिक पत्तियों की निगरानी करें",
    "Maintain soil health": "मिट्टी का स्वास्थ्य बनाए रखें",
    "Continue good farming practices": "अच्छी खेती पद्धतियाँ जारी रखें",
    "Use certified seeds": "प्रमाणित बीज का उपयोग करें",
    "Maintain field hygiene": "खेत की स्वच्छता बनाए रखें",
    "Practice crop rotation": "फसल चक्र अपनाएं",
    "Caused by Cercospora arachidicola (early) and Cercosporidium personatum (late). Brown or black spots appear on leaves.": "सर्कोस्पोरा एराकिडिकोला (प्रारंभिक) और सर्कोस्पोरिडियम पर्सोनेटम (देर से) के कारण। पत्तियों पर भूरे या काले धब्बे दिखाई देते हैं।",
    "Leaf Spot (Early and Late)": "पत्ती धब्बा (प्रारंभिक और देर से)",
    "Brown or dark spots on upper leaf surface": "पत्ती की ऊपरी सतह पर भूरे या काले धब्बे",
    "Yellow halo around spots": "धब्बों के चारों ओर पीला हाला",
    "Premature leaf drop": "समय से पहले पत्ती गिरना",
    "Fungal infection thriving in warm, humid conditions.": "गर्म, नम परिस्थितियों में पनपने वाला कवक संक्रमण।",
    "Apply fungicides such as Mancozeb": "मैनकोज़ेब जैसे कवकनाशी लगाएं",
    "Remove heavily infected leaves": "भारी संक्रमित पत्तियाँ हटाएं",
    "Spray fungicide every 10-14 days": "हर 10-14 दिन में कवकनाशी स्प्रे करें",
    "Use contact and systemic fungicides": "संपर्क और प्रणालीगत कवकनाशी का उपयोग करें",
    "Crop rotation with non-host crops": "गैर-मेज़बान फसलों के साथ फसल चक्र अपनाएं",
    "Avoid overhead irrigation": "ऊपरी सिंचाई से बचें",
    "Plant resistant varieties": "प्रतिरोधी किस्में लगाएं",
    "Maintain proper plant spacing": "उचित पौधों का अंतर बनाए रखें",
    "A viral disease transmitted by aphids. Causes severe stunting of plants and yellowing of leaves.": "एफिड्स द्वारा प्रसारित वायरल रोग। पौधों का गंभीर बौनापन और पत्तियों का पीलापन होता है।",
    "Groundnut Rosette Disease": "रोज़ेट रोग",
    "Severe stunting": "गंभीर बौनापन",
    "Yellowing of leaves": "पत्तियों का पीलापन",
    "Curled or distorted leaves": "मुड़ी या विकृत पत्तियाँ",
    "Viral infection transmitted by the groundnut aphid.": "मूंगफली एफिड द्वारा प्रसारित वायरल संक्रमण।",
    "Control aphid vectors with insecticides": "कीटनाशकों से एफिड वाहकों को नियंत्रित करें",
    "Remove and destroy infected plants": "संक्रमित पौधे हटाकर नष्ट करें",
    "No cure once infected": "एक बार संक्रमित होने पर कोई इलाज नहीं",
    "Apply systemic insecticides early": "जल्दी प्रणालीगत कीटनाशक लगाएं",
    "Plant early in the season": "मौसम में जल्दी बुआई करें",
    "Maintain high plant density": "उच्च पौधा घनत्व बनाए रखें",
    "Remove volunteer plants": "स्वयंसेवी पौधे हटाएं",
    "Use resistant varieties": "प्रतिरोधी किस्मों का उपयोग करें",
    "Caused by the fungus Puccinia arachidis. Orange-brown pustules appear on the underside of leaves.": "पुसीनिया एराकिडिस कवक के कारण। पत्तियों के निचले हिस्से पर नारंगी-भूरे रंग के दाने दिखाई देते हैं।",
    "Rust": "रतुआ रोग",
    "Orange-brown pustules on leaf underside": "पत्ती के निचले हिस्से पर नारंगी-भूरे दाने",
    "Leaves turn brown and dry up": "पत्तियाँ भूरी होकर सूख जाती हैं",
    "Pustules rupture releasing powdery spores": "दाने फटकर पाउडर जैसे बीजाणु छोड़ते हैं",
    "Fungus Puccinia arachidis spreading via airborne spores.": "हवा से फैलने वाले बीजाणुओं से पुसीनिया एराकिडिस कवक का प्रसार।",
    "Apply systemic fungicides (Triadimefon)": "प्रणालीगत कवकनाशी (ट्रायडिमेफॉन) लगाएं",
    "Spray at first sign of pustules": "दानों के पहले लक्षण पर स्प्रे करें",
    "Repeat every 10-15 days": "हर 10-15 दिन दोहराएं",
    "Combine with neem oil": "नीम तेल के साथ मिलाएं",
    "Grow rust-resistant varieties": "रतुआ प्रतिरोधी किस्में उगाएं",
    "Sow early": "जल्दी बुआई करें",
    "Remove crop residues": "फसल अवशेष हटाएं",
    "Avoid excessive nitrogen": "अत्यधिक नाइट्रोजन से बचें",
    "Caused by Ralstonia solanacearum. Plants wilt rapidly even with adequate soil moisture.": "राल्स्टोनिया सोलानेसीरम के कारण। पर्याप्त मिट्टी नमी होने पर भी पौधे तेजी से मुरझाते हैं।",
    "Bacterial Wilt": "बैक्टीरियल विल्ट",
    "Rapid wilting of leaves and stems": "पत्तियों और तनों का तेजी से मुरझाना",
    "Stems may show brown discoloration inside": "तने के अंदर भूरा रंग दिखना",
    "White bacterial ooze from cut stems": "कटे तने से सफेद बैक्टीरियल रिसाव",
    "Bacterial infection through roots or wounded plant parts.": "जड़ों या घायल पौधों के हिस्सों से बैक्टीरियल संक्रमण।",
    "No chemical cure available": "कोई रासायनिक इलाज उपलब्ध नहीं",
    "Solarize soil if heavily infested": "भारी संक्रमित मिट्टी को सोलराइज़ करें",
    "Apply bio-control agents preventatively": "जैव-नियंत्रण एजेंटों का निवारक उपयोग करें",
    "Use certified disease-free seed tubers": "प्रमाणित रोग-मुक्त बीज कंदों का उपयोग करें",
    "Practice 3-5 year crop rotation": "3-5 साल का फसल चक्र अपनाएं",
    "Improve soil drainage": "मिट्टी की जल निकासी सुधारें",
    "Sanitize farm equipment": "खेती उपकरण साफ करें",
    "Caused by Alternaria solani. Dark, concentric spots appear on older leaves first.": "अल्टरनेरिया सोलानी के कारण। पुरानी पत्तियों पर पहले गहरे, समकेंद्रित धब्बे दिखाई देते हैं।",
    "Fungal Blight (Early Blight)": "कवक ब्लाइट (अर्ली ब्लाइट)",
    "Dark brown spots with concentric rings": "समकेंद्रित वलयों वाले गहरे भूरे धब्बे",
    "Yellowing around spots": "धब्बों के चारों ओर पीलापन",
    "Leaves drying and dying": "पत्तियाँ सूखना और मरना",
    "Fungus spreading in warm, moist environments.": "गर्म, नम वातावरण में फैलने वाला कवक।",
    "Apply protectant fungicides (Chlorothalonil)": "सुरक्षात्मक कवकनाशी (क्लोरोथैलोनिल) लगाएं",
    "Apply systemic fungicides": "प्रणालीगत कवकनाशी लगाएं",
    "Spray early in the season": "मौसम की शुरुआत में स्प्रे करें",
    "Remove infected debris": "संक्रमित अवशेष हटाएं",
    "Use disease-free seed": "रोग-मुक्त बीज का उपयोग करें",
    "Provide adequate fertilization": "पर्याप्त उर्वरीकरण करें",
    "Rotate crops with non-solanaceous plants": "गैर-सोलानेसी पौधों के साथ फसल चक्र करें",
    "Microscopic worms that feed on potato roots, causing poor growth and yield loss.": "सूक्ष्म कीड़े जो आलू की जड़ों पर खाते हैं, खराब वृद्धि और उपज हानि का कारण बनते हैं।",
    "Potato Cyst Nematode": "आलू सिस्ट नेमाटोड",
    "Stunted plant growth": "बौनी पौधा वृद्धि",
    "Tiny white/yellow cysts on roots": "जड़ों पर छोटे सफेद/पीले सिस्ट",
    "Infestation of Globodera species in the soil.": "मिट्टी में ग्लोबोडेरा प्रजातियों का संक्रमण।",
    "Apply nematicides before planting": "बुआई से पहले नेमाटिसाइड लगाएं",
    "Use trap crops": "जाल फसलों का उपयोग करें",
    "Solarize soil": "मिट्टी को सोलराइज़ करें",
    "Fumigate soil in severe cases": "गंभीर मामलों में मिट्टी को धूमित करें",
    "Strict quarantine measures": "सख्त संगरोध उपाय",
    "Long crop rotations (up to 7 years)": "लंबा फसल चक्र (7 साल तक)",
    "Clean equipment to prevent soil spread": "मिट्टी फैलाव रोकने के लिए उपकरण साफ करें",
    "Insects feeding on potato foliage, which can completely defoliate the plant.": "आलू की पत्तियों पर खाने वाले कीड़े, जो पौधे को पूरी तरह पत्तीहीन कर सकते हैं।",
    "Pest Infestation (Colorado Potato Beetle)": "कीट संक्रमण",
    "Holes in leaves": "पत्तियों में छेद",
    "Skeletonized leaves": "पत्तियों का कंकाल बनना",
    "Presence of larvae or adult beetles": "लार्वा या वयस्क भृंगों की उपस्थिति",
    "Insect pests multiplying rapidly in favorable conditions.": "अनुकूल परिस्थितियों में तेजी से बढ़ने वाले कीट।",
    "Hand-pick beetles and larvae": "भृंगों और लार्वा को हाथ से चुनें",
    "Apply Spinosad or Neem oil": "स्पिनोसैड या नीम तेल लगाएं",
    "Use specific chemical insecticides": "विशिष्ट रासायनिक कीटनाशकों का उपयोग करें",
    "Apply Bacillus thuringiensis (Bt) for larvae": "लार्वा के लिए बैसिलस थुरिंगिएंसिस (Bt) लगाएं",
    "Use row covers": "पंक्ति कवर का उपयोग करें",
    "Encourage natural predators": "प्राकृतिक शिकारियों को प्रोत्साहित करें",
    "Plant early to avoid peak pest populations": "चरम कीट आबादी से बचने के लिए जल्दी लगाएं",
    "A devastating disease caused by Phytophthora infestans. Can destroy a crop in days under cool, wet conditions.": "फाइटोफ्थोरा इंफेस्टांस के कारण विनाशकारी रोग। ठंडी, गीली परिस्थितियों में कुछ दिनों में फसल नष्ट कर सकता है।",
    "Late Blight (Phytophthora)": "लेट ब्लाइट (फाइटोफ्थोरा)",
    "Water-soaked, dark green spots on leaves": "पत्तियों पर पानी से भीगे, गहरे हरे धब्बे",
    "White fungal growth on leaf underside": "पत्ती के निचले हिस्से पर सफेद कवक वृद्धि",
    "Brown, rot on tubers": "कंदों पर भूरी सड़न",
    "Oomycete pathogen thriving in cool, wet weather.": "ठंडे, गीले मौसम में पनपने वाला ऊमाइसीट रोगजनक।",
    "Apply contact fungicides preventatively": "निवारक संपर्क कवकनाशी लगाएं",
    "Use systemic fungicides like Metalaxyl": "मेटालैक्सिल जैसे प्रणालीगत कवकनाशी लगाएं",
    "Destroy infected vines before harvest": "कटाई से पहले संक्रमित बेलें नष्ट करें",
    "Harvest in dry conditions": "सूखी परिस्थितियों में कटाई करें",
    "Destroy volunteer potatoes": "स्वयंसेवी आलू नष्ट करें",
    "Ensure good soil drainage": "अच्छी मिट्टी जल निकासी सुनिश्चित करें",
    "Avoid late harvesting": "देर से कटाई से बचें",
    "Viral diseases transmitted by aphids, causing mosaic patterns or leaf rolling.": "एफिड्स द्वारा प्रसारित वायरल रोग, मोज़ेक पैटर्न या पत्ती मुड़ने का कारण बनता है।",
    "Potato Virus (PVY/PLRV)": "आलू वायरस (PVY/PLRV)",
    "Mottled or mosaic patterns on leaves": "पत्तियों पर मोज़ेक या धब्बेदार पैटर्न",
    "Rolling of leaves upward": "पत्तियों का ऊपर की ओर मुड़ना",
    "Stunted growth and reduced yield": "बौनी वृद्धि और कम उपज",
    "Viruses transmitted by aphid vectors or infected seed tubers.": "एफिड वाहकों या संक्रमित बीज कंदों द्वारा प्रसारित वायरस।",
    "No chemical cure for viruses": "वायरस का कोई रासायनिक इलाज नहीं",
    "Use insecticides to control vectors": "वाहकों को नियंत्रित करने के लिए कीटनाशक लगाएं",
    "Apply mineral oils to reduce transmission": "संचरण कम करने के लिए खनिज तेल लगाएं",
    "Destroy heavily infected crops": "भारी संक्रमित फसलों को नष्ट करें",
    "Use certified virus-free seed": "प्रमाणित वायरस-मुक्त बीज का उपयोग करें",
    "Control aphid populations": "एफिड आबादी नियंत्रित करें",
    "Remove (rogue) infected plants early": "संक्रमित पौधे जल्दी हटाएं",
    "Avoid planting near infected fields": "संक्रमित खेतों के पास बुआई से बचें",
    "Caused by Xanthomonas campestris. Water-soaked spots appear on leaves, stems, and fruit.": "ज़ैंथोमोनास कैम्पेस्ट्रिस के कारण। पत्तियों, तनों और फलों पर पानी से भीगे धब्बे दिखाई देते हैं।",
    "Bacterial Spot": "बैक्टीरियल स्पॉट",
    "Small, dark, water-soaked spots on leaves": "पत्तियों पर छोटे, गहरे, पानी से भीगे धब्बे",
    "Spots enlarge and turn brown with yellow halo": "धब्बे बड़े होकर पीले हालो के साथ भूरे होते हैं",
    "Leaf drop in severe cases": "गंभीर मामलों में पत्ती गिरना",
    "Raised scab-like spots on fruit": "फलों पर उभरे पपड़ीदार धब्बे",
    "Bacterial infection (Xanthomonas campestris pv. vesicatoria) spread by rain splash and contaminated seeds.": "बारिश की बूंदों और दूषित बीजों से फैलने वाला बैक्टीरियल संक्रमण।",
    "Apply copper-based bactericides": "कॉपर-आधारित जीवाणुनाशक लगाएं",
    "Spray Streptomycin if permitted": "अनुमति हो तो स्ट्रेप्टोमाइसिन स्प्रे करें",
    "Remove heavily infected plants": "भारी संक्रमित पौधे हटाएं",
    "Improve air circulation around plants": "पौधों के चारों ओर वायु संचार सुधारें",
    "Use certified disease-free seeds": "प्रमाणित रोग-मुक्त बीज का उपयोग करें",
    "Practice crop rotation (2-3 years)": "फसल चक्र (2-3 साल) अपनाएं",
    "Remove infected plant debris": "संक्रमित पौधों के अवशेष हटाएं",
    "The pepper plant appears healthy with no signs of disease.": "मिर्च का पौधा स्वस्थ दिखाई देता है, रोग का कोई लक्षण नहीं।",
    "No spots or lesions": "कोई धब्बे या घाव नहीं",
    "Normal growth and fruit development": "सामान्य वृद्धि और फल विकास",
    "Caused by Xanthomonas species. Small, dark, water-soaked lesions appear on leaves and fruit.": "ज़ैंथोमोनास प्रजातियों के कारण। पत्तियों और फलों पर छोटे, गहरे, पानी से भीगे घाव दिखाई देते हैं।",
    "Small dark spots on leaves": "पत्तियों पर छोटे गहरे धब्बे",
    "Spots may have yellow halo": "धब्बों पर पीला हाला हो सकता है",
    "Leaf yellowing and drop": "पत्ती पीली होकर गिरना",
    "Raised scabby spots on fruit": "फलों पर उभरे पपड़ीदार धब्बे",
    "Bacterial infection spread by rain splash, overhead irrigation, and contaminated seeds.": "बारिश की बूंदों, ऊपरी सिंचाई और दूषित बीजों से फैलने वाला बैक्टीरियल संक्रमण।",
    "Apply copper-based sprays": "कॉपर-आधारित स्प्रे लगाएं",
    "Use copper + mancozeb combination": "कॉपर + मैनकोज़ेब मिश्रण का उपयोग करें",
    "Avoid working in wet fields": "गीले खेतों में काम करने से बचें",
    "Use disease-free seeds and transplants": "रोग-मुक्त बीज और रोपाई का उपयोग करें",
    "Avoid overhead watering": "ऊपरी सिंचाई से बचें",
    "Rotate crops for 2-3 years": "2-3 साल फसल चक्र अपनाएं",
    "Remove crop debris after harvest": "कटाई के बाद फसल अवशेष हटाएं",
    "Caused by Alternaria solani. Concentric dark rings (target spots) form on older leaves first.": "Alternaria solani कवक के कारण होता है। पुरानी पत्तियों पर पहले समकेंद्रित गहरे वलय (टारगेट स्पॉट्स) दिखाई देते हैं।",
    "Early Blight": "अर्ली ब्लाइट",
    "Dark concentric ring spots on lower leaves": "निचली पत्तियों पर गहरे समकेंद्रित वलय वाले धब्बे",
    "Yellow area around spots": "धब्बों के चारों ओर पीला क्षेत्र",
    "Leaves wither and drop": "पत्तियाँ मुरझाकर गिरती हैं",
    "Stem lesions possible": "तने पर भी घाव संभव हैं",
    "Fungus Alternaria solani thriving in warm, humid conditions with heavy dew.": "गर्म, नम परिस्थितियों और भारी ओस में Alternaria solani कवक का प्रकोप बढ़ता है।",
    "Apply chlorothalonil or mancozeb fungicides": "Chlorothalonil या Mancozeb कवकनाशी का छिड़काव करें",
    "Spray copper-based fungicides": "कॉपर-आधारित कवकनाशी स्प्रे करें",
    "Remove infected leaves promptly": "संक्रमित पत्तियां तुरंत हटाएं",
    "Apply fungicide every 7-10 days in wet weather": "गीले मौसम में हर 7-10 दिन पर उपचार जारी रखें",
    "Stake plants for air circulation": "वायु संचार के लिए पौधों को सहारा दें",
    "Mulch around base": "आधार के चारों ओर मल्चिंग करें",
    "Water at soil level": "मिट्टी स्तर पर पानी दें (ऊपर से छिड़काव से बचें)",
    "Remove lower infected leaves": "निचली संक्रमित पत्तियाँ हटाएं",
    "Caused by Phytophthora infestans. Can devastate entire crops rapidly in cool, wet conditions.": "फाइटोफ्थोरा इंफेस्टांस के कारण। ठंडी, गीली परिस्थितियों में पूरी फसल तेजी से नष्ट कर सकता है।",
    "Late Blight": "लेट ब्लाइट",
    "Large, irregularly shaped, water-soaked lesions": "बड़े, अनियमित आकार के, पानी से भीगे घाव",
    "White fuzzy mold on leaf undersides": "पत्ती के निचले हिस्से पर सफेद रोएंदार फफूंद",
    "Dark brown firm rot on fruit": "फलों पर गहरी भूरी सख्त सड़न",
    "Rapid plant collapse": "तेजी से पौधा गिरना",
    "Oomycete Phytophthora infestans favored by cool (15-22°C), wet weather.": "ठंडे (15-22°C), गीले मौसम में पनपने वाला ऊमाइसीट फाइटोफ्थोरा इंफेस्टांस।",
    "Apply systemic fungicides (Metalaxyl)": "प्रणालीगत कवकनाशी (मेटालैक्सिल) लगाएं",
    "Spray preventive copper fungicides": "निवारक कॉपर कवकनाशी स्प्रे करें",
    "Destroy infected plants immediately": "संक्रमित पौधे तुरंत नष्ट करें",
    "Harvest remaining fruit quickly": "शेष फल जल्दी तोड़ लें",
    "Destroy volunteer plants": "स्वयंसेवी पौधे नष्ट करें",
    "Provide good air circulation": "अच्छा वायु संचार प्रदान करें",
    "Caused by Passalora fulva (Cladosporium fulvum). Mainly affects greenhouse tomatoes.": "पासालोरा फुल्वा (क्लैडोस्पोरियम फुल्वम) के कारण। मुख्य रूप से ग्रीनहाउस टमाटरों को प्रभावित करता है।",
    "Leaf Mold": "पत्ती फफूंद",
    "Pale green to yellow spots on upper leaf surface": "ऊपरी पत्ती की सतह पर हल्के हरे से पीले धब्बे",
    "Olive-green to brown velvety mold on underside": "निचले हिस्से पर जैतूनी-हरे से भूरे मखमली फफूंद",
    "Leaves curl and wither": "पत्तियाँ मुड़कर मुरझाना",
    "Reduced fruit set": "फल लगने में कमी",
    "Fungus Passalora fulva thriving in high humidity (>85%) and moderate temperatures.": "उच्च आर्द्रता (>85%) और मध्यम तापमान में पनपने वाला पासालोरा फुल्वा कवक।",
    "Improve air circulation immediately": "तुरंत वायु संचार सुधारें",
    "Apply fungicides (chlorothalonil)": "कवकनाशी (क्लोरोथैलोनिल) लगाएं",
    "Remove severely affected leaves": "भारी प्रभावित पत्तियाँ हटाएं",
    "Reduce watering frequency": "सिंचाई की आवृत्ति कम करें",
    "Improve greenhouse ventilation": "ग्रीनहाउस वेंटिलेशन सुधारें",
    "Reduce humidity below 85%": "आर्द्रता 85% से नीचे रखें",
    "Space plants adequately": "पौधों को पर्याप्त दूरी पर लगाएं",
    "Caused by Septoria lycopersici. Small circular spots with dark borders and gray centers.": "सेप्टोरिया लाइकोपर्सिसी के कारण। गहरे किनारों और भूरे केंद्रों वाले छोटे गोलाकार धब्बे।",
    "Septoria Leaf Spot": "सेप्टोरिया पत्ती धब्बा",
    "Numerous small circular spots (1-3mm)": "कई छोटे गोलाकार धब्बे (1-3 मिमी)",
    "Dark brown borders with gray/tan centers": "गहरे भूरे किनारे और भूरे/कत्थई केंद्र",
    "Tiny black dots (pycnidia) in spot centers": "धब्बों के केंद्र में छोटे काले बिंदु (पिक्निडिया)",
    "Lower leaves affected first": "निचली पत्तियाँ पहले प्रभावित",
    "Fungus Septoria lycopersici spread by rain splash and overhead irrigation.": "बारिश की बूंदों और ऊपरी सिंचाई से फैलने वाला सेप्टोरिया लाइकोपर्सिसी कवक।",
    "Apply fungicides (chlorothalonil or copper)": "कवकनाशी (क्लोरोथैलोनिल या कॉपर) लगाएं",
    "Spray at first sign of disease": "रोग के पहले लक्षण पर स्प्रे करें",
    "Continue treatment every 7-14 days": "हर 7-14 दिन उपचार जारी रखें",
    "Mulch around plants": "पौधों के चारों ओर मल्चिंग करें",
    "Rotate crops for 3 years": "3 साल फसल चक्र अपनाएं",
    "Caused by Tetranychus urticae. Tiny mites feed on leaf cells causing stippling and webbing.": "टेट्रानिकस उर्टिके के कारण। सूक्ष्म माइट पत्ती की कोशिकाओं पर खाते हैं जिससे धब्बे और जाले बनते हैं।",
    "Spider Mite Damage": "मकड़ी माइट क्षति",
    "Fine stippling/speckling on leaves": "पत्तियों पर बारीक धब्बे/छिड़काव",
    "Yellowing and bronzing of leaves": "पत्तियों का पीला और कांस्य रंग होना",
    "Fine webbing on undersides": "निचले हिस्से पर बारीक जाले",
    "Infestation by two-spotted spider mites, favored by hot, dry conditions.": "गर्म, शुष्क परिस्थितियों में दो-धब्बेदार मकड़ी माइट का संक्रमण।",
    "Spray with strong water jet to dislodge mites": "माइट हटाने के लिए तेज पानी की धार मारें",
    "Apply insecticidal soap or neem oil": "कीटनाशक साबुन या नीम तेल लगाएं",
    "Use miticides (abamectin)": "माइटिसाइड (एबामेक्टिन) का उपयोग करें",
    "Release predatory mites (Phytoseiulus persimilis)": "शिकारी माइट (फाइटोसीलस पर्सिमिलिस) छोड़ें",
    "Maintain adequate humidity": "पर्याप्त आर्द्रता बनाए रखें",
    "Avoid dusty conditions": "धूलभरी परिस्थितियों से बचें",
    "Introduce predatory mites": "शिकारी माइट पेश करें",
    "Keep plants well-watered": "पौधों को अच्छी तरह सींचें",
    "Caused by Corynespora cassiicola. Concentric ring patterns appear on leaves, stems, and fruit.": "कोरिनेस्पोरा कैसीकोला के कारण। पत्तियों, तनों और फलों पर समकेंद्रित वलय पैटर्न दिखाई देते हैं।",
    "Target Spot": "लक्ष्य धब्बा",
    "Small brown spots with concentric rings": "समकेंद्रित वलयों वाले छोटे भूरे धब्बे",
    "Spots enlarge up to 1cm": "धब्बे 1 सेमी तक बड़े होते हैं",
    "Leaf yellowing around spots": "धब्बों के चारों ओर पत्ती पीली होना",
    "Fruit lesions with sunken centers": "धंसे केंद्रों वाले फल घाव",
    "Fungus Corynespora cassiicola thriving in warm, humid environments.": "गर्म, नम वातावरण में पनपने वाला कोरिनेस्पोरा कैसीकोला कवक।",
    "Apply fungicides (azoxystrobin or chlorothalonil)": "कवकनाशी (एज़ोक्सिस्ट्रोबिन या क्लोरोथैलोनिल) लगाएं",
    "Remove infected leaves": "संक्रमित पत्तियाँ हटाएं",
    "Spray preventively in wet seasons": "गीले मौसम में निवारक स्प्रे करें",
    "Ensure good plant spacing": "अच्छा पौधा अंतर सुनिश्चित करें",
    "Improve air circulation": "वायु संचार सुधारें",
    "Remove crop debris": "फसल अवशेष हटाएं",
    "A devastating viral disease transmitted by whiteflies (Bemisia tabaci).": "सफेद मक्खी (बेमिसिया टाबैसी) द्वारा प्रसारित विनाशकारी वायरल रोग।",
    "Yellow Leaf Curl Virus (TYLCV)": "पीली पत्ती मोड़ वायरस (TYLCV)",
    "Upward curling and cupping of leaves": "पत्तियों का ऊपर की ओर मुड़ना और कप बनना",
    "Yellowing of leaf margins": "पत्ती के किनारों का पीलापन",
    "Severe stunting of plant": "पौधे का गंभीर बौनापन",
    "Flower drop and reduced fruit set": "फूल गिरना और फल कम लगना",
    "Tomato Yellow Leaf Curl Virus transmitted by silverleaf whitefly vectors.": "सिल्वरलीफ सफेद मक्खी वाहकों द्वारा प्रसारित टमाटर पीली पत्ती मोड़ वायरस।",
    "No cure once infected — remove plants": "एक बार संक्रमित होने पर कोई इलाज नहीं — पौधे हटाएं",
    "Control whitefly vectors with imidacloprid": "इमिडाक्लोप्रिड से सफेद मक्खी वाहक नियंत्रित करें",
    "Use yellow sticky traps for monitoring": "निगरानी के लिए पीली चिपकने वाली जालें लगाएं",
    "Apply neem oil to reduce whitefly populations": "सफेद मक्खी कम करने के लिए नीम तेल लगाएं",
    "Use whitefly-resistant varieties": "सफेद मक्खी प्रतिरोधी किस्मों का उपयोग करें",
    "Install insect-proof netting": "कीट-रोधी जाली लगाएं",
    "Control whitefly populations": "सफेद मक्खी आबादी नियंत्रित करें",
    "Remove infected plants immediately": "संक्रमित पौधे तुरंत हटाएं",
    "A highly contagious virus that causes mottled patterns and distorted growth.": "अत्यधिक संक्रामक वायरस जो धब्बेदार पैटर्न और विकृत वृद्धि का कारण बनता है।",
    "Tomato Mosaic Virus (ToMV)": "टमाटर मोज़ेक वायरस (ToMV)",
    "Light and dark green mosaic patterns on leaves": "पत्तियों पर हल्के और गहरे हरे मोज़ेक पैटर्न",
    "Leaf curling and distortion": "पत्ती का मुड़ना और विकृति",
    "Reduced and distorted fruit": "कम और विकृत फल",
    "Tomato Mosaic Virus spread mechanically through contaminated tools, hands, and seeds.": "दूषित उपकरणों, हाथों और बीजों से यांत्रिक रूप से फैलने वाला टमाटर मोज़ेक वायरस।",
    "Disinfect all tools and stakes": "सभी उपकरण और डंडे कीटाणुरहित करें",
    "Do not smoke near plants (tobacco mosaic cross-infection)": "पौधों के पास धूम्रपान न करें (तंबाकू मोज़ेक क्रॉस-संक्रमण)",
    "Use virus-free seeds": "वायरस-मुक्त बीज का उपयोग करें",
    "Disinfect tools with 10% bleach solution": "10% ब्लीच घोल से उपकरण कीटाणुरहित करें",
    "Wash hands before handling plants": "पौधे छूने से पहले हाथ धोएं",
    "The tomato plant appears healthy with no signs of disease or pest damage.": "टमाटर का पौधा स्वस्थ दिखाई देता है, रोग या कीट क्षति का कोई लक्षण नहीं।",
    "Vibrant green foliage": "जीवंत हरी पत्तियाँ",
    "No spots, lesions, or discoloration": "कोई धब्बे, घाव या रंग बदलना नहीं",
    "Normal fruit development": "सामान्य फल विकास",
    "Continue regular care": "नियमित देखभाल जारी रखें",
    "Monitor weekly for changes": "परिवर्तनों के लिए साप्ताहिक निगरानी करें",
    "Maintain consistent watering": "लगातार सिंचाई बनाए रखें",
    "Rotate crops regularly": "नियमित फसल चक्र करें",
    "Monitor for early signs of disease": "रोग के शुरुआती लक्षणों की निगरानी करें",
    "Maintain balanced nutrition": "संतुलित पोषण बनाए रखें"
  },
  "gu": {
    "Caused by the fungus Alternaria alternata. Irregular brown lesions with concentric rings appear on leaves. It survives in crop debris.": "અલ્ટરનેરિયા અલ્ટરનાટા ફૂગને કારણે થાય છે. પાન પર સમકેન્દ્રિત વલયો સાથે અનિયમિત ભૂરા ઘા દેખાય છે. તે પાક અવશેષોમાં ટકી રહે છે.",
    "Alternaria Leaf Spot": "અલ્ટરનેરિયા પાન ડાઘ",
    "Irregular brown lesions": "અનિયમિત ભૂરા ઘા",
    "Concentric rings (target-board pattern) on leaves": "પાન પર સમકેન્દ્રિત વલયો (ટાર્ગેટ-પેટર્ન)",
    "Leaves drying up and dropping off": "પાન સૂકાઈને ખરી પડવા",
    "Caused by the fungus Alternaria alternata in warm, humid conditions.": "ગરમ, ભેજવાળી પરિસ્થિતિમાં અલ્ટરનેરિયા અલ્ટરનાટા ફૂગને કારણે.",
    "Apply copper-based fungicides (Copper Oxychloride 3 g/L)": "કોપર-આધારિત ફૂગનાશક (કોપર ઓક્સિક્લોરાઈડ 3 ગ્રામ/લીટર) લગાવો",
    "Use Mancozeb (2.5 g/L)": "મેન્કોઝેબ (2.5 ગ્રામ/લીટર) વાપરો",
    "Remove and burn infected plant parts": "ચેપગ્રસ્ત ભાગ દૂર કરીને બાળો",
    "Apply fungicide within 48 hours of symptoms": "લક્ષણ દેખાયાના 48 કલાકમાં ફૂગનાશક લગાવો",
    "Maintain proper spacing (30 × 10 cm)": "યોગ્ય અંતર (30 × 10 સેમી) જાળવો",
    "Avoid waterlogging": "જળભરાવ ટાળો",
    "Use disease-free certified seeds": "રોગ-મુક્ત પ્રમાણિત બીજ વાપરો",
    "Practice crop rotation with cereals": "અનાજ પાકો સાથે પાક ફેરબદલી કરો",
    "The plant appears healthy with no signs of disease.": "છોડ સ્વસ્થ દેખાય છે, રોગના કોઈ ચિહ્નો નથી.",
    "Healthy": "સ્વસ્થ",
    "None": "કોઈ નહીં",
    "Vibrant green leaves": "જીવંત લીલા પાન",
    "Normal growth": "સામાન્ય વૃદ્ધિ",
    "Optimal growing conditions and absence of pathogens.": "શ્રેષ્ઠ ઉગાડવાની પરિસ્થિતિઓ અને રોગકારકોની ગેરહાજરી.",
    "No treatment needed": "કોઈ ઉપચારની જરૂર નથી",
    "Continue regular watering": "નિયમિત સિંચાઈ ચાલુ રાખો",
    "Monitor leaves weekly": "સાપ્તાહિક પાનનું નિરીક્ષણ કરો",
    "Maintain soil health": "જમીનનું સ્વાસ્થ્ય જાળવો",
    "Continue good farming practices": "સારી ખેતી પદ્ધતિઓ ચાલુ રાખો",
    "Use certified seeds": "પ્રમાણિત બીજ વાપરો",
    "Maintain field hygiene": "ખેતરની સ્વચ્છતા જાળવો",
    "Practice crop rotation": "પાક ફેરબદલી કરો",
    "Caused by Cercospora arachidicola (early) and Cercosporidium personatum (late). Brown or black spots appear on leaves.": "સર્કોસ્પોરા એરાકિડિકોલા (વહેલો) અને સર્કોસ્પોરિડિયમ પર્સોનેટમ (મોડો) ને કારણે. પાન પર ભૂરા અથવા કાળા ડાઘ દેખાય છે.",
    "Leaf Spot (Early and Late)": "પાન ડાઘ (વહેલો અને મોડો)",
    "Brown or dark spots on upper leaf surface": "પાનની ઉપરની સપાટી પર ભૂરા અથવા કાળા ડાઘ",
    "Yellow halo around spots": "ડાઘની આસપાસ પીળો હાલો",
    "Premature leaf drop": "સમય પહેલાં પાન ખરવું",
    "Fungal infection thriving in warm, humid conditions.": "ગરમ, ભેજવાળી પરિસ્થિતિમાં ખીલતો ફૂગ ચેપ.",
    "Apply fungicides such as Mancozeb": "મેન્કોઝેબ જેવા ફૂગનાશક લગાવો",
    "Remove heavily infected leaves": "ભારે ચેપગ્રસ્ત પાન દૂર કરો",
    "Spray fungicide every 10-14 days": "દર 10-14 દિવસે ફૂગનાશક છંટકાવ કરો",
    "Use contact and systemic fungicides": "સંપર્ક અને પ્રણાલીગત ફૂગનાશક વાપરો",
    "Crop rotation with non-host crops": "બિન-યજમાન પાકો સાથે પાક ફેરબદલી કરો",
    "Avoid overhead irrigation": "ઉપરથી સિંચાઈ ટાળો",
    "Plant resistant varieties": "પ્રતિરોધક જાતો વાવો",
    "Maintain proper plant spacing": "યોગ્ય છોડ અંતર જાળવો",
    "A viral disease transmitted by aphids. Causes severe stunting of plants and yellowing of leaves.": "મોલો દ્વારા ફેલાતો વાયરલ રોગ. છોડની ગંભીર વામનતા અને પાનની પીળાશ થાય છે.",
    "Groundnut Rosette Disease": "રોઝેટ રોગ",
    "Severe stunting": "ગંભીર વામનતા",
    "Yellowing of leaves": "પાનની પીળાશ",
    "Curled or distorted leaves": "વળેલા અથવા વિકૃત પાન",
    "Viral infection transmitted by the groundnut aphid.": "મગફળીના મોલો દ્વારા ફેલાતો વાયરલ ચેપ.",
    "Control aphid vectors with insecticides": "જંતુનાશકથી મોલો વાહકોને નિયંત્રિત કરો",
    "Remove and destroy infected plants": "ચેપગ્રસ્ત છોડ દૂર કરીને નાશ કરો",
    "No cure once infected": "એકવાર ચેપ લાગે પછી કોઈ ઈલાજ નથી",
    "Apply systemic insecticides early": "વહેલા પ્રણાલીગત જંતુનાશક લગાવો",
    "Plant early in the season": "મોસમમાં વહેલા વાવો",
    "Maintain high plant density": "ઊંચી છોડ ઘનતા જાળવો",
    "Remove volunteer plants": "સ્વયંસેવી છોડ દૂર કરો",
    "Use resistant varieties": "પ્રતિરોધક જાતો વાપરો",
    "Caused by the fungus Puccinia arachidis. Orange-brown pustules appear on the underside of leaves.": "પુસીનિયા એરાકિડિસ ફૂગને કારણે. પાનની નીચેની બાજુએ નારંગી-ભૂરા દાણા દેખાય છે.",
    "Rust": "રસ્ટ રોગ",
    "Orange-brown pustules on leaf underside": "પાનની નીચે નારંગી-ભૂરા દાણા",
    "Leaves turn brown and dry up": "પાન ભૂરા થઈને સૂકાય છે",
    "Pustules rupture releasing powdery spores": "દાણા ફાટીને પાવડર જેવા બીજાણુ છોડે છે",
    "Fungus Puccinia arachidis spreading via airborne spores.": "હવાથી ફેલાતા બીજાણુઓ દ્વારા પુસીનિયા એરાકિડિસ ફૂગનો ફેલાવો.",
    "Apply systemic fungicides (Triadimefon)": "પ્રણાલીગત ફૂગનાશક (ટ્રાયડીમેફોન) લગાવો",
    "Spray at first sign of pustules": "દાણાના પ્રથમ ચિહ્ને છંટકાવ કરો",
    "Repeat every 10-15 days": "દર 10-15 દિવસે પુનરાવર્તન કરો",
    "Combine with neem oil": "લીમડાના તેલ સાથે ભેળવો",
    "Grow rust-resistant varieties": "રસ્ટ પ્રતિરોધક જાતો ઉગાડો",
    "Sow early": "વહેલા વાવો",
    "Remove crop residues": "પાક અવશેષો દૂર કરો",
    "Avoid excessive nitrogen": "વધુ પડતા નાઈટ્રોજનથી બચો",
    "Caused by Ralstonia solanacearum. Plants wilt rapidly even with adequate soil moisture.": "રાલ્સ્ટોનિયા સોલાનેસીરમને કારણે. પૂરતી જમીન ભેજ હોવા છતાં છોડ ઝડપથી સુકાય છે.",
    "Bacterial Wilt": "બેક્ટેરિયલ વિલ્ટ",
    "Rapid wilting of leaves and stems": "પાન અને દાંડીનું ઝડપી સુકાવું",
    "Stems may show brown discoloration inside": "દાંડીની અંદર ભૂરો રંગ",
    "White bacterial ooze from cut stems": "કાપેલી દાંડીમાંથી સફેદ બેક્ટેરિયલ ઝરણ",
    "Bacterial infection through roots or wounded plant parts.": "મૂળ અથવા ઘાયલ છોડના ભાગોથી બેક્ટેરિયલ ચેપ.",
    "No chemical cure available": "કોઈ રાસાયણિક ઈલાજ ઉપલબ્ધ નથી",
    "Solarize soil if heavily infested": "ભારે ચેપગ્રસ્ત જમીન સોલરાઈઝ કરો",
    "Apply bio-control agents preventatively": "જૈવ-નિયંત્રણ એજન્ટો નિવારક રીતે વાપરો",
    "Use certified disease-free seed tubers": "પ્રમાણિત રોગ-મુક્ત બીજ કંદ વાપરો",
    "Practice 3-5 year crop rotation": "3-5 વર્ષની પાક ફેરબદલી કરો",
    "Improve soil drainage": "જમીનની જળ નિકાલ સુધારો",
    "Sanitize farm equipment": "ખેતી સાધનો સાફ કરો",
    "Caused by Alternaria solani. Dark, concentric spots appear on older leaves first.": "અલ્ટરનેરિયા સોલાનીને કારણે. જૂના પાન પર પહેલાં ઘેરા, સમકેન્દ્રિત ડાઘ દેખાય છે.",
    "Fungal Blight (Early Blight)": "ફૂગ બ્લાઈટ (અર્લી બ્લાઈટ)",
    "Dark brown spots with concentric rings": "સમકેન્દ્રિત વલયો સાથે ઘેરા ભૂરા ડાઘ",
    "Yellowing around spots": "ડાઘની આસપાસ પીળાશ",
    "Leaves drying and dying": "પાન સૂકાવું અને મરવું",
    "Fungus spreading in warm, moist environments.": "ગરમ, ભેજવાળા વાતાવરણમાં ફેલાતી ફૂગ.",
    "Apply protectant fungicides (Chlorothalonil)": "રક્ષણાત્મક ફૂગનાશક (ક્લોરોથેલોનિલ) લગાવો",
    "Apply systemic fungicides": "પ્રણાલીગત ફૂગનાશક લગાવો",
    "Spray early in the season": "મોસમની શરૂઆતમાં છંટકાવ કરો",
    "Remove infected debris": "ચેપગ્રસ્ત અવશેષો દૂર કરો",
    "Use disease-free seed": "રોગ-મુક્ત બીજ વાપરો",
    "Provide adequate fertilization": "પૂરતું ખાતર આપો",
    "Rotate crops with non-solanaceous plants": "બિન-સોલાનેસી છોડ સાથે પાક ફેરબદલી કરો",
    "Microscopic worms that feed on potato roots, causing poor growth and yield loss.": "બટાટાના મૂળ પર ખાનારા સૂક્ષ્મ કીડા, ખરાબ વૃદ્ધિ અને ઉપજ ઘટાડાનું કારણ.",
    "Potato Cyst Nematode": "બટાટા સિસ્ટ નેમેટોડ",
    "Stunted plant growth": "વામન છોડ વૃદ્ધિ",
    "Tiny white/yellow cysts on roots": "મૂળ પર નાના સફેદ/પીળા સિસ્ટ",
    "Infestation of Globodera species in the soil.": "જમીનમાં ગ્લોબોડેરા પ્રજાતિઓનો ચેપ.",
    "Apply nematicides before planting": "વાવણી પહેલાં નેમેટિસાઈડ લગાવો",
    "Use trap crops": "જાળ પાકો વાપરો",
    "Solarize soil": "જમીન સોલરાઈઝ કરો",
    "Fumigate soil in severe cases": "ગંભીર કિસ્સામાં જમીન ધૂમિત કરો",
    "Strict quarantine measures": "કડક ક્વોરન્ટાઈન પગલાં",
    "Long crop rotations (up to 7 years)": "લાંબી પાક ફેરબદલી (7 વર્ષ સુધી)",
    "Clean equipment to prevent soil spread": "જમીન ફેલાવ રોકવા સાધનો સાફ કરો",
    "Insects feeding on potato foliage, which can completely defoliate the plant.": "બટાટાના પાન ખાનારા જીવાત, જે છોડને સંપૂર્ણ પાનવિહીન કરી શકે છે.",
    "Pest Infestation (Colorado Potato Beetle)": "જીવાત ઉપદ્રવ",
    "Holes in leaves": "પાનમાં છિદ્રો",
    "Skeletonized leaves": "પાનનું હાડપિંજર બનવું",
    "Presence of larvae or adult beetles": "લાર્વા અથવા પુખ્ત ભૃંગની હાજરી",
    "Insect pests multiplying rapidly in favorable conditions.": "અનુકૂળ પરિસ્થિતિમાં ઝડપથી વધતા કીટ જીવાત.",
    "Hand-pick beetles and larvae": "ભૃંગો અને લાર્વા હાથથી ચૂંટો",
    "Apply Spinosad or Neem oil": "સ્પિનોસેડ અથવા લીમડાનું તેલ લગાવો",
    "Use specific chemical insecticides": "ચોક્કસ રાસાયણિક જંતુનાશક વાપરો",
    "Apply Bacillus thuringiensis (Bt) for larvae": "લાર્વા માટે બેસિલસ થુરિંગિએન્સિસ (Bt) લગાવો",
    "Use row covers": "હરોળ આવરણ વાપરો",
    "Encourage natural predators": "કુદરતી શિકારીઓને પ્રોત્સાહિત કરો",
    "Plant early to avoid peak pest populations": "ટોચની જીવાત વસ્તી ટાળવા વહેલા વાવો",
    "A devastating disease caused by Phytophthora infestans. Can destroy a crop in days under cool, wet conditions.": "ફાઈટોફ્થોરા ઈન્ફેસ્ટન્સને કારણે વિનાશકારી રોગ. ઠંડી, ભીની પરિસ્થિતિમાં થોડા દિવસોમાં પાક નાશ કરી શકે છે.",
    "Late Blight (Phytophthora)": "લેટ બ્લાઈટ (ફાઈટોફ્થોરા)",
    "Water-soaked, dark green spots on leaves": "પાન પર પાણીથી ભીંજાયેલા, ઘેરા લીલા ડાઘ",
    "White fungal growth on leaf underside": "પાનની નીચે સફેદ ફૂગ વૃદ્ધિ",
    "Brown, rot on tubers": "કંદ પર ભૂરી સડો",
    "Oomycete pathogen thriving in cool, wet weather.": "ઠંડા, ભીના હવામાનમાં ખીલતો ઊમાઈસીટ રોગકારક.",
    "Apply contact fungicides preventatively": "નિવારક સંપર્ક ફૂગનાશક લગાવો",
    "Use systemic fungicides like Metalaxyl": "મેટાલેક્સિલ જેવા પ્રણાલીગત ફૂગનાશક વાપરો",
    "Destroy infected vines before harvest": "લણણી પહેલાં ચેપગ્રસ્ત વેલા નાશ કરો",
    "Harvest in dry conditions": "સૂકી પરિસ્થિતિમાં લણણી કરો",
    "Destroy volunteer potatoes": "સ્વયંસેવી બટાટા નાશ કરો",
    "Ensure good soil drainage": "સારી જમીન જળ નિકાલ સુનિશ્ચિત કરો",
    "Avoid late harvesting": "મોડી લણણી ટાળો",
    "Viral diseases transmitted by aphids, causing mosaic patterns or leaf rolling.": "મોલો દ્વારા ફેલાતા વાયરલ રોગો, મોઝેક પેટર્ન અથવા પાન વળાંકનું કારણ.",
    "Potato Virus (PVY/PLRV)": "બટાટા વાયરસ (PVY/PLRV)",
    "Mottled or mosaic patterns on leaves": "પાન પર મોઝેક અથવા ડાઘવાળી પેટર્ન",
    "Rolling of leaves upward": "પાનનું ઉપર તરફ વળવું",
    "Stunted growth and reduced yield": "વામન વૃદ્ધિ અને ઓછી ઉપજ",
    "Viruses transmitted by aphid vectors or infected seed tubers.": "મોલો વાહકો અથવા ચેપગ્રસ્ત બીજ કંદ દ્વારા ફેલાતા વાયરસ.",
    "No chemical cure for viruses": "વાયરસ માટે કોઈ રાસાયણિક ઈલાજ નથી",
    "Use insecticides to control vectors": "વાહકો નિયંત્રિત કરવા જંતુનાશક વાપરો",
    "Apply mineral oils to reduce transmission": "ફેલાવ ઘટાડવા ખનિજ તેલ લગાવો",
    "Destroy heavily infected crops": "ભારે ચેપગ્રસ્ત પાક નાશ કરો",
    "Use certified virus-free seed": "પ્રમાણિત વાયરસ-મુક્ત બીજ વાપરો",
    "Control aphid populations": "મોલો વસ્તી નિયંત્રિત કરો",
    "Remove (rogue) infected plants early": "ચેપગ્રસ્ત છોડ વહેલા દૂર કરો",
    "Avoid planting near infected fields": "ચેપગ્રસ્ત ખેતર પાસે વાવણી ટાળો",
    "Caused by Xanthomonas campestris. Water-soaked spots appear on leaves, stems, and fruit.": "ઝેન્થોમોનાસ કેમ્પેસ્ટ્રિસને કારણે. પાન, દાંડી અને ફળ પર પાણીથી ભીંજાયેલા ડાઘ દેખાય છે.",
    "Bacterial Spot": "બેક્ટેરિયલ સ્પોટ",
    "Small, dark, water-soaked spots on leaves": "પાન પર નાના, ઘેરા, પાણીથી ભીંજાયેલા ડાઘ",
    "Spots enlarge and turn brown with yellow halo": "ડાઘ મોટા થઈને પીળા હાલો સાથે ભૂરા થાય છે",
    "Leaf drop in severe cases": "ગંભીર કિસ્સામાં પાન ખરવું",
    "Raised scab-like spots on fruit": "ફળ પર ઊભરેલા ખરબચડા ડાઘ",
    "Bacterial infection (Xanthomonas campestris pv. vesicatoria) spread by rain splash and contaminated seeds.": "વરસાદના છાંટા અને દૂષિત બીજથી ફેલાતો બેક્ટેરિયલ ચેપ.",
    "Apply copper-based bactericides": "કોપર-આધારિત બેક્ટેરિસાઈડ લગાવો",
    "Spray Streptomycin if permitted": "પરવાનગી હોય તો સ્ટ્રેપ્ટોમાઈસિન છંટકાવ કરો",
    "Remove heavily infected plants": "ભારે ચેપગ્રસ્ત છોડ દૂર કરો",
    "Improve air circulation around plants": "છોડની આસપાસ હવા પરિભ્રમણ સુધારો",
    "Use certified disease-free seeds": "પ્રમાણિત રોગ-મુક્ત બીજ વાપરો",
    "Practice crop rotation (2-3 years)": "પાક ફેરબદલી (2-3 વર્ષ) કરો",
    "Remove infected plant debris": "ચેપગ્રસ્ત છોડના અવશેષો દૂર કરો",
    "The pepper plant appears healthy with no signs of disease.": "મરચાંનો છોડ સ્વસ્થ દેખાય છે, રોગના કોઈ ચિહ્નો નથી.",
    "No spots or lesions": "કોઈ ડાઘ અથવા ઘા નથી",
    "Normal growth and fruit development": "સામાન્ય વૃદ્ધિ અને ફળ વિકાસ",
    "Caused by Xanthomonas species. Small, dark, water-soaked lesions appear on leaves and fruit.": "ઝેન્થોમોનાસ પ્રજાતિઓને કારણે. પાન અને ફળ પર નાના, ઘેરા, પાણીથી ભીંજાયેલા ઘા.",
    "Small dark spots on leaves": "પાન પર નાના ઘેરા ડાઘ",
    "Spots may have yellow halo": "ડાઘ પર પીળો હાલો હોઈ શકે",
    "Leaf yellowing and drop": "પાન પીળું થઈને ખરવું",
    "Raised scabby spots on fruit": "ફળ પર ઊભરેલા ખરબચડા ડાઘ",
    "Bacterial infection spread by rain splash, overhead irrigation, and contaminated seeds.": "વરસાદના છાંટા, ઉપરથી સિંચાઈ અને દૂષિત બીજથી ફેલાતો બેક્ટેરિયલ ચેપ.",
    "Apply copper-based sprays": "કોપર-આધારિત છંટકાવ લગાવો",
    "Use copper + mancozeb combination": "કોપર + મેન્કોઝેબ મિશ્રણ વાપરો",
    "Avoid working in wet fields": "ભીના ખેતરમાં કામ કરવાથી બચો",
    "Use disease-free seeds and transplants": "રોગ-મુક્ત બીજ અને રોપા વાપરો",
    "Avoid overhead watering": "ઉપરથી સિંચાઈ ટાળો",
    "Rotate crops for 2-3 years": "2-3 વર્ષ પાક ફેરબદલી કરો",
    "Remove crop debris after harvest": "લણણી પછી પાક અવશેષો દૂર કરો",
    "Caused by Alternaria solani. Concentric dark rings (target spots) form on older leaves first.": "Alternaria solani નામની ફૂગને કારણે થાય છે. જૂના પાંદડાઓ પર શરૂઆતમાં ગોળાકાર ઘેરા રિંગ જેવા ડાઘ (ટાર્ગેટ સ્પોટ્સ) જોવા મળે છે.",
    "Early Blight": "અર્લી બ્લાઈટ",
    "Dark concentric ring spots on lower leaves": "નીચલા પાંદડાઓ પર ઘેરા સમકેન્દ્રિત રિંગ જેવા ડાઘ",
    "Yellow area around spots": "ડાઘની આસપાસ પીળો વિસ્તાર",
    "Leaves wither and drop": "પાંદડા કરમાઈ જાય છે અને ખરી પડે છે",
    "Stem lesions possible": "કાંડ પર પણ ડાઘ શક્ય છે",
    "Fungus Alternaria solani thriving in warm, humid conditions with heavy dew.": "ગરમ, ભેજવાળી પરિસ્થિતિઓ અને ભારે ઝાકળમાં Alternaria solani ફૂગનો ઉપદ્રવ વધે છે.",
    "Apply chlorothalonil or mancozeb fungicides": "Chlorothalonil અથવા Mancozeb ફૂગનાશકનો છંટકાવ કરો",
    "Spray copper-based fungicides": "કોપર-આધારિત ફૂગનાશકનો છંટકાવ કરો",
    "Remove infected leaves promptly": "ચેપગ્રસ્ત પાંદડા તાત્કાલિક દૂર કરો",
    "Apply fungicide every 7-10 days in wet weather": "ભીના હવામાનમાં દર 7-10 દિવસે ફૂગનાશકનો છંટકાવ ચાલુ રાખો",
    "Stake plants for air circulation": "હવાના સારા પરિભ્રમણ માટે છોડને ટેકો આપો",
    "Mulch around base": "છોડના થડ આસપાસ મલ્ચિંગ કરો",
    "Water at soil level": "જમીન સ્તરે પાણી આપો (ઉપરથી છંટકાવ ટાળો)",
    "Remove lower infected leaves": "નીચલા ચેપગ્રસ્ત પાન દૂર કરો",
    "Caused by Phytophthora infestans. Can devastate entire crops rapidly in cool, wet conditions.": "ફાઈટોફ્થોરા ઈન્ફેસ્ટન્સને કારણે. ઠંડી, ભીની પરિસ્થિતિમાં આખા પાકને ઝડપથી નાશ કરી શકે છે.",
    "Late Blight": "લેટ બ્લાઈટ",
    "Large, irregularly shaped, water-soaked lesions": "મોટા, અનિયમિત આકારના, પાણીથી ભીંજાયેલા ઘા",
    "White fuzzy mold on leaf undersides": "પાનની નીચે સફેદ રૂંવાટીદાર ફૂગ",
    "Dark brown firm rot on fruit": "ફળ પર ઘેરી ભૂરી સખત સડો",
    "Rapid plant collapse": "છોડનું ઝડપી પતન",
    "Oomycete Phytophthora infestans favored by cool (15-22°C), wet weather.": "ઠંડા (15-22°C), ભીના હવામાનમાં ખીલતો ઊમાઈસીટ ફાઈટોફ્થોરા ઈન્ફેસ્ટન્સ.",
    "Apply systemic fungicides (Metalaxyl)": "પ્રણાલીગત ફૂગનાશક (મેટાલેક્સિલ) લગાવો",
    "Spray preventive copper fungicides": "નિવારક કોપર ફૂગનાશક છંટકાવ કરો",
    "Destroy infected plants immediately": "ચેપગ્રસ્ત છોડ તરત નાશ કરો",
    "Harvest remaining fruit quickly": "બાકીના ફળ ઝડપથી લણો",
    "Destroy volunteer plants": "સ્વયંસેવી છોડ નાશ કરો",
    "Provide good air circulation": "સારું હવા પરિભ્રમણ આપો",
    "Caused by Passalora fulva (Cladosporium fulvum). Mainly affects greenhouse tomatoes.": "પાસાલોરા ફુલ્વા (ક્લેડોસ્પોરિયમ ફુલ્વમ) ને કારણે. મુખ્યત્વે ગ્રીનહાઉસ ટમેટાને અસર કરે છે.",
    "Leaf Mold": "પાન ફૂગ",
    "Pale green to yellow spots on upper leaf surface": "ઉપરના પાનની સપાટી પર આછા લીલાથી પીળા ડાઘ",
    "Olive-green to brown velvety mold on underside": "નીચેની બાજુએ ઓલિવ-લીલાથી ભૂરી મખમલી ફૂગ",
    "Leaves curl and wither": "પાન વળીને સુકાય છે",
    "Reduced fruit set": "ફળ લાગવામાં ઘટાડો",
    "Fungus Passalora fulva thriving in high humidity (>85%) and moderate temperatures.": "ઊંચી ભેજ (>85%) અને મધ્યમ તાપમાનમાં ખીલતી પાસાલોરા ફુલ્વા ફૂગ.",
    "Improve air circulation immediately": "તરત હવા પરિભ્રમણ સુધારો",
    "Apply fungicides (chlorothalonil)": "ફૂગનાશક (ક્લોરોથેલોનિલ) લગાવો",
    "Remove severely affected leaves": "ભારે અસરગ્રસ્ત પાન દૂર કરો",
    "Reduce watering frequency": "સિંચાઈની આવર્તન ઘટાડો",
    "Improve greenhouse ventilation": "ગ્રીનહાઉસ વેન્ટિલેશન સુધારો",
    "Reduce humidity below 85%": "ભેજ 85% થી નીચે રાખો",
    "Space plants adequately": "છોડને પૂરતા અંતરે વાવો",
    "Caused by Septoria lycopersici. Small circular spots with dark borders and gray centers.": "સેપ્ટોરિયા લાઈકોપર્સિસીને કારણે. ઘેરા કિનારા અને ભૂખરા કેન્દ્રો સાથે નાના ગોળ ડાઘ.",
    "Septoria Leaf Spot": "સેપ્ટોરિયા પાન ડાઘ",
    "Numerous small circular spots (1-3mm)": "અસંખ્ય નાના ગોળ ડાઘ (1-3 મિમી)",
    "Dark brown borders with gray/tan centers": "ઘેરા ભૂરા કિનારા અને ભૂખરા/કથ્થાઈ કેન્દ્રો",
    "Tiny black dots (pycnidia) in spot centers": "ડાઘના કેન્દ્રમાં નાના કાળા બિંદુઓ (પિક્નિડિયા)",
    "Lower leaves affected first": "નીચલા પાન પહેલાં અસરગ્રસ્ત",
    "Fungus Septoria lycopersici spread by rain splash and overhead irrigation.": "વરસાદના છાંટા અને ઉપરથી સિંચાઈથી ફેલાતી સેપ્ટોરિયા લાઈકોપર્સિસી ફૂગ.",
    "Apply fungicides (chlorothalonil or copper)": "ફૂગનાશક (ક્લોરોથેલોનિલ અથવા કોપર) લગાવો",
    "Spray at first sign of disease": "રોગના પ્રથમ ચિહ્ને છંટકાવ કરો",
    "Continue treatment every 7-14 days": "દર 7-14 દિવસે ઉપચાર ચાલુ રાખો",
    "Mulch around plants": "છોડની આસપાસ મલ્ચિંગ કરો",
    "Rotate crops for 3 years": "3 વર્ષ પાક ફેરબદલી કરો",
    "Caused by Tetranychus urticae. Tiny mites feed on leaf cells causing stippling and webbing.": "ટેટ્રાનિકસ ઉર્ટિકીને કારણે. સૂક્ષ્મ માઈટ પાનના કોષો ખાય છે જેનાથી ડાઘ અને જાળા બને છે.",
    "Spider Mite Damage": "સ્પાઈડર માઈટ નુકસાન",
    "Fine stippling/speckling on leaves": "પાન પર ઝીણા ડાઘ/છંટકાવ",
    "Yellowing and bronzing of leaves": "પાનનું પીળું અને કાંસ્ય રંગ થવું",
    "Fine webbing on undersides": "નીચેની બાજુએ ઝીણા જાળા",
    "Infestation by two-spotted spider mites, favored by hot, dry conditions.": "ગરમ, સૂકી પરિસ્થિતિમાં બે-ડાઘવાળી સ્પાઈડર માઈટનો ચેપ.",
    "Spray with strong water jet to dislodge mites": "માઈટ દૂર કરવા તેજ પાણીની ધાર મારો",
    "Apply insecticidal soap or neem oil": "જંતુનાશક સાબુ અથવા લીમડાનું તેલ લગાવો",
    "Use miticides (abamectin)": "માઈટિસાઈડ (એબામેક્ટિન) વાપરો",
    "Release predatory mites (Phytoseiulus persimilis)": "શિકારી માઈટ (ફાઈટોસીલસ પર્સિમિલિસ) છોડો",
    "Maintain adequate humidity": "પૂરતી ભેજ જાળવો",
    "Avoid dusty conditions": "ધૂળભરી પરિસ્થિતિ ટાળો",
    "Introduce predatory mites": "શિકારી માઈટ છોડો",
    "Keep plants well-watered": "છોડને સારી રીતે સિંચો",
    "Caused by Corynespora cassiicola. Concentric ring patterns appear on leaves, stems, and fruit.": "કોરિનેસ્પોરા કેસીકોલાને કારણે. પાન, દાંડી અને ફળ પર સમકેન્દ્રિત વલય પેટર્ન દેખાય છે.",
    "Target Spot": "ટાર્ગેટ સ્પોટ",
    "Small brown spots with concentric rings": "સમકેન્દ્રિત વલયો સાથે નાના ભૂરા ડાઘ",
    "Spots enlarge up to 1cm": "ડાઘ 1 સેમી સુધી મોટા થાય",
    "Leaf yellowing around spots": "ડાઘની આસપાસ પાન પીળું થવું",
    "Fruit lesions with sunken centers": "ધંસેલા કેન્દ્રો સાથે ફળ ઘા",
    "Fungus Corynespora cassiicola thriving in warm, humid environments.": "ગરમ, ભેજવાળા વાતાવરણમાં ખીલતી કોરિનેસ્પોરા કેસીકોલા ફૂગ.",
    "Apply fungicides (azoxystrobin or chlorothalonil)": "ફૂગનાશક (એઝોક્સિસ્ટ્રોબિન અથવા ક્લોરોથેલોનિલ) લગાવો",
    "Remove infected leaves": "ચેપગ્રસ્ત પાન દૂર કરો",
    "Spray preventively in wet seasons": "ભીની મોસમમાં નિવારક છંટકાવ કરો",
    "Ensure good plant spacing": "સારું છોડ અંતર સુનિશ્ચિત કરો",
    "Improve air circulation": "હવા પરિભ્રમણ સુધારો",
    "Remove crop debris": "પાક અવશેષો દૂર કરો",
    "A devastating viral disease transmitted by whiteflies (Bemisia tabaci).": "સફેદ માખી (બેમિસિયા ટેબેસી) દ્વારા ફેલાતો વિનાશકારી વાયરલ રોગ.",
    "Yellow Leaf Curl Virus (TYLCV)": "પીળા પાન વળાંક વાયરસ (TYLCV)",
    "Upward curling and cupping of leaves": "પાનનું ઉપર તરફ વળવું અને કપ બનવું",
    "Yellowing of leaf margins": "પાનના કિનારાની પીળાશ",
    "Severe stunting of plant": "છોડની ગંભીર વામનતા",
    "Flower drop and reduced fruit set": "ફૂલ ખરવું અને ફળ ઓછા લાગવા",
    "Tomato Yellow Leaf Curl Virus transmitted by silverleaf whitefly vectors.": "સિલ્વરલીફ સફેદ માખી વાહકો દ્વારા ફેલાતો ટમેટા પીળા પાન વળાંક વાયરસ.",
    "No cure once infected — remove plants": "એકવાર ચેપ લાગે તો કોઈ ઈલાજ નથી — છોડ દૂર કરો",
    "Control whitefly vectors with imidacloprid": "ઈમિડાક્લોપ્રિડથી સફેદ માખી વાહક નિયંત્રિત કરો",
    "Use yellow sticky traps for monitoring": "નિરીક્ષણ માટે પીળી ચીકણી જાળી લગાવો",
    "Apply neem oil to reduce whitefly populations": "સફેદ માખી ઘટાડવા લીમડાનું તેલ લગાવો",
    "Use whitefly-resistant varieties": "સફેદ માખી પ્રતિરોધક જાતો વાપરો",
    "Install insect-proof netting": "જંતુ-રોધક જાળી લગાવો",
    "Control whitefly populations": "સફેદ માખી વસ્તી નિયંત્રિત કરો",
    "Remove infected plants immediately": "ચેપગ્રસ્ત છોડ તરત દૂર કરો",
    "A highly contagious virus that causes mottled patterns and distorted growth.": "ડાઘવાળી પેટર્ન અને વિકૃત વૃદ્ધિનું કારણ બનતો ખૂબ ચેપી વાયરસ.",
    "Tomato Mosaic Virus (ToMV)": "ટમેટા મોઝેક વાયરસ (ToMV)",
    "Light and dark green mosaic patterns on leaves": "પાન પર આછા અને ઘેરા લીલા મોઝેક પેટર્ન",
    "Leaf curling and distortion": "પાનનું વળવું અને વિકૃતિ",
    "Reduced and distorted fruit": "ઓછા અને વિકૃત ફળ",
    "Tomato Mosaic Virus spread mechanically through contaminated tools, hands, and seeds.": "દૂષિત સાધનો, હાથ અને બીજ દ્વારા યાંત્રિક રીતે ફેલાતો ટમેટા મોઝેક વાયરસ.",
    "Disinfect all tools and stakes": "બધા સાધનો અને ટેકા જંતુમુક્ત કરો",
    "Do not smoke near plants (tobacco mosaic cross-infection)": "છોડ પાસે ધૂમ્રપાન ન કરો (તમાકુ મોઝેક ક્રોસ-ચેપ)",
    "Use virus-free seeds": "વાયરસ-મુક્ત બીજ વાપરો",
    "Disinfect tools with 10% bleach solution": "10% બ્લીચ દ્રાવણથી સાધનો જંતુમુક્ત કરો",
    "Wash hands before handling plants": "છોડ સ્પર્શ કરતાં પહેલાં હાથ ધોવો",
    "The tomato plant appears healthy with no signs of disease or pest damage.": "ટમેટાનો છોડ સ્વસ્થ દેખાય છે, રોગ અથવા જીવાત નુકસાનના કોઈ ચિહ્નો નથી.",
    "Vibrant green foliage": "જીવંત લીલા પાન",
    "No spots, lesions, or discoloration": "કોઈ ડાઘ, ઘા અથવા રંગ બદલાવ નથી",
    "Normal fruit development": "સામાન્ય ફળ વિકાસ",
    "Continue regular care": "નિયમિત સંભાળ ચાલુ રાખો",
    "Monitor weekly for changes": "ફેરફારો માટે સાપ્તાહિક નિરીક્ષણ કરો",
    "Maintain consistent watering": "સુસંગત સિંચાઈ જાળવો",
    "Rotate crops regularly": "નિયમિત પાક ફેરબદલી કરો",
    "Monitor for early signs of disease": "રોગના પ્રારંભિક ચિહ્નો માટે નિરીક્ષણ કરો",
    "Maintain balanced nutrition": "સંતુલિત પોષણ જાળવો"
  }
};

const CROP_TRANSLATIONS = {
  'groundnut': { en: 'Groundnut', hi: 'मूंगफली', gu: 'મગફળી' },
  'potato': { en: 'Potato', hi: 'आलू', gu: 'બટાટા' },
  'pepper': { en: 'Pepper', hi: 'मिर्च', gu: 'મરચાં' },
  'tomato': { en: 'Tomato', hi: 'टमाटर', gu: 'ટમેટા' }
};

function getCropDisplayName(crop, lang = 'en') {
  const c = (crop || '').toLowerCase();
  if (CROP_TRANSLATIONS[c]) {
    return CROP_TRANSLATIONS[c][lang] || CROP_TRANSLATIONS[c]['en'];
  }
  return crop ? (crop.charAt(0).toUpperCase() + crop.slice(1)) : 'Groundnut';
}

function normalizeDiseaseKey(diseaseName, crop = '') {
  if (!diseaseName) return 'Healthy';
  const raw = String(diseaseName).trim();
  const rawLower = raw.toLowerCase();
  const cLow = (crop || '').toLowerCase();

  if (rawLower === 'healthy' || rawLower === 'normal' || raw === 'Potato___healthy') {
    if (cLow === 'pepper') return 'Pepper__bell___healthy';
    if (cLow === 'tomato') return 'Tomato_healthy';
    return 'Healthy';
  }

  if (cLow === 'potato') {
    if (raw === 'Early Blight' || raw === 'Early_Blight' || raw === 'Potato___Early_blight' || raw === 'Fungi' || raw === 'Fungal Blight') return 'Fungi';
    if (raw === 'Late Blight' || raw === 'Late_Blight' || raw === 'Potato___Late_blight' || raw === 'Phytopthora' || raw === 'Phytophthora') return 'Phytopthora';
  }

  const aliases = {
    'Leaf_Spot': 'Leaf_Spot_Early_and_Late',
    'Leaf Spot': 'Leaf_Spot_Early_and_Late',
    'Leaf Spot (Early & Late)': 'Leaf_Spot_Early_and_Late',
    'Early Blight': cLow === 'potato' ? 'Fungi' : 'Tomato_Early_blight',
    'Early_Blight': cLow === 'potato' ? 'Fungi' : 'Tomato_Early_blight',
    'Potato___Early_blight': 'Fungi',
    'Late Blight': cLow === 'potato' ? 'Phytopthora' : 'Tomato_Late_blight',
    'Late_Blight': cLow === 'potato' ? 'Phytopthora' : 'Tomato_Late_blight',
    'Potato___Late_blight': 'Phytopthora',
    'Leaf Mold': 'Tomato_Leaf_Mold',
    'Leaf_Mold': 'Tomato_Leaf_Mold',
    'Septoria Leaf Spot': 'Tomato_Septoria_leaf_spot',
    'Septoria_Leaf_Spot': 'Tomato_Septoria_leaf_spot',
    'Spider Mite Damage': 'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Spider Mites': 'Tomato_Spider_mites_Two_spotted_spider_mite',
    'Target Spot': 'Tomato__Target_Spot',
    'Yellow Leaf Curl Virus': 'Tomato__Tomato_YellowLeaf__Curl_Virus',
    'Tomato Mosaic Virus': 'Tomato__Tomato_mosaic_virus',
    'Bacterial Spot': cLow === 'tomato' ? 'Tomato_Bacterial_spot' : 'Pepper__bell___Bacterial_spot',
    'Bacterial Wilt': 'Bacteria',
    'Fungal Blight': 'Fungi',
    'Potato Cyst Nematode': 'Nematode',
    'Pest Infestation': 'Pest',
    'Potato Virus': 'Virus'
  };

  return aliases[raw] || raw;
}

function translateText(text, targetLang = 'en') {
  if (!text || targetLang === 'en') return text;
  const trimmed = String(text).trim();
  if (PHRASE_TRANSLATIONS[targetLang] && PHRASE_TRANSLATIONS[targetLang][trimmed]) {
    return PHRASE_TRANSLATIONS[targetLang][trimmed];
  }
  // Case-insensitive lookup
  if (PHRASE_TRANSLATIONS[targetLang]) {
    const lower = trimmed.toLowerCase();
    for (const [k, v] of Object.entries(PHRASE_TRANSLATIONS[targetLang])) {
      if (k.toLowerCase() === lower) return v;
    }
  }
  return text;
}

function getDiseaseDisplayName(diseaseKey, crop = '', lang = 'en') {
  const key = normalizeDiseaseKey(diseaseKey, crop);
  if (DISEASE_TRANSLATIONS_DATABASE[lang] && DISEASE_TRANSLATIONS_DATABASE[lang][key]) {
    return DISEASE_TRANSLATIONS_DATABASE[lang][key].display_name || DISEASE_TRANSLATIONS_DATABASE[lang][key].disease;
  }
  return translateText(diseaseKey, lang);
}

function localizeReportData(reportData, targetLang = 'en') {
  if (!reportData) return {};

  // 1. Direct translation object attached to report response
  if (reportData.translations && reportData.translations[targetLang]) {
    return { ...reportData.translations[targetLang] };
  }

  // 2. Lookup in client database by key
  const crop = (reportData.crop || 'groundnut').toLowerCase();
  const diseaseKey = reportData.disease_key || reportData.disease || '';
  const normKey = normalizeDiseaseKey(diseaseKey, crop);

  if (DISEASE_TRANSLATIONS_DATABASE[targetLang] && DISEASE_TRANSLATIONS_DATABASE[targetLang][normKey]) {
    const item = DISEASE_TRANSLATIONS_DATABASE[targetLang][normKey];
    return {
      disease: item.display_name || item.disease,
      display_name: item.display_name || item.disease,
      crop_name: getCropDisplayName(crop, targetLang),
      description: item.description || '',
      symptoms: Array.isArray(item.symptoms) ? [...item.symptoms] : [],
      causes: Array.isArray(item.causes) ? [...item.causes] : [],
      treatment: Array.isArray(item.treatment) ? [...item.treatment] : [],
      prevention: Array.isArray(item.prevention) ? [...item.prevention] : []
    };
  }

  // 3. Fallback: dynamic phrase-by-phrase translation of model outputs
  return {
    disease: translateText(reportData.disease, targetLang),
    display_name: translateText(reportData.disease, targetLang),
    crop_name: getCropDisplayName(crop, targetLang),
    description: translateText(reportData.description, targetLang),
    symptoms: Array.isArray(reportData.symptoms) ? reportData.symptoms.map(s => translateText(s, targetLang)) : [],
    causes: Array.isArray(reportData.causes) ? reportData.causes.map(c => translateText(c, targetLang)) : [],
    treatment: Array.isArray(reportData.treatment) ? reportData.treatment.map(t => translateText(t, targetLang)) : [],
    prevention: Array.isArray(reportData.prevention) ? reportData.prevention.map(p => translateText(p, targetLang)) : []
  };
}

// Expose helpers globally
window.DISEASE_TRANSLATIONS_DATABASE = DISEASE_TRANSLATIONS_DATABASE;
window.PHRASE_TRANSLATIONS = PHRASE_TRANSLATIONS;
window.getCropDisplayName = getCropDisplayName;
window.getDiseaseDisplayName = getDiseaseDisplayName;
window.normalizeDiseaseKey = normalizeDiseaseKey;
window.translateText = translateText;
window.localizeReportData = localizeReportData;
