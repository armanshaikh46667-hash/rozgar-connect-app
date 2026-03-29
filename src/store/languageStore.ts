import { create } from 'zustand';

type Lang = 'hi' | 'en';

interface LanguageStore {
  lang: Lang;
  toggle: () => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  lang: (localStorage.getItem('rozgar_lang') as Lang) || 'hi',
  toggle: () => set((s) => {
    const next = s.lang === 'hi' ? 'en' : 'hi';
    localStorage.setItem('rozgar_lang', next);
    return { lang: next };
  }),
}));

// Translation dictionary
const translations: Record<string, Record<Lang, string>> = {
  'रजिस्टर करें': { hi: 'रजिस्टर करें', en: 'Register' },
  'नक्शा': { hi: 'नक्शा', en: 'Map' },
  'About Us': { hi: 'हमारे बारे में', en: 'About Us' },
  'Admin Panel': { hi: 'एडमिन पैनल', en: 'Admin Panel' },
  'बुकिंग': { hi: 'बुकिंग', en: 'Bookings' },
  'कमाई': { hi: 'कमाई', en: 'Earnings' },
  'मेनू': { hi: 'मेनू', en: 'Menu' },
  'लॉगआउट': { hi: 'लॉगआउट', en: 'Logout' },
  'लॉगिन करें': { hi: 'लॉगिन करें', en: 'Login' },
  'होम पेज': { hi: 'होम पेज', en: 'Home' },
  'काम ढूंढें': { hi: 'काम ढूंढें', en: 'Find Work' },
  'खोज': { hi: 'खोज', en: 'Search' },
  'त्वरित खोज': { hi: 'त्वरित खोज', en: 'Quick Search' },
  'काम के प्रकार': { hi: 'काम के प्रकार', en: 'Work Types' },
  'गाँव / शहर': { hi: 'गाँव / शहर', en: 'Village / City' },
  'GPS नज़दीक': { hi: 'GPS नज़दीक', en: 'Nearby GPS' },
  'लोकप्रिय सेवाएँ': { hi: 'लोकप्रिय सेवाएँ', en: 'Popular Services' },
  'सभी देखें': { hi: 'सभी देखें', en: 'View All' },
  'सभी श्रेणियाँ': { hi: 'सभी श्रेणियाँ', en: 'All Categories' },
  'क्या आप कामगार हैं?': { hi: 'क्या आप कामगार हैं?', en: 'Are you a worker?' },
  'मुफ्त में रजिस्टर करें और स्थानीय काम पाएं': { hi: 'मुफ्त में रजिस्टर करें और स्थानीय काम पाएं', en: 'Register for free and find local work' },
  'अभी रजिस्टर करें': { hi: 'अभी रजिस्टर करें', en: 'Register Now' },
  'हम पर भरोसा करें': { hi: 'हम पर भरोसा करें', en: 'Trust Us' },
  'ऐप शेयर करें': { hi: 'ऐप शेयर करें', en: 'Share App' },
  'श्रेणियाँ': { hi: 'श्रेणियाँ', en: 'Categories' },
  'कामगार': { hi: 'कामगार', en: 'Workers' },
  'उपयोग': { hi: 'उपयोग', en: 'Usage' },
  'मुफ्त': { hi: 'मुफ्त', en: 'Free' },
  'नज़दीकी सेवाएँ': { hi: 'नज़दीकी सेवाएँ', en: 'Nearby Services' },
  'सभी': { hi: 'सभी', en: 'All' },
  'दुकान': { hi: 'दुकान', en: 'Shop' },
  'डिजिटल': { hi: 'डिजिटल', en: 'Digital' },
  'कोचिंग': { hi: 'कोचिंग', en: 'Coaching' },
  'कॉल': { hi: 'कॉल', en: 'Call' },
  'रास्ता': { hi: 'रास्ता', en: 'Route' },
  'प्रोफ़ाइल देखें': { hi: 'प्रोफ़ाइल देखें', en: 'View Profile' },
  'रजिस्ट्रेशन': { hi: 'रजिस्ट्रेशन', en: 'Registration' },
  'सेवाएँ': { hi: 'सेवाएँ', en: 'Services' },
  'लोकेशन ले रहे हैं...': { hi: 'लोकेशन ले रहे हैं...', en: 'Getting location...' },
  'अपनी लोकेशन जोड़ें': { hi: 'अपनी लोकेशन जोड़ें', en: 'Add your location' },
};

export const t = (key: string, lang: Lang): string => {
  return translations[key]?.[lang] || key;
};
