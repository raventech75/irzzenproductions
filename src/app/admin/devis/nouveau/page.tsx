import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { NouveauDevisForm } from "./NouveauDevisForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NouveauDevisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Prochain numéro de devis
  const { count } = await (supabase as any)
    .from("devis")
    .select("*", { count: "exact", head: true });

  const annee = new Date().getFullYear();
  const nextNum = String((count ?? 0) + 1).padStart(3, "0");
  const numero = `DEV-${annee}-${nextNum}`;

  return (
    <AdminShell>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/devis" className="text-[#261E14]/30 hover:text-[#E8A87C] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-[#E8A87C]/50 mb-1">Devis</p>
          <h1 className="text-2xl font-bold text-[#261E14]" style={{ fontFamily: "var(--font-playfair)" }}>
            Nouveau devis <span className="text-[#E8A87C]/60 text-lg">{numero}</span>
          </h1>
        </div>
      </div>
      <NouveauDevisForm numero={numero} />
    </AdminShell>
  );
}
