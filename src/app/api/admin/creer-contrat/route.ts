import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  // Vérification session admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { client_id, titre, contenu } = await req.json();
  if (!client_id || !titre || !contenu) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  // Insertion via service role (bypass RLS)
  const adminSupabase = createAdminClient();
  const { data, error } = await (adminSupabase as any)
    .from("contrats")
    .insert({ client_id, titre, contenu, statut: "en_attente" })
    .select("id")
    .single();

  if (error) {
    console.error("creer-contrat error:", JSON.stringify(error));
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
