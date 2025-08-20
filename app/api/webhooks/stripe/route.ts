// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { buildBookingPdf } from "@/lib/pdf";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { saveContractPDF } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = (req.headers.get("stripe-signature") as string) || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const md = (session.metadata || {}) as Record<string, string>;

      // 1) Générer le PDF contrat (mise en page “pro”)
      const pdfBytes = await buildBookingPdf({
        couple_name: md.couple_name,
        bride_first_name: md.bride_first_name,
        bride_last_name: md.bride_last_name,
        groom_first_name: md.groom_first_name,
        groom_last_name: md.groom_last_name,
        email: md.email || session.customer_details?.email || "",
        wedding_date: md.wedding_date,
        ceremony_address: md.ceremony_address,
        ceremony_time: md.ceremony_time,
        reception_address: md.reception_address,
        reception_time: md.reception_time,
        notes: md.notes,
        formula: md.formula,
        formula_description: md.formula_description,
        total_eur: md.total_eur,
        deposit_eur: md.deposit_eur,
        remaining_eur: md.remaining_eur,
        selected_options: md.selected_options,
        extras: md.extras,
      });

      // 2) Enregistrer en Storage (bucket "contracts")
      const filename = `IRZZEN-Contrat-${session.id}.pdf`;
      const saved = await saveContractPDF({
        pdf: Buffer.from(pdfBytes), // ✅ CORRECTION: utiliser "pdf" (pas "file")
        filename,
      }); // -> { path, publicUrl }

      // 3) Enregistrer une ligne en BDD
      await supabaseAdmin
        .from("contracts")
        .insert({
          session_id: session.id,
          email: md.email || session.customer_details?.email || null,
          file_path: saved.path,
        });

      // Option: envoi email ici si tu veux automatique (sinon bouton sur /success)
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("webhook handler error:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}