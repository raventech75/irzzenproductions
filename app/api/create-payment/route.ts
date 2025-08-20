// app/api/create-payment/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";

import { computePricing } from "@/lib/pricing";
import { FORMULAS_DETAILED } from "@/lib/modules";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Génère un PDF très simple (pastel orange) avec les infos de config.
 * Retourne un Buffer Node.
 */
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
  const page = doc.addPage([595.28, 841.89]); // A4 portrait
  const { width, height } = page.getSize();

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // fond bandeau haut pastel orange
  page.drawRectangle({
    x: 0,
    y: height - 130,
    width,
    height: 130,
    color: rgb(1, 0.73, 0.47), // orange doux
    opacity: 0.25,
  });

  const drawText = (text: string, x: number, y: number, bold = false, size = 12) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: bold ? fontBold : fontRegular,
      color: rgb(0.12, 0.12, 0.12),
    });
  };

  let y = height - 60;
  drawText("IRZZEN PRODUCTIONS — Contrat / Récapitulatif", 40, y, true, 16);
  y -= 28;
  drawText(`Couple : ${coupleName || "—"}`, 40, y);
  y -= 18;
  drawText(`Date du mariage : ${weddingDate || "—"}`, 40, y);
  y -= 18;
  drawText(`Formule : ${formulaLabel}`, 40, y);
  y -= 28;

  drawText("Détails de l’offre", 40, y, true, 14);
  y -= 18;
  drawText(`Base : ${basePrice.toLocaleString("fr-FR")} €`, 60, y);
  y -= 18;

  if (options.length) {
    drawText("Options sélectionnées :", 60, y, true);
    y -= 16;
    for (const o of options) {
      drawText(`• ${o.label} — ${o.price.toLocaleString("fr-FR")} €`, 70, y);
      y -= 16;
    }
  }

  if (extras.length) {
    y -= 10;
    drawText("Extras personnalisés :", 60, y, true);
    y -= 16;
    for (const e of extras) {
      drawText(`• ${e.label} — ${e.price.toLocaleString("fr-FR")} €`, 70, y);
      y -= 16;
    }
  }

  y -= 18;
  drawText("Récapitulatif", 40, y, true, 14);
  y -= 18;
  drawText(`Total : ${totals.total.toLocaleString("fr-FR")} €`, 60, y, true);
  y -= 18;
  drawText(`Acompte (15% arrondi centaine sup — facultatif) : ${totals.depositSuggested.toLocaleString("fr-FR")} €`, 60, y);
  y -= 18;
  drawText(`Reste à payer le jour J : ${totals.remainingDayJ.toLocaleString("fr-FR")} €`, 60, y);

  y -= 28;
  drawText("Conditions :", 40, y, true, 14);
  y -= 16;
  const clauses = [
    "Aucune annulation pour quelconque raison n'est recevable.",
    "L'acompte n'est remboursé en aucun cas.",
    "La livraison des fichiers digitaux a lieu au maximum dans 6 mois.",
  ];
  for (const c of clauses) {
    drawText(`• ${c}`, 60, y);
    y -= 16;
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Upload le PDF dans Supabase Storage (bucket 'contracts') et retourne
 * { path, bytes, publicUrl }.
 */
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
  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from("contracts")
    .upload(path, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadErr) {
    throw new Error(`Upload PDF failed: ${uploadErr.message}`);
  }

  // URL publique (assure-toi que le bucket 'contracts' a une politique public read)
  const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${uploadData!.path}`;

  return { path: uploadData!.path, bytes: buffer.byteLength, publicUrl };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    /**
     * Body attendu (côté client lors de la création de session) :
     * {
     *   customer: { email, firstName, lastName, coupleName, weddingDate },
     *   config: { formulaId, options: string[], extras: {label, price}[] }
     * }
     */
    const { customer, config } = body as {
      customer: {
        email: string;
        firstName?: string;
        lastName?: string;
        coupleName?: string;
        weddingDate?: string; // ISO
      };
      config: {
        formulaId: string;
        options: string[];
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

    // Prix serveur
    // On s’appuie sur computePricing côté serveur avec la même logique que le client.
    // Ici, pour simplifier, on passe seulement le total options/extras. Si tu as un fichier
    // OPTIONS côté serveur, plug-le ici pour recalculer précisément.
    const optionsForPdf = (config.extras || []).map((e) => ({ label: e.label, price: e.price }));
    const optionPrices = optionsForPdf.map((e) => e.price);
    const totals = computePricing(formula.price, optionPrices);

    // (Optionnel) Crée un booking minimal en base — adapte selon ton schéma
    // On génère un id détaché (utilisé pour le path du PDF aussi)
    const bookingId = crypto.randomUUID();
    await supabase.from("bookings").insert({
      id: bookingId,
      couple_name: customer.coupleName ?? null,
      wedding_date: customer.weddingDate ?? null,
      customer_email: customer.email,
      formula_id: formula.id,
      total_amount: totals.total,
      created_at: new Date().toISOString(),
    });

    // Génère le PDF + upload + insère `contracts`
    const pdfBuffer = await generateContractPdf({
      coupleName: customer.coupleName || "",
      weddingDate: customer.weddingDate || "",
      formulaLabel: formula.label,
      basePrice: formula.price,
      options: [], // si tu gères des options tarifées distinctes côté serveur, mappe-les ici
      extras: config.extras || [],
      totals,
    });

    const filename = `IRZZEN-Contrat-${new Date().toISOString().slice(0, 10)}.pdf`;
    const saved = await saveContractPDF({
      bookingId,
      buffer: pdfBuffer,
      filename,
    });

    await supabase.from("contracts").insert({
      booking_id: bookingId,
      file_path: saved.path,
      bytes: saved.bytes,
      created_at: new Date().toISOString(),
    });

    // Crée la session Stripe
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
        saved.publicUrl
      )}`,
      cancel_url: `${SITE_URL}/reservation?canceled=1`,
      metadata: {
        booking_id: bookingId,
        pdf_path: saved.path,
        pdf_url: saved.publicUrl,
        formula_id: formula.id,
        email: customer.email,
      },
    });

    return NextResponse.json({ url: session.url, pdfUrl: saved.publicUrl });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}