import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendContratASigner } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { contratId } = await req.json();

  const { data: contrat } = await supabase
    .from("contrats")
    .select("*, clients(prenom_marie1, prenom_marie2, email)")
    .eq("id", contratId)
    .single();

  if (!contrat) return NextResponse.json({ error: "Contrat introuvable" }, { status: 404 });

  const client = (contrat as any).clients;

  await sendContratASigner({
    nomClient: `${client.prenom_marie1} & ${client.prenom_marie2}`,
    email: client.email,
    titreContrat: contrat.titre,
  });

  return NextResponse.json({ success: true });
}
