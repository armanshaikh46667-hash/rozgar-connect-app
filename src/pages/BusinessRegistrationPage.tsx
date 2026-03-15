import { useState } from 'react';
import { Store, GraduationCap, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const DIGITAL_SERVICES = [
  'Aadhaar Update', 'PAN Card Apply', 'Online Form Filling',
  'Bill Payment', 'Passport Apply', 'Voter ID', 'Driving License',
  'Mobile Recharge', 'Insurance', 'Other',
];

const COURSE_TYPES = [
  'Computer Class', 'Competitive Exam Coaching', 'Spoken English',
  'Skill Training', 'Tuition (School)', 'Music / Dance',
  'Driving School', 'Tailoring Course', 'Other',
];

const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

const DigitalServiceForm = () => {
  const [ownerName, setOwnerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [mobile, setMobile] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!ownerName || !shopName || !mobile || !serviceType || !village) {
      toast.error('कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }
    if (mobile.length !== 10) { toast.error('10 अंकों का मोबाइल नंबर डालें'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('digital_services').insert({
      owner_name: ownerName, shop_name: shopName, mobile,
      service_type: serviceType, village, address: address || null,
      description: description || null,
    });
    setSubmitting(false);
    if (error) { toast.error('कुछ गलत हो गया, दोबारा कोशिश करें'); return; }
    setDone(true);
    toast.success('दुकान सफलतापूर्वक रजिस्टर हो गई! 🎉');
  };

  if (done) return (
    <div className="text-center py-10">
      <CheckCircle2 size={48} className="mx-auto text-primary mb-3" />
      <p className="font-bold text-foreground">रजिस्ट्रेशन सफल!</p>
      <p className="text-xs text-muted-foreground mt-1">आपकी दुकान जोड़ दी गई है।</p>
      <button onClick={() => setDone(false)} className="mt-4 text-xs text-primary font-semibold">एक और जोड़ें</button>
    </div>
  );

  return (
    <div className="space-y-3">
      <input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="मालिक का नाम *" className={inputClass} />
      <input value={shopName} onChange={e => setShopName(e.target.value)} placeholder="दुकान का नाम *" className={inputClass} />
      <input type="tel" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="मोबाइल नंबर *" className={inputClass} />
      <select value={serviceType} onChange={e => setServiceType(e.target.value)} className={inputClass}>
        <option value="">सेवा प्रकार चुनें *</option>
        {DIGITAL_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <input value={village} onChange={e => setVillage(e.target.value)} placeholder="गाँव / शहर *" className={inputClass} />
      <input value={address} onChange={e => setAddress(e.target.value)} placeholder="पता (वैकल्पिक)" className={inputClass} />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="विवरण (वैकल्पिक)" className={`${inputClass} resize-none h-16`} />
      <button onClick={handleSubmit} disabled={submitting}
        className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold disabled:opacity-50 active:scale-[0.97] transition-transform">
        {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'रजिस्टर करें'}
      </button>
    </div>
  );
};

const EducationCoachingForm = () => {
  const [ownerName, setOwnerName] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [mobile, setMobile] = useState('');
  const [courseType, setCourseType] = useState('');
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [fees, setFees] = useState('');
  const [timing, setTiming] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!ownerName || !instituteName || !mobile || !courseType || !village) {
      toast.error('कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }
    if (mobile.length !== 10) { toast.error('10 अंकों का मोबाइल नंबर डालें'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('education_coaching').insert({
      owner_name: ownerName, institute_name: instituteName, mobile,
      course_type: courseType, village, address: address || null,
      description: description || null, fees: fees || null, timing: timing || null,
    });
    setSubmitting(false);
    if (error) { toast.error('कुछ गलत हो गया, दोबारा कोशिश करें'); return; }
    setDone(true);
    toast.success('कोचिंग सफलतापूर्वक रजिस्टर हो गई! 🎉');
  };

  if (done) return (
    <div className="text-center py-10">
      <CheckCircle2 size={48} className="mx-auto text-primary mb-3" />
      <p className="font-bold text-foreground">रजिस्ट्रेशन सफल!</p>
      <p className="text-xs text-muted-foreground mt-1">आपकी कोचिंग जोड़ दी गई है।</p>
      <button onClick={() => setDone(false)} className="mt-4 text-xs text-primary font-semibold">एक और जोड़ें</button>
    </div>
  );

  return (
    <div className="space-y-3">
      <input value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="मालिक का नाम *" className={inputClass} />
      <input value={instituteName} onChange={e => setInstituteName(e.target.value)} placeholder="संस्थान / कोचिंग का नाम *" className={inputClass} />
      <input type="tel" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="मोबाइल नंबर *" className={inputClass} />
      <select value={courseType} onChange={e => setCourseType(e.target.value)} className={inputClass}>
        <option value="">कोर्स / ट्रेनिंग प्रकार चुनें *</option>
        {COURSE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <input value={village} onChange={e => setVillage(e.target.value)} placeholder="गाँव / शहर *" className={inputClass} />
      <input value={address} onChange={e => setAddress(e.target.value)} placeholder="पता (वैकल्पिक)" className={inputClass} />
      <input value={fees} onChange={e => setFees(e.target.value)} placeholder="फीस (वैकल्पिक)" className={inputClass} />
      <input value={timing} onChange={e => setTiming(e.target.value)} placeholder="समय (वैकल्पिक) जैसे: 9AM - 5PM" className={inputClass} />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="विवरण (वैकल्पिक)" className={`${inputClass} resize-none h-16`} />
      <button onClick={handleSubmit} disabled={submitting}
        className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold disabled:opacity-50 active:scale-[0.97] transition-transform">
        {submitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'रजिस्टर करें'}
      </button>
    </div>
  );
};

const BusinessRegistrationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'digital' | 'education'>('digital');

  return (
    <div className="min-h-screen bottom-nav-safe bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <div className="max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="mb-3 flex items-center gap-1 text-primary-foreground/80 text-xs">
            <ArrowLeft size={16} /> वापस जाएं
          </button>
          <h1 className="text-xl font-extrabold">व्यापार रजिस्ट्रेशन</h1>
          <p className="text-primary-foreground/80 text-xs mt-1">अपनी दुकान या कोचिंग को रजिस्टर करें</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 relative z-10 space-y-4">
        {/* Tabs */}
        <div className="bg-card rounded-2xl border border-border p-1.5 flex gap-1.5">
          <button onClick={() => setActiveTab('digital')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-colors ${activeTab === 'digital' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
            <Store size={16} /> डिजिटल सेवाएँ / दुकान
          </button>
          <button onClick={() => setActiveTab('education')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-colors ${activeTab === 'education' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
            <GraduationCap size={16} /> शिक्षा / कोचिंग
          </button>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl border border-border p-5 animate-fade-in">
          <h2 className="font-bold text-foreground text-sm mb-4 flex items-center gap-2">
            {activeTab === 'digital' ? <><Store size={18} className="text-primary" /> डिजिटल सेवाएँ / दुकान रजिस्ट्रेशन</> : <><GraduationCap size={18} className="text-primary" /> शिक्षा और प्रशिक्षण रजिस्ट्रेशन</>}
          </h2>
          {activeTab === 'digital' ? <DigitalServiceForm /> : <EducationCoachingForm />}
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationPage;
