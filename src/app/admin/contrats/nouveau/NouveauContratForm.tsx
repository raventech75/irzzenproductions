"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

const TEMPLATE = `CONTRAT DE PRESTATION DE SERVICES PHOTOGRAPHIQUES ET VIDÉOGRAPHIQUES

Entre les soussignés :
Irzzen Productions, ci-après dénommé "le Prestataire"
Et les époux ci-dessus mentionnés, ci-après dénommés "les Clients"

ARTICLE 1 — OBJET DU CONTRAT
Le Prestataire s'engage à assurer la couverture photo et/ou vidéo du mariage selon la formule choisie.

ARTICLE 2 — DATE ET LIEU
Date du mariage : [À COMPLÉTER]
Lieu de la cérémonie : [À COMPLÉTER]

ARTICLE 3 — PRESTATIONS
Formule sélectionnée : [À COMPLÉTER]
Options : [À COMPLÉTER]

ARTICLE 4 — TARIFS ET MODALITÉS DE PAIEMENT
Montant total : [MONTANT] €
- Acompte de 15% à la signature : [ACOMPTE] €
- Solde à régler 30 jours avant le mariage

ARTICLE 5 — LIVRAISON
Les photos seront livrées dans un délai de 8 semaines après le mariage.
Les vidéos seront livrées dans un délai de 12 semaines après le mariage.

ARTICLE 6 — DROITS D'AUTEUR
Le Prestataire conserve les droits d'auteur sur l'ensemble des images et vidéos produites.
Les Clients bénéficient d'une licence d'utilisation personnelle non commerciale.

ARTICLE 7 — ANNULATION
Toute annulation doit être notifiée par écrit. L'acompte reste acquis au Prestataire.`;

export function NouveauContratForm({ clients }: { clients: { id: string; prenom_marie1: string; prenom_marie2: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ titre: "", client_id: "", contenu: TEMPLATE });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await (supabase.from("contrats") as any).insert({
      titre: values.titre,
      client_id: values.client_id,
      contenu: values.contenu,
      statut: "en_attente",
    });
    router.push("/admin/contrats");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="glass border border-[#C4A5B5]/15 p-8 space-y-6">
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#C4A5B5]/60 mb-2">Titre du contrat</label>
          <input
            type="text"
            placeholder="Contrat Mariage Sophie & Karim — 15 Septembre 2025"
            required
            value={values.titre}
            onChange={(e) => setValues((p) => ({ ...p, titre: e.target.value }))}
            className="w-full bg-[#FAFAF8] border border-[#C4A5B5]/20 text-[#1A1520] text-sm px-4 py-3 placeholder-[#F0EBE8]/20 focus:outline-none focus:border-[#C4A5B5]/60 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#C4A5B5]/60 mb-2">Client</label>
          <select
            required
            value={values.client_id}
            onChange={(e) => setValues((p) => ({ ...p, client_id: e.target.value }))}
            className="w-full bg-[#FAFAF8] border border-[#C4A5B5]/20 text-[#1A1520] text-sm px-4 py-3 focus:outline-none focus:border-[#C4A5B5]/60 transition-colors"
          >
            <option value="">Sélectionner un client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.prenom_marie1} & {c.prenom_marie2}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#C4A5B5]/60 mb-2">Contenu du contrat</label>
          <textarea
            rows={20}
            required
            value={values.contenu}
            onChange={(e) => setValues((p) => ({ ...p, contenu: e.target.value }))}
            className="w-full bg-[#FAFAF8] border border-[#C4A5B5]/20 text-[#1A1520] text-sm px-4 py-3 font-mono text-xs leading-relaxed placeholder-[#F0EBE8]/20 focus:outline-none focus:border-[#C4A5B5]/60 transition-colors resize-y"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-8 py-3 bg-[#C4A5B5] text-[#13111A] text-xs font-semibold tracking-widest uppercase hover:bg-[#DEC8D6] transition-colors disabled:opacity-60"
      >
        {loading && <Loader2 size={13} className="animate-spin" />}
        {loading ? "Création…" : "Créer le contrat"}
      </button>
    </form>
  );
}
