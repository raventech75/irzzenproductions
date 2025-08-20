// app/api/send-contract/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const MAIL_FROM = process.env.MAIL_FROM || "Irzzen Productions <no-reply@irzzenproductions.fr>";

export async function POST(req: Request) {
  try {
    const { to, pdfUrl, coupleName } = (await req.json()) as {
      to: string | string[];
      pdfUrl: string;
      coupleName?: string;
    };

    if (!pdfUrl) {
      return NextResponse.json({ error: "Missing pdfUrl" }, { status: 400 });
    }

    const recipients = Array.isArray(to) ? to : [to].filter(Boolean);
    if (!recipients.length) {
      return NextResponse.json({ error: "Missing recipient email" }, { status: 400 });
    }

    const text = [
      `Bonjour${coupleName ? " " + coupleName : ""},`,
      "",
      `Merci pour votre réservation avec IRZZEN.`,
      `Vous pouvez télécharger votre contrat ici : ${pdfUrl}`,
      "",
      "Rappels :",
      "• Aucune annulation pour quelconque raison n'est recevable.",
      "• L'acompte n'est remboursé en aucun cas.",
      "• La livraison des fichiers digitaux a lieu au maximum dans 6 mois.",
      "",
      "Cordialement,",
      "IRZZEN Productions",
    ].join("\n");

    await resend.emails.send({
      from: MAIL_FROM,
      to: recipients,
      subject: "Votre contrat IRZZEN – Téléchargement",
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("send-contract error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}