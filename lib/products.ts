// lib/products.ts

export type OptionItem = {
  id: string;
  label: string;
  price: number;
  description?: string;
  icon?: string;
  category?: string;
  popular?: boolean;
};

export const OPTIONS: OptionItem[] = [
  { 
    id: "shooting_preparatifs", 
    label: "Shooting des préparatifs", 
    price: 200,
    description: "Reportage photo des préparatifs de la mariée et/ou du marié",
    icon: "📸",
    category: "photo",
    popular: true
  },
  { 
    id: "drone", 
    label: "Drone", 
    price: 400,
    description: "Prises de vue aériennes pour des perspectives uniques",
    icon: "🚁",
    category: "equipment",
    popular: true
  },
  { 
    id: "clef_usb_sup", 
    label: "Clef USB supplémentaire", 
    price: 50,
    description: "Clé USB personnalisée avec toutes vos photos",
    icon: "💾",
    category: "delivery"
  },
  { 
    id: "projection_jour_j", 
    label: "Projection jour J", 
    price: 300,
    description: "Diffusion en direct des photos pendant la réception",
    icon: "📽️",
    category: "equipment"
  },
  { 
    id: "kina_henne", 
    label: "Kina / Henné (Lundi au Jeudi)", 
    price: 1500,
    description: "Reportage complet de la cérémonie de henné",
    icon: "🎨",
    category: "photo",
    popular: true
  },
  {
    id: "album_photo",
    label: "Album photo premium",
    price: 350,
    description: "Album papier haute qualité avec vos plus belles photos",
    icon: "📖",
    category: "delivery"
  },
  {
    id: "retouche_avancee",
    label: "Retouche avancée",
    price: 250,
    description: "Retouche artistique poussée sur une sélection de photos",
    icon: "🎨",
    category: "postproduction",
    popular: true
  },
  {
    id: "film_long",
    label: "Film long (15-20min)",
    price: 500,
    description: "Film documentaire complet de votre journée",
    icon: "🎬",
    category: "video"
  },
  {
    id: "livestream",
    label: "Livestream cérémonie",
    price: 450,
    description: "Diffusion en direct pour vos proches à distance",
    icon: "📺",
    category: "equipment"
  },
  {
    id: "second_photographe",
    label: "Second photographe",
    price: 600,
    description: "Photographe supplémentaire pour multiplier les angles",
    icon: "📷",
    category: "photo"
  },
  {
    id: "seance_couple",
    label: "Séance couple",
    price: 300,
    description: "Séance photo romantique avant ou après le mariage",
    icon: "💕",
    category: "photo",
    popular: true
  },
  {
    id: "timelapse",
    label: "Timelapse",
    price: 200,
    description: "Vidéo accélérée de moments clés de votre journée",
    icon: "⏰",
    category: "video"
  }
];

export const CATEGORY_LABELS = {
  photo: "📸 Photo",
  video: "🎬 Vidéo", 
  equipment: "🎛️ Équipement",
  postproduction: "✨ Post-production",
  delivery: "📦 Livraison"
};

export const euros = (n: number) =>
  `${n.toLocaleString("fr-FR").replace(/\u202F/g, " ").replace(/\u00A0/g, " ")} €`;

export const getOptionsByCategory = () => {
  const categories: Record<string, OptionItem[]> = {};
  
  OPTIONS.forEach(option => {
    const category = option.category || "other";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(option);
  });
  
  return categories;
};

export const getPopularOptions = () => {
  return OPTIONS.filter(option => option.popular === true);
};

export const getOptionById = (id: string) => {
  return OPTIONS.find(option => option.id === id);
};

export const getCategoryName = (category: string) => {
  return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category;
};