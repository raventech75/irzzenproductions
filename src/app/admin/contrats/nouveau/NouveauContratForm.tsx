"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wand2 } from "lucide-react";
import { formules } from "@/lib/prestations";

type ClientData = {
  id: string;
  prenom_marie1: string;
  prenom_marie2: string;
  formule?: string | null;
  total_ttc?: number | null;
  date_mariage?: string | null;
  lieu?: string | null;
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function genererContenuContrat(client: ClientData): string {
  const nom = `${client.prenom_marie1} & ${client.prenom_marie2}`;
  const formuleNom = client.formule ?? "";
  const formuleData = formules.find((f) => f.nom === formuleNom || f.id === formuleNom);
  const inclusTexte = formuleData ? formuleData.inclus.map((i) => `  - ${i}`).join("\n") : "";
  const total = client.total_ttc ?? 0;
  const acompte = Math.ceil((total * 0.2) / 100) * 100;
  const solde = total - acompte;
  const dateLisible = formatDate(client.date_mariage);

  return `CONTRAT DE PRESTATION DE SERVICES PHOTOGRAPHIQUES ET VIDÉOGRAPHIQUES

Entre les soussignés :
Irzzen Productions — ci-après dénommé "le Prestataire"
Et ${nom}, ci-après dénommés "les Clients"

────────────────────────────────────────────────────────

ARTICLE 1 — OBJET DU CONTRAT
Le Prestataire s'engage à assurer la couverture photo et/ou vidéo du mariage
des Clients selon les conditions définies ci-après.

ARTICLE 2 — DATE ET LIEU
Date du mariage : ${dateLisible || "[À COMPLÉTER]"}
Lieu de la cérémonie : ${client.lieu || "[À COMPLÉTER]"}

ARTICLE 3 — PRESTATIONS
Formule sélectionnée : ${formuleNom || "[À COMPLÉTER]"}
${inclusTexte ? `Prestations incluses :\n${inclusTexte}` : ""}

ARTICLE 4 — TARIFS ET MODALITÉS DE PAIEMENT
Montant total TTC : ${total.toLocaleString("fr-FR")} €
Acompte de réservation (20%) : ${acompte.toLocaleString("fr-FR")} €
Solde restant dû : ${solde.toLocaleString("fr-FR")} €
— Le solde sera exigible 30 jours avant la date du mariage.
— L'acompte de réservation n'est pas remboursable en cas d'annulation par les Clients.

ARTICLE 5 — LIVRAISON
Les photos retouchées seront livrées via la galerie privée en ligne dans les délais
propres à la formule choisie.
Les vidéos seront livrées via la galerie privée ou un lien de téléchargement dédié.

ARTICLE 6 — DROITS D'AUTEUR
Le Prestataire conserve les droits d'auteur sur l'ensemble des images et vidéos produites.
Les Clients bénéficient d'une licence d'utilisation personnelle non commerciale.

ARTICLE 7 — RESPONSABILITÉS
En cas d'événement de force majeure, le Prestataire s'engage à proposer un remplaçant
de niveau équivalent ou, à défaut, à rembourser intégralement les sommes versées.

ARTICLE 8 — SIGNATURE ÉLECTRONIQUE
La signature électronique des présentes vaut acceptation pleine et entière des conditions.

────────────────────────────────────────────────────────
Fait à Paris, le ${new Date().toLocaleDateString("fr-FR")}`;
}

export function NouveauContratForm({ clients }: { clients: ClientData[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    titre: "",
    client_id: "",
    contenu: "",
  });

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) {
      setValues((p) => ({ ...p, client_id: clientId, titre: "", contenu: "" }));
      return;
    }

    const nom = `${client.prenom_marie1} & ${client.prenom_marie2}`;
    const dateLisible = formatDate(client.date_mariage);
    const titre = `Contrat Mariage ${nom}${dateLisible ? ` — ${dateLisible}` : ""}`;
    const contenu = genererContenuContrat(client);

    setValues({ client_id: clientId, titre, contenu });
  };

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/creer-contrat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: values.client_id,
        titre: values.titre,
        contenu: values.contenu,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erreur lors de la création du contrat.");
      setLoading(false);
      return;
    }

    router.push("/admin/contrats");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="glass border border-[#E8A87C]/15 p-8 space-y-6">

        {/* Sélection client */}
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#E8A87C]/60 mb-2">
            Client *
          </label>
          <select
            required
            value={values.client_id}
            onChange={(e) => handleClientChange(e.target.value)}
            className="w-full bg-[#FAFAF8] border border-[#E8A87C]/20 text-[#261E14] text-sm px-4 py-3 focus:outline-none focus:border-[#E8A87C]/60 transition-colors"
          >
            <option value="">Sélectionner un client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.prenom_marie1} & {c.prenom_marie2}
                {c.formule ? ` — ${c.formule}` : ""}
                {c.date_mariage ? ` (${formatDate(c.date_mariage)})` : ""}
              </option>
            ))}
          </select>
          {values.client_id && (
            <p className="text-[10px] text-[#E8A87C]/50 mt-1.5 flex items-center gap-1">
              <Wand2 size={10} />
              Contrat pré-rempli automatiquement depuis la fiche client
            </p>
          )}
        </div>

        {/* Titre */}
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#E8A87C]/60 mb-2">
            Titre du contrat *
          </label>
          <input
            type="text"
            placeholder="Contrat Mariage Sofia & Karim — 15 septembre 2025"
            required
            value={values.titre}
            onChange={(e) => setValues((p) => ({ ...p, titre: e.target.value }))}
            className="w-full bg-[#FAFAF8] border border-[#E8A87C]/20 text-[#261E14] text-sm px-4 py-3 placeholder-[#261E14]/20 focus:outline-none focus:border-[#E8A87C]/60 transition-colors"
          />
        </div>

        {/* Contenu */}
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#E8A87C]/60 mb-2">
            Contenu du contrat *
          </label>
          <textarea
            rows={24}
            required
            value={values.contenu}
            onChange={(e) => setValues((p) => ({ ...p, contenu: e.target.value }))}
            className="w-full bg-[#FAFAF8] border border-[#E8A87C]/20 text-[#261E14] text-sm px-4 py-3 font-mono text-xs leading-relaxed placeholder-[#261E14]/20 focus:outline-none focus:border-[#E8A87C]/60 transition-colors resize-y"
            placeholder="Sélectionnez d'abord un client pour générer le contrat automatiquement…"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !values.client_id}
        className="flex items-center gap-2 px-8 py-3 bg-[#E8A87C] text-[#261E14] text-xs font-semibold tracking-widest uppercase hover:bg-[#d4905e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 size={13} className="animate-spin" />}
        {loading ? "Création…" : "Créer le contrat"}
      </button>

      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </form>
  );
}
