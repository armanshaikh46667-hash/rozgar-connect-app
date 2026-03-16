import { Search, MapPin, Briefcase, Users, Shield, Heart, Share2, ChevronRight, Zap, Phone, Store, CalendarCheck, Navigation, Info, Map, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_GROUPS, useWorkerStore } from '@/store/workerStore';
import HomeMap from '@/components/HomeMap';

const HERO_CATEGORIES = [
  { name: "Electrician", emoji: "⚡", hindi: "इलेक्ट्रीशियन" },
  { name: "Plumber", emoji: "🔧", hindi: "प्लम्बर" },
  { name: "Carpenter", emoji: "🪚", hindi: "कारपेंटर" },
  { name: "Painter", emoji: "🎨", hindi: "पेंटर" },
  { name: "General Labor", emoji: "👷", hindi: "मज़दूर" },
  { name: "Bike Mechanic", emoji: "🏍️", hindi: "मैकेनिक" },
  { name: "Domestic Worker", emoji: "🏠", hindi: "घरेलू सहायक" },
  { name: "Tractor Driver", emoji: "🌾", hindi: "कृषि कामगार" },
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

const handleShare = async () => {
  const shareData = {
    title: 'Rozgar Sewa - रोज़गार सेवा',
    text: 'गांव में रोजगार पाएं – Rozgar Sewa के साथ! मजदूर और काम देने वाले अब सीधे जुड़ें।',
    url: window.location.origin,
  };
  try {
    if (navigator.share) await navigator.share(shareData);
    else { await navigator.clipboard.writeText(window.location.origin); alert('लिंक कॉपी हो गया!'); }
  } catch { /* cancelled */ }
};

const HomePage = () => {
  const navigate = useNavigate();
  const workers = useWorkerStore(s => s.workers);

  return (
    <div className="min-h-screen bottom-nav-safe bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-12 pb-16 text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-primary-foreground/20 blur-3xl" />
          <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-primary-foreground/15 blur-2xl" />
        </div>
        <div className="max-w-lg mx-auto relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Briefcase size={22} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">RozgarSewa</span>
          </div>
          <h1 className="text-2xl font-extrabold leading-tight mb-2">
            गांव में रोजगार पाएं –<br />Rozgar Sewa के साथ
          </h1>
          <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
            मजदूर और काम देने वाले अब सीधे जुड़ें
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/search')}
              className="flex-1 bg-primary-foreground text-primary py-3.5 rounded-xl text-sm font-bold shadow-lg active:scale-[0.97] transition-transform flex items-center justify-center gap-2">
              <Search size={18} /> काम ढूंढें
            </button>
            <button onClick={() => navigate('/business-register')}
              className="flex-1 bg-primary-foreground/15 border border-primary-foreground/30 text-primary-foreground py-3.5 rounded-xl text-sm font-bold active:scale-[0.97] transition-transform flex items-center justify-center gap-2">
              <UserPlus size={18} /> रजिस्टर करें
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="max-w-lg mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search size={16} className="text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">त्वरित खोज</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => navigate('/search')}
              className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-3 text-left active:scale-[0.98] transition-transform">
              <Briefcase size={16} className="text-primary shrink-0" />
              <span className="text-[10px] font-medium text-foreground">काम के प्रकार</span>
            </button>
            <button onClick={() => navigate('/search')}
              className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-3 text-left active:scale-[0.98] transition-transform">
              <MapPin size={16} className="text-primary shrink-0" />
              <span className="text-[10px] font-medium text-foreground">गाँव / शहर</span>
            </button>
            <button onClick={() => navigate('/search?nearby=true')}
              className="flex items-center gap-2 bg-accent rounded-xl px-3 py-3 text-left active:scale-[0.98] transition-transform">
              <Navigation size={16} className="text-accent-foreground shrink-0" />
              <span className="text-[10px] font-medium text-accent-foreground">GPS नज़दीक</span>
            </button>
          </div>
        </div>
      </div>


      {/* Updates & Improvements */}

      {/* Popular Categories */}
      <div className="max-w-lg mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">लोकप्रिय सेवाएँ</h2>
          <button onClick={() => navigate('/search')} className="text-xs text-primary font-semibold flex items-center gap-1">
            सभी देखें <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {HERO_CATEGORIES.map((cat) => (
            <button key={cat.name}
              onClick={() => navigate(`/search?category=${encodeURIComponent(cat.name)}`)}
              className="flex flex-col items-center gap-1.5 p-3 bg-card rounded-2xl border border-border hover:border-primary/40 hover:shadow-md active:scale-[0.96] transition-all">
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-[10px] font-semibold text-foreground leading-tight text-center">{cat.hindi}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-lg mx-auto px-4 mt-8">
        <div className="bg-gradient-to-r from-primary/10 to-accent rounded-2xl p-5 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-extrabold text-primary">{Object.values(CATEGORY_GROUPS).flat().length}+</p>
            <p className="text-[10px] text-muted-foreground font-medium">श्रेणियाँ</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-primary">100+</p>
            <p className="text-[10px] text-muted-foreground font-medium">कामगार</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-primary">मुफ्त</p>
            <p className="text-[10px] text-muted-foreground font-medium">उपयोग</p>
          </div>
        </div>
      </div>

      {/* All Categories */}
      <div className="max-w-lg mx-auto px-4 mt-8 space-y-6">
        <h2 className="text-base font-bold text-foreground">सभी श्रेणियाँ</h2>
        {Object.entries(CATEGORY_GROUPS).map(([group, cats]) => (
          <div key={group}>
            <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">{group}</h3>
            <div className="grid grid-cols-3 gap-2">
              {cats.map((cat) => (
                <button key={cat}
                  onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
                  className="bg-card rounded-xl p-3 text-center border border-border hover:border-primary/40 hover:shadow-md active:scale-[0.97] transition-all">
                  <span className="text-xl block">{categoryEmojis[cat] || '🔧'}</span>
                  <p className="text-[10px] font-medium text-foreground mt-1.5 leading-tight">{cat}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Live Map */}
      <div className="max-w-lg mx-auto px-4 mt-8">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Map size={18} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">नज़दीकी कामगार — नक्शा</h2>
          </div>
          <HomeMap />
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-lg mx-auto px-4 mt-6">
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center gap-2 mb-2">
            <Info size={18} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">RozgarSewa के बारे में</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            RozgarSewa एक मुफ्त डिजिटल प्लेटफॉर्म है जो ग्रामीण और छोटे शहरों में स्थानीय कामगारों और ग्राहकों को सीधे जोड़ता है। प्लम्बर, इलेक्ट्रीशियन, राजमिस्त्री, पेंटर — सभी एक जगह। बिना किसी बिचौलिए के, सीधा संपर्क करें।
          </p>
          <button onClick={() => navigate('/about')} className="mt-3 text-xs text-primary font-semibold flex items-center gap-1">
            और जानें <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-lg mx-auto px-4 mt-8">
        <div className="bg-gradient-to-br from-primary to-accent-foreground rounded-2xl p-6 text-primary-foreground text-center">
          <Zap size={28} className="mx-auto mb-2 opacity-80" />
          <h3 className="text-lg font-bold mb-1">क्या आप कामगार हैं?</h3>
          <p className="text-primary-foreground/80 text-sm mb-4">मुफ्त में रजिस्टर करें और स्थानीय काम पाएं</p>
          <button onClick={() => navigate('/register')}
            className="bg-primary-foreground text-primary px-8 py-3 rounded-xl text-sm font-bold shadow-lg active:scale-[0.97] transition-transform">
            अभी रजिस्टर करें
          </button>
        </div>
      </div>

      {/* Trust */}
      <div className="max-w-lg mx-auto px-4 mt-8">
        <h2 className="text-base font-bold text-foreground mb-4 text-center">हम पर भरोसा करें</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <Shield size={24} className="mx-auto text-primary mb-2" />
            <p className="text-xs font-bold text-foreground">Verified</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">सत्यापित कामगार</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <Heart size={24} className="mx-auto text-primary mb-2" />
            <p className="text-xs font-bold text-foreground">100% मुफ्त</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">कोई शुल्क नहीं</p>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 text-center">
            <Users size={24} className="mx-auto text-primary mb-2" />
            <p className="text-xs font-bold text-foreground">No Middleman</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">सीधा संपर्क</p>
          </div>
        </div>
      </div>

      {/* Share */}
      <div className="max-w-lg mx-auto px-4 mt-8">
        <button onClick={handleShare}
          className="w-full bg-secondary rounded-2xl p-4 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform border border-border">
          <Share2 size={20} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">ऐप शेयर करें</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="max-w-lg mx-auto px-4 mt-10 pb-4">
        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase size={18} className="text-primary" />
            <span className="text-sm font-bold text-foreground">RozgarSewa</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground mb-4">
            <button onClick={() => navigate('/about')} className="hover:text-primary transition-colors">About Us</button>
            <span>•</span>
            <button className="hover:text-primary transition-colors">Contact</button>
            <span>•</span>
            <button className="hover:text-primary transition-colors">Privacy Policy</button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">© 2025 RozgarSewa. Made with ❤️ for rural India.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
