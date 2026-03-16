import { Store, GraduationCap, ArrowLeft, User, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const options = [
  { icon: User, label: 'कामगार रजिस्टर', desc: 'प्लम्बर, इलेक्ट्रीशियन, पेंटर आदि', route: '/register' },
  { icon: Store, label: 'दुकान रजिस्टर', desc: 'हार्डवेयर, किराना, मेडिकल आदि', route: '/register-shop' },
  { icon: Monitor, label: 'डिजिटल सेवाएँ', desc: 'आधार, PAN, ऑनलाइन फॉर्म आदि', route: '/register-digital' },
  { icon: GraduationCap, label: 'शिक्षा और प्रशिक्षण', desc: 'कोचिंग, कंप्यूटर क्लास, ड्राइविंग स्कूल', route: '/register-coaching' },
];

const BusinessRegistrationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bottom-nav-safe bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <div className="max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="mb-3 flex items-center gap-1 text-primary-foreground/80 text-xs">
            <ArrowLeft size={16} /> वापस जाएं
          </button>
          <h1 className="text-xl font-extrabold">रजिस्ट्रेशन</h1>
          <p className="text-primary-foreground/80 text-xs mt-1">अपनी सेवा या व्यापार रजिस्टर करें</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 relative z-10 space-y-3">
        {options.map((opt) => (
          <button key={opt.label} onClick={() => navigate(opt.route)}
            className="w-full bg-card rounded-2xl border border-border p-5 flex items-center gap-4 active:scale-[0.98] transition-transform text-left">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <opt.icon size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BusinessRegistrationPage;
