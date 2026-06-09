import { Star } from "lucide-react";

const temoignages = [
  {
    name: "Sophie & Karim",
    date: "Juillet 2024",
    note: 5,
    texte:
      "Une équipe exceptionnelle qui a su saisir chaque émotion de notre mariage. Les photos sont d'une beauté à couper le souffle. Nous recommandons Irzzen Productions les yeux fermés.",
    formule: "Formule Prestige",
  },
  {
    name: "Marie & Thomas",
    date: "Mai 2024",
    note: 5,
    texte:
      "Le film de notre mariage nous a fait pleurer de joie. Un travail cinématographique remarquable, une équipe professionnelle et chaleureuse. Merci infiniment.",
    formule: "Formule Premium",
  },
  {
    name: "Leïla & Youssef",
    date: "Juin 2024",
    note: 5,
    texte:
      "Parfait du début à la fin. La galerie privée pour partager les photos avec nos proches est une excellente idée. Un service vraiment premium.",
    formule: "Formule Complète",
  },
];

export function Temoignages() {
  return (
    <section className="py-32 px-6 bg-[#F7F3EF]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.5em] uppercase text-[#C4A5B5] mb-4">
            Témoignages
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold text-[#1A1520] leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ce que disent{" "}
            <span className="text-gradient-gold italic">nos mariés</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {temoignages.map((t) => (
            <div key={t.name} className="glass p-8 flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.note }).map((_, i) => (
                  <Star key={i} size={14} className="fill-[#C4A5B5] text-[#C4A5B5]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#1A1520]/60 text-sm leading-relaxed flex-1 mb-8 italic">
                &ldquo;{t.texte}&rdquo;
              </p>

              {/* Author */}
              <div className="border-t border-[#C4A5B5]/15 pt-6 flex items-center justify-between">
                <div>
                  <div className="text-[#1A1520] font-medium text-sm">{t.name}</div>
                  <div className="text-[#1A1520]/30 text-xs mt-0.5">{t.date}</div>
                </div>
                <div className="text-xs text-[#C4A5B5]/60 tracking-wide">{t.formule}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Note globale */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 glass px-8 py-4">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-[#C4A5B5] text-[#C4A5B5]" />
              ))}
            </div>
            <span className="text-[#1A1520]/60 text-sm">
              <strong className="text-[#1A1520]">4.9/5</strong> basé sur 200+ avis
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
