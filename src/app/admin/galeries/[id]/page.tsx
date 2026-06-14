import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { PublierGalerieButton, SupprimerGalerieButton, ModifierGalerieButton } from "./GalerieActions";
import Link from "next/link";
import { ArrowLeft, Image, Video, FileArchive } from "lucide-react";

export default async function AdminGalerieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: galerie } = await supabase
    .from("galeries")
    .select(`*, clients(prenom_marie1, prenom_marie2, email)`)
    .eq("id", id)
    .single();

  if (!galerie) notFound();

  const { data: fichiers } = await supabase
    .from("fichiers")
    .select("*")
    .eq("galerie_id", id)
    .order("created_at", { ascending: false });

  const client = (galerie as any).clients;

  return (
    <AdminShell>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/galeries" className="text-[#261E14]/30 hover:text-[#E8A87C] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <p className="text-xs tracking-[0.4em] uppercase text-[#E8A87C]/50 mb-1">Galerie</p>
          <h1 className="text-2xl font-bold text-[#261E14]" style={{ fontFamily: "var(--font-playfair)" }}>
            {galerie.nom}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SupprimerGalerieButton galerieId={id} />
          <ModifierGalerieButton galerieId={id} />
          <PublierGalerieButton galerieId={id} actif={galerie.actif} />
        </div>
      </div>

      {/* Infos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Client", value: `${client?.prenom_marie1} & ${client?.prenom_marie2}` },
          { label: "Email", value: client?.email },
          { label: "Type", value: galerie.type },
          { label: "Fichiers", value: `${galerie.nb_fichiers}` },
          { label: "Statut", value: galerie.actif ? "Publiée" : "Non publiée" },
          { label: "Créée le", value: new Date(galerie.created_at).toLocaleDateString("fr-FR") },
        ].map((item) => (
          <div key={item.label} className="glass p-4 border border-[#E8A87C]/10">
            <div className="text-[10px] tracking-widest uppercase text-[#261E14]/25 mb-1">{item.label}</div>
            <div className="text-sm text-[#261E14]/80">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Fichiers */}
      <div className="glass border border-[#E8A87C]/15 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8A87C]/10 flex items-center justify-between">
          <span className="text-xs tracking-widest uppercase text-[#261E14]/40">Fichiers ({fichiers?.length ?? 0})</span>
        </div>
        <div className="divide-y divide-[#E8A87C]/8">
          {fichiers && fichiers.length > 0 ? fichiers.map((f: any) => (
            <div key={f.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[#E8A87C]/3 transition-colors">
              <div className="text-[#E8A87C]/40">
                {f.type === "photo" ? <Image size={14} /> : f.type === "video" ? <Video size={14} /> : <FileArchive size={14} />}
              </div>
              <div className="flex-1 text-sm text-[#261E14]/70 truncate">{f.nom}</div>
              <div className="text-xs text-[#261E14]/30">{f.type}</div>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#E8A87C]/40 hover:text-[#E8A87C] transition-colors"
              >
                Voir →
              </a>
            </div>
          )) : (
            <div className="px-5 py-12 text-center text-[#261E14]/20 text-sm">
              Aucun fichier dans cette galerie
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
