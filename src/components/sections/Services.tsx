"use client";

import Link from "next/link";

const services = [
  {
    num: "01",
    title: "Photographie",
    description: "Un reportage photo complet de votre jour J. Chaque regard, chaque larme, chaque sourire capturés avec une sensibilité artistique unique.",
    prix: "Dès 890 €",
    href: "/mariage",
  },
  {
    num: "02",
    title: "Vidéographie",
    description: "Un film cinématographique de votre mariage. Teaser, long métrage, drone — votre histoire racontée comme au cinéma.",
    prix: "Dès 1 490 €",
    href: "/mariage",
  },
  {
    num: "03",
    title: "Formule Complète",
    description: "Photo et vidéo réunis pour immortaliser chaque instant sous toutes ses formes. La solution la plus complète pour votre mariage.",
    prix: "Dès 2 190 €",
    href: "/tarifs",
  },
];

export function Services() {
  return (
    <section style={{ background: "#F9F6F2", borderTop: "1px solid rgba(17,16,16,0.07)" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 40px" }}>

        {/* Header */}
        <div style={{ padding: "80px 0 0", marginBottom: 0, borderBottom: "1px solid rgba(17,16,16,0.07)" }}>
          <p className="label" style={{ marginBottom: 12 }}>Prestations</p>
          <h2
            className="serif"
            style={{
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 700,
              color: "#111010",
              letterSpacing: "-0.02em",
              paddingBottom: 48,
            }}
          >
            Ce que nous offrons
          </h2>
        </div>

        {/* Liste */}
        {services.map((s, i) => (
          <Link
            key={s.num}
            href={s.href}
            style={{
              display: "grid",
              gridTemplateColumns: "64px 1fr 1fr 140px",
              gap: 24,
              alignItems: "center",
              padding: "40px 0",
              borderBottom: "1px solid rgba(17,16,16,0.07)",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(17,16,16,0.02)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: 11, letterSpacing: "0.3em", color: "rgba(17,16,16,0.3)" }}>
              {s.num}
            </span>
            <h3
              className="serif"
              style={{
                fontSize: "clamp(20px, 2.5vw, 30px)",
                fontWeight: 700,
                color: "#111010",
                letterSpacing: "-0.01em",
              }}
            >
              {s.title}
            </h3>
            <p style={{ fontSize: 14, color: "rgba(17,16,16,0.45)", fontWeight: 300, lineHeight: 1.65, maxWidth: 400 }}>
              {s.description}
            </p>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#9E8A94", marginBottom: 8 }}>{s.prix}</div>
              <span style={{
                fontSize: 10,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(17,16,16,0.35)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "flex-end",
              }}>
                Découvrir
                <span style={{ display: "block", width: 20, height: 1, background: "currentColor" }} />
              </span>
            </div>
          </Link>
        ))}

        <div style={{ padding: "48px 0" }}>
          <Link
            href="/tarifs"
            className="btn-dark"
            style={{ textDecoration: "none" }}
          >
            Voir toutes les formules
          </Link>
        </div>
      </div>
    </section>
  );
}
