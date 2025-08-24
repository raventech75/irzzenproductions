// lib/modules.ts - Formules détaillées pour la nouvelle interface

export interface FormulaDetailed {
  id: string;
  name: string;
  title?: string;
  label?: string;
  price: number;
  description: string;
  duration?: string;
  deliverables?: string;
  deliveryTime?: string;
  idealFor?: string;
  features?: string[];
  highlights?: string[];
  isCustom?: boolean;
}

export const FORMULAS_DETAILED: FormulaDetailed[] = [
  {
    id: "essentielle",
    name: "Formule Essentielle",
    title: "Formule Essentielle",
    label: "Formule Essentielle", 
    price: 890,
    description: "L'essentiel de votre mariage capturé avec soin et professionnalisme",
    duration: "4 heures",
    deliverables: "200 photos retouchées + galerie en ligne",
    deliveryTime: "8 semaines",
    idealFor: "Mariages intimistes, cérémonies simples, couples avec budget maîtrisé",
    features: [
      "Couverture photo 4h",
      "200 photos retouchées",
      "Galerie en ligne privée",
      "Livraison sous 4 semaines"
    ],
    highlights: ["Économique", "Rapide", "Efficace"]
  },
  {
    id: "classique", 
    name: "Formule Classique",
    title: "Formule Classique",
    label: "Formule Classique",
    price: 1490,
    description: "Reportage complet de votre journée, des préparatifs au début de soirée",
    duration: "8 heures", 
    deliverables: "400+ photos retouchées + Film de mariage 5-10 minutes + clé USB + galerie",
    deliveryTime: "8 semaines",
    idealFor: "Mariages traditionnels, journées complètes, couples souhaitant un reportage détaillé",
    features: [
      "Couverture photo 8h",
      "Couverture video 8h",
      "400+ photos retouchées",
      "Galerie en ligne privée",
      "Clé USB personnalisée",
      "Livraison sous 8 semaines"
    ],
    highlights: ["Complet", "Populaire", "Équilibré"]
  },
  {
    id: "complete-photo-video",
    name: "Formule Complète Photo & Vidéo",
    title: "Formule Complète Photo & Vidéo", 
    label: "Formule Complète Photo & Vidéo",
    price: 1690,
    description: "Couverture photo et vidéo par un seul professionnel polyvalent",
    duration: "12 heures",
    deliverables: "400+ photos + film highlight + clé USB",
    deliveryTime: "8 - 12 semaines",
    idealFor: "Couples cherchant photo + vidéo avec un budget maîtrisé, mariages de taille moyenne",
    features: [
      "Couverture photo + vidéo 12h",
      "400+ photos retouchées",
      "Film highlight 5-10 min + soirée entière",
      "Galerie en ligne privée",
      "Clé USB avec photos et vidéos"
    ],
    highlights: ["Photo & Vidéo", "Polyvalent", "Moderne"]
  },
  {
    id: "premium",
    name: "Formule Premium",
    title: "Formule Premium",
    label: "Formule Premium",
    price: 3490,
    description: "Expérience photo-vidéo complète avec équipe dédiée et livrables multiples",
    duration: "12 heures",
    deliverables: "500+ photos + films multiples + album + drone",
    deliveryTime: "16-24 semaines", 
    idealFor: "Grands mariages, couples exigeants, événements d'envergure",
    features: [
      "Équipe photo + vidéo 12h",
      "500+ photos retouchées",
      "Film highlight + film long",
      "Drone (si autorisé)",
      "Album photo premium", 
      "Livraison sous 16-24 semaines"
    ],
    highlights: ["Haut de gamme", "Équipe dédiée", "Complet"]
  },
  {
    id: "prestige",
    name: "Formule Prestige",
    title: "Formule Prestige",
    label: "Formule Prestige",
    price: 3890,
    description: "L'excellence absolue : équipe complète, matériel haut de gamme, livrables premium",
    duration: "12h+",
    deliverables: "Photos illimitées + films multiples + album luxe + séance couple",
    deliveryTime: "16-24 semaines",
    idealFor: "Mariages d'exception, châteaux, événements luxe, couples célébrités",
    features: [
      "Équipe complète 12h+",
      "Couverture photo illimitée", 
      "Films multiples + documentaire",
      "Drone professionnel",
      "Album photo luxe",
      "Séance couple offerte",
      "Livraison premium sous 16-24 semaines"
    ],
    highlights: ["Luxe", "Illimité", "Exception"]
  }
];

// Helper pour rechercher une formule
export function findFormula(formulaId?: string, formulaName?: string): FormulaDetailed | null {
  if (!formulaId && !formulaName) return null;
  
  // Recherche par ID d'abord
  if (formulaId) {
    const byId = FORMULAS_DETAILED.find(f => f.id === formulaId);
    if (byId) return byId;
  }
  
  // Recherche par nom/title/label
  if (formulaName) {
    const name = formulaName.toLowerCase();
    const byName = FORMULAS_DETAILED.find(f => 
      f.name?.toLowerCase().includes(name) ||
      f.title?.toLowerCase().includes(name) ||
      f.label?.toLowerCase().includes(name)
    );
    if (byName) return byName;
  }
  
  return null;
}

// Export pour compatibilité
export { FORMULAS_DETAILED as FORMULES_DETAILLEES };
export default FORMULAS_DETAILED;