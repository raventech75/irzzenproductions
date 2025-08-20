import { NextResponse } from "next/server";
import Stripe from "stripe";
import { FORMULAS_DETAILED } from "@/lib/modules";
import { OPTIONS } from "@/lib/products"; // 🎯 Import des vraies options
import { computePricing } from "@/lib/pricing";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const isDev = process.env.NODE_ENV !== "production";
const SUCCESS_URL = isDev
  ? "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}"
  : `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
const CANCEL_URL = isDev
  ? "http://localhost:3000/reservation?canceled=1"
  : `${process.env.NEXT_PUBLIC_SITE_URL}/reservation?canceled=1`;

function clean(v: any) {
  return String(v ?? "")
    .replace(/\u202F/g, " ")
    .replace(/\u00A0/g, " ")
    .trim();
}

const ci = (s: string) => clean(s).toLowerCase();
const formulaName = (f: any) => clean(f?.label) || clean(f?.title) || clean(f?.name) || "Formule";

function resolveFormulaLoose(body: any) {
  const id = clean(body?.formulaId);
  const key = clean(body?.formulaKey);
  const lbl = clean(body?.formulaLabel || body?.formulaName);

  let f = FORMULAS_DETAILED.find((x: any) => x.id === id);
  if (f) return f;
  if (key) {
    f = FORMULAS_DETAILED.find((x: any) => x.id === key || ci(x.label || x.title || x.name) === ci(key));
    if (f) return f;
  }
  if (lbl) {
    f = FORMULAS_DETAILED.find((x: any) => ci(x.label || x.title || x.name) === ci(lbl));
    if (f) return f;
  }
  return FORMULAS_DETAILED[0];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Données reçues par create-payment:", JSON.stringify(body, null, 2));

    const payWith: "card" | "bank" = body?.payWith || "card";
    
    // 🎯 Extraction des données du customer depuis /checkout
    const customer = body?.customer || {};
    const customerEmail = clean(customer?.email);
    const firstName = clean(customer?.firstName);
    const lastName = clean(customer?.lastName);
    const coupleName = clean(customer?.coupleName);
    const weddingDate = clean(customer?.weddingDate);

    // 🎯 Extraction des données du questionnaire détaillé depuis /reservation
    const questionnaire = body?.questionnaire || {};
    
    // 🎯 Extraction de la config (formule + options)
    const config = body?.config || {};
    const formula: any = resolveFormulaLoose(config);
    const selectedOptions: string[] = Array.isArray(config?.options) ? config.options : [];
    const extras: Array<{ label: string; price: number }> = Array.isArray(config?.extras) ? config.extras : [];

    // Calcul des prix avec debug - UTILISATION DES VRAIES OPTIONS
    const base = Number(formula?.price || 0);
    const optionPrices = selectedOptions.map((id) => {
      const option = OPTIONS.find((o) => o.id === id); // 🎯 Utilise OPTIONS depuis products.ts
      const price = Number(option?.price || 0);
      console.log(`📋 Option ${id}: ${option?.label || 'inconnue'} = ${price}€`);
      return price;
    });
    const extraPrices = extras.map((e) => Number(e?.price || 0));
    
    console.log("💰 Prix de base (formule):", base);
    console.log("💸 Prix des options:", optionPrices);
    console.log("🎁 Prix des extras:", extraPrices);
    
    const totals = computePricing(base, [...optionPrices, ...extraPrices]);
    
    console.log("🧮 Totals recalculés dans l'API:", totals);
    console.log("💳 Acompte qui va être facturé sur Stripe:", totals.depositSuggested);

    // 🎯 Métadonnées COMPLÈTES pour Stripe (toutes les infos du questionnaire)
    const meta = {
      // Informations de base
      email: customerEmail,
      couple_name: coupleName,
      bride_first_name: clean(questionnaire?.brideFirstName) || coupleName.split('&')[0]?.trim() || firstName,
      bride_last_name: clean(questionnaire?.brideLastName) || lastName,
      groom_first_name: clean(questionnaire?.groomFirstName) || coupleName.split('&')[1]?.trim() || "",
      groom_last_name: clean(questionnaire?.groomLastName) || "",
      
      // Contact
      phone: clean(questionnaire?.phone),
      address: clean(questionnaire?.address),
      postalCode: clean(questionnaire?.postalCode),
      city: clean(questionnaire?.city),
      country: clean(questionnaire?.country),
      
      // Mariage
      wedding_date: weddingDate,
      guests: clean(questionnaire?.guests),
      
      // Lieux et horaires
      prepLocation: clean(questionnaire?.prepLocation),
      prepTime: clean(questionnaire?.prepTime),
      mairieLocation: clean(questionnaire?.mairieLocation),
      mairieTime: clean(questionnaire?.mairieTime),
      ceremonyLocation: clean(questionnaire?.ceremonyLocation),
      ceremonyTime: clean(questionnaire?.ceremonyTime),
      receptionLocation: clean(questionnaire?.receptionLocation),
      receptionTime: clean(questionnaire?.receptionTime),
      
      // Infos supplémentaires
      schedule: clean(questionnaire?.schedule),
      specialRequests: clean(questionnaire?.specialRequests),
      notes: clean(questionnaire?.specialRequests), // Alias pour les notes
      
      // Prestation
      formula: formulaName(formula),
      formula_description: Array.isArray(formula?.features) ? formula.features.join(", ") : "",
      total_eur: String(totals.total),
      deposit_eur: String(totals.depositSuggested),
      remaining_eur: String(totals.remainingDayJ),
      selected_options: selectedOptions
        .map((id) => clean(OPTIONS.find((o) => o.id === id)?.label || "")) // 🎯 Utilise OPTIONS
        .filter(Boolean)
        .join(", "),
      extras: extras.map((e) => `${clean(e.label)}:${Number(e.price || 0)}`).join("|"),
    };

    console.log("📋 Métadonnées COMPLÈTES construites pour Stripe:", meta);

    // Paiement CB (Stripe Checkout)
    if (payWith === "card") {
      // 🎯 UTILISER L'ACOMPTE (15% arrondi à la centaine supérieure) au lieu du total
      const amountCents = Math.round(Number(totals.depositSuggested) * 100);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: customerEmail || undefined,
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: { 
                name: `Acompte — ${formulaName(formula)}`,
                description: `Acompte de ${totals.depositSuggested}€ sur un total de ${totals.total}€`
              },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        success_url: SUCCESS_URL,
        cancel_url: CANCEL_URL,
        metadata: meta, // 🎯 Métadonnées cohérentes
      });

      // Enregistrement en base (optionnel)
      try {
        await supabaseAdmin.from("bookings").insert({
          stripe_session_id: session.id,
          email: meta.email || null,
          couple_name: meta.couple_name || null,
          wedding_date: meta.wedding_date || null,
          total_eur: meta.total_eur || null,
          formula: meta.formula || null,
          created_at: new Date().toISOString(),
          status: "pending",
        });
      } catch (dbError) {
        console.warn("⚠️ Erreur DB (non bloquante):", dbError);
      }

      return NextResponse.json({ url: session.url }, { status: 200 });
    }

    // Paiement par virement (si implémenté)
    return NextResponse.json(
      { error: "Paiement par virement non implémenté dans cette version" },
      { status: 400 }
    );

  } catch (e: any) {
    console.error("create-payment error:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}