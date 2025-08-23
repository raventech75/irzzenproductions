// app/api/verify-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID manquant' }, { status: 400 });
    }

    console.log('🔍 Vérification session:', sessionId);

    // Récupérer la session Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });
    }

    console.log('📋 Session récupérée:', {
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_email
    });

    // Préparer la réponse de base
    const responseData = {
      id: session.id,
      customer_email: session.customer_email,
      payment_status: session.payment_status,
      metadata: session.metadata || {},
      pdfUrl: undefined as string | undefined
    };

    // Si le paiement est réussi, chercher le PDF sur Supabase
    if (session.payment_status === 'paid') {
      try {
        // Le nom du fichier correspond au session ID (comme dans votre webhook)
        const fileName = `${session.id}.pdf`;
        
        console.log('🔍 Recherche du PDF sur Supabase:', fileName);
        
        // Vérifier si le fichier existe sur Supabase
        const { data: fileData, error: fileError } = await supabase.storage
          .from('contrats')
          .list('', {
            search: fileName
          });

        if (fileError) {
          console.error('❌ Erreur recherche fichier sur Supabase:', fileError);
        } else if (fileData && fileData.length > 0) {
          // Le fichier existe, récupérer l'URL publique
          const { data: publicUrlData } = supabase.storage
            .from('contrats')
            .getPublicUrl(fileName);
          
          responseData.pdfUrl = publicUrlData.publicUrl;
          console.log('✅ PDF trouvé sur Supabase:', publicUrlData.publicUrl);
          
        } else {
          console.log('⏳ PDF pas encore généré sur Supabase pour:', fileName);
          
          // Attendre un peu au cas où le webhook est encore en cours d'exécution
          console.log('🔄 Attente et nouvelle tentative...');
          await new Promise(resolve => setTimeout(resolve, 3000)); // 3 secondes
          
          // Réessayer une fois
          const { data: retryFileData, error: retryError } = await supabase.storage
            .from('contrats')
            .list('', { search: fileName });
            
          if (!retryError && retryFileData && retryFileData.length > 0) {
            const { data: publicUrlData } = supabase.storage
              .from('contrats')
              .getPublicUrl(fileName);
            
            responseData.pdfUrl = publicUrlData.publicUrl;
            console.log('✅ PDF trouvé après retry:', publicUrlData.publicUrl);
          } else {
            console.log('⚠️ PDF toujours pas disponible après retry');
            
            // ✨ NOUVEAU : Génération forcée automatique si PDF manquant
            console.log('🚀 Tentative de génération automatique du PDF...');
            
            try {
              // Appeler l'API force-pdf pour générer le PDF
              const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
              const forceResponse = await fetch(`${baseUrl}/api/force-pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: session.id })
              });
              
              if (forceResponse.ok) {
                const forceData = await forceResponse.json();
                if (forceData.success && forceData.pdfUrl) {
                  responseData.pdfUrl = forceData.pdfUrl;
                  console.log('✅ PDF généré automatiquement via force-pdf:', forceData.pdfUrl);
                } else {
                  console.log('⚠️ Force-pdf a répondu mais sans URL PDF:', forceData);
                }
              } else {
                console.error('❌ Erreur appel force-pdf:', forceResponse.status, await forceResponse.text());
              }
            } catch (forceError) {
              console.error('❌ Erreur lors de la génération forcée:', forceError);
            }
            
            // Vérifier l'état du bucket pour debug (seulement si PDF toujours pas généré)
            if (!responseData.pdfUrl) {
              const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
              if (bucketsError) {
                console.error('❌ Erreur listBuckets:', bucketsError);
              } else {
                console.log('📁 Buckets disponibles:', buckets?.map(b => b.name));
                
                // Lister tous les fichiers du bucket contrats
                const { data: allFiles } = await supabase.storage
                  .from('contrats')
                  .list('');
                console.log('📄 Fichiers dans le bucket contrats:', allFiles?.map(f => f.name));
              }
            }
          }
        }
        
      } catch (pdfError) {
        console.error('❌ Erreur vérification PDF sur Supabase:', pdfError);
        // On continue sans PDF, ce n'est pas bloquant pour l'affichage de la page
      }
    }

    return NextResponse.json(responseData);
    
  } catch (error: any) {
    console.error('❌ Erreur verify-session:', error);
    return NextResponse.json({ 
      error: error.message || 'Erreur serveur' 
    }, { status: 500 });
  }
}