import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Photographie & Vidéographie de Mariage",
  description: "Reportage photo et film de mariage haut de gamme.",
};

const photoInclus = [
  "Reportage de 4h à illimité selon formule",
  "200 à photos illimitées retouchées",
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

const steps = [
  { num: "01", titre: "Contact",          texte: "Vous nous contactez, nous vérifions nos disponibilités et vous envoyons un devis sous 24h.", bar: "bg-[#E8A87C]" },
  { num: "02", titre: "Contrat & Acompte",texte: "Vous signez le contrat électroniquement et versez l'acompte de 20% pour confirmer la date.", bar: "bg-[#DFA0AE]" },
  { num: "03", titre: "Votre Mariage",    texte: "Notre équipe arrive en avance, discrète et professionnelle. Vous profitez, nous capturons.", bar: "bg-[#8FAF78]" },
  { num: "04", titre: "Livraison",        texte: "Votre galerie privée est prête sous 4 à 6 semaines. Téléchargement illimité inclus.", bar: "bg-[#DFA0AE]" },
];

const faq = [
  { q: "Combien de temps à l'avance faut-il réserver ?",  a: "Nous recommandons de réserver 6 à 12 mois avant votre mariage. Les dates du printemps et de l'été se remplissent très rapidement." },
  { q: "Intervenez-vous partout en France ?",              a: "Oui, partout en France et à l'international. Les frais de déplacement sont inclus en Île-de-France." },
  { q: "Comment se passe la livraison des photos ?",       a: "Vous recevrez un lien vers votre galerie privée sécurisée pour télécharger toutes vos photos en haute résolution." },
  { q: "Puis-je ajouter des options après la réservation ?", a: "Oui, jusqu'à 30 jours avant la date du mariage, sous réserve de disponibilité." },
  { q: "Que se passe-t-il en cas d'annulation ?",          a: "En cas d'annulation, quelle qu'en soit la raison, l'acompte versé reste définitivement acquis à Irzzen Productions et ne pourra faire l'objet d'aucun remboursement." },
];

export default function MariagePage() {
  return (
    <div className="min-h-screen bg-[#FDFAF7]">

      {/* ── Hero ── */}
      <section className="g-bg pt-[140px] pb-24">
        <div className="wrap text-center">
          <p className="label-tag mb-4">Notre spécialité</p>
          <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight leading-[0.93] mb-7"
            style={{ fontSize: "clamp(40px,6vw,88px)" }}>
            Photographe &amp; Vidéaste<br />
            <span className="g-text">Mariage Premium</span>
          </h1>
          <p className="text-[16px] text-[rgba(38,30,20,0.48)] max-w-xl mx-auto font-light leading-[1.75] mb-10">
            Chaque mariage est une histoire unique. Nous la racontons avec sensibilité, élégance et un regard artistique affûté par 15 ans de passion.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/tarifs"  className="btn-fill">Voir les formules</Link>
            <Link href="/galerie" className="btn-ghost">Notre portfolio</Link>
          </div>
        </div>
      </section>

      {/* ── Photo ── */}
      <section id="photo" className="bg-[#FDFAF7] py-24">
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image
              src="/photos/Zineb & Fares - 00471.jpg"
              alt="Reportage photo mariage — Zineb & Farès"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="label-tag mb-3">Photographie</p>
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight leading-tight mb-5"
              style={{ fontSize: "clamp(28px,3.5vw,48px)" }}>
              Des images qui <span className="g-text italic">parlent</span>
            </h2>
            <p className="text-[15px] text-[rgba(38,30,20,0.48)] leading-[1.75] mb-7 font-light">
              Notre approche photojournaliste capture l&apos;authenticité de chaque instant — les larmes, les rires, les regards complices — sans jamais interrompre la magie de votre journée.
            </p>
            <ul className="flex flex-col gap-2.5 mb-8">
              {photoInclus.map(item => (
                <li key={item} className="flex items-center gap-3 text-[13px] text-[rgba(38,30,20,0.55)]">
                  <Check size={13} className="text-[#E8A87C] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/tarifs" className="btn-fill">Voir les formules photo</Link>
          </div>
        </div>
      </section>

      {/* ── Vidéo ── */}
      <section id="video" className="g-bg py-24">
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="order-2 lg:order-1">
            <p className="label-tag mb-3">Vidéographie</p>
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight leading-tight mb-5"
              style={{ fontSize: "clamp(28px,3.5vw,48px)" }}>
              Un film <span className="g-text italic">cinématographique</span>
            </h2>
            <p className="text-[15px] text-[rgba(38,30,20,0.48)] leading-[1.75] mb-7 font-light">
              Votre film de mariage est bien plus qu&apos;un enregistrement. C&apos;est une œuvre narrative, avec une direction artistique soignée et des images aériennes à couper le souffle.
            </p>
            <ul className="flex flex-col gap-2.5 mb-8">
              {videoInclus.map(item => (
                <li key={item} className="flex items-center gap-3 text-[13px] text-[rgba(38,30,20,0.55)]">
                  <Check size={13} className="text-[#DFA0AE] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/tarifs" className="btn-fill">Voir les formules vidéo</Link>
          </div>
          <div className="order-1 lg:order-2 aspect-video w-full overflow-hidden rounded-sm">
            <iframe
              src="https://www.youtube.com/embed/hFUL4K45LPo?autoplay=1&mute=1&loop=1&playlist=hFUL4K45LPo&controls=1&rel=0&modestbranding=1"
              title="Film mariage cinématographique — Hasret & Simoney · Irzzen Productions"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </section>

      {/* ── Processus ── */}
      <section className="bg-[#FDFAF7] py-24">
        <div className="wrap">
          <div className="text-center mb-16">
            <p className="label-tag mb-3">Comment ça se passe</p>
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight"
              style={{ fontSize: "clamp(26px,3.5vw,48px)" }}>
              De la <span className="g-text italic">réservation</span> à la livraison
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map(s => (
              <div key={s.num}>
                <span className={`inline-block w-[3px] h-8 rounded-full mb-5 ${s.bar}`} />
                <div className="font-[family-name:var(--font-playfair)] font-bold text-[rgba(38,30,20,0.07)] text-[72px] leading-none mb-3 -mt-2">{s.num}</div>
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] text-[18px] mb-2">{s.titre}</h3>
                <p className="text-[13px] text-[rgba(38,30,20,0.45)] leading-[1.7] font-light">{s.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="g-bg py-24">
        <div className="wrap max-w-[760px]">
          <div className="text-center mb-14">
            <p className="label-tag mb-3">FAQ</p>
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight"
              style={{ fontSize: "clamp(26px,3.5vw,46px)" }}>
              Questions <span className="g-text italic">fréquentes</span>
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {faq.map(item => (
              <details key={item.q} className="group card rounded-sm border border-white/90">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none text-[#261E14] text-[14px] font-medium hover:text-[#DFA0AE] transition-colors">
                  {item.q}
                  <span className="text-[#DFA0AE] group-open:rotate-45 transition-transform duration-200 text-[22px] leading-none shrink-0 ml-4">+</span>
                </summary>
                <div className="px-6 pb-5 text-[13px] text-[rgba(38,30,20,0.5)] leading-[1.75] border-t border-[rgba(38,30,20,0.06)] pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="bg-[#FDFAF7] py-24">
        <div className="wrap text-center">
          <div className="g-bar h-[2px] w-12 rounded-full mx-auto mb-8" />
          <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight mb-4"
            style={{ fontSize: "clamp(30px,4vw,56px)" }}>
            Votre mariage mérite <span className="g-text italic">le meilleur</span>
          </h2>
          <p className="text-[15px] text-[rgba(38,30,20,0.45)] font-light mb-10 max-w-md mx-auto leading-[1.72]">
            Vérifiez nos disponibilités pour votre date et recevez votre devis personnalisé sous 24h.
          </p>
          <Link href="/contact" className="btn-fill">Vérifier nos disponibilités</Link>
        </div>
      </section>

    </div>
  );
}
