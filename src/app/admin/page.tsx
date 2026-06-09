import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { Users, Images, FileText, MessageSquare, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const [
    { count: nbClients },
    { count: nbGaleries },
    { count: nbContratsEnAttente },
    { count: nbMessagesNonLus },
    { data: clientsRecents },
    { data: statsParStatut },
  ] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("galeries").select("*", { count: "exact", head: true }).eq("actif", true),
    supabase.from("contrats").select("*", { count: "exact", head: true }).eq("statut", "en_attente"),
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("lu", false).eq("auteur", "client"),
    supabase.from("clients").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("clients").select("statut"),
  ]);

  const statutCounts = (statsParStatut ?? []).reduce<Record<string, number>>((acc, c) => {
    acc[c.statut] = (acc[c.statut] ?? 0) + 1;
    return acc;
  }, {});

  const statutLabels: Record<string, { label: string; color: string }> = {
    prospect:  { label: "Prospects",   color: "bg-yellow-500" },
    confirme:  { label: "Confirmés",   color: "bg-blue-500" },
    en_cours:  { label: "En cours",    color: "bg-purple-500" },
    livre:     { label: "Livrés",      color: "bg-[#C9A84C]" },
    termine:   { label: "Terminés",    color: "bg-green-500" },
  };

  const stats = [
    { label: "Clients total", value: nbClients ?? 0, icon: Users, href: "/admin/clients" },
    { label: "Galeries actives", value: nbGaleries ?? 0, icon: Images, href: "/admin/galeries" },
    { label: "Contrats à signer", value: nbContratsEnAttente ?? 0, icon: FileText, href: "/admin/contrats", alert: (nbContratsEnAttente ?? 0) > 0 },
    { label: "Messages non lus", value: nbMessagesNonLus ?? 0, icon: MessageSquare, href: "/admin/messages", alert: (nbMessagesNonLus ?? 0) > 0 },
  ];

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="text-xs tracking-[0.4em] uppercase text-[#C9A84C]/50 mb-1">Back-office</p>
        <h1 className="text-2xl font-bold text-[#FAFAFA]" style={{ fontFamily: "var(--font-playfair)" }}>
          Tableau de bord
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="glass p-5 hover:border-[#C9A84C]/40 transition-all border border-[#C9A84C]/15 group relative">
            {s.alert && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            )}
            <div className="flex items-center gap-2 mb-3">
              <s.icon size={14} className="text-[#C9A84C]/60" />
              <span className="text-[10px] tracking-widest uppercase text-[#FAFAFA]/30">{s.label}</span>
            </div>
            <div className="text-3xl font-bold text-[#FAFAFA]" style={{ fontFamily: "var(--font-playfair)" }}>
              {s.value}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clients récents */}
        <div className="glass border border-[#C9A84C]/15 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#C9A84C]/10">
            <h2 className="text-xs tracking-[0.3em] uppercase text-[#C9A84C]/60 font-medium">
              Derniers clients
            </h2>
            <Link href="/admin/clients" className="text-xs text-[#C9A84C]/40 hover:text-[#C9A84C] transition-colors">
              Voir tout →
            </Link>
          </div>
          <div className="divide-y divide-[#C9A84C]/10">
            {clientsRecents && clientsRecents.length > 0 ? clientsRecents.map((c) => (
              <Link
                key={c.id}
                href={`/admin/clients/${c.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-[#C9A84C]/5 transition-colors group"
              >
                <div>
                  <div className="text-sm text-[#FAFAFA]/80 group-hover:text-[#FAFAFA] transition-colors">
                    {c.prenom_marie1} & {c.prenom_marie2}
                  </div>
                  <div className="text-xs text-[#FAFAFA]/30 mt-0.5">
                    {new Date(c.date_mariage).toLocaleDateString("fr-FR")} · {c.formule}
                  </div>
                </div>
                <div className={`text-[10px] px-2 py-1 uppercase tracking-widest font-medium ${
                  c.statut === "confirme" ? "text-blue-400 bg-blue-400/10" :
                  c.statut === "livre" ? "text-[#C9A84C] bg-[#C9A84C]/10" :
                  c.statut === "termine" ? "text-green-400 bg-green-400/10" :
                  "text-yellow-400 bg-yellow-400/10"
                }`}>
                  {c.statut}
                </div>
              </Link>
            )) : (
              <div className="px-5 py-8 text-center text-[#FAFAFA]/20 text-sm">
                Aucun client pour l&apos;instant
              </div>
            )}
          </div>
        </div>

        {/* Répartition par statut */}
        <div className="glass border border-[#C9A84C]/15">
          <div className="px-5 py-4 border-b border-[#C9A84C]/10">
            <h2 className="text-xs tracking-[0.3em] uppercase text-[#C9A84C]/60 font-medium">
              Répartition dossiers
            </h2>
          </div>
          <div className="p-5 space-y-3">
            {Object.entries(statutLabels).map(([key, { label, color }]) => {
              const count = statutCounts[key] ?? 0;
              const total = nbClients ?? 1;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#FAFAFA]/50">{label}</span>
                    <span className="text-[#FAFAFA]/30">{count}</span>
                  </div>
                  <div className="h-1 bg-[#FAFAFA]/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
