// Catalogue minimal (tu peux ajuster les intitulés/prix à volonté)
export type Item = { id: string; label: string; price: number };
export type Formula = Item & { kind: "formula" };
export type OptionItem = Item & { kind: "option" };

export const FORMULAS: Formula[] = [
  { id: "essentielle", label: "Formule 1 : Essentielle", price: 1800, kind: "formula" },
  { id: "prestige",    label: "Formule 2 : Prestige",    price: 2800, kind: "formula" },
  { id: "excellence",  label: "Formule 3 : Excellence",  price: 3800, kind: "formula" },
  { id: "luxe",        label: "Formule 4 : Luxe",        price: 4800, kind: "formula" }
];

export const OPTIONS: OptionItem[] = [
  { id: "preparatifs",    label: "Shooting des préparatifs", price: 200, kind: "option" },
  { id: "drone",          label: "Drone (vues aériennes)",   price: 400, kind: "option" },
  { id: "usb_plus",       label: "Clé USB supplémentaire",   price: 50,  kind: "option" },
  { id: "projection_jj",  label: "Projection le jour J",     price: 300, kind: "option" },
  { id: "kina_henne",     label: "Kina / Henné (Lun-Jeu)",   price: 1500,kind: "option" }
];

// Petit helper d’affichage
export const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;