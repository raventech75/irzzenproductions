import { NextResponse } from "next/server";
import { resend, MAIL_FROM } from "@/lib/email";
import { getSignedUrl } from "@/lib/storage";

export async function POST(req: Request) {
  const { to, subject, html, path, filename } = await req.json();

  try {
    // Récupération du fichier via URL signée
    const signed = await getSignedUrl(path, 60 * 5);
    const res = await fetch(signed);
    const arrayBuf = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuf).toString("base64");

    await resend.emails.send({
      from: MAIL_FROM,
      to,
      subject: subject || "IRZZEN — Contrat / Récapitulatif",
      html: html || `<p>Veuillez trouver le contrat en pièce jointe.</p>`,
      attachments: [
        { filename: filename || "contrat.pdf", content: base64 }
      ]
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}