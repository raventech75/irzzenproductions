import type { Metadata } from "next";
import { Configurateur } from "./Configurateur";

export const metadata: Metadata = {
  title: "Tarifs & Formules",
  description: "Configurez votre prestation mariage sur-mesure.",
};

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF7]">

      {/* Hero section */}
      <div className="wrap pt-[120px] pb-14">
        <p className="label-tag mb-4">Tarifs &amp; Formules</p>
        <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight leading-[0.94] mb-5"
          style={{ fontSize: "clamp(36px,5vw,70px)" }}>
          Configurez votre <span className="g-text">prestation</span>
        </h1>
        <p className="text-[15px] text-[rgba(38,30,20,0.45)] font-light leading-[1.7] max-w-lg">
          Choisissez la formule qui correspond à votre mariage et personnalisez-la avec vos options.
        </p>
      </div>

      <Configurateur />
    </div>
  );
}
