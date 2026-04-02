import { Search, User, Menu, Briefcase, LogOut, LogIn, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore, t } from '@/store/languageStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const TopHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { lang, toggle } = useLanguageStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const publicMenuItems = [
    { label: t('रजिस्टर करें', lang), path: '/business-register' },
    { label: t('काम ढूंढें', lang), path: '/search' },
    { label: t('About Us', lang), path: '/about' },
    { label: t('Admin Panel', lang), path: '/admin' },
  ];

  const loggedInExtras = [
    { label: t('बुकिंग', lang), path: '/bookings' },
    { label: t('कमाई', lang), path: '/earnings' },
  ];

  const menuItems = user ? [...publicMenuItems, ...loggedInExtras] : publicMenuItems;

  const handleNav = (path: string) => { setMenuOpen(false); navigate(path); };
  const handleLogout = () => { setMenuOpen(false); logout(); navigate('/'); };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between h-14 px-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Briefcase size={16} className="text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">RozgarSewa</span>
        </button>

        <div className="flex items-center gap-1">
          <button onClick={() => navigate('/search')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${location.pathname === '/search' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}>
            <Search size={18} />
          </button>

          {/* Language toggle in header */}
          <button onClick={toggle}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors relative"
            aria-label="Toggle Language">
            <Globe size={17} />
            <span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-extrabold bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
              {lang === 'hi' ? 'EN' : 'हि'}
            </span>
          </button>

          <button onClick={() => {
              if (user) {
                if (user.type === 'worker') navigate(`/worker/${user.id}`);
                else navigate('/');
              } else navigate('/login');
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${user ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'}`}>
            {user ? <User size={18} /> : <LogIn size={18} />}
          </button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
                <Menu size={18} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetHeader className="p-4 pb-2 border-b border-border">
                <SheetTitle className="text-left text-sm">
                  {user ? (
                    <div>
                      <p className="font-bold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground font-normal">{user.mobile}</p>
                    </div>
                  ) : (
                    <span className="text-foreground font-bold">{t('मेनू', lang)}</span>
                  )}
                </SheetTitle>
              </SheetHeader>
              <div className="p-3 space-y-0.5">
                {menuItems.map((item) => (
                  <button key={item.path} onClick={() => handleNav(item.path)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${location.pathname === item.path ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary border border-transparent hover:border-border'}`}>
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-border my-2" />
                {user ? (
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut size={16} /> {t('लॉगआउट', lang)}
                  </button>
                ) : (
                  <button onClick={() => handleNav('/login')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                    <LogIn size={16} /> {t('लॉगिन करें', lang)}
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
