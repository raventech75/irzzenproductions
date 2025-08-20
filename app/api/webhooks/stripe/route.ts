import Stripe from "stripe";
import { headers } from "next/headers";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";

// ⚡ Config Stripe + Supabase
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 🎨 Fonction pour générer un PDF professionnel
async function createProfessionalPDF(metadata: any, session: Stripe.Checkout.Session) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Format A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Couleurs
  const primaryColor = rgb(1, 0.6, 0.4); // Orange pastel professionnel
  const accentColor = rgb(1, 0.7, 0.5); // Orange plus clair
  const grayText = rgb(0.3, 0.3, 0.3);
  const lightGray = rgb(0.98, 0.95, 0.92); // Beige très clair
  
  let yPos = 800;
  const leftMargin = 50;
  const rightMargin = 545;

  // 🎯 Fonction pour formater une date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Date à confirmer";
    try {
      // Si format YYYY-MM-DD, convertir en DD/MM/YYYY
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      }
      return dateStr; // Sinon garder tel quel
    } catch {
      return dateStr;
    }
  };

  // 📍 EN-TÊTE
  page.drawRectangle({
    x: 0,
    y: yPos,
    width: 595,
    height: 60,
    color: primaryColor,
  });
  
  page.drawText("CONTRAT DE PRESTATION PHOTOGRAPHIQUE ET VIDÉOGRAPHIQUE", {
    x: leftMargin,
    y: yPos + 25,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  
  page.drawText("Événement - Mariage", {
    x: leftMargin,
    y: yPos + 5,
    size: 12,
    font,
    color: rgb(1, 1, 1),
  });

  yPos -= 80;

  // 📍 INFORMATIONS GÉNÉRALES
  page.drawRectangle({
    x: leftMargin - 10,
    y: yPos - 15,
    width: rightMargin - leftMargin + 20,
    height: 30,
    color: lightGray,
  });
  
  page.drawText("INFORMATIONS GÉNÉRALES", {
    x: leftMargin,
    y: yPos,
    size: 14,
    font: fontBold,
    color: primaryColor,
  });

  yPos -= 35;
  
  // Date du contrat uniquement
  const today = new Date().toLocaleDateString('fr-FR');
  page.drawText(`Date du contrat : ${today}`, {
    x: leftMargin,
    y: yPos,
    size: 10,
    font,
    color: grayText,
  });

  yPos -= 30;

  // 📍 PRESTATAIRE
  page.drawRectangle({
    x: leftMargin - 10,
    y: yPos - 15,
    width: rightMargin - leftMargin + 20,
    height: 30,
    color: lightGray,
  });
  
  page.drawText("LE PRESTATAIRE", {
    x: leftMargin,
    y: yPos,
    size: 14,
    font: fontBold,
    color: primaryColor,
  });

  yPos -= 35;

  // Informations du prestataire
  const prestataireInfo = [
    "IRZZEN PRODUCTIONS",
    "Société de services audiovisuels",
    "Email : contact@irzzenproductions.fr",
    "Siège social : [Adresse à compléter]",
    "SIRET : [À compléter]"
  ];

  prestataireInfo.forEach(info => {
    page.drawText(info, {
      x: leftMargin,
      y: yPos,
      size: 10,
      font: info === prestataireInfo[0] ? fontBold : font,
    });
    yPos -= 15;
  });

  yPos -= 15;

  // 📍 INFORMATIONS CLIENT
  page.drawRectangle({
    x: leftMargin - 10,
    y: yPos - 15,
    width: rightMargin - leftMargin + 20,
    height: 30,
    color: lightGray,
  });
  
  page.drawText("LE CLIENT", {
    x: leftMargin,
    y: yPos,
    size: 14,
    font: fontBold,
    color: primaryColor,
  });

  yPos -= 35;

  // Informations du couple
  const brideFirst = metadata.bride_first_name || "";
  const brideLast = metadata.bride_last_name || "";
  const groomFirst = metadata.groom_first_name || "";
  const groomLast = metadata.groom_last_name || "";
  const coupleName = metadata.couple_name || `${brideFirst} ${brideLast} & ${groomFirst} ${groomLast}`;
  
  page.drawText(`Futurs époux : ${coupleName}`, {
    x: leftMargin,
    y: yPos,
    size: 12,
    font: fontBold,
  });

  yPos -= 20;
  
  page.drawText(`Email de contact : ${session.customer_email || metadata.email || "Non renseigné"}`, {
    x: leftMargin,
    y: yPos,
    size: 10,
    font,
  });

  yPos -= 20;

  // 📍 DÉTAILS DU MARIAGE
  page.drawRectangle({
    x: leftMargin - 10,
    y: yPos - 15,
    width: rightMargin - leftMargin + 20,
    height: 30,
    color: lightGray,
  });
  
  page.drawText("DÉTAILS DU MARIAGE", {
    x: leftMargin,
    y: yPos,
    size: 14,
    font: fontBold,
    color: primaryColor,
  });

  yPos -= 35;

  // Date du mariage (formatée)
  const weddingDate = formatDate(metadata.wedding_date);
  page.drawText(`Date du mariage : ${weddingDate}`, {
    x: leftMargin,
    y: yPos,
    size: 12,
    font: fontBold,
  });

  yPos -= 25;

  // 🎯 Toutes les informations du mariage détaillées
  const marriageDetails = [
    { label: "Nombre d'invités", value: metadata.guests },
    { label: "Lieu des préparatifs", value: metadata.prepLocation },
    { label: "Heure des préparatifs", value: metadata.prepTime },
    { label: "Adresse mairie", value: metadata.mairieLocation },
    { label: "Heure mairie", value: metadata.mairieTime },
    { label: "Lieu cérémonie", value: metadata.ceremonyLocation || metadata.ceremony_address },
    { label: "Heure cérémonie", value: metadata.ceremonyTime || metadata.ceremony_time },
    { label: "Lieu réception", value: metadata.receptionLocation || metadata.reception_address },
    { label: "Heure réception", value: metadata.receptionTime || metadata.reception_time },
    { label: "Adresse postale", value: metadata.address },
    { label: "Code postal", value: metadata.postalCode },
    { label: "Ville", value: metadata.city },
    { label: "Pays", value: metadata.country },
  ].filter(item => item.value && item.value.trim() !== "");

  marriageDetails.forEach(detail => {
    page.drawText(`${detail.label} : ${detail.value}`, {
      x: leftMargin,
      y: yPos,
      size: 10,
      font,
    });
    yPos -= 15;
  });

  // Déroulement de la journée
  if (metadata.schedule && metadata.schedule.trim()) {
    yPos -= 5;
    page.drawText("Déroulement de la journée :", {
      x: leftMargin,
      y: yPos,
      size: 11,
      font: fontBold,
    });
    yPos -= 15;

    // Affichage du texte avec retour à la ligne
    const scheduleText = metadata.schedule;
    const maxWidth = 450;
    const words = scheduleText.split(' ');
    let line = '';
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      if (testLine.length * 6 > maxWidth) {
        if (line) {
          page.drawText(line, {
            x: leftMargin,
            y: yPos,
            size: 10,
            font,
            color: grayText,
          });
          yPos -= 15;
          line = word;
        }
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, {
        x: leftMargin,
        y: yPos,
        size: 10,
        font,
        color: grayText,
      });
      yPos -= 15;
    }
  }

  yPos -= 10;

  // 📍 PRESTATION SÉLECTIONNÉE
  page.drawRectangle({
    x: leftMargin - 10,
    y: yPos - 15,
    width: rightMargin - leftMargin + 20,
    height: 30,
    color: lightGray,
  });
  
  page.drawText("PRESTATION SÉLECTIONNÉE", {
    x: leftMargin,
    y: yPos,
    size: 14,
    font: fontBold,
    color: primaryColor,
  });

  yPos -= 35;

  // Formule
  const formula = metadata.formula || "Formule non spécifiée";
  page.drawText(`Formule : ${formula}`, {
    x: leftMargin,
    y: yPos,
    size: 12,
    font: fontBold,
  });

  yPos -= 20;

  // Description de la formule
  if (metadata.formula_description) {
    const description = metadata.formula_description;
    const maxWidth = 450;
    const words = description.split(' ');
    let line = '';
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      if (testLine.length * 6 > maxWidth) {
        if (line) {
          page.drawText(line, {
            x: leftMargin,
            y: yPos,
            size: 10,
            font,
            color: grayText,
          });
          yPos -= 15;
          line = word;
        }
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, {
        x: leftMargin,
        y: yPos,
        size: 10,
        font,
        color: grayText,
      });
      yPos -= 15;
    }
  }

  yPos -= 10;

  // Options sélectionnées
  if (metadata.selected_options) {
    page.drawText("Options incluses :", {
      x: leftMargin,
      y: yPos,
      size: 11,
      font: fontBold,
    });
    yPos -= 20;

    const options = metadata.selected_options.split(', ').filter(Boolean);
    options.forEach(option => {
      page.drawText(`• ${option}`, {
        x: leftMargin + 15,
        y: yPos,
        size: 10,
        font,
      });
      yPos -= 15;
    });
  }

  // Extras
  if (metadata.extras) {
    yPos -= 5;
    page.drawText("Extras :", {
      x: leftMargin,
      y: yPos,
      size: 11,
      font: fontBold,
    });
    yPos -= 20;

    const extras = metadata.extras.split('|').filter(Boolean);
    extras.forEach(extra => {
      const [label, price] = extra.split(':');
      page.drawText(`• ${label} : ${price}€`, {
        x: leftMargin + 15,
        y: yPos,
        size: 10,
        font,
      });
      yPos -= 15;
    });
  }

  yPos -= 20;

  // 📍 RÉCAPITULATIF FINANCIER
  page.drawRectangle({
    x: leftMargin - 10,
    y: yPos - 15,
    width: rightMargin - leftMargin + 20,
    height: 30,
    color: lightGray,
  });
  
  page.drawText("RÉCAPITULATIF FINANCIER", {
    x: leftMargin,
    y: yPos,
    size: 14,
    font: fontBold,
    color: primaryColor,
  });

  yPos -= 35;

  // Tableau financier
  const financialData = [
    { label: "Total de la prestation", value: `${metadata.total_eur || '0'}€` },
    { label: "Acompte suggéré (15%)", value: `${metadata.deposit_eur || '0'}€` },
    { label: "Reste à payer le jour J", value: `${metadata.remaining_eur || '0'}€` },
  ];

  financialData.forEach((item, index) => {
    // Ligne alternée
    if (index % 2 === 0) {
      page.drawRectangle({
        x: leftMargin - 5,
        y: yPos - 5,
        width: rightMargin - leftMargin + 10,
        height: 20,
        color: rgb(0.98, 0.98, 0.98),
      });
    }

    page.drawText(item.label, {
      x: leftMargin,
      y: yPos,
      size: 11,
      font: index === 0 ? fontBold : font,
    });

    page.drawText(item.value, {
      x: rightMargin - 80,
      y: yPos,
      size: 11,
      font: fontBold,
      color: index === 0 ? primaryColor : rgb(0, 0, 0),
    });

    yPos -= 25;
  });

  yPos -= 15;

  // Notes spéciales ou demandes particulières
  const notesText = metadata.notes || metadata.specialRequests;
  if (notesText && notesText.trim()) {
    page.drawText("Demandes particulières :", {
      x: leftMargin,
      y: yPos,
      size: 11,
      font: fontBold,
    });
    yPos -= 20;

    // Affichage des notes avec retour à la ligne
    const maxWidth = 450;
    const words = notesText.split(' ');
    let line = '';
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      if (testLine.length * 6 > maxWidth) {
        if (line) {
          page.drawText(line, {
            x: leftMargin,
            y: yPos,
            size: 10,
            font,
            color: grayText,
          });
          yPos -= 15;
          line = word;
        }
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, {
        x: leftMargin,
        y: yPos,
        size: 10,
        font,
        color: grayText,
      });
      yPos -= 15;
    }
  }

  yPos -= 30;

  // 📍 CONDITIONS GÉNÉRALES
  page.drawText("CONDITIONS GÉNÉRALES", {
    x: leftMargin,
    y: yPos,
    size: 12,
    font: fontBold,
    color: primaryColor,
  });

  yPos -= 25;

  const conditions = [
    "ARTICLE 1 - OBJET DU CONTRAT",
    "Le présent contrat a pour objet la réalisation d'une prestation photographique et/ou",
    "vidéographique lors de l'événement spécifié ci-dessus.",
    "",
    "ARTICLE 2 - OBLIGATIONS DU PRESTATAIRE",
    "• Réaliser la prestation selon les modalités convenues",
    "• Livrer les photos/vidéos retouchées dans un délai de 4 à 6 semaines",
    "• Respecter la confidentialité de l'événement",
    "• Fournir un matériel professionnel en parfait état de fonctionnement",
    "",
    "ARTICLE 3 - OBLIGATIONS DU CLIENT",
    "• Régler les sommes dues selon les modalités prévues",
    "• Informer le prestataire de tout changement d'horaire ou de lieu",
    "• Faciliter l'accès aux lieux de la prestation",
    "• Assurer la sécurité du matériel durant la prestation",
    "",
    "ARTICLE 4 - TARIFS ET MODALITÉS DE PAIEMENT",
    "• L'acompte confirme la réservation et n'est pas obligatoire",
    "• Le solde est payable le jour de la prestation (espèces, chèque ou virement)",
    "• Aucun escompte ne sera accordé en cas de paiement anticipé",
    "",
    "ARTICLE 5 - ANNULATION",
    "• Annulation par le client : possible jusqu'à 30 jours avant (acompte non remboursé)",
    "• Annulation à moins de 30 jours : intégralité due",
    "• Force majeure : report sans frais supplémentaires",
    "",
    "ARTICLE 6 - PROPRIÉTÉ INTELLECTUELLE",
    "• Le prestataire conserve tous les droits d'auteur sur ses créations",
    "• Le client dispose d'un droit d'usage privé et familial des œuvres",
    "• Toute utilisation commerciale nécessite l'accord écrit du prestataire",
    "",
    "ARTICLE 7 - LIVRAISON",
    "• Livraison sous 4 à 6 semaines via galerie en ligne sécurisée",
    "• Les fichiers source ne sont pas fournis (sauf mention contraire)",
    "• Sauvegarde garantie pendant 2 ans après livraison",
    "",
    "ARTICLE 8 - RESPONSABILITÉ",
    "• Le prestataire ne peut être tenu responsable d'événements indépendants",
    "de sa volonté (panne matériel, conditions météo, etc.)",
    "• Assurance responsabilité civile professionnelle souscrite",
    "",
    "ARTICLE 9 - DROIT À L'IMAGE",
    "• Le prestataire peut utiliser les images à des fins promotionnelles",
    "• Opposition possible sur simple demande écrite",
    "",
    "ARTICLE 10 - LITIGES",
    "• Tout litige relève de la compétence des tribunaux français",
    "• Droit applicable : droit français",
  ];

  let currentPage = page;
  let currentYPos = yPos;

  conditions.forEach((condition, index) => {
    // Vérifier si on a besoin d'une nouvelle page
    if (currentYPos < 100) {
      currentPage = pdfDoc.addPage([595, 842]);
      currentYPos = 800;
    }

    const isTitle = condition.startsWith("ARTICLE");
    const isEmpty = condition === "";
    
    if (isEmpty) {
      currentYPos -= 8;
      return;
    }

    currentPage.drawText(condition, {
      x: leftMargin,
      y: currentYPos,
      size: isTitle ? 10 : 9,
      font: isTitle ? fontBold : font,
      color: isTitle ? primaryColor : grayText,
    });
    currentYPos -= isTitle ? 18 : 12;
  });

  currentYPos -= 30;

  // Pied de page sur toutes les pages uniquement
  const pageCount = pdfDoc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    const currentPageForFooter = pdfDoc.getPage(i);
    currentPageForFooter.drawText("IRZZEN PRODUCTIONS - Contact : contact@irzzenproductions.fr - www.irzzenproductions.fr", {
      x: leftMargin,
      y: 30,
      size: 8,
      font,
      color: grayText,
    });
    
    currentPageForFooter.drawText(`Page ${i + 1}/${pageCount}`, {
      x: rightMargin - 50,
      y: 30,
      size: 8,
      font,
      color: grayText,
    });
  }

  return await pdfDoc.save();
}

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("[stripe webhook] Signature invalide:", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("[stripe webhook] Event reçu:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Checkout session completed:", session.id);

      const metadata = session.metadata || {};
      console.log("🔍 TOUTES LES MÉTADONNÉES REÇUES:", JSON.stringify(metadata, null, 2));
      
      // 🎯 Debug spécifique pour les informations du mariage
      console.log("👰 Mariée:", metadata.bride_first_name, metadata.bride_last_name);
      console.log("🤵 Marié:", metadata.groom_first_name, metadata.groom_last_name);
      console.log("📅 Date mariage:", metadata.wedding_date);
      console.log("📍 Lieux:", {
        prep: metadata.prepLocation,
        ceremonie: metadata.ceremonyLocation,
        reception: metadata.receptionLocation
      });

      // 🎯 Mapping flexible des données selon les différentes sources
      const bride_first_name = metadata.bride_first_name || "";
      const bride_last_name = metadata.bride_last_name || "";
      const groom_first_name = metadata.groom_first_name || "";
      const groom_last_name = metadata.groom_last_name || "";
      const couple_name = metadata.couple_name || `${bride_first_name} ${bride_last_name} & ${groom_first_name} ${groom_last_name}`;
      const wedding_date = metadata.wedding_date || "";
      
      // 🎯 TOUTES les informations du questionnaire détaillé
      const phone = metadata.phone || "";
      const address = metadata.address || "";
      const postalCode = metadata.postalCode || "";
      const city = metadata.city || "";
      const country = metadata.country || "";
      const guests = metadata.guests || "";
      const prepLocation = metadata.prepLocation || "";
      const prepTime = metadata.prepTime || "";
      const mairieLocation = metadata.mairieLocation || "";
      const mairieTime = metadata.mairieTime || "";
      const ceremonyLocation = metadata.ceremonyLocation || metadata.ceremony_address || "";
      const ceremonyTime = metadata.ceremonyTime || metadata.ceremony_time || "";
      const receptionLocation = metadata.receptionLocation || metadata.reception_address || "";
      const receptionTime = metadata.receptionTime || metadata.reception_time || "";
      const schedule = metadata.schedule || "";
      const specialRequests = metadata.specialRequests || "";
      
      // Prestation
      const formula = metadata.formula || "";
      const formula_description = metadata.formula_description || "";
      const total_eur = metadata.total_eur || "";
      const deposit_eur = metadata.deposit_eur || "";
      const remaining_eur = metadata.remaining_eur || "";
      const selected_options = metadata.selected_options || "";
      const extras = metadata.extras || "";
      const email = session.customer_email || metadata.email || "";

      // Objet structuré pour le PDF
      const contractData = {
        bride_first_name,
        bride_last_name,
        groom_first_name,
        groom_last_name,
        couple_name,
        wedding_date,
        phone,
        address,
        postalCode,
        city,
        country,
        guests,
        prepLocation,
        prepTime,
        mairieLocation,
        mairieTime,
        ceremonyLocation,
        ceremonyTime,
        receptionLocation,
        receptionTime,
        schedule,
        specialRequests,
        formula,
        formula_description,
        total_eur,
        deposit_eur,
        remaining_eur,
        selected_options,
        extras,
        email,
      };

      console.log("📋 Données structurées pour le PDF:", contractData);

      // 🎨 Générer le PDF professionnel avec toutes les données
      const pdfBytes = await createProfessionalPDF(contractData, session);
      console.log("📄 PDF professionnel généré, taille:", pdfBytes.length, "bytes");

      // Vérifier le bucket
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        console.error("❌ Erreur listBuckets:", bucketsError);
        return new Response("Bucket check failed", { status: 500 });
      }
      
      const contractsBucket = buckets?.find(b => b.name === 'contrats');
      if (!contractsBucket) {
        console.error("❌ Bucket 'contrats' introuvable. Buckets disponibles:", 
          buckets?.map(b => b.name));
        return new Response("Bucket not found", { status: 500 });
      }

      console.log("✅ Bucket 'contrats' trouvé");

      // Upload du PDF
      const fileName = `${session.id}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("contrats")
        .upload(fileName, pdfBytes, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        console.error("❌ Erreur upload Supabase:", uploadError);
        return new Response(`Upload failed: ${uploadError.message}`, { status: 500 });
      }

      console.log("✅ Upload réussi:", uploadData?.path);

      // URL publique
      const { data: publicUrlData } = supabase.storage
        .from("contrats")
        .getPublicUrl(fileName);

      console.log("📂 PDF professionnel accessible ici:", publicUrlData.publicUrl);

      return new Response(
        JSON.stringify({
          received: true,
          pdfUrl: publicUrlData.publicUrl,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[stripe webhook] Handler error:", err);
    return new Response(`Server error: ${err.message}`, { status: 500 });
  }
}