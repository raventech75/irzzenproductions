// lib/modules.ts

/** Version détaillée pour l’UI + PDF */
export interface FormulaDetailed {
  id: string;
  label: string;
  price: number;
  features: string[];
}

export const FORMULAS_DETAILED: FormulaDetailed[] = [
  {
    id: "essentielle",
    label: "Formule 1 : Essentielle",
    price: 1800,
    features: [
      "Prises de vue à la mairie",
      "Séance photo de couple",
      "Vidéo des moments clés",
      "1 caméraman",
      "Montage vidéo complet",
      "Album photo numérique",
      "Clef USB",
    ],
  },
  {
    id: "prestige",
    label: "Formule 2 : Prestige",
    price: 2800,
    features: [
      "Prises de vue à la mairie",
      "Séance photo de couple",
      "Vidéo des moments clés",
      "1 caméraman",
      "Montage vidéo complet",
      "Album photo numérique et imprimé (30x30)",
      "Prestations drone pour vues aériennes",
      "Clef USB",
    ],
  },
  {
    id: "excellence",
    label: "Formule 3 : Excellence",
    price: 3800,
    features: [
      "Shooting préparatifs",
      "Prises de vue à la mairie",
      "Séance photo de couple",
      "Vidéo des moments clés",
      "2 caméramans",
      "Montage vidéo complet",
      "Album photo numérique et imprimé de luxe (40x30)",
      "Prestations drone pour vues aériennes",
      "Projection vidéos sur écran durant la soirée",
      "Clef USB",
    ],
  },
  {
    id: "luxe",
    label: "Formule 4 : Luxe",
    price: 4800,
    features: [
      "Shooting préparatifs",
      "Prises de vue à la mairie",
      "Séance photo de couple",
      "Vidéo des moments clés",
      "2 caméramans",
      "Montage vidéo complet",
      "Album photo numérique et imprimé de luxe (40x30 + 15x21(x2))",
      "Prestations drone pour vues aériennes",
      "Diffusion en direct sur YouTube",
      "Projection des photos et vidéos sur écran durant la soirée",
      "Projection des meilleurs moments le jour J",
      "Clef USB",
    ],
  },
];

/** Accès par id si besoin côté serveur */
export const FORMULAS_DETAILED_BY_ID: Record<string, FormulaDetailed> =
  Object.fromEntries(FORMULAS_DETAILED.map((f) => [f.id, f]));