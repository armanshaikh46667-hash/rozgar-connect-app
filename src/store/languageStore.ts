import { create } from 'zustand';

export type Lang = 'hi' | 'en';

interface LanguageStore {
  lang: Lang;
  toggle: () => void;
  setLang: (l: Lang) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  lang: ((typeof localStorage !== 'undefined' && localStorage.getItem('rozgar_lang')) as Lang) || 'hi',
  toggle: () => set((s) => {
    const next: Lang = s.lang === 'hi' ? 'en' : 'hi';
    try { localStorage.setItem('rozgar_lang', next); } catch {}
    return { lang: next };
  }),
  setLang: (l) => {
    try { localStorage.setItem('rozgar_lang', l); } catch {}
    set({ lang: l });
  },
}));

/* ============================================================
   Master bilingual dictionary
   key = canonical Hindi (or English) form, value = both langs
   ============================================================ */
const dict: Record<string, { hi: string; en: string }> = {
  // ---- Header / Nav ----
  'रजिस्टर करें': { hi: 'रजिस्टर करें', en: 'Register' },
  'Register': { hi: 'रजिस्टर', en: 'Register' },
  'Login': { hi: 'लॉगिन', en: 'Login' },
  'लॉगिन करें': { hi: 'लॉगिन करें', en: 'Login' },
  'लॉगआउट': { hi: 'लॉगआउट', en: 'Logout' },
  'प्रोफ़ाइल': { hi: 'प्रोफ़ाइल', en: 'Profile' },
  'About Us': { hi: 'हमारे बारे में', en: 'About Us' },
  'Admin Panel': { hi: 'एडमिन पैनल', en: 'Admin Panel' },
  'बुकिंग': { hi: 'बुकिंग', en: 'Bookings' },
  'कमाई': { hi: 'कमाई', en: 'Earnings' },
  'मेनू': { hi: 'मेनू', en: 'Menu' },
  'होम पेज': { hi: 'होम पेज', en: 'Home' },
  'काम ढूंढें': { hi: 'काम ढूंढें', en: 'Find Work' },
  'खोज': { hi: 'खोज', en: 'Search' },
  'खोजें': { hi: 'खोजें', en: 'Search' },
  'Search...': { hi: 'खोजें...', en: 'Search...' },
  'त्वरित खोज': { hi: 'त्वरित खोज', en: 'Quick Search' },
  'काम के प्रकार': { hi: 'काम के प्रकार', en: 'Work Types' },
  'गाँव / शहर': { hi: 'गाँव / शहर', en: 'Village / City' },
  'GPS नज़दीक': { hi: 'GPS नज़दीक', en: 'GPS Nearby' },
  'GPS Active': { hi: 'GPS चालू', en: 'GPS Active' },
  'लोकप्रिय सेवाएँ': { hi: 'लोकप्रिय सेवाएँ', en: 'Popular Services' },
  'सभी देखें': { hi: 'सभी देखें', en: 'View All' },
  'सभी श्रेणियाँ': { hi: 'सभी श्रेणियाँ', en: 'All Categories' },

  // ---- Home / CTA ----
  'क्या आप कामगार हैं?': { hi: 'क्या आप कामगार हैं?', en: 'Are you a worker?' },
  'मुफ्त में रजिस्टर करें और स्थानीय काम पाएं': { hi: 'मुफ्त में रजिस्टर करें और स्थानीय काम पाएं', en: 'Register for free and find local work' },
  'अभी रजिस्टर करें': { hi: 'अभी रजिस्टर करें', en: 'Register Now' },
  'हम पर भरोसा करें': { hi: 'हम पर भरोसा करें', en: 'Trust Us' },
  'ऐप शेयर करें': { hi: 'ऐप शेयर करें', en: 'Share App' },
  'श्रेणियाँ': { hi: 'श्रेणियाँ', en: 'Categories' },
  'कामगार': { hi: 'कामगार', en: 'Workers' },
  'उपयोग': { hi: 'उपयोग', en: 'Usage' },
  'मुफ्त': { hi: 'मुफ्त', en: 'Free' },
  'Verified': { hi: 'सत्यापित', en: 'Verified' },
  'सत्यापित कामगार': { hi: 'सत्यापित कामगार', en: 'Verified Workers' },
  '100% मुफ्त': { hi: '100% मुफ्त', en: '100% Free' },
  'कोई शुल्क नहीं': { hi: 'कोई शुल्क नहीं', en: 'No Charges' },
  'No Middleman': { hi: 'कोई बिचौलिया नहीं', en: 'No Middleman' },
  'सीधा संपर्क': { hi: 'सीधा संपर्क', en: 'Direct Contact' },
  'गांव में रोजगार पाएं – Rozgar Sewa के साथ': {
    hi: 'गांव में रोजगार पाएं – Rozgar Sewa के साथ',
    en: 'Find work in your village – with Rozgar Sewa',
  },
  'मजदूर और काम देने वाले अब सीधे जुड़ें': {
    hi: 'मजदूर और काम देने वाले अब सीधे जुड़ें',
    en: 'Workers and employers now connect directly',
  },
  'Contact': { hi: 'संपर्क', en: 'Contact' },
  'Privacy Policy': { hi: 'गोपनीयता नीति', en: 'Privacy Policy' },
  '© 2025 RozgarSewa. Made with ❤️ for rural India.': {
    hi: '© 2025 RozgarSewa. ग्रामीण भारत के लिए ❤️ से बनाया गया।',
    en: '© 2025 RozgarSewa. Made with ❤️ for rural India.',
  },

  // ---- Search Page ----
  'कामगार खोजें': { hi: 'कामगार खोजें', en: 'Find Workers' },
  'अपने आस-पास कुशल कामगार खोजें': { hi: 'अपने आस-पास कुशल कामगार खोजें', en: 'Find skilled workers near you' },
  'गाँव से खोजें...': { hi: 'गाँव से खोजें...', en: 'Search by village...' },
  'नाम से खोजें...': { hi: 'नाम से खोजें...', en: 'Search by name...' },
  'अधिक फ़िल्टर': { hi: 'अधिक फ़िल्टर', en: 'More Filters' },
  'फ़िल्टर बंद करें': { hi: 'फ़िल्टर बंद करें', en: 'Close Filters' },
  'कोई परिणाम नहीं मिला': { hi: 'कोई परिणाम नहीं मिला', en: 'No results found' },
  'अलग फ़िल्टर आज़माएं या खोज बदलें': { hi: 'अलग फ़िल्टर आज़माएं या खोज बदलें', en: 'Try different filters or change search' },
  'दुकानें, डिजिटल सेवाएँ, शिक्षा': { hi: 'दुकानें, डिजिटल सेवाएँ, शिक्षा', en: 'Shops, Digital Services, Education' },
  'सेवा प्रदाता': { hi: 'सेवा प्रदाता', en: 'Service Providers' },
  'न्यूनतम अनुभव (वर्ष)': { hi: 'न्यूनतम अनुभव (वर्ष)', en: 'Min Experience (Years)' },
  'न्यूनतम रेटिंग': { hi: 'न्यूनतम रेटिंग', en: 'Min Rating' },
  'सभी': { hi: 'सभी', en: 'All' },
  '1+ वर्ष': { hi: '1+ वर्ष', en: '1+ Year' },
  '3+ वर्ष': { hi: '3+ वर्ष', en: '3+ Years' },
  '5+ वर्ष': { hi: '5+ वर्ष', en: '5+ Years' },
  '10+ वर्ष': { hi: '10+ वर्ष', en: '10+ Years' },
  'Reset': { hi: 'रीसेट', en: 'Reset' },
  'km दूर': { hi: 'km दूर', en: 'km away' },
  'दूर': { hi: 'दूर', en: 'away' },

  // ---- Statuses ----
  '🟢 Available': { hi: '🟢 उपलब्ध', en: '🟢 Available' },
  '🟡 Busy': { hi: '🟡 व्यस्त', en: '🟡 Busy' },
  '🔴 Offline': { hi: '🔴 ऑफलाइन', en: '🔴 Offline' },
  'available': { hi: 'उपलब्ध', en: 'Available' },
  'busy': { hi: 'व्यस्त', en: 'Busy' },
  'offline': { hi: 'ऑफलाइन', en: 'Offline' },

  // ---- Availability ----
  'Morning': { hi: 'सुबह', en: 'Morning' },
  'Afternoon': { hi: 'दोपहर', en: 'Afternoon' },
  'Evening': { hi: 'शाम', en: 'Evening' },
  'Full Day': { hi: 'पूरा दिन', en: 'Full Day' },
  'सुबह': { hi: 'सुबह', en: 'Morning' },
  'दोपहर': { hi: 'दोपहर', en: 'Afternoon' },
  'शाम': { hi: 'शाम', en: 'Evening' },
  'पूरा दिन': { hi: 'पूरा दिन', en: 'Full Day' },

  // ---- Business labels ----
  'दुकान': { hi: 'दुकान', en: 'Shop' },
  'डिजिटल': { hi: 'डिजिटल', en: 'Digital' },
  'डिजिटल सेवा': { hi: 'डिजिटल सेवा', en: 'Digital Service' },
  'दुकान सेवा': { hi: 'दुकान', en: 'Shop' },
  'शिक्षा': { hi: 'शिक्षा', en: 'Education' },
  'कोचिंग': { hi: 'कोचिंग', en: 'Coaching' },

  // ---- Common labels / location ----
  'गाँव': { hi: 'गाँव', en: 'Village' },
  'शहर': { hi: 'शहर', en: 'City' },
  'स्थान': { hi: 'स्थान', en: 'Location' },
  'नाम': { hi: 'नाम', en: 'Name' },
  'मोबाइल नंबर': { hi: 'मोबाइल नंबर', en: 'Mobile Number' },
  'कार्य श्रेणी': { hi: 'कार्य श्रेणी', en: 'Work Category' },
  'श्रेणी': { hi: 'श्रेणी', en: 'Category' },
  'श्रेणी चुनें': { hi: 'श्रेणी चुनें', en: 'Select Category' },
  'श्रेणी खोजें': { hi: 'श्रेणी खोजें', en: 'Search Category' },
  'सबमिट': { hi: 'सबमिट', en: 'Submit' },
  'सेव करें': { hi: 'सेव करें', en: 'Save' },
  'सेव हो रहा...': { hi: 'सेव हो रहा...', en: 'Saving...' },
  'रद्द करें': { hi: 'रद्द करें', en: 'Cancel' },

  // ---- Registration / Forms ----
  'कामगार रजिस्ट्रेशन': { hi: 'कामगार रजिस्ट्रेशन', en: 'Worker Registration' },
  'कामगार के रूप में रजिस्टर करें': { hi: 'कामगार के रूप में रजिस्टर करें', en: 'Register as a worker' },
  'प्रोफ़ाइल फोटो (वैकल्पिक)': { hi: 'प्रोफ़ाइल फोटो (वैकल्पिक)', en: 'Profile Photo (Optional)' },
  'पूरा नाम': { hi: 'पूरा नाम', en: 'Full Name' },
  'अपना नाम लिखें': { hi: 'अपना नाम लिखें', en: 'Enter your name' },
  '10 अंकों का मोबाइल नंबर': { hi: '10 अंकों का मोबाइल नंबर', en: '10-digit mobile number' },
  'अपनी श्रेणी लिखें': { hi: '+ अपनी श्रेणी लिखें (Custom)', en: '+ Write your category (Custom)' },
  'सूची में से चुनें': { hi: '← सूची में से चुनें', en: '← Select from list' },
  'अपनी कार्य श्रेणी लिखें': { hi: 'अपनी कार्य श्रेणी लिखें', en: 'Write your work category' },
  'अपने गाँव का नाम': { hi: 'अपने गाँव का नाम', en: 'Your village name' },
  'अनुभव (वर्ष)': { hi: 'अनुभव (वर्ष)', en: 'Experience (Years)' },
  'कितने वर्षों का अनुभव': { hi: 'कितने वर्षों का अनुभव', en: 'Years of experience' },
  'सेवा शुल्क रेंज (₹) — वैकल्पिक': { hi: 'सेवा शुल्क रेंज (₹) — वैकल्पिक', en: 'Service Charge Range (₹) — Optional' },
  'न्यूनतम ₹': { hi: 'न्यूनतम ₹', en: 'Min ₹' },
  'अधिकतम ₹': { hi: 'अधिकतम ₹', en: 'Max ₹' },
  'या टेक्स्ट में लिखें:': { hi: 'या टेक्स्ट में लिखें:', en: 'Or write in text:' },
  'जैसे: ₹300/दिन': { hi: 'जैसे: ₹300/दिन', en: 'e.g. ₹300/day' },
  'उपलब्ध समय': { hi: 'उपलब्ध समय', en: 'Available Time' },
  'GPS लोकेशन (वैकल्पिक)': { hi: '📍 GPS लोकेशन (वैकल्पिक)', en: '📍 GPS Location (Optional)' },
  'अपने बारे में': { hi: 'अपने बारे में', en: 'About Yourself' },
  'अपने कौशल का संक्षिप्त विवरण': { hi: 'अपने कौशल का संक्षिप्त विवरण', en: 'Brief description of your skills' },
  'सीक्रेट PIN बनाएं (4 अंक)': { hi: '🔒 सीक्रेट PIN बनाएं (4 अंक)', en: '🔒 Create Secret PIN (4 digits)' },
  'प्रोफ़ाइल एडिट/डिलीट करने के लिए PIN ज़रूरी है': { hi: 'प्रोफ़ाइल एडिट/डिलीट करने के लिए PIN ज़रूरी है', en: 'PIN is required to edit/delete profile' },
  'PIN डालें': { hi: 'PIN डालें', en: 'Enter PIN' },
  'PIN दोबारा डालें': { hi: 'PIN दोबारा डालें', en: 'Confirm PIN' },
  'रजिस्टर हो रहा है...': { hi: 'रजिस्टर हो रहा है...', en: 'Registering...' },
  'रजिस्ट्रेशन सफल!': { hi: 'रजिस्ट्रेशन सफल!', en: 'Registration Successful!' },
  'आपकी प्रोफ़ाइल अब लाइव है।': { hi: 'आपकी प्रोफ़ाइल अब लाइव है।', en: 'Your profile is now live.' },
  'कामगार देखें': { hi: 'कामगार देखें', en: 'View Workers' },
  'कृपया 4 अंकों का PIN डालें': { hi: 'कृपया 4 अंकों का PIN डालें', en: 'Please enter a 4-digit PIN' },
  'PIN मेल नहीं खाता': { hi: 'PIN मेल नहीं खाता', en: 'PINs do not match' },
  'रजिस्ट्रेशन में समस्या हुई': { hi: 'रजिस्ट्रेशन में समस्या हुई', en: 'Registration failed' },
  'अन्य (Other)': { hi: 'अन्य', en: 'Other' },
  'रजिस्ट्रेशन': { hi: 'रजिस्ट्रेशन', en: 'Registration' },
  'पंजीकरण': { hi: 'पंजीकरण', en: 'Registration' },
  'अपनी सेवा या व्यापार रजिस्टर करें': { hi: 'अपनी सेवा या व्यापार रजिस्टर करें', en: 'Register your service or business' },
  'सेवाएँ': { hi: 'सेवाएँ', en: 'Services' },
  'लोकेशन ले रहे हैं...': { hi: 'लोकेशन ले रहे हैं...', en: 'Getting location...' },
  'अपनी लोकेशन जोड़ें': { hi: 'अपनी लोकेशन जोड़ें', en: 'Add your location' },
  'लोकेशन नहीं मिली': { hi: 'लोकेशन नहीं मिली', en: 'Location not found' },
  'लिंक कॉपी हो गई!': { hi: 'लिंक कॉपी हो गई!', en: 'Link copied!' },
  'लिंक कॉपी हो गया!': { hi: 'लिंक कॉपी हो गया!', en: 'Link copied!' },
  'वापस': { hi: 'वापस', en: 'Back' },
  'प्रोफ़ाइल देखें': { hi: 'प्रोफ़ाइल देखें', en: 'View Profile' },
  'नज़दीकी सेवाएँ': { hi: 'नज़दीकी सेवाएँ', en: 'Nearby Services' },
  'कॉल': { hi: 'कॉल', en: 'Call' },
  'रास्ता': { hi: 'रास्ता', en: 'Route' },

  // ---- Booking page ----
  'बुकिंग इतिहास': { hi: 'बुकिंग इतिहास', en: 'Booking History' },
  'अपनी पिछली बुकिंग देखें': { hi: 'अपनी पिछली बुकिंग देखें', en: 'View your past bookings' },
  'ग्राहक': { hi: 'ग्राहक', en: 'Customer' },
  'बुकिंग देखें': { hi: 'बुकिंग देखें', en: 'View Bookings' },
  'कोई बुकिंग नहीं मिली': { hi: 'कोई बुकिंग नहीं मिली', en: 'No bookings found' },
  'कॉल करें': { hi: 'कॉल करें', en: 'Call' },
  'नंबर बदलें': { hi: 'नंबर बदलें', en: 'Change Number' },
  'ग्राहक के रूप में देखें': { hi: 'ग्राहक के रूप में देखें', en: 'View as Customer' },
  'कामगार के रूप में देखें': { hi: 'कामगार के रूप में देखें', en: 'View as Worker' },
  'स्वीकार करें': { hi: 'स्वीकार करें', en: 'Accept' },
  'अस्वीकार करें': { hi: 'अस्वीकार करें', en: 'Reject' },
  'स्वीकृत': { hi: 'स्वीकृत', en: 'Accepted' },
  'अस्वीकृत': { hi: 'अस्वीकृत', en: 'Rejected' },
  'बुकिंग सारांश': { hi: 'बुकिंग सारांश', en: 'Booking Summary' },
  'सहायता': { hi: 'सहायता', en: 'Help' },
  'कुल बुकिंग': { hi: 'कुल बुकिंग', en: 'Total Bookings' },
  'पूर्ण': { hi: 'पूर्ण', en: 'Done' },
  'लंबित': { hi: 'लंबित', en: 'Pending' },
  'रद्द': { hi: 'रद्द', en: 'Cancelled' },
  'कुल': { hi: 'कुल', en: 'Total' },
  'कुल काम': { hi: 'कुल काम', en: 'Total Jobs' },

  // ---- Earnings ----
  'कमाई डैशबोर्ड': { hi: 'कमाई डैशबोर्ड', en: 'Earnings Dashboard' },
  'अपनी बुकिंग और काम का विवरण देखें': { hi: 'अपनी बुकिंग और काम का विवरण देखें', en: 'View your booking and work details' },
  'अपना मोबाइल नंबर डालें': { hi: '📱 अपना मोबाइल नंबर डालें', en: '📱 Enter your mobile number' },
  'डैशबोर्ड देखें': { hi: 'डैशबोर्ड देखें', en: 'View Dashboard' },
  'खोज रहे हैं...': { hi: 'खोज रहे हैं...', en: 'Searching...' },
  'आज के काम': { hi: 'आज के काम', en: 'Today\'s Jobs' },
  'इस महीने': { hi: 'इस महीने', en: 'This Month' },
  'इस साल': { hi: 'इस साल', en: 'This Year' },
  'कमाई बढ़ाने के टिप्स': { hi: 'कमाई बढ़ाने के टिप्स', en: 'Tips to Earn More' },
  'जानकारी': { hi: 'जानकारी', en: 'Info' },
  'प्रोफ़ाइल अपडेट रखें': { hi: 'प्रोफ़ाइल अपडेट रखें', en: 'Keep profile updated' },
  'अच्छी सेवा से रेटिंग बढ़ाएं': { hi: 'अच्छी सेवा से रेटिंग बढ़ाएं', en: 'Improve rating with good service' },
  'समय पर कॉल उठाएं': { hi: 'समय पर कॉल उठाएं', en: 'Answer calls on time' },
  'GPS लोकेशन अपडेट रखें': { hi: 'GPS लोकेशन अपडेट रखें', en: 'Keep GPS location updated' },

  // ---- Login ----
  'अपने अकाउंट में लॉगिन करें': { hi: 'अपने अकाउंट में लॉगिन करें', en: 'Login to your account' },
  'लॉगिन': { hi: 'लॉगिन', en: 'Login' },
  'रजिस्टर्ड मोबाइल नंबर और Secret PIN डालें': { hi: 'रजिस्टर्ड मोबाइल नंबर और Secret PIN डालें', en: 'Enter registered mobile number and Secret PIN' },
  'Secret PIN': { hi: 'सीक्रेट PIN', en: 'Secret PIN' },
  '4 अंकों का PIN': { hi: '4 अंकों का PIN', en: '4-digit PIN' },
  'लॉगिन हो रहा है...': { hi: 'लॉगिन हो रहा है...', en: 'Logging in...' },
  'अकाउंट नहीं है?': { hi: 'अकाउंट नहीं है?', en: 'No account?' },
  '10 अंकों का मोबाइल नंबर डालें': { hi: '10 अंकों का मोबाइल नंबर डालें', en: 'Enter 10-digit mobile number' },
  '4 अंकों का PIN डालें': { hi: '4 अंकों का PIN डालें', en: 'Enter 4-digit PIN' },
  'लॉगिन विफल': { hi: 'लॉगिन विफल', en: 'Login failed' },

  // ---- Categories (work types) ----
  'Plumber': { hi: 'प्लंबर', en: 'Plumber' },
  'Electrician': { hi: 'इलेक्ट्रीशियन', en: 'Electrician' },
  'Rajmistri': { hi: 'राजमिस्त्री', en: 'Mason' },
  'Painter': { hi: 'पेंटर', en: 'Painter' },
  'Carpenter': { hi: 'कारपेंटर', en: 'Carpenter' },
  'Mobile Repair': { hi: 'मोबाइल रिपेयर', en: 'Mobile Repair' },
  'Bike Mechanic': { hi: 'बाइक मैकेनिक', en: 'Bike Mechanic' },
  'Domestic Worker': { hi: 'घरेलू सहायक', en: 'Domestic Worker' },
  'Computer Class': { hi: 'कंप्यूटर क्लास', en: 'Computer Class' },
  'Competitive Exam Coaching': { hi: 'प्रतियोगी परीक्षा कोचिंग', en: 'Competitive Exam Coaching' },
  'Driving School': { hi: 'ड्राइविंग स्कूल', en: 'Driving School' },
  'Skill Training': { hi: 'कौशल प्रशिक्षण', en: 'Skill Training' },
  'Online Form Filling': { hi: 'ऑनलाइन फॉर्म भरना', en: 'Online Form Filling' },
  'Aadhaar Update': { hi: 'आधार अपडेट', en: 'Aadhaar Update' },
  'PAN Card Apply': { hi: 'PAN कार्ड आवेदन', en: 'PAN Card Apply' },
  'Electricity Bill Payment': { hi: 'बिजली बिल भुगतान', en: 'Electricity Bill Payment' },
  'Government Scheme Registration': { hi: 'सरकारी योजना पंजीकरण', en: 'Government Scheme Registration' },
  'Tailoring / Boutique': { hi: 'सिलाई / बुटीक', en: 'Tailoring / Boutique' },
  'Beauty Parlour': { hi: 'ब्यूटी पार्लर', en: 'Beauty Parlour' },
  'Home Tutor': { hi: 'होम ट्यूटर', en: 'Home Tutor' },
  'Cook': { hi: 'रसोइया', en: 'Cook' },
  'Cleaning Worker': { hi: 'सफाई कर्मचारी', en: 'Cleaning Worker' },
  'Gas Stove Repair': { hi: 'गैस चूल्हा रिपेयर', en: 'Gas Stove Repair' },
  'Tractor Mechanic': { hi: 'ट्रैक्टर मैकेनिक', en: 'Tractor Mechanic' },
  'JCB Operator': { hi: 'JCB ऑपरेटर', en: 'JCB Operator' },
  'Truck Driver': { hi: 'ट्रक ड्राइवर', en: 'Truck Driver' },
  'Auto Driver': { hi: 'ऑटो ड्राइवर', en: 'Auto Driver' },
  'Tempo Service': { hi: 'टेम्पो सेवा', en: 'Tempo Service' },
  'Pickup Rental': { hi: 'पिकअप किराया', en: 'Pickup Rental' },
  'General Labor': { hi: 'मज़दूर', en: 'General Labor' },
  'Tiles Worker': { hi: 'टाइल्स कारीगर', en: 'Tiles Worker' },
  'Welding Worker': { hi: 'वेल्डिंग कारीगर', en: 'Welding Worker' },
  'Iron Work': { hi: 'लोहे का काम', en: 'Iron Work' },
  'Roof Casting Worker': { hi: 'छत ढलाई कारीगर', en: 'Roof Casting Worker' },
  'Water Tank Installation': { hi: 'पानी की टंकी इंस्टॉलेशन', en: 'Water Tank Installation' },
  'Tractor Driver': { hi: 'ट्रैक्टर चालक', en: 'Tractor Driver' },
  'Harvester / Thresher Service': { hi: 'हार्वेस्टर / थ्रेशर सेवा', en: 'Harvester / Thresher Service' },
  'Field Ploughing Service': { hi: 'खेत जुताई सेवा', en: 'Field Ploughing Service' },
  'Pesticide Spraying Service': { hi: 'कीटनाशक छिड़काव सेवा', en: 'Pesticide Spraying Service' },
  'Dairy Worker': { hi: 'डेयरी कर्मचारी', en: 'Dairy Worker' },
  'Animal Doctor': { hi: 'पशु डॉक्टर', en: 'Animal Doctor' },
  'Animal Feed Supplier': { hi: 'पशु आहार आपूर्तिकर्ता', en: 'Animal Feed Supplier' },

  // ---- Category groups ----
  'मूल सेवाएँ (Core Services)': { hi: 'मूल सेवाएँ', en: 'Core Services' },
  'शिक्षा और प्रशिक्षण (Education & Training)': { hi: 'शिक्षा और प्रशिक्षण', en: 'Education & Training' },
  'डिजिटल सेवाएँ (Digital Services)': { hi: 'डिजिटल सेवाएँ', en: 'Digital Services' },
  'घरेलू सेवाएँ (Home & Personal Services)': { hi: 'घरेलू सेवाएँ', en: 'Home & Personal Services' },
  'वाहन सेवाएँ (Vehicle & Machine Services)': { hi: 'वाहन सेवाएँ', en: 'Vehicle & Machine Services' },
  'निर्माण और श्रम (Construction & Labor)': { hi: 'निर्माण और श्रम', en: 'Construction & Labor' },
  'कृषि सेवाएँ (Agriculture Services)': { hi: 'कृषि सेवाएँ', en: 'Agriculture Services' },
};

// Build reverse lookup (English -> entry) so calling t('Plumber','hi') returns 'प्लंबर'
const reverse: Record<string, { hi: string; en: string }> = {};
Object.values(dict).forEach((v) => {
  if (!reverse[v.en]) reverse[v.en] = v;
  if (!reverse[v.hi]) reverse[v.hi] = v;
});

export const t = (key: string | undefined | null, lang: Lang): string => {
  if (!key) return '';
  const entry = dict[key] || reverse[key];
  if (entry) return entry[lang];
  return key; // fallback: return as-is
};

// Specialized helpers (just call t under the hood — kept for clarity)
export const tCategory = (cat: string | undefined | null, lang: Lang) => t(cat, lang);
export const tStatus = (s: string | undefined | null, lang: Lang) => t(s, lang);

// Hook for reactive use inside components
export const useT = () => {
  const lang = useLanguageStore((s) => s.lang);
  return (key: string | undefined | null) => t(key, lang);
};
