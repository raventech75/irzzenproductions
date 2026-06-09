import { NextRequest, NextResponse } from "next/server";
import { sendConfirmationContact, sendNotificationAdmin } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prenom_marie1,
      prenom_marie2,
      email,
      telephone,
      date_mariage,
      lieu,
      message,
      formule,
      total,
    } = body;

    if (!email || !prenom_marie1) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const nomClient = prenom_marie2
      ? `${prenom_marie1} & ${prenom_marie2}`
      : prenom_marie1;

    const dateMariageFormatee = date_mariage
      ? new Date(date_mariage).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : undefined;

    // Envoyer les deux emails en parallèle
    await Promise.all([
      sendConfirmationContact({
        nomClient,
        email,
        dateMariage: dateMariageFormatee,
        formule,
        total: total ? parseInt(total) : undefined,
      }),
      sendNotificationAdmin({
        nomClient,
        email,
        telephone,
        dateMariage: dateMariageFormatee,
        lieu,
        formule,
        total: total ? parseInt(total) : undefined,
        message,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur envoi email:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
