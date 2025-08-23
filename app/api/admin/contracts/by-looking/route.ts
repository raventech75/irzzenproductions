import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // ⚠️ assure-toi d’avoir ce client

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId manquant" },
        { status: 400 }
      );
    }

    // Récupérer le contrat lié à la réservation
    const { data, error } = await supabase
      .from("contrats")
      .select("file_path, bytes, created_at")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: false }) // dernier en priorité
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Contrat introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Erreur by-booking:", err);
    return NextResponse.json(
      { error: "Erreur serveur: " + err.message },
      { status: 500 }
    );
  }
}