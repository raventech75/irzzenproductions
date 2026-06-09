"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0E0C10] overflow-hidden">

      {/* Photo plein fond */}
      <img
        src="/photos/1L9A7763.JPG"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
      />

      {/* Overlay dégradé */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E0C10]/90 via-[#0E0C10]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C10] via-transparent to-transparent" />

      {/* Grille architecturale */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full max-w-[1400px] mx-auto px-8 lg:px-12 flex">
          <div className="w-px bg-[#F6F2EE]/5 ml-auto mr-[33%]" />
        </div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between max-w-[1400px] mx-auto px-8 lg:px-12">

        {/* Top spacer navbar */}
        <div className="h-20" />

        {/* Main */}
        <div className="flex-1 flex flex-col justify-center py-20">

          {/* Label éditorial */}
          <div className="flex items-center gap-6 mb-12">
            <span className="block w-12 h-px bg-[#A8919E]" />
            <span className="text-[10px] tracking-[0.6em] uppercase text-[#A8919E] font-light">
              Photographe & Vidéaste — Paris
            </span>
          </div>

          {/* Titre */}
          <h1
            className="text-[clamp(56px,9vw,130px)] font-bold leading-[0.88] tracking-[-0.03em] text-[#F6F2EE] mb-10 max-w-3xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Votre<br />
            histoire,<br />
            <em className="not-italic text-gradient-gold">immortalisée.</em>
          </h1>

          {/* Sous-texte */}
          <p className="text-[#F6F2EE]/40 text-sm tracking-[0.1em] font-light max-w-sm leading-relaxed mb-14">
            15 ans d'expérience · 500+ mariages · <br />Équipe de 12 professionnels
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/tarifs"
              className="px-8 py-3.5 bg-[#F6F2EE] text-[#0E0C10] text-[11px] font-semibold tracking-[0.35em] uppercase hover:bg-white transition-colors gold-glow"
            >
              Voir nos formules
            </Link>
            <Link
              href="/galerie"
              className="flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#F6F2EE]/50 hover:text-[#F6F2EE] transition-colors group"
            >
              Découvrir le portfolio
              <span className="block w-8 h-px bg-current group-hover:w-14 transition-all duration-300" />
            </Link>
          </div>
        </div>

        {/* Stats en bas */}
        <div className="border-t border-[#F6F2EE]/8 py-8 grid grid-cols-3 gap-8 max-w-lg">
          {[
            { val: "500+", label: "Mariages" },
            { val: "15", label: "Ans d'expérience" },
            { val: "12", label: "Professionnels" },
          ].map((s) => (
            <div key={s.label}>
              <div
                className="text-2xl font-bold text-[#F6F2EE] mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {s.val}
              </div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#F6F2EE]/25">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
