import { Mic, MicOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';

interface VoiceMicProps {
  onResult: (text: string) => void;
  className?: string;
  size?: number;
}

// Web Speech API typings (loose)
type SR = any;

const VoiceMic = ({ onResult, className = '', size = 18 }: VoiceMicProps) => {
  const lang = useLanguageStore((s) => s.lang);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recogRef = useRef<SR | null>(null);

  useEffect(() => {
    const W = window as any;
    const SpeechRecognition = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const r: SR = new SpeechRecognition();
    r.continuous = false;
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    r.onresult = (e: any) => {
      const text = e.results?.[0]?.[0]?.transcript ?? '';
      if (text) onResult(text);
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recogRef.current = r;
    return () => { try { r.abort(); } catch {} };
  }, [lang, onResult]);

  const toggle = () => {
    const r = recogRef.current;
    if (!r) return;
    if (listening) { try { r.stop(); } catch {} setListening(false); return; }
    try { r.start(); setListening(true); } catch { setListening(false); }
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Voice search"
      className={`relative inline-flex items-center justify-center rounded-xl transition-all ${
        listening
          ? 'bg-destructive text-destructive-foreground animate-pulse shadow-[0_0_0_4px_hsl(var(--destructive)/0.25)]'
          : 'bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground'
      } ${className}`}
    >
      {listening ? <MicOff size={size} /> : <Mic size={size} />}
      {listening && (
        <span className="absolute inset-0 rounded-xl ring-2 ring-destructive/60 animate-ping" />
      )}
    </button>
  );
};

export default VoiceMic;
