import { useState, useEffect } from 'react';
import { Shield, Trash2, Users, Store, Loader2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ADMIN_PIN = '9999';

interface Worker {
  id: string;
  name: string;
  mobile: string;
  village: string;
  category: string;
  status: string;
  created_at: string;
}

interface Business {
  id: string;
  name: string;
  mobile: string;
  village: string;
  category: string;
  created_at: string;
}

const AdminPage = () => {
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<'workers' | 'shops'>('workers');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      loadData();
    } else {
      toast.error('गलत Admin PIN');
    }
  };

  const loadData = async () => {
    setLoading(true);
    const [wRes, bRes] = await Promise.all([
      supabase.from('workers').select('id, name, mobile, village, category, status, created_at').order('created_at', { ascending: false }),
      supabase.from('local_businesses').select('id, name, mobile, village, category, created_at').order('created_at', { ascending: false }),
    ]);
    setWorkers((wRes.data as Worker[]) || []);
    setBusinesses((bRes.data as Business[]) || []);
    setLoading(false);
  };

  const deleteWorker = async (id: string) => {
    if (!confirm('क्या आप इस कामगार को डिलीट करना चाहते हैं?')) return;
    const { error } = await supabase.from('workers').delete().eq('id', id);
    if (error) { toast.error('डिलीट में समस्या'); return; }
    setWorkers(w => w.filter(x => x.id !== id));
    toast.success('कामगार डिलीट हो गया');
  };

  const deleteBusiness = async (id: string) => {
    if (!confirm('क्या आप इस दुकान को डिलीट करना चाहते हैं?')) return;
    const { error } = await supabase.from('local_businesses').delete().eq('id', id);
    if (error) { toast.error('डिलीट में समस्या'); return; }
    setBusinesses(b => b.filter(x => x.id !== id));
    toast.success('दुकान डिलीट हो गई');
  };

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  if (!authenticated) {
    return (
      <div className="min-h-screen bottom-nav-safe bg-background">
        <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
          <h1 className="text-2xl font-bold flex items-center gap-2"><Shield size={24} /> Admin Panel</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">प्रबंधन के लिए लॉगिन करें</p>
        </div>
        <div className="max-w-sm mx-auto px-4 -mt-4">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-6 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">🔒 Admin PIN</label>
              <input type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="4 अंकों का Admin PIN" className={inputClass} maxLength={4} inputMode="numeric" />
            </div>
            <button onClick={handleLogin}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold active:scale-[0.97] transition-transform">
              लॉगिन करें
            </button>
            <p className="text-[10px] text-muted-foreground text-center">Default PIN: 9999</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bottom-nav-safe bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Shield size={24} /> Admin Panel</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          {workers.length} कामगार · {businesses.length} दुकानें
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-4">
        {/* Tab */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-1.5 grid grid-cols-2 gap-1">
          <button onClick={() => setTab('workers')}
            className={`rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${tab === 'workers' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
            <Users size={16} /> कामगार ({workers.length})
          </button>
          <button onClick={() => setTab('shops')}
            className={`rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${tab === 'shops' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
            <Store size={16} /> दुकानें ({businesses.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : tab === 'workers' ? (
          <div className="space-y-2">
            {workers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">कोई कामगार नहीं</p>
            ) : workers.map(w => (
              <div key={w.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{w.name}</p>
                  <p className="text-xs text-muted-foreground">{w.category} · {w.village}</p>
                  <p className="text-xs text-muted-foreground">📱 {w.mobile} · {w.status}</p>
                </div>
                <button onClick={() => deleteWorker(w.id)}
                  className="shrink-0 p-2 rounded-xl bg-destructive/10 text-destructive active:scale-[0.95] transition-transform">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {businesses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">कोई दुकान नहीं</p>
            ) : businesses.map(b => (
              <div key={b.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.category} · {b.village}</p>
                  <p className="text-xs text-muted-foreground">📱 {b.mobile}</p>
                </div>
                <button onClick={() => deleteBusiness(b.id)}
                  className="shrink-0 p-2 rounded-xl bg-destructive/10 text-destructive active:scale-[0.95] transition-transform">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
