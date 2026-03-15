import { Store, GraduationCap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BusinessRegistrationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bottom-nav-safe bg-background">
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
        <button onClick={() => navigate('/register-shop')}
          className="w-full bg-card rounded-2xl border border-border p-5 flex items-center gap-4 active:scale-[0.98] transition-transform text-left">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Store size={24} className="text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">Register Shop</p>
            <p className="text-xs text-muted-foreground">डिजिटल सेवाएँ / दुकान रजिस्टर करें</p>
          </div>
        </button>

        <button onClick={() => navigate('/register-coaching')}
          className="w-full bg-card rounded-2xl border border-border p-5 flex items-center gap-4 active:scale-[0.98] transition-transform text-left">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <GraduationCap size={24} className="text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">Register Coaching</p>
            <p className="text-xs text-muted-foreground">शिक्षा और प्रशिक्षण / कोचिंग रजिस्टर करें</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default BusinessRegistrationPage;
