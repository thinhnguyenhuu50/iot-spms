import { createClient } from '@supabase/supabase-js';
import env from './env.js';

// Public client — uses anon key, subject to RLS policies.
// Use this for operations on behalf of authenticated users.
const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

// Admin client — uses service_role key, BYPASSES RLS.
// Use this for backend-only operations (sensor updates, session management).
const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);

export default supabase;
export { supabaseAdmin };
