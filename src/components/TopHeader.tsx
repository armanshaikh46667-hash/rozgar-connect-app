import { Search, UserPlus, LogIn, LogOut, User, Home, BookOpen, IndianRupee, Shield, Info, ClipboardList, X, Menu, Settings, ChevronDown } from 'lucide-react';
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

  return (
    <>
      <header className="sticky top-0 z-50 bg-background border-b-[3px] border-primary/50 shadow-[0_2px_12px_-4px_hsl(var(--primary)/0.10)]">
        <div className="max-w-[1400px] mx-auto flex items-center h-[60px] px-4 xl:px-6">
          
          {/* Logo — always visible */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 shrink-0 group mr-auto lg:mr-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
              <span className="text-primary-foreground font-black text-xl leading-none">R</span>
            </div>
            <span className="text-lg font-extrabold text-foreground tracking-tight">RozgarSewa</span>
          </button>

          {/* ==================== DESKTOP NAV (lg+) ==================== */}
          <nav className="hidden lg:flex items-center gap-2.5 ml-auto">

            {/* Register */}
            <button
              onClick={() => navigate('/business-register')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-[0.97] ${
                isActive('/business-register')
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-primary/5 text-primary border-primary/30 hover:bg-primary/10 hover:border-primary/50 shadow-sm hover:shadow-md'
              }`}
            >
              <UserPlus size={16} />
              {t('Register', lang)}
            </button>

            {/* Login / Profile */}
            {user ? (
              <button
                onClick={() => navigate(user.type === 'worker' ? `/worker/${user.id}` : '/')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.97]"
              >
                <User size={16} />
                {t('प्रोफ़ाइल', lang)}
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-[0.97] ${
                  isActive('/login')
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-card text-primary border-primary/40 hover:bg-primary/5 hover:border-primary/60 shadow-sm hover:shadow-md'
                }`}
              >
                <LogIn size={16} />
                {t('Login', lang)}
              </button>
            )}

            {/* Language / Translation — styled like reference with flag + dropdown arrow */}
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-border bg-card text-foreground hover:bg-accent hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.97]"
            >
              <span className="text-base leading-none">🇮🇳</span>
              <span>{lang === 'hi' ? 'हिन्दी' : 'English'}</span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>

            {/* Admin Panel */}
            <button
              onClick={() => navigate('/admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-[0.97] ${
                isActive('/admin')
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'border-border bg-card text-foreground hover:bg-accent hover:border-primary/30 shadow-sm hover:shadow-md'
              }`}
            >
              <Settings size={16} className={isActive('/admin') ? '' : 'text-primary'} />
              {t('Admin Panel', lang)}
            </button>

            {/* About Us */}
            <button
              onClick={() => navigate('/about')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-[0.97] ${
                isActive('/about')
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'border-border bg-card text-foreground hover:bg-accent hover:border-primary/30 shadow-sm hover:shadow-md'
              }`}
            >
              <Info size={16} className={isActive('/about') ? '' : 'text-primary'} />
              {t('About Us', lang)}
            </button>

            {/* Search bar */}
            <div className="flex items-center rounded-xl border border-primary/25 shadow-sm overflow-hidden bg-primary/5 hover:border-primary/40 transition-colors ml-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('Search...', lang)}
                className="px-3.5 py-2 text-sm bg-transparent outline-none w-32 xl:w-40 text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSearch}
                className="bg-primary text-primary-foreground px-3 py-2 hover:bg-primary/90 transition-colors"
              >
                <Search size={16} />
              </button>
            </div>

            {/* Logout (only when logged in) */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-destructive/30 text-destructive bg-card hover:bg-destructive/10 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.97]"
              >
                <LogOut size={16} />
                {t('लॉगआउट', lang)}
              </button>
            )}
          </nav>

          {/* ==================== MOBILE ACTIONS (below lg) ==================== */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={() => navigate('/search')}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                isActive('/search') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Search size={18} />
            </button>
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors relative"
            >
              <span className="text-base">🌐</span>
              <span className="absolute -bottom-0.5 -right-0.5 text-[7px] font-black bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none shadow-sm">
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
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                user ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {user ? <User size={18} /> : <LogIn size={18} />}
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
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
