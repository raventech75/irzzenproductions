// app/api/test-pdf/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Utilise votre client existant
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Copiez votre fonction de génération PDF du webhook ici
async function createTestPDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // PDF simple pour test
  page.drawText("TEST PDF - IRZZEN PRODUCTIONS", {
    x: 50,
    y: 800,
    size: 20,
    font: fontBold,
    color: rgb(1, 0.6, 0.4),
  });
  
  page.drawText("Ce PDF a été généré pour tester la connexion Supabase", {
    x: 50,
    y: 770,
    size: 12,
    font: font,
  });
  
  page.drawText(`Date de test: ${new Date().toLocaleString('fr-FR')}`, {
    x: 50,
    y: 740,
    size: 10,
    font: font,
  });

  return await pdfDoc.save();
}

export async function GET() {
  try {
    console.log("🧪 Test de génération PDF...");

    // 1. Tester la connexion Supabase
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error("❌ Erreur connexion Supabase:", bucketsError);
      return NextResponse.json({ 
        error: "Erreur connexion Supabase", 
        details: bucketsError 
      }, { status: 500 });
    }
    
    console.log("✅ Connexion Supabase OK");
    console.log("📁 Buckets disponibles:", buckets?.map(b => b.name));
    
    // 2. Vérifier le bucket 'contrats'
    const contractsBucket = buckets?.find(b => b.name === 'contrats');
    if (!contractsBucket) {
      return NextResponse.json({ 
        error: "Bucket 'contrats' introuvable", 
        availableBuckets: buckets?.map(b => b.name) 
      }, { status: 404 });
    }
    
    console.log("✅ Bucket 'contrats' trouvé");

    // 3. Générer un PDF de test
    const pdfBytes = await createTestPDF();
    console.log("📄 PDF de test généré, taille:", pdfBytes.length, "bytes");

    // 4. Upload sur Supabase
    const fileName = `test-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("contrats")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ Erreur upload:", uploadError);
      return NextResponse.json({ 
        error: "Erreur upload Supabase", 
        details: uploadError 
      }, { status: 500 });
    }

    console.log("✅ Upload réussi:", uploadData?.path);

    // 5. Récupérer l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from("contrats")
      .getPublicUrl(fileName);

    console.log("🔗 URL publique:", publicUrlData.publicUrl);

    // 6. Lister tous les fichiers du bucket pour debug
    const { data: allFiles } = await supabase.storage
      .from('contrats')
      .list('');
    
    return NextResponse.json({
      success: true,
      message: "PDF de test généré avec succès !",
      pdfUrl: publicUrlData.publicUrl,
      fileName: fileName,
      buckets: buckets?.map(b => b.name),
      filesInBucket: allFiles?.map(f => f.name) || []
    });
    
  } catch (error: any) {
    console.error('❌ Erreur test PDF:', error);
    return NextResponse.json({ 
      error: error.message || 'Erreur test PDF',
      stack: error.stack
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId } = body;
    
    console.log("🧪 Test génération PDF pour session:", sessionId);

    // Données de test complètes
    const testMetadata = {
      couple_name: "Marie & Pierre DUPONT",
      bride_first_name: "Marie",
      bride_last_name: "DUPONT", 
      groom_first_name: "Pierre",
      groom_last_name: "DUPONT",
      email: "marie.pierre@example.com",
      wedding_date: "2024-06-15",
      formula: "Formule Premium",
      formula_description: "Expérience photo-vidéo complète avec équipe dédiée",
      total_eur: "2200",
      deposit_eur: "330", 
      remaining_eur: "1870",
      selected_options: "Drone, Album premium, Retouches avancées",
      extras: "Heure supplémentaire:120|Projection jour J:300",
      ...body.metadata
    };

    // Utiliser votre fonction de génération PDF du webhook
    // Je vais simuler la création d'un PDF avec ces données
    const pdfBytes = await createTestPDF();
    
    // Upload
    const fileName = sessionId ? `${sessionId}.pdf` : `test-manual-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("contrats")
      .upload(fileName, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("contrats")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      pdfUrl: publicUrlData.publicUrl,
      fileName: fileName,
      metadata: testMetadata
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}