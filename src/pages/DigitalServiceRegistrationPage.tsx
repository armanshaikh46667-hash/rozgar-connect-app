import { useState, useRef } from 'react';
import { Monitor, ArrowLeft, CheckCircle, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguageStore, t } from '@/store/languageStore';
import { toast } from 'sonner';

const DIGITAL_SERVICES = [
  'Aadhaar Update', 'PAN Card Apply', 'Online Form Filling',
  'Bill Payment', 'Passport Apply', 'Voter ID', 'Driving License',
  'Mobile Recharge', 'Insurance', 'Electricity Bill Payment',
  'Government Scheme Registration',
];

const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

const DigitalServiceRegistrationPage = () => {
  const navigate = useNavigate();
  const lang = useLanguageStore((s) => s.lang);
  const fileRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [customService, setCustomService] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('');
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

  const handleServiceChange = (val: string) => {
    if (val === '__other__') { setUseCustom(true); setServiceType(''); }
    else { setServiceType(val); setUseCustom(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalService = useCustom ? customService : serviceType;
    if (!name || !mobile || !finalService || !village) return;
    if (mobile.length !== 10) { toast.error(t('10 अंकों का मोबाइल नंबर डालें', lang)); return; }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { setPinError(t('कृपया 4 अंकों का PIN डालें', lang)); return; }
    if (pin !== confirmPin) { setPinError(t('PIN मेल नहीं खाता', lang)); return; }
    setPinError('');
    setSubmitting(true);
    const { error } = await supabase.from('digital_services').insert({
      owner_name: name, shop_name: name, mobile,
      service_type: finalService, village, address: address || null,
      description: description || null, photo: photo || null,
      lat: lat || null, lng: lng || null, pin,
    });
    setSubmitting(false);
    if (error) { toast.error(t('कुछ गलत हो गया, दोबारा कोशिश करें', lang)); return; }
    setSuccess(true);
    toast.success(t('डिजिटल सेवा सफलतापूर्वक रजिस्टर हो गई! 🎉', lang));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
          <div className="max-w-lg mx-auto"><h1 className="text-xl font-extrabold flex items-center gap-2"><Monitor size={22} /> {t('डिजिटल सेवाएँ', lang)}</h1></div>
        </div>
        <div className="max-w-lg mx-auto px-4 -mt-4 relative z-10">
          <div className="bg-card rounded-2xl shadow-lg p-8 text-center animate-fade-in">
            <CheckCircle className="mx-auto text-primary mb-4" size={56} />
            <h2 className="text-xl font-bold text-foreground mb-2">{t('रजिस्ट्रेशन सफल!', lang)}</h2>
            <p className="text-sm text-muted-foreground mb-6">{t('आपकी सेवा अब लाइव है।', lang)}</p>
            <button onClick={() => navigate('/businesses')} className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold">{t('सेवाएँ देखें', lang)}</button>
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
          <h1 className="text-xl font-extrabold flex items-center gap-2"><Monitor size={22} /> {t('डिजिटल सेवाएँ रजिस्ट्रेशन', lang)}</h1>
          <p className="text-primary-foreground/80 text-xs mt-1">{t('अपनी डिजिटल सेवा रजिस्टर करें', lang)}</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 -mt-4 relative z-10 pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2 bg-card rounded-2xl shadow-lg border border-border p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <label className="text-xs font-bold text-muted-foreground block">{t('प्रोफ़ाइल फोटो (वैकल्पिक)', lang)}</label>
                <button type="button" onClick={() => fileRef.current?.click()} className="w-24 h-24 rounded-2xl bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                  {photo ? <img src={photo} alt="Photo" className="w-full h-full object-cover" /> : <User size={32} className="text-muted-foreground" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </div>
              <div><label className="text-xs font-bold text-muted-foreground mb-1 block">{t('पूरा नाम', lang)} *</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('अपना नाम लिखें', lang)} className={inputClass} required maxLength={100} /></div>
              <div><label className="text-xs font-bold text-muted-foreground mb-1 block">{t('मोबाइल नंबर', lang)} *</label><input type="tel" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder={t('10 अंकों का मोबाइल नंबर', lang)} className={inputClass} required /></div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">{t('सेवा प्रकार', lang)} *</label>
                {!useCustom ? (
                  <select value={serviceType} onChange={e => handleServiceChange(e.target.value)} className={inputClass} required={!useCustom}>
                    <option value="">{t('सेवा प्रकार चुनें', lang)}</option>
                    {DIGITAL_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    <option value="__other__">--- {t('अन्य (Other)', lang)} ---</option>
                  </select>
                ) : (
                  <>
                    <input type="text" value={customService} onChange={(e) => setCustomService(e.target.value)} placeholder={t('अपनी सेवा प्रकार लिखें', lang)} className={inputClass} required={useCustom} maxLength={50} />
                    <button type="button" onClick={() => { setUseCustom(false); setCustomService(''); }} className="text-[10px] text-primary font-bold mt-1">{t('सूची में से चुनें', lang)}</button>
                  </>
                )}
              </div>
              <div><label className="text-xs font-bold text-muted-foreground mb-1 block">{t('गाँव / शहर', lang)} *</label><input type="text" value={village} onChange={e => setVillage(e.target.value)} placeholder={t('गाँव / शहर का नाम', lang)} className={inputClass} required maxLength={100} /></div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">📍 {t('GPS लोकेशन (वैकल्पिक)', lang)}</label>
                <button type="button" onClick={getLocation} disabled={gpsLoading} className="w-full bg-accent text-accent-foreground py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border border-border disabled:opacity-50">
                  <MapPin size={16} /> {gpsLoading ? t('लोकेशन ले रहे हैं...', lang) : lat ? `✅ ${lat.toFixed(4)}, ${lng?.toFixed(4)}` : t('अपनी लोकेशन जोड़ें', lang)}
                </button>
              </div>
              <div><label className="text-xs font-bold text-muted-foreground mb-1 block">{t('पता (वैकल्पिक)', lang)}</label><input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder={t('पूरा पता लिखें', lang)} className={inputClass} maxLength={200} /></div>
              <div><label className="text-xs font-bold text-muted-foreground mb-1 block">{t('विवरण (वैकल्पिक)', lang)}</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t('अपनी सेवाओं का संक्षिप्त विवरण', lang)} className={`${inputClass} resize-none h-20`} maxLength={300} /></div>
              <div className="border-t border-border pt-4">
                <label className="text-xs font-bold text-muted-foreground mb-1 block">🔒 {t('सीक्रेट PIN बनाएं (4 अंक)', lang)} *</label>
                <p className="text-[10px] text-muted-foreground mb-2">{t('प्रोफ़ाइल एडिट/डिलीट करने के लिए PIN ज़रूरी है', lang)}</p>
                <div className="grid grid-cols-2 gap-2">
                  <input type="password" value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }} placeholder={t('PIN डालें', lang)} className={inputClass} required maxLength={4} inputMode="numeric" />
                  <input type="password" value={confirmPin} onChange={e => { setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }} placeholder={t('PIN दोबारा डालें', lang)} className={inputClass} required maxLength={4} inputMode="numeric" />
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
              <h3 className="text-sm font-bold text-foreground mb-3">💻 {lang === 'hi' ? 'डिजिटल सेवा टिप्स' : 'Digital Service Tips'}</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>✅ {lang === 'hi' ? 'सही सेवा प्रकार चुनें' : 'Choose correct service type'}</li>
                <li>📍 {lang === 'hi' ? 'GPS लोकेशन जोड़ें' : 'Add GPS location'}</li>
                <li>📝 {lang === 'hi' ? 'सेवाओं का विवरण लिखें' : 'Describe your services'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalServiceRegistrationPage;
