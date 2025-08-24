import { NextResponse } from "next/server";
import Stripe from "stripe";
import { FORMULAS_DETAILED } from "@/lib/modules";
import { OPTIONS } from "@/lib/products";
import { computePricing } from "@/lib/pricing";
import { supabaseAdmin } from "@/lib/supabase-admin";
// Commenté temporairement pour test : import { buildBookingPdf } from "@/lib/pdf";

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

function formatTime(time?: string) {
  if (!time) return "";
  return time.replace(/^(\d{2}):(\d{2})/, "$1h$2");
}

function slug(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  try {
    console.log("🔥 DEBUG: API create-payment appelée !");
    
    const body = await req.json();
    console.log("🔥 BODY COMPLET:", JSON.stringify(body, null, 2));

    const payWith: "card" | "bank" = body?.payWith || "card";
    console.log("💳 PayWith:", payWith);
    
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
      const option = OPTIONS.find((o) => o.id === id);
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
      postal_code: clean(questionnaire?.postalCode),
      city: clean(questionnaire?.city),
      country: clean(questionnaire?.country),
      
      // Mariage
      wedding_date: weddingDate,
      guests: clean(questionnaire?.guests),
      
      // Lieux et horaires
      prep_location: clean(questionnaire?.prepLocation),
      prep_time: clean(questionnaire?.prepTime),
      mairie_location: clean(questionnaire?.mairieLocation),
      mairie_time: clean(questionnaire?.mairieTime),
      ceremony_location: clean(questionnaire?.ceremonyLocation),
      ceremony_time: clean(questionnaire?.ceremonyTime),
      reception_location: clean(questionnaire?.receptionLocation),
      reception_time: clean(questionnaire?.receptionTime),
      
      // Infos supplémentaires
      schedule: clean(questionnaire?.schedule),
      special_requests: clean(questionnaire?.specialRequests),
      
      // Prestation
      formula: formulaName(formula),
      formula_id: formula?.id,
      total_eur: String(totals.total),
      deposit_eur: String(totals.depositSuggested),
      remaining_eur: String(totals.remainingDayJ),
      
      // Options et extras (format JSON pour récupération plus facile)
      selected_options: JSON.stringify(selectedOptions),
      selected_options_labels: selectedOptions
        .map((id) => clean(OPTIONS.find((o) => o.id === id)?.label || ""))
        .filter(Boolean)
        .join(", "),
      extras: JSON.stringify(extras),
    };

    console.log("📋 Métadonnées COMPLÈTES construites pour Stripe:", meta);

    // Créer la session Stripe
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
      metadata: meta,
    });

    console.log("🎉 Session Stripe créée:", session.id);

    // 🚫 GÉNÉRATION PDF DÉSACTIVÉE TEMPORAIREMENT POUR TEST
    console.log("🔧 [TEST] Génération PDF désactivée dans create-payment");
    console.log("📄 Le PDF sera généré uniquement par verify-session");

    /*
    // 🎯 GÉNÉRATION PDF DÉSACTIVÉE TEMPORAIREMENT
    try {
      console.log("📄 DÉBUT GÉNÉRATION PDF AVANCÉ...");

      // Préparer les données pour le nouveau générateur PDF
      const pdfData = {
        couple_name: meta.couple_name,
        email: meta.email,
        wedding_date: meta.wedding_date,
        formula: meta.formula,
        total_eur: Number(meta.total_eur),
        // ... reste des données
      };

      const pdfBytes = await buildBookingPdf(pdfData);
      // ... upload etc
      
    } catch (pdfError) {
      console.error("❌ ERREUR GÉNÉRATION PDF:", pdfError);
    }
    */

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (e: any) {
    console.error("❌ Erreur create-payment:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}