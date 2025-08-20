// lib/pdf.ts
// Contrat PDF "pro" avec pdf-lib : bandeau, sections, tableau, footer & pagination
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type RGB,
} from "pdf-lib";

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

const C_BG: RGB = rgb(1, 0.976, 0.96);   // fond très léger pêche
const C_ACCENT: RGB = rgb(0.95, 0.45, 0.2); // orange pastel
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

export async function buildBookingPdf(args: BuildPdfArgs): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4 portrait
  const { width, height } = page.getSize();

  const f = await pdf.embedFont(StandardFonts.Helvetica);
  const fb = await pdf.embedFont(StandardFonts.HelveticaBold);

  // Bandeau
  page.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: C_BG });
  page.drawText("I R Z Z E N   P R O D U C T I O N S", {
    x: 40, y: height - 48, size: 10, font: fb, color: C_ACCENT,
  });
  page.drawText("Contrat & Confirmation de Réservation", {
    x: 40, y: height - 80, size: 18, font: fb, color: C_ACCENT,
  });

  let y = height - 140;

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
  page.drawText("Client", { x: col1x, y, size: 12, font: fb, color: C_ACCENT });
  y -= 14;
  y = drawParagraph(page, `Couple : ${couple || "—"}`, { x: col1x, y, size: 11, font: f, maxWidth: colW }) - 2;
  y = drawParagraph(page, `Email : ${clean(args.email) || "—"}`, { x: col1x, y, size: 11, font: f, maxWidth: colW }) - 2;
  y = drawParagraph(page, `Date du mariage : ${clean(args.wedding_date) || "—"}`, { x: col1x, y, size: 11, font: f, maxWidth: colW });

  // Colonne 2
  let y2 = height - 154;
  page.drawText("Lieux & Horaires", { x: col2x, y: height - 140, size: 12, font: fb, color: C_ACCENT });
  y2 = drawParagraph(page, `Cérémonie : ${clean(args.ceremony_address) || "—"}${args.ceremony_time ? ` (${clean(args.ceremony_time)})` : ""}`, { x: col2x, y: y2, size: 11, font: f, maxWidth: colW }) - 2;
  y2 = drawParagraph(page, `Réception : ${clean(args.reception_address) || "—"}${args.reception_time ? ` (${clean(args.reception_time)})` : ""}`, { x: col2x, y: y2, size: 11, font: f, maxWidth: colW });

  const afterHeaderY = Math.min(y, y2) - 12;
  hr(page, 40, width - 40, afterHeaderY);

  // Formule & options
  y = afterHeaderY - 24;
  page.drawText("Formule & Options", { x: 40, y, size: 12, font: fb, color: C_ACCENT });
  y -= 16;

  y = drawParagraph(page, `Formule : ${clean(args.formula) || "—"}`, { x: 40, y, size: 11, font: f, maxWidth: width - 80 }) - 6;
  if (args.formula_description) {
    y = drawParagraph(page, clean(args.formula_description), { x: 40, y, size: 10.5, font: f, maxWidth: width - 80, color: C_MUTED }) - 8;
  }

  const opts = clean(args.selected_options)
    ? clean(args.selected_options).split(",").map(s => s.trim()).filter(Boolean)
    : [];
  y = drawParagraph(page, `Options : ${opts.length ? opts.join(", ") : "—"}`, { x: 40, y, size: 11, font: f, maxWidth: width - 80 }) - 6;

  const extrasHuman = (() => {
    const raw = clean(args.extras);
    if (!raw) return "—";
    const items = raw.split("|").filter(Boolean).map(p => {
      const [label, amount] = p.split(":");
      return `${clean(label)}${amount ? ` (${clean(amount)} €)` : ""}`;
    });
    return items.length ? items.join(", ") : "—";
  })();
  y = drawParagraph(page, `Extras : ${extrasHuman}`, { x: 40, y, size: 11, font: f, maxWidth: width - 80 });

  // Tableau des prix
  y -= 14;
  page.drawText("Récapitulatif financier", { x: 40, y, size: 12, font: fb, color: C_ACCENT });
  y -= 8;

  const tableX = 40;
  const tableW = width - 80;
  const colDescW = tableW * 0.65;
  const rowH = 22;

  // Header
  y -= rowH;
  page.drawRectangle({ x: tableX, y: y, width: tableW, height: rowH, color: C_BG });
  page.drawText("Description", { x: tableX + 10, y: y + 6, size: 10.5, font: fb, color: C_ACCENT });
  page.drawText("Montant", { x: tableX + colDescW + 10, y: y + 6, size: 10.5, font: fb, color: C_ACCENT });

  // Rows
  function row(desc: string, amount: string) {
    y -= rowH;
    page.drawRectangle({ x: tableX, y, width: tableW, height: rowH, color: rgb(1,1,1) });
    page.drawRectangle({ x: tableX, y, width: tableW, height: 0.8, color: C_BORDER });
    page.drawText(desc, { x: tableX + 10, y: y + 6, size: 10.5, font: f, color: C_TEXT });
    page.drawText(amount, { x: tableX + colDescW + 10, y: y + 6, size: 10.5, font: f, color: C_TEXT });
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
  page.drawText("Acompte conseillé (15% arrondi)", { x: tableX, y, size: 10.5, font: fb, color: C_TEXT });
  page.drawText(euros(args.deposit_eur), { x: tableX + colDescW + 10, y, size: 10.5, font: fb, color: C_TEXT });

  y -= 18;
  page.drawText("Reste à payer le jour J", { x: tableX, y, size: 11.5, font: fb, color: C_ACCENT });
  page.drawText(euros(args.remaining_eur), { x: tableX + colDescW + 10, y, size: 11.5, font: fb, color: C_ACCENT });

  // Notes éventuelles
  if (clean(args.notes)) {
    y -= 24;
    page.drawText("Notes / souhaits", { x: 40, y, size: 12, font: fb, color: C_ACCENT });
    y -= 14;
    y = drawParagraph(page, clean(args.notes), { x: 40, y, size: 10.5, font: f, maxWidth: width - 80, color: C_TEXT });
  }

  // Mentions & conditions
  y -= 24;
  page.drawText("Mentions & Conditions", { x: 40, y, size: 12, font: fb, color: C_ACCENT });
  y -= 12;

  const clauses = [
    "Acompte : 15 % recommandé. L’acompte n’est pas remboursable en cas d’annulation.",
    "Annulation : aucune annulation n’est recevable après réservation ; le solde reste dû selon les termes convenus.",
    "Droits d’auteur : Irzzen Productions conserve les droits d’auteur ; usage privé accordé au client. Toute diffusion publique nécessite autorisation.",
    "Force majeure : en cas d’imprévu majeur (maladie, accident, grève, etc.), un remplaçant ou un remboursement au prorata sera proposé.",
    "Responsabilité : la meilleure diligence est apportée à la prestation ; aucune garantie de résultat artistique spécifique.",
    "Données personnelles : traitées uniquement pour l’exécution du contrat et la relation commerciale, conformément au RGPD.",
    "Livraison : les fichiers numériques sont livrés au plus tard sous 6 mois.",
  ];

  for (const c of clauses) {
    y = drawParagraph(page, `• ${c}`, { x: 40, y, size: 10.5, font: f, maxWidth: width - 80, color: C_MUTED, lineHeight: 1.35 }) - 2;
  }

  // Signature
  y -= 18;
  page.drawText("Signatures", { x: 40, y, size: 12, font: fb, color: C_ACCENT });
  y -= 14;
  page.drawText("Le Client :", { x: 40, y, size: 11, font: f, color: C_TEXT });
  page.drawLine({ start: { x: 110, y: y - 2 }, end: { x: 280, y: y - 2 }, thickness: 0.8, color: C_BORDER });
  page.drawText("Le Prestataire :", { x: 320, y, size: 11, font: f, color: C_TEXT });
  page.drawLine({ start: { x: 420, y: y - 2 }, end: { x: 560, y: y - 2 }, thickness: 0.8, color: C_BORDER });

  // Footer
  const footerY = 28;
  hr(page, 40, width - 40, footerY + 10, C_BORDER);
  page.drawText("Irzzen Productions — contact@irzzenproductions.fr — www.irzzenproductions.fr", {
    x: 40, y: footerY, size: 9, font: f, color: C_MUTED,
  });
  page.drawText("Page 1 / 1", { x: width - 80, y: footerY, size: 9, font: f, color: C_MUTED });

  return await pdf.save();
}