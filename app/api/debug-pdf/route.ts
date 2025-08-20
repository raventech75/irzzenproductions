// app/api/debug-pdf/route.ts
import { NextResponse } from "next/server";
import { buildBookingPdf } from "@/lib/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const pdf = await buildBookingPdf({
    couple_name: "feridun kizgin",
    email: "raventech75@gmail.com",
    wedding_date: "2025-09-12",
    ceremony_address: "Mairie du 5e, Paris",
    ceremony_time: "14:00",
    reception_address: "Domaine des Prés",
    reception_time: "19:30",
    notes: "DJ jusqu’à 2h, photos de groupe avant cocktail.",
    formula: "Formule Essentielle",
    formula_description: "Couverture photo/vidéo de la cérémonie et des moments clés, remise numérique.",
    total_eur: "800",
    deposit_eur: "200",
    remaining_eur: "600",
    selected_options: "—",
    extras: "—",
  });

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="debug-contrat.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}