import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ ok: false, error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    const paid =
      session.payment_status === "paid" ||
      (typeof session.payment_intent === "object" && session.payment_intent?.status === "succeeded");

    const email = session.customer_email || null;
    const pdfUrl = (session.metadata && (session.metadata as any).pdfUrl) || null;

    // On renvoie aussi les métadonnées pour le récap
    const metadata: Record<string, string | null | undefined> =
      (session.metadata as any) || {};

    return NextResponse.json({
      ok: true,
      paid,
      email,
      pdfUrl,
      currency: session.currency,
      amount_total: session.amount_total,
      session_status: session.status,
      metadata,
    });
  } catch (err: any) {
    console.error("verify-session error:", err?.message || err);
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}