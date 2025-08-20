import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export async function saveContractPDF({
  bookingId,
  pdf,
  filename,
}: {
  bookingId: string;
  pdf: Buffer;
  filename: string;
}) {
  const supabase = supabaseAdmin();
  const path = `contracts/${bookingId}/${filename}`;

  const { error } = await supabase.storage
    .from("contracts")
    .upload(path, pdf, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) throw new Error(error.message);

  // petite récupération de taille
  return { path, bytes: pdf.byteLength };
}

export async function getSignedUrl(path: string, seconds = 600) {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase.storage
    .from("contracts")
    .createSignedUrl(path, seconds);

  if (error) throw new Error(error.message);
  return data.signedUrl;
}