// app/api/send-contract/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { CONTRACTS_BUCKET, getSignedContractUrl } from "@/lib/storage";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { to, pdfUrl, pdfPath } = await req.json();
    if (!to || (!pdfUrl && !pdfPath)) {
      return NextResponse.json({ error: "Missing to and (pdfUrl or pdfPath)" }, { status: 400 });
    }

    let fetchUrl = pdfUrl;
    let fileName = "contrat.pdf";

    if (!fetchUrl && pdfPath) {
      // bucket privé (ou pour garantir un fetch)
      fetchUrl = await getSignedContractUrl(pdfPath, 10 * 60);
      fileName = pdfPath.split("/").pop() || fileName;
    } else if (pdfUrl) {
      try {
        const u = new URL(pdfUrl);
        fileName = u.pathname.split("/").pop() || fileName;
      } catch {
        // ignore
      }
    }

    // Récupération du PDF binaire
    const res = await fetch(fetchUrl!);
    if (!res.ok) {
      return NextResponse.json({ error: "Fetch PDF failed" }, { status: 500 });
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const base64 = buf.toString("base64");

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "no-reply@irzzenproductions.fr",
      to,
      subject: "Votre contrat – Irzzen Productions",
      html: `
        <p>Bonjour,</p>
        <p>Veuillez trouver ci-joint votre contrat.</p>
        ${pdfUrl ? `<p>Lien : <a href="${pdfUrl}">${fileName}</a></p>` : ""}
        <p>Bien cordialement,<br/>Irzzen Productions</p>
      `,
      attachments: [{ filename: fileName, content: base64 }],
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}