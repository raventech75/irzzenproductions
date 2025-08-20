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
const allOptions = () => FORMULAS_DETAILED.flatMap((f: any) => f.options || []);

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

    const payWith: "card" | "bank" = body?.payWith || "card";
    const customerEmail = clean(body?.customerEmail);

    const q = body?.questionnaire || {};
    const questionnaire = {
      couple_name: clean(q?.couple_name),
      bride_first_name: clean(q?.bride_first_name),
      bride_last_name: clean(q?.bride_last_name),
      groom_first_name: clean(q?.groom_first_name),
      groom_last_name: clean(q?.groom_last_name),
      wedding_date: clean(q?.wedding_date),
      ceremony_address: clean(q?.ceremony_address),
      ceremony_time: clean(q?.ceremony_time),
      reception_address: clean(q?.reception_address),
      reception_time: clean(q?.reception_time),
      notes: clean(q?.notes),
    };

    const formula: any = resolveFormulaLoose(body);
    const selectedOptions: string[] = Array.isArray(body?.options) ? body.options : [];
    const extras: Array<{ label: string; price: number }> = Array.isArray(body?.extras) ? body.extras : [];

    const base = Number(formula?.price || 0);
    const opts = allOptions();
    const optionPrices = selectedOptions.map((id) => Number(opts.find((o) => o.id === id)?.price || 0));
    const extraPrices = extras.map((e) => Number(e?.price || 0));
    const totals = computePricing(base, [...optionPrices, ...extraPrices]);

    const meta = {
      email: customerEmail,
      ...questionnaire,
      formula: formulaName(formula),
      formula_description: Array.isArray(formula?.features) ? formula.features.join(", ") : "",
      total_eur: String(totals.total),
      deposit_eur: String(totals.depositSuggested),
      remaining_eur: String(totals.remainingDayJ),
      selected_options: selectedOptions
        .map((id) => clean(opts.find((o) => o.id === id)?.label || opts.find((o) => o.id === id)?.title || ""))
        .filter(Boolean)
        .join(", "),
      extras: extras.map((e) => `${clean(e.label)}:${Number(e.price || 0)}`).join("|"),
    };

    // Paiement CB (Stripe Checkout)
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
              product_data: { name: `Réservation — ${formulaName(formula)}` },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        success_url: SUCCESS_URL,
        cancel_url: CANCEL_URL,
        metadata: meta,
      });

      // ⚠️ Enregistre la réservation avec stripe_session_id pour que /success la retrouve
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

      return NextResponse.json({ url: session.url }, { status: 200 });
    }

    // Paiement par virement/RIB → on génère le PDF immédiatement
    const pdfBytes = await buildBookingPdf({ ...meta });
    const filename = `IRZZEN-Contrat-${Date.now()}.pdf`;
    const saved = await saveContractPDF({ pdf: Buffer.from(pdfBytes), filename });

    // On crée aussi une "booking" locale (sans session_id) pour rester homogène
    const { data: bookingRow } = await supabaseAdmin
      .from("bookings")
      .insert({
        stripe_session_id: null,
        email: meta.email || null,
        couple_name: meta.couple_name || null,
        wedding_date: meta.wedding_date || null,
        total_eur: meta.total_eur || null,
        formula: meta.formula || null,
        created_at: new Date().toISOString(),
        status: "awaiting_bank_transfer",
      })
      .select("id")
      .single();

    await supabaseAdmin.from("contracts").insert({
      booking_id: bookingRow?.id || null,
      file_path: saved.path,
      bytes: Number((pdfBytes as Uint8Array).byteLength ?? 0),
    });

    return NextResponse.json(
      { ok: true, pdfUrl: saved.publicUrl, pdfPath: saved.path },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("create-payment error:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}