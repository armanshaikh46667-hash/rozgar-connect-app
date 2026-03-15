import { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, XCircle, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  recipient_mobile: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

const NotificationsPage = () => {
  const [mobile, setMobile] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async (num: string) => {
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_mobile', num)
      .order('created_at', { ascending: false })
      .limit(50);
    setNotifications((data as Notification[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!submitted || mobile.length !== 10) return;
    fetchNotifications(mobile);

    const channel = supabase
      .channel('notifications-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        const n = payload.new as Notification;
        if (n.recipient_mobile === mobile) {
          setNotifications((prev) => [n, ...prev]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [submitted, mobile]);

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
  };

  const getIcon = (type: string) => {
    if (type === 'accepted') return <CheckCircle size={18} className="text-primary shrink-0" />;
    if (type === 'rejected') return <XCircle size={18} className="text-destructive shrink-0" />;
    return <Clock size={18} className="text-muted-foreground shrink-0" />;
  };

  const inputClass = "w-full bg-secondary text-secondary-foreground rounded-xl px-3 py-2.5 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

  if (!submitted) {
    return (
      <div className="min-h-screen bottom-nav-safe bg-background">
        <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
          <h1 className="text-2xl font-bold flex items-center gap-2"><Bell size={24} /> सूचनाएं</h1>
          <p className="text-primary-foreground/80 text-sm mt-1">अपनी बुकिंग अपडेट देखें</p>
        </div>
        <div className="max-w-lg mx-auto px-4 -mt-4">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-5 space-y-4">
            <p className="text-sm text-muted-foreground">अपना मोबाइल नंबर डालें</p>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10 अंकों का मोबाइल नंबर"
              className={inputClass}
            />
            <button
              onClick={() => mobile.length === 10 && setSubmitted(true)}
              disabled={mobile.length !== 10}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold disabled:opacity-50 active:scale-[0.97] transition-transform"
            >
              सूचनाएं देखें
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bottom-nav-safe bg-background">
      <div className="bg-gradient-to-br from-primary via-primary to-accent-foreground px-6 pt-8 pb-6 text-primary-foreground">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Bell size={24} /> सूचनाएं</h1>
        <p className="text-primary-foreground/80 text-sm mt-1">{mobile} के लिए</p>
      </div>
      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : notifications.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-8 text-center animate-fade-in">
            <Bell size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">कोई सूचना नहीं</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead(n.id)}
              className={`bg-card rounded-2xl border p-4 animate-fade-in cursor-pointer transition-all ${
                n.is_read ? 'border-border opacity-70' : 'border-primary/30 shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                {getIcon(n.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleString('hi-IN')}
                  </p>
                </div>
                {!n.is_read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
