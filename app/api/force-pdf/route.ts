// app/api/force-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Fonction de génération PDF simplifiée (vous pouvez la remplacer par votre fonction complexe du webhook)
async function createQuickPDF(contractData: any, session: Stripe.Checkout.Session) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Couleurs
  const primaryColor = rgb(1, 0.6, 0.4); // Orange
  const grayText = rgb(0.3, 0.3, 0.3);
  
  let yPos = 800;
  const leftMargin = 50;

  // En-tête
  page.drawRectangle({
    x: 0, y: yPos, width: 595, height: 60, color: primaryColor,
  });
  
  page.drawText("CONTRAT DE PRESTATION - IRZZEN PRODUCTIONS", {
    x: leftMargin, y: yPos + 25, size: 18, font: fontBold, color: rgb(1, 1, 1),
  });
  
  page.drawText("Photographie & Vidéographie de Mariage", {
    x: leftMargin, y: yPos + 5, size: 12, font, color: rgb(1, 1, 1),
  });

  yPos -= 80;

  // Informations client
  page.drawText("INFORMATIONS CLIENT", {
    x: leftMargin, y: yPos, size: 14, font: fontBold, color: primaryColor,
  });
  yPos -= 25;

  const clientInfo = [
    `Couple: ${contractData.couple_name || "Non renseigné"}`,
    `Email: ${session.customer_email || contractData.email || "Non renseigné"}`,
    `Date du mariage: ${contractData.wedding_date || "À confirmer"}`,
    `Téléphone: ${contractData.phone || "Non renseigné"}`,
  ];

  clientInfo.forEach(info => {
    page.drawText(info, { x: leftMargin, y: yPos, size: 11, font });
    yPos -= 18;
  });

  yPos -= 20;

  // Adresse si disponible
  if (contractData.address || contractData.city) {
    page.drawText("ADRESSE", {
      x: leftMargin, y: yPos, size: 14, font: fontBold, color: primaryColor,
    });
    yPos -= 25;

    const addressInfo = [
      contractData.address && `Adresse: ${contractData.address}`,
      contractData.postalCode && contractData.city && `${contractData.postalCode} ${contractData.city}`,
      contractData.country && `Pays: ${contractData.country}`,
    ].filter(Boolean);

    addressInfo.forEach(info => {
      page.drawText(info, { x: leftMargin, y: yPos, size: 11, font });
      yPos -= 18;
    });

    yPos -= 20;
  }

  // Détails du mariage
  page.drawText("DÉTAILS DU MARIAGE", {
    x: leftMargin, y: yPos, size: 14, font: fontBold, color: primaryColor,
  });
  yPos -= 25;

  const marriageDetails = [
    contractData.guests && `Nombre d'invités: ${contractData.guests}`,
    contractData.ceremonyLocation && `Lieu cérémonie: ${contractData.ceremonyLocation}`,
    contractData.ceremonyTime && `Heure cérémonie: ${contractData.ceremonyTime}`,
    contractData.receptionLocation && `Lieu réception: ${contractData.receptionLocation}`,
    contractData.receptionTime && `Heure réception: ${contractData.receptionTime}`,
  ].filter(Boolean);

  marriageDetails.forEach(detail => {
    page.drawText(detail, { x: leftMargin, y: yPos, size: 11, font });
    yPos -= 18;
  });

  yPos -= 20;

  // Prestation
  page.drawText("PRESTATION SÉLECTIONNÉE", {
    x: leftMargin, y: yPos, size: 14, font: fontBold, color: primaryColor,
  });
  yPos -= 25;

  const prestationInfo = [
    `Formule: ${contractData.formula || "Non spécifiée"}`,
    contractData.formula_description && `Description: ${contractData.formula_description}`,
    contractData.selected_options && `Options: ${contractData.selected_options}`,
  ].filter(Boolean);

  prestationInfo.forEach(info => {
    page.drawText(info, { x: leftMargin, y: yPos, size: 11, font });
    yPos -= 18;
  });

  yPos -= 20;

  // Récapitulatif financier
  page.drawText("RÉCAPITULATIF FINANCIER", {
    x: leftMargin, y: yPos, size: 14, font: fontBold, color: primaryColor,
  });
  yPos -= 25;

  const financialInfo = [
    `Total de la prestation: ${contractData.total_eur || "0"}€`,
    `Acompte suggéré: ${contractData.deposit_eur || "0"}€`,
    `Reste à payer le jour J: ${contractData.remaining_eur || "0"}€`,
  ];

  financialInfo.forEach((info, index) => {
    page.drawText(info, {
      x: leftMargin, y: yPos, size: 12,
      font: index === 0 ? fontBold : font,
      color: index === 0 ? primaryColor : rgb(0, 0, 0),
    });
    yPos -= 20;
  });

  yPos -= 30;

  // Informations générales
  page.drawText("CONDITIONS GÉNÉRALES", {
    x: leftMargin, y: yPos, size: 14, font: fontBold, color: primaryColor,
  });
  yPos -= 25;

  const conditions = [
    "• Acompte non obligatoire mais recommandé pour confirmation",
    "• Solde à régler le jour de la prestation",
    "• Livraison sous 4 à 6 semaines via galerie en ligne",
    "• Droits d'usage privé et familial des images",
    "• Annulation possible jusqu'à 30 jours avant (acompte non remboursé)",
  ];

  conditions.forEach(condition => {
    page.drawText(condition, { x: leftMargin, y: yPos, size: 10, font, color: grayText });
    yPos -= 15;
  });

  // Pied de page
  page.drawText(`Contrat généré le ${new Date().toLocaleDateString('fr-FR')} - Session: ${session.id}`, {
    x: leftMargin, y: 50, size: 8, font, color: grayText,
  });

  page.drawText("IRZZEN PRODUCTIONS - contact@irzzenproductions.fr", {
    x: leftMargin, y: 30, size: 8, font, color: grayText,
  });

  return await pdfDoc.save();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = body;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID manquant' }, { status: 400 });
    }

    console.log('🔄 Génération PDF forcée pour session:', sessionId);

    // Récupérer la session Stripe complète
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Session non payée' }, { status: 400 });
    }

    console.log('✅ Session Stripe récupérée:', {
      id: session.id,
      email: session.customer_email,
      status: session.payment_status
    });

    // Vérifier si le PDF existe déjà
    const fileName = `${session.id}.pdf`;
    const { data: existingFiles } = await supabase.storage
      .from('contrats')
      .list('', { search: fileName });

    if (existingFiles && existingFiles.length > 0) {
      const { data: publicUrlData } = supabase.storage
        .from('contrats')
        .getPublicUrl(fileName);
      
      return NextResponse.json({
        success: true,
        message: 'PDF déjà existant',
        pdfUrl: publicUrlData.publicUrl,
        alreadyExisted: true
      });
    }

    // Préparer les données pour le PDF
    const metadata = session.metadata || {};
    
    const contractData = {
      bride_first_name: metadata.bride_first_name || "",
      bride_last_name: metadata.bride_last_name || "",
      groom_first_name: metadata.groom_first_name || "",
      groom_last_name: metadata.groom_last_name || "",
      couple_name: metadata.couple_name || `${metadata.bride_first_name} & ${metadata.groom_first_name}`,
      wedding_date: metadata.wedding_date || "",
      phone: metadata.phone || "",
      address: metadata.address || "",
      postalCode: metadata.postalCode || "",
      city: metadata.city || "",
      country: metadata.country || "",
      guests: metadata.guests || "",
      prepLocation: metadata.prepLocation || "",
      prepTime: metadata.prepTime || "",
      mairieLocation: metadata.mairieLocation || "",
      mairieTime: metadata.mairieTime || "",
      ceremonyLocation: metadata.ceremonyLocation || "",
      ceremonyTime: metadata.ceremonyTime || "",
      receptionLocation: metadata.receptionLocation || "",
      receptionTime: metadata.receptionTime || "",
      schedule: metadata.schedule || "",
      specialRequests: metadata.specialRequests || "",
      formula: metadata.formula || "",
      formula_description: metadata.formula_description || "",
      total_eur: metadata.total_eur || "",
      deposit_eur: metadata.deposit_eur || "",
      remaining_eur: metadata.remaining_eur || "",
      selected_options: metadata.selected_options || "",
      extras: metadata.extras || "",
      email: session.customer_email || metadata.email || "",
    };

    console.log('📋 Données contractuelles préparées pour:', contractData.couple_name);

    // Générer le PDF
    const pdfBytes = await createQuickPDF(contractData, session);
    console.log('📄 PDF généré, taille:', pdfBytes.length, 'bytes');

    // Upload sur Supabase
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("contrats")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error('❌ Erreur upload:', uploadError);
      return NextResponse.json({ 
        error: 'Erreur upload Supabase', 
        details: uploadError 
      }, { status: 500 });
    }

    console.log('✅ Upload réussi:', uploadData?.path);

    // URL publique
    const { data: publicUrlData } = supabase.storage
      .from("contrats")
      .getPublicUrl(fileName);

    console.log('🔗 PDF accessible:', publicUrlData.publicUrl);

    return NextResponse.json({
      success: true,
      message: 'PDF généré avec succès',
      pdfUrl: publicUrlData.publicUrl,
      fileName: fileName,
      sessionData: {
        id: session.id,
        email: session.customer_email,
        paymentStatus: session.payment_status
      }
    });
    
  } catch (error: any) {
    console.error('❌ Erreur force-pdf:', error);
    return NextResponse.json({ 
      error: error.message || 'Erreur génération forcée',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}