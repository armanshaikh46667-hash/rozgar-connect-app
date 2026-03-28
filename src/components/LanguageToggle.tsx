import { useLanguageStore } from '@/store/languageStore';

const LanguageToggle = () => {
  const { lang, toggle } = useLanguageStore();

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 right-4 z-[900] w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center text-xs font-extrabold active:scale-95 transition-transform border-2 border-primary-foreground/20"
      aria-label="Toggle Language"
    >
      {lang === 'hi' ? 'EN' : 'हि'}
    </button>
  );
};

export default LanguageToggle;
