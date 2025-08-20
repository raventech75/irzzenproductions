import Stripe from "stripe";
import { headers } from "next/headers";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";

// ⚡ Config Stripe + Supabase
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Pas l’ANON KEY ici
);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("[stripe webhook] Signature invalide:", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("[stripe webhook] Event reçu:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Checkout session completed:", session.id);

      // 1. Récupération des métadonnées
      const bride = session.metadata?.bride_first_name || "Mariée";
      const groom = session.metadata?.groom_first_name || "Marié";
      const weddingDate = session.metadata?.wedding_date || "Date inconnue";
      const email = session.customer_email || "contact inconnu";

      // 2. Générer un PDF simple avec pdf-lib
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      page.drawText("Contrat de Prestation Photo/Vidéo", {
        x: 50,
        y: 350,
        size: 20,
        font,
        color: rgb(0, 0, 0),
      });
      page.drawText(`Mariée: ${bride}`, { x: 50, y: 300, size: 14, font });
      page.drawText(`Marié: ${groom}`, { x: 50, y: 280, size: 14, font });
      page.drawText(`Date du mariage: ${weddingDate}`, {
        x: 50,
        y: 260,
        size: 14,
        font,
      });
      page.drawText(`Email: ${email}`, { x: 50, y: 240, size: 14, font });

      const pdfBytes = await pdfDoc.save();

      // 3. Upload dans Supabase Storage
      const fileName = `contrats/${session.id}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from("contrats") // ⚠️ Ton bucket Supabase doit s’appeler "contrats"
        .upload(fileName, pdfBytes, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        console.error("❌ Erreur upload Supabase:", uploadError.message);
        return new Response("Upload failed", { status: 500 });
      }

      // 4. Rendre le fichier public
      const { data: publicUrlData } = supabase.storage
        .from("contrats")
        .getPublicUrl(fileName);

      console.log("📂 PDF accessible ici:", publicUrlData.publicUrl);

      // 👉 Ici tu peux aussi sauver en DB l’URL
      // await supabase.from("bookings").insert({
      //   stripe_session: session.id,
      //   contrat_url: publicUrlData.publicUrl,
      // });

      return new Response(
        JSON.stringify({
          received: true,
          pdfUrl: publicUrlData.publicUrl,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[stripe webhook] Handler error:", err.message);
    return new Response("Server error", { status: 500 });
  }
}