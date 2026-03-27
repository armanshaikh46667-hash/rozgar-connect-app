import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, GraduationCap, MapPin, Heart, Code, Lightbulb, Briefcase, AlertTriangle, CheckCircle2, TrendingUp, Camera, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Section = ({ icon, title, children }: SectionProps) => (
  <div className="rounded-lg p-5 animate-fade-in" style={{ backgroundColor: 'hsl(220, 15%, 14%)' }}>
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h2 className="glow-heading text-base font-bold">{title}</h2>
    </div>
    <div className="text-sm leading-relaxed space-y-2" style={{ color: 'hsl(220, 10%, 80%)' }}>
      {children}
    </div>
  </div>
);

const AboutPage = () => {
  const navigate = useNavigate();
  const iconClass = "shrink-0" ;
  const iconStyle = { color: 'hsl(210, 100%, 55%)' };
  const [avatarImage, setAvatarImage] = useState<string>('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadAvatar = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'about_avatar_image')
        .maybeSingle();
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
      const { error: uploadError } = await supabase.storage
        .from('about-photos')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('about-photos')
        .getPublicUrl(fileName);

      await supabase
        .from('app_settings')
        .upsert({ key: 'about_avatar_image', value: urlData.publicUrl }, { onConflict: 'key' });

      setAvatarImage(urlData.publicUrl);
    } catch (err) {
      console.error('Avatar upload failed:', err);
      alert('Photo upload failed. Please try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="min-h-screen bottom-nav-safe" style={{ backgroundColor: 'hsl(220, 20%, 8%)' }}>
      <div className="px-6 pt-10 pb-6 text-center">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center border-2 relative cursor-pointer overflow-hidden group"
          style={{ backgroundColor: 'hsl(220, 15%, 14%)', borderColor: 'hsl(210, 100%, 55% / 0.3)' }}
          onClick={() => avatarInputRef.current?.click()}
        >
          {avatarUploading ? (
            <Loader2 size={28} className="animate-spin" style={iconStyle} />
          ) : avatarImage ? (
            <img src={avatarImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User size={36} style={iconStyle} />
          )}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={18} className="text-white" />
          </div>
        </div>
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        <h1 className="glow-heading text-2xl font-bold">Arman Shaikh</h1>
        <p className="text-sm mt-1" style={{ color: 'hsl(220, 10%, 80%)' }}>Developer & Creator of RozgarSewa</p>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-4 pb-4">
        <Section icon={<User size={18} className={iconClass} style={iconStyle} />} title="My Information">
          <p><strong style={{ color: 'hsl(210, 100%, 55% / 0.8)' }}>Name:</strong> Arman Shaikh</p>
          <p><strong style={{ color: 'hsl(210, 100%, 55% / 0.8)' }}>Age:</strong> 17 Years Old</p>
          <p><strong style={{ color: 'hsl(210, 100%, 55% / 0.8)' }}>College:</strong> Maa Jinwani College of Legal Studies, Sonkatch</p>
          <p><strong style={{ color: 'hsl(210, 100%, 55% / 0.8)' }}>Father&apos;s Name:</strong> Mr. Ishak Shaikh</p>
          <p><strong style={{ color: 'hsl(210, 100%, 55% / 0.8)' }}>Mother&apos;s Name:</strong> Mrs. Rani</p>
        </Section>

        <Section icon={<GraduationCap size={18} className={iconClass} style={iconStyle} />} title="My Education">
          <p>I am currently pursuing BCA (2nd Year). Along with my academic studies, I am continuously improving my technical skills in web development and programming.</p>
        </Section>

        <Section icon={<MapPin size={18} className={iconClass} style={iconStyle} />} title="My Current Location">
          <p><strong style={{ color: 'hsl(210, 100%, 55% / 0.8)' }}>Village:</strong> Salmkhedi</p>
          <p><strong style={{ color: 'hsl(210, 100%, 55% / 0.8)' }}>District:</strong> Dewas</p>
          <p><strong style={{ color: 'hsl(210, 100%, 55% / 0.8)' }}>State:</strong> Madhya Pradesh</p>
        </Section>

        <Section icon={<Lightbulb size={18} className={iconClass} style={iconStyle} />} title="Interests">
          <p>I am deeply interested in technology, digital innovation, and rural development.</p>
        </Section>

        <Section icon={<Heart size={18} className={iconClass} style={iconStyle} />} title="Hobbies">
          <p>I enjoy discussing coding concepts, exploring new technologies, and learning about programming trends.</p>
        </Section>

        <Section icon={<Code size={18} className={iconClass} style={iconStyle} />} title="Journey to Coding">
          <p>I started learning coding during my BCA studies. I sincerely thank <strong style={{ color: 'hsl(210, 100%, 55% / 0.8)' }}>CodeYogi</strong> for helping me build confidence in coding.</p>
        </Section>

        <Section icon={<Briefcase size={18} className={iconClass} style={iconStyle} />} title="Project Overview – RozgarSewa">
          <p>RozgarSewa is a digital platform designed to connect local workers with employment opportunities in villages and nearby areas.</p>
        </Section>

        <Section icon={<AlertTriangle size={18} className={iconClass} style={iconStyle} />} title="समस्या">
          <p>गाँवों में लोग प्लम्बर, इलेक्ट्रीशियन, राजमिस्त्री को ढूंढने के लिए व्यक्तिगत जान-पहचान पर निर्भर रहते हैं। कोई डिजिटल प्लेटफॉर्म नहीं है।</p>
        </Section>

        <Section icon={<CheckCircle2 size={18} className={iconClass} style={iconStyle} />} title="समाधान">
          <p>RozgarSewa — एक फ्री लोकल रोजगार प्लेटफॉर्म जहाँ कारीगर रजिस्टर करते हैं और ग्राहक सीधे संपर्क करते हैं।</p>
        </Section>

        <Section icon={<TrendingUp size={18} className={iconClass} style={iconStyle} />} title="लाभ (Benefits)">
          <ul className="list-disc list-inside space-y-1 ml-1">
            <li>स्थानीय रोजगार बढ़ेगा</li>
            <li>लोगों को जल्दी सेवा मिलेगी</li>
            <li>कारीगरों की आय बढ़ेगी</li>
            <li>डिजिटल सुविधा गाँव तक पहुँचेगी</li>
          </ul>
        </Section>
      </div>
    </div>
  );
};

export default AboutPage;
