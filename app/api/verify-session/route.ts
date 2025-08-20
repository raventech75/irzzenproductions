import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getPublicContractUrl, getSignedContractUrl } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");
    if (!session_id) return NextResponse.json({ error: "session_id manquant" }, { status: 400 });

    // Vérifie la session côté Stripe (récupère l’email)
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const email = session.customer_details?.email || null;

    // Retrouve la booking liée
    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .select("id")
      .eq("stripe_session_id", session_id)
      .maybeSingle();

    // Va chercher le dernier contrat pour cette booking (ou sans booking si null)
    let contract: { file_path: string } | null = null;

    if (booking?.id) {
      const { data } = await supabaseAdmin
        .from("contracts")
        .select("file_path")
        .eq("booking_id", booking.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) contract = data as any;
    } else {
      // fallback : chercher par pattern de nom (session.id dans le nom du fichier)
      const filename = `IRZZEN-Contrat-${session_id}.pdf`;
      // Si tu as stocké par date dossiers/y/m/d, on ne peut pas lister facilement sans RLS assouplie.
      // Dans ce cas, on laissera la page success patienter jusqu’à l’insert (polling).
    }

    if (!contract?.file_path) {
      return NextResponse.json({ ok: true, email, pdfUrl: null, pdfPath: null });
    }

    const path = contract.file_path;
    // Essaie public, sinon signé 10 min
    const publicUrl = getPublicContractUrl(path);
    const pdfUrl = publicUrl || (await getSignedContractUrl(path, 600));

    return NextResponse.json({ ok: true, email, pdfUrl, pdfPath: path });
  } catch (e: any) {
    console.error("verify-session error:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}