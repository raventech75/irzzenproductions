"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Wand2 } from "lucide-react";
import { formules } from "@/lib/prestations";
import { cn } from "@/lib/utils";

type Ligne = { id: string; description: string; quantite: number; prix_unitaire: number };

const genId = () => Math.random().toString(36).slice(2, 9);

const dateDefaut = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
};

export function NouveauDevisForm({ numero }: { numero: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    client_nom: "",
    client_email: "",
    client_telephone: "",
    client_societe: "",
    client_siret: "",
    client_adresse: "",
    objet: "",
    remise_pct: 0,
    tva_pct: 20,
    date_validite: dateDefaut(),
    notes: "",
  });

  const [lignes, setLignes] = useState<Ligne[]>([
    { id: genId(), description: "", quantite: 1, prix_unitaire: 0 },
  ]);

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.type === "number" ? Number(e.target.value) : e.target.value }));

  const addLigne = () =>
    setLignes((p) => [...p, { id: genId(), description: "", quantite: 1, prix_unitaire: 0 }]);

  const removeLigne = (id: string) =>
    setLignes((p) => p.filter((l) => l.id !== id));

  const updateLigne = (id: string, field: keyof Omit<Ligne, "id">, value: string | number) =>
    setLignes((p) => p.map((l) => l.id === id ? { ...l, [field]: value } : l));

  const chargerFormule = (formuleId: string) => {
    const f = formules.find((f) => f.id === formuleId);
    if (!f) return;
    setForm((p) => ({ ...p, objet: `Prestation mariage — Formule ${f.nom}` }));
    setLignes([
      { id: genId(), description: `Formule ${f.nom} — ${f.duree}`, quantite: 1, prix_unitaire: f.prix },
      ...f.inclus.map((item) => ({ id: genId(), description: item, quantite: 1, prix_unitaire: 0 })),
    ]);
  };

  // Calculs
  const totalHtBrut = lignes.reduce((s, l) => s + l.quantite * l.prix_unitaire, 0);
  const montantRemise = totalHtBrut * (form.remise_pct / 100);
  const totalHt = totalHtBrut - montantRemise;
  const montantTva = totalHt * (form.tva_pct / 100);
  const totalTtc = totalHt + montantTva;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/creer-devis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numero,
        ...form,
        lignes,
        total_ht: totalHt,
        total_ttc: totalTtc,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la création.");
      setLoading(false);
      return;
    }

    const { id } = await res.json();
    router.push(`/admin/devis/${id}`);
  };

  const inputCls = "w-full bg-[#FAFAF8] border border-[#E8A87C]/20 text-[#261E14] text-sm px-3 py-2.5 placeholder-[#261E14]/20 focus:outline-none focus:border-[#E8A87C]/60 transition-colors";
  const labelCls = "block text-[10px] tracking-[0.25em] uppercase text-[#E8A87C]/60 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">

      {/* Raccourci formule */}
      <div className="glass border border-[#E8A87C]/15 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Wand2 size={13} className="text-[#E8A87C]/60" />
          <span className="text-xs tracking-[0.2em] uppercase text-[#E8A87C]/60">Pré-remplir depuis une formule</span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {formules.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => chargerFormule(f.id)}
              className="px-3 py-1.5 text-xs border border-[#E8A87C]/25 text-[#E8A87C]/70 hover:border-[#E8A87C] hover:text-[#E8A87C] hover:bg-[#E8A87C]/5 transition-all"
            >
              {f.nom} — {f.prix.toLocaleString("fr-FR")} €
            </button>
          ))}
        </div>
      </div>

      {/* Informations client */}
      <div className="glass border border-[#E8A87C]/15 p-6">
        <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 mb-5 font-medium">Informations client</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nom complet *</label>
            <input required type="text" placeholder="Sofia & Karim Benali" value={form.client_nom} onChange={setField("client_nom")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Société / Organisation</label>
            <input type="text" placeholder="Entreprise SARL" value={form.client_societe} onChange={setField("client_societe")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Email *</label>
            <input required type="email" placeholder="contact@email.com" value={form.client_email} onChange={setField("client_email")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Téléphone</label>
            <input type="tel" placeholder="06 12 34 56 78" value={form.client_telephone} onChange={setField("client_telephone")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>SIRET</label>
            <input type="text" placeholder="000 000 000 00000" value={form.client_siret} onChange={setField("client_siret")} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Adresse de facturation</label>
            <textarea rows={2} placeholder={"12 rue de la Paix\n75001 Paris"} value={form.client_adresse} onChange={setField("client_adresse")} className={cn(inputCls, "resize-none")} />
          </div>
        </div>
      </div>

      {/* Objet + validité */}
      <div className="glass border border-[#E8A87C]/15 p-6">
        <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 mb-5 font-medium">Détails du devis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Objet *</label>
            <input required type="text" placeholder="Prestation photo/vidéo mariage — Formule Complète" value={form.objet} onChange={setField("objet")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Valide jusqu'au *</label>
            <input required type="date" value={form.date_validite} onChange={setField("date_validite")} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Lignes de prestation */}
      <div className="glass border border-[#E8A87C]/15 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 font-medium">Prestations</h2>
          <button
            type="button"
            onClick={addLigne}
            className="flex items-center gap-1.5 text-xs text-[#E8A87C]/60 hover:text-[#E8A87C] transition-colors"
          >
            <Plus size={13} /> Ajouter une ligne
          </button>
        </div>

        {/* En-têtes */}
        <div className="hidden md:grid grid-cols-12 gap-3 mb-2 text-[10px] tracking-widest uppercase text-[#261E14]/25">
          <div className="col-span-6">Description</div>
          <div className="col-span-2 text-right">Qté</div>
          <div className="col-span-3 text-right">Prix unitaire HT</div>
          <div className="col-span-1" />
        </div>

        <div className="space-y-2">
          {lignes.map((l, i) => (
            <div key={l.id} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-12 md:col-span-6">
                <input
                  type="text"
                  placeholder={`Prestation ${i + 1}`}
                  value={l.description}
                  onChange={(e) => updateLigne(l.id, "description", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="col-span-4 md:col-span-2">
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={l.quantite}
                  onChange={(e) => updateLigne(l.id, "quantite", Number(e.target.value))}
                  className={cn(inputCls, "text-right")}
                />
              </div>
              <div className="col-span-7 md:col-span-3">
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={l.prix_unitaire}
                    onChange={(e) => updateLigne(l.id, "prix_unitaire", Number(e.target.value))}
                    className={cn(inputCls, "text-right pr-7")}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#261E14]/30">€</span>
                </div>
              </div>
              <div className="col-span-1 flex justify-center">
                {lignes.length > 1 && (
                  <button type="button" onClick={() => removeLigne(l.id)} className="text-[#261E14]/20 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totaux + options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notes */}
        <div className="glass border border-[#E8A87C]/15 p-6">
          <label className={cn(labelCls, "mb-3")}>Notes / Conditions de paiement</label>
          <textarea
            rows={5}
            placeholder="Acompte de 30% à la signature, solde 30 jours avant le mariage. Devis valable 30 jours."
            value={form.notes}
            onChange={setField("notes")}
            className={cn(inputCls, "resize-none")}
          />
        </div>

        {/* Récap financier */}
        <div className="glass border border-[#E8A87C]/15 p-6">
          <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 mb-5 font-medium">Récapitulatif</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelCls}>Remise globale (%)</label>
              <div className="relative">
                <input type="number" min={0} max={100} step={1} value={form.remise_pct} onChange={setField("remise_pct")} className={cn(inputCls, "pr-7")} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#261E14]/30">%</span>
              </div>
            </div>
            <div>
              <label className={labelCls}>TVA</label>
              <div className="flex gap-1.5 flex-wrap">
                {[0, 5.5, 10, 20].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, tva_pct: rate }))}
                    className={cn(
                      "px-3 py-2 text-xs font-medium border transition-colors",
                      form.tva_pct === rate
                        ? "bg-[#E8A87C] text-[#261E14] border-[#E8A87C]"
                        : "bg-[#FAFAF8] text-[#261E14]/50 border-[#E8A87C]/20 hover:border-[#E8A87C]/50"
                    )}
                  >
                    {rate === 0 ? "Exonéré" : `${rate}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-[#E8A87C]/10 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-[#261E14]/50">
              <span>Total brut HT</span>
              <span>{totalHtBrut.toLocaleString("fr-FR")} €</span>
            </div>
            {form.remise_pct > 0 && (
              <div className="flex justify-between text-sm text-red-500/70">
                <span>Remise ({form.remise_pct}%)</span>
                <span>− {montantRemise.toLocaleString("fr-FR")} €</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-[#261E14]/60">
              <span>Total HT</span>
              <span>{totalHt.toLocaleString("fr-FR")} €</span>
            </div>
            {form.tva_pct > 0 && (
              <div className="flex justify-between text-sm text-[#261E14]/50">
                <span>TVA ({form.tva_pct}%)</span>
                <span>{montantTva.toLocaleString("fr-FR")} €</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-[#261E14] pt-2 border-t border-[#E8A87C]/15">
              <span>Total TTC</span>
              <span className="text-[#E8A87C]">{totalTtc.toLocaleString("fr-FR")} €</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-[#E8A87C] text-[#261E14] text-xs font-semibold tracking-widest uppercase hover:bg-[#d4905e] transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 size={13} className="animate-spin" />}
          {loading ? "Création…" : "Créer le devis"}
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  );
}
