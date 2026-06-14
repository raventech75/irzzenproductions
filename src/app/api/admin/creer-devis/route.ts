import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const {
    client_nom, client_email, client_telephone, client_societe,
    client_siret, client_adresse,
    objet, lignes, remise_pct, tva_pct, total_ht, total_ttc,
    date_validite, notes,
  } = body;

  const adminSupabase = createAdminClient();

  // Générer le numéro côté serveur pour éviter les doublons
  const annee = new Date().getFullYear();
  const { data: dernierDevis } = await (adminSupabase as any)
    .from("devis")
    .select("numero")
    .like("numero", `DEV-${annee}-%`)
    .order("numero", { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextNum = 1;
  if (dernierDevis?.numero) {
    const parts = (dernierDevis.numero as string).split("-");
    nextNum = parseInt(parts[2] ?? "0", 10) + 1;
  }
  const numero = `DEV-${annee}-${String(nextNum).padStart(3, "0")}`;
  const { data, error } = await (adminSupabase as any)
    .from("devis")
    .insert({
      numero,
      client_nom,
      client_email,
      client_telephone: client_telephone || null,
      client_societe: client_societe || null,
      client_siret: client_siret || null,
      client_adresse: client_adresse || null,
      objet,
      lignes,
      remise_pct: remise_pct ?? 0,
      tva_pct: tva_pct ?? 0,
      total_ht,
      total_ttc,
      date_validite,
      notes: notes || null,
      statut: "brouillon",
    })
    .select("id")
    .single();

  if (error) {
    console.error("creer-devis error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
