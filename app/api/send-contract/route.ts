// app/api/send-contract/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const MAIL_FROM = process.env.MAIL_FROM || "Irzzen Productions <no-reply@irzzenproductions.fr>";

export async function POST(req: Request) {
  try {
    const { to, pdfUrl, coupleName } = await req.json();

    if (!pdfUrl) {
      return NextResponse.json({ error: "Missing pdfUrl" }, { status: 400 });
    }

    const recipients = Array.isArray(to) ? to : (to ? [to] : []);
    if (recipients.length === 0) {
      // si aucun "to" donné, on laisse l’utilisateur taper son mail sur la page success,
      // ou bien tu peux choisir un fallback (ex: admin)
      return NextResponse.json({ error: "Missing recipient email" }, { status: 400 });
    }

    await resend.emails.send({
      from: MAIL_FROM,
      to: recipients,
      subject: "Votre contrat IRZZEN – Récapitulatif & téléchargement",
      text: [
        `Bonjour ${coupleName || ""},`,
        "",
        `Merci pour votre réservation avec IRZZEN.`,
        `Vous pouvez télécharger votre contrat en cliquant sur le lien ci-dessous :`,
        pdfUrl,
        "",
        "Rappels :",
        "• Aucune annulation pour quelconque raison n'est recevable.",
        "• L'acompte n'est remboursé en aucun cas.",
        "• La livraison des fichiers digitaux a lieu au maximum dans 6 mois.",
        "",
        "Cordialement,",
        "IRZZEN Productions",
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}