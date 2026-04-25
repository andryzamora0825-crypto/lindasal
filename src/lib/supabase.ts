import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Custom fetch to prevent sending sb_publishable keys in the Authorization header,
// which causes 'Invalid Compact JWS' because the Supabase Gateway skips token substitution
// if an explicit Authorization header is present.
const customFetch = (url: string | URL | Request, options?: RequestInit) => {
  if (options && options.headers) {
    const headers = new Headers(options.headers);
    const authHeader = headers.get("Authorization");
    if (authHeader && authHeader.includes("sb_publishable_")) {
      headers.delete("Authorization");
    }
    options.headers = Object.fromEntries(headers.entries());
  }
  return fetch(url, options);
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: customFetch,
  },
});
