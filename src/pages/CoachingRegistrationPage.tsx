import { useState, useRef } from 'react';
import { GraduationCap, ArrowLeft, CheckCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const COURSE_TYPES = [
  'Computer Class', 'Competitive Exam Coaching', 'Spoken English',
  'Skill Training', 'Tuition (School)', 'Music / Dance',
  'Driving School', 'Tailoring Course', 'Other',
];

const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

const CoachingRegistrationPage = () => {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [courseType, setCourseType] = useState('');
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [fees, setFees] = useState('');
  const [timing, setTiming] = useState('');
  const [photo, setPhoto] = useState('');

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !instituteName || !courseType || !village) return;
    if (mobile.length !== 10) { toast.error('10 अंकों का मोबाइल नंबर डालें'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('education_coaching').insert({
      owner_name: name, institute_name: instituteName, mobile,
      course_type: courseType, village, address: address || null,
      description: description || null, fees: fees || null,
      timing: timing || null, photo: photo || null,
    });
    setSubmitting(false);
    if (error) { toast.error('कुछ गलत हो गया, दोबारा कोशिश करें'); return; }
    setSuccess(true);
    toast.success('कोचिंग सफलतापूर्वक रजिस्टर हो गई! 🎉');
  };

  if (success) {
    return (
      <div className="min-h-screen bottom-nav-safe bg-background">
        <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
          <div className="max-w-lg mx-auto">
            <h1 className="text-xl font-extrabold flex items-center gap-2"><GraduationCap size={22} /> शिक्षा / कोचिंग</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 -mt-4 relative z-10">
          <div className="bg-card rounded-2xl shadow-lg p-8 text-center animate-fade-in">
            <CheckCircle className="mx-auto text-primary mb-4" size={56} />
            <h2 className="text-xl font-bold text-foreground mb-2">रजिस्ट्रेशन सफल!</h2>
            <p className="text-sm text-muted-foreground mb-6">आपकी कोचिंग अब लाइव है।</p>
            <button onClick={() => navigate('/businesses')} className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold">
              सेवाएँ देखें
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bottom-nav-safe bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <div className="max-w-lg mx-auto">
          <button onClick={() => navigate('/business-register')} className="mb-3 flex items-center gap-1 text-primary-foreground/80 text-xs">
            <ArrowLeft size={16} /> वापस जाएं
          </button>
          <h1 className="text-xl font-extrabold flex items-center gap-2"><GraduationCap size={22} /> शिक्षा / कोचिंग रजिस्ट्रेशन</h1>
          <p className="text-primary-foreground/80 text-xs mt-1">अपनी कोचिंग या संस्थान रजिस्टर करें</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 relative z-10">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo */}
            <div className="flex flex-col items-center gap-2">
              <label className="text-xs font-medium text-muted-foreground block">संस्थान फोटो (वैकल्पिक)</label>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-24 h-24 rounded-2xl bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                {photo ? <img src={photo} alt="Photo" className="w-full h-full object-cover" /> : <User size={32} className="text-muted-foreground" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">पूरा नाम *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="अपना नाम लिखें" className={inputClass} required maxLength={100} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">मोबाइल नंबर *</label>
              <input type="tel" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10 अंकों का मोबाइल नंबर" className={inputClass} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">संस्थान / कोचिंग का नाम *</label>
              <input type="text" value={instituteName} onChange={e => setInstituteName(e.target.value)} placeholder="संस्थान का नाम लिखें" className={inputClass} required maxLength={100} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">कोर्स / ट्रेनिंग प्रकार *</label>
              <select value={courseType} onChange={e => setCourseType(e.target.value)} className={inputClass} required>
                <option value="">कोर्स प्रकार चुनें</option>
                {COURSE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">गाँव / शहर *</label>
              <input type="text" value={village} onChange={e => setVillage(e.target.value)} placeholder="गाँव / शहर का नाम" className={inputClass} required maxLength={100} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">पता (वैकल्पिक)</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="पूरा पता लिखें" className={inputClass} maxLength={200} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">अनुभव (वर्ष)</label>
              <input type="number" value={experience} onChange={e => setExperience(e.target.value)} placeholder="कितने वर्षों का अनुभव" className={inputClass} min={0} max={50} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">फीस (वैकल्पिक)</label>
              <input type="text" value={fees} onChange={e => setFees(e.target.value)} placeholder="जैसे: ₹500/महीना" className={inputClass} maxLength={50} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">समय (वैकल्पिक)</label>
              <input type="text" value={timing} onChange={e => setTiming(e.target.value)} placeholder="जैसे: 9AM - 5PM" className={inputClass} maxLength={50} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">विवरण (वैकल्पिक)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="अपने संस्थान का संक्षिप्त विवरण" className={`${inputClass} resize-none h-20`} maxLength={300} />
            </div>

            <button type="submit" disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold shadow-lg active:scale-[0.97] transition-transform disabled:opacity-60">
              {submitting ? 'रजिस्टर हो रहा है...' : 'रजिस्टर करें'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoachingRegistrationPage;
