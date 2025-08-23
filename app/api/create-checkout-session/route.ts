// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Ce que tu envoies depuis /reservation (à adapter si champs différents)
    const {
      customerEmail,
      couple_name,
      bride_first_name,
      bride_last_name,
      groom_first_name,
      groom_last_name,
      wedding_date,
      ceremony_address,
      ceremony_time,
      reception_address,
      reception_time,
      notes,
      formula,
      formula_description,
      total_eur,
      deposit_eur,
      remaining_eur,
      selected_options, // string (ex: "Drone, Album 30x30")
      extras,           // string (ex: "Heure sup.:150|Projection:300")
    } = body || {};

    // Montant stripe en CENTIMES (ici, total – tu peux choisir l’acompte si tu préfères)
    const amountCents = Math.round(Number(total_eur || 0) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `Réservation — ${formula || "Formule"}` },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation?canceled=1`,
      metadata: {
        couple_name: couple_name ?? "",
        bride_first_name: bride_first_name ?? "",
        bride_last_name: bride_last_name ?? "",
        groom_first_name: groom_first_name ?? "",
        groom_last_name: groom_last_name ?? "",
        email: customerEmail ?? "",
        wedding_date: wedding_date ?? "",
        ceremony_address: ceremony_address ?? "",
        ceremony_time: ceremony_time ?? "",
        reception_address: reception_address ?? "",
        reception_time: reception_time ?? "",
        notes: notes ?? "",
        formula: formula ?? "",
        formula_description: formula_description ?? "",
        total_eur: total_eur ?? "",
        deposit_eur: deposit_eur ?? "",
        remaining_eur: remaining_eur ?? "",
        selected_options: selected_options ?? "",
        extras: extras ?? "",
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    console.error("create-checkout-session error:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}