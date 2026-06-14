import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendBienvenueClient } from "@/lib/email";

function genererCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { clientId } = await req.json();

  const { data: client } = await supabase
    .from("clients")
    .select("prenom_marie1, prenom_marie2, email")
    .eq("id", clientId)
    .single();

  if (!client) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });

  const adminSupabase = createAdminClient();
  const nomClient = `${client.prenom_marie1} & ${client.prenom_marie2}`;
  const motDePasse = genererCode();

  // Récupérer l'utilisateur existant s'il existe
  const { data: { users } } = await adminSupabase.auth.admin.listUsers();
  const existingUser = users.find((u) => u.email === client.email);

  let authUserId: string;

  if (existingUser) {
    authUserId = existingUser.id;
    await adminSupabase.auth.admin.updateUserById(authUserId, { password: motDePasse });
  } else {
    const { data: created, error: createError } = await adminSupabase.auth.admin.createUser({
      email: client.email,
      password: motDePasse,
      email_confirm: true,
    });
    if (createError || !created.user) return NextResponse.json({ error: createError?.message }, { status: 500 });
    authUserId = created.user.id;
  }

  // Lier le compte Auth à la fiche client
  await (supabase.from("clients") as any)
    .update({ user_id: authUserId })
    .eq("id", clientId);

  await sendBienvenueClient({ nomClient, email: client.email, motDePasse });

  return NextResponse.json({ success: true });
}
