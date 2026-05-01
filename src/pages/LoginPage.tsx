import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Briefcase, Phone, Lock, LogIn, ChevronLeft } from 'lucide-react';
import { useT } from '@/store/languageStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const t = useT();
  const [mobile, setMobile] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mobile.length !== 10) { setError('10 अंकों का मोबाइल नंबर डालें'); return; }
    if (pin.length !== 4) { setError('4 अंकों का PIN डालें'); return; }
    const result = await login(mobile, pin);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'लॉगिन विफल');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-10 pb-16 text-primary-foreground">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-6">
          <ChevronLeft size={18} /> वापस
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Briefcase size={24} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">RozgarSewa</h1>
            <p className="text-primary-foreground/70 text-xs">अपने अकाउंट में लॉगिन करें</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto w-full px-4 -mt-8 relative z-10">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-1">लॉगिन</h2>
          <p className="text-xs text-muted-foreground mb-6">रजिस्टर्ड मोबाइल नंबर और Secret PIN डालें</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">मोबाइल नंबर</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="tel" inputMode="numeric" maxLength={10} value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Secret PIN</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="password" inputMode="numeric" maxLength={4} value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="4 अंकों का PIN"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>

            {error && <p className="text-xs text-destructive font-medium">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-50">
              <LogIn size={18} />
              {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            अकाउंट नहीं है?{' '}
            <button onClick={() => navigate('/business-register')} className="text-primary font-semibold">रजिस्टर करें</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
