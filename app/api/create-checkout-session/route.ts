// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ⚠️ Ces infos viennent d’un formulaire client (par ex. sur ton site)
    const {
      bride_first_name,
      bride_last_name,
      groom_first_name,
      groom_last_name,
      wedding_date,
      formula,
      total_amount, // en €
      client_email,
    } = body;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: client_email, // visible dans Stripe
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Formule ${formula}`,
              description: `Prestation mariage le ${wedding_date}`,
            },
            unit_amount: total_amount * 100, // Stripe attend des centimes
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation/canceled`,

      // ✅ Ici on stocke toutes les infos pour verify-session.ts
      metadata: {
        bride_first_name,
        bride_last_name,
        groom_first_name,
        groom_last_name,
        wedding_date,
        formula,
        total_amount: String(total_amount),
        client_email,
      },
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error("[create-checkout-session] error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}