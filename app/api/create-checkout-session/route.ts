// /app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";
import PDFDocument from "pdfkit";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { formulaId, options, extras, pricing, questionnaire } = await req.json();

    // ———————————————————————
    // 1. Génération PDF en mémoire
    // ———————————————————————
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: any[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {});

    doc.fontSize(20).text("Contrat & Confirmation de Réservation", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(14).text("Informations client", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Mariée : ${questionnaire.brideFirstName} ${questionnaire.brideLastName}`);
    doc.text(`Marié : ${questionnaire.groomFirstName} ${questionnaire.groomLastName}`);
    doc.text(`Email : ${questionnaire.email}`);
    doc.text(`Téléphone : ${questionnaire.phone}`);
    doc.text(`Adresse : ${questionnaire.address}, ${questionnaire.postalCode} ${questionnaire.city}, ${questionnaire.country}`);
    doc.text(`Date du mariage : ${questionnaire.weddingDate}`);
    doc.text(`Invités : ${questionnaire.guests}`);
    doc.moveDown(1);

    doc.fontSize(14).text("Formule choisie", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).text(`Formule : ${formulaId}`);
    doc.text(`Options : ${options.join(", ") || "Aucune"}`);
    doc.text(`Extras : ${extras.map((e: any) => `${e.label} (${e.price} €)`).join(", ") || "Aucun"}`);
    doc.text(`Total : ${pricing.total} €`);
    doc.text(`Acompte : ${pricing.depositSuggested} €`);
    doc.text(`Solde : ${pricing.remainingDayJ} €`);

    doc.moveDown(2);
    doc.fontSize(14).text("Mentions légales & Conditions", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(9).text(
      `1. Acompte : 15% minimum recommandé. Solde le jour J.\n\n` +
      `2. Annulation : acompte non remboursable, report possible.\n\n` +
      `3. Droits d’auteur : usage privé uniquement, diffusion publique soumise à autorisation.\n\n` +
      `4. Responsabilité : pas de garantie en cas d’imprévu (météo, retard, etc.).\n\n` +
      `5. Force majeure : remboursement ou remplacement en cas d’empêchement.\n\n` +
      `6. Confidentialité : données traitées conformément au RGPD.`
    );

    doc.end();
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      const result = Buffer.concat(chunks);
      resolve(result);
    });

    // ———————————————————————
    // 2. Envoi du mail avec le contrat en PJ
    // ———————————————————————
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: questionnaire.email,
      subject: "Confirmation de réservation - Irzzen Productions",
      html: `
        <p>Bonjour ${questionnaire.brideFirstName} & ${questionnaire.groomFirstName},</p>
        <p>Merci pour votre confiance. Vous trouverez ci-joint votre contrat de réservation.</p>
        <p>Total : <strong>${pricing.total} €</strong> — Acompte : <strong>${pricing.depositSuggested} €</strong></p>
        <p>Nous restons à votre disposition pour toute question.</p>
        <p><em>Irzzen Productions</em></p>
      `,
      attachments: [
        {
          filename: "Contrat-Reservation.pdf",
          content: pdfBuffer.toString("base64"),
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    });

    // ———————————————————————
    // 3. Session Stripe
    // ———————————————————————
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `Formule ${formulaId}` },
            unit_amount: pricing.total * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/merci`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erreur paiement:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}