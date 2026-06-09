import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos — Notre équipe",
  description:
    "15 ans d'expérience, 12 professionnels passionnés. Découvrez l'histoire et l'équipe d'Irzzen Productions, photographes et vidéastes mariage.",
};

const valeurs = [
  { titre: "Discrétion", texte: "Nous nous fondons dans votre journée pour capturer l'authenticité sans jamais la perturber." },
  { titre: "Exigence", texte: "Chaque photo est retouchée, chaque image est choisie avec soin. Rien n'est laissé au hasard." },
  { titre: "Émotion", texte: "Nous ne photographions pas des poses. Nous capturons des instants vrais, inoubliables." },
  { titre: "Fiabilité", texte: "15 ans de mariages sans un seul incident. Contrat, acompte, livraison — toujours tenu." },
];

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EF] pt-24">
      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-xs tracking-[0.5em] uppercase text-[#C4A5B5] mb-4">
              Notre histoire
            </p>
            <h1
              className="text-5xl md:text-7xl font-bold text-[#1A1520] leading-tight mb-8"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Une passion,{" "}
              <span className="text-gradient-gold italic">15 ans</span>
              {" "}de maîtrise
            </h1>
            <p className="text-[#1A1520]/50 text-lg leading-relaxed mb-6 font-light">
              Irzzen Productions est né d&apos;une conviction simple : chaque
              mariage mérite d&apos;être immortalisé avec l&apos;attention et
              l&apos;art qu&apos;il mérite.
            </p>
            <p className="text-[#1A1520]/50 text-lg leading-relaxed mb-12 font-light">
              Depuis 15 ans, notre équipe de 12 professionnels capture des
              histoires d&apos;amour à travers toute la France et au-delà.
              Chaque couple repart avec des souvenirs qui traverseront le temps.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C4A5B5] text-[#13111A] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#DEC8D6] transition-colors gold-glow"
            >
              Travailler avec nous <ArrowRight size={14} />
            </Link>
          </div>
          <div className="aspect-square bg-[#FAFAF8] border border-[#C4A5B5]/10 flex items-center justify-center text-[#C4A5B5]/20">
            <span className="text-xs tracking-widest uppercase">Photo équipe</span>
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section className="py-20 px-6 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "15+", label: "Ans d'expérience" },
              { value: "12", label: "Professionnels" },
              { value: "500+", label: "Mariages" },
              { value: "4.9★", label: "Note moyenne" },
            ].map((stat) => (
              <div key={stat.label} className="text-center glass p-8">
                <div
                  className="text-5xl font-bold text-gradient-gold mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs tracking-[0.3em] uppercase text-[#1A1520]/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.5em] uppercase text-[#C4A5B5] mb-4">Ce qui nous guide</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#1A1520]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Nos <span className="text-gradient-gold italic">valeurs</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valeurs.map((v) => (
              <div key={v.titre} className="glass p-8 flex gap-6">
                <div className="w-px bg-gradient-to-b from-[#C4A5B5] to-transparent flex-shrink-0" />
                <div>
                  <h3
                    className="text-xl font-bold text-[#1A1520] mb-3"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {v.titre}
                  </h3>
                  <p className="text-sm text-[#1A1520]/50 leading-relaxed">{v.texte}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
