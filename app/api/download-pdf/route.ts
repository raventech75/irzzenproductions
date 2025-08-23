import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('file');
    
    if (!fileName) {
      return NextResponse.json({ error: 'Nom de fichier manquant' }, { status: 400 });
    }

    const filePath = join(process.cwd(), 'public', 'contracts', fileName);
    
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'Fichier introuvable' }, { status: 404 });
    }

    const fileBuffer = readFileSync(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
    
  } catch (error: any) {
    console.error('❌ Erreur téléchargement PDF:', error);
    return NextResponse.json({ 
      error: error.message || 'Erreur téléchargement' 
    }, { status: 500 });
  }
}