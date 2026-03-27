import { Search, User, Menu, X, Briefcase, LogOut, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const TopHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const publicMenuItems = [
    { label: 'रजिस्टर करें', path: '/business-register', emoji: '📝' },
    { label: 'नक्शा', path: '/map', emoji: '🗺️' },
    { label: 'About Us', path: '/about', emoji: 'ℹ️' },
    { label: 'Updates', path: '/updates', emoji: '✨' },
    { label: 'Admin Panel', path: '/admin', emoji: '🛡️' },
  ];

  const loggedInExtras = [
    { label: 'बुकिंग', path: '/bookings', emoji: '📅' },
    { label: 'कमाई', path: '/earnings', emoji: '💰' },
  ];

  const menuItems = user ? [...publicMenuItems, ...loggedInExtras] : publicMenuItems;

  const handleNav = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-4">
        {/* Left: Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Briefcase size={16} className="text-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">RozgarSewa</span>
        </button>

        {/* Right: Icons */}
        <div className="flex items-center gap-1">
          <button onClick={() => navigate('/search')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${location.pathname === '/search' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}>
            <Search size={18} />
          </button>

          <button onClick={() => user ? navigate('/') : navigate('/login')}
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
                    <span className="text-foreground">मेनू</span>
                  )}
                </SheetTitle>
              </SheetHeader>

              <div className="p-3 space-y-1">
                {menuItems.map((item) => (
                  <button key={item.path} onClick={() => handleNav(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-secondary'}`}>
                    <span className="text-base">{item.emoji}</span>
                    {item.label}
                  </button>
                ))}

                <div className="border-t border-border my-2" />

                {user ? (
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut size={16} />
                    लॉगआउट
                  </button>
                ) : (
                  <button onClick={() => handleNav('/login')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                    <LogIn size={16} />
                    लॉगिन करें
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
