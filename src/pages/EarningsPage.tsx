import { useState, useMemo } from 'react';
import { IndianRupee, Briefcase, CalendarDays, TrendingUp, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BookingSummary {
  todayCount: number;
  monthCount: number;
  yearCount: number;
  totalCount: number;
}

const EarningsPage = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<BookingSummary | null>(null);

  const handleSearch = async () => {
    if (mobile.length !== 10) { toast.error('कृपया 10 अंकों का मोबाइल नंबर डालें'); return; }
    setLoading(true);
    const { data, error } = await supabase.from('bookings').select('created_at, status').eq('worker_mobile', mobile);
    setLoading(false);
    if (error) { toast.error('डेटा लोड नहीं हुआ'); return; }
    if (!data || data.length === 0) { toast.info('कोई बुकिंग नहीं मिली'); setSummary({ todayCount: 0, monthCount: 0, yearCount: 0, totalCount: 0 }); return; }

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

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-3">
          <ArrowLeft size={18} /> होम पेज
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2"><TrendingUp size={24} /> कमाई डैशबोर्ड</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">अपनी बुकिंग और काम का विवरण देखें</p>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-4">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-4 space-y-3">
          <label className="text-xs font-medium text-muted-foreground">📱 अपना मोबाइल नंबर डालें</label>
          <input type="tel" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10 अंकों का मोबाइल नंबर" className={inputClass} maxLength={10} inputMode="numeric" />
          <button onClick={handleSearch} disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold active:scale-[0.97] transition-transform disabled:opacity-60 flex items-center justify-center gap-2">
            <Search size={16} /> {loading ? 'खोज रहे हैं...' : 'डैशबोर्ड देखें'}
          </button>
        </div>

        {summary && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            <div className="bg-card rounded-2xl border border-border p-4 text-center">
              <CalendarDays size={22} className="mx-auto text-primary mb-2" />
              <p className="text-2xl font-extrabold text-foreground">{summary.todayCount}</p>
              <p className="text-[10px] text-muted-foreground font-medium">आज के काम</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4 text-center">
              <IndianRupee size={22} className="mx-auto text-primary mb-2" />
              <p className="text-2xl font-extrabold text-foreground">{summary.monthCount}</p>
              <p className="text-[10px] text-muted-foreground font-medium">इस महीने</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4 text-center">
              <TrendingUp size={22} className="mx-auto text-primary mb-2" />
              <p className="text-2xl font-extrabold text-foreground">{summary.yearCount}</p>
              <p className="text-[10px] text-muted-foreground font-medium">इस साल</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4 text-center">
              <Briefcase size={22} className="mx-auto text-primary mb-2" />
              <p className="text-2xl font-extrabold text-foreground">{summary.totalCount}</p>
              <p className="text-[10px] text-muted-foreground font-medium">कुल काम</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;
