import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session ID manquant" },
      { status: 400 }
    );
  }

  try {
    // 1. Récupérer les données de la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Paiement non confirmé" },
        { status: 400 }
      );
    }

    // 2. Construire l'URL du PDF dans Supabase
    const fileName = `${sessionId}.pdf`;
    
    // 🔧 VÉRIFIER D'ABORD LE BUCKET "contrats" (utilisé par create-payment)
    let pdfUrl = null;
    
    // Essayer le bucket "contrats" en premier
    const { data: fileExistsContrats, error: checkErrorContrats } = await supabase.storage
      .from("contrats")
      .list("", { search: fileName });

    if (!checkErrorContrats && fileExistsContrats && fileExistsContrats.length > 0) {
      // Le fichier existe dans "contrats"
      const { data: publicUrlData } = supabase.storage
        .from("contrats")
        .getPublicUrl(fileName);
      
      pdfUrl = publicUrlData.publicUrl;
      console.log("📂 PDF trouvé dans 'contrats':", pdfUrl);
    } else {
      // Essayer le bucket "contracts" en fallback
      const { data: fileExistsContracts, error: checkErrorContracts } = await supabase.storage
        .from("contracts")
        .list("", { search: fileName });
      
      if (!checkErrorContracts && fileExistsContracts && fileExistsContracts.length > 0) {
        // Le fichier existe dans "contracts"
        const { data: publicUrlData } = supabase.storage
          .from("contracts")
          .getPublicUrl(fileName);
        
        pdfUrl = publicUrlData.publicUrl;
        console.log("📂 PDF trouvé dans 'contracts':", pdfUrl);
      } else {
        console.log("⚠️ PDF pas encore généré pour la session:", sessionId);
        console.log("❌ Erreur 'contrats':", checkErrorContrats);
        console.log("❌ Erreur 'contracts':", checkErrorContracts);
      }
    }

    // 3. Retourner les données de la session + URL du PDF
    return NextResponse.json({
      id: session.id,
      customer_email: session.customer_email,
      payment_status: session.payment_status,
      metadata: session.metadata || {},
      pdfUrl: pdfUrl, // 🎯 URL du PDF si disponible
    });

  } catch (error: any) {
    console.error("[verify-session] Erreur:", error.message);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}