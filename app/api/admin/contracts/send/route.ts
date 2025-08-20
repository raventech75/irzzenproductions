// app/api/admin/contracts/send/route.ts
import { NextResponse } from "next/server";
import { getSignedContractUrl } from "@/lib/storage";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { email, path } = await req.json();
    if (!email || !path) {
      return NextResponse.json({ error: "Email ou chemin manquant" }, { status: 400 });
    }

    // ✅ Génère une URL signée valide pendant 5 minutes
    const signedUrl = await getSignedContractUrl(path, 60 * 5);

    // Télécharge le fichier via cette URL signée
    const res = await fetch(signedUrl);
    const arrayBuf = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuf).toString("base64");

    // Envoi du mail avec le PDF en PJ
    const result = await resend.emails.send({
      from: "Irzzen <no-reply@irzzen.fr>",
      to: email,
      subject: "Votre contrat IRZZEN",
      html: `<p>Bonjour,</p><p>Veuillez trouver ci-joint votre contrat au format PDF.</p>`,
      attachments: [
        {
          filename: path.split("/").pop() || "contrat.pdf",
          content: base64,
        },
      ],
    });

    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    console.error("Erreur d'envoi email contrat:", e);
    return NextResponse.json({ error: "Impossible d’envoyer le contrat" }, { status: 500 });
  }
}