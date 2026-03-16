import { useState, useRef } from 'react';
import { Store, ArrowLeft, CheckCircle, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SHOP_CATEGORIES = [
  'Kirana Store', 'Hardware Shop', 'Medical Store', 'Cement Supplier',
  'Furniture Shop', 'Electric Shop', 'Paint Shop', 'Tiles Shop',
  'Clothing Store', 'Mobile Shop', 'Stationery Shop', 'Other',
];

const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

const ShopRegistrationPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [mobile, setMobile] = useState('');
  const [category, setCategory] = useState('');
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
    if (!ownerName || !shopName || !mobile || !category || !village) return;
    if (mobile.length !== 10) { toast.error('10 अंकों का मोबाइल नंबर डालें'); return; }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) { setPinError('कृपया 4 अंकों का PIN डालें'); return; }
    if (pin !== confirmPin) { setPinError('PIN मेल नहीं खाता'); return; }
    setPinError('');
    setSubmitting(true);
    const { error } = await supabase.from('local_businesses' as any).insert({
      name: shopName, category, mobile, village,
      address: address || null, description: description || null,
      photo: photo || null, lat: lat || null, lng: lng || null,
      pin,
    });
    setSubmitting(false);
    if (error) { toast.error('कुछ गलत हो गया, दोबारा कोशिश करें'); return; }
    setSuccess(true);
    toast.success('दुकान सफलतापूर्वक रजिस्टर हो गई! 🎉');
  };

  if (success) {
    return (
      <div className="min-h-screen bottom-nav-safe bg-background">
        <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
          <div className="max-w-lg mx-auto">
            <h1 className="text-xl font-extrabold flex items-center gap-2"><Store size={22} /> दुकान रजिस्ट्रेशन</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 -mt-4 relative z-10">
          <div className="bg-card rounded-2xl shadow-lg p-8 text-center animate-fade-in">
            <CheckCircle className="mx-auto text-primary mb-4" size={56} />
            <h2 className="text-xl font-bold text-foreground mb-2">दुकान रजिस्टर हो गई!</h2>
            <p className="text-sm text-muted-foreground mb-6">आपकी दुकान अब लाइव है।</p>
            <button onClick={() => navigate('/businesses')} className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold">
              दुकानें देखें
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bottom-nav-safe bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <div className="max-w-lg mx-auto">
          <button onClick={() => navigate('/business-register')} className="mb-3 flex items-center gap-1 text-primary-foreground/80 text-xs">
            <ArrowLeft size={16} /> वापस जाएं
          </button>
          <h1 className="text-xl font-extrabold flex items-center gap-2"><Store size={22} /> दुकान रजिस्ट्रेशन</h1>
          <p className="text-primary-foreground/80 text-xs mt-1">अपनी दुकान रजिस्टर करें</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 relative z-10">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground block">दुकान फोटो (वैकल्पिक)</label>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-24 h-24 rounded-2xl bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                {photo ? <img src={photo} alt="Shop" className="w-full h-full object-cover" /> : <Store size={32} className="text-muted-foreground" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">मालिक का नाम *</label>
              <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="मालिक का नाम लिखें" className={inputClass} required maxLength={100} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">दुकान का नाम *</label>
              <input type="text" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="दुकान का नाम लिखें" className={inputClass} required maxLength={100} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">मोबाइल नंबर *</label>
              <input type="tel" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10 अंकों का मोबाइल नंबर" className={inputClass} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">दुकान श्रेणी *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass} required>
                <option value="">श्रेणी चुनें</option>
                {SHOP_CATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">गाँव / शहर *</label>
              <input type="text" value={village} onChange={e => setVillage(e.target.value)} placeholder="गाँव / शहर का नाम" className={inputClass} required maxLength={100} />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">📍 Live Location (वैकल्पिक)</label>
              <button type="button" onClick={getLocation} disabled={gpsLoading}
                className="w-full bg-accent text-accent-foreground py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border border-border disabled:opacity-50">
                <MapPin size={16} /> {gpsLoading ? 'लोकेशन ले रहे हैं...' : lat ? `✅ ${lat.toFixed(4)}, ${lng?.toFixed(4)}` : 'Live Location चुनें'}
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">पता (वैकल्पिक)</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="पूरा पता लिखें" className={inputClass} maxLength={200} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">विवरण (वैकल्पिक)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="दुकान के बारे में संक्षिप्त विवरण" className={`${inputClass} resize-none h-20`} maxLength={300} />
            </div>

            <div className="border-t border-border pt-4">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">🔒 Secret PIN बनाएं (4 अंक) *</label>
              <p className="text-[10px] text-muted-foreground mb-2">प्रोफ़ाइल एडिट/डिलीट करने के लिए PIN ज़रूरी है</p>
              <div className="grid grid-cols-2 gap-2">
                <input type="password" value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }}
                  placeholder="PIN डालें" className={inputClass} required maxLength={4} inputMode="numeric" />
                <input type="password" value={confirmPin} onChange={e => { setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }}
                  placeholder="PIN दोबारा डालें" className={inputClass} required maxLength={4} inputMode="numeric" />
              </div>
              {pinError && <p className="text-[11px] text-destructive mt-1">{pinError}</p>}
            </div>

            <button type="submit" disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold shadow-lg active:scale-[0.97] transition-transform disabled:opacity-60">
              {submitting ? 'रजिस्टर हो रहा है...' : 'दुकान रजिस्टर करें'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopRegistrationPage;
