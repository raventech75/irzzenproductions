import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "@/components/admin/AdminShell";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DevisDetail } from "./DevisDetail";

export default async function DevisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const adminSupabase = createAdminClient();
  const { data: devis } = await (adminSupabase as any)
    .from("devis")
    .select("*")
    .eq("id", id)
    .single();

  if (!devis) notFound();

  return (
    <AdminShell>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/devis" className="text-[#261E14]/30 hover:text-[#E8A87C] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-[#E8A87C]/50 mb-1">Devis</p>
          <h1 className="text-2xl font-bold text-[#261E14]" style={{ fontFamily: "var(--font-playfair)" }}>
            {devis.numero}
            <span className="text-base font-normal text-[#261E14]/40 ml-3">{devis.client_nom}</span>
          </h1>
        </div>
      </div>
      <DevisDetail devis={devis} />
    </AdminShell>
  );
}
