import { NextResponse } from "next/server";
import { stripe, siteUrl } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase-server";
import { computePricing } from "@/lib/pricing";
import { FORMULAS, OPTIONS } from "@/lib/products";
import { resend, MAIL_FROM } from "@/lib/email";
import BookingConfirmation from "@/emails/BookingConfirmation";
import { buildBookingPdf } from "@/lib/pdf";
import { saveContractPDF } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { config, customer, wedding, paymentMethod } = await req.json();

    // 0) Re-calcul côté serveur
    const base = FORMULAS.find((f) => f.id === config.formulaId)?.price ?? 0;
    const optionPrices = [
      ...OPTIONS.filter((o) => config.options.includes(o.id)).map((o) => o.price),
      ...(config.extras || []).map((e: any) => Number(e.price) || 0),
    ];
    const pricing = computePricing(base, optionPrices);

    const supabase = supabaseServer();

    // 1) Customer
    const { data: maybe } = await supabase
      .from("customers")
      .select("*")
      .eq("email", customer.email)
      .maybeSingle();

    const { data: cust } = !maybe
      ? await supabase
          .from("customers")
          .insert({
            email: customer.email,
            phone: customer.phone,
            first_name: customer.firstName,
            last_name: customer.lastName,
          })
          .select()
          .single()
      : { data: maybe };

    // 2) Booking
    const { data: booking } = await supabase
      .from("bookings")
      .insert({
        customer_id: cust?.id ?? null,
        couple_name: wedding.couple,
        wedding_date: wedding.date || null,
        city: wedding.city || null,
        venue_ceremony: wedding.ceremony || null,
        venue_reception: wedding.reception || null,
        total_amount: pricing.total,
        deposit_suggested: pricing.depositSuggested,
        remaining_dayj: pricing.remainingDayJ,
      })
      .select()
      .single();

    // 3) Items (formule + options + extras)
    const formulaItem = {
      booking_id: booking.id,
      label: FORMULAS.find((f) => f.id === config.formulaId)?.label || "Formule",
      amount: base,
      is_formula: true,
    };
    const optionItems = OPTIONS.filter((o) => config.options.includes(o.id)).map(
      (o) => ({
        booking_id: booking.id,
        label: o.label,
        amount: o.price,
        is_formula: false,
      })
    );
    const extraItems = (config.extras || []).map((e: any) => ({
      booking_id: booking.id,
      label: e.label,
      amount: Number(e.price) || 0,
      is_formula: false,
    }));

    await supabase.from("booking_items").insert([formulaItem, ...optionItems, ...extraItems]);

    // 4) Questionnaire
    await supabase.from("questionnaires").insert({
      booking_id: booking.id,
      answers: {
        email: customer.email,
        phone: customer.phone,
        firstName: customer.firstName,
        lastName: customer.lastName,
        address: customer.address,
        ...wedding,
      },
    });

    // 5) Paiement
    if (paymentMethod === "card") {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        success_url: `${siteUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/questionnaire`,
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: { name: "Acompte réservation — IRZZEN" },
              unit_amount: pricing.depositSuggested * 100,
            },
            quantity: 1,
          },
        ],
        customer_email: customer.email,
        metadata: {
          booking_id: booking.id,
          couple: wedding.couple,
          total: String(pricing.total),
          deposit: String(pricing.depositSuggested),
          remaining: String(pricing.remainingDayJ),
        },
      });

      await supabase.from("bookings").update({ stripe_session_id: session.id }).eq("id", booking.id);

      return NextResponse.json({ checkoutUrl: session.url });
    }

    // 6) Virement : générer le PDF, l'uploader, logguer en DB, et envoyer l'email
    const { data: items } = await supabase
      .from("booking_items")
      .select("label, amount, is_formula")
      .eq("booking_id", booking.id);

    const pdf = buildBookingPdf({
      booking,
      items: items || [],
      questionnaire: {
        email: customer.email,
        phone: customer.phone,
        ...wedding,
        address: customer.address,
      },
    });

    const filename = `IRZZEN-Recapitulatif-${new Date().toISOString().slice(0, 10)}.pdf`;
    const saved = await saveContractPDF({ bookingId: booking.id, pdf, filename });
    await supabase
      .from("contracts")
      .insert({ booking_id: booking.id, file_path: saved.path, bytes: saved.bytes });

    await resend.emails.send({
      from: MAIL_FROM,
      to: customer.email,
      subject: "IRZZEN — Récapitulatif & RIB pour virement",
      react: BookingConfirmation({
        couple: wedding.couple,
        total: pricing.total,
        deposit: pricing.depositSuggested,
        remaining: pricing.remainingDayJ,
      }),
      attachments: [{ filename, content: pdf.toString("base64") }],
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message || "Erreur serveur" }, { status: 500 });
  }
}