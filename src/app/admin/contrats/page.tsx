import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminContratsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: contrats } = await supabase
    .from("contrats")
    .select(`*, clients(prenom_marie1, prenom_marie2)`)
    .order("created_at", { ascending: false });

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-[#C4A5B5]/50 mb-1">Back-office</p>
          <h1 className="text-2xl font-bold text-[#1A1520]" style={{ fontFamily: "var(--font-playfair)" }}>
            Contrats
          </h1>
        </div>
        <Link
          href="/admin/contrats/nouveau"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C4A5B5] text-[#13111A] text-xs font-semibold tracking-widest uppercase hover:bg-[#DEC8D6] transition-colors"
        >
          <Plus size={13} /> Nouveau contrat
        </Link>
      </div>

      <div className="glass border border-[#C4A5B5]/15 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#C4A5B5]/10 text-[10px] tracking-widest uppercase text-[#1A1520]/25">
          <div className="col-span-4">Titre</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2">Créé le</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-1" />
        </div>
        <div className="divide-y divide-[#C4A5B5]/8">
          {contrats && contrats.length > 0 ? (contrats as any[]).map((c) => (
            <div key={c.id} className="grid grid-cols-2 md:grid-cols-12 gap-4 items-center px-5 py-3.5 hover:bg-[#C4A5B5]/3 transition-colors">
              <div className="md:col-span-4 text-sm text-[#1A1520]/80 font-medium">{c.titre}</div>
              <div className="md:col-span-3 text-sm text-[#1A1520]/50">
                {c.clients?.prenom_marie1} & {c.clients?.prenom_marie2}
              </div>
              <div className="md:col-span-2 text-sm text-[#1A1520]/40">
                {new Date(c.created_at).toLocaleDateString("fr-FR")}
              </div>
              <div className="md:col-span-2">
                <span className={`text-[10px] px-2 py-0.5 uppercase tracking-widest font-medium ${
                  c.statut === "signe" ? "text-green-400 bg-green-400/10" :
                  c.statut === "expire" ? "text-red-400 bg-red-400/10" :
                  "text-yellow-400 bg-yellow-400/10"
                }`}>
                  {c.statut === "en_attente" ? "En attente" : c.statut}
                </span>
              </div>
              <div className="md:col-span-1 flex justify-end">
                <Link href={`/admin/contrats/${c.id}`} className="text-xs text-[#C4A5B5]/40 hover:text-[#C4A5B5] transition-colors">
                  Voir →
                </Link>
              </div>
            </div>
          )) : (
            <div className="px-5 py-12 text-center text-[#1A1520]/20 text-sm">Aucun contrat</div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
