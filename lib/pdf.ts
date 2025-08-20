// lib/pdf.ts
// Génération du contrat PDF avec pdf-lib (compatible Next.js / Vercel)
import { PDFDocument, StandardFonts, rgb, type RGB } from "pdf-lib";

export interface BuildPdfArgs {
  bride_first_name?: string;
  bride_last_name?: string;
  groom_first_name?: string;
  groom_last_name?: string;
  couple_name?: string;
  wedding_date?: string;
  formula?: string;
  total_eur?: string;      // texte déjà formaté (ex: "1 500") ou nombre en string
  deposit_eur?: string;
  remaining_eur?: string;
  selected_options?: string; // ex: "Drone, Album"
  extras?: string;           // ex: "Heure sup.:150|Déplacement:80"
  email?: string;

  // Champs additionnels (facultatifs)
  ceremony_address?: string;
  ceremony_time?: string;
  reception_address?: string;
  reception_time?: string;
  notes?: string;
}

const ORANGE: RGB = rgb(0.95, 0.45, 0.2);
const BLACK: RGB = rgb(0, 0, 0);
const GRAY: RGB = rgb(0.35, 0.35, 0.35);

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
};

/**
 * Dessine un paragraphe (word-wrap simple) et retourne la nouvelle position Y
 */
function drawParagraph(
  page: any,
  font: any,
  text: string,
  { x, y, size, maxWidth = 495, lineHeight = 1.25, color = BLACK }: DrawTextOpts
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

/**
 * Construit un PDF de contrat et retourne un Uint8Array
 */
export async function buildBookingPdf(args: BuildPdfArgs): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 (pt)
  const { height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 60;

  // ——— Titre
  page.drawText("Contrat & Confirmation de Réservation", {
    x: 50,
    y,
    size: 18,
    font: fontBold,
    color: ORANGE,
  });
  y -= 30;

  // ——— Informations clients
  y = drawParagraph(page, fontBold, "Informations Clients", {
    x: 50,
    y,
    size: 13,
    color: ORANGE,
  }) - 6;

  const couple =
    clean(args.couple_name) ||
    [clean(args.bride_first_name), clean(args.bride_last_name), "&", clean(args.groom_first_name), clean(args.groom_last_name)]
      .filter(Boolean)
      .join(" ");

  y = drawParagraph(page, font, `Couple : ${couple || "—"}`, {
    x: 50,
    y,
    size: 11,
    color: BLACK,
  }) - 4;

  y = drawParagraph(page, font, `Email : ${clean(args.email) || "—"}`, {
    x: 50,
    y,
    size: 11,
    color: BLACK,
  }) - 4;

  y = drawParagraph(page, font, `Date du mariage : ${clean(args.wedding_date) || "—"}`, {
    x: 50,
    y,
    size: 11,
    color: BLACK,
  }) - 10;

  // ——— Lieux & Horaires
  y = drawParagraph(page, fontBold, "Lieux & Horaires", {
    x: 50,
    y,
    size: 13,
    color: ORANGE,
  }) - 6;

  const locs: string[] = [];
  if (args.ceremony_address || args.ceremony_time) {
    locs.push(
      `Cérémonie : ${clean(args.ceremony_address) || "—"}${args.ceremony_time ? ` (${clean(args.ceremony_time)})` : ""}`
    );
  }
  if (args.reception_address || args.reception_time) {
    locs.push(
      `Réception : ${clean(args.reception_address) || "—"}${args.reception_time ? ` (${clean(args.reception_time)})` : ""}`
    );
  }
  if (locs.length === 0) locs.push("—");
  for (const l of locs) {
    y = drawParagraph(page, font, l, { x: 50, y, size: 11, color: BLACK }) - 3;
  }
  y -= 8;

  // ——— Formule & Options
  y = drawParagraph(page, fontBold, "Formule & Options", {
    x: 50,
    y,
    size: 13,
    color: ORANGE,
  }) - 6;

  y = drawParagraph(page, font, `Formule : ${clean(args.formula) || "—"}`, {
    x: 50,
    y,
    size: 11,
    color: BLACK,
  }) - 4;

  y = drawParagraph(page, font, `Options : ${clean(args.selected_options) || "—"}`, {
    x: 50,
    y,
    size: 11,
    color: BLACK,
  }) - 4;

  // ——— Extras (ex: "Heure sup.:150|Déplacement:80")
  const extrasText = clean(args.extras);
  let extrasHuman = "—";
  if (extrasText) {
    const items = extrasText
      .split("|")
      .filter(Boolean)
      .map((p) => {
        const [label, amount] = p.split(":");
        return `${clean(label)}${amount ? ` (${clean(amount)} €)` : ""}`;
      });
    extrasHuman = items.length ? items.join(", ") : "—";
  }
  y = drawParagraph(page, font, `Extras : ${extrasHuman}`, {
    x: 50,
    y,
    size: 11,
    color: BLACK,
  }) - 10;

  // ——— Récapitulatif financier
  y = drawParagraph(page, fontBold, "Récapitulatif Financier", {
    x: 50,
    y,
    size: 13,
    color: ORANGE,
  }) - 6;

  const total = clean(args.total_eur);
  const deposit = clean(args.deposit_eur);
  const rest = clean(args.remaining_eur);

  y = drawParagraph(page, font, `Total : ${total ? `${total} €` : "—"}`, {
    x: 50,
    y,
    size: 11,
  }) - 3;

  y = drawParagraph(
    page,
    font,
    `Acompte conseillé (15% arrondi) : ${deposit ? `${deposit} €` : "—"}`,
    { x: 50, y, size: 11 }
  ) - 3;

  y = drawParagraph(page, font, `Reste à payer le jour J : ${rest ? `${rest} €` : "—"}`, {
    x: 50,
    y,
    size: 11,
  }) - 10;

  // ——— Mentions & Conditions
  y = drawParagraph(page, fontBold, "Mentions & Conditions", {
    x: 50,
    y,
    size: 13,
    color: ORANGE,
  }) - 6;

  const clauses = [
    "Acompte : 15 % recommandé. L’acompte n’est pas remboursable en cas d’annulation.",
    "Annulation : aucune annulation n’est recevable après réservation ; le solde reste dû selon les termes convenus.",
    "Droits d’auteur : Irzzen Productions conserve les droits d’auteur ; usage privé accordé au client. Toute diffusion publique nécessite autorisation.",
    "Force majeure : en cas d’imprévu majeur (maladie, accident, grève, etc.), un remplaçant ou un remboursement au prorata sera proposé.",
    "Responsabilité : la meilleure diligence est apportée à la prestation ; aucune garantie de résultat artistique spécifique.",
    "Données personnelles : traitées uniquement pour l’exécution du contrat et la relation commerciale, selon le RGPD.",
    "Livraison : les fichiers numériques sont livrés au plus tard sous 6 mois.",
  ];

  for (const c of clauses) {
    y = drawParagraph(page, font, `• ${c}`, {
      x: 50,
      y,
      size: 10.5,
      color: GRAY,
      lineHeight: 1.35,
    }) - 2;
  }

  // ——— Signatures (visuel)
  y -= 16;
  y = drawParagraph(page, fontBold, "Signatures", {
    x: 50,
    y,
    size: 12,
    color: ORANGE,
  }) - 10;

  page.drawText("Le Client :", { x: 50, y, size: 11, font, color: BLACK });
  page.drawLine({ start: { x: 120, y: y - 2 }, end: { x: 320, y: y - 2 }, thickness: 0.5, color: GRAY });
  page.drawText("Le Prestataire :", { x: 330, y, size: 11, font, color: BLACK });
  page.drawLine({ start: { x: 430, y: y - 2 }, end: { x: 560, y: y - 2 }, thickness: 0.5, color: GRAY });

  // ——— Sauvegarde
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}