import { jsPDF } from "jspdf";

type BuildPdfArgs = {
  booking: {
    couple_name: string;
    wedding_date?: string;
    city?: string;
    venue_ceremony?: string;
    venue_reception?: string;
    total_amount: number;
    deposit_suggested: number;
    remaining_dayj: number;
  };
  items: { label: string; amount: number; is_formula?: boolean }[];
  questionnaire: Record<string, any>;
};

const brand = {
  sage: "#98c9ae",   // vert sauge pastel (aligné à ta charte)
  apricot: "#f7caa4",
  ink: "#1f2937"
};

export function buildBookingPdf({ booking, items, questionnaire }: BuildPdfArgs) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  let y = margin;

  doc.setTextColor(brand.ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("IRZZEN PRODUCTIONS — Récapitulatif de réservation", margin, y);
  y += 18;

  doc.setDrawColor(brand.sage);
  doc.setLineWidth(2);
  doc.line(margin, y, 595 - margin, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Couple : ${booking.couple_name}`, margin, y); y += 16;
  if (booking.wedding_date) { doc.text(`Date du mariage : ${booking.wedding_date}`, margin, y); y += 16; }
  if (booking.city) { doc.text(`Ville : ${booking.city}`, margin, y); y += 16; }
  if (booking.venue_ceremony) { doc.text(`Lieu cérémonie : ${booking.venue_ceremony}`, margin, y); y += 16; }
  if (booking.venue_reception) { doc.text(`Lieu réception : ${booking.venue_reception}`, margin, y); y += 24; }

  doc.setFont("helvetica", "bold");
  doc.setTextColor(brand.sage);
  doc.text("Détails choisis", margin, y); y += 14;
  doc.setTextColor(brand.ink);
  doc.setFont("helvetica", "normal");

  items.forEach((it) => {
    if (y > 770) { doc.addPage(); y = margin; }
    doc.text(`• ${it.label}`, margin, y);
    doc.text(`${(it.amount).toLocaleString("fr-FR")} €`, 595 - margin - 80, y, { align: "right" });
    y += 16;
  });

  y += 10;
  doc.setDrawColor(brand.apricot);
  doc.setLineWidth(1);
  doc.line(margin, y, 595 - margin, y);
  y += 18;

  doc.setFont("helvetica", "bold");
  doc.text(`Total TTC : ${booking.total_amount.toLocaleString("fr-FR")} €`, margin, y); y += 16;
  doc.text(`Acompte conseillé (15% arrondi) : ${booking.deposit_suggested.toLocaleString("fr-FR")} €`, margin, y); y += 16;
  doc.text(`Reste à payer le jour J : ${booking.remaining_dayj.toLocaleString("fr-FR")} €`, margin, y); y += 24;

  doc.setTextColor(brand.sage);
  doc.text("Questionnaire", margin, y); y += 14;
  doc.setTextColor(brand.ink);
  doc.setFont("helvetica", "normal");

  const toPairs = Object.entries(questionnaire || {});
  toPairs.forEach(([k, v]) => {
    const line = `${k} : ${typeof v === "string" ? v : JSON.stringify(v)}`;
    const splitted = doc.splitTextToSize(line, 595 - margin * 2);
    if (y + splitted.length * 14 > 820) { doc.addPage(); y = margin; }
    doc.text(splitted, margin, y);
    y += splitted.length * 14 + 6;
  });

  y += 6;
  doc.setTextColor("#6b7280");
  const conditions = [
    "Conditions : aucune annulation recevable ; l’acompte n’est pas remboursable ;",
    "la livraison des fichiers digitaux intervient au plus tard dans les 6 mois ;",
    "tout solde non réglé à l’échéance suspend la livraison."
  ].join(" ");
  const cSplit = doc.splitTextToSize(conditions, 595 - margin * 2);
  if (y + cSplit.length * 14 > 820) { doc.addPage(); y = margin; }
  doc.text(cSplit, margin, y);

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}