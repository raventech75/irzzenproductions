import Link from "next/link";

const services = [
  {
    num: "01",
    title: "Photographie",
    desc:  "Un reportage photo complet de votre jour J. Chaque regard, chaque larme, chaque sourire capturés avec une sensibilité artistique unique.",
    prix:  "Dès 890 €",
    href:  "/mariage",
    dot:   "bg-[#E8A87C]",
    price_color: "text-[#E8A87C]",
  },
  {
    num: "02",
    title: "Vidéographie",
    desc:  "Un film cinématographique de votre mariage. Teaser, long métrage, drone — votre histoire racontée comme au cinéma.",
    prix:  "Dès 1 490 €",
    href:  "/mariage",
    dot:   "bg-[#DFA0AE]",
    price_color: "text-[#DFA0AE]",
  },
  {
    num: "03",
    title: "Formule Complète",
    desc:  "Photo et vidéo réunis pour immortaliser chaque instant. La solution la plus complète pour votre mariage.",
    prix:  "Dès 2 190 €",
    href:  "/tarifs",
    dot:   "bg-[#8FAF78]",
    price_color: "text-[#8FAF78]",
  },
];

export function Services() {
  return (
    <section className="bg-[#FDFAF7] py-28">
      <div className="wrap">

        {/* En-tête */}
        <div className="flex items-end justify-between pb-10 mb-0 border-b border-[rgba(38,30,20,0.07)]">
          <div>
            <p className="label-tag mb-3">Nos prestations</p>
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight"
              style={{ fontSize: "clamp(28px,3.5vw,48px)" }}>
              Ce que nous offrons
            </h2>
          </div>
          <Link href="/tarifs" className="hidden md:flex btn-ghost text-[10px] py-[10px] px-5">
            Voir les formules
          </Link>
        </div>

        {/* Liste */}
        {services.map(s => (
          <Link
            key={s.num}
            href={s.href}
            className="group flex items-center gap-6 py-9 border-b border-[rgba(38,30,20,0.07)] no-underline hover:bg-[rgba(38,30,20,0.015)] transition-colors -mx-12 px-12"
          >
            {/* Numéro */}
            <span className="hidden md:block text-[11px] tracking-[0.35em] text-[rgba(38,30,20,0.28)] w-10 shrink-0">
              {s.num}
            </span>

            {/* Dot couleur */}
            <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />

            {/* Titre */}
            <h3 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] w-52 shrink-0"
              style={{ fontSize: "clamp(18px,2.2vw,26px)" }}>
              {s.title}
            </h3>

            {/* Description */}
            <p className="flex-1 text-[14px] text-[rgba(38,30,20,0.45)] font-light leading-[1.65] hidden md:block">
              {s.desc}
            </p>

            {/* Prix + flèche */}
            <div className="ml-auto text-right shrink-0">
              <div className={`text-[13px] font-medium mb-1 ${s.price_color}`}>{s.prix}</div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-[rgba(38,30,20,0.3)] group-hover:text-[#261E14] transition-colors">
                Découvrir →
              </div>
            </div>
          </Link>
        ))}

        <div className="pt-10">
          <Link href="/tarifs" className="btn-fill">Voir toutes les formules</Link>
        </div>
      </div>
    </section>
  );
}
