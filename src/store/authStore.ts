import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  mobile: string;
  name: string;
  type: 'worker' | 'business' | 'digital' | 'coaching';
  id: string;
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  login: (mobile: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Restore session from localStorage
  const stored = localStorage.getItem('rozgar_auth');
  const initialUser = stored ? JSON.parse(stored) : null;

  return {
    user: initialUser,
    loading: false,

    login: async (mobile, pin) => {
      set({ loading: true });

      // Check workers table
      const { data: worker } = await supabase
        .from('workers')
        .select('id, name, mobile, pin')
        .eq('mobile', mobile)
        .eq('pin', pin)
        .maybeSingle();

      if (worker) {
        const user: AuthUser = { mobile: worker.mobile, name: worker.name, type: 'worker', id: worker.id };
        localStorage.setItem('rozgar_auth', JSON.stringify(user));
        set({ user, loading: false });
        return { success: true };
      }

      // Check local_businesses
      const { data: biz } = await supabase
        .from('local_businesses')
        .select('id, name, mobile, pin')
        .eq('mobile', mobile)
        .eq('pin', pin)
        .maybeSingle();

      if (biz) {
        const user: AuthUser = { mobile: biz.mobile, name: biz.name, type: 'business', id: biz.id };
        localStorage.setItem('rozgar_auth', JSON.stringify(user));
        set({ user, loading: false });
        return { success: true };
      }

      // Check digital_services
      const { data: ds } = await supabase
        .from('digital_services')
        .select('id, owner_name, mobile, pin')
        .eq('mobile', mobile)
        .eq('pin', pin)
        .maybeSingle();

      if (ds) {
        const user: AuthUser = { mobile: ds.mobile, name: ds.owner_name, type: 'digital', id: ds.id };
        localStorage.setItem('rozgar_auth', JSON.stringify(user));
        set({ user, loading: false });
        return { success: true };
      }

      // Check education_coaching
      const { data: ec } = await supabase
        .from('education_coaching')
        .select('id, owner_name, mobile, pin')
        .eq('mobile', mobile)
        .eq('pin', pin)
        .maybeSingle();

      if (ec) {
        const user: AuthUser = { mobile: ec.mobile, name: ec.owner_name, type: 'coaching', id: ec.id };
        localStorage.setItem('rozgar_auth', JSON.stringify(user));
        set({ user, loading: false });
        return { success: true };
      }

      set({ loading: false });
      return { success: false, error: 'गलत मोबाइल नंबर या PIN' };
    },

    logout: () => {
      localStorage.removeItem('rozgar_auth');
      set({ user: null });
    },
  };
});
