import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { Plus } from "lucide-react";
import Link from "next/link";

const statutStyle: Record<string, string> = {
  prospect: "text-amber-700 bg-amber-50",
  confirme: "text-blue-600 bg-blue-50",
  en_cours: "text-purple-700 bg-purple-50",
  livre:    "text-[#E8A87C] bg-[#E8A87C]/10",
  termine:  "text-green-700 bg-green-50",
};

export default async function AdminClientsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("date_mariage", { ascending: true });

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-[#E8A87C]/50 mb-1">Back-office</p>
          <h1 className="text-2xl font-bold text-[#261E14]" style={{ fontFamily: "var(--font-playfair)" }}>
            Clients
          </h1>
        </div>
        <Link
          href="/admin/clients/nouveau"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E8A87C] text-[#261E14] text-xs font-semibold tracking-widest uppercase hover:bg-[#d4905e] transition-colors"
        >
          <Plus size={13} /> Nouveau client
        </Link>
      </div>

      <div className="glass border border-[#E8A87C]/15 overflow-hidden">
        {/* Header tableau */}
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#E8A87C]/10 text-[10px] tracking-widest uppercase text-[#261E14]/25">
          <div className="col-span-3">Couple</div>
          <div className="col-span-2">Date mariage</div>
          <div className="col-span-2">Formule</div>
          <div className="col-span-2">Total</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-1" />
        </div>

        {/* Lignes */}
        <div className="divide-y divide-[#E8A87C]/8">
          {clients && clients.length > 0 ? clients.map((c) => (
            <div key={c.id} className="grid grid-cols-12 gap-4 items-center px-5 py-3.5 hover:bg-[#E8A87C]/3 transition-colors">
              <div className="col-span-3">
                <div className="text-sm text-[#261E14]/80 font-medium">
                  {c.prenom_marie1} & {c.prenom_marie2}
                </div>
                <div className="text-xs text-[#261E14]/30 truncate">{c.email}</div>
              </div>
              <div className="col-span-2 text-sm text-[#261E14]/50">
                {new Date(c.date_mariage).toLocaleDateString("fr-FR")}
              </div>
              <div className="col-span-2 text-sm text-[#261E14]/50 capitalize">{c.formule}</div>
              <div className="col-span-2 text-sm text-[#E8A87C]/80 font-medium">
                {c.total_ttc.toLocaleString("fr-FR")} €
              </div>
              <div className="col-span-2">
                <span className={`text-[10px] px-2 py-1 uppercase tracking-widest font-medium ${statutStyle[c.statut] ?? "text-[#261E14]/30"}`}>
                  {c.statut}
                </span>
              </div>
              <div className="col-span-1 flex justify-end">
                <Link
                  href={`/admin/clients/${c.id}`}
                  className="text-xs text-[#E8A87C]/40 hover:text-[#E8A87C] transition-colors tracking-wide"
                >
                  Gérer →
                </Link>
              </div>
            </div>
          )) : (
            <div className="px-5 py-12 text-center text-[#261E14]/20 text-sm">
              Aucun client enregistré
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
