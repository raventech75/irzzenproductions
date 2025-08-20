// lib/storage.ts
import { supabaseAdmin } from "@/lib/supabase-admin";

const BUCKET = "contracts";

/** Essaie d'obtenir une URL publique (si le bucket est public) */
export function getPublicContractUrl(path: string): string | null {
  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return data?.publicUrl || null;
}

/** Crée une URL signée (bucket privé) */
export async function getSignedContractUrl(path: string, expiresInSec = 600): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresInSec);
  if (error) throw error;
  return data.signedUrl;
}

/** Upload le PDF dans Supabase Storage */
export async function saveContractPDF(args: {
  pdf: Uint8Array | Buffer;     // le contenu du PDF
  filename: string;             // ex: "IRZZEN-Contrat-xyz.pdf"
}): Promise<{ path: string; publicUrl: string | null }> {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const safeName = args.filename.replace(/\s+/g, "_");
  const path = `${y}/${m}/${d}/${safeName}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, args.pdf, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) throw error;

  // Si bucket public, on renvoie l'URL publique
  const publicUrl = getPublicContractUrl(path);
  return { path, publicUrl };
}

/** Alias rétro-compatible : certaines routes attendent uploadContractPDF */
export const uploadContractPDF = saveContractPDF;