import { Search, UserPlus, LogIn, Globe, LogOut, User, Home, BookOpen, IndianRupee, Shield, Info, ClipboardList, X, Menu, ShieldCheck } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  const handleNav = (path: string) => { setDrawerOpen(false); navigate(path); };
  const handleLogout = () => { setDrawerOpen(false); logout(); navigate('/'); };
  const isActive = (path: string) => location.pathname === path;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const mobileItems = [
    { label: t('होम पेज', lang), path: '/', icon: Home },
    { label: t('काम ढूंढें', lang), path: '/search', icon: Search },
    { label: t('रजिस्टर करें', lang), path: '/business-register', icon: ClipboardList },
    ...(user ? [
      { label: t('बुकिंग', lang), path: '/bookings', icon: BookOpen },
      { label: t('कमाई', lang), path: '/earnings', icon: IndianRupee },
    ] : []),
    { label: t('About Us', lang), path: '/about', icon: Info },
    { label: t('Admin Panel', lang), path: '/admin', icon: Shield },
  ];

  // Desktop nav button base classes
  const btnBase = "flex items-center gap-2 px-5 py-2.5 rounded-[14px] text-sm font-semibold transition-all duration-200 border active:scale-[0.97]";

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b-[3px] border-primary/60 shadow-[0_2px_16px_-4px_hsl(var(--primary)/0.12)]">
        <div className="max-w-[1400px] mx-auto flex items-center h-[68px] px-5 xl:px-8 gap-4">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-primary-foreground font-black text-2xl leading-none drop-shadow-sm">R</span>
            </div>
            <span className="text-xl font-extrabold text-foreground tracking-tight">RozgarSewa</span>
          </button>

          {/* Desktop nav — hidden on mobile, visible on lg+ */}
          <nav className="hidden lg:flex items-center gap-3 ml-auto">
            {/* Search bar */}
            <div className="flex items-center rounded-[14px] border border-primary/25 shadow-sm overflow-hidden bg-card hover:border-primary/40 transition-colors">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('Search...', lang)}
                className="px-4 py-2.5 text-sm bg-transparent outline-none w-36 xl:w-44 text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSearch}
                className="bg-primary text-primary-foreground px-3.5 py-2.5 hover:bg-primary/90 transition-colors"
              >
                <Search size={16} />
              </button>
            </div>

            {/* Register — Primary highlighted */}
            <button
              onClick={() => navigate('/business-register')}
              className={`${btnBase} shadow-md hover:shadow-lg ${
                isActive('/business-register')
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                  : 'bg-primary text-primary-foreground border-primary/80 hover:bg-primary/90'
              }`}
            >
              <UserPlus size={17} />
              {t('रजिस्टर करें', lang)}
            </button>

            {/* Login / Profile — Secondary outlined */}
            {user ? (
              <button
                onClick={() => navigate(user.type === 'worker' ? `/worker/${user.id}` : '/')}
                className={`${btnBase} bg-card text-primary border-primary/30 shadow-sm hover:shadow-md hover:bg-accent hover:border-primary/50`}
              >
                <User size={17} />
                {t('प्रोफ़ाइल', lang)}
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className={`${btnBase} shadow-sm hover:shadow-md ${
                  isActive('/login')
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-primary border-primary/30 hover:bg-accent hover:border-primary/50'
                }`}
              >
                <LogIn size={17} />
                {t('लॉगिन करें', lang)}
              </button>
            )}

            {/* Translation */}
            <button
              onClick={toggle}
              className={`${btnBase} bg-card text-foreground border-border hover:bg-accent hover:border-primary/40 shadow-sm hover:shadow-md`}
            >
              <Globe size={17} className="text-primary" />
              {lang === 'hi' ? 'English' : 'हिन्दी'}
            </button>

            {/* Admin Panel */}
            <button
              onClick={() => navigate('/admin')}
              className={`${btnBase} shadow-sm hover:shadow-md ${
                isActive('/admin')
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-foreground border-border hover:bg-accent hover:border-primary/40'
              }`}
            >
              <ShieldCheck size={17} className={isActive('/admin') ? '' : 'text-primary'} />
              {t('Admin Panel', lang)}
            </button>

            {/* About Us */}
            <button
              onClick={() => navigate('/about')}
              className={`${btnBase} shadow-sm hover:shadow-md ${
                isActive('/about')
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-foreground border-border hover:bg-accent hover:border-primary/40'
              }`}
            >
              <Info size={17} className={isActive('/about') ? '' : 'text-primary'} />
              {t('About Us', lang)}
            </button>

            {/* Logout */}
            {user && (
              <button
                onClick={handleLogout}
                className={`${btnBase} border-destructive/30 text-destructive bg-card hover:bg-destructive/10 shadow-sm hover:shadow-md`}
              >
                <LogOut size={17} />
                {t('लॉगआउट', lang)}
              </button>
            )}
          </nav>

          {/* Mobile right actions */}
          <div className="flex lg:hidden items-center gap-1 ml-auto">
            <button
              onClick={() => navigate('/search')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isActive('/search') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Search size={18} />
            </button>
            <button
              onClick={toggle}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors relative"
            >
              <Globe size={18} />
              <span className="absolute -bottom-0.5 -right-0.5 text-[7px] font-black bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center leading-none shadow-sm">
                {lang === 'hi' ? 'EN' : 'हि'}
              </span>
            </button>
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
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
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
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          {user ? (
            <div>
              <p className="text-sm font-bold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.mobile}</p>
            </div>
          ) : (
            <span className="text-sm font-bold text-foreground">{t('मेनू', lang)}</span>
          )}
          <button onClick={() => setDrawerOpen(false)} className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {mobileItems.map((item) => {
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

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50 bg-card space-y-1">
          {user ? (
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut size={18} /> {t('लॉगआउट', lang)}
            </button>
          ) : (
            <button onClick={() => handleNav('/login')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary hover:bg-primary/10 transition-colors">
              <LogIn size={18} /> {t('लॉगिन करें', lang)}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default TopHeader;
