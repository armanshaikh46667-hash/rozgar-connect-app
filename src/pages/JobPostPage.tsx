import { useState } from 'react';
import { Briefcase, CheckCircle, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CATEGORY_GROUPS } from '@/store/workerStore';
import { toast } from 'sonner';

const JobPostPage = () => {
  const [success, setSuccess] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [village, setVillage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !village || !customerName || customerMobile.length !== 10) {
      toast.error('कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('bookings').insert({
      worker_name: 'Job Post',
      worker_mobile: '0000000000',
      worker_category: category,
      customer_name: customerName,
      customer_mobile: customerMobile,
      booking_date: new Date().toISOString().split('T')[0],
      booking_time: 'Flexible',
      description: `[JOB POST] ${title}\n${village}\n${description}`,
      status: 'pending',
    });
    setLoading(false);
    if (error) { toast.error('कुछ गलत हो गया'); return; }
    setSuccess(true);
  };

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  if (success) {
    return (
      <div className="min-h-screen bottom-nav-safe bg-background flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl shadow-lg p-8 text-center max-w-sm w-full animate-fade-in">
          <CheckCircle className="mx-auto text-primary mb-4" size={56} />
          <h2 className="text-xl font-bold text-foreground mb-2">काम पोस्ट हो गया!</h2>
          <p className="text-sm text-muted-foreground mb-4">आस-पास के कामगार आपसे संपर्क करेंगे।</p>
          <button onClick={() => { setSuccess(false); setTitle(''); setCategory(''); setVillage(''); setCustomerName(''); setCustomerMobile(''); setDescription(''); }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold">
            और काम पोस्ट करें
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bottom-nav-safe bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Briefcase size={24} /> काम पोस्ट करें</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">अपनी ज़रूरत बताएं, कामगार आपसे जुड़ेंगे</p>
      </div>
      <div className="max-w-lg mx-auto px-4 -mt-4">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">काम का शीर्षक *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="जैसे: बाथरूम पाइप रिपेयर" className={inputClass} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">श्रेणी *</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass} required>
                <option value="">श्रेणी चुनें</option>
                {Object.entries(CATEGORY_GROUPS).map(([group, cats]) => (
                  <optgroup key={group} label={group}>
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">गाँव / शहर *</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input value={village} onChange={e => setVillage(e.target.value)} placeholder="अपने गाँव का नाम" className="w-full bg-secondary text-secondary-foreground rounded-xl pl-9 pr-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground" required />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">आपका नाम *</label>
              <input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="अपना नाम" className={inputClass} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">मोबाइल नंबर *</label>
              <input type="tel" value={customerMobile} onChange={e => setCustomerMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10 अंकों का मोबाइल" className={inputClass} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">विवरण</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="काम की पूरी जानकारी लिखें..." className={`${inputClass} resize-none h-20`} maxLength={500} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold shadow-lg disabled:opacity-50 active:scale-[0.97] transition-transform">
              {loading ? 'पोस्ट हो रहा...' : 'काम पोस्ट करें'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobPostPage;
