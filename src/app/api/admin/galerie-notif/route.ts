import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendGalerieDisponible } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { galerieId } = await req.json();

  const { data: galerie } = await supabase
    .from("galeries")
    .select("*, clients(prenom_marie1, prenom_marie2, email)")
    .eq("id", galerieId)
    .single();

  if (!galerie) return NextResponse.json({ error: "Galerie introuvable" }, { status: 404 });

  const client = (galerie as any).clients;
  const nomClient = `${client.prenom_marie1} & ${client.prenom_marie2}`;

  await sendGalerieDisponible({
    nomClient,
    email: client.email,
    nomGalerie: galerie.nom,
    nbPhotos: galerie.nb_fichiers,
  });

  // Activer la galerie automatiquement
  await supabase.from("galeries").update({ actif: true }).eq("id", galerieId);

  return NextResponse.json({ success: true });
}
