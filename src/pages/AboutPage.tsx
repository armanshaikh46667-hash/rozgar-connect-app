import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, MapPin, Heart, Code, Lightbulb, Briefcase, AlertTriangle, CheckCircle2, TrendingUp, Camera, Loader2, ArrowLeft } from 'lucide-react';
import { useLanguageStore, t } from '@/store/languageStore';
import { supabase } from '@/integrations/supabase/client';

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Section = ({ icon, title, children }: SectionProps) => (
  <div className="bg-card rounded-2xl border border-border p-5 animate-fade-in">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h2 className="text-base font-bold text-foreground">{title}</h2>
    </div>
    <div className="text-sm leading-relaxed space-y-2 text-muted-foreground">
      {children}
    </div>
  </div>
);

const AboutPage = () => {
  const navigate = useNavigate();
  const lang = useLanguageStore((s) => s.lang);
  const iconClass = "shrink-0 text-primary";
  const [avatarImage, setAvatarImage] = useState<string>('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadAvatar = async () => {
      const { data } = await supabase.from('app_settings').select('value').eq('key', 'about_avatar_image').maybeSingle();
      if (data?.value) setAvatarImage(data.value);
    };
    loadAvatar();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const fileName = `avatar-${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage.from('about-photos').upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('about-photos').getPublicUrl(fileName);
      await supabase.from('app_settings').upsert({ key: 'about_avatar_image', value: urlData.publicUrl }, { onConflict: 'key' });
      setAvatarImage(urlData.publicUrl);
    } catch (err) {
      console.error('Avatar upload failed:', err);
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/')} className="mb-3 flex items-center gap-2 bg-primary-foreground/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm hover:bg-primary-foreground/30 transition-colors">
            <ArrowLeft size={16} /> {t('होम पेज', lang)}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Profile Card */}
            <div className="bg-card rounded-2xl border border-border p-6 text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-border relative cursor-pointer overflow-hidden group"
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarUploading ? (
                  <Loader2 size={28} className="animate-spin text-primary" />
                ) : avatarImage ? (
                  <img src={avatarImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={36} className="text-primary" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={18} className="text-white" />
                </div>
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <h1 className="text-2xl font-bold text-foreground">Arman Shaikh</h1>
              <p className="text-sm mt-1 text-muted-foreground">Developer & Creator of RozgarSewa</p>
            </div>

            <Section icon={<User size={18} className={iconClass} />} title={lang === 'hi' ? 'मेरी जानकारी' : 'My Information'}>
              <p><strong className="text-foreground">Name:</strong> Arman Shaikh</p>
              <p><strong className="text-foreground">Age:</strong> 17 Years Old</p>
              <p><strong className="text-foreground">College:</strong> Maa Jinwani College of Legal Studies, Sonkatch</p>
              <p><strong className="text-foreground">Father&apos;s Name:</strong> Mr. Ishak Shaikh</p>
              <p><strong className="text-foreground">Mother&apos;s Name:</strong> Mrs. Rani</p>
            </Section>

            <Section icon={<GraduationCap size={18} className={iconClass} />} title={lang === 'hi' ? 'मेरी शिक्षा' : 'My Education'}>
              <p>I am currently pursuing BCA (2nd Year). Along with my academic studies, I am continuously improving my technical skills in web development and programming.</p>
            </Section>

            <Section icon={<MapPin size={18} className={iconClass} />} title={lang === 'hi' ? 'मेरा स्थान' : 'My Location'}>
              <p><strong className="text-foreground">Village:</strong> Salmkhedi</p>
              <p><strong className="text-foreground">District:</strong> Dewas</p>
              <p><strong className="text-foreground">State:</strong> Madhya Pradesh</p>
            </Section>

            <Section icon={<Briefcase size={18} className={iconClass} />} title={lang === 'hi' ? 'प्रोजेक्ट – RozgarSewa' : 'Project – RozgarSewa'}>
              <p>RozgarSewa is a digital platform designed to connect local workers with employment opportunities in villages and nearby areas.</p>
            </Section>

            <Section icon={<AlertTriangle size={18} className={iconClass} />} title={lang === 'hi' ? 'समस्या' : 'Problem'}>
              <p>गाँवों में लोग प्लम्बर, इलेक्ट्रीशियन, राजमिस्त्री को ढूंढने के लिए व्यक्तिगत जान-पहचान पर निर्भर रहते हैं। कोई डिजिटल प्लेटफॉर्म नहीं है।</p>
            </Section>

            <Section icon={<CheckCircle2 size={18} className={iconClass} />} title={lang === 'hi' ? 'समाधान' : 'Solution'}>
              <p>RozgarSewa — एक फ्री लोकल रोजगार प्लेटफॉर्म जहाँ कारीगर रजिस्टर करते हैं और ग्राहक सीधे संपर्क करते हैं।</p>
            </Section>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block space-y-4 mt-0">
            <Section icon={<Lightbulb size={18} className={iconClass} />} title={lang === 'hi' ? 'रुचियाँ' : 'Interests'}>
              <p>I am deeply interested in technology, digital innovation, and rural development.</p>
            </Section>

            <Section icon={<Heart size={18} className={iconClass} />} title={lang === 'hi' ? 'शौक' : 'Hobbies'}>
              <p>I enjoy discussing coding concepts, exploring new technologies, and learning about programming trends.</p>
            </Section>

            <Section icon={<Code size={18} className={iconClass} />} title={lang === 'hi' ? 'कोडिंग यात्रा' : 'Coding Journey'}>
              <p>I started learning coding during my BCA studies. I sincerely thank <strong className="text-foreground">CodeYogi</strong> for helping me build confidence in coding.</p>
            </Section>

            <Section icon={<TrendingUp size={18} className={iconClass} />} title={lang === 'hi' ? 'लाभ' : 'Benefits'}>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>स्थानीय रोजगार बढ़ेगा</li>
                <li>लोगों को जल्दी सेवा मिलेगी</li>
                <li>कारीगरों की आय बढ़ेगी</li>
                <li>डिजिटल सुविधा गाँव तक पहुँचेगी</li>
              </ul>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
