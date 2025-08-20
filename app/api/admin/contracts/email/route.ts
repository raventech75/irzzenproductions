import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { path, to } = await req.json();
    if (!path || !to) {
      return NextResponse.json({ error: "Missing path or to" }, { status: 400 });
    }

    // 1) URL signée courte pour fetch le PDF
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("contracts")
      .createSignedUrl(path, 10 * 60); // 10 min

    if (signErr || !signed?.signedUrl) {
      return NextResponse.json({ error: signErr?.message || "Cannot sign URL" }, { status: 500 });
    }

    // 2) Télécharger le binaire
    const fileRes = await fetch(signed.signedUrl);
    if (!fileRes.ok) {
      return NextResponse.json({ error: "Fetch PDF failed" }, { status: 500 });
    }
    const arrayBuf = await fileRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuf).toString("base64");

    // 3) URL publique (si le bucket est public) — pour le lien direct dans l'email admin
    const { data: pub } = supabaseAdmin.storage.from("contracts").getPublicUrl(path);
    const publicUrl = pub?.publicUrl || null;

    const filename = path.split("/").pop() || "contrat.pdf";

    // 4) Envoi au client (PJ uniquement)
    const clientSend = await resend.emails.send({
      from: process.env.EMAIL_FROM || "no-reply@irzzenproductions.fr",
      to,
      subject: "Votre contrat – Irzzen Productions",
      html: `
        <p>Bonjour,</p>
        <p>Veuillez trouver ci-joint votre contrat.</p>
        ${publicUrl ? `<p>Téléchargement : <a href="${publicUrl}">${filename}</a></p>` : ""}
        <p>Bien cordialement,<br/>Irzzen Productions</p>
      `,
      attachments: [{ filename, content: base64 }],
    });
    if (clientSend.error) {
      return NextResponse.json({ error: clientSend.error.message }, { status: 500 });
    }

    // 5) Copie admin (PJ + lien direct si dispo)
    const adminSend = await resend.emails.send({
      from: process.env.EMAIL_FROM || "no-reply@irzzenproductions.fr",
      to: process.env.ADMIN_EMAIL || "contact@irzzen-productions.fr",
      subject: `📑 Contrat envoyé au client — ${filename}`,
      html: `
        <p>Contrat envoyé à : <strong>${to}</strong></p>
        <p>Fichier : <code>${filename}</code></p>
        ${publicUrl ? `<p>Lien direct : <a href="${publicUrl}">${publicUrl}</a></p>` : "<p>(Pas d'URL publique)</p>"}
      `,
      attachments: [{ filename, content: base64 }],
    });
    if (adminSend.error) {
      return NextResponse.json({ error: adminSend.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}