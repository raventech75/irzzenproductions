// lib/storage.ts
import { supabaseAdmin } from "@/lib/supabase-admin";

/** Nom canonique du bucket stockage des contrats */
export const CONTRACTS_BUCKET = "contracts";

/**
 * Vérifie que le bucket `contracts` existe, sinon le crée.
 * Par défaut: public=true pour obtenir un lien public direct.
 * Si tu préfères privé, passe publicBucket=false et n'utilise que des URLs signées.
 */
export async function ensureContractsBucket(publicBucket = true) {
  const { data: buckets, error: listErr } = await supabaseAdmin.storage.listBuckets();
  if (listErr) throw listErr;

  const exists = buckets?.some((b) => b.name === CONTRACTS_BUCKET);
  if (!exists) {
    const { error: createErr } = await supabaseAdmin.storage.createBucket(CONTRACTS_BUCKET, {
      public: publicBucket,
      fileSizeLimit: "50MB",
    });
    if (createErr) throw createErr;
  }
}

/**
 * Upload d'un PDF dans le bucket `contracts`.
 * @param path ex: "IRZZEN_1724140799123_Dupont.pdf"  (⚠️ pas de préfixe "contracts/")
 * @returns { path, publicUrl }
 */
export async function uploadContractPDF(path: string, bytes: Uint8Array) {
  await ensureContractsBucket(true); // public par défaut
  const { error: upErr } = await supabaseAdmin.storage
    .from(CONTRACTS_BUCKET)
    .upload(path, bytes, { contentType: "application/pdf", upsert: true });

  if (upErr) throw upErr;

  const { data } = supabaseAdmin.storage.from(CONTRACTS_BUCKET).getPublicUrl(path);
  return { path, publicUrl: data?.publicUrl || null };
}

/** URL publique (si bucket public) — sinon renvoie null. */
export function getPublicContractUrl(path: string): string | null {
  const { data } = supabaseAdmin.storage.from(CONTRACTS_BUCKET).getPublicUrl(path);
  return data?.publicUrl || null;
}

/**
 * Génère une URL signée (temporaire) pour un fichier du bucket `contracts`.
 * @param expiresSec durée en secondes (par défaut 3600 = 1h)
 */
export async function getSignedContractUrl(path: string, expiresSec = 3600) {
  const { data, error } = await supabaseAdmin.storage
    .from(CONTRACTS_BUCKET)
    .createSignedUrl(path, expiresSec);
  if (error || !data?.signedUrl) throw error || new Error("No signed URL");
  return data.signedUrl;
}

/**
 * Variante générique (compat pour anciens imports qui appellent getSignedUrl(bucket, path, ...))
 */
export async function getSignedUrl(bucket: string, path: string, expiresSec = 3600) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresSec);
  if (error || !data?.signedUrl) throw error || new Error("No signed URL");
  return data.signedUrl;
}

/**
 * ✅ Helper de compatibilité: `saveContractPDF(...)`
 * Certains fichiers de ton projet appellent cette fonction avec des signatures différentes.
 * On accepte:
 *  - { filename, pdf }
 *  - { path, bytes }
 *  - { bookingId?, filename, pdf }
 *  - { bookingId?, path, bytes }
 *
 * Retourne: { path, publicUrl }
 */
export async function saveContractPDF(arg:
  | { filename: string; pdf: Uint8Array | Buffer; bookingId?: string | number }
  | { path: string; bytes: Uint8Array | Buffer; bookingId?: string | number }
) {
  // Normalisation des paramètres
  // @ts-expect-error — on teste la présence des clés au runtime
  const path: string = arg.path ?? arg.filename;
  if (!path) throw new Error("saveContractPDF: `path`/`filename` manquant");

  // @ts-expect-error — idem
  const rawBytes: Uint8Array | Buffer = arg.bytes ?? arg.pdf;
  if (!rawBytes) throw new Error("saveContractPDF: `bytes`/`pdf` manquant");

  const bytes = rawBytes instanceof Uint8Array ? rawBytes : new Uint8Array(rawBytes);

  // Upload via helper canonique
  return uploadContractPDF(path, bytes);
}