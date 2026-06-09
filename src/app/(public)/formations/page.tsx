import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Formations Photo & Vidéo Mariage",
  description:
    "Formations pratiques en photographie et vidéographie de mariage. Apprenez les techniques des professionnels. Petits groupes, matériel fourni.",
};

const formations = [
  {
    titre: "Initiation Reportage Mariage",
    duree: "2 jours",
    prix: 490,
    niveau: "Débutant",
    inclus: [
      "Technique de prise de vue en conditions réelles",
      "Gestion de la lumière naturelle et artificielle",
      "Workflow de retouche Lightroom",
      "Mise en situation sur un vrai mariage",
    ],
  },
  {
    titre: "Perfectionnement Photo Mariage",
    duree: "3 jours",
    prix: 790,
    niveau: "Intermédiaire",
    inclus: [
      "Direction artistique et composition avancée",
      "Gestion d'équipe et logistique",
      "Retouche poussée Capture One",
      "Business : tarifs, contrats, clients",
      "Certification délivrée",
    ],
  },
  {
    titre: "Vidéo Cinématographique",
    duree: "2 jours",
    prix: 590,
    niveau: "Tous niveaux",
    inclus: [
      "Techniques de filmage cinéma mariage",
      "Son et audio en conditions réelles",
      "Montage Premiere Pro + DaVinci",
      "Export et livraison clients",
    ],
  },
];

export default function FormationsPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EF] pt-24">
      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <p className="text-xs tracking-[0.5em] uppercase text-[#C4A5B5] mb-4">
          Formations professionnelles
        </p>
        <h1
          className="text-5xl md:text-7xl font-bold text-[#1A1520] leading-tight mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Apprenez{" "}
          <span className="text-gradient-gold italic">des meilleurs</span>
        </h1>
        <p className="text-[#1A1520]/50 text-xl max-w-2xl mx-auto font-light mb-12">
          Des formations pratiques animées par nos photographes et vidéastes
          avec 15 ans d&apos;expérience terrain. Petits groupes, mise en
          situation réelle.
        </p>
      </section>

      {/* Formations */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {formations.map((f) => (
            <div key={f.titre} className="glass p-8 flex flex-col">
              <div className="text-xs tracking-widest uppercase text-[#C4A5B5]/60 mb-2">
                {f.niveau} · {f.duree}
              </div>
              <h2
                className="text-2xl font-bold text-[#1A1520] mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {f.titre}
              </h2>
              <div
                className="text-3xl font-bold text-gradient-gold mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {f.prix} €
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {f.inclus.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#1A1520]/60">
                    <Check size={14} className="text-[#C4A5B5] flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/contact?formation=${encodeURIComponent(f.titre)}`}
                className="flex items-center justify-center gap-2 py-3 border border-[#C4A5B5]/40 text-[#C4A5B5] text-sm font-medium tracking-widest uppercase hover:bg-[#C4A5B5]/10 hover:border-[#C4A5B5] transition-all"
              >
                S&apos;inscrire <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center glass p-12">
          <h2
            className="text-3xl font-bold text-[#1A1520] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Formation <span className="text-gradient-gold italic">sur mesure</span> ?
          </h2>
          <p className="text-[#1A1520]/50 text-sm mb-8">
            Vous souhaitez une formation privée ou adaptée à vos besoins spécifiques ?
            Contactez-nous pour un programme personnalisé.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#C4A5B5] text-[#13111A] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#DEC8D6] transition-colors gold-glow"
          >
            Demander un programme <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
