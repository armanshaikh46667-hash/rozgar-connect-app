import { Home, Search, UserPlus, CalendarCheck, Sparkles, Menu, X, Shield, Info, Map } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const mainTabs = [
  { label: 'होम', icon: Home, path: '/' },
  { label: 'खोजें', icon: Search, path: '/search' },
  { label: 'रजिस्टर', icon: UserPlus, path: '/register' },
  { label: 'बुकिंग', icon: CalendarCheck, path: '/bookings' },
];

const moreTabs = [
  { label: 'नक्शा', icon: Map, path: '/map' },
  { label: 'स्थानीय दुकानें', icon: Store, path: '/businesses' },
  { label: 'About Us', icon: Info, path: '/about' },
  { label: 'Admin Panel', icon: Shield, path: '/admin' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowMore(false)}>
          <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border rounded-t-2xl p-4 z-50 animate-fade-in max-w-lg mx-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-foreground">और विकल्प</span>
              <button onClick={() => setShowMore(false)}><X size={18} className="text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {moreTabs.map(tab => (
                <button key={tab.path} onClick={() => { navigate(tab.path); setShowMore(false); }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === tab.path ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border shadow-lg">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {mainTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button key={tab.path} onClick={() => navigate(tab.path)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{tab.label}</span>
              </button>
            );
          })}
          <button onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${showMore ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <Menu size={20} />
            <span className="text-[10px] font-medium">और</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
