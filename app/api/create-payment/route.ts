// app/api/create-payment/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { FORMULAS_DETAILED, FormulaDetailed } from "@/lib/modules";
import { computePricing } from "@/lib/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // ✅ version typée et stable
});

// Petit utilitaire pour éviter les espaces insécables (\u202F) dans le PDF
function clean(txt: string | number | null | undefined): string {
  return String(txt ?? "")
    .replace(/\u202F/g, " ")
    .replace(/\u00A0/g, " ")
    .trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Format attendu depuis /checkout/page.tsx
    // { customer, config }
    const customer = body?.customer || {};
    const config = body?.config || {};

    const { email, firstName, lastName, coupleName, weddingDate } = customer as {
      email?: string;
      firstName?: string;
      lastName?: string;
      coupleName?: string;
      weddingDate?: string;
    };

    if (!email) {
      return NextResponse.json({ error: "Email client manquant" }, { status: 400 });
    }

    // Formule
    const formula: FormulaDetailed | undefined = FORMULAS_DETAILED.find(
      (f) => f.id === config.formulaId
    );
    if (!formula) {
      return NextResponse.json({ error: "Formule inconnue" }, { status: 400 });
    }

    // Prix des options sélectionnées — sécurisé contre undefined
    const allOptions = FORMULAS_DETAILED.flatMap((f) => f.options ?? []);
    const optionPrices: number[] = (config.options ?? []).map((id: string) => {
      const opt = allOptions.find((o) => o.id === id);
      return opt ? opt.price : 0;
    });

    // Extras personnalisés
    const extraPrices: number[] = (config.extras ?? []).map(
      (e: { price: number }) => Number(e?.price || 0)
    );

    // Totaux
    const totals = computePricing(formula.price, [...optionPrices, ...extraPrices]);

    // ———————————————
    // Génération du PDF (pdf-lib)
    // ———————————————
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y = height - 50;

    const line = (text: string, size = 12) => {
      page.drawText(clean(text), { x: 50, y, size, font, color: rgb(0, 0, 0) });
      y -= size + 8;
    };

    const title = (text: string) => {
      page.drawText(clean(text), { x: 50, y, size: 16, font, color: rgb(0.95, 0.45, 0.2) });
      y -= 24;
    };

    title("Contrat & Confirmation de Réservation");
    line(`Couple : ${clean(coupleName) || `${clean(firstName)} ${clean(lastName)}`}`);
    line(`Email : ${clean(email)}`);
    if (weddingDate) line(`Date du mariage : ${clean(weddingDate)}`);
    y -= 6;

    title("Formule et options");
    line(`Formule choisie : ${clean(formula.name || formula.id)}`);
    line(`Description : ${clean(formula.description)}`);
    const selectedOpts = (config.options ?? [])
      .map((id: string) => allOptions.find((o) => o.id === id)?.name)
      .filter(Boolean) as string[];
    line(`Options : ${selectedOpts.length ? selectedOpts.join(", ") : "Aucune"}`);
    const extras = (config.extras ?? []) as { label: string; price: number }[];
    line(
      `Extras : ${
        extras.length ? extras.map((e) => `${clean(e.label)} (${Number(e.price)} €)`).join(", ") : "Aucun"
      }`
    );
    y -= 6;

    title("Récapitulatif financier");
    line(`Total : ${totals.total} €`);
    line(`Acompte conseillé (15% arrondi) : ${totals.depositSuggested} €`);
    line(`Reste à payer le jour J : ${totals.remainingDayJ} €`);
    y -= 6;

    title("Mentions légales & Conditions");
    line(
      "Acompte : 15% recommandé. Annulation : acompte non remboursable. " +
        "Droits d’auteur : usage privé, diffusion publique sur autorisation. " +
        "Responsabilité : pas de garantie en cas d’imprévu. Force majeure : " +
        "remboursement ou remplacement. Données traitées selon RGPD.",
      10
    );

    const pdfBytes = await pdfDoc.save();

    // ———————————————
    // Upload PDF dans Supabase Storage (bucket 'contracts')
    // ———————————————
    const safeLast = clean(lastName) || "client";
    const fileName = `contracts/IRZZEN_${Date.now()}_${safeLast}.pdf`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("contracts")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Erreur upload Supabase:", uploadError);
      return NextResponse.json({ error: "Upload PDF failed" }, { status: 500 });
    }

    // URL publique (si bucket public) — sinon crée une signée plus bas
    const { data: publicUrlData } = supabaseAdmin.storage.from("contracts").getPublicUrl(fileName);
    const publicUrl = publicUrlData?.publicUrl || "";

    // ———————————————
    // Création de la session Stripe Checkout
    // ———————————————
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `Formule ${clean(formula.name || formula.id)}` },
            unit_amount: Math.round(totals.total * 100),
          },
          quantity: 1,
        },
      ],
      // Redirection avec session_id pour vérification côté serveur
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/reservation`,
      metadata: {
        pdfUrl: publicUrl, // lu par /api/verify-session
        formula: clean(formula.name || formula.id),
        wedding_date: clean(weddingDate),
        bride_first_name: clean(firstName),
        bride_last_name: clean(lastName),
        couple_name: clean(coupleName),
        total_eur: String(totals.total),
        deposit_eur: String(totals.depositSuggested),
        remaining_eur: String(totals.remainingDayJ),
        selected_options: selectedOpts.join(", "),
        extras: extras.map((e) => `${clean(e.label)}:${Number(e.price)}`).join("|"),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("create-payment error:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}