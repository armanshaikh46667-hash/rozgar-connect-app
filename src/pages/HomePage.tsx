import { Search, MapPin, Briefcase, UserPlus, Users, Shield, Heart, Share2, ChevronRight, Zap, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_GROUPS, useWorkerStore } from '@/store/workerStore';
import { useT, useLanguageStore, t as translate } from '@/store/languageStore';

const HERO_CATEGORIES = [
  { name: "Electrician", emoji: "⚡", color: "from-yellow-400/20 to-yellow-500/10" },
  { name: "Plumber", emoji: "🔧", color: "from-blue-400/20 to-blue-500/10" },
  { name: "Carpenter", emoji: "🪚", color: "from-amber-400/20 to-amber-500/10" },
  { name: "Painter", emoji: "🎨", color: "from-pink-400/20 to-pink-500/10" },
  { name: "General Labor", emoji: "👷", color: "from-orange-400/20 to-orange-500/10" },
  { name: "Bike Mechanic", emoji: "🏍️", color: "from-red-400/20 to-red-500/10" },
  { name: "Domestic Worker", emoji: "🏠", color: "from-teal-400/20 to-teal-500/10" },
  { name: "Tractor Driver", emoji: "🌾", color: "from-green-400/20 to-green-500/10" },
];


const categoryEmojis: Record<string, string> = {
  "Plumber": "🔧", "Electrician": "⚡", "Rajmistri": "🧱", "Painter": "🎨",
  "Carpenter": "🪚", "Mobile Repair": "📱", "Bike Mechanic": "🏍️", "Domestic Worker": "🏠",
  "Computer Class": "💻", "Competitive Exam Coaching": "📚", "Driving School": "🚗", "Skill Training": "🎯",
  "Online Form Filling": "📝", "Aadhaar Update": "🆔", "PAN Card Apply": "💳",
  "Electricity Bill Payment": "💡", "Government Scheme Registration": "🏛️",
  "Tailoring / Boutique": "✂️", "Beauty Parlour": "💇", "Home Tutor": "👩‍🏫",
  "Cook": "👨‍🍳", "Cleaning Worker": "🧹", "Gas Stove Repair": "🔥",
  "Tractor Mechanic": "🚜", "JCB Operator": "⛏️", "Truck Driver": "🚛",
  "Auto Driver": "🛺", "Tempo Service": "🚐", "Pickup Rental": "📦",
  "General Labor": "👷", "Tiles Worker": "🧩", "Welding Worker": "⚙️",
  "Iron Work": "🔨", "Roof Casting Worker": "🏗️", "Water Tank Installation": "🚰",
  "Tractor Driver": "🌾", "Harvester / Thresher Service": "🌻", "Field Ploughing Service": "🌿",
  "Pesticide Spraying Service": "🧪", "Dairy Worker": "🥛", "Animal Doctor": "🐄", "Animal Feed Supplier": "🌽",
};

const HomePage = () => {
  const navigate = useNavigate();
  const workers = useWorkerStore(s => s.workers);
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);

  const handleShare = async () => {
    const shareData = {
      title: 'Rozgar Sewa',
      text: t('गांव में रोजगार पाएं – Rozgar Sewa के साथ'),
      url: window.location.origin,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(window.location.origin); alert(t('लिंक कॉपी हो गया!')); }
    } catch { /* cancelled */ }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-12 pb-16 text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-primary-foreground/20 blur-3xl" />
          <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-primary-foreground/15 blur-2xl" />
        </div>
        <div className="max-w-[120rem] mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Briefcase size={22} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">RozgarSewa</span>
          </div>

          {/* Animated Welcome Hero — language-aware */}
          <div key={lang} className="mb-4 animate-fade-in-up">
            {lang === 'hi' ? (
              <h2 className="welcome-hero welcome-hero--hi font-extrabold leading-tight"
                  style={{ fontSize: 'clamp(1.5rem, 1rem + 3.5vw, 4.5rem)' }}>
                <span className="welcome-glow">रोजगार कनेक्ट</span>{' '}
                <span className="opacity-90">में आपका स्वागत है</span>
              </h2>
            ) : (
              <h2 className="welcome-hero welcome-hero--en font-extrabold uppercase tracking-wider leading-tight"
                  style={{ fontSize: 'clamp(1.4rem, 0.9rem + 3.4vw, 4.5rem)' }}>
                <span className="opacity-90">Welcome to</span>{' '}
                <span className="welcome-glow">Rozgar Connect</span>
              </h2>
            )}
          </div>

          <h1 className="text-2xl font-extrabold leading-tight mb-2">
            {t('गांव में रोजगार पाएं – Rozgar Sewa के साथ')}
          </h1>
          <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
            {t('मजदूर और काम देने वाले अब सीधे जुड़ें')}
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/search')}
              className="flex-1 bg-primary-foreground text-primary py-3.5 rounded-xl text-sm font-bold shadow-lg active:scale-[0.97] transition-transform flex items-center justify-center gap-2">
              <Search size={18} /> {t('काम ढूंढें')}
            </button>
            <button onClick={() => navigate('/business-register')}
              className="flex-1 bg-primary-foreground/15 border border-primary-foreground/30 text-primary-foreground py-3.5 rounded-xl text-sm font-bold active:scale-[0.97] transition-transform flex items-center justify-center gap-2">
              <UserPlus size={18} /> {t('रजिस्टर करें')}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="max-w-[120rem] mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search size={16} className="text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">{t('त्वरित खोज')}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => navigate('/search')}
              className="flex flex-col items-center gap-1 bg-secondary rounded-xl px-2 py-3 text-center active:scale-[0.98] transition-transform">
              <Briefcase size={16} className="text-primary" />
              <span className="text-[9px] font-medium text-foreground">{t('काम के प्रकार')}</span>
            </button>
            <button onClick={() => navigate('/search')}
              className="flex flex-col items-center gap-1 bg-secondary rounded-xl px-2 py-3 text-center active:scale-[0.98] transition-transform">
              <MapPin size={16} className="text-primary" />
              <span className="text-[9px] font-medium text-foreground">{t('गाँव / शहर')}</span>
            </button>
            <button onClick={() => navigate('/search?nearby=true')}
              className="flex flex-col items-center gap-1 bg-accent rounded-xl px-2 py-3 text-center active:scale-[0.98] transition-transform">
              <Navigation size={16} className="text-accent-foreground" />
              <span className="text-[9px] font-medium text-accent-foreground">{t('GPS नज़दीक')}</span>
            </button>
            <button onClick={() => navigate('/bookings')}
              className="flex flex-col items-center gap-1 bg-accent rounded-xl px-2 py-3 text-center active:scale-[0.98] transition-transform">
              <Briefcase size={16} className="text-accent-foreground" />
              <span className="text-[9px] font-medium text-accent-foreground">{t('बुकिंग')}</span>
            </button>
          </div>
        </div>
      </div>


      {/* Popular Categories */}
      <div className="max-w-[120rem] mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">{t('लोकप्रिय सेवाएँ')}</h2>
          <button onClick={() => navigate('/search')} className="text-xs text-primary font-semibold flex items-center gap-1">
            {t('सभी देखें')} <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {HERO_CATEGORIES.map((cat) => (
            <button key={cat.name}
              onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
              className={`flex flex-col items-center gap-2 p-3.5 bg-gradient-to-br ${cat.color} rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg active:scale-[0.95] transition-all group`}>
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="text-[10px] font-bold text-foreground leading-tight text-center">{t(cat.name)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-[120rem] mx-auto px-4 mt-8">
        <div className="bg-gradient-to-r from-primary/10 to-accent rounded-2xl p-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-extrabold text-primary">{Object.values(CATEGORY_GROUPS).flat().length}+</p>
            <p className="text-[10px] text-muted-foreground font-medium">{t('श्रेणियाँ')}</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-primary">100+</p>
            <p className="text-[10px] text-muted-foreground font-medium">{t('कामगार')}</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-primary">{t('मुफ्त')}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{t('उपयोग')}</p>
          </div>
        </div>
      </div>

      {/* All Categories */}
      <div className="max-w-[120rem] mx-auto px-4 mt-8 space-y-6">
        <h2 className="text-base font-bold text-foreground">{t('सभी श्रेणियाँ')}</h2>
        {Object.entries(CATEGORY_GROUPS).map(([group, cats]) => (
          <div key={group}>
            <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">{t(group)}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 3xl:grid-cols-10 gap-2.5">
              {cats.map((cat) => (
                <button key={cat}
                  onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
                  className="bg-card rounded-xl p-3.5 text-center border border-border hover:border-primary/40 hover:shadow-lg active:scale-[0.96] transition-all group">
                  <span className="text-2xl block group-hover:scale-110 transition-transform">{categoryEmojis[cat] || '🔧'}</span>
                  <p className="text-[10px] font-bold text-foreground mt-2 leading-tight">{t(cat)}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="max-w-[120rem] mx-auto px-4 mt-8">
        <div className="bg-gradient-to-br from-primary to-accent-foreground rounded-2xl p-6 text-primary-foreground text-center">
          <Zap size={28} className="mx-auto mb-2 opacity-80" />
          <h3 className="text-lg font-bold mb-1">{t('क्या आप कामगार हैं?')}</h3>
          <p className="text-primary-foreground/80 text-sm mb-4">{t('मुफ्त में रजिस्टर करें और स्थानीय काम पाएं')}</p>
          <button onClick={() => navigate('/register')}
            className="bg-primary-foreground text-primary px-8 py-3 rounded-xl text-sm font-bold shadow-lg active:scale-[0.97] transition-transform">
            {t('अभी रजिस्टर करें')}
          </button>
        </div>
      </div>

      {/* Trust */}
      <div className="max-w-[120rem] mx-auto px-4 mt-8">
        <h2 className="text-base font-bold text-foreground mb-4 text-center">{t('हम पर भरोसा करें')}</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <Shield size={24} className="mx-auto text-primary mb-2" />
            <p className="text-xs font-bold text-foreground">{t('Verified')}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{t('सत्यापित कामगार')}</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <Heart size={24} className="mx-auto text-primary mb-2" />
            <p className="text-xs font-bold text-foreground">{t('100% मुफ्त')}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{t('कोई शुल्क नहीं')}</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <Users size={24} className="mx-auto text-primary mb-2" />
            <p className="text-xs font-bold text-foreground">{t('No Middleman')}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{t('सीधा संपर्क')}</p>
          </div>
        </div>
      </div>

      {/* Share */}
      <div className="max-w-[120rem] mx-auto px-4 mt-8">
        <button onClick={handleShare}
          className="w-full bg-secondary rounded-2xl p-4 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform border border-border">
          <Share2 size={20} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">{t('ऐप शेयर करें')}</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="max-w-[120rem] mx-auto px-4 mt-10 pb-4">
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase size={18} className="text-primary" />
            <span className="text-sm font-bold text-foreground">RozgarSewa</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
            <button onClick={() => navigate('/about')} className="hover:text-primary transition-colors">{t('About Us')}</button>
            <span>•</span>
            <button className="hover:text-primary transition-colors">{t('Contact')}</button>
            <span>•</span>
            <button className="hover:text-primary transition-colors">{t('Privacy Policy')}</button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">{t('© 2025 RozgarSewa. Made with ❤️ for rural India.')}</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
