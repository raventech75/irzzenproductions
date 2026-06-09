import type { Metadata } from "next";
import { GalerieClient } from "./GalerieClient";

export const metadata: Metadata = {
  title: "Galerie Portfolio",
  description:
    "Découvrez notre portfolio de photographie et vidéographie de mariage. Des centaines d'histoires immortalisées avec art et émotion.",
};

export default function GaleriePage() {
  return (
    <div className="min-h-screen bg-[#F6F2EE] pt-20">
      <section className="py-20 px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-6 mb-6">
          <span className="block w-8 h-px bg-[#A8919E]" />
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#A8919E]">Portfolio</p>
        </div>
        <h1
          className="text-5xl md:text-7xl font-bold text-[#0E0C10] leading-tight mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Nos plus belles{" "}
          <span className="text-gradient-gold italic">histoires</span>
        </h1>
        <p className="text-[#0E0C10]/40 text-base max-w-xl font-light">
          Chaque image raconte une émotion. Chaque film, une vie.
        </p>
      </section>
      <GalerieClient />
    </div>
  );
}
