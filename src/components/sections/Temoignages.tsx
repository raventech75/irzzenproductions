"use client";

import { Reveal } from "@/components/ui/Reveal";

const temoignages = [
  {
    name: "Zineb & Farès", date: "Septembre 2024", formule: "Prestige",
    texte: "Nous avions peur que notre mariage ne soit pas bien retranscrit à l'image, mais l'équipe d'Irzzen a su capturer chaque émotion avec une sensibilité incroyable. Le film est à couper le souffle.",
    stars: 5,
  },
  {
    name: "Başak & Oğuzhan", date: "Juin 2024", formule: "Premium",
    texte: "Un travail cinématographique d'exception. Nos familles ont fondu en larmes en regardant le film. L'équipe est professionnelle, discrète, et vraiment passionnée par ce qu'elle fait.",
    stars: 5,
  },
  {
    name: "Inès & Ümit", date: "Avril 2024", formule: "Complète",
    texte: "La galerie privée est magnifique. Plus de 600 photos retouchées avec une cohérence artistique parfaite. Nos invités ont adoré pouvoir y accéder. Merci pour ce souvenir impérissable.",
    stars: 5,
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 mb-6">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1l1.3 3.9H11L8.2 7l1 3.1L6 8.3 2.8 10.1l1-3.1L1 4.9h3.7L6 1z"
            fill="var(--c-orange)" />
        </svg>
      ))}
    </div>
  );
}

export function Temoignages() {
  return (
    <section className="g-bg py-28">
      <div className="wrap">

        <Reveal>
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="label-tag mb-3">Témoignages</p>
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight"
                style={{ fontSize: "clamp(26px,3.5vw,48px)" }}>
                Ce que disent <span className="g-text">nos mariés</span>
              </h2>
            </div>
            <div className="hidden md:block text-right">
              <p className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] text-[26px]">4.9 / 5</p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[rgba(38,30,20,0.35)] mt-1">200+ avis vérifiés</p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {temoignages.map((t, i) => (
            <Reveal key={t.name} delay={i * 120} direction="up">
              <div className="card rounded-sm p-9 flex flex-col h-full">
                <Stars n={t.stars} />
                <p className="font-[family-name:var(--font-playfair)] italic text-[15px] text-[rgba(38,30,20,0.58)] leading-[1.8] flex-1 mb-8">
                  &ldquo;{t.texte}&rdquo;
                </p>
                <div className="flex items-end justify-between border-t border-[rgba(38,30,20,0.07)] pt-5">
                  <div>
                    <p className="font-medium text-[13px] text-[#261E14] mb-0.5">{t.name}</p>
                    <p className="text-[11px] text-[rgba(38,30,20,0.3)]">{t.date}</p>
                  </div>
                  <span className="label-tag">{t.formule}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
