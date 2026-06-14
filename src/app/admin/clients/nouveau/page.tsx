import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { NouveauClientForm } from "./NouveauClientForm";

export const metadata = { title: "Nouveau client — Admin" };

export default async function NouveauClientPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <AdminShell>
      <div className="mb-8">
        <Link href="/admin/clients" className="flex items-center gap-1.5 text-xs text-[#261E14]/30 hover:text-[#E8A87C]/60 transition-colors mb-4">
          <ArrowLeft size={12} /> Retour aux clients
        </Link>
        <p className="text-xs tracking-[0.4em] uppercase text-[#E8A87C]/50 mb-1">Back-office</p>
        <h1 className="text-2xl font-bold text-[#261E14]" style={{ fontFamily: "var(--font-playfair)" }}>
          Nouveau client
        </h1>
      </div>
      <NouveauClientForm />
    </AdminShell>
  );
}
