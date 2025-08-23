// lib/modules.ts

export type FormulaOption = {
  id: string;
  name: string;
  price: number;
  description?: string; // Description détaillée de l'option
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
  /** Durée de couverture */
  duration?: string;
  /** Nombre de photos/vidéos estimées */
  deliverables?: string;
  /** Points forts à mettre en avant */
  highlights?: string[];
  /** Pour quel type de mariage cette formule est idéale */
  idealFor?: string;
  /** Délai de livraison */
  deliveryTime?: string;
};

export const FORMULAS_DETAILED: FormulaDetailed[] = [
  {
    id: "essentielle",
    name: "Formule Essentielle",
    description: "L'essentiel de votre mariage capturé avec soin et professionnalisme",
    price: 890,
    duration: "5-6 heures de couverture",
    deliverables: "150-200 photos + vidéo courte",
    deliveryTime: "3-4 semaines",
    idealFor: "Mariages intimistes, cérémonies simples, budgets maîtrisés",
    highlights: [
      "Rapport qualité-prix optimal",
      "Livraison rapide",
      "Galerie en ligne sécurisée"
    ],
    features: [
      "📸 Couverture photo de la cérémonie et moments clés",
      "🎥 Clip vidéo de 2-3 minutes avec musique",
      "✨ 150-200 photos HD sélectionnées et retouchées",
      "💻 Galerie en ligne privée (accès 1 an)",
      "📥 Téléchargement haute résolution inclus",
      "📱 Photos optimisées pour réseaux sociaux",
      "🎁 Droits d'usage et impression inclus"
    ],
    options: [
      { 
        id: "extra-photo", 
        name: "Séance engagement avant mariage", 
        price: 220,
        description: "Séance photo de couple d'1h30 dans un lieu de votre choix" 
      },
      { 
        id: "drone", 
        name: "Captation aérienne drone", 
        price: 320,
        description: "Prises de vues aériennes (si autorisées) + photos/vidéos drone" 
      },
      { 
        id: "retouches", 
        name: "Pack retouches avancées", 
        price: 180,
        description: "Retouches artistiques poussées sur 20 photos de votre choix" 
      },
    ],
  },
  {
    id: "classique",
    name: "Formule Classique",
    description: "Reportage complet de votre journée, des préparatifs au début de soirée",
    price: 1350,
    duration: "8-10 heures de couverture",
    deliverables: "300-400 photos + vidéo 5-8 min",
    deliveryTime: "4-5 semaines",
    idealFor: "Mariages traditionnels, journées complètes, couples souhaitant un reportage détaillé",
    highlights: [
      "Couverture complète de la journée",
      "Vidéo des moments forts incluse",
      "Reportage des préparatifs"
    ],
    features: [
      "👰 Préparatifs de la mariée (coiffure, maquillage, robe)",
      "🤵 Préparatifs du marié et témoins",
      "💒 Cérémonie civile et/ou religieuse complète",
      "🥂 Cocktail et photos de groupe",
      "🎥 Clip vidéo de 5-8 minutes avec moments forts",
      "📸 300-400 photos HD triées et retouchées",
      "💻 Galerie en ligne avec partage invités",
      "📱 Stories Instagram prêtes à publier"
    ],
    options: [
      { 
        id: "album", 
        name: "Album photo premium 30x30cm", 
        price: 280,
        description: "Album rigide 40 pages, papier photo premium, mise en page soignée" 
      },
      { 
        id: "second-shooter", 
        name: "Deuxième photographe", 
        price: 450,
        description: "Photographe supplémentaire pour multiplier les angles et moments capturés" 
      },
      { 
        id: "drone", 
        name: "Captation aérienne drone", 
        price: 320,
        description: "Prises de vues aériennes spectaculaires de votre lieu" 
      },
      { 
        id: "extended-coverage", 
        name: "Extension soirée +3h", 
        price: 350,
        description: "Prolongation de la couverture jusqu'en fin de soirée" 
      },
    ],
  },
  {
    id: "complete",
    name: "Formule Complète Photo & Vidéo",
    description: "Couverture photo et vidéo par un seul professionnel polyvalent",
    price: 1500,
    duration: "8-9 heures de couverture",
    deliverables: "300+ photos + film 8-12 min",
    deliveryTime: "4-5 semaines",
    idealFor: "Couples cherchant photo + vidéo avec un budget maîtrisé, mariages de taille moyenne",
    highlights: [
      "Photo et vidéo par un expert",
      "Budget optimisé",
      "Cohérence artistique garantie"
    ],
    features: [
      "📸 Reportage photo complet (préparatifs à soirée)",
      "🎬 Film de mariage cinématographique 8-12 minutes",
      "📱 Teaser court pour réseaux sociaux (1-2 min)",
      "✨ 300+ photos HD sélectionnées et retouchées",
      "🎵 Montage vidéo avec musique de qualité",
      "💻 Galerie en ligne photo + vidéo intégrée",
      "📥 Téléchargement HD photos et vidéos",
      "🎭 Style artistique cohérent photo/vidéo"
    ],
    options: [
      { 
        id: "drone", 
        name: "Captation aérienne drone", 
        price: 320,
        description: "Prises de vues aériennes pour photos et vidéos" 
      },
      { 
        id: "album", 
        name: "Album photo premium", 
        price: 280,
        description: "Album rigide 30x30cm avec sélection des meilleures photos" 
      },
      { 
        id: "extended-film", 
        name: "Film étendu 20 min", 
        price: 300,
        description: "Version longue du film avec plus de moments capturés" 
      },
      { 
        id: "same-day-teaser", 
        name: "Teaser jour J", 
        price: 400,
        description: "Montage express diffusé en soirée (3-4 min)" 
      },
    ],
  },
  {
    id: "premium",
    name: "Formule Premium",
    description: "Expérience photo-vidéo complète avec équipe dédiée et livrables multiples",
    price: 2200,
    duration: "12 heures de couverture",
    deliverables: "500+ photos + film 10-15 min + teaser",
    deliveryTime: "5-6 semaines",
    idealFor: "Grands mariages, couples exigeants, événements d'envergure",
    highlights: [
      "Équipe photo + vidéo dédiée",
      "Film cinématographique inclus",
      "Teaser pour réseaux sociaux"
    ],
    features: [
      "🎬 Équipe complète photo + vidéo professionnelle",
      "📽️ Film souvenir cinématographique 10-15 minutes",
      "📱 Teaser 2 minutes optimisé réseaux sociaux",
      "📸 500+ photos HD avec retouches professionnelles",
      "🚁 Captation drone incluse (si autorisée)",
      "💫 Effets spéciaux et étalonnage vidéo",
      "💝 USB personnalisée dans écrin luxe",
      "🌐 Galerie en ligne premium avec mot de passe"
    ],
    options: [
      { 
        id: "video-longue", 
        name: "Film documentaire 30-45 min", 
        price: 480,
        description: "Version longue avec interviews et moments intimes" 
      },
      { 
        id: "album-luxe", 
        name: "Album photo luxe cuir 40x30cm", 
        price: 420,
        description: "Album prestige couverture cuir, 60 pages, impression photo pro" 
      },
      { 
        id: "same-day-edit", 
        name: "Montage en direct", 
        price: 650,
        description: "Vidéo de 3-5 min montée et diffusée le jour même en soirée" 
      },
      { 
        id: "photos-instant", 
        name: "Sélection express 50 photos", 
        price: 200,
        description: "50 photos livrées sous 48h pour partage immédiat" 
      },
    ],
  },
  {
    id: "prestige",
    name: "Formule Prestige",
    description: "L'excellence absolue : équipe complète, matériel haut de gamme, livrables premium",
    price: 3200,
    duration: "Journée complète illimitée",
    deliverables: "800+ photos + film 20 min + multiples formats",
    deliveryTime: "6-8 semaines",
    idealFor: "Mariages d'exception, châteaux, événements luxe, couples célébrités",
    highlights: [
      "Équipe de 3 professionnels",
      "Matériel professionnel haut de gamme",
      "Livrables multiples inclus"
    ],
    features: [
      "👥 Équipe de 3 : photographe principal + vidéaste + assistant",
      "📷 Matériel professionnel haut de gamme (Canon R5, optiques L)",
      "🎬 Film cinématographique 20 minutes + making-of",
      "📸 800+ photos avec retouches artistiques individuelles",
      "🚁 Drone professionnel inclus + pilote certifié",
      "💎 Album cuir luxe 50x35cm + coffret USB cristal",
      "⚡ Livraison express 50 photos sous 24h",
      "🎁 Tirage d'art grand format offert (60x40cm)"
    ],
    options: [
      { 
        id: "second-shooter", 
        name: "Photographe supplémentaire", 
        price: 450,
        description: "4ème professionnel pour couverture exhaustive" 
      },
      { 
        id: "afterday", 
        name: "Séance After Day", 
        price: 580,
        description: "Séance photo le lendemain en tenue de mariés (2h)" 
      },
      { 
        id: "engagement-session", 
        name: "Séance engagement premium", 
        price: 380,
        description: "Séance photo de fiançailles 2h + 50 photos retouchées" 
      },
      { 
        id: "live-streaming", 
        name: "Retransmission en direct", 
        price: 750,
        description: "Diffusion live professionnelle HD pour invités distants" 
      },
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