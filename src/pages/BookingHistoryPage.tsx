import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Loader2, CalendarCheck, Phone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Booking {
  id: string;
  worker_name: string;
  worker_mobile: string;
  worker_category: string;
  customer_name: string;
  customer_mobile: string;
  booking_date: string;
  booking_time: string;
  description: string | null;
  status: string;
  created_at: string;
}

const STATUS_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: 'लंबित', icon: <Clock size={14} />, color: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400' },
  accepted: { label: 'स्वीकृत', icon: <CheckCircle size={14} />, color: 'bg-green-500/15 text-green-700 dark:text-green-400' },
  rejected: { label: 'अस्वीकृत', icon: <XCircle size={14} />, color: 'bg-red-500/15 text-red-700 dark:text-red-400' },
  completed: { label: 'पूर्ण', icon: <CheckCircle size={14} />, color: 'bg-primary/15 text-primary' },
};

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewAs, setViewAs] = useState<'customer' | 'worker'>('customer');

  useEffect(() => {
    if (!submitted || mobile.length !== 10) return;
    setLoading(true);
    const col = viewAs === 'customer' ? 'customer_mobile' : 'worker_mobile';
    supabase.from('bookings').select('*').eq(col, mobile).order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => { setBookings((data as Booking[]) || []); setLoading(false); });
  }, [submitted, mobile, viewAs]);

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  if (!submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
          <div className="max-w-lg mx-auto">
            <button onClick={() => navigate('/')} className="mb-3 flex items-center gap-1 text-primary-foreground/80 text-xs">
              <ArrowLeft size={16} /> होम पेज
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2"><CalendarCheck size={24} /> बुकिंग इतिहास</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">अपनी पिछली बुकिंग देखें</p>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 -mt-4">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setViewAs('customer')}
                className={`rounded-xl py-2.5 text-sm font-semibold border transition-colors ${viewAs === 'customer' ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'}`}>
                👤 ग्राहक
              </button>
              <button onClick={() => setViewAs('worker')}
                className={`rounded-xl py-2.5 text-sm font-semibold border transition-colors ${viewAs === 'worker' ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'}`}>
                👷 कामगार
              </button>
            </div>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10 अंकों का मोबाइल नंबर" className={inputClass} />
            <button onClick={() => mobile.length === 10 && setSubmitted(true)} disabled={mobile.length !== 10}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold disabled:opacity-50 active:scale-[0.97] transition-transform">
              बुकिंग देखें
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'completed' || b.status === 'accepted').length,
    cancelled: bookings.filter(b => b.status === 'rejected').length,
    pending: bookings.filter(b => b.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <div className="max-w-lg mx-auto">
          <button onClick={() => navigate('/')} className="mb-3 flex items-center gap-1 text-primary-foreground/80 text-xs">
            <ArrowLeft size={16} /> होम पेज
          </button>
        <h1 className="text-2xl font-bold flex items-center gap-2"><CalendarCheck size={24} /> बुकिंग इतिहास</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">{viewAs === 'customer' ? 'ग्राहक' : 'कामगार'}: {mobile}</p>
        <button onClick={() => { setSubmitted(false); setBookings([]); }} className="text-primary-foreground/70 text-xs mt-1 underline">बदलें</button>
      </div>

      {/* Stats */}
      <div className="max-w-lg mx-auto px-4 -mt-4">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-4 grid grid-cols-4 gap-2 text-center">
          <div><p className="text-lg font-extrabold text-primary">{stats.total}</p><p className="text-[10px] text-muted-foreground">कुल</p></div>
          <div><p className="text-lg font-extrabold text-green-600">{stats.completed}</p><p className="text-[10px] text-muted-foreground">पूर्ण</p></div>
          <div><p className="text-lg font-extrabold text-yellow-600">{stats.pending}</p><p className="text-[10px] text-muted-foreground">लंबित</p></div>
          <div><p className="text-lg font-extrabold text-red-600">{stats.cancelled}</p><p className="text-[10px] text-muted-foreground">रद्द</p></div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : bookings.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <CalendarCheck size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">कोई बुकिंग नहीं मिली</p>
          </div>
        ) : (
          bookings.map((b) => {
            const s = STATUS_MAP[b.status] || STATUS_MAP.pending;
            return (
              <div key={b.id} className="bg-card rounded-2xl border border-border p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${s.color}`}>
                    {s.icon} {s.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{new Date(b.created_at).toLocaleDateString('hi-IN')}</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{b.worker_category}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {viewAs === 'customer' ? `कामगार: ${b.worker_name}` : `ग्राहक: ${b.customer_name}`}
                </p>
                <p className="text-xs text-muted-foreground">📅 {b.booking_date} · ⏰ {b.booking_time}</p>
                {b.description && <p className="text-xs text-muted-foreground mt-1">📝 {b.description}</p>}
                <div className="flex gap-2 mt-3">
                  <a href={`tel:${viewAs === 'customer' ? b.worker_mobile : b.customer_mobile}`}
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-[0.97] transition-transform">
                    <Phone size={12} /> कॉल करें
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
