import Link from "next/link";

export function CTABanner() {
  return (
    <section style={{ background: "#F9F6F2", padding: "120px 0", borderTop: "1px solid rgba(17,16,16,0.07)" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 40px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Gauche */}
          <div>
            <p className="label" style={{ marginBottom: 20 }}>Votre date approche</p>
            <h2
              className="serif"
              style={{
                fontSize: "clamp(40px, 5.5vw, 80px)",
                fontWeight: 700,
                color: "#111010",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
              }}
            >
              Réservez<br />
              <span style={{ color: "#9E8A94" }}>dès maintenant.</span>
            </h2>
          </div>

          {/* Droite */}
          <div>
            <p style={{ fontSize: 15, color: "rgba(17,16,16,0.45)", lineHeight: 1.75, marginBottom: 40, maxWidth: 400, fontWeight: 300 }}>
              Les dates se remplissent rapidement. Contactez-nous pour vérifier la disponibilité de notre équipe pour votre mariage.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-dark" style={{ textDecoration: "none" }}>
                Nous contacter
              </Link>
              <Link href="/tarifs" className="btn-outline" style={{ textDecoration: "none" }}>
                Voir les formules
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
