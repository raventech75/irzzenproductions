// lib/pdf.ts
// Contrat PDF "pro" avec pdf-lib : 2 pages, gabarit, tableau, sauts de page automatiques
import { PDFDocument, StandardFonts, rgb, type RGB } from "pdf-lib";

export interface BuildPdfArgs {
  couple_name?: string;
  bride_first_name?: string;
  bride_last_name?: string;
  groom_first_name?: string;
  groom_last_name?: string;
  email?: string;

  wedding_date?: string;
  ceremony_address?: string;
  ceremony_time?: string;
  reception_address?: string;
  reception_time?: string;
  notes?: string;

  formula?: string;                // "Essentielle", "Prestige"…
  formula_description?: string;    // phrase descriptive courte
  total_eur?: string;              // "2800"
  deposit_eur?: string;            // "420"
  remaining_eur?: string;          // "2380"
  selected_options?: string;       // "Drone, Album..."
  extras?: string;                 // "Heure sup.:150|Projection jour J:300"
}

// Palette pastel orange
const C_BG: RGB = rgb(1, 0.976, 0.96);
const C_ACCENT: RGB = rgb(0.95, 0.45, 0.2);
const C_TEXT: RGB = rgb(0.12, 0.12, 0.12);
const C_MUTED: RGB = rgb(0.45, 0.45, 0.46);
const C_BORDER: RGB = rgb(0.92, 0.84, 0.78);

const PAGE_W = 595; // A4 portrait
const PAGE_H = 842;
const MARGIN = 40;
const HEADER_H = 120;
const FOOTER_H = 42;

function clean(v: any) {
  return String(v ?? "").replace(/\u202F/g, " ").replace(/\u00A0/g, " ").trim();
}
function euros(n: string | number | undefined | null) {
  if (n == null || n === "") return "—";
  const num = typeof n === "string" ? Number(n) : n;
  if (Number.isNaN(num)) return String(n);
  return `${num.toLocaleString("fr-FR")} €`;
}

type DrawWrapOpts = {
  x: number;
  y?: number;            // ← y devient optionnel (utilise ctx.y par défaut)
  size: number;
  color?: RGB;
  font: any;
  maxWidth?: number;
  lineHeight?: number;
};

type LayoutCtx = {
  pdf: PDFDocument;
  page: any;
  f: any;
  fb: any;
  y: number;
  pageIndex: number;
  totalPages: number; // on écrit "Page X / Y" après coup
};

// ==== Gabarit (header/footer) ====

function drawHeader(ctx: LayoutCtx) {
  const p = ctx.page;
  p.drawRectangle({ x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H, color: C_BG });
  p.drawText("I R Z Z E N   P R O D U C T I O N S", {
    x: MARGIN,
    y: PAGE_H - 48,
    size: 10,
    font: ctx.fb,
    color: C_ACCENT,
  });
}

function drawFooter(ctx: LayoutCtx) {
  const p = ctx.page;
  const y = FOOTER_H - 14;
  // trait
  p.drawLine({
    start: { x: MARGIN, y: FOOTER_H },
    end: { x: PAGE_W - MARGIN, y: FOOTER_H },
    thickness: 1,
    color: C_BORDER,
  });
  p.drawText("Irzzen Productions — contact@irzzenproductions.fr — www.irzzenproductions.fr", {
    x: MARGIN,
    y,
    size: 9,
    font: ctx.f,
    color: C_MUTED,
  });
  // pagination (on écrira la vraie valeur à la fin)
  const label = `Page ${ctx.pageIndex} / ${ctx.totalPages || " "}`;
  const width = ctx.f.widthOfTextAtSize(label, 9);
  p.drawText(label, { x: PAGE_W - MARGIN - width, y, size: 9, font: ctx.f, color: C_MUTED });
}

function newPage(ctx: LayoutCtx) {
  ctx.page = ctx.pdf.addPage([PAGE_W, PAGE_H]);
  ctx.pageIndex += 1;
  drawHeader(ctx);
  drawFooter(ctx);
  ctx.y = PAGE_H - HEADER_H - 24; // zone de contenu
}

function ensureSpace(ctx: LayoutCtx, needed: number) {
  if (ctx.y - needed < FOOTER_H + 16) {
    newPage(ctx);
  }
}

function drawTitle(ctx: LayoutCtx, text: string, size = 18) {
  ensureSpace(ctx, size + 8);
  ctx.page.drawText(text, { x: MARGIN, y: ctx.y, size, font: ctx.fb, color: C_ACCENT });
  ctx.y -= size + 8;
}

function hr(ctx: LayoutCtx) {
  ensureSpace(ctx, 12);
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y },
    end: { x: PAGE_W - MARGIN, y: ctx.y },
    thickness: 1,
    color: C_BORDER,
  });
  ctx.y -= 12;
}

function drawParagraphWrapped(
  ctx: LayoutCtx,
  text: string,
  opts: Omit<DrawWrapOpts, "font"> & { font?: any } = { x: MARGIN, size: 11 }
) {
  const font = opts.font || ctx.f;
  const maxWidth = opts.maxWidth ?? (PAGE_W - MARGIN * 2);
  const lineHeight = opts.lineHeight ?? 1.32;
  const color = opts.color ?? C_TEXT;

  // si y non fourni, on utilise ctx.y
  let y = opts.y ?? ctx.y;

  // word wrap + saut de page auto
  const words = text.split(/\s+/);
  let line = "";
  const lines: string[] = [];
  for (const w of words) {
    const testLine = line ? `${line} ${w}` : w;
    const wpt = font.widthOfTextAtSize(testLine, opts.size);
    if (wpt > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);

  for (const ln of lines) {
    ensureSpace(ctx, opts.size * lineHeight + 2);
    ctx.page.drawText(ln, {
      x: opts.x ?? MARGIN,
      y,
      size: opts.size,
      font,
      color,
    });
    y -= opts.size * lineHeight;
  }

  // synchronise le curseur global
  ctx.y = y;
}

// ==== Construction du document ====

export async function buildBookingPdf(args: BuildPdfArgs): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const f = await pdf.embedFont(StandardFonts.Helvetica);
  const fb = await pdf.embedFont(StandardFonts.HelveticaBold);

  const ctx: LayoutCtx = {
    pdf,
    page: null as any,
    f,
    fb,
    y: 0,
    pageIndex: 0,
    totalPages: 0,
  };

  // Page 1
  newPage(ctx);
  drawTitle(ctx, "Contrat & Confirmation de Réservation", 18);

  // Bloc "Client" + "Évènement" (2 colonnes)
  const couple =
    clean(args.couple_name) ||
    [clean(args.bride_first_name), clean(args.bride_last_name), "&", clean(args.groom_first_name), clean(args.groom_last_name)]
      .filter(Boolean)
      .join(" ");

  // Sous-titre
  ensureSpace(ctx, 14);
  ctx.page.drawText("Informations Clients", { x: MARGIN, y: ctx.y, size: 12, font: fb, color: C_ACCENT });
  ctx.y -= 16;

  // Deux colonnes
  const colTop = ctx.y;
  let col1Y = colTop;

  const col1X = MARGIN;
  const colW = (PAGE_W - MARGIN * 2 - 20) / 2; // 20 = gouttière
  const col2X = col1X + colW + 20;

  // Col 1
  {
    const ySave = ctx.y;
    ctx.y = col1Y;
    drawParagraphWrapped(ctx, `Couple : ${couple || "—"}`, { x: col1X, size: 11, maxWidth: colW });
    drawParagraphWrapped(ctx, `Email : ${clean(args.email) || "—"}`, { x: col1X, size: 11, maxWidth: colW });
    drawParagraphWrapped(ctx, `Date du mariage : ${clean(args.wedding_date) || "—"}`, { x: col1X, size: 11, maxWidth: colW });
    col1Y = ctx.y;
    ctx.y = ySave;
  }

  // Col 2
  let col2Y = colTop;
  {
    const ySave = ctx.y;
    ctx.y = col2Y;
    drawParagraphWrapped(ctx, `Cérémonie : ${clean(args.ceremony_address) || "—"}${args.ceremony_time ? ` (${clean(args.ceremony_time)})` : ""}`, { x: col2X, size: 11, maxWidth: colW });
    drawParagraphWrapped(ctx, `Réception : ${clean(args.reception_address) || "—"}${args.reception_time ? ` (${clean(args.reception_time)})` : ""}`, { x: col2X, size: 11, maxWidth: colW });
    col2Y = ctx.y;
    ctx.y = Math.min(col1Y, col2Y) - 8;
  }

  hr(ctx);

  // Formule & options
  ensureSpace(ctx, 16);
  ctx.page.drawText("Formule & Options", { x: MARGIN, y: ctx.y, size: 12, font: fb, color: C_ACCENT });
  ctx.y -= 16;

  drawParagraphWrapped(ctx, `Formule : ${clean(args.formula) || "—"}`, { x: MARGIN, size: 11 });
  if (clean(args.formula_description)) {
    drawParagraphWrapped(ctx, clean(args.formula_description), { x: MARGIN, size: 10.5, color: C_MUTED });
  }

  const opts = clean(args.selected_options)
    ? clean(args.selected_options).split(",").map(s => s.trim()).filter(Boolean)
    : [];
  drawParagraphWrapped(ctx, `Options : ${opts.length ? opts.join(", ") : "—"}`, { x: MARGIN, size: 11 });

  const extrasHuman = (() => {
    const raw = clean(args.extras);
    if (!raw) return "—";
    const items = raw.split("|").filter(Boolean).map(p => {
      const [label, amount] = p.split(":");
      return `${clean(label)}${amount ? ` (${clean(amount)} €)` : ""}`;
    });
    return items.length ? items.join(", ") : "—";
  })();
  drawParagraphWrapped(ctx, `Extras : ${extrasHuman}`, { x: MARGIN, size: 11 });

  // Tableau financier
  ctx.y -= 6;
  ensureSpace(ctx, 20);
  ctx.page.drawText("Récapitulatif financier", { x: MARGIN, y: ctx.y, size: 12, font: fb, color: C_ACCENT });
  ctx.y -= 12;

  const tableX = MARGIN;
  const tableW = PAGE_W - MARGIN * 2;
  const colDescW = tableW * 0.65;
  const rowH = 22;

  function tableHeader() {
    ensureSpace(ctx, rowH);
    ctx.page.drawRectangle({ x: tableX, y: ctx.y - rowH + 2, width: tableW, height: rowH, color: C_BG });
    ctx.page.drawText("Description", { x: tableX + 10, y: ctx.y - rowH + 8, size: 10.5, font: fb, color: C_ACCENT });
    ctx.page.drawText("Montant", { x: tableX + colDescW + 10, y: ctx.y - rowH + 8, size: 10.5, font: fb, color: C_ACCENT });
    ctx.y -= rowH + 2;
  }
  function tableRow(desc: string, amount: string) {
    ensureSpace(ctx, rowH);
    ctx.page.drawRectangle({ x: tableX, y: ctx.y - rowH + 2, width: tableW, height: rowH, color: rgb(1, 1, 1) });
    ctx.page.drawRectangle({ x: tableX, y: ctx.y + 2, width: tableW, height: 0.8, color: C_BORDER });
    // description tronquée si trop longue
    const maxDescW = colDescW - 16;
    let d = desc;
    const ell = "…";
    while (ctx.f.widthOfTextAtSize(d, 10.5) > maxDescW && d.length > 0) {
      d = d.slice(0, -1);
    }
    if (d !== desc) d = d.slice(0, Math.max(0, d.length - 1)) + ell;

    ctx.page.drawText(d, { x: tableX + 10, y: ctx.y - rowH + 8, size: 10.5, font: f, color: C_TEXT });
    ctx.page.drawText(amount, { x: tableX + colDescW + 10, y: ctx.y - rowH + 8, size: 10.5, font: f, color: C_TEXT });
    ctx.y -= rowH;
  }

  tableHeader();
  tableRow(`Formule « ${clean(args.formula) || "—"} »`, euros(args.total_eur || "0"));
  if (opts.length) {
    tableRow("Options", "—");
    for (const o of opts) tableRow(`• ${o}`, "—");
  }
  if (extrasHuman !== "—") {
    tableRow("Extras", "—");
    for (const e of extrasHuman.split(",").map(s => s.trim())) tableRow(`• ${e}`, "—");
  }

  // Totaux
  ensureSpace(ctx, 40);
  ctx.page.drawText("Acompte conseillé (15% arrondi)", { x: tableX, y: ctx.y, size: 10.5, font: fb, color: C_TEXT });
  ctx.page.drawText(euros(args.deposit_eur), { x: tableX + colDescW + 10, y: ctx.y, size: 10.5, font: fb, color: C_TEXT });
  ctx.y -= 18;
  ctx.page.drawText("Reste à payer le jour J", { x: tableX, y: ctx.y, size: 11.5, font: fb, color: C_ACCENT });
  ctx.page.drawText(euros(args.remaining_eur), { x: tableX + colDescW + 10, y: ctx.y, size: 11.5, font: fb, color: C_ACCENT });
  ctx.y -= 18;

  // Notes
  if (clean(args.notes)) {
    ensureSpace(ctx, 30);
    ctx.page.drawText("Notes / souhaits", { x: MARGIN, y: ctx.y, size: 12, font: fb, color: C_ACCENT });
    ctx.y -= 14;
    drawParagraphWrapped(ctx, clean(args.notes), { x: MARGIN, size: 10.5, color: C_TEXT });
  }

  // Signatures
  ensureSpace(ctx, 40);
  ctx.page.drawText("Signatures", { x: MARGIN, y: ctx.y, size: 12, font: fb, color: C_ACCENT });
  ctx.y -= 16;
  ctx.page.drawText("Le Client :", { x: MARGIN, y: ctx.y, size: 11, font: f, color: C_TEXT });
  ctx.page.drawLine({ start: { x: MARGIN + 70, y: ctx.y - 2 }, end: { x: MARGIN + 240, y: ctx.y - 2 }, thickness: 0.8, color: C_BORDER });
  ctx.page.drawText("Le Prestataire :", { x: MARGIN + 280, y: ctx.y, size: 11, font: f, color: C_TEXT });
  ctx.page.drawLine({ start: { x: MARGIN + 380, y: ctx.y - 2 }, end: { x: PAGE_W - MARGIN, y: ctx.y - 2 }, thickness: 0.8, color: C_BORDER });
  ctx.y -= 14;

  // Page 2 – CGV
  newPage(ctx);
  drawTitle(ctx, "Conditions Générales de Vente", 16);

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
    ensureSpace(ctx, 28);
    ctx.page.drawText(sec.title, { x: MARGIN, y: ctx.y, size: 12, font: fb, color: C_ACCENT });
    ctx.y -= 14;
    for (const p of sec.body) {
      drawParagraphWrapped(ctx, p, { x: MARGIN, size: 10.5, color: C_TEXT, lineHeight: 1.35 });
      ctx.y -= 6;
    }
  }

  // Zone "Fait à / le" + signature
  ensureSpace(ctx, 40);
  ctx.page.drawText("Fait à :", { x: MARGIN, y: ctx.y, size: 10.5, font: f, color: C_TEXT });
  ctx.page.drawLine({ start: { x: MARGIN + 42, y: ctx.y - 2 }, end: { x: MARGIN + 180, y: ctx.y - 2 }, thickness: 0.8, color: C_BORDER });
  ctx.page.drawText("Le :", { x: MARGIN + 210, y: ctx.y, size: 10.5, font: f, color: C_TEXT });
  ctx.page.drawLine({ start: { x: MARGIN + 240, y: ctx.y - 2 }, end: { x: MARGIN + 380, y: ctx.y - 2 }, thickness: 0.8, color: C_BORDER });
  ctx.y -= 20;
  ctx.page.drawText("Signature du Client :", { x: MARGIN, y: ctx.y, size: 10.5, font: f, color: C_TEXT });
  ctx.page.drawLine({ start: { x: MARGIN + 140, y: ctx.y - 2 }, end: { x: MARGIN + 420, y: ctx.y - 2 }, thickness: 0.8, color: C_BORDER });

  // — Finalisation : pagination correcte "Page X / Y"
  ctx.totalPages = ctx.pdf.getPageCount();
  for (let i = 0; i < ctx.totalPages; i++) {
    const p = ctx.pdf.getPage(i);
    const label = `Page ${i + 1} / ${ctx.totalPages}`;
    const width = f.widthOfTextAtSize(label, 9);
    // petite passe blanche pour garantir la lisibilité si re-draw
    p.drawRectangle({
      x: PAGE_W - MARGIN - width - 2,
      y: FOOTER_H - 18,
      width: width + 2,
      height: 12,
      color: rgb(1, 1, 1),
    });
    p.drawText(label, {
      x: PAGE_W - MARGIN - width,
      y: FOOTER_H - 14,
      size: 9,
      font: f,
      color: C_MUTED,
    });
  }

  return await pdf.save();
}