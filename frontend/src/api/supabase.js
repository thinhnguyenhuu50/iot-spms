/**
 * Supabase Client — for frontend Realtime subscriptions.
 *
 * This client uses the public anon key and is subject to RLS.
 * It is only used for Realtime channel subscriptions, not for
 * direct data queries (those go through the backend API).
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
