"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save } from "lucide-react";
import Link from "next/link";

type Galerie = {
  id: string; nom: string; type: string;
  nb_fichiers: number; lien_synology: string | null;
};

export function ModifierGalerieForm({ galerie }: { galerie: Galerie }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    nom: galerie.nom,
    type: galerie.type,
    nb_fichiers: String(galerie.nb_fichiers),
    lien_synology: galerie.lien_synology ?? "",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await (supabase.from("galeries") as any)
      .update({
        nom: form.nom.trim(),
        type: form.type,
        nb_fichiers: parseInt(form.nb_fichiers) || 0,
        lien_synology: form.lien_synology.trim() || null,
      })
      .eq("id", galerie.id);

    if (err) { setError("Erreur : " + err.message); setSaving(false); return; }
    router.push(`/admin/galeries/${galerie.id}`);
    router.refresh();
  };

  const inputCls = "w-full bg-white border border-[#261E14]/12 text-[#261E14] text-sm px-4 py-2.5 focus:outline-none focus:border-[#E8A87C]/60 transition-colors rounded-sm";
  const labelCls = "block text-[11px] tracking-[0.2em] uppercase text-[#261E14]/40 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && <div className="px-4 py-3 border border-red-300 bg-red-50 text-red-600 text-xs rounded-sm">{error}</div>}

      <div className="glass border border-[#E8A87C]/15 p-6 rounded-sm space-y-4">
        <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60">Informations</h2>

        <div>
          <label className={labelCls}>Nom de la galerie *</label>
          <input required value={form.nom} onChange={(e) => set("nom", e.target.value)} className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Type</label>
            <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputCls}>
              <option value="photo">Photos</option>
              <option value="video">Vidéo</option>
              <option value="mixte">Mixte</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Nombre de fichiers</label>
            <input type="number" min="0" value={form.nb_fichiers} onChange={(e) => set("nb_fichiers", e.target.value)} className={inputCls} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Lien Synology Photos</label>
          <input
            type="url"
            value={form.lien_synology}
            onChange={(e) => set("lien_synology", e.target.value)}
            placeholder="https://your-nas.synology.me/photo/share/..."
            className={inputCls}
          />
          <p className="text-[11px] text-[#261E14]/30 mt-1.5">Lien de partage Synology Photos — visible par le client dans son espace.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#E8A87C] text-[#261E14] text-xs font-semibold tracking-widest uppercase hover:bg-[#d4905e] transition-colors disabled:opacity-60"
        >
          {saving ? <span className="w-3.5 h-3.5 border-2 border-[#261E14]/30 border-t-[#261E14] rounded-full animate-spin" /> : <Save size={13} />}
          Enregistrer
        </button>
        <Link href={`/admin/galeries/${galerie.id}`} className="text-xs text-[#261E14]/30 hover:text-[#261E14]/60 transition-colors">
          Annuler
        </Link>
      </div>
    </form>
  );
}
