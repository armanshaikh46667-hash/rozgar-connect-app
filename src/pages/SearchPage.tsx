import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Phone, MapPin, Briefcase, Clock, Star, IndianRupee, Award, MessageSquare, Pencil, Trash2, User, X, Camera, CalendarCheck, CheckCircle, Filter, Image, Navigation, Loader2, Share2, KeyRound, Store, Laptop, GraduationCap, ChevronRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { useWorkerStore, CATEGORY_GROUPS, getAverageRating, getExperienceBadge, getDistance, type WorkCategory, type Availability, type WorkerStatus } from '@/store/workerStore';
import { RatingDisplay, RateReviewInput } from '@/components/RatingStars';
import BookingDialog from '@/components/BookingDialog';
import ForgotPinDialog from '@/components/ForgotPinDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useT, useLanguageStore, t as translate } from '@/store/languageStore';

const AVAILABILITY_OPTIONS: Availability[] = ['Morning', 'Afternoon', 'Evening', 'Full Day'];
const STATUS_KEY: Record<WorkerStatus, string> = {
  available: '🟢 Available',
  busy: '🟡 Busy',
  offline: '🔴 Offline',
};
const STATUS_STYLE: Record<WorkerStatus, { dot: string; bg: string }> = {
  available: { dot: 'bg-green-500', bg: 'bg-green-500/15 text-green-700' },
  busy: { dot: 'bg-yellow-500', bg: 'bg-yellow-500/15 text-yellow-700' },
  offline: { dot: 'bg-red-500', bg: 'bg-red-500/15 text-red-700' },
};

const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// --- Business Entity ---
interface BusinessEntity {
  id: string;
  name: string;
  category: string;
  village: string;
  mobile: string;
  type: 'shop' | 'digital' | 'coaching';
  photo?: string | null;
  description?: string | null;
  lat?: number | null;
  lng?: number | null;
}

const BUSINESS_ICONS: Record<string, React.ReactNode> = {
  shop: <Store size={20} className="text-primary" />,
  digital: <Laptop size={20} className="text-primary" />,
  coaching: <GraduationCap size={20} className="text-primary" />,
};
const BUSINESS_LABELS: Record<string, string> = {
  shop: 'दुकान', digital: 'डिजिटल सेवा', coaching: 'शिक्षा',
};

// --- Status Toggle Dialog ---
const StatusToggleDialog = ({ workerId, onClose }: { workerId: string; onClose: () => void }) => {
  const [pin, setPin] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<WorkerStatus>('available');
  const [saving, setSaving] = useState(false);
  const toggleStatus = useWorkerStore((s) => s.toggleStatus);

  const handleSave = async () => {
    if (pin.length !== 4) { toast.error('कृपया 4 अंकों का PIN डालें'); return; }
    setSaving(true);
    const ok = await toggleStatus(workerId, pin, selectedStatus);
    setSaving(false);
    if (ok) { toast.success('स्थिति अपडेट हो गई!'); onClose(); }
    else toast.error('गलत PIN!');
  };

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-sm p-5 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-foreground mb-3">{useLanguageStore.getState().lang === 'hi' ? 'स्थिति बदलें' : 'Change Status'}</h3>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(Object.keys(STATUS_KEY) as WorkerStatus[]).map((s) => (
            <button key={s} onClick={() => setSelectedStatus(s)}
              className={`rounded-xl px-2 py-2.5 text-xs font-semibold border transition-colors ${selectedStatus === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'}`}>
              {translate(STATUS_KEY[s], useLanguageStore.getState().lang)}
            </button>
          ))}
        </div>
        <input type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="🔒 PIN" className={inputClass} maxLength={4} inputMode="numeric" />
        <button onClick={handleSave} disabled={saving} className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold mt-3 disabled:opacity-60">
          {saving ? translate('सेव हो रहा...', useLanguageStore.getState().lang) : translate('सेव करें', useLanguageStore.getState().lang)}
        </button>
      </div>
    </div>
  );
};

// --- Gallery Dialog ---
const GalleryDialog = ({ workerId, onClose }: { workerId: string; onClose: () => void }) => {
  const worker = useWorkerStore((s) => s.workers.find((w) => w.id === workerId));
  const addGalleryPhoto = useWorkerStore((s) => s.addGalleryPhoto);
  const [pin, setPin] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!worker) return null;

  const handleAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || pin.length !== 4) { toast.error('कृपया पहले PIN डालें'); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      setSaving(true);
      const ok = await addGalleryPhoto(workerId, pin, reader.result as string);
      setSaving(false);
      if (ok) toast.success('फोटो जोड़ी गई!');
      else toast.error('गलत PIN या अधिकतम 6 फोटो');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground flex items-center gap-2"><Image size={18} /> कार्य गैलरी</h3>
          <button onClick={onClose} className="text-muted-foreground"><X size={20} /></button>
        </div>
        {worker.gallery.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {worker.gallery.map((p, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border">
                <img src={p} alt={`Work ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">अभी कोई फोटो नहीं</p>
        )}
        <div className="border-t border-border pt-3 space-y-2">
          <p className="text-xs text-muted-foreground">फोटो जोड़ने के लिए PIN डालें (अधिकतम 6)</p>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="🔒 PIN" className="w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring" maxLength={4} inputMode="numeric" />
          <button onClick={() => fileRef.current?.click()} disabled={pin.length !== 4 || saving}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
            <Camera size={16} /> {saving ? 'जोड़ रहे हैं...' : 'फोटो जोड़ें'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAdd} className="hidden" />
        </div>
      </div>
    </div>
  );
};

// --- Edit Profile ---
const EditProfileDialog = ({ workerId, onClose }: { workerId: string; onClose: () => void }) => {
  const worker = useWorkerStore((s) => s.workers.find((w) => w.id === workerId));
  const updateWorker = useWorkerStore((s) => s.updateWorker);
  const fileRef = useRef<HTMLInputElement>(null);

  const [pin, setPin] = useState('');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(worker?.name || '');
  const [village, setVillage] = useState(worker?.village || '');
  const [about, setAbout] = useState(worker?.about || '');
  const [serviceCharge, setServiceCharge] = useState(worker?.serviceCharge || '');
  const [priceMin, setPriceMin] = useState(worker?.priceMin?.toString() || '');
  const [priceMax, setPriceMax] = useState(worker?.priceMax?.toString() || '');
  const [availability, setAvailability] = useState<Availability>(worker?.availability || 'Full Day');
  const [photo, setPhoto] = useState(worker?.photo || '');

  if (!worker) return null;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (pin.length !== 4) { toast.error('कृपया 4 अंकों का PIN डालें'); return; }
    setSaving(true);
    const success = await updateWorker(workerId, pin, {
      name, village, about, serviceCharge: serviceCharge || undefined, availability, photo,
      priceMin: priceMin ? parseInt(priceMin) : undefined,
      priceMax: priceMax ? parseInt(priceMax) : undefined,
    });
    setSaving(false);
    if (success) { toast.success('प्रोफ़ाइल अपडेट हो गई!'); onClose(); }
    else toast.error('गलत PIN!');
  };

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground">प्रोफ़ाइल एडिट करें</h3>
          <button onClick={onClose} className="text-muted-foreground"><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <div className="flex flex-col items-center gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="w-20 h-20 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
              {photo ? <img src={photo} alt="" className="w-full h-full object-cover" /> : <User size={28} className="text-muted-foreground" />}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="नाम" className={inputClass} />
          <input value={village} onChange={(e) => setVillage(e.target.value)} placeholder="गाँव" className={inputClass} />
          <input value={serviceCharge} onChange={(e) => setServiceCharge(e.target.value)} placeholder="सेवा शुल्क" className={inputClass} />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="न्यूनतम ₹" className={inputClass} />
            <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="अधिकतम ₹" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <button key={opt} type="button" onClick={() => setAvailability(opt)}
                className={`rounded-xl px-3 py-2 text-xs border transition-colors ${availability === opt ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'}`}>
                {translate(opt, useLanguageStore.getState().lang)}
              </button>
            ))}
          </div>
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="अपने बारे में" className={`${inputClass} resize-none h-16`} maxLength={300} />
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted-foreground">🔒 सीक्रेट PIN डालें</label>
              <button type="button" onClick={() => { onClose(); (window as any).__openForgotPin?.(); }} className="text-[10px] text-primary font-semibold flex items-center gap-0.5">
                <KeyRound size={10} /> PIN भूल गए?
              </button>
            </div>
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="4 अंकों का PIN" className={inputClass} maxLength={4} inputMode="numeric" />
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
            {saving ? 'सेव हो रहा...' : 'सेव करें'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Delete Dialog ---
const DeleteDialog = ({ workerId, onClose }: { workerId: string; onClose: () => void }) => {
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'confirm' | 'pin'>('confirm');
  const [saving, setSaving] = useState(false);
  const deleteWorker = useWorkerStore((s) => s.deleteWorker);

  const handleDelete = async () => {
    if (pin.length !== 4) { toast.error('कृपया 4 अंकों का PIN डालें'); return; }
    setSaving(true);
    const success = await deleteWorker(workerId, pin);
    setSaving(false);
    if (success) { toast.success('प्रोफ़ाइल डिलीट हो गई!'); onClose(); }
    else toast.error('गलत PIN!');
  };

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-sm p-5 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {step === 'confirm' ? (
          <>
            <h3 className="font-bold text-foreground mb-2">प्रोफ़ाइल डिलीट करें?</h3>
            <p className="text-sm text-muted-foreground mb-4">यह कार्रवाई वापस नहीं की जा सकती।</p>
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-2 text-sm rounded-xl border border-border text-muted-foreground">रद्द करें</button>
              <button onClick={() => setStep('pin')} className="flex-1 py-2 text-sm bg-destructive text-destructive-foreground rounded-xl font-medium">हाँ, डिलीट करें</button>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-bold text-foreground mb-2">🔒 सीक्रेट PIN डालें</h3>
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="PIN डालें" className={inputClass} maxLength={4} inputMode="numeric" />
            <button type="button" onClick={() => { onClose(); (window as any).__openForgotPin?.(); }} className="text-[10px] text-primary font-semibold flex items-center gap-0.5 mt-1">
              <KeyRound size={10} /> PIN भूल गए?
            </button>
            <div className="flex gap-2 mt-3">
              <button onClick={onClose} className="flex-1 py-2 text-sm rounded-xl border border-border text-muted-foreground">रद्द करें</button>
              <button onClick={handleDelete} disabled={saving} className="flex-1 py-2 text-sm bg-destructive text-destructive-foreground rounded-xl font-medium disabled:opacity-60">
                {saving ? '...' : 'डिलीट करें'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- Business Card (Clean compact card for shops/digital/coaching) ---
const BusinessCard = ({ entity, userLat, userLng }: { entity: BusinessEntity; userLat: number | null; userLng: number | null }) => {
  const navigate = useNavigate();
  const dist = entity.lat && entity.lng && userLat && userLng
    ? getDistance(userLat, userLng, entity.lat, entity.lng) : null;

  return (
    <div onClick={() => navigate(`/business/${entity.type}/${entity.id}`)}
      className="bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.98]">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
          {BUSINESS_ICONS[entity.type]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-sm truncate">{entity.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{translate(entity.category, useLanguageStore.getState().lang)} · {entity.village}</p>
          {dist !== null && (
            <span className="inline-flex items-center text-[10px] text-primary font-semibold mt-0.5">
              📍 {dist.toFixed(1)} km {translate('दूर', useLanguageStore.getState().lang)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <a href={`https://wa.me/91${entity.mobile}`} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground active:scale-[0.95] transition-transform">
            <WhatsAppIcon size={18} />
          </a>
          <a href={`tel:${entity.mobile}`}
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground active:scale-[0.95] transition-transform">
            <Phone size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

// --- Skeleton Loader ---
const CardSkeleton = () => (
  <div className="bg-card rounded-2xl border border-border p-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-secondary" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-secondary rounded-lg w-3/4" />
        <div className="h-3 bg-secondary rounded-lg w-1/2" />
      </div>
      <div className="flex gap-1.5">
        <div className="w-10 h-10 rounded-xl bg-secondary" />
        <div className="w-10 h-10 rounded-xl bg-secondary" />
      </div>
    </div>
  </div>
);

// --- Main Search Page ---
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const workers = useWorkerStore((s) => s.workers);
  const loading = useWorkerStore((s) => s.loading);
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [ratingOpenId, setRatingOpenId] = useState<string | null>(null);
  const [editOpenId, setEditOpenId] = useState<string | null>(null);
  const [deleteOpenId, setDeleteOpenId] = useState<string | null>(null);
  const [statusOpenId, setStatusOpenId] = useState<string | null>(null);
  const [galleryOpenId, setGalleryOpenId] = useState<string | null>(null);
  const [bookingWorker, setBookingWorker] = useState<{ name: string; mobile: string; category: string } | null>(null);
  const [showForgotPin, setShowForgotPin] = useState(false);

  // Business entities
  const [businesses, setBusinesses] = useState<BusinessEntity[]>([]);
  const [businessLoading, setBusinessLoading] = useState(true);

  useEffect(() => {
    (window as any).__openForgotPin = () => setShowForgotPin(true);
    return () => { delete (window as any).__openForgotPin; };
  }, []);

  // Fetch businesses
  useEffect(() => {
    const fetchAll = async () => {
      setBusinessLoading(true);
      const [shopRes, digitalRes, coachingRes] = await Promise.all([
        supabase.from('local_businesses').select('id, name, category, village, mobile, lat, lng, photo, description'),
        supabase.from('digital_services').select('id, shop_name, service_type, village, mobile, lat, lng, photo, description'),
        supabase.from('education_coaching').select('id, institute_name, course_type, village, mobile, lat, lng, photo, description'),
      ]);
      const entities: BusinessEntity[] = [];
      (shopRes.data || []).forEach((s) => {
        entities.push({ id: s.id, name: s.name, category: s.category, village: s.village, mobile: s.mobile, lat: s.lat, lng: s.lng, photo: s.photo, description: s.description, type: 'shop' });
      });
      (digitalRes.data || []).forEach((d) => {
        entities.push({ id: d.id, name: d.shop_name, category: d.service_type, village: d.village, mobile: d.mobile, lat: d.lat, lng: d.lng, photo: d.photo, description: d.description, type: 'digital' });
      });
      (coachingRes.data || []).forEach((c) => {
        entities.push({ id: c.id, name: c.institute_name, category: c.course_type, village: c.village, mobile: c.mobile, lat: c.lat, lng: c.lng, photo: c.photo, description: c.description, type: 'coaching' });
      });
      setBusinesses(entities);
      setBusinessLoading(false);
    };
    fetchAll();
  }, []);

  const handleShareWorker = async (w: { id: string; name: string; category: string; village: string; mobile: string }) => {
    const profileUrl = `${window.location.origin}/worker/${w.id}`;
    const text = `RozgarSewa par ye worker available hai: ${w.name} – ${w.category}. Booking ke liye yaha dekhe: ${profileUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${w.name} - RozgarSewa`, text, url: profileUrl });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('लिंक कॉपी हो गई!');
      }
    } catch { /* cancelled */ }
  };

  const userLat: number | null = null;
  const userLng: number | null = null;

  const results = useMemo(() => {
    return workers.filter((w) => !category || w.category === category);
  }, [workers, category]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) => !category || b.category === category);
  }, [businesses, category]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <div className="max-w-[120rem] mx-auto">
          <button onClick={() => navigate('/')} className="mb-3 flex items-center gap-2 bg-primary-foreground text-primary px-5 py-2.5 rounded-xl text-sm font-extrabold shadow-lg hover:shadow-xl active:scale-[0.97] transition-all w-fit">
            <ArrowLeft size={18} /> {t('होम पेज')}
          </button>
          <h1 className="text-2xl font-bold">{t('कामगार खोजें')}</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">{t('अपने आस-पास कुशल कामगार खोजें')}</p>
        </div>
      </div>

      <div className="max-w-[120rem] mx-auto px-4 -mt-4">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-4 md:p-6 flex justify-center">
          <div className="relative w-full max-w-xl">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-secondary text-secondary-foreground rounded-2xl px-4 md:px-6 py-3.5 md:py-4 pr-12 text-base md:text-lg font-semibold border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all hover:shadow-md hover:border-primary/50 hover:shadow-primary/20 appearance-none cursor-pointer text-center"
              style={{ backgroundImage: 'none' }}
            >
              <option value="">{t('श्रेणी चुनें')}</option>
              {Object.entries(CATEGORY_GROUPS).map(([group, cats]) => (
                <optgroup key={group} label={t(group)}>
                  {cats.map((c) => <option key={c} value={c}>{t(c)}</option>)}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={24} />
          </div>
        </div>
      </div>


      <div className="max-w-[120rem] mx-auto px-4 mt-6 space-y-3">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 5xl:grid-cols-5 gap-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <>
            {/* Workers Section */}
            <p className="text-sm text-muted-foreground font-medium">{results.length} {t('कामगार')} · {filteredBusinesses.length} {t('सेवा प्रदाता')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 5xl:grid-cols-5 gap-3">
              {results.map((w) => {
                const statusCfg = STATUS_STYLE[w.status];
                const statusLabel = t(STATUS_KEY[w.status]);
                const dist = 'distance' in w ? (w as any).distance : null;
                return (
                  <button key={w.id} onClick={() => navigate(`/worker/${w.id}`)}
                    className="w-full bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-secondary border border-border overflow-hidden shrink-0 flex items-center justify-center relative">
                        {w.photo ? <img src={w.photo} alt={w.name} className="w-full h-full object-cover" /> : <User size={24} className="text-muted-foreground" />}
                        <span className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-card ${statusCfg.dot}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-bold text-foreground text-sm truncate">{w.name}</span>
                          <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${statusCfg.bg}`}>
                            {statusLabel}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{t(w.category)} · {w.village}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <RatingDisplay ratings={w.ratings} />
                          {dist !== null && (
                            <span className="text-[10px] bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full font-semibold">
                              📍 {dist.toFixed(1)} km
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <a href={`https://wa.me/91${w.mobile}`} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground active:scale-[0.95] transition-transform">
                          <WhatsAppIcon size={18} />
                        </a>
                        <a href={`tel:${w.mobile}`}
                          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground active:scale-[0.95] transition-transform">
                          <Phone size={18} />
                        </a>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Businesses Section */}
            {filteredBusinesses.length > 0 && (
              <>
                <div className="flex items-center gap-2 pt-4">
                  <Store size={16} className="text-primary" />
                  <h3 className="text-sm font-bold text-foreground">🏪 {t('दुकानें, डिजिटल सेवाएँ, शिक्षा')}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 5xl:grid-cols-5 gap-3">
                  {filteredBusinesses.map((b) => (
                    <BusinessCard key={`${b.type}-${b.id}`} entity={b} userLat={userLat} userLng={userLng} />
                  ))}
                </div>
              </>
            )}

            {results.length === 0 && filteredBusinesses.length === 0 && !loading && (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Search className="text-muted-foreground" size={32} />
                </div>
                <p className="text-foreground font-semibold mb-1">{t('कोई परिणाम नहीं मिला')}</p>
                <p className="text-muted-foreground text-sm">{t('अलग फ़िल्टर आज़माएं या खोज बदलें')}</p>
              </div>
            )}
          </>
        )}
      </div>

      {bookingWorker && (
        <BookingDialog workerName={bookingWorker.name} workerMobile={bookingWorker.mobile} workerCategory={bookingWorker.category} onClose={() => setBookingWorker(null)} />
      )}
      {editOpenId && <EditProfileDialog workerId={editOpenId} onClose={() => setEditOpenId(null)} />}
      {deleteOpenId && <DeleteDialog workerId={deleteOpenId} onClose={() => setDeleteOpenId(null)} />}
      {statusOpenId && <StatusToggleDialog workerId={statusOpenId} onClose={() => setStatusOpenId(null)} />}
      {galleryOpenId && <GalleryDialog workerId={galleryOpenId} onClose={() => setGalleryOpenId(null)} />}
      {showForgotPin && <ForgotPinDialog onClose={() => setShowForgotPin(false)} />}
    </div>
  );
};

export default SearchPage;
