// app/api/create-payment/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { buildBookingPdf } from "@/lib/pdf";
import { FORMULAS_DETAILED } from "@/lib/modules";
import { computePricing } from "@/lib/pricing";
import { saveContractPDF } from "@/lib/storage";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

function cleanSpaces(v: string | undefined | null) {
  return (v ?? "").replace(/\u202F/g, " ").replace(/\u00A0/g, " ").trim();
}
function ci(v: string) {
  return cleanSpaces(v).toLowerCase();
}
function formulaNameLoose(f: any): string {
  return cleanSpaces(f?.label) || cleanSpaces(f?.title) || cleanSpaces(f?.name) || "Formule";
}

/** Trouve la formule de manière tolérante à partir de plusieurs clés possibles */
function resolveFormulaLoose(body: any) {
  const id = cleanSpaces(body?.formulaId);
  const key = cleanSpaces(body?.formulaKey);
  const lbl = cleanSpaces(body?.formulaLabel);
  const nm = cleanSpaces(body?.formulaName);

  // 1) par id exact
  let f = FORMULAS_DETAILED.find((x: any) => x.id === id);
  if (f) return f;

  // 2) par clé éventuelle (si tu as introduit un autre champ côté client)
  if (key) {
    f = FORMULAS_DETAILED.find((x: any) => x.id === key || ci(x.label || x.title || x.name) === ci(key));
    if (f) return f;
  }

  // 3) par label/title/name (case-insensitive)
  const target = ci(lbl || nm || "");
  if (target) {
    f = FORMULAS_DETAILED.find((x: any) => ci(x.label || x.title || x.name) === target);
    if (f) return f;
  }

  // 4) fallback : première formule (et on log)
  console.warn("[create-payment] Aucune formule trouvée avec", { id, key, lbl, nm });
  return FORMULAS_DETAILED[0];
}

/** Récupère toutes les options connues (pour matcher les IDs envoyés par le front) */
function getAllOptions() {
  return FORMULAS_DETAILED.flatMap((f: any) => f.options || []);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // --- payload depuis /reservation ---
    const payWith: "card" | "bank" = body?.payWith || "card";
    const customerEmail: string = cleanSpaces(body?.customerEmail);

    // Formule — robust matching
    const formula: any = resolveFormulaLoose(body);
    const formulaLabel = formulaNameLoose(formula);
    const base: number = Number(formula?.price || 0);

    // Options
    const selectedOptions: string[] = Array.isArray(body?.options) ? body.options : [];
    const allOptions: Array<{ id: string; label?: string; title?: string; name?: string; price: number }> = getAllOptions();
    const optionPrices = selectedOptions.map((id) => {
      const found = allOptions.find((o) => o.id === id);
      return found ? Number(found.price || 0) : 0;
    });

    // Extras libres
    const extras: Array<{ label: string; price: number }> = Array.isArray(body?.extras) ? body.extras : [];
    const extraPrices = extras.map((e) => Number(e?.price || 0));

    // Questionnaire
    const q = body?.questionnaire || {};
    const questionnaire = {
      couple_name: cleanSpaces(q?.couple_name),
      bride_first_name: cleanSpaces(q?.bride_first_name),
      bride_last_name: cleanSpaces(q?.bride_last_name),
      groom_first_name: cleanSpaces(q?.groom_first_name),
      groom_last_name: cleanSpaces(q?.groom_last_name),
      wedding_date: cleanSpaces(q?.wedding_date),
      ceremony_address: cleanSpaces(q?.ceremony_address),
      ceremony_time: cleanSpaces(q?.ceremony_time),
      reception_address: cleanSpaces(q?.reception_address),
      reception_time: cleanSpaces(q?.reception_time),
      notes: cleanSpaces(q?.notes),
    };

    // Totaux (15% arrondi centaine sup. via computePricing)
    const totals = computePricing(base, [...optionPrices, ...extraPrices]);

    // Métadonnées (pour Stripe + PDF)
    const metadata = {
      email: customerEmail,
      couple_name: questionnaire.couple_name,
      bride_first_name: questionnaire.bride_first_name,
      bride_last_name: questionnaire.bride_last_name,
      groom_first_name: questionnaire.groom_first_name,
      groom_last_name: questionnaire.groom_last_name,
      wedding_date: questionnaire.wedding_date,
      ceremony_address: questionnaire.ceremony_address,
      ceremony_time: questionnaire.ceremony_time,
      reception_address: questionnaire.reception_address,
      reception_time: questionnaire.reception_time,
      notes: questionnaire.notes,

      formula: formulaLabel,
      formula_description: Array.isArray(formula?.features) ? formula.features.join(", ") : "",
      total_eur: String(totals.total),
      deposit_eur: String(totals.depositSuggested),
      remaining_eur: String(totals.remainingDayJ),

      selected_options: selectedOptions
        .map((id) => {
          const opt = allOptions.find((o) => o.id === id);
          const name = cleanSpaces((opt as any)?.label) || cleanSpaces((opt as any)?.title) || cleanSpaces((opt as any)?.name);
          return name;
        })
        .filter(Boolean)
        .join(", "),

      extras: extras
        .map((e) => `${cleanSpaces(e.label)}:${Number(e.price || 0)}`)
        .join("|"),
    };

    // === Paiement CB (Stripe Checkout) ===
    if (payWith === "card") {
      const amountCents = Math.round(Number(totals.total) * 100);

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: customerEmail || undefined,
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: { name: `Réservation — ${formulaLabel}` },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation?canceled=1`,
        metadata,
      });

      return NextResponse.json({ url: session.url }, { status: 200 });
    }

    // === Paiement par virement / RIB ===
    const pdfBytes = await buildBookingPdf({ ...metadata });
    const filename = `IRZZEN-Contrat-${Date.now()}.pdf`;
    const saved = await saveContractPDF({ pdf: Buffer.from(pdfBytes), filename });

    await supabaseAdmin.from("contracts").insert({
      session_id: null,
      email: metadata.email || null,
      file_path: saved.path,
    });

    return NextResponse.json(
      {
        ok: true,
        pdfUrl: saved.publicUrl, // si bucket public ; sinon /success signera l’URL
        pdfPath: saved.path,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("create-payment error:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}