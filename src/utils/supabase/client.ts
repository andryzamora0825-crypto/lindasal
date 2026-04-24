// Re-exporta el cliente centralizado de @/lib/supabase
// Usa @supabase/supabase-js (ya instalado) — sin necesidad de @supabase/ssr
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = () =>
  createSupabaseClient(supabaseUrl, supabaseKey);
