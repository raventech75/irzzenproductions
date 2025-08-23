// app/api/admin/contrats/send/route.ts
import { NextResponse } from "next/server";
import { resend, MAIL_FROM } from "@/lib/email";
import { getSignedContractUrl } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { path, to } = await req.json();

    if (!path || !to) {
      return NextResponse.json(
        { error: "Paramètres manquants : 'path' et 'to' sont requis." },
        { status: 400 }
      );
    }

    // URL signée (bucket privé) valable 5 minutes
    const signedUrl = await getSignedContractUrl(path, 60 * 5);

    // Téléchargement du PDF
    const res = await fetch(signedUrl);
    if (!res.ok) {
      return NextResponse.json(
        { error: `Impossible de télécharger le contrat (${res.status})` },
        { status: 502 }
      );
    }
    const arrayBuf = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuf).toString("base64");
    const filename = path.split("/").pop() || "contrat.pdf";

    // Envoi via Resend
    const emailResp = await resend.emails.send({
      from: MAIL_FROM,
      to: [to],
      subject: "Votre contrat — Irzzenproductions",
      html: `
        <p>Bonjour,</p>
        <p>Veuillez trouver en pièce jointe votre contrat de réservation.</p>
        <p>Rappel : acompte non remboursable, aucune annulation recevable, livraison des fichiers au maximum sous 6 mois.</p>
        <p>Bien cordialement,<br/>Irzzenproductions</p>
      `,
      attachments: [
        {
          filename,
          content: base64,
          content_type: "application/pdf", // ✅ bon champ
        },
      ],
    });

    // Gestion d’erreur Resend (si disponible)
    if (emailResp.error) {
      return NextResponse.json(
        { error: emailResp.error.message || "Échec d'envoi via Resend." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, id: emailResp.data?.id ?? null });
  } catch (err: any) {
    console.error("contrats/send error:", err);
    return NextResponse.json({ error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}