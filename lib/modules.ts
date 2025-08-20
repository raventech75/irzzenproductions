// lib/modules.ts

export type FormulaOption = {
  id: string;
  name: string;
  price: number;
};

export type FormulaDetailed = {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Liste de points clés à afficher dans la carte */
  features?: string[];
  /** Options proposées pour cette formule */
  options?: FormulaOption[];
};

export const FORMULAS_DETAILED: FormulaDetailed[] = [
  {
    id: "essentielle",
    name: "Formule Essentielle",
    description:
      "Couverture photo/vidéo de la cérémonie et des moments clés, remise numérique.",
    price: 800,
    features: [
      "Cérémonie + moments clés",
      "Galerie numérique HD",
      "Montage vidéo court (si vidéo)",
    ],
    options: [
      { id: "extra-photo", name: "Séance photo avant mariage", price: 200 },
      { id: "drone", name: "Captation drone", price: 300 },
      { id: "retouches", name: "Pack retouches avancées", price: 150 },
    ],
  },
  {
    id: "classique",
    name: "Formule Classique",
    description:
      "Reportage depuis les préparatifs jusqu’au début de soirée.",
    price: 1200,
    features: [
      "Préparatifs ➜ début de soirée",
      "Tri/retouche des meilleures photos",
      "Clip vidéo des moments forts",
    ],
    options: [
      { id: "album", name: "Album photo haut de gamme", price: 250 },
      { id: "second-shooter", name: "Deuxième photographe", price: 400 },
      { id: "drone", name: "Captation drone", price: 300 },
    ],
  },
  {
    id: "premium",
    name: "Formule Premium",
    description:
      "Couverture complète photo + vidéo (préparatifs, cérémonie, cocktail, soirée).",
    price: 2000,
    features: [
      "Photo + Vidéo toute la journée",
      "Teaser réseaux sociaux",
      "Film souvenir 8–12 min",
    ],
    options: [
      { id: "video-longue", name: "Vidéo longue (30 min)", price: 400 },
      { id: "teaser", name: "Teaser 2 min pour réseaux sociaux", price: 200 },
      { id: "album", name: "Album photo luxe", price: 350 },
    ],
  },
  {
    id: "prestige",
    name: "Formule Prestige",
    description:
      "Expérience ultime : photo + vidéo + drone + teaser + album luxe.",
    price: 3000,
    features: [
      "Équipe renforcée (photo + vidéo)",
      "Drone inclus (si autorisé)",
      "Album luxe & coffret USB",
    ],
    options: [
      { id: "second-shooter", name: "Deuxième photographe", price: 400 },
      { id: "afterday", name: "Séance After Day", price: 500 },
    ],
  },
];

// Formatage €
export const eur = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(value);