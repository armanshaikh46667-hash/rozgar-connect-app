import { useState } from 'react';
import { X, KeyRound, Phone, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ForgotPinDialogProps {
  onClose: () => void;
}

const ForgotPinDialog = ({ onClose }: ForgotPinDialogProps) => {
  const [step, setStep] = useState<'mobile' | 'otp' | 'newpin' | 'done'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  const handleSendOtp = async () => {
    if (mobile.length !== 10) { toast.error('कृपया 10 अंकों का मोबाइल नंबर डालें'); return; }
    setLoading(true);

    // Check if mobile exists in workers
    const { data: worker } = await supabase.from('workers').select('id').eq('mobile', mobile).maybeSingle();
    if (!worker) {
      setLoading(false);
      toast.error('यह मोबाइल नंबर रजिस्टर्ड नहीं है');
      return;
    }

    // Generate 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    const { error } = await supabase.from('pin_reset_otps').insert({
      mobile,
      otp: otpCode,
    });

    setLoading(false);
    if (error) { toast.error('कुछ गलत हो गया'); return; }

    setGeneratedOtp(otpCode);
    setStep('otp');
    toast.success('OTP भेजा गया!');
  };

  const handleVerifyOtp = () => {
    if (otp !== generatedOtp) { toast.error('गलत OTP'); return; }
    setStep('newpin');
  };

  const handleResetPin = async () => {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) { toast.error('कृपया 4 अंकों का PIN डालें'); return; }
    if (newPin !== confirmPin) { toast.error('PIN मेल नहीं खाता'); return; }

    setLoading(true);
    const { error } = await supabase.from('workers').update({ pin: newPin }).eq('mobile', mobile);
    
    // Mark OTP as used
    await supabase.from('pin_reset_otps').update({ used: true }).eq('mobile', mobile).eq('otp', generatedOtp);

    setLoading(false);
    if (error) { toast.error('PIN अपडेट नहीं हो सका'); return; }

    setStep('done');
    toast.success('PIN सफलतापूर्वक बदला गया!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-sm p-5 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <KeyRound size={18} className="text-primary" /> PIN भूल गए?
          </h3>
          <button onClick={onClose} className="text-muted-foreground"><X size={20} /></button>
        </div>

        {step === 'mobile' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">अपना रजिस्टर्ड मोबाइल नंबर डालें</p>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-muted-foreground shrink-0" />
              <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10 अंकों का मोबाइल नंबर" className={inputClass} inputMode="numeric" />
            </div>
            <button onClick={handleSendOtp} disabled={loading || mobile.length !== 10}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'भेज रहे हैं...' : 'OTP भेजें'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-3">
            <div className="bg-accent/50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">OTP भेजा गया: <strong className="text-foreground">{mobile}</strong></p>
              <p className="text-2xl font-bold text-primary tracking-widest">{generatedOtp}</p>
              <p className="text-[10px] text-muted-foreground mt-1">(SMS सेवा जल्द आ रही है)</p>
            </div>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="4 अंकों का OTP डालें" className={inputClass} maxLength={4} inputMode="numeric" />
            <button onClick={handleVerifyOtp} disabled={otp.length !== 4}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">
              OTP वेरिफ़ाई करें
            </button>
          </div>
        )}

        {step === 'newpin' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-primary font-semibold">
              <ShieldCheck size={16} /> मोबाइल वेरिफ़ाई हो गया!
            </div>
            <p className="text-xs text-muted-foreground">नया 4 अंकों का PIN बनाएं</p>
            <input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="नया PIN" className={inputClass} maxLength={4} inputMode="numeric" />
            <input type="password" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="PIN दोबारा डालें" className={inputClass} maxLength={4} inputMode="numeric" />
            <button onClick={handleResetPin} disabled={loading || newPin.length !== 4}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'सेव हो रहा...' : 'नया PIN सेव करें'}
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center space-y-3">
            <ShieldCheck size={48} className="mx-auto text-primary" />
            <h4 className="font-bold text-foreground">PIN बदल गया!</h4>
            <p className="text-xs text-muted-foreground">अब आप नए PIN से प्रोफ़ाइल एडिट/डिलीट कर सकते हैं</p>
            <button onClick={onClose} className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold">
              ठीक है
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPinDialog;
