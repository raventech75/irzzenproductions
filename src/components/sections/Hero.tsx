import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden g-bg">

      {/* Photo — droite */}
      <div className="absolute right-0 top-0 bottom-0 w-[52%] overflow-hidden">
        <img
          src="/photos/Faiza & Feridun -  276.jpg"
          alt="Mariage Faiza & Feridun — Irzzen Productions"
          className="w-full h-full object-cover object-center"
        />
        {/* Fondu gauche */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to right, #FDF0E6 0%, transparent 45%)" }}
        />
      </div>

      {/* Contenu gauche */}
      <div className="relative z-10 wrap min-h-screen flex flex-col justify-center pt-[70px]">
        <div className="max-w-[560px] py-20">

          {/* Tag */}
          <div className="flex items-center gap-4 mb-8">
            <span className="g-bar block h-[2px] w-8 rounded-full" />
            <span className="label-tag">Photographe &amp; Vidéaste Mariage — Paris</span>
          </div>

          {/* Titre */}
          <h1 className="font-[family-name:var(--font-playfair)] font-bold leading-[0.92] tracking-[-0.025em] text-[#261E14] mb-8"
            style={{ fontSize: "clamp(52px,7.5vw,112px)" }}>
            Votre<br />histoire,<br />
            <span className="g-text">immortalisée.</span>
          </h1>

          {/* Accroche */}
          <p className="text-[15px] text-[rgba(38,30,20,0.5)] font-light leading-[1.72] mb-10 max-w-[400px]">
            15 ans d'expérience, 1 500 mariages capturés avec passion et précision artistique.
          </p>

          {/* Boutons */}
          <div className="flex flex-wrap gap-3 mb-14">
            <Link href="/galerie" className="btn-fill">Voir le portfolio</Link>
            <Link href="/tarifs"  className="btn-ghost">Nos formules</Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 pt-8 border-t border-[rgba(38,30,20,0.08)]">
            {[
              { v: "1 500+",  l: "Mariages" },
              { v: "15 ans",l: "D'expérience" },
              { v: "12",    l: "Professionnels" },
            ].map(s => (
              <div key={s.l}>
                <div className="font-[family-name:var(--font-playfair)] font-bold text-[21px] text-[#261E14] mb-1">{s.v}</div>
                <div className="text-[10px] tracking-[0.35em] uppercase text-[rgba(38,30,20,0.35)]">{s.l}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
