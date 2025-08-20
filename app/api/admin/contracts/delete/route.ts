import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/storage";

export async function POST(req: Request) {
  const { id, path } = await req.json();

  try {
    const admin = supabaseAdmin();

    // Supprimer fichier du Storage
    const { error: delErr } = await admin.storage.from("contracts").remove([path]);
    if (delErr) throw new Error(delErr.message);

    // Supprimer ligne SQL
    const supabase = supabaseServer();
    const { error } = await supabase.from("contracts").delete().eq("id", id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}