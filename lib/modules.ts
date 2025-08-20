// lib/modules.ts

export interface FormulaDetailed {
  id: string;
  label: string;
  price: number;
  features: string[];
}

export const FORMULAS_DETAILED: FormulaDetailed[] = [
  {
    id: "essential",
    label: "Formule Essentielle",
    price: 1800,
    features: [
      "Préparatifs marié & mariée",
      "Cérémonie mairie & église",
      "Séance couple rapide",
      "Galerie en ligne privée",
      "Remise numérique HD",
    ],
  },
  {
    id: "premium",
    label: "Formule Premium",
    price: 2800,
    features: [
      "Tout dans Essentielle",
      "Séance couple longue",
      "Cocktail & vin d’honneur",
      "Photos famille & groupes",
      "Galerie en ligne illimitée",
      "Album photo 30x30 inclus",
    ],
  },
  {
    id: "prestige",
    label: "Formule Prestige",
    price: 3800,
    features: [
      "Tout dans Premium",
      "Soirée complète jusqu’à l’ouverture de bal",
      "Séance Day After (au choix)",
      "Vidéo moments clés (3-5 min)",
      "Album Luxe + coffret USB",
      "Priorité de traitement & livraison express",
    ],
  },
];