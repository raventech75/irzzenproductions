import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientShell } from "@/components/client/ClientShell";
import { GalerieViewer } from "./GalerieViewer";

export default async function GalerieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client/login");

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: galerie } = await supabase
    .from("galeries")
    .select("*")
    .eq("id", id)
    .eq("client_id", client?.id ?? "")
    .single();

  if (!galerie) notFound();

  const { data: fichiers } = await supabase
    .from("fichiers")
    .select("*")
    .eq("galerie_id", id)
    .order("created_at", { ascending: true });

  const nomClient = client
    ? `${client.prenom_marie1} & ${client.prenom_marie2}`
    : user.email ?? "Client";

  return (
    <ClientShell clientNom={nomClient}>
      <GalerieViewer galerie={galerie} fichiers={fichiers ?? []} />
    </ClientShell>
  );
}
