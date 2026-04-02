import { Search, User, Menu, Briefcase, LogOut, LogIn, Globe, Home, BookOpen, IndianRupee, Shield, MessageCircle, X, ClipboardList } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore, t } from '@/store/languageStore';

const TopHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { lang, toggle } = useLanguageStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems = [
    { label: t('होम पेज', lang), path: '/', icon: Home },
    { label: t('काम ढूंढें', lang), path: '/search', icon: Search },
    { label: t('रजिस्टर करें', lang), path: '/business-register', icon: ClipboardList },
    ...(user ? [
      { label: t('बुकिंग', lang), path: '/bookings', icon: BookOpen },
      { label: t('कमाई', lang), path: '/earnings', icon: IndianRupee },
    ] : []),
    { label: t('About Us', lang), path: '/about', icon: Briefcase },
    { label: t('Admin Panel', lang), path: '/admin', icon: Shield },
  ];

  const handleNav = (path: string) => { setDrawerOpen(false); navigate(path); };
  const handleLogout = () => { setDrawerOpen(false); logout(); navigate('/'); };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/98 backdrop-blur-xl border-b border-border/60 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Briefcase size={18} className="text-primary-foreground" />
            </div>
            <span className="text-base font-extrabold text-foreground tracking-tight">RozgarSewa</span>
          </button>

          {/* Desktop horizontal nav - hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Search - mobile only (desktop has it in nav) */}
            <button
              onClick={() => navigate('/search')}
              className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isActive('/search') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Search size={18} />
            </button>

            {/* Language toggle */}
            <button
              onClick={toggle}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors relative"
              aria-label="Toggle Language"
            >
              <Globe size={18} />
              <span className="absolute -bottom-0.5 -right-0.5 text-[7px] font-black bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center leading-none shadow-sm">
                {lang === 'hi' ? 'EN' : 'हि'}
              </span>
            </button>

            {/* Login / Profile */}
            <button
              onClick={() => {
                if (user) {
                  if (user.type === 'worker') navigate(`/worker/${user.id}`);
                  else navigate('/');
                } else navigate('/login');
              }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                user ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {user ? <User size={18} /> : <LogIn size={18} />}
            </button>

            {/* Desktop logout */}
            {user && (
              <button
                onClick={handleLogout}
                className="hidden lg:flex w-10 h-10 rounded-xl items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                title={t('लॉगआउट', lang)}
              >
                <LogOut size={18} />
              </button>
            )}

            {/* Hamburger - mobile only */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
        </div>
      )}

      {/* Mobile slide-in drawer */}
      <div
        className={`fixed top-0 right-0 z-[101] h-full w-[280px] bg-card shadow-2xl border-l border-border/50 transform transition-transform duration-300 ease-out lg:hidden ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          {user ? (
            <div>
              <p className="text-sm font-bold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.mobile}</p>
            </div>
          ) : (
            <span className="text-sm font-bold text-foreground">{t('मेनू', lang)}</span>
          )}
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer menu items */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-foreground hover:bg-secondary border border-transparent hover:border-border/50'
                }`}
              >
                <Icon size={18} className={isActive(item.path) ? 'text-primary-foreground' : 'text-muted-foreground'} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Drawer footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-card space-y-1">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut size={18} /> {t('लॉगआउट', lang)}
            </button>
          ) : (
            <button
              onClick={() => handleNav('/login')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
            >
              <LogIn size={18} /> {t('लॉगिन करें', lang)}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default TopHeader;
