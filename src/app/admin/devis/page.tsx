import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import Link from "next/link";
import { Plus } from "lucide-react";

const statutStyle: Record<string, string> = {
  brouillon: "text-[#261E14]/40 bg-[#261E14]/5",
  envoye:    "text-blue-700 bg-blue-50",
  accepte:   "text-green-700 bg-green-50",
  refuse:    "text-red-600 bg-red-50",
  expire:    "text-orange-600 bg-orange-50",
};
const statutLabel: Record<string, string> = {
  brouillon: "Brouillon",
  envoye:    "Envoyé",
  accepte:   "Accepté",
  refuse:    "Refusé",
  expire:    "Expiré",
};

export default async function AdminDevisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const adminSupabase = createAdminClient();
  const { data: devis } = await (adminSupabase as any)
    .from("devis")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-[#E8A87C]/50 mb-1">Back-office</p>
          <h1 className="text-2xl font-bold text-[#261E14]" style={{ fontFamily: "var(--font-playfair)" }}>
            Devis
          </h1>
        </div>
        <Link
          href="/admin/devis/nouveau"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E8A87C] text-[#261E14] text-xs font-semibold tracking-widest uppercase hover:bg-[#d4905e] transition-colors"
        >
          <Plus size={13} /> Nouveau devis
        </Link>
      </div>

      <div className="glass border border-[#E8A87C]/15 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#E8A87C]/10 text-[10px] tracking-widest uppercase text-[#261E14]/25">
          <div className="col-span-1">N°</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-3">Objet</div>
          <div className="col-span-2">Total TTC</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-1" />
        </div>

        <div className="divide-y divide-[#E8A87C]/8">
          {devis && devis.length > 0 ? devis.map((d: any) => (
            <div key={d.id} className="grid grid-cols-2 md:grid-cols-12 gap-4 items-center px-5 py-3.5 hover:bg-[#E8A87C]/3 transition-colors">
              <div className="md:col-span-1 text-xs text-[#261E14]/40 font-mono">{d.numero}</div>
              <div className="md:col-span-3">
                <div className="text-sm text-[#261E14]/80 font-medium">{d.client_nom}</div>
                {d.client_societe && (
                  <div className="text-xs text-[#261E14]/30">{d.client_societe}</div>
                )}
              </div>
              <div className="md:col-span-3 text-sm text-[#261E14]/50 truncate">{d.objet}</div>
              <div className="md:col-span-2 text-sm font-medium text-[#261E14]/70">
                {Number(d.total_ttc).toLocaleString("fr-FR")} €
              </div>
              <div className="md:col-span-2">
                <span className={`text-[10px] px-2 py-0.5 uppercase tracking-widest font-medium ${statutStyle[d.statut] ?? ""}`}>
                  {statutLabel[d.statut] ?? d.statut}
                </span>
              </div>
              <div className="md:col-span-1 flex justify-end">
                <Link href={`/admin/devis/${d.id}`} className="text-xs text-[#E8A87C]/40 hover:text-[#E8A87C] transition-colors">
                  Voir →
                </Link>
              </div>
            </div>
          )) : (
            <div className="px-5 py-12 text-center text-[#261E14]/20 text-sm">
              Aucun devis — <Link href="/admin/devis/nouveau" className="text-[#E8A87C]/60 hover:text-[#E8A87C]">Créer le premier</Link>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
