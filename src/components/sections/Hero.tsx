"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100svh", overflow: "hidden" }}>

      {/* Fond dégradé pastel */}
      <div className="gradient-bg" style={{ position: "absolute", inset: 0 }} />

      {/* Photo — côté droit seulement */}
      <div style={{
        position: "absolute",
        right: 0, top: 0, bottom: 0,
        width: "55%",
        overflow: "hidden",
      }}>
        <img
          src="/photos/1L9A7763.JPG"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Fondu vers la gauche */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, var(--fond) 0%, transparent 40%)",
        }} />
      </div>

      {/* Contenu gauche */}
      <div style={{
        position: "relative", zIndex: 10,
        maxWidth: 1380, margin: "0 auto", padding: "0 40px",
        minHeight: "100svh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        paddingTop: 72,
      }}>
        <div style={{ maxWidth: 580 }}>

          {/* Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <span className="gradient-bar" style={{ display: "block", width: 32, height: 2 }} />
            <span className="label">Photographe & Vidéaste Mariage — Paris</span>
          </div>

          {/* Titre */}
          <h1 className="serif" style={{
            fontSize: "clamp(48px, 7vw, 108px)",
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "-0.025em",
            color: "#2C2416",
            marginBottom: 32,
          }}>
            Votre<br />
            histoire,<br />
            <span className="gradient-text">immortalisée.</span>
          </h1>

          {/* Sous-texte */}
          <p style={{ fontSize: 15, color: "rgba(44,36,22,0.5)", fontWeight: 300, lineHeight: 1.7, marginBottom: 44, maxWidth: 400 }}>
            15 ans d'expérience, 500 mariages capturés avec passion et précision artistique.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 64 }}>
            <Link href="/galerie" className="btn-primary">Voir le portfolio</Link>
            <Link href="/tarifs" className="btn-outline">Nos formules</Link>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 40, paddingTop: 32, borderTop: "1px solid rgba(44,36,22,0.08)" }}>
            {[
              { val: "500+", label: "Mariages" },
              { val: "15 ans", label: "D'expérience" },
              { val: "12", label: "Professionnels" },
            ].map((s) => (
              <div key={s.label}>
                <div className="serif" style={{ fontSize: 20, fontWeight: 700, color: "#2C2416", marginBottom: 3 }}>{s.val}</div>
                <div style={{ fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(44,36,22,0.35)" }}>{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
