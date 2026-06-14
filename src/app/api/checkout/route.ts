import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith("sk_test_REMPLACER")) {
    throw new Error("Clé Stripe non configurée");
  }
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const {
      formule, formule_id, total, acompte, options,
      prenom_marie1, prenom_marie2, email_client, telephone, date_mariage, lieu,
    } = await req.json();

    const origin = req.headers.get("origin") ?? "https://www.irzzenproductions.fr";
    const nomCouple = prenom_marie1 && prenom_marie2 ? `${prenom_marie1} & ${prenom_marie2}` : formule;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: "fr",
      customer_email: email_client ?? undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(acompte * 100),
            product_data: {
              name: `Acompte de réservation — Formule ${formule}`,
              description: `20% de réservation (total estimé : ${total} €). Le solde sera réglé le jour J. Aucun remboursement en cas d'annulation.`,
              images: ["https://www.irzzenproductions.fr/og-image.jpg"],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        formule,
        formule_id: formule_id ?? "",
        total: total.toString(),
        acompte: acompte.toString(),
        options: options ?? "",
        prenom_marie1: prenom_marie1 ?? "",
        prenom_marie2: prenom_marie2 ?? "",
        email_client: email_client ?? "",
        telephone: telephone ?? "",
        date_mariage: date_mariage ?? "",
        lieu: lieu ?? "",
      },
      success_url: `${origin}/reservation/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/reservation/annulation`,
      payment_intent_data: {
        description: `Acompte mariage — ${nomCouple} — Formule ${formule} — Irzzen Productions`,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Impossible de créer la session de paiement." }, { status: 500 });
  }
}
