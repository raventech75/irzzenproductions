import Link from "next/link";
import { ArrowRight } from "lucide-react";

const photos = [
  { id: 1, aspect: "tall", placeholder: "bg-[#1C1C1C]" },
  { id: 2, aspect: "wide", placeholder: "bg-[#161616]" },
  { id: 3, aspect: "square", placeholder: "bg-[#1A1A1A]" },
  { id: 4, aspect: "tall", placeholder: "bg-[#181818]" },
  { id: 5, aspect: "wide", placeholder: "bg-[#141414]" },
];

export function GalerieApercu() {
  return (
    <section className="py-32 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-xs tracking-[0.5em] uppercase text-[#C9A84C] mb-4">
              Portfolio
            </p>
            <h2
              className="text-4xl md:text-6xl font-bold text-[#FAFAFA] leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Des instants{" "}
              <span className="text-gradient-gold italic">uniques</span>
            </h2>
          </div>
          <Link
            href="/galerie"
            className="hidden md:flex items-center gap-2 text-sm text-[#C9A84C] tracking-widest uppercase font-medium hover:gap-4 transition-all duration-300"
          >
            Voir tout
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-[600px] md:h-[700px]">
          {/* Grande photo gauche */}
          <div className="row-span-2 bg-[#1C1C1C] border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-colors overflow-hidden group cursor-pointer">
            <div className="w-full h-full bg-gradient-to-br from-[#1C1C1C] to-[#111111] flex items-center justify-center text-[#C9A84C]/20 group-hover:text-[#C9A84C]/40 transition-colors">
              <span className="text-xs tracking-widest uppercase">Photo</span>
            </div>
          </div>
          {/* Photo droite haut */}
          <div className="bg-[#161616] border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-colors overflow-hidden group cursor-pointer">
            <div className="w-full h-full bg-gradient-to-br from-[#161616] to-[#0E0E0E] flex items-center justify-center text-[#C9A84C]/20 group-hover:text-[#C9A84C]/40 transition-colors">
              <span className="text-xs tracking-widest uppercase">Photo</span>
            </div>
          </div>
          {/* Photo droite haut 2 */}
          <div className="bg-[#1A1A1A] border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-colors overflow-hidden group cursor-pointer">
            <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#101010] flex items-center justify-center text-[#C9A84C]/20 group-hover:text-[#C9A84C]/40 transition-colors">
              <span className="text-xs tracking-widest uppercase">Photo</span>
            </div>
          </div>
          {/* Photo droite bas */}
          <div className="bg-[#181818] border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-colors overflow-hidden group cursor-pointer">
            <div className="w-full h-full bg-gradient-to-br from-[#181818] to-[#0F0F0F] flex items-center justify-center text-[#C9A84C]/20 group-hover:text-[#C9A84C]/40 transition-colors">
              <span className="text-xs tracking-widest uppercase">Vidéo</span>
            </div>
          </div>
          {/* Photo droite bas 2 */}
          <div className="bg-[#141414] border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 transition-colors overflow-hidden group cursor-pointer">
            <div className="w-full h-full bg-gradient-to-br from-[#141414] to-[#0C0C0C] flex items-center justify-center text-[#C9A84C]/20 group-hover:text-[#C9A84C]/40 transition-colors">
              <span className="text-xs tracking-widest uppercase">Photo</span>
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/galerie"
            className="inline-flex items-center gap-2 text-sm text-[#C9A84C] tracking-widest uppercase font-medium"
          >
            Voir toute la galerie
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
