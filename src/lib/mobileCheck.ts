import { supabase } from '@/integrations/supabase/client';

const TABLES = ['workers', 'local_businesses', 'digital_services', 'education_coaching'] as const;

export const DUPLICATE_MOBILE_MSG_HI = 'यह मोबाइल नंबर पहले से पंजीकृत है। कृपया लॉगिन करें।';
export const DUPLICATE_MOBILE_MSG_EN = 'This mobile number is already registered. Please login.';

export const duplicateMobileMessage = (lang: string) =>
  lang === 'hi' ? DUPLICATE_MOBILE_MSG_HI : DUPLICATE_MOBILE_MSG_EN;

/** Returns true when the mobile number already exists in any registration table. */
export const isMobileRegistered = async (mobile: string): Promise<boolean> => {
  const clean = mobile.trim();
  for (const table of TABLES) {
    const { data } = await supabase
      .from(table)
      .select('id')
      .eq('mobile', clean)
      .limit(1);
    if (data && data.length > 0) return true;
  }
  return false;
};
