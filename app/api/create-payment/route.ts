import { NextResponse } from "next/server";
import Stripe from "stripe";
import { FORMULAS_DETAILED } from "@/lib/modules";
import { OPTIONS } from "@/lib/products";
import { computePricing } from "@/lib/pricing";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const isDev = process.env.NODE_ENV !== "production";
const SUCCESS_URL = isDev
  ? "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}"
  : `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
const CANCEL_URL = isDev
  ? "http://localhost:3000/reservation?canceled=1"
  : `${process.env.NEXT_PUBLIC_SITE_URL}/reservation?canceled=1`;

function clean(v: any) {
  return String(v ?? "")
    .replace(/\u202F/g, " ")
    .replace(/\u00A0/g, " ")
    .trim();
}

const ci = (s: string) => clean(s).toLowerCase();
const formulaName = (f: any) => clean(f?.label) || clean(f?.title) || clean(f?.name) || "Formule";

function resolveFormulaLoose(body: any) {
  const id = clean(body?.formulaId);
  const key = clean(body?.formulaKey);
  const lbl = clean(body?.formulaLabel || body?.formulaName);

  let f = FORMULAS_DETAILED.find((x: any) => x.id === id);
  if (f) return f;
  if (key) {
    f = FORMULAS_DETAILED.find((x: any) => x.id === key || ci(x.label || x.title || x.name) === ci(key));
    if (f) return f;
  }
  if (lbl) {
    f = FORMULAS_DETAILED.find((x: any) => ci(x.label || x.title || x.name) === ci(lbl));
    if (f) return f;
  }
  return FORMULAS_DETAILED[0];
}

export async function POST(req: Request) {
  try {
    console.log("🔥 DEBUG: API create-payment appelée !");
    
    const body = await req.json();
    console.log("🔥 BODY COMPLET:", JSON.stringify(body, null, 2));

    const payWith: "card" | "bank" = body?.payWith || "card";
    console.log("💳 PayWith:", payWith);
    
    // 🎯 Extraction des données du customer depuis /checkout
    const customer = body?.customer || {};
    const customerEmail = clean(customer?.email);
    const firstName = clean(customer?.firstName);
    const lastName = clean(customer?.lastName);
    const coupleName = clean(customer?.coupleName);
    const weddingDate = clean(customer?.weddingDate);

    // 🎯 Extraction des données du questionnaire détaillé depuis /reservation
    const questionnaire = body?.questionnaire || {};
    
    // 🎯 Extraction de la config (formule + options)
    const config = body?.config || {};
    const formulaId = clean(config?.formulaId);
    
    // 🎯 GESTION DU DEVIS PERSONNALISÉ
    let formula: any;
    let base: number;
    
    if (formulaId === "custom") {
      // Pour un devis personnalisé, utiliser le prix saisi par le client
      const customPrice = Number(config?.customPrice || 0);
      console.log("💰 DEVIS PERSONNALISÉ détecté - Prix:", customPrice);
      
      formula = {
        id: "custom",
        label: "Devis personnalisé",
        price: customPrice,
        description: `Devis personnalisé de ${customPrice}€`,
        features: ["Prestation personnalisée selon devis"]
      };
      base = customPrice;
    } else {
      // Pour une formule standard
      formula = resolveFormulaLoose(config);
      base = Number(formula?.price || 0);
    }
    
    console.log("📋 Formule utilisée:", formulaName(formula));
    console.log("💰 Prix de base:", base);
    
    const selectedOptions: string[] = Array.isArray(config?.options) ? config.options : [];
    const extras: Array<{ label: string; price: number }> = Array.isArray(config?.extras) ? config.extras : [];

    // Calcul des prix avec debug - UTILISATION DES VRAIES OPTIONS
    const optionPrices = selectedOptions.map((id) => {
      const option = OPTIONS.find((o) => o.id === id);
      const price = Number(option?.price || 0);
      console.log(`📋 Option ${id}: ${option?.label || 'inconnue'} = ${price}€`);
      return price;
    });
    const extraPrices = extras.map((e) => Number(e?.price || 0));
    
    console.log("💸 Prix des options:", optionPrices);
    console.log("🎨 Prix des extras:", extraPrices);
    
    const totals = computePricing(base, [...optionPrices, ...extraPrices]);
    
    console.log("🧮 Totals recalculés dans l'API:", totals);
    console.log("💳 Acompte qui va être facturé sur Stripe:", totals.depositSuggested);

    // 🎯 GÉNÉRATION DU NOM DE FICHIER PERSONNALISÉ EN AMONT
    function generateFileName() {
      const cleanName = (str: string) => str
        .replace(/[^a-zA-Z0-9À-ÿ\s-]/g, '') // Garde lettres, chiffres, accents, espaces et tirets
        .replace(/\s+/g, '') // Supprime tous les espaces
        .trim();
      
      const formatDate = (dateStr: string) => {
        try {
          if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Format YYYY-MM-DD -> YYYYMMDD
            return dateStr.replace(/-/g, '');
          }
          // Autres formats : essayer de parser
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}${month}${day}`;
          }
        } catch (e) {
          console.log("⚠️ Erreur formatage date:", e);
        }
        return null;
      };
      
      const brideFirstName = cleanName(clean(questionnaire?.brideFirstName) || '');
      const groomFirstName = cleanName(clean(questionnaire?.groomFirstName) || '');
      const weddingDateForFile = weddingDate ? formatDate(weddingDate) : null;
      
      console.log("🎯 DEBUG nom fichier:");
      console.log("  - brideFirstName nettoyé:", brideFirstName);
      console.log("  - groomFirstName nettoyé:", groomFirstName); 
      console.log("  - weddingDate formatée:", weddingDateForFile);
      
      // Si on a au moins un prénom et une date
      if ((brideFirstName || groomFirstName) && weddingDateForFile) {
        let couplePart = '';
        if (brideFirstName && groomFirstName) {
          couplePart = `${brideFirstName}&${groomFirstName}`;
        } else {
          couplePart = brideFirstName || groomFirstName;
        }
        const fileName = `${couplePart}-${weddingDateForFile}.pdf`;
        console.log("📋 Nom généré avec infos:", fileName);
        return fileName;
      }
      
      // Sinon nom par défaut
      console.log("📋 Nom par défaut utilisé");
      return "IZ-ContratPhoto&Video.pdf";
    }
    
    const pdfFileName = generateFileName();
    console.log("📋 Nom de fichier final qui sera utilisé:", pdfFileName);

    // 🎯 Métadonnées COMPLÈTES pour Stripe (toutes les infos du questionnaire)
    const meta = {
      // Informations de base
      email: customerEmail,
      couple_name: coupleName,
      bride_first_name: clean(questionnaire?.brideFirstName) || coupleName.split('&')[0]?.trim() || firstName,
      bride_last_name: clean(questionnaire?.brideLastName) || lastName,
      groom_first_name: clean(questionnaire?.groomFirstName) || coupleName.split('&')[1]?.trim() || "",
      groom_last_name: clean(questionnaire?.groomLastName) || "",
      
      // Contact
      phone: clean(questionnaire?.phone),
      address: clean(questionnaire?.address),
      postalCode: clean(questionnaire?.postalCode),
      city: clean(questionnaire?.city),
      country: clean(questionnaire?.country),
      
      // Mariage
      wedding_date: weddingDate,
      guests: clean(questionnaire?.guests),
      
      // Lieux et horaires
      prepLocation: clean(questionnaire?.prepLocation),
      prepTime: clean(questionnaire?.prepTime),
      mairieLocation: clean(questionnaire?.mairieLocation),
      mairieTime: clean(questionnaire?.mairieTime),
      ceremonyLocation: clean(questionnaire?.ceremonyLocation),
      ceremonyTime: clean(questionnaire?.ceremonyTime),
      shootingLocation: clean(questionnaire?.shootingLocation),
      shootingTime: clean(questionnaire?.shootingTime),
      receptionLocation: clean(questionnaire?.receptionLocation),
      receptionTime: clean(questionnaire?.receptionTime),
      
      // Infos supplémentaires
      schedule: clean(questionnaire?.schedule),
      specialRequests: clean(questionnaire?.specialRequests),
      notes: clean(questionnaire?.specialRequests), // Alias pour les notes
      
      // Prestation
      formula: formulaName(formula),
      formula_description: Array.isArray(formula?.features) ? formula.features.join(", ") : "",
      total_eur: String(totals.total),
      deposit_eur: String(totals.depositSuggested),
      remaining_eur: String(totals.remainingDayJ),
      selected_options: selectedOptions
        .map((id) => clean(OPTIONS.find((o) => o.id === id)?.label || ""))
        .filter(Boolean)
        .join(", "),
      extras: extras.map((e) => `${clean(e.label)}:${Number(e.price || 0)}`).join("|"),
      
      // 🎯 AJOUT du flag devis personnalisé
      is_custom_quote: formulaId === "custom" ? "true" : "false",
      custom_price: formulaId === "custom" ? String(base) : "",
      
      // 🎯 AJOUT du nom de fichier généré EN AMONT
      pdf_filename: pdfFileName,
    };

    console.log("📋 Métadonnées COMPLÈTES construites pour Stripe:", meta);

    // 🔧 FORCAGE TEMPORAIRE - Générer le PDF pour tous les paiements
    console.log("🔧 DÉBUT GÉNÉRATION PDF...");

    // Créer la session Stripe
    const amountCents = Math.round(Number(totals.depositSuggested) * 100);
    console.log("💳 Montant en centimes qui sera facturé:", amountCents, "centimes =", totals.depositSuggested, "€");
    
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { 
              name: `Acompte — ${formulaName(formula)}`,
              description: `Acompte de ${totals.depositSuggested}€ sur un total de ${totals.total}€`
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
      metadata: meta,
    });

    console.log("🎉 Session Stripe créée:", session.id);

    // 🎯 GÉNÉRATION DU PDF AVEC DEBUG DÉTAILLÉ
    try {
      console.log("📄 Import des librairies PDF...");
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const { createClient } = await import("@supabase/supabase-js");
      console.log("✅ Librairies importées avec succès");

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      console.log("✅ Connexion Supabase établie");

      console.log("📄 Création du document PDF...");
      const pdfDoc = await PDFDocument.create();
      console.log("✅ Document PDF créé");

      console.log("📄 Import des polices...");
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      console.log("✅ Polices importées");
      
      console.log("📄 Définition des couleurs...");
      const primaryColor = rgb(1, 0.6, 0.4);
      const accentColor = rgb(1, 0.95, 0.9);
      const grayText = rgb(0.4, 0.4, 0.4);
      console.log("✅ Couleurs définies");
      
      console.log("📄 Constantes de mise en page...");
      const PAGE_WIDTH = 595;
      const PAGE_HEIGHT = 842;
      const MARGIN_LEFT = 50;
      const MARGIN_RIGHT = 545;
      const MARGIN_TOP = 770;
      const MARGIN_BOTTOM = 100;
      const LINE_HEIGHT = 18;
      console.log("✅ Constantes définies");

      console.log("📄 Création de la première page...");
      let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      let yPos = MARGIN_TOP;
      console.log("✅ Première page créée");

      // Fonctions utilitaires pour les conditions générales
      function addNewPageIfNeeded(requiredSpace = 100) {
        if (yPos < MARGIN_BOTTOM + requiredSpace) {
          console.log("📄 Nouvelle page créée");
          currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          yPos = MARGIN_TOP;
          return true;
        }
        return false;
      }

      function addSection(title: string, textColor = rgb(0, 0, 0)) {
        addNewPageIfNeeded(80);
        
        yPos -= 25; // Espacement avant section
        
        currentPage.drawRectangle({
          x: MARGIN_LEFT - 10,
          y: yPos - 25,
          width: MARGIN_RIGHT - MARGIN_LEFT + 20,
          height: 35,
          color: accentColor,
        });
        
        currentPage.drawText(title, {
          x: MARGIN_LEFT,
          y: yPos - 8,
          size: 12,
          font: fontBold,
          color: primaryColor,
        });
        
        yPos -= 50;
      }

      function addWrappedText(text: string, fontSize = 10, textFont = font, textColor = rgb(0, 0, 0), indent = 0) {
        const maxWidth = MARGIN_RIGHT - MARGIN_LEFT - indent;
        const words = text.split(' ');
        let currentLine = '';
        
        words.forEach((word, index) => {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const textWidth = textFont.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth > maxWidth && currentLine) {
            // Écrire la ligne actuelle
            addNewPageIfNeeded();
            currentPage.drawText(currentLine, {
              x: MARGIN_LEFT + indent,
              y: yPos,
              size: fontSize,
              font: textFont,
              color: textColor,
            });
            yPos -= LINE_HEIGHT;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });
        
        // Écrire la dernière ligne
        if (currentLine) {
          addNewPageIfNeeded();
          currentPage.drawText(currentLine, {
            x: MARGIN_LEFT + indent,
            y: yPos,
            size: fontSize,
            font: textFont,
            color: textColor,
          });
          yPos -= LINE_HEIGHT;
        }
      }

      console.log("📄 Génération de l'en-tête...");
      currentPage.drawRectangle({
        x: 0,
        y: yPos - 20,
        width: PAGE_WIDTH,
        height: 100,
        color: primaryColor,
      });
      
      currentPage.drawText("CONTRAT DE PRESTATION", {
        x: MARGIN_LEFT,
        y: yPos + 40,
        size: 20,
        font: fontBold,
        color: rgb(1, 1, 1),
      });
      
      currentPage.drawText("PHOTOGRAPHIQUE ET VIDEOGRAPHIQUE", {
        x: MARGIN_LEFT,
        y: yPos + 20,
        size: 14,
        font: fontBold,
        color: rgb(1, 1, 1),
      });
      
      currentPage.drawText("Evenement - Mariage", {
        x: MARGIN_LEFT,
        y: yPos,
        size: 12,
        font,
        color: rgb(1, 1, 1),
      });

      const today = new Date().toLocaleDateString('fr-FR');
      currentPage.drawText(`Date du contrat : ${today}`, {
        x: MARGIN_RIGHT - 120,
        y: yPos,
        size: 10,
        font,
        color: rgb(1, 1, 1),
      });

      yPos -= 120;
      console.log("✅ En-tête générée");

      console.log("📄 Génération section prestataire...");
      currentPage.drawRectangle({
        x: MARGIN_LEFT - 10,
        y: yPos - 25,
        width: MARGIN_RIGHT - MARGIN_LEFT + 20,
        height: 40,
        color: accentColor,
      });
      
      currentPage.drawText("LE PRESTATAIRE", {
        x: MARGIN_LEFT,
        y: yPos - 8,
        size: 14,
        font: fontBold,
        color: primaryColor,
      });
      
      yPos -= 55;
      
      currentPage.drawText("IRZZEN PRODUCTIONS", {
        x: MARGIN_LEFT,
        y: yPos,
        size: 10,
        font: fontBold,
        color: primaryColor,
      });
      yPos -= LINE_HEIGHT;

      currentPage.drawText("Societe de services audiovisuels", {
        x: MARGIN_LEFT,
        y: yPos,
        size: 10,
        font,
        color: grayText,
      });
      yPos -= LINE_HEIGHT;

      currentPage.drawText("Email : contact@irzzenproductions.fr", {
        x: MARGIN_LEFT,
        y: yPos,
        size: 10,
        font,
        color: grayText,
      });
      yPos -= 30;
      console.log("✅ Section prestataire générée");

      console.log("📄 Génération section client enrichie...");
      currentPage.drawRectangle({
        x: MARGIN_LEFT - 10,
        y: yPos - 25,
        width: MARGIN_RIGHT - MARGIN_LEFT + 20,
        height: 40,
        color: accentColor,
      });

      currentPage.drawText("INFORMATIONS CLIENT", {
        x: MARGIN_LEFT,
        y: yPos - 8,
        size: 14,
        font: fontBold,
        color: primaryColor,
      });

      yPos -= 55;

      // === INFORMATIONS DU COUPLE ===
      const bride_first_name = meta.bride_first_name || "";
      const bride_last_name = meta.bride_last_name || "";
      const groom_first_name = meta.groom_first_name || "";
      const groom_last_name = meta.groom_last_name || "";
      const coupleNameDisplay = meta.couple_name || `${bride_first_name} & ${groom_first_name}`;

      currentPage.drawText(`Futurs époux : ${coupleNameDisplay}`, {
        x: MARGIN_LEFT,
        y: yPos,
        size: 12,
        font: fontBold,
        color: primaryColor,
      });
      yPos -= LINE_HEIGHT * 1.5;

      // Détails des époux si disponibles
      if (bride_first_name && bride_last_name) {
        currentPage.drawText(`Mariée : ${bride_first_name} ${bride_last_name}`, {
          x: MARGIN_LEFT + 15,
          y: yPos,
          size: 10,
          font,
          color: grayText,
        });
        yPos -= LINE_HEIGHT;
      }

      if (groom_first_name && groom_last_name) {
        currentPage.drawText(`Marié : ${groom_first_name} ${groom_last_name}`, {
          x: MARGIN_LEFT + 15,
          y: yPos,
          size: 10,
          font,
          color: grayText,
        });
        yPos -= LINE_HEIGHT;
      }

      yPos -= 5; // Petit espacement

      // === CONTACT ===
      if (customerEmail || meta.email) {
        currentPage.drawText(`Email : ${customerEmail || meta.email}`, {
          x: MARGIN_LEFT,
          y: yPos,
          size: 10,
          font,
          color: grayText,
        });
        yPos -= LINE_HEIGHT;
      }

      if (meta.phone) {
        currentPage.drawText(`Téléphone : ${meta.phone}`, {
          x: MARGIN_LEFT,
          y: yPos,
          size: 10,
          font,
          color: grayText,
        });
        yPos -= LINE_HEIGHT;
      }

      // === ADRESSE ===
      if (meta.address || meta.city || meta.postalCode) {
        yPos -= 5;
        currentPage.drawText("Adresse :", {
          x: MARGIN_LEFT,
          y: yPos,
          size: 10,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        yPos -= LINE_HEIGHT;

        if (meta.address) {
          currentPage.drawText(`${meta.address}`, {
            x: MARGIN_LEFT + 15,
            y: yPos,
            size: 10,
            font,
            color: grayText,
          });
          yPos -= LINE_HEIGHT;
        }

        // Ville et code postal sur la même ligne
        const cityInfo = [meta.postalCode, meta.city].filter(Boolean).join(' ');
        if (cityInfo) {
          currentPage.drawText(cityInfo, {
            x: MARGIN_LEFT + 15,
            y: yPos,
            size: 10,
            font,
            color: grayText,
          });
          yPos -= LINE_HEIGHT;
        }

        if (meta.country && meta.country !== 'France') {
          currentPage.drawText(meta.country, {
            x: MARGIN_LEFT + 15,
            y: yPos,
            size: 10,
            font,
            color: grayText,
          });
          yPos -= LINE_HEIGHT;
        }
      }

      console.log("✅ Section client enrichie générée");

      console.log("📄 Génération section détails du mariage enrichie...");
      addNewPageIfNeeded(200); // S'assurer qu'on a assez d'espace pour la section
      yPos -= 20; // Espacement avant nouvelle section

      currentPage.drawRectangle({
        x: MARGIN_LEFT - 10,
        y: yPos - 25,
        width: MARGIN_RIGHT - MARGIN_LEFT + 20,
        height: 40,
        color: accentColor,
      });

      currentPage.drawText("DETAILS DU MARIAGE", {
        x: MARGIN_LEFT,
        y: yPos - 8,
        size: 14,
        font: fontBold,
        color: primaryColor,
      });

      yPos -= 55;

      // === DATE ET INVITÉS ===
      const formatDate = (dateStr: string) => {
        if (!dateStr) return "Date à confirmer";
        try {
          if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
          }
          return dateStr;
        } catch {
          return dateStr;
        }
      };

      const weddingDate = formatDate(meta.wedding_date);
      addNewPageIfNeeded(50);
      currentPage.drawText(`Date du mariage : ${weddingDate}`, {
        x: MARGIN_LEFT,
        y: yPos,
        size: 12,
        font: fontBold,
        color: primaryColor,
      });
      yPos -= LINE_HEIGHT * 1.5;

      if (meta.guests) {
        addNewPageIfNeeded(30);
        currentPage.drawText(`Nombre d'invités : ${meta.guests} personnes`, {
          x: MARGIN_LEFT,
          y: yPos,
          size: 10,
          font,
          color: grayText,
        });
        yPos -= LINE_HEIGHT * 1.5;
      }

      // === PLANNING DÉTAILLÉ ===
      addNewPageIfNeeded(50);
      currentPage.drawText("Planning de la journée :", {
        x: MARGIN_LEFT,
        y: yPos,
        size: 11,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      yPos -= LINE_HEIGHT;

      const scheduleItems = [
        { 
          label: "Préparatifs", 
          location: meta.prepLocation, 
          time: meta.prepTime
        },
        { 
          label: "Mairie", 
          location: meta.mairieLocation, 
          time: meta.mairieTime
        },
        { 
          label: "Cérémonie", 
          location: meta.ceremonyLocation, 
          time: meta.ceremonyTime
        },
        { 
          label: "Shooting", 
          location: meta.shootingLocation, 
          time: meta.shootingTime
        },
        { 
          label: "Réception", 
          location: meta.receptionLocation, 
          time: meta.receptionTime
        },
      ];

      scheduleItems.forEach(item => {
        let hasInfo = false;
        let details = "";
        
        if (item.location && item.time) {
          details = `${item.location} à ${item.time}`;
          hasInfo = true;
        } else if (item.location) {
          details = item.location;
          hasInfo = true;
        } else if (item.time) {
          details = `à ${item.time}`;
          hasInfo = true;
        }
        
        if (hasInfo) {
          // Titre de l'étape en gras
          addNewPageIfNeeded(40);
          currentPage.drawText(`• ${item.label} :`, {
            x: MARGIN_LEFT + 15,
            y: yPos,
            size: 10,
            font: fontBold,
            color: rgb(0, 0, 0),
          });
          yPos -= LINE_HEIGHT;
          
          // Détails en retrait
          addNewPageIfNeeded(30);
          currentPage.drawText(details, {
            x: MARGIN_LEFT + 35,
            y: yPos,
            size: 10,
            font,
            color: grayText,
          });
          yPos -= LINE_HEIGHT * 1.2; // Espacement entre les étapes
        } else {
          // Étape non renseignée
          addNewPageIfNeeded(30);
          currentPage.drawText(`• ${item.label} : À définir`, {
            x: MARGIN_LEFT + 15,
            y: yPos,
            size: 10,
            font,
            color: rgb(0.7, 0.7, 0.7), // Plus clair pour "non défini"
          });
          yPos -= LINE_HEIGHT;
        }
      });

      // === DÉROULEMENT DÉTAILLÉ ===
      if (meta.schedule && meta.schedule.trim()) {
        yPos -= 10;
        addNewPageIfNeeded(50);
        currentPage.drawText("Déroulement détaillé :", {
          x: MARGIN_LEFT,
          y: yPos,
          size: 11,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        yPos -= LINE_HEIGHT;

        // Fonction simple pour gérer le texte long
        const scheduleText = meta.schedule.trim();
        const maxLineLength = 70; // Environ 70 caractères par ligne
        
        // Découper le texte en lignes
        const words = scheduleText.split(' ');
        let currentLine = '';
        
        words.forEach((word) => {
          if ((currentLine + ' ' + word).length > maxLineLength && currentLine) {
            // Écrire la ligne actuelle
            addNewPageIfNeeded(30);
            currentPage.drawText(currentLine, {
              x: MARGIN_LEFT + 15,
              y: yPos,
              size: 10,
              font,
              color: grayText,
            });
            yPos -= LINE_HEIGHT;
            currentLine = word;
          } else {
            currentLine = currentLine ? currentLine + ' ' + word : word;
          }
        });
        
        // Écrire la dernière ligne
        if (currentLine) {
          addNewPageIfNeeded(30);
          currentPage.drawText(currentLine, {
            x: MARGIN_LEFT + 15,
            y: yPos,
            size: 10,
            font,
            color: grayText,
          });
          yPos -= LINE_HEIGHT;
        }
      }

      // === DEMANDES SPÉCIALES ===
      if (meta.specialRequests && meta.specialRequests.trim()) {
        yPos -= 15;
        addNewPageIfNeeded(50);
        currentPage.drawText("Demandes particulières :", {
          x: MARGIN_LEFT,
          y: yPos,
          size: 11,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        yPos -= LINE_HEIGHT;

        // Traiter les demandes spéciales de la même façon
        const requestsText = meta.specialRequests.trim();
        const words = requestsText.split(' ');
        let currentLine = '';
        
        words.forEach((word) => {
          if ((currentLine + ' ' + word).length > 70 && currentLine) {
            addNewPageIfNeeded(30);
            currentPage.drawText(currentLine, {
              x: MARGIN_LEFT + 15,
              y: yPos,
              size: 10,
              font,
              color: grayText,
            });
            yPos -= LINE_HEIGHT;
            currentLine = word;
          } else {
            currentLine = currentLine ? currentLine + ' ' + word : word;
          }
        });
        
        if (currentLine) {
          addNewPageIfNeeded(30);
          currentPage.drawText(currentLine, {
            x: MARGIN_LEFT + 15,
            y: yPos,
            size: 10,
            font,
            color: grayText,
          });
          yPos -= LINE_HEIGHT;
        }
      }

      console.log("✅ Section détails du mariage enrichie générée");

      console.log("📄 Génération section prestation...");
      addNewPageIfNeeded(200); // S'assurer qu'on a assez d'espace
      yPos -= 20; // Espacement avant nouvelle section
      
      currentPage.drawRectangle({
        x: MARGIN_LEFT - 10,
        y: yPos - 25,
        width: MARGIN_RIGHT - MARGIN_LEFT + 20,
        height: 40,
        color: accentColor,
      });
      
      currentPage.drawText("PRESTATION SELECTIONNEE", {
        x: MARGIN_LEFT,
        y: yPos - 8,
        size: 14,
        font: fontBold,
        color: primaryColor,
      });
      
      yPos -= 55;

      // Formule sélectionnée
      const formulaDisplay = meta.formula || "Formule non specifiee";
      currentPage.drawText(`Formule : ${formulaDisplay}`, {
        x: MARGIN_LEFT,
        y: yPos,
        size: 12,
        font: fontBold,
        color: primaryColor,
      });
      yPos -= LINE_HEIGHT * 1.5;

      // 🎯 AFFICHAGE SPÉCIAL POUR DEVIS PERSONNALISÉ
      if (formulaId === "custom") {
        currentPage.drawText("Type : Devis personnalisé", {
          x: MARGIN_LEFT,
          y: yPos,
          size: 11,
          font: fontBold,
          color: rgb(0.8, 0.4, 0.1), // Orange foncé pour le mettre en évidence
        });
        yPos -= LINE_HEIGHT;
        
        currentPage.drawText(`Montant personnalisé : ${base}€`, {
          x: MARGIN_LEFT + 15,
          y: yPos,
          size: 10,
          font,
          color: grayText,
        });
        yPos -= LINE_HEIGHT;
      }

      // Description de la formule
      if (meta.formula_description) {
        currentPage.drawText("Description :", {
          x: MARGIN_LEFT,
          y: yPos,
          size: 11,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        yPos -= LINE_HEIGHT;

        // Description limitée pour éviter les problèmes
        const description = meta.formula_description.substring(0, 150);
        currentPage.drawText(description, {
          x: MARGIN_LEFT + 15,
          y: yPos,
          size: 10,
          font,
          color: grayText,
        });
        yPos -= LINE_HEIGHT;
      }

      // Options sélectionnées
      if (meta.selected_options) {
        yPos -= 10;
        currentPage.drawText("Options incluses :", {
          x: MARGIN_LEFT,
          y: yPos,
          size: 11,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        yPos -= LINE_HEIGHT;

        const options = meta.selected_options.split(', ').filter(Boolean);
        options.forEach((option: string) => {
          currentPage.drawText(`• ${option}`, {
            x: MARGIN_LEFT + 15,
            y: yPos,
            size: 10,
            font,
            color: grayText,
          });
          yPos -= LINE_HEIGHT;
        });
      }

      // Extras
      if (meta.extras) {
        yPos -= 10;
        currentPage.drawText("Extras ajoutes :", {
          x: MARGIN_LEFT,
          y: yPos,
          size: 11,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        yPos -= LINE_HEIGHT;

        const extras = meta.extras.split('|').filter(Boolean);
        extras.forEach((extra: string) => {
          const [label, price] = extra.split(':');
          if (label && price) {
            currentPage.drawText(`• ${label} : ${price} euros`, {
              x: MARGIN_LEFT + 15,
              y: yPos,
              size: 10,
              font,
              color: grayText,
            });
            yPos -= LINE_HEIGHT;
          }
        });
      }

      console.log("✅ Section prestation générée");

      console.log("📄 Génération récapitulatif financier...");
      addNewPageIfNeeded(200); // S'assurer qu'on a assez d'espace
      yPos -= 20; // Espacement avant nouvelle section
      
      currentPage.drawRectangle({
        x: MARGIN_LEFT - 10,
        y: yPos - 25,
        width: MARGIN_RIGHT - MARGIN_LEFT + 20,
        height: 40,
        color: accentColor,
      });
      
      currentPage.drawText("RECAPITULATIF FINANCIER", {
        x: MARGIN_LEFT,
        y: yPos - 8,
        size: 14,
        font: fontBold,
        color: primaryColor,
      });
      
      yPos -= 55;

      // Tableau financier simple
      const financialData = [
        { label: "Total de la prestation", value: `${meta.total_eur || '0'} euros`, isTotal: true },
        { label: "Acompte suggere (15%)", value: `${meta.deposit_eur || '0'} euros`, isTotal: false },
        { label: "Reste a payer le jour J", value: `${meta.remaining_eur || '0'} euros`, isTotal: false },
      ];

      financialData.forEach((item, index) => {
        // Fond alterné simple
        if (index % 2 === 0) {
          currentPage.drawRectangle({
            x: MARGIN_LEFT - 5,
            y: yPos - 5,
            width: MARGIN_RIGHT - MARGIN_LEFT + 10,
            height: 20,
            color: rgb(0.98, 0.98, 0.98),
          });
        }

        currentPage.drawText(item.label, {
          x: MARGIN_LEFT,
          y: yPos,
          size: item.isTotal ? 12 : 10,
          font: item.isTotal ? fontBold : font,
          color: rgb(0, 0, 0),
        });

        currentPage.drawText(item.value, {
          x: MARGIN_RIGHT - 100,
          y: yPos,
          size: item.isTotal ? 12 : 10,
          font: fontBold,
          color: item.isTotal ? primaryColor : rgb(0, 0, 0),
        });

        yPos -= 25;
      });

      // Notes spéciales
      const notesText = meta.notes || meta.specialRequests;
      if (notesText && notesText.trim()) {
        yPos -= 15;
        currentPage.drawText("Demandes particulieres :", {
          x: MARGIN_LEFT,
          y: yPos,
          size: 11,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        yPos -= LINE_HEIGHT;

        // Notes limitées pour éviter les problèmes
        const notes = notesText.substring(0, 200);
        currentPage.drawText(notes, {
          x: MARGIN_LEFT + 15,
          y: yPos,
          size: 10,
          font,
          color: grayText,
        });
        yPos -= LINE_HEIGHT;
      }

      console.log("✅ Section récapitulatif financier générée");

      // 📄 ÉTAPE 3 : CONDITIONS GÉNÉRALES
      console.log("📄 Génération conditions générales...");

      // SECTION 1: OBJET DU CONTRAT
      addSection("1. OBJET DU CONTRAT");

      addWrappedText(
        "Le présent contrat a pour objet la prestation de services photographiques et vidéographiques " +
        "pour l'événement de mariage susmentionné. La prestation comprend la formule sélectionnée ainsi " +
        "que les options et extras convenus entre les parties."
      );

      yPos -= 10;

      addWrappedText(
        "Les prestations incluent la prise de vue, le traitement des images/vidéos, et la livraison " +
        "des supports finalisés selon les modalités définies dans la formule choisie."
      );

      // SECTION 2: MODALITÉS DE PAIEMENT
      addSection("2. MODALITES DE PAIEMENT");

      addWrappedText(
        `Un acompte de ${meta.deposit_eur || '0'}€ (15% du montant total) est exigible à la signature ` +
        `du présent contrat pour confirmer la réservation de la date.`
      );

      yPos -= 10;

      addWrappedText(
        `Le solde de ${meta.remaining_eur || '0'}€ sera réglé le jour de l'événement, avant le début ` +
        "de la prestation, par virement bancaire ou espèces."
      );

      yPos -= 10;

      addWrappedText(
        "En cas de retard de paiement, des pénalités de 3% par mois de retard pourront être appliquées. " +
        "Le défaut de paiement de l'acompte entraîne l'annulation automatique du contrat."
      );

      // SECTION 3: DROITS D'AUTEUR ET DIFFUSION
      addSection("3. DROITS D'AUTEUR ET DIFFUSION");

      addWrappedText(
        "IRZZEN PRODUCTIONS conserve l'entière propriété intellectuelle des œuvres créées. " +
        "Les clients obtiennent un droit d'usage personnel et familial non exclusif des images/vidéos."
      );

      yPos -= 10;

      addWrappedText(
        "Les clients s'engagent à mentionner le crédit 'IRZZEN PRODUCTIONS' lors de toute diffusion " +
        "publique des œuvres (réseaux sociaux, publications, etc.)."
      );

      yPos -= 10;

      addWrappedText(
        "IRZZEN PRODUCTIONS se réserve le droit d'utiliser les œuvres à des fins promotionnelles " +
        "et commerciales, sauf opposition écrite des clients dans un délai de 30 jours."
      );

      // SECTION 4: ANNULATION ET REPORT
      addSection("4. ANNULATION ET REPORT");

      addWrappedText(
        "En cas d'annulation par les clients :"
      );

      addWrappedText(
        "• Plus de 90 jours avant l'événement : remboursement de 50% de l'acompte",
        10, font, grayText, 15
      );

      addWrappedText(
        "• Entre 30 et 90 jours : remboursement de 25% de l'acompte",
        10, font, grayText, 15
      );

      addWrappedText(
        "• Moins de 30 jours : aucun remboursement",
        10, font, grayText, 15
      );

      yPos -= 10;

      addWrappedText(
        "Un report de date reste possible sous réserve de disponibilité, sans frais supplémentaires " +
        "si demandé plus de 60 jours avant l'événement."
      );

      yPos -= 10;

      addWrappedText(
        "En cas de force majeure (conditions météorologiques extrêmes, cas de force majeure légale), " +
        "les deux parties conviennent d'un report sans pénalité."
      );

      // SECTION 5: RESPONSABILITÉ ET LIVRAISON
      addSection("5. RESPONSABILITE ET LIVRAISON");

      addWrappedText(
        "IRZZEN PRODUCTIONS s'engage à mettre en œuvre tous les moyens nécessaires pour assurer " +
        "la qualité de la prestation. Cependant, sa responsabilité ne saurait être engagée en cas " +
        "de vol, perte ou détérioration du matériel due à des causes extérieures."
      );

      yPos -= 10;

      addWrappedText(
        "Les supports finalisés seront livrés dans un délai maximum de 8 semaines après l'événement, " +
        "sauf mention contraire dans la formule sélectionnée."
      );

      yPos -= 10;

      addWrappedText(
        "Il appartient aux clients de sauvegarder les fichiers reçus. IRZZEN PRODUCTIONS conserve " +
        "les fichiers pendant 12 mois après livraison, sans garantie au-delà."
      );

      // SECTION 6: DROIT APPLICABLE
      addSection("6. DROIT APPLICABLE");

      addWrappedText(
        "Le présent contrat est soumis au droit français. En cas de litige, les tribunaux compétents " +
        "sont ceux du ressort du siège social d'IRZZEN PRODUCTIONS."
      );

      yPos -= 10;

      addWrappedText(
        "Les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire."
      );

      console.log("✅ Conditions générales générées");

      console.log("📄 Sauvegarde du PDF...");
      const pdfBytes = await pdfDoc.save();
      console.log("✅ PDF sauvegardé, taille:", pdfBytes.length, "bytes");

      console.log("📤 Upload vers bucket 'contrats'...");
      console.log("📋 Utilisation du nom de fichier:", pdfFileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("contrats")
        .upload(pdfFileName, pdfBytes, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        console.error("❌ Erreur upload:", uploadError);
        throw uploadError;
      }

      console.log("✅ PDF uploadé avec succès:", uploadData?.path);

    } catch (pdfError) {
      console.error("❌ ERREUR GÉNÉRATION PDF:", pdfError);
      console.error("📊 Message:", (pdfError as Error).message);
      console.error("📊 Stack:", (pdfError as Error).stack);
    }

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (e: any) {
    console.error("❌ Erreur create-payment:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}