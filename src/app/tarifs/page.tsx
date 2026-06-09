import type { Metadata } from "next";
import { Configurateur } from "./Configurateur";

export const metadata: Metadata = {
  title: "Tarifs & Formules",
  description:
    "Configurez votre prestation mariage sur-mesure. 5 formules de 890€ à 3890€, options à la carte. Réservez en ligne avec acompte de 15%.",
};

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24">
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <p className="text-xs tracking-[0.5em] uppercase text-[#C9A84C] mb-4">
          Tarifs & Formules
        </p>
        <h1
          className="text-5xl md:text-7xl font-bold text-[#FAFAFA] leading-tight mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Configurez votre{" "}
          <span className="text-gradient-gold italic">prestation</span>
        </h1>
        <p className="text-[#FAFAFA]/50 text-lg max-w-2xl mx-auto font-light">
          Choisissez la formule qui correspond à votre mariage, ajoutez les options
          souhaitées et réservez en quelques clics.
        </p>
      </section>

      <Configurateur />
    </div>
  );
}
