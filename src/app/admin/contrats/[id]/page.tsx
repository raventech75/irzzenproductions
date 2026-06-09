import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { EnvoyerContratButton } from "./ContratActions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminContratDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: contrat } = await supabase
    .from("contrats")
    .select(`*, clients(prenom_marie1, prenom_marie2, email)`)
    .eq("id", id)
    .single();

  if (!contrat) notFound();

  const client = (contrat as any).clients;

  const statutLabel: Record<string, string> = {
    en_attente: "En attente",
    signe: "Signé",
    expire: "Expiré",
  };

  const statutColor: Record<string, string> = {
    en_attente: "text-yellow-400 bg-yellow-400/10",
    signe: "text-green-400 bg-green-400/10",
    expire: "text-red-400 bg-red-400/10",
  };

  return (
    <AdminShell>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/contrats" className="text-[#1A1520]/30 hover:text-[#C4A5B5] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <p className="text-xs tracking-[0.4em] uppercase text-[#C4A5B5]/50 mb-1">Contrat</p>
          <h1 className="text-2xl font-bold text-[#1A1520]" style={{ fontFamily: "var(--font-playfair)" }}>
            {contrat.titre}
          </h1>
        </div>
        <EnvoyerContratButton contratId={id} statut={contrat.statut} />
      </div>

      {/* Infos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Client", value: `${client?.prenom_marie1} & ${client?.prenom_marie2}` },
          { label: "Email", value: client?.email },
          { label: "Créé le", value: new Date(contrat.created_at).toLocaleDateString("fr-FR") },
          { label: "Statut", value: statutLabel[contrat.statut] ?? contrat.statut },
          ...(contrat.date_signature ? [{ label: "Signé le", value: new Date(contrat.date_signature).toLocaleDateString("fr-FR") }] : []),
          ...(contrat.nom_signataire ? [{ label: "Signataire", value: contrat.nom_signataire }] : []),
        ].map((item) => (
          <div key={item.label} className="glass p-4 border border-[#C4A5B5]/10">
            <div className="text-[10px] tracking-widest uppercase text-[#1A1520]/25 mb-1">{item.label}</div>
            <div className="text-sm text-[#1A1520]/80">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Contenu du contrat */}
      <div className="glass border border-[#C4A5B5]/15 p-6">
        <div className="text-xs tracking-widest uppercase text-[#1A1520]/25 mb-4">Contenu du contrat</div>
        <div className="text-sm text-[#1A1520]/60 whitespace-pre-wrap leading-relaxed">
          {contrat.contenu ?? "Aucun contenu renseigné."}
        </div>
      </div>
    </AdminShell>
  );
}
