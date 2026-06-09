const temoignages = [
  {
    name: "Sophie & Karim",
    date: "Juillet 2024",
    texte: "Une équipe exceptionnelle qui a su saisir chaque émotion de notre mariage. Les photos sont d'une beauté à couper le souffle. Nous recommandons Irzzen Productions les yeux fermés.",
    formule: "Formule Prestige",
  },
  {
    name: "Marie & Thomas",
    date: "Mai 2024",
    texte: "Le film de notre mariage nous a fait pleurer de joie. Un travail cinématographique remarquable, une équipe professionnelle et chaleureuse. Merci infiniment.",
    formule: "Formule Premium",
  },
  {
    name: "Leïla & Youssef",
    date: "Juin 2024",
    texte: "Parfait du début à la fin. La galerie privée pour partager les photos avec nos proches est une excellente idée. Un service vraiment premium.",
    formule: "Formule Complète",
  },
];

export function Temoignages() {
  return (
    <section style={{ background: "#111010", padding: "120px 0" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 40px" }}>

        {/* Header */}
        <div style={{ marginBottom: 72 }}>
          <p className="label" style={{ marginBottom: 16, color: "rgba(249,246,242,0.35)" }}>
            Témoignages
          </p>
          <h2
            className="serif"
            style={{
              fontSize: "clamp(32px, 4vw, 56px)",
              fontWeight: 700,
              color: "#F9F6F2",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Ce que disent nos mariés
          </h2>
        </div>

        {/* Témoignages */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {temoignages.map((t) => (
            <div
              key={t.name}
              style={{
                padding: "48px 40px",
                borderTop: "1px solid rgba(249,246,242,0.08)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p
                className="serif"
                style={{
                  fontSize: 16,
                  color: "rgba(249,246,242,0.55)",
                  fontStyle: "italic",
                  lineHeight: 1.75,
                  flex: 1,
                  marginBottom: 40,
                }}
              >
                &ldquo;{t.texte}&rdquo;
              </p>
              <div style={{ borderTop: "1px solid rgba(249,246,242,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#F9F6F2", marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(249,246,242,0.25)", letterSpacing: "0.05em" }}>{t.date}</div>
                </div>
                <div style={{ fontSize: 10, color: "#9E8A94", letterSpacing: "0.3em", textTransform: "uppercase" }}>
                  {t.formule}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div style={{ marginTop: 64, display: "flex", alignItems: "center", gap: 16, borderTop: "1px solid rgba(249,246,242,0.06)", paddingTop: 40 }}>
          <span style={{ fontSize: 13, color: "rgba(249,246,242,0.35)" }}>Note moyenne</span>
          <span className="serif" style={{ fontSize: 24, fontWeight: 700, color: "#F9F6F2" }}>4.9 / 5</span>
          <span style={{ fontSize: 11, color: "rgba(249,246,242,0.2)", letterSpacing: "0.2em" }}>— 200+ avis vérifiés</span>
        </div>

      </div>
    </section>
  );
}
