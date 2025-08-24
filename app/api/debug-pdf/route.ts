import { NextResponse } from "next/server";
import { buildBookingPdf } from "@/lib/pdf";

// Simulation de données pour tester le rendu PDF
export async function GET() {
  const data = {
    bride_first_name: "Camille",
    bride_last_name: "Durand",
    groom_first_name: "Julien",
    groom_last_name: "Martin",
    couple_name: "Camille & Julien", // ✅ Propriété manquante ajoutée
    email: "camille.julien@example.com",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue de Paris, 75000 Paris",
    wedding_date: "2025-06-14",
    ceremony_location: "Église Saint-Paul, Paris",
    reception_location: "Château de Versailles",
    guest_count: 120,
    formula: "Formule Essentielle",
    formula_description:
      "Couverture photo/vidéo de la cérémonie et des moments clés, remise numérique.",
    total_eur: 800,       // ✅ corrigé → number
    deposit_eur: 200,     // ✅ corrigé → number
    remaining_eur: 600,   // ✅ corrigé → number
    selected_options: [], // ✅ Tableau vide ou avec des options de test: ["Option 1", "Option 2"]
    special_requests: "Merci de prévoir quelques photos au coucher du soleil.",
    created_at: new Date().toISOString(),
  };

  // Génération du PDF
  const pdfBuffer = await buildBookingPdf(data);

  // Conversion en Buffer Node.js pour NextResponse
  const buffer = Buffer.from(pdfBuffer);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=debug-booking.pdf",
    },
  });
}