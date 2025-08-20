// app/api/create-payment/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { computePricing } from "@/lib/pricing";
import { FORMULAS_DETAILED } from "@/lib/modules";
import { cleanPdfText, eur, drawText } from "@/lib/pdfHelpers";
import { supabaseAdmin } from "@/lib/supabase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Génère le PDF (A4, bandeau orange pastel, textes nettoyés WinAnsi)
async function generateContractPdf({
  coupleName,
  weddingDate,
  formulaLabel,
  basePrice,
  options,
  extras,
  totals,
}: {
  coupleName: string;
  weddingDate: string;
  formulaLabel: string;
  basePrice: number;
  options: Array<{ label: string; price: number }>;
  extras: Array<{ label: string; price: number }>;
  totals: { total: number; depositSuggested: number; remainingDayJ: number };
}) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({
    x: 0,
    y: height - 130,
    width,
    height: 130,
    color: rgb(1, 0.73, 0.47),
    opacity: 0.25,
  });

  let y = height - 60;
  drawText(page, "IRZZEN PRODUCTIONS — Contrat / Récapitulatif", 40, y, fontRegular, fontBold, { bold: true, size: 16 });
  y -= 28;
  drawText(page, `Couple : ${cleanPdfText(coupleName)}`, 40, y, fontRegular, fontBold);
  y -= 18;
  drawText(page, `Date du mariage : ${cleanPdfText(weddingDate)}`, 40, y, fontRegular, fontBold);
  y -= 18;
  drawText(page, `Formule : ${cleanPdfText(formulaLabel)}`, 40, y, fontRegular, fontBold);
  y -= 28;

  drawText(page, "Détails de l’offre", 40, y, fontRegular, fontBold, { bold: true, size: 14 });
  y -= 18;
  drawText(page, `Base : ${eur(basePrice)}`, 60, y, fontRegular, fontBold);
  y -= 18;

  if (options?.length) {
    drawText(page, "Options sélectionnées :", 60, y, fontRegular, fontBold, { bold: true });
    y -= 16;
    for (const o of options) {
      drawText(page, `• ${cleanPdfText(o.label)} — ${eur(o.price)}`, 70, y, fontRegular, fontBold);
      y -= 16;
    }
  }

  if (extras?.length) {
    y -= 10;
    drawText(page, "Extras personnalisés :", 60, y, fontRegular, fontBold, { bold: true });
    y -= 16;
    for (const e of extras) {
      drawText(page, `• ${cleanPdfText(e.label)} — ${eur(e.price)}`, 70, y, fontRegular, fontBold);
      y -= 16;
    }
  }

  y -= 18;
  drawText(page, "Récapitulatif", 40, y, fontRegular, fontBold, { bold: true, size: 14 });
  y -= 18;
  drawText(page, `Total : ${eur(totals.total)}`, 60, y, fontRegular, fontBold, { bold: true });
  y -= 18;
  drawText(page, `Acompte (15% arrondi centaine sup — facultatif) : ${eur(totals.depositSuggested)}`, 60, y, fontRegular, fontBold);
  y -= 18;
  drawText(page, `Reste à payer le jour J : ${eur(totals.remainingDayJ)}`, 60, y, fontRegular, fontBold);

  y -= 28;
  drawText(page, "Conditions :", 40, y, fontRegular, fontBold, { bold: true, size: 14 });
  y -= 16;
  const clauses = [
    "Aucune annulation pour quelconque raison n'est recevable.",
    "L'acompte n'est remboursé en aucun cas.",
    "La livraison des fichiers digitaux a lieu au maximum dans 6 mois.",
  ];
  for (const c of clauses) {
    drawText(page, `• ${c}`, 60, y, fontRegular, fontBold);
    y -= 16;
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

// Upload PDF avec la clé service (bypass RLS). Retourne publicUrl + signedUrl (fallback).
async function saveContractPDF({
  bookingId,
  buffer,
  filename,
}: {
  bookingId: string;
  buffer: Buffer;
  filename: string;
}) {
  const path = `contracts/${bookingId}/${filename}`;
  const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
    .from("contracts")
    .upload(path, buffer, { contentType: "application/pdf", upsert: true });

  if (uploadErr) throw new Error(`Upload PDF failed: ${uploadErr.message}`);

  const { data: pub } = supabaseAdmin.storage.from("contracts").getPublicUrl(uploadData!.path);
  let fileUrl = pub.publicUrl;

  // Si le bucket n'est pas public, on génère une URL signée (1 an)
  if (!fileUrl || fileUrl.includes("signed")) {
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("contracts")
      .createSignedUrl(uploadData!.path, 60 * 60 * 24 * 365);
    if (!signErr && signed?.signedUrl) fileUrl = signed.signedUrl;
  }

  return { path: uploadData!.path, bytes: buffer.byteLength, url: fileUrl };
}

export async function POST(req: Request) {
  try {
    const { customer, config } = (await req.json()) as {
      customer: {
        email: string;
        firstName?: string;
        lastName?: string;
        coupleName?: string;
        weddingDate?: string; // ISO
      };
      config: {
        formulaId: string;
        options: string[]; // (non tarifées côté serveur dans cet exemple)
        extras: Array<{ label: string; price: number }>;
      };
    };

    if (!customer?.email || !config?.formulaId) {
      return NextResponse.json({ error: "Missing email or formulaId" }, { status: 400 });
    }

    const formula = FORMULAS_DETAILED.find((f) => f.id === config.formulaId);
    if (!formula) {
      return NextResponse.json({ error: "Unknown formula" }, { status: 400 });
    }

    // Calcul serveur (prix base + extras)
    const optionPrices = (config.extras || []).map((e) => e.price);
    const totals = computePricing(formula.price, optionPrices);

    // ID booking (sert aussi de dossier pour le PDF)
    const bookingId = crypto.randomUUID();

    // INSERT en base avec service role (bypass RLS)
    await supabaseAdmin.from("bookings").insert({
      id: bookingId,
      couple_name: customer.coupleName ?? null,
      wedding_date: customer.weddingDate ?? null,
      customer_email: customer.email,
      formula_id: formula.id,
      total_amount: totals.total,
      created_at: new Date().toISOString(),
    });

    // Génération & upload PDF
    const pdfBuffer = await generateContractPdf({
      coupleName: customer.coupleName || "",
      weddingDate: customer.weddingDate || "",
      formulaLabel: formula.label,
      basePrice: formula.price,
      options: [], // si tu tarifies des options server-side, mappe-les ici
      extras: config.extras || [],
      totals,
    });

    const filename = `IRZZEN-Contrat-${new Date().toISOString().slice(0, 10)}.pdf`;
    const saved = await saveContractPDF({ bookingId, buffer: pdfBuffer, filename });

    await supabaseAdmin.from("contracts").insert({
      booking_id: bookingId,
      file_path: saved.path,
      bytes: saved.bytes,
      created_at: new Date().toISOString(),
    });

    // Session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      currency: "eur",
      customer_email: customer.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: formula.label,
              description: "Réservation prestation mariage IRZZEN",
            },
            unit_amount: Math.round(totals.total * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}&pdfUrl=${encodeURIComponent(
        saved.url
      )}`,
      cancel_url: `${SITE_URL}/reservation?canceled=1`,
      metadata: {
        booking_id: bookingId,
        pdf_path: saved.path,
        pdf_url: saved.url,
        formula_id: formula.id,
        email: customer.email,
      },
    });

    return NextResponse.json({ url: session.url, pdfUrl: saved.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}