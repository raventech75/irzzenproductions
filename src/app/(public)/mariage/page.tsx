import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Photographie & Vidéographie de Mariage",
  description:
    "Reportage photo et film de mariage haut de gamme. Équipe de 12 professionnels, 15 ans d'expérience, drone, album luxe. Demandez votre devis gratuit.",
  keywords: [
    "photographe mariage",
    "vidéaste mariage",
    "film mariage cinématographique",
    "reportage mariage",
    "photographe mariage luxe",
    "drone mariage",
  ],
};

const photoInclus = [
  "Reportage de 4h à illimité selon formule",
  "De 200 à photos illimitées retouchées",
  "Retouche couleur & lumière professionnelle",
  "Galerie privée en ligne sécurisée",
  "Téléchargement haute résolution",
  "Livraison sous 4 à 6 semaines",
];

const videoInclus = [
  "Film cinématographique 5 à 30 min",
  "Teaser émotionnel 60-90 secondes",
  "Montage audio / musique licenciée",
  "Drone aérien (formules Premium+)",
  "Format vertical pour réseaux sociaux",
  "Livraison fichiers numériques HD",
];

const faq = [
  {
    q: "Combien de temps à l'avance faut-il réserver ?",
    a: "Nous recommandons de réserver au moins 6 à 12 mois avant votre mariage. Les dates du printemps et de l'été se remplissent très rapidement. Contactez-nous pour vérifier nos disponibilités.",
  },
  {
    q: "Intervenez-vous partout en France ?",
    a: "Oui, nous intervenons partout en France et à l'international. Les frais de déplacement sont inclus en Île-de-France, et calculés au-delà selon la destination.",
  },
  {
    q: "Comment se passe la livraison des photos ?",
    a: "Vous recevrez un lien vers votre galerie privée sécurisée. Vous pourrez y télécharger toutes vos photos en haute résolution, les partager avec vos proches et les conserver indéfiniment.",
  },
  {
    q: "Puis-je ajouter des options après la réservation ?",
    a: "Oui, vous pouvez ajouter des options jusqu'à 30 jours avant la date du mariage, sous réserve de disponibilité de notre équipe.",
  },
  {
    q: "Que se passe-t-il en cas d'annulation ?",
    a: "L'acompte de 15% est remboursable si l'annulation intervient plus de 30 jours avant le mariage. Un contrat détaillant toutes les conditions vous est envoyé à la réservation.",
  },
];

export default function MariagePage() {
  return (
    <div className="min-h-screen bg-[#F7F3EF] pt-24">
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#C4A5B5]/3 blur-[200px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-xs tracking-[0.5em] uppercase text-[#C4A5B5] mb-4">
            Notre spécialité
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold text-[#1A1520] leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Photographe & Vidéaste
            <br />
            <span className="text-gradient-gold italic">Mariage Premium</span>
          </h1>
          <p className="text-[#1A1520]/50 text-xl max-w-2xl mx-auto font-light mb-12">
            Chaque mariage est une histoire unique. Nous la racontons avec
            sensibilité, élégance et un regard artistique affûté par 15 ans de
            passion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tarifs"
              className="px-10 py-4 bg-[#C4A5B5] text-[#13111A] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#DEC8D6] transition-colors gold-glow"
            >
              Voir les formules
            </Link>
            <Link
              href="/galerie"
              className="px-10 py-4 border border-[#C4A5B5]/40 text-[#1A1520]/80 text-sm font-light tracking-[0.2em] uppercase hover:border-[#C4A5B5] hover:text-[#C4A5B5] transition-all"
            >
              Notre portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Photo & Vidéo */}
      <section id="photo" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            {/* Placeholder photo */}
            <div className="aspect-[4/5] bg-[#FAFAF8] border border-[#C4A5B5]/10 flex items-center justify-center text-[#C4A5B5]/20">
              <span className="text-xs tracking-widest uppercase">Votre photo ici</span>
            </div>
            <div>
              <p className="text-xs tracking-[0.5em] uppercase text-[#C4A5B5] mb-4">
                Photographie
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#1A1520] leading-tight mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Des images qui{" "}
                <span className="text-gradient-gold italic">parlent</span>
              </h2>
              <p className="text-[#1A1520]/50 text-lg leading-relaxed mb-8 font-light">
                Notre approche photojournaliste capture l&apos;authenticité de
                chaque instant — les larmes, les rires, les regards complices —
                sans jamais interrompre la magie de votre journée.
              </p>
              <ul className="space-y-3 mb-10">
                {photoInclus.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#1A1520]/60">
                    <Check size={14} className="text-[#C4A5B5] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/tarifs"
                className="inline-flex items-center gap-2 text-sm text-[#C4A5B5] tracking-widest uppercase font-medium hover:gap-4 transition-all"
              >
                Voir les formules photo <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Vidéo */}
          <div id="video" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="text-xs tracking-[0.5em] uppercase text-[#C4A5B5] mb-4">
                Vidéographie
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold text-[#1A1520] leading-tight mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Un film{" "}
                <span className="text-gradient-gold italic">cinématographique</span>
              </h2>
              <p className="text-[#1A1520]/50 text-lg leading-relaxed mb-8 font-light">
                Votre film de mariage est bien plus qu&apos;un simple
                enregistrement. C&apos;est une œuvre narrative, avec une
                direction artistique soignée, une bande-son émouvante et des
                images aériennes à couper le souffle.
              </p>
              <ul className="space-y-3 mb-10">
                {videoInclus.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#1A1520]/60">
                    <Check size={14} className="text-[#C4A5B5] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/tarifs"
                className="inline-flex items-center gap-2 text-sm text-[#C4A5B5] tracking-widest uppercase font-medium hover:gap-4 transition-all"
              >
                Voir les formules vidéo <ArrowRight size={14} />
              </Link>
            </div>
            <div className="order-1 lg:order-2 aspect-[4/5] bg-[#FAFAF8] border border-[#C4A5B5]/10 flex items-center justify-center text-[#C4A5B5]/20">
              <span className="text-xs tracking-widest uppercase">Votre vidéo ici</span>
            </div>
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-24 px-6 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.5em] uppercase text-[#C4A5B5] mb-4">
              Comment ça se passe
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#1A1520]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              De la{" "}
              <span className="text-gradient-gold italic">réservation</span>
              {" "}à la livraison
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "01", titre: "Contact", texte: "Vous nous contactez, nous vérifions nos disponibilités et vous envoyons un devis sous 24h." },
              { num: "02", titre: "Contrat & Acompte", texte: "Vous signez le contrat électroniquement et versez l'acompte de 15% pour confirmer la date." },
              { num: "03", titre: "Votre Mariage", texte: "Notre équipe arrive en avance, discrète et professionnelle. Vous profitez, nous capturons." },
              { num: "04", titre: "Livraison", texte: "Votre galerie privée est prête sous 4 à 6 semaines. Téléchargement illimité inclus." },
            ].map((step) => (
              <div key={step.num} className="relative">
                <div
                  className="text-7xl font-bold text-[#C4A5B5]/10 mb-4 leading-none"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-[#1A1520] mb-3">
                  {step.titre}
                </h3>
                <p className="text-sm text-[#1A1520]/40 leading-relaxed">{step.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.5em] uppercase text-[#C4A5B5] mb-4">FAQ</p>
            <h2
              className="text-4xl md:text-5xl font-bold text-[#1A1520]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Questions{" "}
              <span className="text-gradient-gold italic">fréquentes</span>
            </h2>
          </div>
          <div className="space-y-4">
            {faq.map((item) => (
              <details
                key={item.q}
                className="group glass border border-[#C4A5B5]/15 open:border-[#C4A5B5]/40 transition-all"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none text-[#1A1520] text-sm font-medium hover:text-[#C4A5B5] transition-colors">
                  {item.q}
                  <span className="text-[#C4A5B5]/60 group-open:rotate-45 transition-transform duration-300 text-xl leading-none flex-shrink-0 ml-4">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 text-sm text-[#1A1520]/50 leading-relaxed border-t border-[#C4A5B5]/10 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center glass p-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-[#C4A5B5] to-transparent" />
          <h2
            className="text-4xl font-bold text-[#1A1520] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Votre mariage mérite{" "}
            <span className="text-gradient-gold italic">le meilleur</span>
          </h2>
          <p className="text-[#1A1520]/50 mb-10">
            Vérifiez nos disponibilités pour votre date et recevez votre devis
            personnalisé sous 24h.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#C4A5B5] text-[#13111A] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#DEC8D6] transition-colors gold-glow"
          >
            Vérifier nos disponibilités <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
