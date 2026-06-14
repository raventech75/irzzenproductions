import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDevisClient, sendDevisAdmin } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { devisId, pdfBase64 } = await req.json();

  const adminSupabase = createAdminClient();
  const { data: devis, error } = await (adminSupabase as any)
    .from("devis")
    .select("*")
    .eq("id", devisId)
    .single();

  if (error || !devis) {
    return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  }

  const pdfBuffer = pdfBase64 ? Buffer.from(pdfBase64, "base64") : null;

  try {
    await Promise.all([
      sendDevisClient(devis, pdfBuffer),
      sendDevisAdmin(devis),
    ]);

    await (adminSupabase as any)
      .from("devis")
      .update({ statut: "envoye", envoye_le: new Date().toISOString() })
      .eq("id", devisId);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("envoyer-devis error:", err);
    return NextResponse.json({ error: err.message ?? "Erreur envoi email" }, { status: 500 });
  }
}
