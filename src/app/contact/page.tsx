import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact & Réservation",
  description:
    "Contactez Irzzen Productions pour votre mariage. Vérifiez nos disponibilités et obtenez un devis personnalisé sous 24h.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24">
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Gauche : infos */}
            <div>
              <p className="text-xs tracking-[0.5em] uppercase text-[#C9A84C] mb-4">
                Parlons de votre mariage
              </p>
              <h1
                className="text-5xl md:text-6xl font-bold text-[#FAFAFA] leading-tight mb-8"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Réservons{" "}
                <span className="text-gradient-gold italic">votre date</span>
              </h1>
              <p className="text-[#FAFAFA]/50 text-lg leading-relaxed mb-12 font-light">
                Décrivez-nous votre projet. Nous vous répondons sous 24h avec
                nos disponibilités et un devis détaillé.
              </p>

              {/* Infos contact */}
              <div className="space-y-6 mb-12">
                {[
                  {
                    label: "Email",
                    value: "contact@irzzenproductions.fr",
                    href: "mailto:contact@irzzenproductions.fr",
                  },
                  {
                    label: "Téléphone",
                    value: "+33 6 00 00 00 00",
                    href: "tel:+33600000000",
                  },
                  {
                    label: "Disponibilités",
                    value: "Réponse sous 24h",
                    href: null,
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-6">
                    <div className="w-px h-8 bg-[#C9A84C]/40" />
                    <div>
                      <div className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]/60 mb-0.5">
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm text-[#FAFAFA]/70 hover:text-[#C9A84C] transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm text-[#FAFAFA]/70">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Garanties */}
              <div className="glass p-6 space-y-3">
                <div className="text-xs tracking-[0.3em] uppercase text-[#C9A84C]/60 mb-4">
                  Nos engagements
                </div>
                {[
                  "Réponse garantie sous 24h",
                  "Devis gratuit et sans engagement",
                  "Contrat signé electroniquement",
                  "Acompte de 15% à la réservation",
                  "Annulation remboursée sous 30 jours",
                ].map((g) => (
                  <div key={g} className="flex items-center gap-3 text-sm text-[#FAFAFA]/50">
                    <div className="w-1 h-1 bg-[#C9A84C] rounded-full flex-shrink-0" />
                    {g}
                  </div>
                ))}
              </div>
            </div>

            {/* Droite : formulaire */}
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
