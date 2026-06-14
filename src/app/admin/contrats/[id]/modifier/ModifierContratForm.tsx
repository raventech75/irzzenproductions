"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save } from "lucide-react";
import Link from "next/link";

type Contrat = { id: string; titre: string; contenu: string | null; statut: string };

export function ModifierContratForm({ contrat }: { contrat: Contrat }) {
  const router = useRouter();
  const [titre, setTitre] = useState(contrat.titre);
  const [contenu, setContenu] = useState(contrat.contenu ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await (supabase.from("contrats") as any)
      .update({ titre: titre.trim(), contenu: contenu.trim() })
      .eq("id", contrat.id);

    if (err) {
      setError("Erreur : " + err.message);
      setSaving(false);
      return;
    }

    router.push(`/admin/contrats/${contrat.id}`);
    router.refresh();
  };

  const inputCls = "w-full bg-white border border-[#261E14]/12 text-[#261E14] text-sm px-4 py-2.5 focus:outline-none focus:border-[#E8A87C]/60 transition-colors rounded-sm";
  const labelCls = "block text-[11px] tracking-[0.2em] uppercase text-[#261E14]/40 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="px-4 py-3 border border-red-300 bg-red-50 text-red-600 text-xs rounded-sm">{error}</div>
      )}

      <div className="glass border border-[#E8A87C]/15 p-6 rounded-sm">
        <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 mb-5">Informations</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Titre du contrat *</label>
            <input
              required
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Contenu du contrat</label>
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              rows={20}
              className={inputCls + " font-mono text-xs leading-relaxed resize-y"}
            />
          </div>
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
        <Link href={`/admin/contrats/${contrat.id}`} className="text-xs text-[#261E14]/30 hover:text-[#261E14]/60 transition-colors">
          Annuler
        </Link>
      </div>
    </form>
  );
}
