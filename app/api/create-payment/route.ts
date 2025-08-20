import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { FORMULAS_DETAILED } from "@/lib/modules";
import { computePricing } from "@/lib/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { customer, config } = await req.json();

    if (!customer?.email || !customer?.firstName) {
      return NextResponse.json({ error: "Infos client manquantes" }, { status: 400 });
    }

    const formula = FORMULAS_DETAILED.find((f) => f.id === config.formulaId);
    if (!formula) {
      return NextResponse.json({ error: "Formule inconnue" }, { status: 400 });
    }

    // Calcule le prix total
    const optionPrices = [
      ...(config.options || []).map(
        (id: string) => FORMULAS_DETAILED.flatMap((f) => f.options).find((o) => o.id === id)?.price || 0
      ),
      ...(config.extras || []).map((e: { price: number }) => e.price),
    ];
    const totals = computePricing(formula.price, optionPrices);

    // Crée un contrat PDF simple
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.drawText("Contrat de réservation", {
      x: 50,
      y: 780,
      size: 22,
      font,
      color: rgb(0.9, 0.4, 0.2),
    });
    page.drawText(`Couple: ${customer.coupleName || customer.firstName + " " + customer.lastName}`, {
      x: 50,
      y: 740,
      size: 14,
      font,
    });
    page.drawText(`Formule choisie: ${formula.label}`, { x: 50, y: 710, size: 14, font });
    page.drawText(`Total: ${totals.total} €`, { x: 50, y: 690, size: 14, font });

    const pdfBytes = await pdfDoc.save();

    // Upload PDF dans Supabase Storage
    const fileName = `contrats/${Date.now()}_${customer.lastName || "client"}.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("contracts")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Erreur upload Supabase:", uploadError.message);
      return NextResponse.json({ error: "Upload PDF failed" }, { status: 500 });
    }

    const { data: signed } = await supabaseAdmin.storage
      .from("contracts")
      .createSignedUrl(fileName, 60 * 60 * 24 * 30); // lien 30 jours
    const pdfUrl = signed?.signedUrl;

    // Crée une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customer.email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Formule ${formula.label}`,
            },
            unit_amount: Math.round(totals.total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        coupleName: customer.coupleName || "",
        weddingDate: customer.weddingDate || "",
        pdfUrl: pdfUrl || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?pdfUrl=${encodeURIComponent(
        pdfUrl || ""
      )}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation`,
    });

    return NextResponse.json({ url: session.url, pdfUrl });
  } catch (err: any) {
    console.error("Erreur create-payment:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}