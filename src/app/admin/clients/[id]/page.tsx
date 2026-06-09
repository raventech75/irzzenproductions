import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { ClientDetailActions } from "./ClientDetailActions";
import { ChatBox } from "@/components/chat/ChatBox";
import { ArrowLeft, Mail, Phone, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [
    { data: client },
    { data: galeries },
    { data: contrats },
    { data: messages },
  ] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).single(),
    supabase.from("galeries").select("*").eq("client_id", id).order("created_at", { ascending: false }),
    supabase.from("contrats").select("*").eq("client_id", id).order("created_at", { ascending: false }),
    supabase.from("messages").select("*").eq("client_id", id).order("created_at", { ascending: true }),
  ]);

  if (!client) notFound();

  return (
    <AdminShell>
      <div className="mb-6">
        <Link href="/admin/clients" className="flex items-center gap-1.5 text-xs text-[#1A1520]/30 hover:text-[#C4A5B5]/60 transition-colors mb-4">
          <ArrowLeft size={12} /> Retour aux clients
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1520]" style={{ fontFamily: "var(--font-playfair)" }}>
              {client.prenom_marie1} & {client.prenom_marie2}
            </h1>
            <p className="text-[#1A1520]/40 text-sm mt-1">
              Créé le {new Date(client.created_at).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <ClientDetailActions clientId={id} statutActuel={client.statut} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne infos */}
        <div className="space-y-5">
          {/* Infos générales */}
          <div className="glass border border-[#C4A5B5]/15 p-5">
            <h2 className="text-xs tracking-[0.3em] uppercase text-[#C4A5B5]/50 mb-4">Informations</h2>
            <ul className="space-y-3">
              {[
                { icon: Mail, label: "Email", value: client.email },
                { icon: Phone, label: "Téléphone", value: client.telephone ?? "—" },
                { icon: Calendar, label: "Mariage", value: new Date(client.date_mariage).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) },
                { icon: MapPin, label: "Lieu", value: client.lieu ?? "—" },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <item.icon size={13} className="text-[#C4A5B5]/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-[#1A1520]/25 uppercase tracking-wide">{item.label}</div>
                    <div className="text-sm text-[#1A1520]/70">{item.value}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Prestation */}
          <div className="glass border border-[#C4A5B5]/15 p-5">
            <h2 className="text-xs tracking-[0.3em] uppercase text-[#C4A5B5]/50 mb-4">Prestation</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#1A1520]/50">Formule</span>
                <span className="text-[#1A1520]/80 capitalize font-medium">{client.formule}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1A1520]/50">Total TTC</span>
                <span className="text-[#C4A5B5] font-bold">{client.total_ttc.toLocaleString("fr-FR")} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1A1520]/50">Acompte</span>
                <span className={client.acompte_verse ? "text-green-400" : "text-yellow-400"}>
                  {client.acompte_verse ? "Versé ✓" : "En attente"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes internes */}
          {client.notes_internes && (
            <div className="glass border border-[#C4A5B5]/15 p-5">
              <h2 className="text-xs tracking-[0.3em] uppercase text-[#C4A5B5]/50 mb-3">Notes internes</h2>
              <p className="text-sm text-[#1A1520]/50 leading-relaxed">{client.notes_internes}</p>
            </div>
          )}
        </div>

        {/* Colonne galeries + contrats */}
        <div className="lg:col-span-2 space-y-5">
          {/* Galeries */}
          <div className="glass border border-[#C4A5B5]/15 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#C4A5B5]/10">
              <h2 className="text-xs tracking-[0.3em] uppercase text-[#C4A5B5]/50">Galeries ({galeries?.length ?? 0})</h2>
              <Link href={`/admin/galeries/nouvelle?client=${id}`} className="text-xs text-[#C4A5B5]/50 hover:text-[#C4A5B5] transition-colors">
                + Ajouter
              </Link>
            </div>
            <div className="divide-y divide-[#C4A5B5]/8">
              {galeries && galeries.length > 0 ? galeries.map((g) => (
                <div key={g.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-sm text-[#1A1520]/70">{g.nom}</div>
                    <div className="text-xs text-[#1A1520]/30 mt-0.5">
                      {g.nb_fichiers} fichiers · {(g.taille_totale / 1024 / 1024 / 1024).toFixed(1)} Go
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-0.5 uppercase tracking-widest ${g.actif ? "text-green-400 bg-green-400/10" : "text-[#1A1520]/20 bg-[#F0EBE8]/5"}`}>
                      {g.actif ? "Actif" : "Inactif"}
                    </span>
                    <Link href={`/admin/galeries/${g.id}`} className="text-xs text-[#C4A5B5]/40 hover:text-[#C4A5B5] transition-colors">
                      Gérer →
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="px-5 py-6 text-center text-[#1A1520]/20 text-xs">Aucune galerie</div>
              )}
            </div>
          </div>

          {/* Contrats */}
          <div className="glass border border-[#C4A5B5]/15 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#C4A5B5]/10">
              <h2 className="text-xs tracking-[0.3em] uppercase text-[#C4A5B5]/50">Contrats ({contrats?.length ?? 0})</h2>
              <Link href={`/admin/contrats/nouveau?client=${id}`} className="text-xs text-[#C4A5B5]/50 hover:text-[#C4A5B5] transition-colors">
                + Créer
              </Link>
            </div>
            <div className="divide-y divide-[#C4A5B5]/8">
              {contrats && contrats.length > 0 ? contrats.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-sm text-[#1A1520]/70">{c.titre}</div>
                    <div className="text-xs text-[#1A1520]/30 mt-0.5">
                      {new Date(c.created_at).toLocaleDateString("fr-FR")}
                      {c.signe_le && ` · Signé le ${new Date(c.signe_le).toLocaleDateString("fr-FR")}`}
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 uppercase tracking-widest ${
                    c.statut === "signe" ? "text-green-400 bg-green-400/10" :
                    c.statut === "expire" ? "text-red-400 bg-red-400/10" :
                    "text-yellow-400 bg-yellow-400/10"
                  }`}>
                    {c.statut === "en_attente" ? "En attente" : c.statut}
                  </span>
                </div>
              )) : (
                <div className="px-5 py-6 text-center text-[#1A1520]/20 text-xs">Aucun contrat</div>
              )}
            </div>
          </div>

          {/* Messagerie */}
          <div className="glass border border-[#C4A5B5]/15 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#C4A5B5]/10">
              <h2 className="text-xs tracking-[0.3em] uppercase text-[#C4A5B5]/50">
                Messagerie
              </h2>
            </div>
            <ChatBox
              clientId={id}
              auteur="admin"
              initialMessages={(messages ?? []) as any}
            />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
