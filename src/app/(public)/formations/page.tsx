import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Formations Photo & Vidéo Mariage",
  description: "Formations pratiques en photographie et vidéographie de mariage.",
};

const formations = [
  {
    titre: "Initiation Reportage Mariage",
    duree: "2 jours", prix: 490, niveau: "Débutant",
    bar: "bg-[#E8A87C]",
    inclus: ["Technique de prise de vue en conditions réelles", "Gestion de la lumière naturelle et artificielle", "Workflow de retouche Lightroom", "Mise en situation sur un vrai mariage"],
  },
  {
    titre: "Perfectionnement Photo Mariage",
    duree: "3 jours", prix: 790, niveau: "Intermédiaire",
    bar: "bg-[#DFA0AE]",
    inclus: ["Direction artistique et composition avancée", "Gestion d'équipe et logistique", "Retouche poussée Capture One", "Business : tarifs, contrats, clients", "Certification délivrée"],
  },
  {
    titre: "Vidéo Cinématographique",
    duree: "2 jours", prix: 590, niveau: "Tous niveaux",
    bar: "bg-[#8FAF78]",
    inclus: ["Techniques de filmage cinéma mariage", "Son et audio en conditions réelles", "Montage Premiere Pro + DaVinci", "Export et livraison clients"],
  },
];

export default function FormationsPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF7]">

      {/* Hero */}
      <section className="g-bg pt-[140px] pb-20">
        <div className="wrap text-center">
          <p className="label-tag mb-4">Formations professionnelles</p>
          <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight leading-[0.93] mb-6"
            style={{ fontSize: "clamp(38px,5.5vw,80px)" }}>
            Apprenez <span className="g-text italic">des meilleurs</span>
          </h1>
          <p className="text-[16px] text-[rgba(38,30,20,0.48)] max-w-xl mx-auto font-light leading-[1.75]">
            Des formations pratiques animées par nos photographes et vidéastes avec 15 ans d&apos;expérience terrain.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="bg-[#FDFAF7] py-20">
        <div className="wrap grid grid-cols-1 md:grid-cols-3 gap-6">
          {formations.map(f => (
            <div key={f.titre} className="card rounded-sm p-8 flex flex-col">
              <div className={`h-[2px] w-8 rounded-full mb-6 ${f.bar}`} />
              <p className="text-[10px] tracking-[0.35em] uppercase text-[rgba(38,30,20,0.38)] mb-2">{f.niveau} · {f.duree}</p>
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] text-[22px] mb-2">{f.titre}</h2>
              <p className="font-[family-name:var(--font-playfair)] font-bold text-[32px] text-[#261E14] mb-6">{f.prix} €</p>
              <ul className="flex flex-col gap-2.5 flex-1 mb-8">
                {f.inclus.map(item => (
                  <li key={item} className="flex items-start gap-3 text-[13px] text-[rgba(38,30,20,0.55)]">
                    <Check size={13} className="shrink-0 mt-0.5 text-[#DFA0AE]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={`/contact?formation=${encodeURIComponent(f.titre)}`} className="btn-ghost justify-center">
                S&apos;inscrire
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="g-bg py-20">
        <div className="wrap text-center max-w-[640px]">
          <div className="g-bar h-[2px] w-10 rounded-full mx-auto mb-7" />
          <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight mb-4"
            style={{ fontSize: "clamp(26px,3.5vw,44px)" }}>
            Formation <span className="g-text italic">sur mesure</span> ?
          </h2>
          <p className="text-[15px] text-[rgba(38,30,20,0.45)] font-light mb-8 leading-[1.7]">
            Vous souhaitez une formation privée ou adaptée à vos besoins spécifiques ? Contactez-nous pour un programme personnalisé.
          </p>
          <Link href="/contact" className="btn-fill">Demander un programme</Link>
        </div>
      </section>

    </div>
  );
}
