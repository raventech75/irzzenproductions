import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { NouvelleGalerieForm } from "./NouvelleGalerieForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NouvelleGaleriePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: clients } = await supabase
    .from("clients")
    .select("id, prenom_marie1, prenom_marie2")
    .order("created_at", { ascending: false });

  return (
    <AdminShell>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/galeries" className="text-[#1A1520]/30 hover:text-[#C4A5B5] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-[#C4A5B5]/50 mb-1">Galeries</p>
          <h1 className="text-2xl font-bold text-[#1A1520]" style={{ fontFamily: "var(--font-playfair)" }}>
            Nouvelle galerie
          </h1>
        </div>
      </div>
      <NouvelleGalerieForm clients={clients ?? []} />
    </AdminShell>
  );
}
