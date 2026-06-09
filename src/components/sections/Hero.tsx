"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0A0A0A]">
        {/* Gradient overlay décoratif */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]" />
        {/* Grain subtil */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Accent doré */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#C9A84C]/5 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A84C]" />
          <span className="text-xs tracking-[0.5em] uppercase text-[#C9A84C] font-light">
            Photographe · Vidéaste · Mariage
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </div>

        {/* Titre principal */}
        <h1
          className="text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tight mb-8"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          <span className="block text-[#FAFAFA]">Votre histoire,</span>
          <span className="block text-gradient-gold italic">immortalisée</span>
          <span className="block text-[#FAFAFA]">avec art.</span>
        </h1>

        {/* Sous-titre */}
        <p className="text-lg md:text-xl text-[#FAFAFA]/50 font-light tracking-wide max-w-2xl mx-auto mb-12">
          15 ans d&apos;expérience · Équipe de 12 professionnels · Plus de 500
          mariages capturés
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/tarifs"
            className="px-10 py-4 bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#E8C96A] transition-all duration-300 gold-glow"
          >
            Réserver notre équipe
          </Link>
          <Link
            href="/galerie"
            className="px-10 py-4 border border-[#C9A84C]/40 text-[#FAFAFA]/80 text-sm font-light tracking-[0.2em] uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
          >
            Voir notre travail
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: "15+", label: "Ans d'expérience" },
            { value: "12", label: "Professionnels" },
            { value: "500+", label: "Mariages" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl font-bold text-gradient-gold mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {stat.value}
              </div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#FAFAFA]/30">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#C9A84C]/40 animate-bounce">
        <ArrowDown size={16} />
      </div>
    </section>
  );
}
