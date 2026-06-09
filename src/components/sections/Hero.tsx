"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100svh", background: "#111010", overflow: "hidden" }}>

      {/* Photo */}
      <img
        src="/photos/1L9A7763.JPG"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.5,
        }}
      />

      {/* Dégradé bas */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, #111010 0%, rgba(17,16,16,0.3) 50%, transparent 100%)",
      }} />

      {/* Contenu */}
      <div style={{
        position: "relative",
        zIndex: 10,
        maxWidth: 1380,
        margin: "0 auto",
        padding: "0 40px",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        paddingBottom: 80,
      }}>

        {/* Tag */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <span style={{ display: "block", width: 32, height: 1, background: "#9E8A94" }} />
          <span className="label" style={{ color: "rgba(249,246,242,0.6)" }}>
            Photographe & Vidéaste Mariage — Paris
          </span>
        </div>

        {/* Titre */}
        <h1
          className="serif"
          style={{
            fontSize: "clamp(52px, 8vw, 120px)",
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            color: "#F9F6F2",
            marginBottom: 40,
            maxWidth: 900,
          }}
        >
          Votre histoire,<br />
          <em style={{ fontStyle: "normal", color: "#B8A99A" }}>immortalisée.</em>
        </h1>

        {/* Bas : stats + CTA */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 40 }}>

          {/* Stats */}
          <div style={{ display: "flex", gap: 48, borderTop: "1px solid rgba(249,246,242,0.1)", paddingTop: 32 }}>
            {[
              { val: "500+", label: "Mariages" },
              { val: "15 ans", label: "D'expérience" },
              { val: "12", label: "Professionnels" },
            ].map((s) => (
              <div key={s.label}>
                <div className="serif" style={{ fontSize: 22, fontWeight: 700, color: "#F9F6F2", marginBottom: 4 }}>
                  {s.val}
                </div>
                <div style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(249,246,242,0.3)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link
              href="/galerie"
              style={{
                display: "inline-block",
                padding: "14px 32px",
                background: "#F9F6F2",
                color: "#111010",
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Voir le portfolio
            </Link>
            <Link
              href="/tarifs"
              style={{
                display: "inline-block",
                padding: "13px 31px",
                border: "1px solid rgba(249,246,242,0.25)",
                color: "rgba(249,246,242,0.7)",
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Nos formules
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
