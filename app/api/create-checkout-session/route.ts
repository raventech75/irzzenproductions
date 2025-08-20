import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // ✅ version stable
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Récupération des données formulaire
    const {
      bride_first_name,
      bride_last_name,
      groom_first_name,
      groom_last_name,
      email,
      phone,
      address,
      ceremony_address,
      reception_address,
      ceremony_time,
      reception_time,
      formula,
      price,
    } = body;

    // ✅ Génération du PDF contrat avec pdf-lib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const { height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y = height - 50;

    function addLine(text: string, size = 12) {
      page.drawText(text, { x: 50, y, size, font, color: rgb(0, 0, 0) });
      y -= size + 8;
    }

    addLine("Contrat de prestation photo/vidéo", 18);
    y -= 10;

    addLine(`Mariés : ${bride_first_name} ${bride_last_name} & ${groom_first_name} ${groom_last_name}`);
    addLine(`Email : ${email}`);
    addLine(`Téléphone : ${phone}`);
    addLine(`Adresse : ${address}`);
    y -= 10;

    addLine(`Lieu de la cérémonie : ${ceremony_address}`);
    addLine(`Heure de la cérémonie : ${ceremony_time}`);
    addLine(`Lieu de la réception : ${reception_address}`);
    addLine(`Heure de la réception : ${reception_time}`);
    y -= 10;

    addLine(`Formule choisie : ${formula}`);
    addLine(`Montant total : ${price} €`);
    y -= 20;

    addLine("Mentions légales :", 14);
    addLine("Le prestataire s'engage à fournir les services photo/vidéo tels que définis dans la formule choisie.");
    addLine("Le client dispose d'un droit de rétractation de 14 jours après signature du contrat.");
    addLine("Les données personnelles collectées sont utilisées uniquement pour l'exécution du contrat.");
    y -= 10;

    addLine("Clauses :", 14);
    addLine("- Le client s'engage à fournir un accès aux lieux de prestation.");
    addLine("- En cas d'annulation, les sommes déjà versées restent dues.");
    addLine("- Le prestataire conserve les droits d'auteur sur les images, sauf accord contraire.");
    addLine("- Livraison prévue dans un délai de 8 semaines maximum.");

    const pdfBytes = await pdfDoc.save();

    // ✅ Upload Supabase
    const filePath = `contracts/${Date.now()}_${bride_last_name}_${groom_last_name}.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("contracts")
      .upload(filePath, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Erreur upload Supabase:", uploadError);
      return NextResponse.json({ error: "Upload PDF failed" }, { status: 500 });
    }

    // ✅ URL publique
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("contracts")
      .getPublicUrl(filePath);
    const pdfUrl = publicUrlData.publicUrl;

    // ✅ Envoi email avec pièce jointe + lien
    await resend.emails.send({
      from: "no-reply@irzzenproductions.fr",
      to: email,
      subject: "Votre contrat - Irzzen Productions",
      html: `
        <p>Bonjour ${bride_first_name},</p>
        <p>Merci d’avoir choisi Irzzen Productions. Vous trouverez ci-joint votre contrat de prestation.</p>
        <p>Vous pouvez également le télécharger via ce lien : <a href="${pdfUrl}">Télécharger le contrat</a></p>
        <p>Cordialement,<br/>L'équipe Irzzen</p>
      `,
      attachments: [
        {
          filename: "contrat.pdf",
          content: Buffer.from(pdfBytes).toString("base64"),
        },
      ],
    });

    // ✅ Création session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `Formule ${formula}` },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?pdfUrl=${encodeURIComponent(
        pdfUrl
      )}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation`,
      metadata: {
        bride_first_name,
        bride_last_name,
        groom_first_name,
        groom_last_name,
        email,
        phone,
        address,
        ceremony_address,
        reception_address,
        ceremony_time,
        reception_time,
        formula,
        price: price.toString(),
        pdfUrl,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Erreur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}