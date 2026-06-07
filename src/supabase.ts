import { createClient } from '@supabase/supabase-js';

// Access variables with Vite environment imports
const envSource = (import.meta as any).env || {};
const supabaseUrl = envSource.VITE_SUPABASE_URL || "https://ptozmgsrimjoxnpolovy.supabase.co";
const supabaseAnonKey = envSource.VITE_SUPABASE_ANON_KEY || "sb_publishable_LTr69Z6TLonGf-IyKGOgzw_OlAjjLny";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Utilizing defaults in mock/standby mode.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
