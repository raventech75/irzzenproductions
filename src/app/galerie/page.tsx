import type { Metadata } from "next";
import { GalerieClient } from "./GalerieClient";

export const metadata: Metadata = {
  title: "Galerie Portfolio",
  description:
    "Découvrez notre portfolio de photographie et vidéographie de mariage. Des centaines d'histoires immortalisées avec art et émotion.",
};

export default function GaleriePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24">
      <section className="py-20 px-6 text-center">
        <p className="text-xs tracking-[0.5em] uppercase text-[#C9A84C] mb-4">
          Portfolio
        </p>
        <h1
          className="text-5xl md:text-7xl font-bold text-[#FAFAFA] leading-tight mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Nos plus belles{" "}
          <span className="text-gradient-gold italic">histoires</span>
        </h1>
        <p className="text-[#FAFAFA]/50 text-lg max-w-xl mx-auto font-light">
          Chaque image raconte une émotion. Chaque film, une vie.
        </p>
      </section>
      <GalerieClient />
    </div>
  );
}
