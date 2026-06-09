import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact & Réservation",
  description: "Contactez Irzzen Productions pour votre mariage. Disponibilités et devis sous 24h.",
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--fond)", paddingTop: 72 }}>
      <section style={{ padding: "72px 40px 80px", maxWidth: 1380, margin: "0 auto" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>

          {/* Gauche */}
          <div>
            <p className="label" style={{ marginBottom: 16 }}>Parlons de votre mariage</p>
            <h1 className="serif" style={{
              fontSize: "clamp(36px, 5vw, 72px)",
              fontWeight: 700, color: "#2C2416",
              lineHeight: 0.95, letterSpacing: "-0.025em", marginBottom: 24,
            }}>
              Réservons <span className="gradient-text">votre date</span>
            </h1>
            <p style={{ fontSize: 15, color: "rgba(44,36,22,0.45)", lineHeight: 1.75, marginBottom: 48, fontWeight: 300 }}>
              Décrivez-nous votre projet. Nous vous répondons sous 24h avec nos disponibilités et un devis détaillé.
            </p>

            {/* Infos */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 48 }}>
              {[
                { label: "Email", value: "contact@irzzenproductions.fr", href: "mailto:contact@irzzenproductions.fr", accent: "var(--orange)" },
                { label: "Téléphone", value: "+33 6 00 00 00 00", href: "tel:+33600000000", accent: "var(--rose)" },
                { label: "Disponibilités", value: "Réponse sous 24h", href: null, accent: "var(--olive)" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 3, height: 36, background: item.accent, flexShrink: 0, borderRadius: 2 }} />
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(44,36,22,0.35)", marginBottom: 3 }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} style={{ fontSize: 14, color: "#2C2416", textDecoration: "none" }}>{item.value}</a>
                    ) : (
                      <span style={{ fontSize: 14, color: "#2C2416" }}>{item.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Engagements */}
            <div className="gradient-bg" style={{ padding: "28px 32px", border: "1px solid rgba(255,255,255,0.8)" }}>
              <p className="label" style={{ marginBottom: 16 }}>Nos engagements</p>
              {[
                "Réponse garantie sous 24h",
                "Devis gratuit et sans engagement",
                "Contrat signé électroniquement",
                "Acompte de 15% à la réservation",
                "Annulation remboursée sous 30 jours",
              ].map((g, i) => (
                <div key={g} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, fontSize: 13, color: "rgba(44,36,22,0.55)" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: ["var(--orange)", "var(--rose)", "var(--olive)", "var(--orange)", "var(--rose)"][i], flexShrink: 0 }} />
                  {g}
                </div>
              ))}
            </div>
          </div>

          {/* Droite : formulaire */}
          <Suspense fallback={<div style={{ minHeight: 500, background: "rgba(255,255,255,0.5)" }} />}>
            <ContactForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
