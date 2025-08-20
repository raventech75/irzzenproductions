// app/api/send-contract/route.ts
import { NextResponse } from "next/server";
import { resend, MAIL_FROM } from "@/lib/email";
import { getSignedContractUrl } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { to, pdfUrl, pdfPath } = await req.json();

    if (!to) {
      return NextResponse.json({ error: "Adresse email du client manquante." }, { status: 400 });
    }
    if (!pdfUrl && !pdfPath) {
      return NextResponse.json({ error: "Contrat introuvable (pdfUrl ou pdfPath requis)." }, { status: 400 });
    }
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "RESEND_API_KEY manquant côté serveur." }, { status: 500 });
    }

    // Détermine une URL téléchargeable
    let fetchUrl = pdfUrl as string | null;
    let filename = "contrat.pdf";

    if (!fetchUrl && pdfPath) {
      // bucket privé: URL signée temporaire
      fetchUrl = await getSignedContractUrl(pdfPath, 10 * 60);
      filename = pdfPath.split("/").pop() || filename;
    } else if (pdfUrl) {
      try {
        const u = new URL(pdfUrl);
        filename = u.pathname.split("/").pop() || filename;
      } catch { /* ignore */ }
    }

    // Récupère le PDF en binaire
    const resp = await fetch(fetchUrl!);
    if (!resp.ok) {
      return NextResponse.json({ error: `Téléchargement du PDF impossible (${resp.status})` }, { status: 500 });
    }
    const base64 = Buffer.from(await resp.arrayBuffer()).toString("base64");

    // Envoi mail
    const send = await resend.emails.send({
      from: MAIL_FROM,
      to,
      subject: "Votre contrat — Irzzen Productions",
      html: `
        <p>Bonjour,</p>
        <p>Veuillez trouver ci-joint votre contrat de réservation.</p>
        ${pdfUrl ? `<p>Téléchargement direct : <a href="${pdfUrl}">${filename}</a></p>` : ""}
        <p>Bien cordialement,<br/>Irzzen Productions</p>
      `,
      attachments: [{ filename, content: base64 }],
    });

    if (send.error) {
      return NextResponse.json({ error: send.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erreur serveur" }, { status: 500 });
  }
}