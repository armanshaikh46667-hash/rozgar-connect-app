import { useParams, useNavigate } from 'react-router-dom';
import { useWorkerStore, getAverageRating, getExperienceBadge, getDistance } from '@/store/workerStore';
import { useAuthStore } from '@/store/authStore';
import { Phone, MapPin, Clock, Star, Award, ArrowLeft, Share2, User, IndianRupee, CalendarCheck, Edit, Trash2, Image, Activity } from 'lucide-react';
import { RatingDisplay, RateReviewInput } from '@/components/RatingStars';
import { useState, useEffect } from 'react';
import BookingDialog from '@/components/BookingDialog';

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const AVAILABILITY_HINDI: Record<string, string> = {
  'Morning': 'सुबह', 'Afternoon': 'दोपहर', 'Evening': 'शाम', 'Full Day': 'पूरा दिन',
};

const WorkerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const worker = useWorkerStore((s) => s.workers.find((w) => w.id === id));
  const authUser = useAuthStore((s) => s.user);
  const { toggleStatus, deleteWorker } = useWorkerStore();
  const [bookingWorker, setBookingWorker] = useState<{ name: string; mobile: string; category: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRateReview, setShowRateReview] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  const isOwner = authUser && worker && authUser.mobile === worker.mobile;

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  if (!worker) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground mb-4">कामगार नहीं मिला</p>
        <button onClick={() => navigate('/')} className="bg-primary text-primary-foreground px-6 py-2 rounded-xl text-sm font-bold">होम पेज</button>
      </div>
    );
  }

  const dist = worker.lat && worker.lng && userLat && userLng ? getDistance(userLat, userLng, worker.lat, worker.lng) : null;

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/worker/${worker.id}`;
    const text = `RozgarSewa par ye worker available hai: ${worker.name} – ${worker.category}. Booking ke liye yaha dekhe: ${profileUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${worker.name} - RozgarSewa`, text, url: profileUrl });
      } else {
        await navigator.clipboard.writeText(text);
        alert('लिंक कॉपी हो गया!');
      }
    } catch { /* cancelled */ }
  };

  const handleDelete = async () => {
    if (!worker) return;
    const ok = await deleteWorker(worker.id, worker.pin);
    if (ok) navigate('/');
  };

  const handleToggleStatus = async () => {
    if (!worker) return;
    const newStatus = worker.status === 'available' ? 'busy' : worker.status === 'busy' ? 'offline' : 'available';
    await toggleStatus(worker.id, worker.pin, newStatus);
  };

  const openGoogleMaps = () => {
    if (!worker.lat || !worker.lng) return;
    if (userLat && userLng) window.open(`https://www.google.com/maps/dir/${userLat},${userLng}/${worker.lat},${worker.lng}`, '_blank');
    else window.open(`https://www.google.com/maps?q=${worker.lat},${worker.lng}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-20 text-primary-foreground">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary-foreground text-sm mb-6 bg-primary-foreground/20 px-4 py-2 rounded-xl font-bold backdrop-blur-sm hover:bg-primary-foreground/30 transition-colors">
          <ArrowLeft size={18} /> वापस
        </button>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-2xl bg-primary-foreground/20 border-2 border-primary-foreground/30 overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
            {worker.photo ? <img src={worker.photo} alt={worker.name} className="w-full h-full object-cover" /> : <User size={36} className="text-primary-foreground/60" />}
          </div>
          <div>
            <h1 className="text-xl font-bold">{worker.name}</h1>
            <p className="text-primary-foreground/80 text-sm">{worker.category}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <RatingDisplay ratings={worker.ratings} />
              <span className="text-[10px] text-primary-foreground/60">({worker.ratings.length} रेटिंग)</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={12} className="text-primary-foreground/70" />
              <span className="text-xs text-primary-foreground/70">{worker.village}</span>
            </div>
            {dist !== null && (
              <span className="text-[10px] font-bold text-primary-foreground/80 mt-0.5 block">📍 {dist.toFixed(1)} km दूर</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-12 relative z-10 space-y-4 pb-8">
        {/* Public action buttons */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-4">
          <div className="grid grid-cols-4 gap-2">
            <a href={`tel:${worker.mobile}`} className="flex flex-col items-center gap-1 p-2 bg-primary text-primary-foreground rounded-xl active:scale-[0.97] transition-transform">
              <Phone size={18} />
              <span className="text-[10px] font-bold">कॉल</span>
            </a>
            <a href={`https://wa.me/91${worker.mobile}`} target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 p-2 bg-accent text-accent-foreground rounded-xl active:scale-[0.97] transition-transform">
              <WhatsAppIcon size={18} />
              <span className="text-[10px] font-bold">WhatsApp</span>
            </a>
            <button onClick={() => setBookingWorker({ name: worker.name, mobile: worker.mobile, category: worker.category })}
              className="flex flex-col items-center gap-1 p-2 bg-secondary text-secondary-foreground rounded-xl border border-border active:scale-[0.97] transition-transform">
              <CalendarCheck size={18} />
              <span className="text-[10px] font-bold">बुकिंग</span>
            </button>
            <button onClick={handleShare}
              className="flex flex-col items-center gap-1 p-2 bg-secondary text-secondary-foreground rounded-xl border border-border active:scale-[0.97] transition-transform">
              <Share2 size={18} />
              <span className="text-[10px] font-bold">शेयर</span>
            </button>
          </div>
        </div>

        {/* Rate & Review */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-4">
          <button onClick={() => setShowRateReview(!showRateReview)}
            className="flex items-center gap-2 text-sm font-semibold text-foreground w-full">
            <Star size={16} className="text-primary" />
            रेटिंग और रिव्यू दें
          </button>
          {showRateReview && (
            <div className="mt-3">
              <RateReviewInput workerId={worker.id} onClose={() => setShowRateReview(false)} />
            </div>
          )}
        </div>

        {/* Owner-only actions */}
        {isOwner && (
          <div className="bg-card rounded-2xl shadow-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3">👤 आपका प्रोफ़ाइल</p>
            <div className="grid grid-cols-4 gap-2">
              <button onClick={handleToggleStatus}
                className="flex flex-col items-center gap-1 p-2 bg-secondary text-secondary-foreground rounded-xl border border-border active:scale-[0.97] transition-transform">
                <Activity size={16} />
                <span className="text-[10px] font-bold">स्थिति</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${worker.status === 'available' ? 'bg-primary/20 text-primary' : worker.status === 'busy' ? 'bg-yellow-500/20 text-yellow-700' : 'bg-muted text-muted-foreground'}`}>
                  {worker.status === 'available' ? 'उपलब्ध' : worker.status === 'busy' ? 'व्यस्त' : 'ऑफलाइन'}
                </span>
              </button>
              <button onClick={() => navigate(`/register?edit=${worker.id}`)}
                className="flex flex-col items-center gap-1 p-2 bg-secondary text-secondary-foreground rounded-xl border border-border active:scale-[0.97] transition-transform">
                <Edit size={16} />
                <span className="text-[10px] font-bold">Edit</span>
              </button>
              <button onClick={() => setShowDeleteConfirm(true)}
                className="flex flex-col items-center gap-1 p-2 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 active:scale-[0.97] transition-transform">
                <Trash2 size={16} />
                <span className="text-[10px] font-bold">Delete</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-2 bg-secondary text-secondary-foreground rounded-xl border border-border active:scale-[0.97] transition-transform">
                <Image size={16} />
                <span className="text-[10px] font-bold">Portfolio</span>
              </button>
            </div>
          </div>
        )}

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4">
            <p className="text-sm font-semibold text-destructive mb-3">क्या आप प्रोफ़ाइल हटाना चाहते हैं?</p>
            <div className="flex gap-2">
              <button onClick={handleDelete} className="flex-1 bg-destructive text-destructive-foreground py-2.5 rounded-xl text-sm font-bold">हां, हटाएं</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-secondary text-secondary-foreground py-2.5 rounded-xl text-sm font-bold border border-border">रद्द करें</button>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <MapPin size={14} className="text-primary shrink-0" /> <span>{worker.village}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Clock size={14} className="text-primary shrink-0" />
            <span>{worker.experience} वर्ष अनुभव · {AVAILABILITY_HINDI[worker.availability] || worker.availability}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Award size={14} className="text-primary shrink-0" /> <span>{getExperienceBadge(worker.experience)}</span>
          </div>
          {(worker.priceMin || worker.priceMax || worker.serviceCharge) && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <IndianRupee size={14} className="text-primary shrink-0" />
              <span>
                {worker.priceMin && worker.priceMax ? `₹${worker.priceMin} – ₹${worker.priceMax}` : worker.serviceCharge || ''}
                {worker.priceMin && worker.priceMax && worker.serviceCharge ? ` (${worker.serviceCharge})` : ''}
              </span>
            </div>
          )}
          {worker.about && <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border">{worker.about}</p>}
        </div>

        {/* Google Maps Embed */}
        {worker.lat && worker.lng && (
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">📍 लोकेशन</h3>
            <div className="rounded-xl overflow-hidden border border-border mb-3">
              <iframe
                src={`https://maps.google.com/maps?q=${worker.lat},${worker.lng}&z=15&output=embed`}
                width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {dist !== null && (
              <p className="text-xs text-primary font-bold mb-2">📍 {dist.toFixed(1)} km दूर</p>
            )}
            <button onClick={openGoogleMaps}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform">
              <MapPin size={16} /> Google Maps में खोलें
            </button>
          </div>
        )}

        {/* Gallery */}
        {worker.gallery.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">कार्य गैलरी</h3>
            <div className="grid grid-cols-3 gap-2">
              {worker.gallery.map((p, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border">
                  <img src={p} alt={`Work ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {worker.reviews.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">समीक्षाएं ({worker.reviews.length})</h3>
            <div className="space-y-2">
              {worker.reviews.map((r, i) => (
                <div key={i} className="bg-secondary rounded-xl p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground">{r.reviewerName}</span>
                    <span className="text-[10px] text-muted-foreground">{r.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {bookingWorker && (
        <BookingDialog workerName={bookingWorker.name} workerMobile={bookingWorker.mobile} workerCategory={bookingWorker.category} onClose={() => setBookingWorker(null)} />
      )}
    </div>
  );
};

export default WorkerProfilePage;
