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

// Extraction robuste du nom d'une formule (label/title/name)
function formulaName(f: any): string {
  return cleanSpaces(f?.label) || cleanSpaces(f?.title) || cleanSpaces(f?.name) || "Formule";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Payload attendu depuis /reservation
    const payWith: "card" | "bank" = body?.payWith || "card";
    const customerEmail: string = cleanSpaces(body?.customerEmail);

    const formulaId: string = body?.formulaId;
    const selectedOptions: string[] = Array.isArray(body?.options) ? body.options : [];
    const extras: Array<{ label: string; price: number }> = Array.isArray(body?.extras) ? body.extras : [];

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

    const formula: any = FORMULAS_DETAILED.find((f: any) => f.id === formulaId);
    if (!formula) {
      return NextResponse.json({ error: "Formule inconnue" }, { status: 400 });
    }
    const formulaLabel = formulaName(formula);

    // Prix base
    const base: number = Number(formula?.price || 0);

    // Toutes les options connues (pour retrouver l'ID → le prix/libellé)
    const allOptions: Array<{ id: string; label?: string; title?: string; name?: string; price: number }> =
      FORMULAS_DETAILED.flatMap((f: any) => f.options || []);

    // Prix options sélectionnées
    const optionPrices = selectedOptions.map((id) => {
      const found = allOptions.find((o) => o.id === id);
      return found ? Number(found.price || 0) : 0;
    });

    // Prix extras libres
    const extraPrices = extras.map((e) => Number(e?.price || 0));

    // Totaux (avec arrondi acompte à la centaine sup, etc.)
    const totals = computePricing(base, [...optionPrices, ...extraPrices]);

    // Métadonnées communes (serviront au webhook ou au PDF direct)
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

      formula: formulaLabel, // ← robuste
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

    // ============= Mode CB via Stripe =============
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
              product_data: { name: `Réservation — ${formulaLabel}` }, // ← robuste
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation?canceled=1`,
        metadata, // le webhook utilisera ces métadonnées pour générer + uploader le PDF
      });

      return NextResponse.json({ url: session.url }, { status: 200 });
    }

    // ============= Mode Virement/RIB =============
    // On génère le PDF maintenant et on l'upload; on insère une ligne en BDD pour retrouver le document
    const pdfBytes = await buildBookingPdf({
      ...metadata,
    });

    const filename = `IRZZEN-Contrat-${Date.now()}.pdf`;
    const saved = await saveContractPDF({
      pdf: Buffer.from(pdfBytes),
      filename,
    }); // -> { path, publicUrl }

    await supabaseAdmin.from("contracts").insert({
      session_id: null, // pas de session Stripe ici
      email: metadata.email || null,
      file_path: saved.path,
    });

    return NextResponse.json(
      {
        ok: true,
        pdfUrl: saved.publicUrl, // si bucket public ; sinon /success utilisera /api/verify-session pour signer
        pdfPath: saved.path,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("create-payment error:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}