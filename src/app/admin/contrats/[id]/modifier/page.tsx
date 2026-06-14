import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ModifierContratForm } from "./ModifierContratForm";

export const metadata = { title: "Modifier le contrat — Admin" };

export default async function ModifierContratPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: contrat } = await supabase
    .from("contrats")
    .select("*, clients(prenom_marie1, prenom_marie2)")
    .eq("id", id)
    .single();
  if (!contrat) notFound();

  return (
    <AdminShell>
      <div className="mb-8">
        <Link href={`/admin/contrats/${id}`} className="flex items-center gap-1.5 text-xs text-[#261E14]/30 hover:text-[#E8A87C]/60 transition-colors mb-4">
          <ArrowLeft size={12} /> Retour au contrat
        </Link>
        <p className="text-xs tracking-[0.4em] uppercase text-[#E8A87C]/50 mb-1">Back-office</p>
        <h1 className="text-2xl font-bold text-[#261E14]" style={{ fontFamily: "var(--font-playfair)" }}>
          Modifier — {contrat.titre}
        </h1>
      </div>
      <ModifierContratForm contrat={contrat as any} />
    </AdminShell>
  );
}
