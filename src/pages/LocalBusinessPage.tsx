import { useState, useEffect } from 'react';
import { Store, Phone, MapPin, Loader2, Plus, X, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Business {
  id: string;
  name: string;
  category: string;
  mobile: string;
  village: string;
  address: string | null;
  description: string | null;
  photo: string | null;
}

const BUSINESS_CATEGORIES = [
  { name: 'Hardware Shop', emoji: '🔩', hindi: 'हार्डवेयर' },
  { name: 'Medical Store', emoji: '💊', hindi: 'मेडिकल' },
  { name: 'Cement Supplier', emoji: '🏗️', hindi: 'सीमेंट' },
  { name: 'Kirana Store', emoji: '🏪', hindi: 'किराना' },
  { name: 'Furniture Shop', emoji: '🪑', hindi: 'फर्नीचर' },
  { name: 'Electric Shop', emoji: '💡', hindi: 'इलेक्ट्रिक' },
  { name: 'Paint Shop', emoji: '🎨', hindi: 'पेंट' },
  { name: 'Tiles Shop', emoji: '🧩', hindi: 'टाइल्स' },
];

const LocalBusinessPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  // Add form
  const [fName, setFName] = useState('');
  const [fCategory, setFCategory] = useState('');
  const [fMobile, setFMobile] = useState('');
  const [fVillage, setFVillage] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    supabase.from('local_businesses').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setBusinesses((data as Business[]) || []); setLoading(false); });
  }, []);

  const handleAdd = async () => {
    if (!fName || !fCategory || !fMobile || !fVillage) { toast.error('कृपया सभी फ़ील्ड भरें'); return; }
    setAdding(true);
    const { data, error } = await supabase.from('local_businesses')
      .insert({ name: fName, category: fCategory, mobile: fMobile, village: fVillage, description: fDesc || null })
      .select().single();
    setAdding(false);
    if (error) { toast.error('कुछ गलत हो गया'); return; }
    setBusinesses(prev => [data as Business, ...prev]);
    toast.success('दुकान जोड़ दी गई!');
    setShowAdd(false);
    setFName(''); setFCategory(''); setFMobile(''); setFVillage(''); setFDesc('');
  };

  const filtered = businesses.filter(b => {
    const matchCat = !catFilter || b.category === catFilter;
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.village.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Store size={24} /> स्थानीय दुकानें</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">अपने आसपास की दुकानें खोजें</p>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-4">
        {/* Search */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input type="text" placeholder="दुकान या गाँव खोजें..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary text-secondary-foreground rounded-xl pl-9 pr-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setCatFilter('')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${!catFilter ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'}`}>
              सभी
            </button>
            {BUSINESS_CATEGORIES.map(c => (
              <button key={c.name} onClick={() => setCatFilter(c.name)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${catFilter === c.name ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'}`}>
                {c.emoji} {c.hindi}
              </button>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <button onClick={() => setShowAdd(true)}
          className="w-full bg-accent text-accent-foreground py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-border active:scale-[0.97] transition-transform">
          <Plus size={16} /> अपनी दुकान जोड़ें
        </button>

        {/* Add Dialog */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
            <div className="bg-card rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 animate-fade-in" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">दुकान जोड़ें</h3>
                <button onClick={() => setShowAdd(false)} className="text-muted-foreground"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <input value={fName} onChange={e => setFName(e.target.value)} placeholder="दुकान का नाम *" className={inputClass} />
                <select value={fCategory} onChange={e => setFCategory(e.target.value)} className={inputClass}>
                  <option value="">श्रेणी खोजें *</option>
                  {BUSINESS_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.emoji} {c.hindi} ({c.name})</option>)}
                </select>
                <input type="tel" value={fMobile} onChange={e => setFMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="मोबाइल नंबर *" className={inputClass} />
                <input value={fVillage} onChange={e => setFVillage(e.target.value)} placeholder="गाँव / शहर *" className={inputClass} />
                <textarea value={fDesc} onChange={e => setFDesc(e.target.value)} placeholder="विवरण (वैकल्पिक)" className={`${inputClass} resize-none h-16`} />
                <button onClick={handleAdd} disabled={adding}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                  {adding ? 'जोड़ रहे हैं...' : 'दुकान जोड़ें'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Listings */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <Store size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">कोई दुकान नहीं मिली</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(b => (
              <div key={b.id} className="bg-card rounded-2xl border border-border p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <Store size={22} className="text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm">{b.name}</h3>
                    <span className="inline-block bg-secondary text-secondary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5">{b.category}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin size={12} /> {b.village}
                    </div>
                    {b.description && <p className="text-xs text-muted-foreground mt-1">{b.description}</p>}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <a href={`tel:${b.mobile}`}
                    className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
                    <Phone size={14} /> {b.mobile} — कॉल करें
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalBusinessPage;
