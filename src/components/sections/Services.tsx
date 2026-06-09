"use client";

import Link from "next/link";

const services = [
  {
    num: "01",
    title: "Photographie",
    description: "Un reportage photo complet de votre jour J. Chaque regard, chaque larme, chaque sourire capturés avec une sensibilité artistique unique.",
    prix: "Dès 890 €",
    href: "/mariage",
    accent: "var(--orange)",
  },
  {
    num: "02",
    title: "Vidéographie",
    description: "Un film cinématographique de votre mariage. Teaser, long métrage, drone — votre histoire racontée comme au cinéma.",
    prix: "Dès 1 490 €",
    href: "/mariage",
    accent: "var(--rose)",
  },
  {
    num: "03",
    title: "Formule Complète",
    description: "Photo et vidéo réunis pour immortaliser chaque instant sous toutes ses formes. La solution la plus complète pour votre mariage.",
    prix: "Dès 2 190 €",
    href: "/tarifs",
    accent: "var(--olive)",
  },
];

export function Services() {
  return (
    <section style={{ background: "var(--fond)", padding: "100px 0", borderTop: "1px solid rgba(44,36,22,0.06)" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 40px" }}>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 32, marginBottom: 56, paddingBottom: 40, borderBottom: "1px solid rgba(44,36,22,0.07)" }}>
          <div>
            <p className="label" style={{ marginBottom: 12 }}>Prestations</p>
            <h2 className="serif" style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, color: "#2C2416", letterSpacing: "-0.02em" }}>
              Ce que nous offrons
            </h2>
          </div>
        </div>

        {services.map((s) => (
          <Link key={s.num} href={s.href} style={{
            display: "grid",
            gridTemplateColumns: "56px 1fr 1fr 120px",
            gap: 24, alignItems: "center",
            padding: "36px 0",
            borderBottom: "1px solid rgba(44,36,22,0.06)",
            textDecoration: "none",
            transition: "background 0.2s",
            margin: "0 -40px", padding: "36px 40px",
          }}>
            <span style={{ fontSize: 11, letterSpacing: "0.3em", color: s.accent, fontWeight: 500 }}>{s.num}</span>
            <h3 className="serif" style={{ fontSize: "clamp(20px, 2.2vw, 28px)", fontWeight: 700, color: "#2C2416", letterSpacing: "-0.01em" }}>
              {s.title}
            </h3>
            <p style={{ fontSize: 14, color: "rgba(44,36,22,0.45)", fontWeight: 300, lineHeight: 1.65, maxWidth: 420 }}>
              {s.description}
            </p>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: s.accent, marginBottom: 6 }}>{s.prix}</div>
              <span style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(44,36,22,0.3)", display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                Découvrir <span style={{ display: "block", width: 16, height: 1, background: s.accent }} />
              </span>
            </div>
          </Link>
        ))}

        <div style={{ paddingTop: 44 }}>
          <Link href="/tarifs" className="btn-primary">Voir toutes les formules</Link>
        </div>
      </div>
    </section>
  );
}
