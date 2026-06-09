import Link from "next/link";
import { Camera, Film, GraduationCap, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Camera,
    title: "Photographie Mariage",
    description:
      "Un reportage photo complet de votre jour J. Chaque regard, chaque larme, chaque sourire capturés avec une sensibilité artistique unique.",
    features: ["De 200 à photos illimitées", "Livraison sous 4 semaines", "Retouche professionnelle"],
    href: "/mariage#photo",
    tag: "Dès 890€",
  },
  {
    icon: Film,
    title: "Vidéographie Mariage",
    description:
      "Un film cinématographique de votre mariage. Teaser, film complet, drone — votre histoire racontée comme au cinéma.",
    features: ["Film court & long métrage", "Drone inclus", "Montage cinématographique"],
    href: "/mariage#video",
    tag: "Inclus dès 1490€",
  },
  {
    icon: GraduationCap,
    title: "Formations",
    description:
      "Apprenez les secrets du reportage mariage avec nos photographes expérimentés. Formations pratiques et théoriques adaptées à tous niveaux.",
    features: ["Petits groupes", "Matériel fourni", "Certification"],
    href: "/formations",
    tag: "Sur inscription",
  },
];

export function Services() {
  return (
    <section className="py-32 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.5em] uppercase text-[#C9A84C] mb-4">
            Nos prestations
          </p>
          <h2
            className="text-4xl md:text-6xl font-bold text-[#FAFAFA] leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Un service{" "}
            <span className="text-gradient-gold italic">complet</span>
            <br />
            pour votre mariage
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="glass p-8 group hover:border-[#C9A84C]/40 transition-all duration-500 flex flex-col"
            >
              {/* Tag */}
              <div className="text-xs tracking-widest uppercase text-[#C9A84C] mb-6 font-medium">
                {service.tag}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] mb-6 group-hover:bg-[#C9A84C]/10 transition-colors">
                <service.icon size={20} />
              </div>

              {/* Title */}
              <h3
                className="text-2xl font-bold text-[#FAFAFA] mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-[#FAFAFA]/50 text-sm leading-relaxed mb-6 flex-1">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-8">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#FAFAFA]/40">
                    <div className="w-1 h-1 bg-[#C9A84C] rounded-full flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={service.href}
                className="flex items-center gap-2 text-sm text-[#C9A84C] tracking-widest uppercase font-medium group-hover:gap-4 transition-all duration-300"
              >
                En savoir plus
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
