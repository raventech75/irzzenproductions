// lib/pdf-generator.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type Stripe from "stripe";

// Copiez EXACTEMENT votre fonction createProfessionalPDF du webhook ici
export async function createProfessionalPDF(metadata: any, session: Stripe.Checkout.Session) {
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

  // 🛠️ Fonction pour formater une date
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

  // 📋 EN-TÊTE
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

  // 📋 INFORMATIONS GÉNÉRALES
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

  // 📋 PRESTATAIRE
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

  // 📋 INFORMATIONS CLIENT
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

  // 📋 DÉTAILS DU MARIAGE
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

  // 🛠️ Toutes les informations du mariage détaillées
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

  // 📋 PRESTATION SÉLECTIONNÉE
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
    options.forEach((option: string) => {
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
    extras.forEach((extra: string) => {
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

  // 📋 RÉCAPITULATIF FINANCIER
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

  // 📋 CONDITIONS GÉNÉRALES (version simplifiée pour cette page)
  page.drawText("CONDITIONS GÉNÉRALES", {
    x: leftMargin,
    y: yPos,
    size: 12,
    font: fontBold,
    color: primaryColor,
  });

  yPos -= 25;

  const conditions = [
    "• Acompte non obligatoire mais recommandé (15% du montant total)",
    "• Solde à régler le jour de la prestation (espèces, chèque ou virement)",
    "• Livraison sous 4 à 6 semaines via galerie en ligne sécurisée",
    "• Le prestataire conserve tous les droits d'auteur sur ses créations",
    "• Le client dispose d'un droit d'usage privé et familial des œuvres",
    "• Annulation possible jusqu'à 30 jours avant (acompte non remboursé)",
    "• En cas de force majeure : report sans frais supplémentaires",
    "• Assurance responsabilité civile professionnelle souscrite",
  ];

  let currentPage = page;
  let currentYPos = yPos;

  conditions.forEach(condition => {
    // Vérifier si on a besoin d'une nouvelle page
    if (currentYPos < 100) {
      currentPage = pdfDoc.addPage([595, 842]);
      currentYPos = 800;
      
      // En-tête nouvelle page
      currentPage.drawText("CONTRAT IRZZEN PRODUCTIONS (suite)", {
        x: leftMargin, y: currentYPos, size: 12, font: fontBold, color: primaryColor,
      });
      currentYPos -= 30;
    }

    currentPage.drawText(condition, {
      x: leftMargin,
      y: currentYPos,
      size: 10,
      font,
      color: grayText,
    });
    currentYPos -= 15;
  });

  // Pied de page sur toutes les pages
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