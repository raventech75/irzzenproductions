// lib/modules.ts

// === Types ===
export type Specs = {
  shootingPreparatifs?: boolean;
  prisesMairie?: boolean;
  seanceCouple?: boolean;
  videoMomentsCles?: boolean;
  cameramen?: 1 | 2;
  drone?: boolean;

  montageComplet?: boolean;
  albumNumerique?: boolean;
  albumImprime?: null | { size: "30x30" | "40x30"; extras?: string[] };
  usb?: boolean;

  projectionEcran?: null | "videos" | "photos+videos";
  projectionBestMoments?: boolean;
  liveYoutube?: boolean;
};

export type FormulaDef = {
  id: "essentielle" | "prestige" | "excellence" | "luxe";
  title: string;
  price: number;
  specs: Specs;
};

export type OptionDef = {
  id: "preparatifs" | "drone" | "usb_plus" | "projection_jj" | "kina_henne";
  label: string;
  price: number;
};

// === Dictionnaire d’affichage ===
export const MODULE_RENDERERS: Array<{
  key: keyof Specs;
  render: (v: any) => string | null;
  order: number;
}> = [
  { key: "shootingPreparatifs", order: 10, render: v => (v ? "Shooting des préparatifs" : null) },
  { key: "prisesMairie",        order: 20, render: v => (v ? "Prises de vue à la mairie" : null) },
  { key: "seanceCouple",        order: 30, render: v => (v ? "Séance photo de couple" : null) },
  { key: "videoMomentsCles",    order: 40, render: v => (v ? "Vidéo des moments clés" : null) },
  { key: "cameramen",           order: 50, render: (n?: number) => (n ? `${n} caméraman${n > 1 ? "s" : ""}` : null) },
  { key: "drone",               order: 60, render: v => (v ? "Prestations drone — vues aériennes" : null) },
  { key: "montageComplet",      order: 70, render: v => (v ? "Montage vidéo complet" : null) },
  { key: "albumNumerique",      order: 80, render: v => (v ? "Album photo numérique" : null) },
  {
    key: "albumImprime",
    order: 90,
    render: (obj?: Specs["albumImprime"]) =>
      obj ? `Album imprimé de luxe (${obj.size}${obj.extras?.length ? " + " + obj.extras.join(" + ") : ""})` : null
  },
  {
    key: "projectionEcran",
    order: 100,
    render: (v?: Specs["projectionEcran"]) =>
      v === "videos"
        ? "Projection des vidéos sur écran durant la soirée"
        : v === "photos+videos"
        ? "Projection des photos et vidéos sur écran durant la soirée"
        : null
  },
  { key: "projectionBestMoments", order: 110, render: v => (v ? "Projection des meilleurs moments le jour J" : null) },
  { key: "liveYoutube",         order: 120, render: v => (v ? "Diffusion en direct sur YouTube" : null) },
  { key: "usb",                 order: 130, render: v => (v ? "Clé USB" : null) }
];

// === Formules ===
export const FORMULAS_DETAILED: FormulaDef[] = [
  {
    id: "essentielle",
    title: "Formule 1 : Essentielle",
    price: 1800,
    specs: {
      prisesMairie: true,
      seanceCouple: true,
      videoMomentsCles: true,
      cameramen: 1,
      montageComplet: true,
      albumNumerique: true,
      usb: true
    }
  },
  {
    id: "prestige",
    title: "Formule 2 : Prestige",
    price: 2800,
    specs: {
      prisesMairie: true,
      seanceCouple: true,
      videoMomentsCles: true,
      cameramen: 1,
      montageComplet: true,
      albumNumerique: true,
      albumImprime: { size: "30x30" },
      drone: true,
      usb: true
    }
  },
  {
    id: "excellence",
    title: "Formule 3 : Excellence",
    price: 3800,
    specs: {
      shootingPreparatifs: true,
      prisesMairie: true,
      seanceCouple: true,
      videoMomentsCles: true,
      cameramen: 2,
      montageComplet: true,
      albumNumerique: true,
      albumImprime: { size: "40x30" },
      drone: true,
      projectionEcran: "videos",
      usb: true
    }
  },
  {
    id: "luxe",
    title: "Formule 4 : Luxe",
    price: 4800,
    specs: {
      shootingPreparatifs: true,
      prisesMairie: true,
      seanceCouple: true,
      videoMomentsCles: true,
      cameramen: 2,
      montageComplet: true,
      albumNumerique: true,
      albumImprime: { size: "40x30", extras: ["15x21(x2)"] },
      drone: true,
      liveYoutube: true,
      projectionEcran: "photos+videos",
      projectionBestMoments: true,
      usb: true
    }
  }
];

// === Options (à la carte) ===
export const OPTIONS_DETAILED = [
  { id: "preparatifs",   label: "Shooting des préparatifs", price: 200 },
  { id: "drone",         label: "Drone (vues aériennes)",   price: 400 },
  { id: "usb_plus",      label: "Clé USB supplémentaire",   price: 50  },
  { id: "projection_jj", label: "Projection le jour J",     price: 300 },
  { id: "kina_henne",    label: "Kina / Henné (Lun-Jeu)",   price: 1500 }
] as const;

// === Helpers ===
export const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;

export function specsToBullets(specs: Specs): string[] {
  return MODULE_RENDERERS
    .sort((a, b) => a.order - b.order)
    .map(m => m.render(specs[m.key]))
    .filter((x): x is string => Boolean(x));
}