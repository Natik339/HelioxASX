import { createClient } from '@supabase/supabase-js';

// Access variables with Vite environment imports
const envSource = (import.meta as any).env || {};
const supabaseUrl = envSource.VITE_SUPABASE_URL;
const supabaseAnonKey = envSource.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Utilizing defaults in mock/standby mode.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
