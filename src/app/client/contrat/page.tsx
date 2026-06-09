import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientShell } from "@/components/client/ClientShell";
import { ContratViewer } from "./ContratViewer";

export default async function ContratPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client/login");

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: contrats } = await supabase
    .from("contrats")
    .select("*")
    .eq("client_id", client?.id ?? "")
    .order("created_at", { ascending: false });

  const nomClient = client
    ? `${client.prenom_marie1} & ${client.prenom_marie2}`
    : user.email ?? "Client";

  return (
    <ClientShell clientNom={nomClient}>
      <div className="mb-10">
        <p className="text-xs tracking-[0.4em] uppercase text-[#C4A5B5]/60 mb-2">Espace Client</p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1520]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Mon <span className="text-gradient-gold">contrat</span>
        </h1>
        <p className="text-[#1A1520]/40 text-sm mt-2">
          Signez et consultez votre contrat de prestation
        </p>
      </div>
      <ContratViewer contrats={contrats ?? []} clientNom={nomClient} />
    </ClientShell>
  );
}
