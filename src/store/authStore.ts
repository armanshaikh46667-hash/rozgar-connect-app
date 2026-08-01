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

const STORAGE_KEY = 'rozgar_auth';

// Session-scoped storage: closing the browser/app clears it -> auto logout.
const readStored = (): AuthUser | null => {
  try {
    // migrate away from any old persistent session
    localStorage.removeItem(STORAGE_KEY);
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: readStored(),
  loading: false,

  login: async (mobile, pin) => {
    set({ loading: true });
    const m = mobile.trim();
    const p = pin.trim();

    const finish = (user: AuthUser) => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      set({ user, loading: false });
      return { success: true };
    };

    try {
      const { data: workers } = await supabase
        .from('workers')
        .select('id, name, mobile, pin')
        .eq('mobile', m)
        .eq('pin', p)
        .limit(1);
      if (workers?.length) {
        const w = workers[0];
        return finish({ mobile: w.mobile, name: w.name, type: 'worker', id: w.id });
      }

      const { data: bizs } = await supabase
        .from('local_businesses')
        .select('id, name, mobile, pin')
        .eq('mobile', m)
        .eq('pin', p)
        .limit(1);
      if (bizs?.length) {
        const b = bizs[0];
        return finish({ mobile: b.mobile, name: b.name, type: 'business', id: b.id });
      }

      const { data: dss } = await supabase
        .from('digital_services')
        .select('id, owner_name, mobile, pin')
        .eq('mobile', m)
        .eq('pin', p)
        .limit(1);
      if (dss?.length) {
        const d = dss[0];
        return finish({ mobile: d.mobile, name: d.owner_name, type: 'digital', id: d.id });
      }

      const { data: ecs } = await supabase
        .from('education_coaching')
        .select('id, owner_name, mobile, pin')
        .eq('mobile', m)
        .eq('pin', p)
        .limit(1);
      if (ecs?.length) {
        const e = ecs[0];
        return finish({ mobile: e.mobile, name: e.owner_name, type: 'coaching', id: e.id });
      }
    } catch {
      set({ loading: false });
      return { success: false, error: 'नेटवर्क समस्या, दोबारा कोशिश करें' };
    }

    set({ loading: false });
    return { success: false, error: 'गलत मोबाइल नंबर या PIN' };
  },

  logout: () => {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null });
  },
}));
