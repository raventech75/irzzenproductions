import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ModifierGalerieForm } from "./ModifierGalerieForm";

export const metadata = { title: "Modifier la galerie — Admin" };

export default async function ModifierGaleriePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: galerie } = await supabase.from("galeries").select("*").eq("id", id).single();
  if (!galerie) notFound();

  return (
    <AdminShell>
      <div className="mb-8">
        <Link href={`/admin/galeries/${id}`} className="flex items-center gap-1.5 text-xs text-[#261E14]/30 hover:text-[#E8A87C]/60 transition-colors mb-4">
          <ArrowLeft size={12} /> Retour à la galerie
        </Link>
        <p className="text-xs tracking-[0.4em] uppercase text-[#E8A87C]/50 mb-1">Back-office</p>
        <h1 className="text-2xl font-bold text-[#261E14]" style={{ fontFamily: "var(--font-playfair)" }}>
          Modifier — {galerie.nom}
        </h1>
      </div>
      <ModifierGalerieForm galerie={galerie as any} />
    </AdminShell>
  );
}
