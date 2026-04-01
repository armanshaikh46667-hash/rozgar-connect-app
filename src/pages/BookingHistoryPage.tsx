import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Loader2, CalendarCheck, Phone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore, t } from '@/store/languageStore';
import { toast } from 'sonner';

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

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const lang = useLanguageStore((s) => s.lang);
  const [mobile, setMobile] = useState(authUser?.mobile || '');
  const [submitted, setSubmitted] = useState(!!authUser);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewAs, setViewAs] = useState<'customer' | 'worker'>(authUser?.type === 'worker' ? 'worker' : 'customer');

  const STATUS_MAP: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    pending: { label: t('लंबित', lang), icon: <Clock size={14} />, color: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400' },
    accepted: { label: lang === 'hi' ? 'स्वीकृत' : 'Accepted', icon: <CheckCircle size={14} />, color: 'bg-green-500/15 text-green-700 dark:text-green-400' },
    rejected: { label: lang === 'hi' ? 'अस्वीकृत' : 'Rejected', icon: <XCircle size={14} />, color: 'bg-red-500/15 text-red-700 dark:text-red-400' },
    completed: { label: t('पूर्ण', lang), icon: <CheckCircle size={14} />, color: 'bg-primary/15 text-primary' },
  };

  const fetchBookings = async () => {
    if (mobile.length !== 10) return;
    setLoading(true);
    const col = viewAs === 'customer' ? 'customer_mobile' : 'worker_mobile';
    const { data } = await supabase.from('bookings').select('*').eq(col, mobile).order('created_at', { ascending: false }).limit(100);
    setBookings((data as Booking[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!submitted || mobile.length !== 10) return;
    fetchBookings();
  }, [submitted, mobile, viewAs]);

  const handleAcceptReject = async (booking: Booking, newStatus: 'accepted' | 'rejected') => {
    setActionLoading(booking.id);
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', booking.id);
    if (error) {
      toast.error(lang === 'hi' ? 'स्थिति अपडेट में समस्या' : 'Failed to update status');
      setActionLoading(null);
      return;
    }

    // Send notification to customer
    const title = newStatus === 'accepted'
      ? (lang === 'hi' ? '✅ बुकिंग स्वीकृत!' : '✅ Booking Accepted!')
      : (lang === 'hi' ? '❌ बुकिंग अस्वीकृत' : '❌ Booking Rejected');
    const message = newStatus === 'accepted'
      ? `${booking.worker_name} (${booking.worker_category}) ने आपकी ${booking.booking_date} की बुकिंग स्वीकार कर ली है।`
      : `${booking.worker_name} (${booking.worker_category}) ने आपकी ${booking.booking_date} की बुकिंग अस्वीकार कर दी है।`;

    await supabase.from('notifications').insert({
      recipient_mobile: booking.customer_mobile,
      title,
      message,
      type: newStatus,
      related_booking_id: booking.id,
    });

    // Update local state
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: newStatus } : b));
    setActionLoading(null);
    toast.success(newStatus === 'accepted' ? (lang === 'hi' ? 'बुकिंग स्वीकृत!' : 'Booking Accepted!') : (lang === 'hi' ? 'बुकिंग अस्वीकृत' : 'Booking Rejected'));
  };

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  if (!submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/')} className="mb-3 flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm hover:bg-primary-foreground/30 transition-colors">
              <ArrowLeft size={16} /> {t('होम पेज', lang)}
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2"><CalendarCheck size={24} /> {t('बुकिंग इतिहास', lang)}</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">{t('अपनी पिछली बुकिंग देखें', lang)}</p>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 -mt-4">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setViewAs('customer')}
                className={`rounded-xl py-2.5 text-sm font-semibold border transition-colors ${viewAs === 'customer' ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'}`}>
                👤 {t('ग्राहक', lang)}
              </button>
              <button onClick={() => setViewAs('worker')}
                className={`rounded-xl py-2.5 text-sm font-semibold border transition-colors ${viewAs === 'worker' ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'}`}>
                👷 {t('कामगार', lang)}
              </button>
            </div>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder={t('10 अंकों का मोबाइल नंबर', lang)} className={inputClass} />
            <button onClick={() => mobile.length === 10 && setSubmitted(true)} disabled={mobile.length !== 10}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold disabled:opacity-50 active:scale-[0.97] transition-transform">
              {t('बुकिंग देखें', lang)}
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
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/')} className="mb-3 flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm hover:bg-primary-foreground/30 transition-colors">
            <ArrowLeft size={16} /> {t('होम पेज', lang)}
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2"><CalendarCheck size={24} /> {t('बुकिंग इतिहास', lang)}</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">{viewAs === 'customer' ? t('ग्राहक', lang) : t('कामगार', lang)}: {mobile}</p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setViewAs(viewAs === 'customer' ? 'worker' : 'customer')}
              className="text-primary-foreground/70 text-xs underline">{viewAs === 'customer' ? t('कामगार के रूप में देखें', lang) : t('ग्राहक के रूप में देखें', lang)}</button>
            {!authUser && <button onClick={() => { setSubmitted(false); setBookings([]); }} className="text-primary-foreground/70 text-xs underline">{t('नंबर बदलें', lang)}</button>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Stats */}
            <div className="bg-card rounded-2xl shadow-lg border border-border p-4 grid grid-cols-4 gap-2 text-center">
              <div><p className="text-lg font-extrabold text-primary">{stats.total}</p><p className="text-[10px] text-muted-foreground">{t('कुल', lang)}</p></div>
              <div><p className="text-lg font-extrabold text-green-600">{stats.completed}</p><p className="text-[10px] text-muted-foreground">{t('पूर्ण', lang)}</p></div>
              <div><p className="text-lg font-extrabold text-yellow-600">{stats.pending}</p><p className="text-[10px] text-muted-foreground">{t('लंबित', lang)}</p></div>
              <div><p className="text-lg font-extrabold text-red-600">{stats.cancelled}</p><p className="text-[10px] text-muted-foreground">{t('रद्द', lang)}</p></div>
            </div>

            {/* Booking List */}
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
              ) : bookings.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <CalendarCheck size={40} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">{t('कोई बुकिंग नहीं मिली', lang)}</p>
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
                        {viewAs === 'customer' ? `${t('कामगार', lang)}: ${b.worker_name}` : `${t('ग्राहक', lang)}: ${b.customer_name}`}
                      </p>
                      <p className="text-xs text-muted-foreground">📅 {b.booking_date} · ⏰ {b.booking_time}</p>
                      {b.description && <p className="text-xs text-muted-foreground mt-1">📝 {b.description}</p>}
                      
                      <div className="flex gap-2 mt-3">
                        {/* Worker view: show accept/reject for pending bookings */}
                        {viewAs === 'worker' && b.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAcceptReject(b, 'accepted')}
                              disabled={actionLoading === b.id}
                              className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-[0.97] transition-transform disabled:opacity-50">
                              {actionLoading === b.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                              {lang === 'hi' ? 'स्वीकार करें' : 'Accept'}
                            </button>
                            <button
                              onClick={() => handleAcceptReject(b, 'rejected')}
                              disabled={actionLoading === b.id}
                              className="flex-1 bg-destructive text-destructive-foreground py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-[0.97] transition-transform disabled:opacity-50">
                              {actionLoading === b.id ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
                              {lang === 'hi' ? 'अस्वीकार करें' : 'Reject'}
                            </button>
                          </>
                        )}
                        <a href={`tel:${viewAs === 'customer' ? b.worker_mobile : b.customer_mobile}`}
                          className={`${viewAs === 'worker' && b.status === 'pending' ? '' : 'flex-1'} bg-primary text-primary-foreground py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 active:scale-[0.97] transition-transform px-4`}>
                          <Phone size={12} /> {t('कॉल करें', lang)}
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block space-y-4 mt-0">
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">📋 {lang === 'hi' ? 'बुकिंग सारांश' : 'Booking Summary'}</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>📊 {lang === 'hi' ? `कुल बुकिंग: ${stats.total}` : `Total Bookings: ${stats.total}`}</p>
                <p>✅ {lang === 'hi' ? `पूर्ण: ${stats.completed}` : `Completed: ${stats.completed}`}</p>
                <p>⏳ {lang === 'hi' ? `लंबित: ${stats.pending}` : `Pending: ${stats.pending}`}</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">💡 {lang === 'hi' ? 'सहायता' : 'Help'}</h3>
              <p className="text-xs text-muted-foreground">{lang === 'hi' ? 'किसी भी बुकिंग के बारे में जानने के लिए कामगार/ग्राहक को सीधे कॉल करें।' : 'Call the worker/customer directly for any booking queries.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryPage;
