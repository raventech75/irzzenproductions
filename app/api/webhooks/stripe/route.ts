import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { buildBookingPdf } from "@/lib/pdf";
import { saveContractPDF } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

/**
 * IMPORTANT :
 * - Vercel (ou ton hébergeur) doit avoir STRIPE_WEBHOOK_SECRET (whsec_...)
 * - Stripe Dashboard → Developers → Webhooks : endpoint -> https://<ton-domaine>/api/webhooks/stripe
 * - Events : "checkout.session.completed"
 */
export async function POST(req: Request) {
  // Stripe attend le "raw body"
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("[stripe webhook] Signature invalide:", err?.message);
    return new NextResponse(`Webhook signature error: ${err?.message}`, { status: 400 });
  }

  try {
    console.log("[stripe webhook] event type:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const md = (session.metadata || {}) as Record<string, string>;
      console.log("[stripe webhook] session.id:", session.id);

      // 1) Retrouver la booking (créée quand on a ouvert la session)
      const { data: booking, error: bookingErr } = await supabaseAdmin
        .from("bookings")
        .select("id, stripe_session_id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (bookingErr) {
        console.error("[stripe webhook] erreur fetch booking:", bookingErr);
      }
      if (!booking?.id) {
        console.warn("[stripe webhook] booking introuvable pour cette session. On continue sans booking_id.");
      } else {
        console.log("[stripe webhook] booking.id:", booking.id);
      }

      // 2) Générer le PDF (métadonnées posées lors de create-payment)
      const pdfBytes: Uint8Array = await buildBookingPdf({
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
      console.log("[stripe webhook] PDF généré. Taille (octets):", pdfBytes?.byteLength ?? -1);

      // 3) Upload dans Supabase Storage (bucket "contracts")
      const filename = `IRZZEN-Contrat-${session.id}.pdf`;
      const saved = await saveContractPDF({
        pdf: Buffer.from(pdfBytes),
        filename,
      }); // => { path, publicUrl }
      console.log("[stripe webhook] PDF uploadé. path:", saved.path);

      // 4) Insert dans contracts (⚠️ bytes NOT NULL dans ton schéma)
      const bytes = Number((pdfBytes as Uint8Array).byteLength ?? 0);
      const { error: insertErr } = await supabaseAdmin.from("contracts").insert({
        booking_id: booking?.id || null, // peut être null si booking non retrouvée (on garde une trace)
        file_path: saved.path,
        bytes,
      });
      if (insertErr) {
        console.error("[stripe webhook] insert contracts ERROR:", insertErr);
        // On ne retourne pas d'erreur HTTP : Stripe réessayerait et pourrait dupliquer.
      } else {
        console.log("[stripe webhook] Ligne contracts insérée avec succès.");
      }

      // 5) Marquer la booking "paid" si on l'a
      if (booking?.id) {
        const { error: updErr } = await supabaseAdmin
          .from("bookings")
          .update({ status: "paid", updated_at: new Date().toISOString() })
          .eq("id", booking.id);
        if (updErr) console.error("[stripe webhook] update booking ERROR:", updErr);
        else console.log("[stripe webhook] booking marquée paid.");
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[stripe webhook] handler error:", err);
    return NextResponse.json({ error: err?.message || "server error" }, { status: 500 });
  }
}