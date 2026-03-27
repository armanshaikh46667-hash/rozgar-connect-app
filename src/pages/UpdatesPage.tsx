import { Camera, CheckCircle2, CalendarCheck, Star, Award, MapPin, Filter, Image as ImageIcon, AlertTriangle, Shield, ClipboardList, Store, Share2, KeyRound, TrendingUp, Map, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: Camera, title: 'Worker Profile Photo', desc: 'प्रोफ़ाइल फोटो अपलोड करें।' },
  { icon: CheckCircle2, title: 'Worker Availability Status', desc: 'Available / Busy / Offline स्थिति।' },
  { icon: CalendarCheck, title: 'Simple Booking System', desc: 'तारीख, समय से बुकिंग भेजें।' },
  { icon: Star, title: 'Worker Reviews', desc: 'स्टार रेटिंग और समीक्षा दें।' },
  { icon: Award, title: 'Experience Badge', desc: '1+, 5+, 10+ वर्ष अनुभव बैज।' },
  { icon: MapPin, title: 'Location Display', desc: 'गाँव / लोकेशन दिखता है।' },
  { icon: Filter, title: 'Advanced Search Filters', desc: 'श्रेणी, गाँव, रेटिंग से खोजें।' },
  { icon: ImageIcon, title: 'Worker Work Gallery', desc: 'पिछले काम की फोटो दिखाएँ।' },
  { icon: AlertTriangle, title: 'Emergency Worker Button', desc: '1-क्लिक कॉल सुविधा।' },
  { icon: Shield, title: 'Admin Panel', desc: 'फर्जी प्रोफाइल हटाएं।' },
  { icon: ClipboardList, title: 'Booking History', desc: 'पिछली बुकिंग देखें।' },
  { icon: Store, title: 'Shop / Store Registration', desc: 'दुकानों का अलग रजिस्ट्रेशन फॉर्म।' },
  { icon: Share2, title: 'Share Worker Profile', desc: 'WhatsApp से प्रोफ़ाइल शेयर करें।' },
  { icon: KeyRound, title: 'Secret PIN Reset via OTP', desc: 'OTP से PIN रीसेट करें।' },
  { icon: TrendingUp, title: 'Worker Earnings Dashboard', desc: 'कमाई और काम का विवरण।' },
  { icon: Map, title: 'Map & Nearby Workers', desc: 'नज़दीकी कामगार नक्शे पर देखें।' },
];

const UpdatesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-10 pb-8 text-primary-foreground">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Sparkles size={20} className="text-primary-foreground" />
            </div>
            <h1 className="text-lg font-extrabold">Updates & Improvements</h1>
          </div>
          <p className="text-primary-foreground/80 text-xs leading-relaxed">
            RozgarSewa में जोड़ी गई नई सुविधाएँ और सुधार
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-lg mx-auto px-4 -mt-4 relative z-10">
        <div className="grid grid-cols-1 gap-2.5">
          {FEATURES.map((item, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-3.5 flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <item.icon size={18} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground leading-tight">{i + 1}. {item.title}</p>
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="max-w-lg mx-auto px-4 mt-6 pb-4">
        <p className="text-[10px] text-muted-foreground text-center">
          और नई सुविधाएँ जल्द आ रही हैं! 🚀
        </p>
      </div>
    </div>
  );
};

export default UpdatesPage;
