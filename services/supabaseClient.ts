import { createClient } from '@supabase/supabase-js';

// Configuration supporting environment variables for Netlify/Production
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://lsybxavcorugotgfcsst.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_d7Bz1ciZ--DGIZdBkq8F6A_A6OvkTxB';

export const supabase = createClient(supabaseUrl, supabaseKey);