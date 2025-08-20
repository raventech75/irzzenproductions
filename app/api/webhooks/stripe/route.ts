// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { resend, MAIL_FROM } from "@/lib/email";
import { buildBookingPdf } from "@/lib/pdf";
import { saveContractPDF } from "@/lib/storage";

export const runtime = "nodejs";

// Assure-toi d’avoir STRIPE_WEBHOOK_SECRET dans tes variables d’env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
    }

    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
    }

    const rawBody = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, secret);
    } catch (err: any) {
      console.error("Webhook constructEvent error:", err?.message || err);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // On s’intéresse à la fin d’un checkout payé
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const email = session.customer_email || (session.customer_details?.email ?? "");
      const md = (session.metadata || {}) as Record<string, string>;

      // Tu avais déjà un générateur de PDF (infos clients + clauses)
      // buildBookingPdf doit te renvoyer un Uint8Array (pdfBytes)
      const pdfBytes: Uint8Array = await buildBookingPdf({
        // on passe ce qui t’est utile pour le PDF
        bride_first_name: md.bride_first_name,
        bride_last_name: md.bride_last_name,
        groom_first_name: md.groom_first_name,
        groom_last_name: md.groom_last_name,
        couple_name: md.couple_name,
        wedding_date: md.wedding_date,
        formula: md.formula,
        total_eur: md.total_eur,
        deposit_eur: md.deposit_eur,
        remaining_eur: md.remaining_eur,
        selected_options: md.selected_options,
        extras: md.extras,
        email,
      });

      // Nom de fichier propre
      const safeName =
        (md.couple_name ||
          [md.bride_last_name, md.groom_last_name].filter(Boolean).join("_") ||
          "client") + "";
      const fileName = `IRZZEN_${Date.now()}_${safeName.replace(/\s+/g, "_")}.pdf`;

      // Sauvegarde Storage
      const saved = await saveContractPDF({ path: fileName, bytes: pdfBytes });

      // (Optionnel) Insert en base si tu utilises une table contracts
      // On met bytes = pdfBytes.length si la colonne existe ; sinon supprime ce champ de l’insert.
      try {
        await supabase
          .from("contracts")
          .insert({
            // booking_id: md.booking_id ?? null, // si tu l’as
            file_path: saved.path,
            bytes: pdfBytes.length, // ✅ au lieu de saved.bytes (qui n’existe pas)
            client_email: email || null,
            formula: md.formula || null,
            wedding_date: md.wedding_date || null,
          });
      } catch (e) {
        console.warn("Insert contracts table warning:", (e as any)?.message || e);
      }

      // Mail client + admin (PJ + lien public si dispo)
      const base64 = Buffer.from(pdfBytes).toString("base64");
      const publicUrl = (saved as any).publicUrl || "";

      // Envoi au client
      if (email) {
        await resend.emails.send({
          from: MAIL_FROM,
          to: email,
          subject: "Votre contrat de réservation – Irzzen Productions",
          html: `
            <p>Bonjour,</p>
            <p>Merci pour votre réservation. Veuillez trouver ci-joint votre contrat.</p>
            ${publicUrl ? `<p>Vous pouvez aussi le télécharger : <a href="${publicUrl}">Contrat (PDF)</a></p>` : ""}
            <p>Bien cordialement,<br/>Irzzen Productions</p>
          `,
          attachments: [
            {
              filename: fileName,
              content: base64,
            },
          ],
        });
      }

      // Envoi admin
      await resend.emails.send({
        from: MAIL_FROM,
        to: process.env.ADMIN_EMAIL || "contact@irzzen-productions.fr",
        subject: `📑 Nouveau contrat – ${safeName}`,
        html: `
          <p>Nouveau contrat généré et envoyé.</p>
          <ul>
            <li><strong>Client:</strong> ${safeName}</li>
            <li><strong>Email:</strong> ${email || "—"}</li>
            <li><strong>Formule:</strong> ${md.formula || "—"}</li>
            <li><strong>Date:</strong> ${md.wedding_date || "—"}</li>
            ${publicUrl ? `<li><strong>Lien public:</strong> <a href="${publicUrl}">${publicUrl}</a></li>` : ""}
          </ul>
        `,
        attachments: [
          {
            filename: fileName,
            content: base64,
          },
        ],
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Stripe webhook handler error:", err?.message || err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}