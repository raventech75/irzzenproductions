import { NextRequest, NextResponse } from "next/server";
import { buildBookingPdf } from "@/lib/pdf";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, metadata } = body;

    if (!sessionId || !metadata) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    console.log('📄 Génération PDF pour session:', sessionId);

    // Créer le dossier public/contracts s'il n'existe pas
    const contractsDir = join(process.cwd(), 'public', 'contracts');
    if (!existsSync(contractsDir)) {
      mkdirSync(contractsDir, { recursive: true });
    }

    // Nom du fichier PDF
    const fileName = metadata.pdf_filename || `contrat-${sessionId}.pdf`;
    const filePath = join(contractsDir, fileName);
    const publicUrl = `/contracts/${fileName}`;

    // Vérifier si le PDF existe déjà
    if (existsSync(filePath)) {
      console.log('✅ PDF déjà existant:', publicUrl);
      return NextResponse.json({ 
        success: true, 
        pdfUrl: publicUrl,
        message: 'PDF déjà généré'
      });
    }

    // Préparer les données pour le PDF
    const pdfData = {
      couple_name: metadata.couple_name,
      bride_first_name: metadata.bride_first_name,
      bride_last_name: metadata.bride_last_name,
      groom_first_name: metadata.groom_first_name,
      groom_last_name: metadata.groom_last_name,
      email: metadata.email,
      
      wedding_date: metadata.wedding_date,
      ceremony_address: [metadata.ceremonyLocation, metadata.ceremonyTime].filter(Boolean).join(' - '),
      ceremony_time: metadata.ceremonyTime,
      reception_address: [metadata.receptionLocation, metadata.receptionTime].filter(Boolean).join(' - '),
      reception_time: metadata.receptionTime,
      notes: [metadata.schedule, metadata.specialRequests].filter(Boolean).join('\n\n'),
      
      formula: metadata.formula,
      formula_description: metadata.formula_description,
      total_eur: metadata.total_eur,
      deposit_eur: metadata.deposit_eur,
      remaining_eur: metadata.remaining_eur,
      selected_options: metadata.selected_options,
      extras: metadata.extras,
    };

    console.log('🔧 Données PDF:', pdfData);

    // Générer le PDF
    const pdfBytes = await buildBookingPdf(pdfData);
    
    // Sauvegarder le fichier
    writeFileSync(filePath, pdfBytes);
    
    console.log('✅ PDF généré et sauvegardé:', filePath);
    
    return NextResponse.json({ 
      success: true, 
      pdfUrl: publicUrl,
      fileName: fileName
    });
    
  } catch (error: any) {
    console.error('❌ Erreur génération PDF:', error);
    return NextResponse.json({ 
      error: error.message || 'Erreur génération PDF' 
    }, { status: 500 });
  }
}