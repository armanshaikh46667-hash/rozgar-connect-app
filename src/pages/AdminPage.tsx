import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Trash2, Users, Store, Loader2, KeyRound, ArrowLeft, Laptop, GraduationCap, HardHat, Leaf, Car, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Worker {
  id: string; name: string; mobile: string; village: string; category: string; status: string; created_at: string;
}
interface Business {
  id: string; name: string; mobile: string; village: string; category: string; created_at: string;
}

const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

type AdminTab = 'services' | 'home' | 'vehicle' | 'agriculture' | 'construction' | 'shops' | 'digital' | 'education' | 'settings';

const TAB_CONFIG: { key: AdminTab; label: string; icon: React.ReactNode; emoji: string }[] = [
  { key: 'services', label: 'सेवाएँ', icon: <Users size={14} />, emoji: '🔧' },
  { key: 'home', label: 'घरेलू', icon: <Home size={14} />, emoji: '🏠' },
  { key: 'vehicle', label: 'वाहन', icon: <Car size={14} />, emoji: '🚗' },
  { key: 'agriculture', label: 'कृषि', icon: <Leaf size={14} />, emoji: '🌾' },
  { key: 'construction', label: 'निर्माण', icon: <HardHat size={14} />, emoji: '🏗️' },
  { key: 'shops', label: 'दुकानें', icon: <Store size={14} />, emoji: '🏪' },
  { key: 'digital', label: 'डिजिटल', icon: <Laptop size={14} />, emoji: '💻' },
  { key: 'education', label: 'शिक्षा', icon: <GraduationCap size={14} />, emoji: '📚' },
  { key: 'settings', label: 'सेटिंग्स', icon: <KeyRound size={14} />, emoji: '⚙️' },
];

// Worker category groups for filtering
const CATEGORY_FILTER: Record<string, string[]> = {
  services: ["Plumber", "Electrician", "Rajmistri", "Painter", "Carpenter", "Mobile Repair", "Bike Mechanic", "Domestic Worker"],
  home: ["Tailoring / Boutique", "Beauty Parlour", "Home Tutor", "Cook", "Cleaning Worker", "Gas Stove Repair"],
  vehicle: ["Tractor Mechanic", "JCB Operator", "Truck Driver", "Auto Driver", "Tempo Service", "Pickup Rental"],
  agriculture: ["Tractor Driver", "Harvester / Thresher Service", "Field Ploughing Service", "Pesticide Spraying Service", "Dairy Worker", "Animal Doctor", "Animal Feed Supplier"],
  construction: ["General Labor", "Tiles Worker", "Welding Worker", "Iron Work", "Roof Casting Worker", "Water Tank Installation"],
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<AdminTab>('services');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [digitalServices, setDigitalServices] = useState<Business[]>([]);
  const [educationList, setEducationList] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [changingPin, setChangingPin] = useState(false);

  const handleLogin = async () => {
    const { data } = await supabase.from('app_settings').select('value').eq('key', 'admin_pin').single();
    const savedPin = data?.value || '9999';
    if (pin === savedPin) {
      setAuthenticated(true);
      loadData();
    } else {
      toast.error('गलत Admin PIN');
    }
  };

  const loadData = async () => {
    setLoading(true);
    const [wRes, bRes, dRes, eRes] = await Promise.all([
      supabase.from('workers').select('id, name, mobile, village, category, status, created_at').order('created_at', { ascending: false }),
      supabase.from('local_businesses').select('id, name, mobile, village, category, created_at').order('created_at', { ascending: false }),
      supabase.from('digital_services').select('id, shop_name, mobile, village, service_type, created_at').order('created_at', { ascending: false }),
      supabase.from('education_coaching').select('id, institute_name, mobile, village, course_type, created_at').order('created_at', { ascending: false }),
    ]);
    setWorkers((wRes.data as Worker[]) || []);
    setBusinesses((bRes.data as Business[]) || []);
    setDigitalServices((dRes.data || []).map((d: any) => ({ id: d.id, name: d.shop_name, mobile: d.mobile, village: d.village, category: d.service_type, created_at: d.created_at })));
    setEducationList((eRes.data || []).map((e: any) => ({ id: e.id, name: e.institute_name, mobile: e.mobile, village: e.village, category: e.course_type, created_at: e.created_at })));
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

  const handleChangePin = async () => {
    if (!currentPin || !newPin || !confirmPin) { toast.error('सभी फ़ील्ड भरें'); return; }
    if (newPin.length !== 4) { toast.error('नया PIN 4 अंकों का होना चाहिए'); return; }
    if (newPin !== confirmPin) { toast.error('नया PIN और Confirm PIN मेल नहीं खाते'); return; }
    setChangingPin(true);
    const { data } = await supabase.from('app_settings').select('value').eq('key', 'admin_pin').single();
    const savedPin = data?.value || '9999';
    if (currentPin !== savedPin) { toast.error('वर्तमान PIN गलत है'); setChangingPin(false); return; }
    const { error } = await supabase.from('app_settings').update({ value: newPin }).eq('key', 'admin_pin');
    setChangingPin(false);
    if (error) { toast.error('PIN बदलने में समस्या'); return; }
    setCurrentPin(''); setNewPin(''); setConfirmPin('');
    toast.success('Admin PIN सफलतापूर्वक बदल दिया गया! ✅');
  };

  const getFilteredWorkers = () => {
    const cats = CATEGORY_FILTER[tab];
    if (!cats) return [];
    return workers.filter(w => cats.includes(w.category));
  };

  const renderItemList = (items: { id: string; name: string; category: string; village: string; mobile: string }[], onDelete: (id: string) => void) => (
    <div className="space-y-2">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">कोई डेटा नहीं</p>
      ) : items.map(item => (
        <div key={item.id} className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.category} · {item.village}</p>
            <p className="text-xs text-muted-foreground">📱 {item.mobile}</p>
          </div>
          <button onClick={() => onDelete(item.id)}
            className="shrink-0 p-2 rounded-xl bg-destructive/10 text-destructive active:scale-[0.95] transition-transform">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
          <div className="max-w-lg mx-auto">
            <button onClick={() => navigate('/')} className="mb-3 flex items-center gap-1 text-primary-foreground/80 text-xs">
              <ArrowLeft size={16} /> होम पेज
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Shield size={24} /> Admin Panel</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">प्रबंधन के लिए लॉगिन करें</p>
          </div>
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
          </div>
        </div>
      </div>
    );
  }

  const workerTabContent = () => {
    const filtered = getFilteredWorkers();
    return renderItemList(
      filtered.map(w => ({ id: w.id, name: w.name, category: w.category, village: w.village, mobile: w.mobile })),
      deleteWorker
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <div className="max-w-lg mx-auto">
          <button onClick={() => navigate('/')} className="mb-3 flex items-center gap-1 text-primary-foreground/80 text-xs">
            <ArrowLeft size={16} /> होम पेज
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Shield size={24} /> Admin Panel</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            {workers.length} कामगार · {businesses.length} दुकानें · {digitalServices.length} डिजिटल · {educationList.length} शिक्षा
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-4 pb-8">
        {/* Tabs - scrollable */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-2 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TAB_CONFIG.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`rounded-xl px-3 py-2 text-[10px] font-semibold flex items-center gap-1 whitespace-nowrap transition-colors ${tab === t.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}>
                <span>{t.emoji}</span> {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading && tab !== 'settings' ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : tab === 'settings' ? (
          <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
            <h2 className="font-bold text-foreground text-sm flex items-center gap-2">
              <KeyRound size={18} className="text-primary" /> Admin PIN बदलें
            </h2>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">वर्तमान PIN</label>
              <input type="password" value={currentPin} onChange={e => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="वर्तमान 4 अंकों का PIN" className={inputClass} maxLength={4} inputMode="numeric" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">नया PIN</label>
              <input type="password" value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="नया 4 अंकों का PIN" className={inputClass} maxLength={4} inputMode="numeric" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">नया PIN दोबारा डालें</label>
              <input type="password" value={confirmPin} onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="नया PIN दोबारा डालें" className={inputClass} maxLength={4} inputMode="numeric" />
            </div>
            <button onClick={handleChangePin} disabled={changingPin}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold disabled:opacity-50 active:scale-[0.97] transition-transform">
              {changingPin ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'PIN बदलें'}
            </button>
          </div>
        ) : tab === 'shops' ? (
          renderItemList(businesses, deleteBusiness)
        ) : tab === 'digital' ? (
          renderItemList(digitalServices, async (id) => {
            if (!confirm('डिलीट करें?')) return;
            toast.error('डिजिटल सेवा डिलीट करने के लिए RLS policy अपडेट ज़रूरी है');
          })
        ) : tab === 'education' ? (
          renderItemList(educationList, async (id) => {
            if (!confirm('डिलीट करें?')) return;
            toast.error('शिक्षा डिलीट करने के लिए RLS policy अपडेट ज़रूरी है');
          })
        ) : (
          workerTabContent()
        )}
      </div>
    </div>
  );
};

export default AdminPage;
