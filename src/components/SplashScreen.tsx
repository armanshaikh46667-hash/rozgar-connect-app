import { useEffect, useState } from 'react';
import { Briefcase } from 'lucide-react';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 1500);
    const done = setTimeout(onComplete, 2000);
    return () => { clearTimeout(timer); clearTimeout(done); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-gradient-to-br from-primary via-primary to-accent-foreground flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="animate-bounce mb-4">
        <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
          <Briefcase size={36} className="text-primary-foreground" />
        </div>
      </div>
      <h1 className="text-3xl font-extrabold text-primary-foreground tracking-tight">RozgarSewa</h1>
      <p className="text-primary-foreground/70 text-sm mt-1">रोज़गार सेवा</p>
      <div className="mt-8 w-12 h-1 bg-primary-foreground/30 rounded-full overflow-hidden">
        <div className="h-full bg-primary-foreground rounded-full animate-[loading_1.5s_ease-in-out]" />
      </div>
    </div>
  );
};

export default SplashScreen;
