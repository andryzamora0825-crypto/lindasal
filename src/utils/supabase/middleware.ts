import { type NextRequest, NextResponse } from "next/server";

// Middleware simplificado: no requiere @supabase/ssr
// Las sesiones se manejan del lado del cliente con @supabase/supabase-js
export const updateSession = async (request: NextRequest) => {
  return NextResponse.next({ request });
};
