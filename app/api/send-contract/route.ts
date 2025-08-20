import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { to, pdfUrl } = await req.json();
    if (!to || !pdfUrl) {
      return NextResponse.json({ error: "Missing to or pdfUrl" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "contact@irzzenproductions.fr",
      to,
      subject: "Votre contrat – Irzzenproductions",
      html: `
        <p>Bonjour,</p>
        <p>Voici le lien pour télécharger votre contrat :</p>
        <p><a href="${pdfUrl}">Télécharger le contrat (PDF)</a></p>
        <p>Bien cordialement,<br/>Irzzenproductions</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}