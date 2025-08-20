import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase-server";
import BookingConfirmation from "@/emails/BookingConfirmation";
import { resend, MAIL_FROM } from "@/lib/email";
import { buildBookingPdf } from "@/lib/pdf";
import { saveContractPDF } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  try {
    const event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const email = session.customer_details?.email as string;

      const supabase = supabaseServer();
      const { data: booking } = await supabase
        .from("bookings")
        .select("*")
        .eq("stripe_session_id", session.id)
        .single();

      if (booking) {
        const { data: items } = await supabase
          .from("booking_items")
          .select("label, amount, is_formula")
          .eq("booking_id", booking.id);

        const { data: q } = await supabase
          .from("questionnaires")
          .select("answers")
          .eq("booking_id", booking.id)
          .single();

        // Enregistrer le paiement
        await supabase.from("payments").insert({
          booking_id: booking.id,
          stripe_payment_intent: session.payment_intent,
          amount: session.amount_total ? Math.round(session.amount_total / 100) : booking.deposit_suggested,
          status: "succeeded",
        });

        // Générer + sauvegarder le PDF
        const pdf = buildBookingPdf({
          booking,
          items: items || [],
          questionnaire: q?.answers || {},
        });

        const filename = `IRZZEN-Recapitulatif-${new Date().toISOString().slice(0, 10)}.pdf`;
        const saved = await saveContractPDF({ bookingId: booking.id, pdf, filename });
        await supabase
          .from("contracts")
          .insert({ booking_id: booking.id, file_path: saved.path, bytes: saved.bytes });

        // Envoyer l'email avec PJ
        await resend.emails.send({
          from: MAIL_FROM,
          to: email,
          subject: "IRZZEN — Confirmation de réservation (paiement reçu)",
          react: BookingConfirmation({
            couple: booking.couple_name,
            total: booking.total_amount,
            deposit: booking.deposit_suggested,
            remaining: booking.remaining_dayj,
          }),
          attachments: [{ filename, content: pdf.toString("base64") }],
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}