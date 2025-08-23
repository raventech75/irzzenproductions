// lib/products.ts

export type Option = {
  id: string;
  label: string;
  price: number;
  description?: string;
  category: 'photo' | 'video' | 'album' | 'service' | 'tech' | 'extra';
  popular?: boolean; // Option populaire à mettre en avant
  icon?: string; // Emoji ou icône pour l'affichage
};

export const OPTIONS: Option[] = [
  // 📸 PHOTO
  {
    id: "second-photographer",
    label: "Deuxième photographe",
    price: 450,
    description: "Photographe supplémentaire pour multiplier les angles et ne rien manquer",
    category: "photo",
    popular: true,
    icon: "👥"
  },
  {
    id: "engagement-session",
    label: "Séance engagement",
    price: 280,
    description: "Séance photo de couple 1h30 avant le mariage (lieu au choix)",
    category: "photo",
    icon: "💕"
  },
  {
    id: "trash-the-dress",
    label: "Séance After Day",
    price: 380,
    description: "Séance photo créative le lendemain en tenue de mariés",
    category: "photo",
    icon: "🎭"
  },
  {
    id: "boudoir-session",
    label: "Séance boudoir mariée",
    price: 320,
    description: "Séance photo intime et sensuelle avant le mariage",
    category: "photo",
    icon: "💃"
  },
  {
    id: "family-portraits",
    label: "Portraits famille étendus",
    price: 150,
    description: "Séance dédiée aux photos de famille avec tous les proches",
    category: "photo",
    icon: "👨‍👩‍👧‍👦"
  },

  // 🎥 VIDÉO
  {
    id: "drone-footage",
    label: "Captation drone",
    price: 350,
    description: "Prises de vues aériennes spectaculaires (si autorisées)",
    category: "tech",
    popular: true,
    icon: "🚁"
  },
  {
    id: "same-day-edit",
    label: "Montage en direct",
    price: 680,
    description: "Vidéo montée et diffusée le soir même pendant la soirée",
    category: "video",
    icon: "⚡"
  },
  {
    id: "ceremony-livestream",
    label: "Retransmission live",
    price: 480,
    description: "Diffusion en direct HD pour les invités qui ne peuvent être présents",
    category: "tech",
    icon: "📺"
  },
  {
    id: "extended-highlight",
    label: "Film long format",
    price: 420,
    description: "Version étoffée du film souvenir (20-30 minutes)",
    category: "video",
    icon: "🎬"
  },
  {
    id: "raw-footage",
    label: "Rushes vidéo bruts",
    price: 200,
    description: "Accès à toutes les séquences vidéo non montées",
    category: "video",
    icon: "💾"
  },

  // 📚 ALBUMS & TIRAGES
  {
    id: "premium-album",
    label: "Album photo premium",
    price: 320,
    description: "Album rigide 30x30cm, 40 pages, couverture personnalisée",
    category: "album",
    popular: true,
    icon: "📖"
  },
  {
    id: "luxury-album",
    label: "Album luxe cuir",
    price: 480,
    description: "Album prestige cuir véritable 40x30cm, 60 pages premium",
    category: "album",
    icon: "👑"
  },
  {
    id: "parent-albums",
    label: "Albums parents (x2)",
    price: 280,
    description: "Deux albums 25x25cm pour les parents (30 pages chacun)",
    category: "album",
    icon: "👫"
  },
  {
    id: "large-prints",
    label: "Tirages grand format",
    price: 150,
    description: "3 tirages d'art 50x75cm sur papier photo premium",
    category: "album",
    icon: "🖼️"
  },
  {
    id: "canvas-print",
    label: "Toile canvas XXL",
    price: 220,
    description: "Impression sur toile 80x120cm de votre photo préférée",
    category: "album",
    icon: "🎨"
  },

  // 🛠️ SERVICES TECHNIQUES
  {
    id: "advanced-retouching",
    label: "Retouches avancées",
    price: 180,
    description: "Retouches artistiques poussées sur 25 photos de votre choix",
    category: "service",
    icon: "✨"
  },
  {
    id: "color-grading",
    label: "Étalonnage cinéma",
    price: 250,
    description: "Traitement couleur professionnel style film pour toutes vos photos",
    category: "service",
    icon: "🎨"
  },
  {
    id: "express-delivery",
    label: "Livraison express",
    price: 120,
    description: "50 photos sélectionnées livrées sous 48h",
    category: "service",
    popular: true,
    icon: "🚀"
  },
  {
    id: "social-media-pack",
    label: "Pack réseaux sociaux",
    price: 80,
    description: "20 photos optimisées + stories Instagram personnalisées",
    category: "service",
    icon: "📱"
  },

  // ⏰ TEMPS SUPPLÉMENTAIRE
  {
    id: "extra-hour",
    label: "Heure supplémentaire",
    price: 120,
    description: "Extension de la couverture (par heure)",
    category: "extra",
    icon: "⏰"
  },
  {
    id: "early-morning",
    label: "Couverture matinale étendue",
    price: 200,
    description: "Début de couverture dès 7h (préparatifs très matinaux)",
    category: "extra",
    icon: "🌅"
  },
  {
    id: "late-night",
    label: "Couverture nocturne",
    price: 250,
    description: "Extension jusqu'à 2h du matin pour fin de soirée",
    category: "extra",
    icon: "🌙"
  },

  // 🎁 BONUS & EXTRAS
  {
    id: "photo-booth",
    label: "Borne photo connectée",
    price: 380,
    description: "Borne selfie avec impressions instantanées et partage digital",
    category: "extra",
    icon: "📸"
  },
  {
    id: "guest-book",
    label: "Livre d'or photo",
    price: 150,
    description: "Album pour que vos invités laissent des messages avec leurs photos",
    category: "extra",
    icon: "📝"
  },
  {
    id: "backup-photographer",
    label: "Photographe de secours",
    price: 200,
    description: "Assurance photographe de remplacement en cas d'imprévu",
    category: "service",
    icon: "🛡️"
  },
  {
    id: "travel-allowance",
    label: "Forfait déplacement",
    price: 0, // À calculer selon distance
    description: "Frais de déplacement pour lieux éloignés (sur devis)",
    category: "extra",
    icon: "🚗"
  },
];

// Formatage prix en euros
export const euros = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(value);

// Grouper les options par catégorie
export const getOptionsByCategory = () => {
  const categories = {
    photo: OPTIONS.filter(o => o.category === 'photo'),
    video: OPTIONS.filter(o => o.category === 'video'),
    album: OPTIONS.filter(o => o.category === 'album'),
    service: OPTIONS.filter(o => o.category === 'service'),
    tech: OPTIONS.filter(o => o.category === 'tech'),
    extra: OPTIONS.filter(o => o.category === 'extra'),
  };
  
  return categories;
};

// Options populaires (pour mise en avant)
export const getPopularOptions = () => OPTIONS.filter(o => o.popular);

// Labels des catégories
export const CATEGORY_LABELS = {
  photo: "📸 Options Photo",
  video: "🎥 Options Vidéo", 
  album: "📚 Albums & Tirages",
  service: "🛠️ Services",
  tech: "💻 Technologies",
  extra: "🎁 Extras"
};