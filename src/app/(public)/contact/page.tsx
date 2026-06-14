import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact & Réservation",
  description: "Contactez Irzzen Productions. Disponibilités et devis sous 24h.",
};

const infos = [
  { label: "Email",          value: "contact@irzzenproductions.fr", href: "mailto:contact@irzzenproductions.fr", bar: "bg-[#E8A87C]" },
  { label: "Téléphone",      value: "01 85 09 45 42",               href: "tel:+33185094542",                    bar: "bg-[#DFA0AE]" },
  { label: "Disponibilités", value: "Réponse sous 24h",             href: null,                                  bar: "bg-[#8FAF78]" },
];

const engagements = [
  "Réponse garantie sous 24h",
  "Devis gratuit et sans engagement",
  "Contrat signé électroniquement",
  "Acompte de 20% à la réservation",
  "Acompte non remboursable en cas d'annulation",
];

const dots = ["bg-[#E8A87C]", "bg-[#DFA0AE]", "bg-[#8FAF78]", "bg-[#E8A87C]", "bg-[#DFA0AE]"];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF7]">
      <div className="wrap pt-[120px] pb-24">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* ── Gauche ── */}
          <div>
            <p className="label-tag mb-4">Parlons de votre mariage</p>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight leading-[0.94] mb-6"
              style={{ fontSize: "clamp(34px,5vw,68px)" }}>
              Réservons <span className="g-text">votre date</span>
            </h1>
            <p className="text-[15px] text-[rgba(38,30,20,0.45)] font-light leading-[1.72] mb-12 max-w-sm">
              Décrivez-nous votre projet. Nous vous répondons sous 24h avec nos disponibilités et un devis détaillé.
            </p>

            {/* Infos contact */}
            <div className="flex flex-col gap-6 mb-12">
              {infos.map(item => (
                <div key={item.label} className="flex items-center gap-5">
                  <span className={`w-[3px] h-9 rounded-full shrink-0 ${item.bar}`} />
                  <div>
                    <p className="text-[10px] tracking-[0.32em] uppercase text-[rgba(38,30,20,0.32)] mb-0.5">{item.label}</p>
                    {item.href
                      ? <a href={item.href} className="text-[14px] text-[#261E14] no-underline hover:opacity-70 transition-opacity">{item.value}</a>
                      : <span className="text-[14px] text-[#261E14]">{item.value}</span>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Engagements */}
            <div className="g-bg border border-white/80 p-7 rounded-sm">
              <p className="label-tag mb-4">Nos engagements</p>
              <div className="flex flex-col gap-3">
                {engagements.map((g, i) => (
                  <div key={g} className="flex items-center gap-3 text-[13px] text-[rgba(38,30,20,0.55)]">
                    <span className={`w-[5px] h-[5px] rounded-full shrink-0 ${dots[i]}`} />
                    {g}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Droite : formulaire ── */}
          <Suspense fallback={<div className="min-h-[500px] g-bg rounded-sm animate-pulse" />}>
            <ContactForm />
          </Suspense>

        </div>
      </div>
    </div>
  );
}
