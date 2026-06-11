import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, User, MapPin, ArrowLeft, Home } from 'lucide-react';
import { useWorkerStore, type WorkCategory, type Availability } from '@/store/workerStore';
import { useLanguageStore, t } from '@/store/languageStore';
import { toast } from 'sonner';

const CATEGORIES: WorkCategory[] = [
  "Tailoring / Boutique", "Beauty Parlour", "Home Tutor",
  "Cook", "Cleaning Worker", "Gas Stove Repair",
];

const AVAILABILITY_OPTIONS: Availability[] = ['Morning', 'Afternoon', 'Evening', 'Full Day'];
const AVAILABILITY_HINDI: Record<Availability, string> = {
  'Morning': 'सुबह', 'Afternoon': 'दोपहर', 'Evening': 'शाम', 'Full Day': 'पूरा दिन',
};

const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

const HomeServiceRegistrationPage = () => {
  const navigate = useNavigate();
  const addWorker = useWorkerStore((s) => s.addWorker);
  const lang = useLanguageStore((s) => s.lang);
  const fileRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [village, setVillage] = useState('');
  const [category, setCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [experience, setExperience] = useState('');
  const [about, setAbout] = useState('');
  const [photo, setPhoto] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [serviceCharge, setServiceCharge] = useState('');
  const [availability, setAvailability] = useState<Availability>('Full Day');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [gpsLoading, setGpsLoading] = useState(false);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const getLocation = () => {
    if (!navigator.geolocation) { toast.error('GPS उपलब्ध नहीं'); return; }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); setGpsLoading(false); toast.success('लोकेशन प्राप्त हुई!'); },
      () => { setGpsLoading(false); toast.error('लोकेशन नहीं मिली'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCategoryChange = (val: string) => {
    if (val === '__other__') { setUseCustom(true); setCategory(''); }
    else { setCategory(val); setUseCustom(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = useCustom ? customCategory : category;
    if (!name || !mobile || !village || !finalCategory || !experience || !about) return;
    if (mobile.length !== 10) return;
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { setPinError(t('कृपया 4 अंकों का PIN डालें', lang)); return; }
    if (pin !== confirmPin) { setPinError(t('PIN मेल नहीं खाता', lang)); return; }
    setPinError('');
    setSubmitting(true);
    const ok = await addWorker({
      name, mobile, village, category: finalCategory as WorkCategory,
      experience: parseInt(experience), about, photo,
      serviceCharge: serviceCharge || undefined,
      priceMin: priceMin ? parseInt(priceMin) : undefined,
      priceMax: priceMax ? parseInt(priceMax) : undefined,
      availability, pin, lat, lng,
    });
    setSubmitting(false);
    if (ok) setSuccess(true);
    else toast.error(t('रजिस्ट्रेशन में समस्या हुई', lang));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
          <div className="max-w-lg mx-auto"><h1 className="text-xl font-extrabold flex items-center gap-2"><Home size={22} /> {t('घरेलू सेवाएँ', lang)}</h1></div>
        </div>
        <div className="max-w-lg mx-auto px-4 -mt-4 relative z-10">
          <div className="bg-card rounded-2xl shadow-lg p-8 text-center animate-fade-in">
            <CheckCircle className="mx-auto text-primary mb-4" size={56} />
            <h2 className="text-xl font-bold text-foreground mb-2">{t('रजिस्ट्रेशन सफल!', lang)}</h2>
            <p className="text-sm text-muted-foreground mb-6">{t('आपकी प्रोफ़ाइल अब लाइव है।', lang)}</p>
            <button onClick={() => navigate('/')} className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold">{t('होम पेज', lang)}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate('/business-register')} className="mb-3 flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm hover:bg-primary-foreground/30 transition-colors">
            <ArrowLeft size={16} /> {t('वापस जाएं', lang)}
          </button>
          <h1 className="text-xl font-extrabold flex items-center gap-2"><Home size={22} /> {t('घरेलू सेवाएँ रजिस्ट्रेशन', lang)}</h1>
          <p className="text-primary-foreground/80 text-xs mt-1">{t('दर्जी, ब्यूटी पार्लर, कुक, ट्यूटर आदि', lang)}</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 -mt-4 relative z-10 pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2 bg-card rounded-2xl shadow-lg border border-border p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <label className="text-xs font-bold text-muted-foreground block">{t('प्रोफ़ाइल फोटो (वैकल्पिक)', lang)}</label>
                <button type="button" onClick={() => fileRef.current?.click()} className="w-24 h-24 rounded-2xl bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                  {photo ? <img src={photo} alt="Profile" className="w-full h-full object-cover" /> : <User size={32} className="text-muted-foreground" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </div>
              <div><label className="text-xs font-bold text-muted-foreground mb-1 block">{t('पूरा नाम', lang)} *</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('अपना नाम लिखें', lang)} className={inputClass} required maxLength={100} /></div>
              <div><label className="text-xs font-bold text-muted-foreground mb-1 block">{t('मोबाइल नंबर', lang)} *</label><input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder={t('10 अंकों का मोबाइल नंबर', lang)} className={inputClass} required /></div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">{t('कार्य श्रेणी', lang)} *</label>
                {!useCustom ? (
                  <select value={category} onChange={(e) => handleCategoryChange(e.target.value)} className={inputClass} required={!useCustom}>
                    <option value="">{t('श्रेणी खोजें', lang)}</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    <option value="__other__">--- {t('अन्य (Other)', lang)} ---</option>
                  </select>
                ) : (
                  <>
                    <input type="text" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder={t('अपनी कार्य श्रेणी लिखें', lang)} className={inputClass} required={useCustom} maxLength={50} />
                    <button type="button" onClick={() => { setUseCustom(false); setCustomCategory(''); }} className="text-[10px] text-primary font-bold mt-1">{t('सूची में से चुनें', lang)}</button>
                  </>
                )}
              </div>
              <div><label className="text-xs font-bold text-muted-foreground mb-1 block">{t('गाँव / शहर', lang)} *</label><input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder={t('अपने गाँव का नाम', lang)} className={inputClass} required maxLength={100} /></div>
              <div><label className="text-xs font-bold text-muted-foreground mb-1 block">{t('अनुभव (वर्ष)', lang)} *</label><input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder={t('कितने वर्षों का अनुभव', lang)} className={inputClass} required min={0} max={50} /></div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">{t('सेवा शुल्क (वैकल्पिक)', lang)}</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder={t('न्यूनतम ₹', lang)} className={inputClass} min={0} />
                  <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder={t('अधिकतम ₹', lang)} className={inputClass} min={0} />
                </div>
                <input type="text" value={serviceCharge} onChange={(e) => setServiceCharge(e.target.value)} placeholder={t('जैसे: ₹200/विज़िट', lang)} className={`${inputClass} mt-2`} maxLength={50} />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">{t('उपलब्ध समय', lang)} *</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <button key={opt} type="button" onClick={() => setAvailability(opt)} className={`rounded-xl px-3 py-2 text-sm border transition-colors ${availability === opt ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'}`}>{AVAILABILITY_HINDI[opt]}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">📍 {t('GPS लोकेशन (वैकल्पिक)', lang)}</label>
                <button type="button" onClick={getLocation} disabled={gpsLoading} className="w-full bg-accent text-accent-foreground py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border border-border disabled:opacity-50">
                  <MapPin size={16} /> {gpsLoading ? t('लोकेशन ले रहे हैं...', lang) : lat ? `✅ ${lat.toFixed(4)}, ${lng?.toFixed(4)}` : t('अपनी लोकेशन जोड़ें', lang)}
                </button>
              </div>
              <div><label className="text-xs font-bold text-muted-foreground mb-1 block">{t('अपने बारे में', lang)} *</label><textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder={t('अपने कौशल का संक्षिप्त विवरण', lang)} className={`${inputClass} resize-none h-20`} required maxLength={300} /></div>
              <div className="border-t border-border pt-4">
                <label className="text-xs font-bold text-muted-foreground mb-1 block">🔒 {t('सीक्रेट PIN बनाएं (4 अंक)', lang)} *</label>
                <p className="text-[10px] text-muted-foreground mb-2">{t('प्रोफ़ाइल एडिट/डिलीट करने के लिए PIN ज़रूरी है', lang)}</p>
                <div className="grid grid-cols-2 gap-2">
                  <input type="password" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }} placeholder={t('PIN डालें', lang)} className={inputClass} required maxLength={4} inputMode="numeric" />
                  <input type="password" value={confirmPin} onChange={(e) => { setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }} placeholder={t('PIN दोबारा डालें', lang)} className={inputClass} required maxLength={4} inputMode="numeric" />
                </div>
                {pinError && <p className="text-[11px] text-destructive mt-1">{pinError}</p>}
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold shadow-lg active:scale-[0.97] transition-transform disabled:opacity-60">
                {submitting ? t('रजिस्टर हो रहा है...', lang) : t('रजिस्टर करें', lang)}
              </button>
            </form>
          </div>
          <div className="hidden lg:block space-y-4">
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">🏠 {lang === 'hi' ? 'घरेलू सेवा टिप्स' : 'Home Service Tips'}</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>✅ {lang === 'hi' ? 'सही श्रेणी चुनें' : 'Choose correct category'}</li>
                <li>📍 {lang === 'hi' ? 'GPS लोकेशन जोड़ें' : 'Add GPS location'}</li>
                <li>💰 {lang === 'hi' ? 'प्रति विज़िट शुल्क लिखें' : 'Mention per visit charges'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeServiceRegistrationPage;
