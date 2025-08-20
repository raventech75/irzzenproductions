// app/api/verify-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSignedContractUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "payment_intent"],
    });

    const paid =
      session.payment_status === "paid" ||
      session.status === "complete" ||
      !!session.payment_intent;

    // Récupération email client de manière type-safe
    let email: string | null =
      session.customer_email ||
      session.customer_details?.email ||
      null;

    const cust = typeof session.customer === "object" ? session.customer : null;
    if (cust) {
      // Si c'est un DeletedCustomer -> pas d'email
      if ("deleted" in cust) {
        if (!cust.deleted) {
          email = email || (cust as Stripe.Customer).email || null;
        }
      } else {
        // Customer "vivant"
        email = email || (cust as Stripe.Customer).email || null;
      }
    }

    const md = (session.metadata || {}) as Record<string, string>;
    let pdfUrl = md.pdfUrl || "";
    const pdfPath = md.pdfPath || "";

    // Si pas d'URL publique mais un path storage, on génère une URL signée (1h)
    if (!pdfUrl && pdfPath) {
      try {
        pdfUrl = await getSignedContractUrl(pdfPath, 3600);
      } catch {
        // ignore — on renverra pdfUrl vide
      }
    }

    return NextResponse.json({
      paid,
      email,
      pdfUrl,
      metadata: md,
    });
  } catch (e: any) {
    console.error("verify-session error:", e?.message || e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}