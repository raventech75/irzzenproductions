// lib/products.ts

export type OptionItem = {
  id: string;
  label: string;
  price: number;
};

export const OPTIONS: OptionItem[] = [
  { id: "shooting_preparatifs", label: "Shooting des préparatifs", price: 200 },
  { id: "drone", label: "Drone", price: 400 },
  { id: "clef_usb_sup", label: "Clef USB supplémentaire", price: 50 },
  { id: "projection_jour_j", label: "Projection jour J", price: 300 },
  { id: "kina_henne", label: "Kina / Henne (Lundi au Jeudi)", price: 1500 },
];

export const euros = (n: number) =>
  `${n.toLocaleString("fr-FR").replace(/\u202F/g, " ").replace(/\u00A0/g, " ")} €`;