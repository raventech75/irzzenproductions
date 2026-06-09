export type Categorie = "photo" | "video" | "equipement" | "postprod" | "livraison";

export interface Formule {
  id: string;
  nom: string;
  prix: number;
  tag?: string;
  duree: string;
  description: string;
  inclus: string[];
  populaire?: boolean;
}

export interface Option {
  id: string;
  nom: string;
  prix: number;
  description: string;
  categorie: Categorie;
}

export const formules: Formule[] = [
  {
    id: "essentielle",
    nom: "Essentielle",
    prix: 890,
    duree: "4h de couverture",
    description: "L'essentiel pour immortaliser les temps forts de votre cérémonie.",
    inclus: [
      "4h de reportage photo",
      "200 photos retouchées",
      "Galerie privée en ligne",
      "Livraison sous 4 semaines",
    ],
  },
  {
    id: "classique",
    nom: "Classique",
    prix: 1490,
    duree: "8h de couverture",
    description: "Un reportage complet de la journée, de la préparation à la soirée.",
    inclus: [
      "8h de reportage photo",
      "400+ photos retouchées",
      "Film mariage 5-10 min",
      "Galerie privée en ligne",
      "Livraison sous 5 semaines",
    ],
  },
  {
    id: "complete",
    nom: "Complète",
    prix: 1690,
    tag: "Populaire",
    duree: "12h de couverture",
    description: "Une couverture intégrale par un professionnel alliant photo et vidéo.",
    inclus: [
      "12h de reportage photo & vidéo",
      "500+ photos retouchées",
      "Film mariage 10-15 min",
      "Teaser 60 secondes",
      "Galerie privée en ligne",
      "Livraison sous 5 semaines",
    ],
    populaire: true,
  },
  {
    id: "premium",
    nom: "Premium",
    prix: 3490,
    duree: "12h · Équipe dédiée",
    description: "Deux photographes et un vidéaste pour ne manquer aucun instant.",
    inclus: [
      "12h avec équipe dédiée (2 photo + 1 vidéo)",
      "500+ photos retouchées",
      "Film cinéma 15-20 min",
      "Teaser 90 secondes",
      "Drone inclus",
      "Album premium 30x30",
      "Galerie privée en ligne",
      "Livraison sous 6 semaines",
    ],
  },
  {
    id: "prestige",
    nom: "Prestige",
    prix: 3890,
    tag: "Collection",
    duree: "12h+ · Équipe complète",
    description: "Notre offre la plus complète pour un mariage d'exception.",
    inclus: [
      "12h+ avec équipe complète",
      "Photos illimitées retouchées",
      "Film cinéma 20-30 min",
      "Teaser 2 min",
      "Drone inclus",
      "Séance couple offerte",
      "Album luxe 40x40",
      "Tirage Fine Art 60x90 cm",
      "Galerie privée en ligne",
      "Livraison sous 6 semaines",
    ],
  },
];

export const options: Option[] = [
  {
    id: "preparatifs",
    nom: "Shooting préparatifs",
    prix: 200,
    description: "Couverture des préparatifs de la mariée et du marié séparément.",
    categorie: "photo",
  },
  {
    id: "drone",
    nom: "Drone",
    prix: 400,
    description: "Prises de vue aériennes de votre lieu de réception et de la cérémonie.",
    categorie: "equipement",
  },
  {
    id: "henne",
    nom: "Cérémonie du henné",
    prix: 1500,
    description: "Reportage complet photo & vidéo de la soirée henné.",
    categorie: "video",
  },
  {
    id: "retouche",
    nom: "Retouche avancée",
    prix: 250,
    description: "Retouche poussée sur 50 photos sélectionnées (peau, lumière, composition).",
    categorie: "postprod",
  },
  {
    id: "seance-couple",
    nom: "Séance couple",
    prix: 300,
    description: "Séance photo de couple (1h30) avant ou après le mariage.",
    categorie: "photo",
  },
  {
    id: "album",
    nom: "Album premium 30x30",
    prix: 450,
    description: "Album photo relié cuir, impression Fine Art, 40 pages.",
    categorie: "livraison",
  },
  {
    id: "tirage",
    nom: "Tirage Fine Art 60x90",
    prix: 180,
    description: "Tirage photo d'art sur papier Hahnemühle, encadré.",
    categorie: "livraison",
  },
  {
    id: "teaser",
    nom: "Teaser 60 secondes",
    prix: 300,
    description: "Court métrage émotionnel livré dans les 2 semaines.",
    categorie: "video",
  },
];

export const categorieLabels: Record<Categorie, string> = {
  photo: "Photo",
  video: "Vidéo",
  equipement: "Équipement",
  postprod: "Post-production",
  livraison: "Livraison",
};
