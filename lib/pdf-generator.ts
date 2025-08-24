// lib/pdf-generator.ts - Version corrigée : sans signatures, positions fixes, en-tête ajusté
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type Stripe from "stripe";

export async function createProfessionalPDF(metadata: any, session: Stripe.Checkout.Session) {
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage([595, 842]); // Format A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Couleurs Irzzenproductions
  const primaryColor = rgb(0.918, 0.345, 0); // #EA580C - Orange brand
  const accentColor = rgb(1, 0.7, 0.5); // Orange clair
  const grayText = rgb(0.3, 0.3, 0.3);
  const lightGray = rgb(0.98, 0.95, 0.92); // Beige très clair
  const darkText = rgb(0.1, 0.1, 0.1);
  
  let yPos = 780; // Position initiale ajustée pour éviter la troncature
  const leftMargin = 50;
  const rightMargin = 545;
  const lineHeight = 15;
  const pageHeight = 842;

  // 🛠️ HELPERS AMÉLIORÉS
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.trim() === "") return "";
    try {
      // Format YYYY-MM-DD vers DD/MM/YYYY
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formatTime = (time: string) => {
    if (!time || time.trim() === "") return "";
    return time.replace(/^(\d{2}):(\d{2})/, "$1h$2");
  };

  const cleanText = (text: any) => {
    return String(text || "")
      .replace(/\u202F/g, " ") // Espace insécable fine
      .replace(/\u00A0/g, " ") // Espace insécable
      .replace(/\u2019/g, "'") // Apostrophe courbe
      .replace(/\u2013/g, "-") // Tiret moyen
      .replace(/\u2014/g, "--") // Tiret long
      .replace(/\u201C/g, '"') // Guillemet ouvrant
      .replace(/\u201D/g, '"') // Guillemet fermant
      .trim();
  };

  const checkNewPage = (requiredSpace = 80) => {
    if (yPos < requiredSpace) {
      currentPage = pdfDoc.addPage([595, 842]);
      yPos = pageHeight - 50; // Position sûre en haut
      
      // En-tête page suivante
      currentPage.drawText("CONTRAT IRZZEN PRODUCTIONS (suite)", {
        x: leftMargin,
        y: yPos,
        size: 12,
        font: fontBold,
        color: primaryColor,
      });
      yPos -= 40;
    }
  };

  const addSection = (title: string, offsetY = 30) => {
    checkNewPage(100); // S'assurer qu'on a assez de place
    yPos -= offsetY;
    
    currentPage.drawRectangle({
      x: leftMargin - 10,
      y: yPos - 15,
      width: rightMargin - leftMargin + 20,
      height: 30,
      color: lightGray,
    });
    
    currentPage.drawText(cleanText(title), {
      x: leftMargin,
      y: yPos,
      size: 14,
      font: fontBold,
      color: primaryColor,
    });
    yPos -= 35;
  };

  const addTextLine = (label: string, value?: string, bold = false, indent = 0) => {
    if (!value || cleanText(value) === "") return;
    
    checkNewPage();
    
    const text = label && label !== "" ? `${cleanText(label)} : ${cleanText(value)}` : cleanText(value);
    currentPage.drawText(text, {
      x: leftMargin + indent,
      y: yPos,
      size: label && label !== "" ? 10 : 11,
      font: bold ? fontBold : font,
      color: label && label !== "" ? darkText : darkText,
    });
    yPos -= lineHeight;
  };

  const addLongText = (text: string, maxWidth = 450, indent = 10, fontSize = 10) => {
    if (!text || cleanText(text) === "") return;
    
    const cleanedText = cleanText(text);
    const words = cleanedText.split(' ');
    let currentLine = '';
    const charWidth = fontSize * 0.6;
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (testLine.length * charWidth > maxWidth && currentLine) {
        checkNewPage();
        currentPage.drawText(currentLine, {
          x: leftMargin + indent,
          y: yPos,
          size: fontSize,
          font,
          color: grayText,
        });
        yPos -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      checkNewPage();
      currentPage.drawText(currentLine, {
        x: leftMargin + indent,
        y: yPos,
        size: fontSize,
        font,
        color: grayText,
      });
      yPos -= lineHeight;
    }
  };

  // 📋 EN-TÊTE PROFESSIONNEL - Position ajustée
  currentPage.drawRectangle({
    x: 0,
    y: yPos,
    width: 595,
    height: 70,
    color: primaryColor,
  });
  
  currentPage.drawText("CONTRAT DE PRESTATION PHOTOGRAPHIQUE", {
    x: leftMargin,
    y: yPos + 35,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  
  currentPage.drawText("IRZZEN PRODUCTIONS - Mariage & Événements", {
    x: leftMargin,
    y: yPos + 15,
    size: 12,
    font,
    color: rgb(1, 1, 1),
  });

  yPos -= 100;

  // 📋 INFORMATIONS GÉNÉRALES - Sans référence contrat
  addSection("INFORMATIONS GÉNÉRALES");
  addTextLine("Date du contrat", new Date().toLocaleDateString('fr-FR'));
  
  yPos -= 15;

  // 📋 LE PRESTATAIRE
  addSection("LE PRESTATAIRE");
  addTextLine("", "IRZZENPRODUCTIONS", true);
  addTextLine("Société", "Société de services audiovisuels");
  addTextLine("Email", "contact@irzzenproductions.fr");
  addTextLine("Téléphone", "06.59.83.53.26");
  addTextLine("Adresse", "63, avenue de la résistance, 93230 Romainville");
  
  yPos -= 15;

  // 📋 LE CLIENT - FORMATAGE CORRIGÉ
  addSection("LE CLIENT");
  
  // Reconstruction correcte des noms
  const brideFirst = cleanText(metadata.bride_first_name || "");
  const brideLast = cleanText(metadata.bride_last_name || "");
  const groomFirst = cleanText(metadata.groom_first_name || "");
  const groomLast = cleanText(metadata.groom_last_name || "");
  
  let coupleName = "";
  if (brideFirst || brideLast || groomFirst || groomLast) {
    const brideName = [brideFirst, brideLast].filter(Boolean).join(" ");
    const groomName = [groomFirst, groomLast].filter(Boolean).join(" ");
    
    if (brideName && groomName) {
      coupleName = `${brideName} & ${groomName}`;
    } else if (brideName) {
      coupleName = brideName;
    } else if (groomName) {
      coupleName = groomName;
    }
  }
  
  // Fallback sur couple_name si reconstruction échoue
  if (!coupleName && metadata.couple_name) {
    coupleName = cleanText(metadata.couple_name);
  }
  
  if (!coupleName) {
    coupleName = "Couple à préciser";
  }
  
  addTextLine("Futurs époux", coupleName, true);
  
  const clientEmail = session.customer_email || metadata.email || "";
  addTextLine("Email", clientEmail);
  addTextLine("Téléphone", metadata.phone);
  
  // Adresse complète si disponible
  const addressParts = [
    cleanText(metadata.address || ""),
    cleanText(metadata.postalCode || ""),
    cleanText(metadata.city || ""),
    cleanText(metadata.country || "")
  ].filter(part => part !== "");
  
  if (addressParts.length > 0) {
    addTextLine("Adresse", addressParts.join(", "));
  }

  yPos -= 15;

  // 📋 DÉTAILS DU MARIAGE - FORMATAGE DATE CORRIGÉ
  addSection("DÉTAILS DU MARIAGE");
  
  const weddingDateFormatted = formatDate(metadata.wedding_date);
  const displayDate = weddingDateFormatted || "Date à confirmer";
  addTextLine("Date du mariage", displayDate, true);
  
  if (metadata.guests && cleanText(metadata.guests) !== "") {
    addTextLine("Nombre d'invités", `${metadata.guests} personnes`);
  }
  
  yPos -= 15;

  // 🏰 PLANNING ET LIEUX - FORCER NOUVELLE PAGE
  const hasLocation = metadata.prepLocation || metadata.mairieLocation || 
                     metadata.ceremonyLocation || metadata.receptionLocation;
  
  if (hasLocation) {
    // Forcer nouvelle page pour le planning
    currentPage = pdfDoc.addPage([595, 842]);
    yPos = pageHeight - 50;
    
    currentPage.drawText("CONTRAT IRZZEN PRODUCTIONS (suite)", {
      x: leftMargin,
      y: yPos,
      size: 12,
      font: fontBold,
      color: primaryColor,
    });
    yPos -= 60; // Plus d'espace après l'en-tête
    
    addSection("PLANNING ET LIEUX", 0); // Pas d'offset supplémentaire
    
    if (metadata.prepLocation) {
      const prepTime = formatTime(metadata.prepTime || "");
      const prepText = prepTime ? `${prepTime} - ${metadata.prepLocation}` : metadata.prepLocation;
      addTextLine("Préparatifs", prepText);
    }
    
    if (metadata.mairieLocation) {
      const mairieTime = formatTime(metadata.mairieTime || "");
      const mairieText = mairieTime ? `${mairieTime} - ${metadata.mairieLocation}` : metadata.mairieLocation;
      addTextLine("Mairie", mairieText);
    }
    
    if (metadata.ceremonyLocation) {
      const ceremonyTime = formatTime(metadata.ceremonyTime || "");
      const ceremonyText = ceremonyTime ? `${ceremonyTime} - ${metadata.ceremonyLocation}` : metadata.ceremonyLocation;
      addTextLine("Cérémonie", ceremonyText);
    }
    
    if (metadata.receptionLocation) {
      const receptionTime = formatTime(metadata.receptionTime || "");
      const receptionText = receptionTime ? `${receptionTime} - ${metadata.receptionLocation}` : metadata.receptionLocation;
      addTextLine("Réception", receptionText);
    }
    
    yPos -= 15;
  }

  // 📅 DÉROULEMENT DÉTAILLÉ
  if (metadata.schedule && cleanText(metadata.schedule) !== "") {
    addSection("DÉROULEMENT DE LA JOURNÉE");
    addLongText(metadata.schedule);
    yPos -= 15;
  }

  // 📋 PRESTATION SÉLECTIONNÉE
  addSection("PRESTATION SÉLECTIONNÉE");
  
  const formula = cleanText(metadata.formula || "Formule non spécifiée");
  addTextLine("", formula, true);
  
  // Description de la formule
  if (metadata.formula_description && cleanText(metadata.formula_description) !== "") {
    yPos -= 5;
    addLongText(metadata.formula_description);
  } else {
    // Ajouter description générique selon la formule
    let genericDescription = "";
    if (formula.toLowerCase().includes("classique")) {
      genericDescription = "Reportage complet de votre journée, des préparatifs au début de soirée. Mariages traditionnels, journées complètes, couples souhaitant un reportage détaillé.";
    } else if (formula.toLowerCase().includes("complète") && formula.toLowerCase().includes("photo") && formula.toLowerCase().includes("vidéo")) {
      genericDescription = "Couverture photo et vidéo par un seul professionnel polyvalent. Couples cherchant photo + vidéo avec un budget maîtrisé.";
    } else if (formula.toLowerCase().includes("essentielle")) {
      genericDescription = "L'essentiel de votre mariage capturé avec soin et professionnalisme. Mariages intimistes, cérémonies simples.";
    } else if (formula.toLowerCase().includes("premium")) {
      genericDescription = "Expérience photo-vidéo complète avec équipe dédiée. Grands mariages, couples exigeants.";
    }
    
    if (genericDescription) {
      yPos -= 5;
      addLongText(genericDescription);
    }
  }
  
  // Features selon la formule
  let features: string[] = [];
  
  if (formula.toLowerCase().includes("classique")) {
    features = [
      "Cette formule comprend :",
      "• Couverture photo 8h",
      "• 400+ photos retouchées", 
      "• Galerie en ligne privée",
      "• Clé USB personnalisée",
      "• Livraison sous 4 semaines"
    ];
  } else if (formula.toLowerCase().includes("complète") && formula.toLowerCase().includes("photo") && formula.toLowerCase().includes("vidéo")) {
    features = [
      "Cette formule comprend :",
      "• Couverture photo + vidéo 8h",
      "• 300+ photos retouchées", 
      "• Film highlight 3-5 min",
      "• Galerie en ligne privée",
      "• Clé USB avec photos et vidéos"
    ];
  } else if (formula.toLowerCase().includes("essentielle")) {
    features = [
      "Cette formule comprend :",
      "• Couverture photo 4h",
      "• 200 photos retouchées",
      "• Galerie en ligne privée", 
      "• Livraison sous 4 semaines"
    ];
  }
  
  if (features.length > 0) {
    yPos -= 10;
    features.forEach(feature => {
      addTextLine("", feature, feature === "Cette formule comprend :" ? true : false, feature.startsWith("•") ? 10 : 0);
    });
  }

  yPos -= 10; // Réduire l'espacement

  // OPTIONS ET EXTRAS
  const hasOptions = metadata.selected_options && cleanText(metadata.selected_options) !== "";
  const hasExtras = metadata.extras && cleanText(metadata.extras) !== "";
  
  if (hasOptions || hasExtras) {
    addSection("OPTIONS ET SERVICES SUPPLÉMENTAIRES");
    
    if (hasOptions) {
      addTextLine("", "Options incluses :", true);
      try {
        const options = metadata.selected_options.split(', ').filter((opt: string) => cleanText(opt) !== "");
        options.forEach((option: string) => {
          addTextLine("", `• ${cleanText(option)}`, false, 10);
        });
      } catch {
        addTextLine("", `• ${cleanText(metadata.selected_options)}`, false, 10);
      }
    }
    
    if (hasExtras) {
      if (hasOptions) yPos -= 10;
      addTextLine("", "Services supplémentaires :", true);
      try {
        const extras = metadata.extras.split('|').filter((ext: string) => cleanText(ext) !== "");
        extras.forEach((extra: string) => {
          const [label, price] = extra.split(':');
          if (label && price) {
            addTextLine("", `• ${cleanText(label)} : ${cleanText(price)}€`, false, 10);
          }
        });
      } catch {
        addTextLine("", `• ${cleanText(metadata.extras)}`, false, 10);
      }
    }
    
    yPos -= 15;
  }

  // 💰 RÉCAPITULATIF FINANCIER AMÉLIORÉ
  addSection("RÉCAPITULATIF FINANCIER");
  
  const totalEur = cleanText(metadata.total_eur || '0');
  const depositEur = cleanText(metadata.deposit_eur || '0');
  const remainingEur = cleanText(metadata.remaining_eur || '0');
  
  // Tableau financier avec alignement
  const financialData = [
    { label: "Total de la prestation", value: `${totalEur}€`, bold: true },
    { label: "Acompte suggéré (15%)", value: `${depositEur}€`, bold: false },
    { label: "Reste à payer le jour J", value: `${remainingEur}€`, bold: false },
  ];

  financialData.forEach((item, index) => {
    checkNewPage();
    
    // Ligne alternée pour lisibilité
    if (index % 2 === 0) {
      currentPage.drawRectangle({
        x: leftMargin - 5,
        y: yPos - 3,
        width: rightMargin - leftMargin + 10,
        height: 18,
        color: rgb(0.98, 0.98, 0.98),
      });
    }

    currentPage.drawText(cleanText(item.label), {
      x: leftMargin,
      y: yPos,
      size: 11,
      font: item.bold ? fontBold : font,
      color: darkText,
    });

    currentPage.drawText(cleanText(item.value), {
      x: rightMargin - 80,
      y: yPos,
      size: 11,
      font: fontBold,
      color: index === 0 ? primaryColor : darkText,
    });

    yPos -= 20;
  });

  yPos -= 15;

  // 📝 DEMANDES PARTICULIÈRES
  if (metadata.specialRequests && cleanText(metadata.specialRequests) !== "") {
    addSection("DEMANDES PARTICULIÈRES");
    addLongText(metadata.specialRequests);
    yPos -= 15;
  }

  // ⚖️ CONDITIONS GÉNÉRALES SIMPLIFIÉES
  addSection("CONDITIONS GÉNÉRALES", 20);
  
  const conditions = [
    "• Acompte recommandé : 15% du montant total pour confirmation de réservation",
    "• Solde à régler le jour de la prestation (espèces, chèque ou virement)",
    "• Livraison : galerie en ligne sécurisée selon formule", 
    "• Droits d'auteur : conservés par Irzzenproductions",
    "• Droit d'usage : privé et familial accordé au client",
    "• Annulation : possible jusqu'à 30 jours avant (acompte non remboursé)",
    "• Force majeure : report avec frais supplémentaires et sous conditions",
    "• Assurance responsabilité civile professionnelle souscrite"
  ];

  conditions.forEach(condition => {
    checkNewPage();
    currentPage.drawText(cleanText(condition), {
      x: leftMargin,
      y: yPos,
      size: 9,
      font,
      color: grayText,
    });
    yPos -= 12;
  });

  // === MENTIONS LÉGALES - Optimiser la transition ===
  // Si on a encore de la place sur la page courante, utiliser l'espace
  if (yPos > 200) {
    yPos -= 40; // Petit espace seulement
    currentPage.drawText("MENTIONS LÉGALES ET CONDITIONS GÉNÉRALES", {
      x: leftMargin, y: yPos, size: 16, font: fontBold, color: primaryColor,
    });
    yPos -= 40;
  } else {
    // Sinon nouvelle page
    currentPage = pdfDoc.addPage([595, 842]);
    yPos = pageHeight - 60;
    currentPage.drawText("MENTIONS LÉGALES ET CONDITIONS GÉNÉRALES", {
      x: leftMargin, y: yPos, size: 16, font: fontBold, color: primaryColor,
    });
    yPos -= 40;
  }

  // Contenu légal complet pour prestataire photo/vidéo
  const legalSections = [
    {
      title: "ARTICLE 1 - OBJET ET CHAMP D'APPLICATION",
      content: `Les présentes conditions générales de vente s'appliquent à toute prestation de service photographique et vidéographique fournie par IRZZEN PRODUCTIONS. Elles prévalent sur tout autre document commercial du client. Toute commande implique l'acceptation sans réserve des présentes conditions. Les prestations comprennent la prise de vue photographique et/ou vidéographique selon la formule choisie, le traitement et la retouche des images, et la livraison des supports finalisés dans les délais convenus.`
    },
    {
      title: "ARTICLE 2 - PRESTATIONS ET TARIFS",
      content: `Les prestations sont personnalisées selon les besoins exprimés par le client. Les tarifs sont exprimés en euros TTC et sont fermes pour la durée de validité du devis. Un acompte de 15% du montant total est exigible à la commande pour confirmer la réservation. Le solde est payable le jour de la prestation, avant le début de celle-ci. En cas de retard de paiement, des pénalités de 3% par mois seront appliquées.`
    },
    {
      title: "ARTICLE 3 - ANNULATION ET REPORT", 
      content: `En cas d'annulation par le client : aucun remboursement de l'acompte ne pourra être réclamé . Un report reste possible selon disponibilités. En cas d'annulation par le prestataire, remboursement intégral des sommes versées.`
    },
    {
      title: "ARTICLE 4 - DROITS D'AUTEUR ET UTILISATION",
      content: `IRZZENPRODUCTIONS conserve l'entière propriété intellectuelle des œuvres créées. Le client bénéficie d'un droit d'usage personnel et familial non exclusif des photographies et vidéos. Toute utilisation commerciale, publication, diffusion publique ou sur réseaux sociaux nécessite l'accord écrit préalable du prestataire. Le prestataire se réserve le droit d'utiliser les œuvres à des fins promotionnelles sauf opposition écrite du client.`
    },
    {
      title: "ARTICLE 5 - LIVRAISON ET DÉLAIS",
      content: `Les supports finalisés sont livrés dans un délai convenu dans votre formule après l'événement. La livraison s'effectue par galerie en ligne privée ou support physique selon la formule choisie. Le client doit sauvegarder les fichiers reçus, IRZZENPRODUCTIONS ne garantit pas leur conservation au-delà de 3 mois. Les délais peuvent être prolongés en cas de force majeure.`
    },
    {
      title: "ARTICLE 6 - RESPONSABILITÉ ET ASSURANCE",
      content: `IRZZENPRODUCTIONS met en œuvre tous les moyens pour assurer la qualité de la prestation. Une assurance responsabilité civile professionnelle est souscrite. Sa responsabilité ne saurait être engagée en cas de vol, perte ou détérioration du matériel due à des causes extérieures. La responsabilité est limitée au montant de la prestation. En cas de défaillance technique majeure, un geste commercial sera effectué.`
    },
    {
      title: "ARTICLE 7 - DROIT À L'IMAGE ET AUTORISATION",
      content: `Le client autorise IRZZENPRODUCTIONS à prendre des photographies et vidéos durant l'événement. Le client s'engage à informer ses invités de la présence du photographe/vidéaste et à recueillir leur accord pour les prises de vue. Les personnes ne souhaitant pas être photographiées devront le signaler. Le prestataire respectera cette demande dans la mesure du possible.`
    },
    {
      title: "ARTICLE 8 - FORCE MAJEURE",
      content: `En cas de force majeure (conditions météorologiques extrêmes, grève, pandémie, maladie du prestataire), les parties conviennent d'un report sans pénalité. Si le report s'avère impossible, les sommes versées seront remboursées proportionnellement aux prestations non effectuées. Les frais engagés non récupérables resteront à la charge du client.`
    },
    {
      title: "ARTICLE 9 - DONNÉES PERSONNELLES",
      content: `Les données personnelles collectées sont utilisées uniquement pour l'exécution du contrat et la gestion de la relation commerciale. Conformément au RGPD, le client dispose d'un droit d'accès, de rectification et de suppression de ses données en contactant contact@irzzenproductions.fr. Les données sont conservées 5 ans maximum après la fin de la prestation.`
    },
    {
      title: "ARTICLE 10 - DROIT APPLICABLE ET LITIGES",
      content: `Le présent contrat est soumis au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux français seront compétents.`
    }
  ];

  // Affichage des sections légales avec gestion corrigée des positions
  legalSections.forEach(section => {
    // Vérifier espace pour le titre - position corrigée
    if (yPos < 120) {
      currentPage = pdfDoc.addPage([595, 842]);
      yPos = pageHeight - 60; // Position sûre en haut
    }

    // Titre de section
    currentPage.drawText(cleanText(section.title), {
      x: leftMargin,
      y: yPos,
      size: 11,
      font: fontBold,
      color: primaryColor,
    });
    yPos -= 25; // Espacement après titre

    // Contenu - traitement ligne par ligne pour éviter le chevauchement
    const lines = cleanText(section.content).split('\n').filter(line => line.trim() !== '');
    
    lines.forEach(line => {
      // Découper les lignes trop longues
      const words = line.trim().split(' ');
      let currentLine = '';
      const maxCharsPerLine = 70;

      words.forEach(word => {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        
        if (testLine.length > maxCharsPerLine && currentLine) {
          // Écrire la ligne actuelle
          if (yPos < 80) {
            currentPage = pdfDoc.addPage([595, 842]);
            yPos = pageHeight - 60;
          }
          
          currentPage.drawText(cleanText(currentLine), {
            x: leftMargin,
            y: yPos,
            size: 9,
            font,
            color: darkText,
          });
          yPos -= 14; // Espacement entre lignes constant
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });

      // Dernière ligne de ce paragraphe
      if (currentLine.trim()) {
        if (yPos < 80) {
          currentPage = pdfDoc.addPage([595, 842]);
          yPos = pageHeight - 60;
        }
        
        currentPage.drawText(cleanText(currentLine), {
          x: leftMargin,
          y: yPos,
          size: 9,
          font,
          color: darkText,
        });
        yPos -= 14;
      }
    });

    yPos -= 20; // Espacement entre sections plus important
  });

  // PIEDS DE PAGE sur toutes les pages
  const pageCount = pdfDoc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    const currentPageForFooter = pdfDoc.getPage(i);
    
    // Ligne de séparation
    currentPageForFooter.drawRectangle({
      x: leftMargin,
      y: 50,
      width: rightMargin - leftMargin,
      height: 1,
      color: lightGray,
    });
    
    currentPageForFooter.drawText("IRZZEN PRODUCTIONS", {
      x: leftMargin, y: 35, size: 8, font: fontBold, color: primaryColor,
    });
    
    currentPageForFooter.drawText("Email: contact@irzzenproductions.fr • Web: www.irzzenproductions.fr", {
      x: leftMargin, y: 25, size: 8, font, color: grayText,
    });
    
    currentPageForFooter.drawText(`Page ${i + 1}/${pageCount}`, {
      x: rightMargin - 60, y: 35, size: 8, font, color: grayText,
    });
  }

  console.log("✅ [PDF] Contrat professionnel corrigé généré sans signatures");
  return await pdfDoc.save();
}