import { useState, useEffect } from 'react';
import { IndianRupee, Briefcase, CalendarDays, TrendingUp, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore, t } from '@/store/languageStore';
import { toast } from 'sonner';

interface BookingSummary {
  todayCount: number;
  monthCount: number;
  yearCount: number;
  totalCount: number;
}

const EarningsPage = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((s) => s.user);
  const lang = useLanguageStore((s) => s.lang);
  const [mobile, setMobile] = useState(authUser?.mobile || '');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<BookingSummary | null>(null);

  const fetchData = async (num: string) => {
    if (num.length !== 10) { toast.error(t('10 अंकों का मोबाइल नंबर', lang)); return; }
    setLoading(true);
    const { data, error } = await supabase.from('bookings').select('created_at, status').eq('worker_mobile', num);
    setLoading(false);
    if (error) { toast.error('डेटा लोड नहीं हुआ'); return; }
    if (!data || data.length === 0) { toast.info(t('कोई बुकिंग नहीं मिली', lang)); setSummary({ todayCount: 0, monthCount: 0, yearCount: 0, totalCount: 0 }); return; }
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const monthStr = now.toISOString().slice(0, 7);
    const yearStr = now.getFullYear().toString();
    const completed = data.filter(b => b.status === 'completed' || b.status === 'pending' || b.status === 'confirmed');
    setSummary({
      todayCount: completed.filter(b => b.created_at.startsWith(todayStr)).length,
      monthCount: completed.filter(b => b.created_at.startsWith(monthStr)).length,
      yearCount: completed.filter(b => b.created_at.startsWith(yearStr)).length,
      totalCount: completed.length,
    });
  };

  useEffect(() => {
    if (authUser?.mobile) fetchData(authUser.mobile);
  }, [authUser?.mobile]);

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm hover:bg-primary-foreground/30 transition-colors mb-3">
            <ArrowLeft size={16} /> {t('होम पेज', lang)}
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2"><TrendingUp size={24} /> {t('कमाई डैशबोर्ड', lang)}</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            {authUser ? `${authUser.name} — ${authUser.mobile}` : t('अपनी बुकिंग और काम का विवरण देखें', lang)}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2 space-y-4">
            {!authUser && (
              <div className="bg-card rounded-2xl shadow-lg border border-border p-4 space-y-3">
                <label className="text-xs font-medium text-muted-foreground">{t('अपना मोबाइल नंबर डालें', lang)}</label>
                <input type="tel" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder={t('10 अंकों का मोबाइल नंबर', lang)} className={inputClass} maxLength={10} inputMode="numeric" />
                <button onClick={() => fetchData(mobile)} disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold active:scale-[0.97] transition-transform disabled:opacity-60 flex items-center justify-center gap-2">
                  <Search size={16} /> {loading ? t('खोज रहे हैं...', lang) : t('डैशबोर्ड देखें', lang)}
                </button>
              </div>
            )}

            {loading && !summary && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}

            {summary && (
              <div className="grid grid-cols-2 gap-3 animate-fade-in">
                <div className="bg-card rounded-2xl border border-border p-4 text-center">
                  <CalendarDays size={22} className="mx-auto text-primary mb-2" />
                  <p className="text-2xl font-extrabold text-foreground">{summary.todayCount}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{t('आज के काम', lang)}</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-4 text-center">
                  <IndianRupee size={22} className="mx-auto text-primary mb-2" />
                  <p className="text-2xl font-extrabold text-foreground">{summary.monthCount}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{t('इस महीने', lang)}</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-4 text-center">
                  <TrendingUp size={22} className="mx-auto text-primary mb-2" />
                  <p className="text-2xl font-extrabold text-foreground">{summary.yearCount}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{t('इस साल', lang)}</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-4 text-center">
                  <Briefcase size={22} className="mx-auto text-primary mb-2" />
                  <p className="text-2xl font-extrabold text-foreground">{summary.totalCount}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{t('कुल काम', lang)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block space-y-4 mt-0">
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">📊 {lang === 'hi' ? 'कमाई बढ़ाने के टिप्स' : 'Tips to Earn More'}</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>✅ {lang === 'hi' ? 'प्रोफ़ाइल अपडेट रखें' : 'Keep profile updated'}</li>
                <li>⭐ {lang === 'hi' ? 'अच्छी सेवा से रेटिंग बढ़ाएं' : 'Improve rating with good service'}</li>
                <li>📱 {lang === 'hi' ? 'समय पर कॉल उठाएं' : 'Answer calls on time'}</li>
                <li>📍 {lang === 'hi' ? 'GPS लोकेशन अपडेट रखें' : 'Keep GPS location updated'}</li>
              </ul>
            </div>
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">💡 {lang === 'hi' ? 'जानकारी' : 'Info'}</h3>
              <p className="text-xs text-muted-foreground">{lang === 'hi' ? 'यहाँ आपके सभी बुकिंग का सारांश दिखता है। ज्यादा काम पाने के लिए अपनी प्रोफ़ाइल पूरी करें।' : 'Here you can see a summary of all your bookings. Complete your profile to get more work.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
