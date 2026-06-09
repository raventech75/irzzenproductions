import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { client_id, contenu, auteur } = await req.json();
  if (!client_id || !contenu || !auteur) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const { data, error } = await (supabase.from("messages") as any).insert({
    client_id,
    contenu,
    auteur,
    lu: false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: data });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { client_id, auteur } = await req.json();

  await (supabase.from("messages") as any)
    .update({ lu: true })
    .eq("client_id", client_id)
    .eq("auteur", auteur)
    .eq("lu", false);

  return NextResponse.json({ success: true });
}
