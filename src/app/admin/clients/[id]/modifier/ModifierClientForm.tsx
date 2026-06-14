"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Save } from "lucide-react";
import Link from "next/link";

const formules = ["photo", "video", "duo", "premium", "prestige"];
const statuts = [
  { v: "prospect", l: "Prospect" },
  { v: "confirme", l: "Confirmé" },
  { v: "en_cours", l: "En cours" },
  { v: "livre", l: "Livré" },
  { v: "termine", l: "Terminé" },
];

type Client = {
  id: string;
  prenom_marie1: string;
  prenom_marie2: string;
  email: string;
  telephone: string | null;
  date_mariage: string;
  lieu: string | null;
  formule: string;
  total_ttc: number;
  acompte_verse: boolean;
  statut: string;
  notes_internes: string | null;
};

export function ModifierClientForm({ client }: { client: Client }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    prenom_marie1: client.prenom_marie1,
    prenom_marie2: client.prenom_marie2,
    email: client.email,
    telephone: client.telephone ?? "",
    date_mariage: client.date_mariage.split("T")[0],
    lieu: client.lieu ?? "",
    formule: client.formule,
    total_ttc: String(client.total_ttc),
    acompte_verse: client.acompte_verse,
    statut: client.statut,
    notes_internes: client.notes_internes ?? "",
  });

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await (supabase.from("clients") as any)
      .update({
        prenom_marie1: form.prenom_marie1.trim(),
        prenom_marie2: form.prenom_marie2.trim(),
        email: form.email.trim(),
        telephone: form.telephone.trim() || null,
        date_mariage: form.date_mariage,
        lieu: form.lieu.trim() || null,
        formule: form.formule,
        total_ttc: Number(form.total_ttc),
        acompte_verse: form.acompte_verse,
        statut: form.statut,
        notes_internes: form.notes_internes.trim() || null,
      })
      .eq("id", client.id);

    if (err) {
      setError("Erreur : " + err.message);
      setSaving(false);
      return;
    }

    router.push(`/admin/clients/${client.id}`);
    router.refresh();
  };

  const inputCls = "w-full bg-white border border-[#261E14]/12 text-[#261E14] text-sm px-4 py-2.5 focus:outline-none focus:border-[#E8A87C]/60 transition-colors rounded-sm";
  const labelCls = "block text-[11px] tracking-[0.2em] uppercase text-[#261E14]/40 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="px-4 py-3 border border-red-300 bg-red-50 text-red-600 text-xs rounded-sm">
          {error}
        </div>
      )}

      {/* Identité */}
      <div className="glass border border-[#E8A87C]/15 p-6 rounded-sm">
        <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 mb-5">Mariés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Prénom marié(e) 1 *</label>
            <input required value={form.prenom_marie1} onChange={(e) => set("prenom_marie1", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Prénom marié(e) 2 *</label>
            <input required value={form.prenom_marie2} onChange={(e) => set("prenom_marie2", e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="glass border border-[#E8A87C]/15 p-6 rounded-sm">
        <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 mb-5">Contact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Email *</label>
            <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Téléphone</label>
            <input type="tel" value={form.telephone} onChange={(e) => set("telephone", e.target.value)} placeholder="+33 6 00 00 00 00" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Mariage */}
      <div className="glass border border-[#E8A87C]/15 p-6 rounded-sm">
        <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 mb-5">Mariage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Date du mariage *</label>
            <input required type="date" value={form.date_mariage} onChange={(e) => set("date_mariage", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Lieu</label>
            <input value={form.lieu} onChange={(e) => set("lieu", e.target.value)} placeholder="Paris…" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Prestation */}
      <div className="glass border border-[#E8A87C]/15 p-6 rounded-sm">
        <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 mb-5">Prestation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Formule *</label>
            <select value={form.formule} onChange={(e) => set("formule", e.target.value)} className={inputCls}>
              {formules.map((f) => (
                <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Total TTC (€) *</label>
            <input required type="number" min="0" step="10" value={form.total_ttc} onChange={(e) => set("total_ttc", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Statut dossier</label>
            <select value={form.statut} onChange={(e) => set("statut", e.target.value)} className={inputCls}>
              {statuts.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <input
            id="acompte_verse"
            type="checkbox"
            checked={form.acompte_verse}
            onChange={(e) => set("acompte_verse", e.target.checked)}
            className="w-4 h-4 accent-[#E8A87C]"
          />
          <label htmlFor="acompte_verse" className="text-sm text-[#261E14]/60 cursor-pointer">Acompte versé</label>
        </div>
      </div>

      {/* Notes */}
      <div className="glass border border-[#E8A87C]/15 p-6 rounded-sm">
        <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 mb-5">Notes internes</h2>
        <textarea
          value={form.notes_internes}
          onChange={(e) => set("notes_internes", e.target.value)}
          rows={4}
          placeholder="Remarques, besoins particuliers…"
          className={inputCls + " resize-y"}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#E8A87C] text-[#261E14] text-xs font-semibold tracking-widest uppercase hover:bg-[#d4905e] transition-colors disabled:opacity-60"
        >
          {saving ? <span className="w-3.5 h-3.5 border-2 border-[#261E14]/30 border-t-[#261E14] rounded-full animate-spin" /> : <Save size={13} />}
          Enregistrer
        </button>
        <Link href={`/admin/clients/${client.id}`} className="text-xs text-[#261E14]/30 hover:text-[#261E14]/60 transition-colors">
          Annuler
        </Link>
      </div>
    </form>
  );
}
