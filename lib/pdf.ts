import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface BuildPdfArgs {
  couple_name: string;
  email: string;
  wedding_date: string;
  formula: string;
  total_eur: number;
  client_phone?: string;
  address_billing?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  guests?: string;
  prep_address_bride?: string;
  prep_time_bride?: string;
  prep_address_groom?: string;
  prep_time_groom?: string;
  mairie_address?: string;
  mairie_time?: string;
  ceremony_type?: string;
  ceremony_address?: string;
  ceremony_time?: string;
  reception_address?: string;
  reception_time?: string;
  schedule?: string;
  special_requests?: string;
  selected_options?: string[];
  extras?: { label: string; price: number }[];
  deposit_amount?: number;
  remaining_amount?: number;
  notes?: string;
}

export async function buildBookingPdf(args: BuildPdfArgs): Promise<Uint8Array> {
  try {
    console.log("🚀 [CONTRACT-VERSION-2025] Génération contrat professionnel COMPLET...");
    console.log("📊 [CONTRACT] Version avec conditions générales et mentions légales");
    
    // Fonction de nettoyage
    const clean = (text: any): string => {
      return String(text || "")
        .replace(/\u202F/g, " ")
        .replace(/\u00A0/g, " ")
        .replace(/[^\x20-\x7E\u00C0-\u017F]/g, " ")
        .trim();
    };
    
    const pdf = await PDFDocument.create();
    const regular = await pdf.embedFont(StandardFonts.Helvetica);
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    // Constantes
    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;
    const MARGIN = 50;
    const LINE_HEIGHT = 14;

    // Variables globales
    let currentPage = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let yPos = PAGE_HEIGHT - 60;
    let pageNum = 1;

    // Couleurs
    const brandColor = rgb(1, 0.45, 0);
    const grayColor = rgb(0.4, 0.4, 0.4);
    const blackColor = rgb(0, 0, 0);
    const lightGray = rgb(0.95, 0.95, 0.95);

    // Fonction pour nouvelle page
    function newPage() {
      currentPage = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      yPos = PAGE_HEIGHT - MARGIN;
      pageNum++;
      
      // Numéro de page en bas à droite
      currentPage.drawText(`Page ${pageNum}`, {
        x: PAGE_WIDTH - MARGIN - 40,
        y: 30,
        size: 9,
        font: regular,
        color: grayColor
      });
    }

    // Fonction pour vérifier l'espace
    function checkSpace(needed: number) {
      if (yPos < MARGIN + needed) {
        newPage();
      }
    }

    // Fonction pour ajouter du texte
    function addText(text: string, options: {
      size?: number;
      font?: any;
      color?: any;
      x?: number;
      indent?: number;
      spacing?: number;
    } = {}) {
      const {
        size = 11,
        font = regular,
        color = blackColor,
        x = MARGIN + (options.indent || 0),
        spacing = LINE_HEIGHT
      } = options;

      checkSpace(spacing + 5);
      
      currentPage.drawText(clean(text), {
        x,
        y: yPos,
        size,
        font,
        color
      });
      
      yPos -= spacing;
    }

    // Fonction pour ajouter une section avec fond
    function addSectionHeader(title: string, backgroundColor = lightGray) {
      checkSpace(35);
      
      // Rectangle de fond
      currentPage.drawRectangle({
        x: MARGIN - 5,
        y: yPos - 20,
        width: PAGE_WIDTH - 2 * MARGIN + 10,
        height: 25,
        color: backgroundColor
      });
      
      addText(title, {
        size: 13,
        font: bold,
        color: brandColor,
        spacing: 25
      });
    }

    // Fonction pour ajouter du texte long avec retour à la ligne
    function addParagraph(text: string, options: any = {}) {
      const maxWidth = PAGE_WIDTH - 2 * MARGIN - (options.indent || 0);
      const fontSize = options.size || 10;
      const words = text.split(' ');
      let currentLine = '';
      
      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = regular.widthOfTextAtSize(testLine, fontSize);
        
        if (textWidth > maxWidth && currentLine) {
          addText(currentLine, { ...options, spacing: 12 });
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      
      if (currentLine) {
        addText(currentLine, { ...options, spacing: 12 });
      }
    }

    console.log("📄 [CONTRACT] Page 1 - En-tête...");
    
    // ========== EN-TÊTE PROFESSIONNEL ==========
    // Bandeau orange
    currentPage.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 100,
      width: PAGE_WIDTH,
      height: 100,
      color: brandColor
    });

    currentPage.drawText(clean("IRZZEN PRODUCTIONS"), {
      x: MARGIN,
      y: PAGE_HEIGHT - 40,
      size: 22,
      font: bold,
      color: rgb(1, 1, 1)
    });

    currentPage.drawText(clean(">>> VERSION COMPLETE AVEC CONDITIONS GÉNÉRALES <<<"), {
      x: MARGIN,
      y: PAGE_HEIGHT - 60,
      size: 12,
      font: regular,
      color: rgb(1, 1, 1)
    });

    currentPage.drawText(clean("CONTRAT DE PRESTATION"), {
      x: MARGIN,
      y: PAGE_HEIGHT - 80,
      size: 16,
      font: bold,
      color: rgb(1, 1, 1)
    });

    // Date du contrat en haut à droite
    const today = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    currentPage.drawText(clean(`Établi le ${today}`), {
      x: PAGE_WIDTH - MARGIN - 120,
      y: PAGE_HEIGHT - 35,
      size: 10,
      font: regular,
      color: rgb(1, 1, 1)
    });

    yPos = PAGE_HEIGHT - 130;

    // ========== PARTIES AU CONTRAT ==========
    addSectionHeader("PARTIES AU CONTRAT");
    
    addText("LE PRESTATAIRE :", {
      size: 12,
      font: bold,
      spacing: 18
    });
    
    addText("IRZZEN PRODUCTIONS", {
      indent: 15,
      font: bold
    });
    addText("Société de services audiovisuels", { indent: 15 });
    addText("Email : contact@irzzenproductions.fr", { indent: 15 });
    addText("Téléphone : [À compléter]", { indent: 15 });
    addText("Adresse : [À compléter]", { indent: 15 });
    addText("SIRET : [À compléter]", { indent: 15 });
    
    yPos -= 10;
    
    addText("LE CLIENT :", {
      size: 12,
      font: bold,
      spacing: 18
    });
    
    addText(`Futurs époux : ${args.couple_name}`, {
      indent: 15,
      font: bold
    });
    
    if (args.email) {
      addText(`Email : ${args.email}`, { indent: 15 });
    }
    if (args.client_phone) {
      addText(`Téléphone : ${args.client_phone}`, { indent: 15 });
    }
    
    // Adresse complète
    const addressParts = [
      args.address_billing,
      args.postal_code && args.city ? `${args.postal_code} ${args.city}` : args.city,
      args.country && args.country !== 'France' ? args.country : null
    ].filter(Boolean);
    
    if (addressParts.length > 0) {
      addText("Adresse :", { indent: 15, font: bold });
      addressParts.forEach(part => {
        addText(part!, { indent: 25 });
      });
    }

    yPos -= 15;

    // ========== OBJET DU CONTRAT ==========
    addSectionHeader("OBJET DU CONTRAT");
    
    addParagraph(
      "Le présent contrat a pour objet la prestation de services photographiques et/ou " +
      "vidéographiques pour l'événement de mariage défini ci-après. La prestation sera " +
      "réalisée selon les modalités et conditions définies dans le présent contrat."
    );

    yPos -= 10;

    // ========== DÉTAILS DE LA PRESTATION ==========
    addSectionHeader("DÉTAILS DE LA PRESTATION");
    
    addText(`Date de l'événement : ${args.wedding_date || "À confirmer"}`, {
      font: bold,
      size: 12
    });
    
    addText(`Formule choisie : ${args.formula}`, {
      font: bold,
      size: 12
    });

    if (args.guests) {
      addText(`Nombre d'invités : ${args.guests} personnes`);
    }

    // Planning détaillé
    if (args.prep_time_bride || args.mairie_time || args.ceremony_time || args.reception_time) {
      yPos -= 5;
      addText("Planning de la journée :", { font: bold });
      
      const planningItems = [
        { label: "Préparatifs", time: args.prep_time_bride, location: args.prep_address_bride },
        { label: "Mairie", time: args.mairie_time, location: args.mairie_address },
        { label: "Cérémonie", time: args.ceremony_time, location: args.ceremony_address },
        { label: "Réception", time: args.reception_time, location: args.reception_address }
      ];

      planningItems.forEach(item => {
        if (item.time || item.location) {
          let text = `• ${item.label}`;
          if (item.time) text += ` : ${item.time}`;
          if (item.location) text += ` - ${item.location}`;
          addText(text, { indent: 15, size: 10 });
        }
      });
    }

    // Options et services additionnels
    if (args.selected_options?.length || args.extras?.length) {
      yPos -= 10;
      addText("Services inclus :", { font: bold });
      
      args.selected_options?.forEach(option => {
        addText(`• ${option}`, { indent: 15, size: 10 });
      });
      
      args.extras?.forEach(extra => {
        addText(`• ${extra.label} - ${extra.price} €`, { indent: 15, size: 10 });
      });
    }

    // Demandes particulières
    if (args.special_requests) {
      yPos -= 10;
      addText("Demandes particulières :", { font: bold });
      addParagraph(args.special_requests, { indent: 15, size: 10 });
    }

    if (args.schedule) {
      yPos -= 10;
      addText("Déroulement détaillé :", { font: bold });
      addParagraph(args.schedule, { indent: 15, size: 10 });
    }

    // ========== TARIFICATION ==========
    checkSpace(120);
    addSectionHeader("TARIFICATION ET MODALITÉS DE PAIEMENT", rgb(1, 0.9, 0.8));
    
    // Tableau des prix
    const priceData = [
      { label: "Total de la prestation", value: `${args.total_eur.toLocaleString('fr-FR')} €`, bold: true },
      { label: "Acompte à la signature", value: `${(args.deposit_amount || 0).toLocaleString('fr-FR')} €` },
      { label: "Solde à régler le jour J", value: `${(args.remaining_amount || 0).toLocaleString('fr-FR')} €` }
    ];

    priceData.forEach((item, index) => {
      checkSpace(20);
      
      // Fond alterné
      if (index % 2 === 0) {
        currentPage.drawRectangle({
          x: MARGIN - 5,
          y: yPos - 5,
          width: PAGE_WIDTH - 2 * MARGIN + 10,
          height: 18,
          color: rgb(0.98, 0.98, 0.98)
        });
      }
      
      addText(item.label, {
        font: item.bold ? bold : regular,
        size: item.bold ? 12 : 11
      });
      
      currentPage.drawText(clean(item.value), {
        x: PAGE_WIDTH - MARGIN - 80,
        y: yPos + LINE_HEIGHT,
        size: item.bold ? 12 : 11,
        font: bold,
        color: item.bold ? brandColor : blackColor
      });
    });

    yPos -= 15;
    
    addParagraph(
      "L'acompte de 15% du montant total est exigible à la signature du présent contrat " +
      "pour confirmer la réservation de la date. Le solde sera réglé le jour de la " +
      "prestation, avant le début de celle-ci, par virement bancaire ou en espèces."
    );

    // ========== CONDITIONS GÉNÉRALES (nouvelle page) ==========
    newPage();
    console.log("📄 [CONTRACT] Page 2 - Conditions générales...");
    
    addText("CONDITIONS GÉNÉRALES DE PRESTATION", {
      size: 16,
      font: bold,
      color: brandColor,
      spacing: 30
    });

    // Article 1
    addText("ARTICLE 1 - PRESTATIONS", { font: bold, size: 12, spacing: 20 });
    addParagraph(
      "1.1. Les prestations comprennent la prise de vue photographique et/ou vidéographique " +
      "selon la formule choisie, le traitement et la retouche des images, et la livraison " +
      "des supports finalisés dans les délais convenus.",
      { size: 10 }
    );
    addParagraph(
      "1.2. Les prestations sont personnalisées selon les besoins exprimés par le client " +
      "et définis dans le présent contrat.",
      { size: 10 }
    );
    addParagraph(
      "1.3. Le prestataire s'engage à mettre en œuvre tous les moyens techniques et " +
      "artistiques nécessaires pour assurer la qualité de la prestation.",
      { size: 10 }
    );

    yPos -= 10;

    // Article 2
    addText("ARTICLE 2 - TARIFS ET MODALITÉS DE PAIEMENT", { font: bold, size: 12, spacing: 20 });
    addParagraph(
      "2.1. Les tarifs sont exprimés en euros TTC. Un acompte représentant 15% du montant " +
      "total est exigible à la signature du contrat pour confirmer la réservation.",
      { size: 10 }
    );
    addParagraph(
      "2.2. Le solde est payable le jour de la prestation, avant le début de celle-ci. " +
      "En cas de retard de paiement, des pénalités de 3% par mois de retard pourront être appliquées.",
      { size: 10 }
    );
    addParagraph(
      "2.3. Le défaut de paiement de l'acompte entraîne l'annulation automatique du contrat " +
      "sans préjudice des autres recours du prestataire.",
      { size: 10 }
    );

    yPos -= 10;

    // Article 3
    addText("ARTICLE 3 - ANNULATION ET REPORT", { font: bold, size: 12, spacing: 20 });
    addParagraph(
      "3.1. En cas d'annulation par le client :",
      { size: 10, font: bold }
    );
    addText("• Plus de 90 jours avant l'événement : remboursement de 50% de l'acompte", 
      { size: 10, indent: 20 });
    addText("• Entre 30 et 90 jours : remboursement de 25% de l'acompte", 
      { size: 10, indent: 20 });
    addText("• Moins de 30 jours : aucun remboursement", 
      { size: 10, indent: 20 });
    
    addParagraph(
      "3.2. Un report de date reste possible sous réserve de disponibilité, sans frais " +
      "supplémentaires si demandé plus de 60 jours avant l'événement.",
      { size: 10 }
    );
    addParagraph(
      "3.3. En cas de force majeure, les deux parties conviennent d'un report sans pénalité " +
      "ou d'un remboursement intégral si le report s'avère impossible.",
      { size: 10 }
    );

    checkSpace(150); // Vérifier qu'on a assez de place pour la suite

    // Article 4
    addText("ARTICLE 4 - DROITS D'AUTEUR ET UTILISATION", { font: bold, size: 12, spacing: 20 });
    addParagraph(
      "4.1. IRZZEN PRODUCTIONS conserve l'entière propriété intellectuelle des œuvres créées. " +
      "Le client obtient un droit d'usage personnel et familial non exclusif des images/vidéos.",
      { size: 10 }
    );
    addParagraph(
      "4.2. Les clients s'engagent à mentionner le crédit 'IRZZEN PRODUCTIONS' lors de toute " +
      "diffusion publique des œuvres (réseaux sociaux, publications, etc.).",
      { size: 10 }
    );
    addParagraph(
      "4.3. IRZZEN PRODUCTIONS se réserve le droit d'utiliser les œuvres à des fins " +
      "promotionnelles et commerciales, sauf opposition écrite des clients dans un délai de 30 jours.",
      { size: 10 }
    );

    yPos -= 10;

    // Article 5
    addText("ARTICLE 5 - LIVRAISON", { font: bold, size: 12, spacing: 20 });
    addParagraph(
      "5.1. Les supports finalisés seront livrés dans un délai maximum de 8 semaines après " +
      "l'événement, sauf mention contraire dans la formule sélectionnée.",
      { size: 10 }
    );
    addParagraph(
      "5.2. La livraison s'effectue par galerie en ligne privée ou support physique selon " +
      "la formule choisie. Les identifiants d'accès sont transmis par email.",
      { size: 10 }
    );
    addParagraph(
      "5.3. Il appartient aux clients de sauvegarder les fichiers reçus. IRZZEN PRODUCTIONS " +
      "conserve les fichiers pendant 12 mois après livraison, sans garantie au-delà.",
      { size: 10 }
    );

    // Nouvelle page pour la suite
    newPage();
    console.log("📄 [CONTRACT] Page 3 - Suite conditions...");

    // Article 6
    addText("ARTICLE 6 - RESPONSABILITÉ", { font: bold, size: 12, spacing: 20 });
    addParagraph(
      "6.1. IRZZEN PRODUCTIONS met en œuvre tous les moyens nécessaires pour assurer la " +
      "qualité de la prestation. Cependant, sa responsabilité ne saurait être engagée en " +
      "cas de vol, perte ou détérioration du matériel due à des causes extérieures.",
      { size: 10 }
    );
    addParagraph(
      "6.2. La responsabilité du prestataire est limitée au montant de la prestation. " +
      "En aucun cas, elle ne pourra excéder ce montant.",
      { size: 10 }
    );
    addParagraph(
      "6.3. Le prestataire ne saurait être tenu responsable des conditions météorologiques " +
      "ou d'événements indépendants de sa volonté affectant la prestation.",
      { size: 10 }
    );

    yPos -= 10;

    // Article 7
    addText("ARTICLE 7 - DONNÉES PERSONNELLES", { font: bold, size: 12, spacing: 20 });
    addParagraph(
      "7.1. Les données personnelles collectées sont utilisées uniquement pour l'exécution " +
      "du contrat et la communication relative à la prestation.",
      { size: 10 }
    );
    addParagraph(
      "7.2. Conformément au RGPD, le client dispose d'un droit d'accès, de rectification " +
      "et de suppression de ses données en contactant contact@irzzenproductions.fr.",
      { size: 10 }
    );
    addParagraph(
      "7.3. Les données sont conservées pendant la durée nécessaire à l'exécution du " +
      "contrat plus 3 ans pour les besoins de la gestion commerciale et comptable.",
      { size: 10 }
    );

    yPos -= 10;

    // Article 8
    addText("ARTICLE 8 - DROIT APPLICABLE ET LITIGES", { font: bold, size: 12, spacing: 20 });
    addParagraph(
      "8.1. Le présent contrat est soumis au droit français. En cas de litige, les parties " +
      "s'engagent à rechercher une solution amiable avant tout recours judiciaire.",
      { size: 10 }
    );
    addParagraph(
      "8.2. À défaut d'accord amiable, les tribunaux compétents sont ceux du ressort du " +
      "siège social d'IRZZEN PRODUCTIONS.",
      { size: 10 }
    );

    yPos -= 20;

    // ========== ACCEPTATION ET SIGNATURES ==========
    addSectionHeader("ACCEPTATION DU CONTRAT", rgb(1, 0.9, 0.8));
    
    addParagraph(
      "En signant le présent contrat, les parties reconnaissent avoir pris connaissance " +
      "de l'ensemble de ses clauses et les accepter sans réserve. Ce contrat annule et " +
      "remplace tout accord antérieur relatif au même objet.",
      { font: bold, size: 11 }
    );

    yPos -= 20;

    // Zone de signatures
    checkSpace(120);
    
    // Cadre pour signatures
    currentPage.drawRectangle({
      x: MARGIN - 10,
      y: yPos - 80,
      width: PAGE_WIDTH - 2 * MARGIN + 20,
      height: 100,
      color: rgb(0.98, 0.98, 0.98),
      borderColor: grayColor,
      borderWidth: 1
    });

    addText("SIGNATURES", { font: bold, size: 12, color: brandColor });
    
    yPos -= 20;

    // Deux colonnes pour signatures
    currentPage.drawText("Le Client", {
      x: MARGIN + 30,
      y: yPos,
      size: 11,
      font: bold,
      color: blackColor
    });

    currentPage.drawText("IRZZEN PRODUCTIONS", {
      x: PAGE_WIDTH - MARGIN - 150,
      y: yPos,
      size: 11,
      font: bold,
      color: blackColor
    });

    currentPage.drawText("Lu et approuvé", {
      x: MARGIN + 30,
      y: yPos - 15,
      size: 9,
      font: regular,
      color: grayColor
    });

    currentPage.drawText("Le prestataire", {
      x: PAGE_WIDTH - MARGIN - 150,
      y: yPos - 15,
      size: 9,
      font: regular,
      color: grayColor
    });

    // Lignes pour signatures
    currentPage.drawLine({
      start: { x: MARGIN + 30, y: yPos - 45 },
      end: { x: MARGIN + 170, y: yPos - 45 },
      thickness: 0.5,
      color: grayColor
    });

    currentPage.drawLine({
      start: { x: PAGE_WIDTH - MARGIN - 150, y: yPos - 45 },
      end: { x: PAGE_WIDTH - MARGIN - 10, y: yPos - 45 },
      thickness: 0.5,
      color: grayColor
    });

    // Footer final
    currentPage.drawText(`© ${new Date().getFullYear()} IRZZEN PRODUCTIONS - Tous droits réservés`, {
      x: MARGIN,
      y: 40,
      size: 8,
      font: regular,
      color: grayColor
    });

    currentPage.drawText("contact@irzzenproductions.fr", {
      x: PAGE_WIDTH - MARGIN - 120,
      y: 40,
      size: 8,
      font: regular,
      color: grayColor
    });

    console.log(`✅ [CONTRACT] Contrat professionnel généré - ${pageNum} pages`);
    const pdfBytes = await pdf.save();
    
    return pdfBytes;
    
  } catch (error) {
    console.error("❌ [CONTRACT] Erreur:", error);
    throw error;
  }
}