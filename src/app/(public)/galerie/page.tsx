import type { Metadata } from "next";
import { GalerieClient } from "./GalerieClient";

export const metadata: Metadata = {
  title: "Galerie Portfolio",
  description: "Découvrez notre portfolio de photographie et vidéographie de mariage.",
};

export default function GaleriePage() {
  return (
    <div className="min-h-screen bg-[#FDFAF7]">
      <section className="g-bg pt-[140px] pb-14">
        <div className="wrap">
          <p className="label-tag mb-4">Portfolio</p>
          <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight leading-[0.93] mb-4"
            style={{ fontSize: "clamp(38px,5.5vw,80px)" }}>
            Nos plus belles <span className="g-text italic">histoires</span>
          </h1>
          <p className="text-[15px] text-[rgba(38,30,20,0.45)] font-light">
            Chaque image raconte une émotion. Chaque film, une vie.
          </p>
        </div>
      </section>
      <GalerieClient />
    </div>
  );
}
