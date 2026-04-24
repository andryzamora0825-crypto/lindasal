// Server-side Supabase client usando @supabase/supabase-js
// Compatible con Next.js App Router (sin necesidad de @supabase/ssr)
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = () =>
  createSupabaseClient(supabaseUrl, supabaseKey);
