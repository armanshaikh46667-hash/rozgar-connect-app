import { Store, GraduationCap, ArrowLeft, User, Monitor, HardHat, Leaf, Car, Home, Briefcase, Shield, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore, t } from '@/store/languageStore';

const options = [
  { icon: User, label: 'कामगार रजिस्टर', labelEn: 'Worker Registration', desc: 'प्लम्बर, इलेक्ट्रीशियन, पेंटर आदि', descEn: 'Plumber, Electrician, Painter etc.', route: '/register' },
  { icon: HardHat, label: 'निर्माण और श्रम', labelEn: 'Construction & Labor', desc: 'मजदूर, टाइल्स, वेल्डिंग, लोहा कार्य', descEn: 'Labor, Tiles, Welding, Iron Work', route: '/register-construction' },
  { icon: Leaf, label: 'कृषि सेवाएँ', labelEn: 'Agriculture Services', desc: 'ट्रैक्टर, हार्वेस्टर, पशु सेवा', descEn: 'Tractor, Harvester, Animal Service', route: '/register-agriculture' },
  { icon: Car, label: 'वाहन सेवाएँ', labelEn: 'Vehicle Services', desc: 'ड्राइवर, मैकेनिक, ट्रांसपोर्ट', descEn: 'Driver, Mechanic, Transport', route: '/register-vehicle' },
  { icon: Home, label: 'घरेलू सेवाएँ', labelEn: 'Home Services', desc: 'दर्जी, ब्यूटी पार्लर, कुक, ट्यूटर', descEn: 'Tailor, Beauty Parlour, Cook, Tutor', route: '/register-home-service' },
  { icon: Store, label: 'दुकान रजिस्टर', labelEn: 'Shop Registration', desc: 'हार्डवेयर, किराना, मेडिकल आदि', descEn: 'Hardware, Kirana, Medical etc.', route: '/register-shop' },
  { icon: Monitor, label: 'डिजिटल सेवाएँ', labelEn: 'Digital Services', desc: 'आधार, PAN, ऑनलाइन फॉर्म आदि', descEn: 'Aadhaar, PAN, Online Forms etc.', route: '/register-digital' },
  { icon: GraduationCap, label: 'शिक्षा और प्रशिक्षण', labelEn: 'Education & Training', desc: 'कोचिंग, कंप्यूटर क्लास, ड्राइविंग स्कूल', descEn: 'Coaching, Computer Class, Driving School', route: '/register-coaching' },
];

const BusinessRegistrationPage = () => {
  const navigate = useNavigate();
  const lang = useLanguageStore((s) => s.lang);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <div className="max-w-5xl mx-auto">
           <button onClick={() => navigate('/')} className="mb-3 flex items-center gap-2 bg-primary-foreground text-primary px-5 py-2.5 rounded-xl text-sm font-extrabold shadow-lg hover:shadow-xl active:scale-[0.97] transition-all">
            <ArrowLeft size={18} /> {t('होम पेज', lang)}
          </button>
          <h1 className="text-xl font-extrabold">{t('रजिस्ट्रेशन', lang)}</h1>
          <p className="text-primary-foreground/80 text-xs mt-1">{t('अपनी सेवा या व्यापार रजिस्टर करें', lang)}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-4 relative z-10 pb-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6">
          {/* Left side - Info section (desktop only) */}
          <div className="hidden lg:block lg:col-span-2 space-y-4">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase size={28} className="text-primary" />
              </div>
              <h2 className="text-lg font-extrabold text-foreground mb-2">RozgarSewa</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {lang === 'hi' 
                  ? 'अपनी सेवा या व्यापार को ऑनलाइन रजिस्टर करें और हजारों ग्राहकों तक पहुँचें। RozgarSewa आपको सीधे काम से जोड़ता है।'
                  : 'Register your service or business online and reach thousands of customers. RozgarSewa connects you directly to work.'}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{lang === 'hi' ? '100% मुफ्त' : '100% Free'}</p>
                    <p className="text-[10px] text-muted-foreground">{lang === 'hi' ? 'कोई शुल्क नहीं' : 'No charges'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Users size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{lang === 'hi' ? 'सीधा संपर्क' : 'Direct Contact'}</p>
                    <p className="text-[10px] text-muted-foreground">{lang === 'hi' ? 'ग्राहक सीधे कॉल करें' : 'Customers call directly'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Star size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{lang === 'hi' ? 'रेटिंग और रिव्यू' : 'Ratings & Reviews'}</p>
                    <p className="text-[10px] text-muted-foreground">{lang === 'hi' ? 'विश्वास बढ़ाएं' : 'Build trust'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-accent-foreground rounded-2xl p-5 text-primary-foreground">
              <h3 className="text-sm font-bold mb-2">💡 {lang === 'hi' ? 'क्या करना होगा?' : 'What to do?'}</h3>
              <ul className="space-y-2 text-xs text-primary-foreground/90">
                <li>1️⃣ {lang === 'hi' ? 'अपनी श्रेणी चुनें' : 'Choose your category'}</li>
                <li>2️⃣ {lang === 'hi' ? 'फॉर्म भरें और फोटो डालें' : 'Fill form and add photo'}</li>
                <li>3️⃣ {lang === 'hi' ? 'GPS लोकेशन जोड़ें' : 'Add GPS location'}</li>
                <li>4️⃣ {lang === 'hi' ? 'रजिस्टर करें — बस!' : 'Register — done!'}</li>
              </ul>
            </div>
          </div>

          {/* Right side - Registration options */}
          <div className="lg:col-span-3 space-y-3">
            {options.map((opt) => (
              <button key={opt.label} onClick={() => navigate(opt.route)}
                className="w-full bg-card rounded-2xl border border-border p-5 flex items-center gap-4 active:scale-[0.98] transition-transform text-left shadow-sm hover:shadow-md hover:border-primary/30">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <opt.icon size={24} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm">{lang === 'hi' ? opt.label : opt.labelEn}</p>
                  <p className="text-xs text-muted-foreground">{lang === 'hi' ? opt.desc : opt.descEn}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationPage;
