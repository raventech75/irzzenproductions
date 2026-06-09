const temoignages = [
  {
    name: "Sophie & Karim", date: "Juillet 2024", formule: "Prestige",
    texte: "Une équipe exceptionnelle qui a su saisir chaque émotion de notre mariage. Les photos sont d'une beauté à couper le souffle. Nous recommandons Irzzen Productions les yeux fermés.",
  },
  {
    name: "Marie & Thomas", date: "Mai 2024", formule: "Premium",
    texte: "Le film de notre mariage nous a fait pleurer de joie. Un travail cinématographique remarquable, une équipe professionnelle et chaleureuse. Merci infiniment.",
  },
  {
    name: "Leïla & Youssef", date: "Juin 2024", formule: "Complète",
    texte: "Parfait du début à la fin. La galerie privée pour partager les photos avec nos proches est une excellente idée. Un service vraiment premium.",
  },
];

export function Temoignages() {
  return (
    <section className="g-bg py-28">
      <div className="wrap">

        {/* En-tête */}
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

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {temoignages.map((t, i) => (
            <div key={t.name} className="card rounded-sm p-9 flex flex-col">
              {/* Barre accent */}
              <div className={`h-[2px] w-10 rounded-full mb-7 g-bar`} style={{ opacity: 0.6 + i * 0.15 }} />

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
          ))}
        </div>

      </div>
    </section>
  );
}
