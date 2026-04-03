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
          <button onClick={() => navigate('/')} className="mb-3 flex items-center gap-2 bg-primary-foreground text-primary px-5 py-2.5 rounded-xl text-sm font-extrabold shadow-lg hover:shadow-xl active:scale-[0.97] transition-all">
            <ArrowLeft size={18} /> {t('होम पेज', lang)}
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
        {/* Social Media Links */}
        <div className="flex items-center justify-center gap-4 pt-6 pb-8">
          {[
            { href: 'https://www.instagram.com/arman__shaikh__0007?igsh=dmE2ZTFlcXRpdGRh', label: 'Instagram', svg: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            )},
            { href: 'https://www.facebook.com/share/1PK2qYLnGX/', label: 'Facebook', svg: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            )},
            { href: 'https://www.linkedin.com/in/arman-shaikh-589925361', label: 'LinkedIn', svg: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            )},
            { href: 'https://x.com/ArmanShaikh9754', label: 'X (Twitter)', svg: (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            )},
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
              title={social.label}
            >
              {social.svg}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
