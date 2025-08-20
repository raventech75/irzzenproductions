// lib/pdfHelpers.ts
import { rgb, PDFFont, PDFPage } from "pdf-lib";

// Remplacements des caractères non supportés par les polices standard (WinAnsi)
const REPLACE_MAP: Record<string, string> = {
  "\u202F": " ", // narrow no-break space
  "\u00A0": " ", // nbsp
  "“": '"',
  "”": '"',
  "«": '"',
  "»": '"',
  "’": "'",
  "–": "-",
  "—": "-",
};

export function cleanPdfText(input: string | number | null | undefined): string {
  if (input == null) return "";
  let s = String(input);
  s = s.replace(/[\u202F\u00A0“”«»’–—]/g, (m) => REPLACE_MAP[m] ?? " ");
  s = s.replace(/[\u0000-\u001F\u007F]/g, " ");
  return s;
}

export function eur(n: number): string {
  return `${n
    .toLocaleString("fr-FR")
    .replace(/\u202F/g, " ")
    .replace(/\u00A0/g, " ")} €`;
}

export function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  fontRegular: PDFFont,
  fontBold: PDFFont,
  opts?: { bold?: boolean; size?: number }
) {
  page.drawText(cleanPdfText(text), {
    x,
    y,
    size: opts?.size ?? 12,
    font: opts?.bold ? fontBold : fontRegular,
    color: rgb(0.12, 0.12, 0.12),
  });
}