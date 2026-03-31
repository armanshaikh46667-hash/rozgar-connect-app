import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Phone, MapPin, ArrowLeft, Share2, Star, Store, Laptop, GraduationCap, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguageStore, t } from '@/store/languageStore';
import { getDistance } from '@/store/workerStore';

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface BusinessData {
  id: string;
  name: string;
  category: string;
  village: string;
  mobile: string;
  description: string | null;
  photo: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  timing?: string | null;
  fees?: string | null;
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; labelEn: string }> = {
  shop: { icon: <Store size={28} className="text-primary-foreground/80" />, label: 'दुकान', labelEn: 'Shop' },
  digital: { icon: <Laptop size={28} className="text-primary-foreground/80" />, label: 'डिजिटल सेवा', labelEn: 'Digital Service' },
  coaching: { icon: <GraduationCap size={28} className="text-primary-foreground/80" />, label: 'शिक्षा / कोचिंग', labelEn: 'Education' },
};

const BusinessProfilePage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const lang = useLanguageStore((s) => s.lang);
  const [data, setData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    if (!type || !id) return;
    const fetchData = async () => {
      setLoading(true);
      let result: BusinessData | null = null;
      if (type === 'shop') {
        const { data: d } = await supabase.from('local_businesses').select('*').eq('id', id).maybeSingle();
        if (d) result = { id: d.id, name: d.name, category: d.category, village: d.village, mobile: d.mobile, description: d.description, photo: d.photo, address: d.address, lat: d.lat, lng: d.lng, created_at: d.created_at };
      } else if (type === 'digital') {
        const { data: d } = await supabase.from('digital_services').select('*').eq('id', id).maybeSingle();
        if (d) result = { id: d.id, name: d.shop_name, category: d.service_type, village: d.village, mobile: d.mobile, description: d.description, photo: d.photo, address: d.address, lat: d.lat, lng: d.lng, created_at: d.created_at };
      } else if (type === 'coaching') {
        const { data: d } = await supabase.from('education_coaching').select('*').eq('id', id).maybeSingle();
        if (d) result = { id: d.id, name: d.institute_name, category: d.course_type, village: d.village, mobile: d.mobile, description: d.description, photo: d.photo, address: d.address, lat: d.lat, lng: d.lng, created_at: d.created_at, timing: d.timing, fees: d.fees };
      }
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, [type, id]);

  const config = TYPE_CONFIG[type || 'shop'] || TYPE_CONFIG.shop;
  const dist = data?.lat && data?.lng && userLat && userLng ? getDistance(userLat, userLng, data.lat, data.lng) : null;

  const handleShare = async () => {
    if (!data) return;
    const url = `${window.location.origin}/business/${type}/${data.id}`;
    const text = `RozgarSewa: ${data.name} – ${data.category}, ${data.village}. ${url}`;
    try {
      if (navigator.share) await navigator.share({ title: data.name, text, url });
      else { await navigator.clipboard.writeText(text); alert(lang === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link copied!'); }
    } catch {}
  };

  const openGoogleMaps = () => {
    if (!data?.lat || !data?.lng) return;
    if (userLat && userLng) window.open(`https://www.google.com/maps/dir/${userLat},${userLng}/${data.lat},${data.lng}`, '_blank');
    else window.open(`https://www.google.com/maps?q=${data.lat},${data.lng}`, '_blank');
  };

  const currentHour = new Date().getHours();
  const isOpen = currentHour >= 8 && currentHour < 20;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground mb-4">{lang === 'hi' ? 'जानकारी नहीं मिली' : 'Not found'}</p>
        <button onClick={() => navigate('/')} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold">
          {t('होम पेज', lang)}
        </button>
      </div>
    );
  }

  const displayRating = hoverRating || reviewRating;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header - uses design system colors */}
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-20 text-primary-foreground">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary-foreground/90 text-sm mb-6 bg-primary-foreground/20 px-4 py-2 rounded-xl font-bold backdrop-blur-sm hover:bg-primary-foreground/30 transition-colors">
          <ArrowLeft size={18} /> {lang === 'hi' ? 'वापस' : 'Back'}
        </button>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 border-2 border-primary-foreground/30 overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
            {data.photo ? <img src={data.photo} alt={data.name} className="w-full h-full object-cover" /> : config.icon}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold truncate">{data.name}</h1>
            <p className="text-primary-foreground/80 text-sm">{data.category}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <MapPin size={12} className="text-primary-foreground/70" />
              <span className="text-xs text-primary-foreground/70">{data.village}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${isOpen ? 'bg-green-400/30 text-green-100' : 'bg-red-400/30 text-red-100'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-300' : 'bg-red-300'}`} />
                {isOpen ? (lang === 'hi' ? 'खुला है' : 'Open') : (lang === 'hi' ? 'बंद है' : 'Closed')}
              </span>
              {dist !== null && (
                <span className="text-[10px] font-bold text-primary-foreground/80">📍 {dist.toFixed(1)} km</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-12 relative z-10 space-y-4 pb-8">
        {/* Action Buttons */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-4">
          <div className="grid grid-cols-4 gap-2">
            <a href={`tel:${data.mobile}`} className="flex flex-col items-center gap-1.5 p-3 bg-primary text-primary-foreground rounded-xl active:scale-[0.97] transition-transform">
              <Phone size={20} />
              <span className="text-[10px] font-bold">{t('कॉल', lang)}</span>
            </a>
            <a href={`https://wa.me/91${data.mobile}`} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 bg-accent text-accent-foreground rounded-xl active:scale-[0.97] transition-transform">
              <WhatsAppIcon size={20} />
              <span className="text-[10px] font-bold">WhatsApp</span>
            </a>
            <button onClick={handleShare}
              className="flex flex-col items-center gap-1.5 p-3 bg-secondary text-secondary-foreground rounded-xl border border-border active:scale-[0.97] transition-transform">
              <Share2 size={20} />
              <span className="text-[10px] font-bold">{lang === 'hi' ? 'शेयर' : 'Share'}</span>
            </button>
            {data.lat && data.lng ? (
              <button onClick={openGoogleMaps}
                className="flex flex-col items-center gap-1.5 p-3 bg-secondary text-secondary-foreground rounded-xl border border-border active:scale-[0.97] transition-transform">
                <MapPin size={20} />
                <span className="text-[10px] font-bold">{t('रास्ता', lang)}</span>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-1.5 p-3 bg-muted text-muted-foreground rounded-xl">
                <MapPin size={20} />
                <span className="text-[10px] font-bold">N/A</span>
              </div>
            )}
          </div>
        </div>

        {/* Rate & Review - Fixed stars */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-4">
          <button onClick={() => setShowReview(!showReview)}
            className="flex items-center gap-2 text-sm font-bold text-foreground w-full">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            {lang === 'hi' ? 'रेटिंग और रिव्यू दें' : 'Rate & Review'}
          </button>
          {showReview && (
            <div className="mt-3 space-y-3">
              <input value={reviewName} onChange={(e) => setReviewName(e.target.value)}
                placeholder={lang === 'hi' ? 'आपका नाम' : 'Your name'}
                className="w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring" />
              
              {/* Proper star rating */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-2">{lang === 'hi' ? 'रेटिंग:' : 'Rating:'}</span>
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReviewRating(s)}
                    className="transition-transform hover:scale-110 active:scale-95 p-0.5">
                    <Star size={24} className={`${s <= displayRating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'} transition-colors`} />
                  </button>
                ))}
                {displayRating > 0 && <span className="text-sm font-bold text-foreground ml-2">{displayRating}/5</span>}
              </div>

              <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                placeholder={lang === 'hi' ? 'अपना अनुभव बताएं...' : 'Share your experience...'}
                className="w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20" />
              <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold active:scale-[0.97] transition-transform">
                {lang === 'hi' ? 'रिव्यू भेजें' : 'Submit Review'}
              </button>
            </div>
          )}
        </div>

        {/* Details Card */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <h3 className="text-sm font-bold text-foreground">{lang === 'hi' ? 'विवरण' : 'Details'}</h3>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin size={14} className="text-primary shrink-0" />
            <span>{data.address || data.village}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Phone size={14} className="text-primary shrink-0" />
            <span>{data.mobile}</span>
          </div>
          {dist !== null && (
            <div className="flex items-center gap-2 text-sm text-primary font-bold">
              <MapPin size={14} className="shrink-0" />
              <span>{dist.toFixed(1)} km {lang === 'hi' ? 'दूर' : 'away'}</span>
            </div>
          )}
          {data.timing && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Clock size={14} className="text-primary shrink-0" />
              <span>{data.timing}</span>
            </div>
          )}
          {data.fees && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <span className="text-primary shrink-0 font-bold">₹</span>
              <span>{data.fees}</span>
            </div>
          )}
          {data.description && (
            <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border">{data.description}</p>
          )}
        </div>

        {/* Status */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <h3 className="text-sm font-bold text-foreground mb-2">{lang === 'hi' ? 'स्थिति' : 'Status'}</h3>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${isOpen ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-red-500/10 text-red-700 dark:text-red-400'}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
            {isOpen ? (lang === 'hi' ? 'अभी खुला है (8 AM – 8 PM)' : 'Currently Open (8 AM – 8 PM)') : (lang === 'hi' ? 'अभी बंद है' : 'Currently Closed')}
          </div>
        </div>

        {/* Registered */}
        <div className="bg-card rounded-2xl border border-border p-4 text-center">
          <span className="text-xs text-muted-foreground">{lang === 'hi' ? config.label : config.labelEn}</span>
          <p className="text-[10px] text-muted-foreground mt-1">
            {lang === 'hi' ? 'रजिस्टर किया:' : 'Registered:'} {new Date(data.created_at).toLocaleDateString('hi-IN')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;
