import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string, fallback: string) => {
  if (typeof window !== 'undefined' && (window as any).process?.env) {
    const val = (window as any).process.env[key];
    if (val) return val;
  }
  return fallback;
};

const supabaseUrl = getEnv('SUPABASE_URL', 'https://lsybxavcorugotgfcsst.supabase.co');
const supabaseKey = getEnv('SUPABASE_ANON_KEY', 'sb_publishable_d7Bz1ciZ--DGIZdBkq8F6A_A6OvkTxB');

export const supabase = createClient(supabaseUrl, supabaseKey);