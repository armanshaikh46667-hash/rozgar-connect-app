import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, User, MapPin, Store } from 'lucide-react';
import { useWorkerStore, CATEGORY_GROUPS, type WorkCategory, type Availability } from '@/store/workerStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AVAILABILITY_OPTIONS: Availability[] = ['Morning', 'Afternoon', 'Evening', 'Full Day'];
const AVAILABILITY_HINDI: Record<Availability, string> = {
  'Morning': 'सुबह', 'Afternoon': 'दोपहर', 'Evening': 'शाम', 'Full Day': 'पूरा दिन',
};

const BUSINESS_CATEGORIES = [
  'Hardware Shop', 'Medical Store', 'Cement Supplier', 'Kirana Store',
  'Furniture Shop', 'Electric Shop', 'Paint Shop', 'Tiles Shop',
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const addWorker = useWorkerStore((s) => s.addWorker);
  const [tab, setTab] = useState<'worker' | 'shop'>('worker');

  return (
    <div className="min-h-screen bottom-nav-safe bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <h1 className="text-2xl font-bold">रजिस्ट्रेशन</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">कामगार या दुकान रजिस्टर करें</p>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        {/* Tab Switcher */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-1.5 grid grid-cols-2 gap-1 mb-4">
          <button onClick={() => setTab('worker')}
            className={`rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${tab === 'worker' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
            <User size={16} /> कामगार
          </button>
          <button onClick={() => setTab('shop')}
            className={`rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${tab === 'shop' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
            <Store size={16} /> दुकान
          </button>
        </div>

        {tab === 'worker' ? (
          <WorkerForm addWorker={addWorker} navigate={navigate} />
        ) : (
          <ShopForm navigate={navigate} />
        )}
      </div>
    </div>
  );
};

// ---- Worker Registration ----
const WorkerForm = ({ addWorker, navigate }: { addWorker: any; navigate: any }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [village, setVillage] = useState('');
  const [category, setCategory] = useState<WorkCategory | ''>('');
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
    const file = e.target.files?.[0];
    if (!file) return;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !village || !category || !experience || !about) return;
    if (mobile.length !== 10) return;
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { setPinError('कृपया 4 अंकों का PIN डालें'); return; }
    if (pin !== confirmPin) { setPinError('PIN मेल नहीं खाता'); return; }
    setPinError('');
    setSubmitting(true);
    const ok = await addWorker({
      name, mobile, village, category: category as WorkCategory,
      experience: parseInt(experience), about, photo,
      serviceCharge: serviceCharge || undefined,
      priceMin: priceMin ? parseInt(priceMin) : undefined,
      priceMax: priceMax ? parseInt(priceMax) : undefined,
      availability, pin, lat, lng,
    });
    setSubmitting(false);
    if (ok) setSuccess(true);
    else toast.error('रजिस्ट्रेशन में समस्या हुई');
  };

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  if (success) {
    return (
      <div className="bg-card rounded-2xl shadow-lg p-8 text-center animate-fade-in">
        <CheckCircle className="mx-auto text-primary mb-4" size={56} />
        <h2 className="text-xl font-bold text-foreground mb-2">रजिस्ट्रेशन सफल!</h2>
        <p className="text-sm text-muted-foreground mb-6">आपकी प्रोफ़ाइल अब लाइव है।</p>
        <button onClick={() => navigate('/search')} className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold">
          कामगार देखें
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground block">प्रोफ़ाइल फोटो (वैकल्पिक)</label>
          <button type="button" onClick={() => fileRef.current?.click()}
            className="w-24 h-24 rounded-2xl bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
            {photo ? <img src={photo} alt="Profile" className="w-full h-full object-cover" /> : <User size={32} className="text-muted-foreground" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">पूरा नाम *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="अपना नाम लिखें" className={inputClass} required maxLength={100} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">मोबाइल नंबर *</label>
          <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10 अंकों का मोबाइल नंबर" className={inputClass} required />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">गाँव *</label>
          <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="अपने गाँव का नाम" className={inputClass} required maxLength={100} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">कार्य श्रेणी *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as WorkCategory)} className={inputClass} required>
            <option value="">श्रेणी चुनें</option>
            {Object.entries(CATEGORY_GROUPS).map(([group, cats]) => (
              <optgroup key={group} label={group}>
                {cats.map((c) => <option key={c} value={c}>{c}</option>)}
              </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">अनुभव (वर्ष) *</label>
          <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="कितने वर्षों का अनुभव" className={inputClass} required min={0} max={50} />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">सेवा शुल्क रेंज (₹) — वैकल्पिक</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="न्यूनतम ₹" className={inputClass} min={0} />
            <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="अधिकतम ₹" className={inputClass} min={0} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">या टेक्स्ट में लिखें:</p>
          <input type="text" value={serviceCharge} onChange={(e) => setServiceCharge(e.target.value)} placeholder="जैसे: ₹300/दिन" className={inputClass} maxLength={50} />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">उपलब्ध समय *</label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <button key={opt} type="button" onClick={() => setAvailability(opt)}
                className={`rounded-xl px-3 py-2 text-sm border transition-colors ${availability === opt ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'}`}>
                {AVAILABILITY_HINDI[opt]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">📍 GPS लोकेशन (वैकल्पिक)</label>
          <button type="button" onClick={getLocation} disabled={gpsLoading}
            className="w-full bg-accent text-accent-foreground py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border border-border disabled:opacity-50">
            <MapPin size={16} /> {gpsLoading ? 'लोकेशन ले रहे हैं...' : lat ? `✅ ${lat.toFixed(4)}, ${lng?.toFixed(4)}` : 'अपनी लोकेशन जोड़ें'}
          </button>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">अपने बारे में *</label>
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="अपने कौशल का संक्षिप्त विवरण" className={`${inputClass} resize-none h-20`} required maxLength={300} />
        </div>

        <div className="border-t border-border pt-4">
          <label className="text-xs font-medium text-muted-foreground mb-1 block">🔒 सीक्रेट PIN बनाएं (4 अंक) *</label>
          <p className="text-[10px] text-muted-foreground mb-2">प्रोफ़ाइल एडिट/डिलीट करने के लिए PIN ज़रूरी है</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="password" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }}
              placeholder="PIN डालें" className={inputClass} required maxLength={4} inputMode="numeric" />
            <input type="password" value={confirmPin} onChange={(e) => { setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }}
              placeholder="PIN दोबारा डालें" className={inputClass} required maxLength={4} inputMode="numeric" />
          </div>
          {pinError && <p className="text-[11px] text-destructive mt-1">{pinError}</p>}
        </div>

        <button type="submit" disabled={submitting}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold shadow-lg active:scale-[0.97] transition-transform disabled:opacity-60">
          {submitting ? 'रजिस्टर हो रहा है...' : 'रजिस्टर करें'}
        </button>
      </form>
    </div>
  );
};

// ---- Shop Registration ----
const ShopForm = ({ navigate }: { navigate: any }) => {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [mobile, setMobile] = useState('');
  const [village, setVillage] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !mobile || !village) return;
    if (mobile.length !== 10) { toast.error('10 अंकों का मोबाइल नंबर डालें'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('local_businesses')
      .insert({ name, category, mobile, village, description: desc || null });
    setSubmitting(false);
    if (error) { toast.error('कुछ गलत हो गया'); return; }
    setSuccess(true);
  };

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  if (success) {
    return (
      <div className="bg-card rounded-2xl shadow-lg p-8 text-center animate-fade-in">
        <CheckCircle className="mx-auto text-primary mb-4" size={56} />
        <h2 className="text-xl font-bold text-foreground mb-2">दुकान रजिस्टर हो गई!</h2>
        <p className="text-sm text-muted-foreground mb-6">आपकी दुकान अब दिखेगी।</p>
        <button onClick={() => navigate('/businesses')} className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold">
          दुकानें देखें
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-lg border border-border p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">दुकान का नाम *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="दुकान का नाम लिखें" className={inputClass} required maxLength={100} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">श्रेणी *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} required>
            <option value="">श्रेणी चुनें</option>
            {BUSINESS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">मोबाइल नंबर *</label>
          <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10 अंकों का मोबाइल नंबर" className={inputClass} required />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">गाँव / शहर *</label>
          <input value={village} onChange={(e) => setVillage(e.target.value)} placeholder="गाँव / शहर का नाम" className={inputClass} required maxLength={100} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">विवरण (वैकल्पिक)</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="दुकान के बारे में..." className={`${inputClass} resize-none h-16`} maxLength={300} />
        </div>
        <button type="submit" disabled={submitting}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold shadow-lg active:scale-[0.97] transition-transform disabled:opacity-60">
          {submitting ? 'रजिस्टर हो रहा है...' : 'दुकान रजिस्टर करें'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
