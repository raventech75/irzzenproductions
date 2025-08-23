import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Missing path" }, { status: 400 });

  const { data, error } = await supabaseAdmin.storage
    .from("contrats")
    .createSignedUrl(path, 60 * 60); // 1h

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: error?.message || "Cannot sign URL" }, { status: 500 });
  }

  // Redirige directement vers l’URL signée pour téléchargement/visualisation
  return NextResponse.redirect(data.signedUrl);
}