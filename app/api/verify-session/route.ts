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

    // 2. Récupérer le nom du fichier depuis les métadonnées
    const metadata = session.metadata || {};
    const pdfFileName = metadata.pdf_filename;
    
    console.log("🔍 Recherche PDF avec nom:", pdfFileName || "non défini");
    console.log("📋 Toutes les métadonnées:", metadata);

    let pdfUrl = null;
    
    if (pdfFileName && pdfFileName.trim() !== "") {
      // 🎯 NOUVEAU : Utiliser le nom personnalisé du fichier
      console.log("🎯 Utilisation du nom personnalisé:", pdfFileName);
      
      // Vérifier si le fichier existe en essayant de le télécharger (head only)
      const { data: fileData, error: downloadError } = await supabase.storage
        .from("contrats")
        .download(pdfFileName);
      
      if (!downloadError && fileData) {
        // Le fichier existe, générer l'URL publique
        const { data: publicUrlData } = supabase.storage
          .from("contrats")
          .getPublicUrl(pdfFileName);
        
        pdfUrl = publicUrlData.publicUrl;
        console.log("✅ PDF trouvé avec nom personnalisé:", pdfUrl);
      } else {
        console.log("⚠️ PDF avec nom personnalisé introuvable:", pdfFileName);
        console.log("❌ Erreur download:", downloadError?.message);
      }
    } else {
      console.log("⚠️ Nom de fichier personnalisé vide ou non défini");
    }
    
    // 🔄 FALLBACK : Si pas trouvé avec le nom personnalisé, essayer l'ancien système
    if (!pdfUrl) {
      console.log("🔄 Fallback vers l'ancien système (session ID)");
      const legacyFileName = `${sessionId}.pdf`;
      
      // Essayer le bucket "contrats" en premier
      const { data: fileDataContrats, error: downloadErrorContrats } = await supabase.storage
        .from("contrats")
        .download(legacyFileName);
      
      if (!downloadErrorContrats && fileDataContrats) {
        const { data: publicUrlData } = supabase.storage
          .from("contrats")
          .getPublicUrl(legacyFileName);
        
        pdfUrl = publicUrlData.publicUrl;
        console.log("📂 PDF trouvé dans 'contrats' (fallback):", pdfUrl);
      } else {
        console.log("⚠️ PDF non trouvé dans 'contrats', test 'contracts'...");
        
        // Essayer le bucket "contracts" en fallback
        const { data: fileDataContracts, error: downloadErrorContracts } = await supabase.storage
          .from("contracts")
          .download(legacyFileName);
        
        if (!downloadErrorContracts && fileDataContracts) {
          const { data: publicUrlData } = supabase.storage
            .from("contracts")
            .getPublicUrl(legacyFileName);
          
          pdfUrl = publicUrlData.publicUrl;
          console.log("📂 PDF trouvé dans 'contracts' (fallback):", pdfUrl);
        } else {
          console.log("❌ PDF introuvable dans les deux buckets");
          console.log("❌ Erreur 'contrats':", downloadErrorContrats?.message);
          console.log("❌ Erreur 'contracts':", downloadErrorContracts?.message);
        }
      }
    }

    // 3. Retourner les données de la session + URL du PDF
    return NextResponse.json({
      id: session.id,
      customer_email: session.customer_email,
      payment_status: session.payment_status,
      metadata: session.metadata || {},
      pdfUrl: pdfUrl, // 🎯 URL du PDF si disponible
      pdfFileName: pdfFileName, // 🎯 Nom du fichier pour info
    });

  } catch (error: any) {
    console.error("[verify-session] Erreur:", error.message);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}