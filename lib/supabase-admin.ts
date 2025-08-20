// lib/supabase-admin.ts
import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
}

/**
 * Client Supabase à privilèges (Service Role) — côté serveur uniquement.
 * Bypass les policies RLS pour les écritures/lectures back-end (API routes).
 * ⚠️ Ne jamais exposer SUPABASE_SERVICE_ROLE_KEY au client.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
    global: { headers: { "X-Client-Info": "irzzen-admin" } },
  }
);