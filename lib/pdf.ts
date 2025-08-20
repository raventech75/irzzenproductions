// lib/pdf.ts
// Contrat PDF "pro" avec pdf-lib : 2 pages (récap + CGV), bandeau, sections, tableau, footer & pagination
import { PDFDocument, StandardFonts, rgb, type RGB } from "pdf-lib";

export interface BuildPdfArgs {
  // Identité / contrat
  couple_name?: string;
  bride_first_name?: string;
  bride_last_name?: string;
  groom_first_name?: string;
  groom_last_name?: string;
  email?: string;

  // Évènement
  wedding_date?: string;
  ceremony_address?: string;
  ceremony_time?: string;
  reception_address?: string;
  reception_time?: string;
  notes?: string;

  // Offre & prix
  formula?: string;                // ex: "Prestige"
  formula_description?: string;    // ex: "Tournage mairie, séance couple, montage complet…"
  total_eur?: string;              // "2800"
  deposit_eur?: string;            // "420"
  remaining_eur?: string;          // "2380"
  selected_options?: string;       // "Drone, Album luxe (40x30)"
  extras?: string;                 // "Heure sup.:150|Projection jour J:300"
}

const C_BG: RGB = rgb(1, 0.976, 0.96);          // fond très léger pêche
const C_ACCENT: RGB = rgb(0.95, 0.45, 0.2);     // orange pastel
const C_TEXT: RGB = rgb(0.12, 0.12, 0.12);
const C_MUTED: RGB = rgb(0.45, 0.45, 0.46);
const C_BORDER: RGB = rgb(0.92, 0.84, 0.78);

function clean(v: any) {
  return String(v ?? "")
    .replace(/\u202F/g, " ")
    .replace(/\u00A0/g, " ")
    .trim();
}

type DrawTextOpts = {
  x: number;
  y: number;
  size: number;
  maxWidth?: number;
  lineHeight?: number;
  color?: RGB;
  font?: any;
};

function drawParagraph(
  page: any,
  text: string,
  { x, y, size, maxWidth = 495, lineHeight = 1.3, color = C_TEXT, font }: DrawTextOpts
) {
  const words = text.split(/\s+/);
  let line = "";
  const lines: string[] = [];

  for (const w of words) {
    const testLine = line ? `${line} ${w}` : w;
    const testWidth = font.widthOfTextAtSize(testLine, size);
    if (testWidth > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);

  let cursorY = y;
  for (const ln of lines) {
    page.drawText(ln, { x, y: cursorY, size, font, color });
    cursorY -= size * lineHeight;
  }
  return cursorY;
}

function hr(page: any, x1: number, x2: number, y: number, color = C_BORDER) {
  page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness: 1, color });
}

function euros(n: string | number | undefined | null) {
  if (n == null || n === "") return "—";
  const num = typeof n === "string" ? Number(n) : n;
  if (Number.isNaN(num)) return String(n);
  return `${num.toLocaleString("fr-FR")} €`;
}

function drawHeader(page: any, width: number, fb: any) {
  const { height } = page.getSize();
  page.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: C_BG });
  page.drawText("I R Z Z E N   P R O D U C T I O N S", {
    x: 40,
    y: height - 48,
    size: 10,
    font: fb,
    color: C_ACCENT,
  });
}

function drawFooter(page: any, width: number, f: any, pageIndex: number, total: number) {
  const footerY = 28;
  hr(page, 40, width - 40, footerY + 10, C_BORDER);
  page.drawText("Irzzen Productions — contact@irzzenproductions.fr — www.irzzenproductions.fr", {
    x: 40,
    y: footerY,
    size: 9,
    font: f,
    color: C_MUTED,
  });
  page.drawText(`Page ${pageIndex} / ${total}`, {
    x: width - 90,
    y: footerY,
    size: 9,
    font: f,
    color: C_MUTED,
  });
}

export async function buildBookingPdf(args: BuildPdfArgs): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const f = await pdf.embedFont(StandardFonts.Helvetica);
  const fb = await pdf.embedFont(StandardFonts.HelveticaBold);

  // =========================
  // Page 1 — Récapitulatif
  // =========================
  let page1 = pdf.addPage([595, 842]); // A4 portrait
  let { width: w1, height: h1 } = page1.getSize();
  drawHeader(page1, w1, fb);

  page1.drawText("Contrat & Confirmation de Réservation", {
    x: 40,
    y: h1 - 80,
    size: 18,
    font: fb,
    color: C_ACCENT,
  });

  let y = h1 - 140;

  // Informations client & évènement (2 colonnes)
  const col1x = 40;
  const col2x = 320;
  const colW = 235;

  const couple =
    clean(args.couple_name) ||
    [clean(args.bride_first_name), clean(args.bride_last_name), "&", clean(args.groom_first_name), clean(args.groom_last_name)]
      .filter(Boolean)
      .join(" ");

  // Colonne 1
  page1.drawText("Client", { x: col1x, y, size: 12, font: fb, color: C_ACCENT });
  y -= 14;
  y = drawParagraph(page1, `Couple : ${couple || "—"}`, { x: col1x, y, size: 11, font: f, maxWidth: colW }) - 2;
  y = drawParagraph(page1, `Email : ${clean(args.email) || "—"}`, { x: col1x, y, size: 11, font: f, maxWidth: colW }) - 2;
  y = drawParagraph(page1, `Date du mariage : ${clean(args.wedding_date) || "—"}`, { x: col1x, y, size: 11, font: f, maxWidth: colW });

  // Colonne 2
  let y2 = h1 - 154;
  page1.drawText("Lieux & Horaires", { x: col2x, y: h1 - 140, size: 12, font: fb, color: C_ACCENT });
  y2 = drawParagraph(page1, `Cérémonie : ${clean(args.ceremony_address) || "—"}${args.ceremony_time ? ` (${clean(args.ceremony_time)})` : ""}`, { x: col2x, y: y2, size: 11, font: f, maxWidth: colW }) - 2;
  y2 = drawParagraph(page1, `Réception : ${clean(args.reception_address) || "—"}${args.reception_time ? ` (${clean(args.reception_time)})` : ""}`, { x: col2x, y: y2, size: 11, font: f, maxWidth: colW });

  const afterHeaderY = Math.min(y, y2) - 12;
  hr(page1, 40, w1 - 40, afterHeaderY);

  // Formule & options
  y = afterHeaderY - 24;
  page1.drawText("Formule & Options", { x: 40, y, size: 12, font: fb, color: C_ACCENT });
  y -= 16;

  y = drawParagraph(page1, `Formule : ${clean(args.formula) || "—"}`, { x: 40, y, size: 11, font: f, maxWidth: w1 - 80 }) - 6;
  if (args.formula_description) {
    y = drawParagraph(page1, clean(args.formula_description), { x: 40, y, size: 10.5, font: f, maxWidth: w1 - 80, color: C_MUTED }) - 8;
  }

  const opts = clean(args.selected_options)
    ? clean(args.selected_options).split(",").map(s => s.trim()).filter(Boolean)
    : [];
  y = drawParagraph(page1, `Options : ${opts.length ? opts.join(", ") : "—"}`, { x: 40, y, size: 11, font: f, maxWidth: w1 - 80 }) - 6;

  const extrasHuman = (() => {
    const raw = clean(args.extras);
    if (!raw) return "—";
    const items = raw.split("|").filter(Boolean).map(p => {
      const [label, amount] = p.split(":");
      return `${clean(label)}${amount ? ` (${clean(amount)} €)` : ""}`;
    });
    return items.length ? items.join(", ") : "—";
  })();
  y = drawParagraph(page1, `Extras : ${extrasHuman}`, { x: 40, y, size: 11, font: f, maxWidth: w1 - 80 });

  // Tableau des prix
  y -= 14;
  page1.drawText("Récapitulatif financier", { x: 40, y, size: 12, font: fb, color: C_ACCENT });
  y -= 8;

  const tableX = 40;
  const tableW = w1 - 80;
  const colDescW = tableW * 0.65;
  const rowH = 22;

  // Header
  y -= rowH;
  page1.drawRectangle({ x: tableX, y: y, width: tableW, height: rowH, color: C_BG });
  page1.drawText("Description", { x: tableX + 10, y: y + 6, size: 10.5, font: fb, color: C_ACCENT });
  page1.drawText("Montant", { x: tableX + colDescW + 10, y: y + 6, size: 10.5, font: fb, color: C_ACCENT });

  function row(desc: string, amount: string) {
    y -= rowH;
    page1.drawRectangle({ x: tableX, y, width: tableW, height: rowH, color: rgb(1, 1, 1) });
    page1.drawRectangle({ x: tableX, y, width: tableW, height: 0.8, color: C_BORDER });
    page1.drawText(desc, { x: tableX + 10, y: y + 6, size: 10.5, font: f, color: C_TEXT });
    page1.drawText(amount, { x: tableX + colDescW + 10, y: y + 6, size: 10.5, font: f, color: C_TEXT });
  }

  row(`Formule « ${clean(args.formula) || "—"} »`, euros(args.total_eur || "0"));

  if (opts.length) row("Options", "—");
  for (const o of opts) row(`• ${o}`, "—");

  if (extrasHuman !== "—") {
    row("Extras", "—");
    for (const e of extrasHuman.split(",").map(s => s.trim())) row(`• ${e}`, "—");
  }

  // Totaux dédiés
  y -= 6;
  page1.drawText("Acompte conseillé (15% arrondi)", { x: tableX, y, size: 10.5, font: fb, color: C_TEXT });
  page1.drawText(euros(args.deposit_eur), { x: tableX + colDescW + 10, y, size: 10.5, font: fb, color: C_TEXT });

  y -= 18;
  page1.drawText("Reste à payer le jour J", { x: tableX, y, size: 11.5, font: fb, color: C_ACCENT });
  page1.drawText(euros(args.remaining_eur), { x: tableX + colDescW + 10, y, size: 11.5, font: fb, color: C_ACCENT });

  // Notes éventuelles
  if (clean(args.notes)) {
    y -= 24;
    page1.drawText("Notes / souhaits", { x: 40, y, size: 12, font: fb, color: C_ACCENT });
    y -= 14;
    y = drawParagraph(page1, clean(args.notes), { x: 40, y, size: 10.5, font: f, maxWidth: w1 - 80, color: C_TEXT });
  }

  // Signature
  y -= 24;
  page1.drawText("Signatures", { x: 40, y, size: 12, font: fb, color: C_ACCENT });
  y -= 14;
  page1.drawText("Le Client :", { x: 40, y, size: 11, font: f, color: C_TEXT });
  page1.drawLine({ start: { x: 110, y: y - 2 }, end: { x: 280, y: y - 2 }, thickness: 0.8, color: C_BORDER });
  page1.drawText("Le Prestataire :", { x: 320, y, size: 11, font: f, color: C_TEXT });
  page1.drawLine({ start: { x: 420, y: y - 2 }, end: { x: 560, y: y - 2 }, thickness: 0.8, color: C_BORDER });

  drawFooter(page1, w1, f, 1, 2);

  // =========================
  // Page 2 — CGV complètes
  // =========================
  const page2 = pdf.addPage([595, 842]);
  const { width: w2, height: h2 } = page2.getSize();
  drawHeader(page2, w2, fb);

  page2.drawText("Conditions Générales de Vente", {
    x: 40,
    y: h2 - 80,
    size: 16,
    font: fb,
    color: C_ACCENT,
  });

  let yCGV = h2 - 110;

  const sections: Array<{ title: string; body: string[] }> = [
    {
      title: "1. Objet",
      body: [
        "Les présentes conditions régissent les prestations de photographie et/ou vidéographie fournies par Irzzen Productions (« le Prestataire ») au client (« le Client »). Toute réservation implique l’acceptation sans réserve des présentes.",
      ],
    },
    {
      title: "2. Réservation & acompte",
      body: [
        "La réservation est confirmée à réception d’un acompte (15 % recommandé, arrondi à la centaine supérieure). L’acompte n’est pas remboursable en cas d’annulation, quelle qu’en soit la cause.",
      ],
    },
    {
      title: "3. Annulation",
      body: [
        "Aucune annulation n’est recevable après réservation ; le solde reste dû selon les termes convenus. En cas d’annulation par le Prestataire pour force majeure, un remboursement au prorata ou une solution de remplacement sera proposée.",
      ],
    },
    {
      title: "4. Modification",
      body: [
        "Toute modification (lieu, horaire, déroulé, options) doit être notifiée par écrit au moins 7 jours avant l’évènement et demeure soumise à l’accord du Prestataire. Des frais peuvent s’appliquer.",
      ],
    },
    {
      title: "5. Déroulé & coopération",
      body: [
        "Le Client s’engage à fournir toutes les informations nécessaires (adresses, accès, autorisations) et à faciliter la réalisation de la prestation (coordination avec les intervenants, respect des horaires).",
      ],
    },
    {
      title: "6. Livraison",
      body: [
        "Les livrables numériques sont fournis au plus tard dans un délai de 6 mois. Les délais sont indicatifs et peuvent varier selon la charge et la complexité du montage.",
      ],
    },
    {
      title: "7. Propriété intellectuelle",
      body: [
        "Le Prestataire conserve l’intégralité des droits d’auteur sur les images. Une licence d’usage privé est concédée au Client. Toute diffusion publique (site, réseaux sociaux, presse, publicité) nécessite une autorisation écrite préalable.",
      ],
    },
    {
      title: "8. Données personnelles",
      body: [
        "Les données sont traitées pour la gestion du contrat et conservées le temps nécessaire aux obligations légales. Le Client dispose d’un droit d’accès, de rectification et d’opposition conformément au RGPD.",
      ],
    },
    {
      title: "9. Responsabilité",
      body: [
        "Le Prestataire met en œuvre tous les moyens raisonnables pour assurer une prestation de qualité, sans garantie de résultat artistique spécifique. Il ne saurait être tenu responsable des aléas extérieurs (météo, interdictions, retards, pannes de tiers).",
      ],
    },
    {
      title: "10. Force majeure",
      body: [
        "En cas d’évènement imprévisible et insurmontable (maladie, accident, grève, catastrophe, etc.), la responsabilité du Prestataire ne pourra être engagée. Un remplacement ou un remboursement au prorata sera proposé dans la mesure du possible.",
      ],
    },
    {
      title: "11. Règlement",
      body: [
        "Sauf mention contraire, le solde est exigible au plus tard le jour de la prestation. Tout retard de paiement entraîne l’application de pénalités légales et, le cas échéant, la suspension de la livraison.",
      ],
    },
    {
      title: "12. Réclamations",
      body: [
        "Toute réclamation doit être formulée par écrit dans les 7 jours suivant la livraison. Passé ce délai, les livrables sont réputés conformes.",
      ],
    },
    {
      title: "13. Loi applicable & juridiction",
      body: [
        "Les présentes sont soumises au droit français. Tout litige relève des tribunaux compétents du ressort du siège du Prestataire.",
      ],
    },
  ];

  for (const sec of sections) {
    // Titre section
    page2.drawText(sec.title, { x: 40, y: yCGV, size: 12, font: fb, color: C_ACCENT });
    yCGV -= 14;

    for (const p of sec.body) {
      yCGV = drawParagraph(page2, p, {
        x: 40,
        y: yCGV,
        size: 10.5,
        font: f,
        maxWidth: w2 - 80,
        color: C_TEXT,
        lineHeight: 1.35,
      }) - 6;

      // saut de page si nécessaire (ici on a 2 pages fixes, mais on garde une marge)
      if (yCGV < 60) break;
    }
    yCGV -= 4;
    if (yCGV < 60) break;
  }

  // Zone "Fait à / le" + signature
  yCGV -= 8;
  page2.drawText("Fait à :", { x: 40, y: yCGV, size: 10.5, font: f, color: C_TEXT });
  page2.drawLine({ start: { x: 80, y: yCGV - 2 }, end: { x: 220, y: yCGV - 2 }, thickness: 0.8, color: C_BORDER });
  page2.drawText("Le :", { x: 250, y: yCGV, size: 10.5, font: f, color: C_TEXT });
  page2.drawLine({ start: { x: 280, y: yCGV - 2 }, end: { x: 420, y: yCGV - 2 }, thickness: 0.8, color: C_BORDER });

  yCGV -= 20;
  page2.drawText("Signature du Client :", { x: 40, y: yCGV, size: 10.5, font: f, color: C_TEXT });
  page2.drawLine({ start: { x: 160, y: yCGV - 2 }, end: { x: 420, y: yCGV - 2 }, thickness: 0.8, color: C_BORDER });

  drawFooter(page2, w2, f, 2, 2);

  return await pdf.save();
}