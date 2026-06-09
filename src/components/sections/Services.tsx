import Link from "next/link";

const services = [
  {
    num: "01",
    title: "Photographie",
    sub: "Mariage",
    description: "Un reportage photo complet de votre jour J. Chaque regard, chaque larme, chaque sourire capturés avec une sensibilité artistique unique.",
    features: ["200 à photos illimitées", "Livraison 4 semaines", "Retouche professionnelle"],
    href: "/mariage#photo",
    tag: "Dès 890 €",
  },
  {
    num: "02",
    title: "Vidéographie",
    sub: "Cinématique",
    description: "Un film cinématographique de votre mariage. Teaser, long métrage, drone — votre histoire racontée comme au cinéma.",
    features: ["Film court & long métrage", "Drone inclus", "Montage cinématographique"],
    href: "/mariage#video",
    tag: "Inclus dès 1 490 €",
  },
  {
    num: "03",
    title: "Formations",
    sub: "Professionnelles",
    description: "Apprenez les secrets du reportage mariage avec nos photographes. Formations pratiques et théoriques adaptées à tous niveaux.",
    features: ["Petits groupes", "Matériel fourni", "Certification"],
    href: "/formations",
    tag: "Sur inscription",
  },
];

export function Services() {
  return (
    <section className="bg-[#F6F2EE] py-32">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">

        {/* Header */}
        <div className="flex items-baseline gap-6 mb-20 border-b border-[#0E0C10]/10 pb-8">
          <span
            className="text-[clamp(48px,7vw,96px)] font-bold leading-none text-[#0E0C10]/6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            03
          </span>
          <div>
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#A8919E] mb-2">Nos prestations</p>
            <h2
              className="text-3xl md:text-5xl font-bold text-[#0E0C10]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Un service <em className="not-italic text-gradient-gold">complet</em>
            </h2>
          </div>
        </div>

        {/* Services — liste éditoriale */}
        <div className="divide-y divide-[#0E0C10]/8">
          {services.map((s) => (
            <div key={s.num} className="group py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start hover:bg-[#0E0C10]/[0.015] transition-colors -mx-8 px-8">

              {/* Numéro */}
              <div className="lg:col-span-1">
                <span className="text-[11px] tracking-[0.4em] text-[#A8919E]/60">{s.num}</span>
              </div>

              {/* Titre */}
              <div className="lg:col-span-3">
                <h3
                  className="text-2xl lg:text-3xl font-bold text-[#0E0C10] leading-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {s.title}
                  <br />
                  <span className="text-gradient-gold italic">{s.sub}</span>
                </h3>
                <div className="mt-3 text-xs tracking-[0.2em] uppercase text-[#A8919E] font-medium">{s.tag}</div>
              </div>

              {/* Description */}
              <div className="lg:col-span-5">
                <p className="text-[#0E0C10]/50 text-sm leading-relaxed font-light mb-6">{s.description}</p>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#0E0C10]/35">
                      <span className="w-3 h-px bg-[#A8919E]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="lg:col-span-3 lg:text-right">
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#0E0C10]/40 group-hover:text-[#0E0C10] transition-colors"
                >
                  Découvrir
                  <span className="block w-6 h-px bg-current group-hover:w-10 transition-all duration-300" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
