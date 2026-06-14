import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const STATUTS_VALIDES = ["brouillon", "envoye", "accepte", "refuse", "expire"] as const;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { devisId, statut } = await req.json();

  if (!STATUTS_VALIDES.includes(statut)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const adminSupabase = createAdminClient();
  const { error } = await (adminSupabase as any)
    .from("devis")
    .update({ statut })
    .eq("id", devisId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
