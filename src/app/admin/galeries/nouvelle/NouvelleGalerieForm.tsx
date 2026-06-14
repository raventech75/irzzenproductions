"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export function NouvelleGalerieForm({ clients }: { clients: { id: string; prenom_marie1: string; prenom_marie2: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ nom: "", client_id: "", type: "photo", nb_fichiers: "0", lien_synology: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await (supabase.from("galeries") as any).insert({
      nom: values.nom,
      client_id: values.client_id,
      type: values.type,
      nb_fichiers: parseInt(values.nb_fichiers),
      lien_synology: values.lien_synology.trim() || null,
      actif: false,
    });
    router.push("/admin/galeries");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="glass border border-[#E8A87C]/15 p-8 space-y-6 max-w-2xl">
      {[
        { id: "nom", label: "Nom de la galerie", type: "text", placeholder: "Mariage Sophie & Karim — Septembre 2025" },
        { id: "nb_fichiers", label: "Nombre de fichiers", type: "number", placeholder: "120" },
      ].map((field) => (
        <div key={field.id}>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#E8A87C]/60 mb-2">{field.label}</label>
          <input
            type={field.type}
            placeholder={field.placeholder}
            required
            value={(values as any)[field.id]}
            onChange={(e) => setValues((p) => ({ ...p, [field.id]: e.target.value }))}
            className="w-full bg-[#FAFAF8] border border-[#E8A87C]/20 text-[#261E14] text-sm px-4 py-3 placeholder-[#F0EBE8]/20 focus:outline-none focus:border-[#E8A87C]/60 transition-colors"
          />
        </div>
      ))}

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-[#E8A87C]/60 mb-2">Client</label>
        <select
          required
          value={values.client_id}
          onChange={(e) => setValues((p) => ({ ...p, client_id: e.target.value }))}
          className="w-full bg-[#FAFAF8] border border-[#E8A87C]/20 text-[#261E14] text-sm px-4 py-3 focus:outline-none focus:border-[#E8A87C]/60 transition-colors"
        >
          <option value="">Sélectionner un client…</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.prenom_marie1} & {c.prenom_marie2}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-[#E8A87C]/60 mb-2">Type</label>
        <select
          value={values.type}
          onChange={(e) => setValues((p) => ({ ...p, type: e.target.value }))}
          className="w-full bg-[#FAFAF8] border border-[#E8A87C]/20 text-[#261E14] text-sm px-4 py-3 focus:outline-none focus:border-[#E8A87C]/60 transition-colors"
        >
          <option value="photo">Photos</option>
          <option value="video">Vidéo</option>
          <option value="mixte">Mixte (photos + vidéo)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-[#E8A87C]/60 mb-2">Lien Synology Photos</label>
        <input
          type="url"
          placeholder="https://your-nas.synology.me/photo/share/..."
          value={values.lien_synology}
          onChange={(e) => setValues((p) => ({ ...p, lien_synology: e.target.value }))}
          className="w-full bg-[#FAFAF8] border border-[#E8A87C]/20 text-[#261E14] text-sm px-4 py-3 placeholder-[#261E14]/20 focus:outline-none focus:border-[#E8A87C]/60 transition-colors"
        />
        <p className="text-[11px] text-[#261E14]/30 mt-1.5">Lien de partage Synology Photos — visible par le client dans son espace.</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-8 py-3 bg-[#E8A87C] text-[#261E14] text-xs font-semibold tracking-widest uppercase hover:bg-[#d4905e] transition-colors disabled:opacity-60"
      >
        {loading && <Loader2 size={13} className="animate-spin" />}
        {loading ? "Création…" : "Créer la galerie"}
      </button>
    </form>
  );
}
