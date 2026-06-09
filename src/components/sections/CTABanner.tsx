import Link from "next/link";

export function CTABanner() {
  return (
    <section style={{ background: "var(--rose-light)", padding: "100px 0", borderTop: "1px solid rgba(232,174,184,0.2)" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          <div>
            <p className="label" style={{ marginBottom: 20 }}>Votre date approche</p>
            <h2 className="serif" style={{
              fontSize: "clamp(36px, 5vw, 72px)",
              fontWeight: 700, color: "#2C2416",
              lineHeight: 0.95, letterSpacing: "-0.025em",
            }}>
              Réservez<br />
              <span className="gradient-text">dès maintenant.</span>
            </h2>
          </div>

          <div>
            <p style={{ fontSize: 15, color: "rgba(44,36,22,0.5)", lineHeight: 1.75, marginBottom: 36, maxWidth: 400, fontWeight: 300 }}>
              Les dates se remplissent rapidement. Contactez-nous pour vérifier la disponibilité de notre équipe pour votre mariage.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-primary">Nous contacter</Link>
              <Link href="/tarifs" className="btn-outline">Voir les formules</Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
