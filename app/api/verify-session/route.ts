// app/api/verify-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getSignedContractUrl, getPublicContractUrl } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");
    if (!session_id) {
      return NextResponse.json({ error: "session_id manquant" }, { status: 400 });
    }

    // On vérifie l'existence de la session Stripe (et récupère l’email client au passage)
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const email = session.customer_details?.email || null;

    // On récupère le contrat en BDD
    const { data, error } = await supabaseAdmin
      .from("contracts")
      .select("file_path")
      .eq("session_id", session_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: true, email, pdfUrl: null, pdfPath: null });
    }

    const file_path = data.file_path as string;

    // Essaie d’abord une URL publique (si bucket public), sinon une URL signée (si private)
    const publicUrl = getPublicContractUrl(file_path);
    const pdfUrl =
      publicUrl ||
      (await getSignedContractUrl(file_path, 60 * 10)); // 10 minutes

    return NextResponse.json({ ok: true, email, pdfUrl, pdfPath: file_path });
  } catch (e: any) {
    console.error("verify-session error:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}