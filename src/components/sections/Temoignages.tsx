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
    <section className="gradient-bg" style={{ padding: "120px 0" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 40px" }}>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64 }}>
          <div>
            <p className="label" style={{ marginBottom: 14 }}>Témoignages</p>
            <h2 className="serif" style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              fontWeight: 700, color: "#2C2416",
              letterSpacing: "-0.02em", lineHeight: 1.05,
            }}>
              Ce que disent <span className="gradient-text">nos mariés</span>
            </h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="serif" style={{ fontSize: 28, fontWeight: 700, color: "#2C2416" }}>4.9 / 5</div>
            <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(44,36,22,0.35)", marginTop: 4 }}>200+ avis vérifiés</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {temoignages.map((t, i) => (
            <div key={t.name} style={{
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.8)",
              padding: "40px 36px",
              display: "flex", flexDirection: "column",
            }}>
              {/* Barre colorée */}
              <div className="gradient-bar" style={{ height: 2, width: 40, marginBottom: 28, opacity: 0.6 + i * 0.15 }} />

              <p className="serif" style={{
                fontSize: 15, color: "rgba(44,36,22,0.6)",
                fontStyle: "italic", lineHeight: 1.8, flex: 1, marginBottom: 32,
              }}>
                &ldquo;{t.texte}&rdquo;
              </p>
              <div style={{ borderTop: "1px solid rgba(44,36,22,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#2C2416", marginBottom: 3 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(44,36,22,0.3)", letterSpacing: "0.05em" }}>{t.date}</div>
                </div>
                <div style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--rose)" }}>
                  {t.formule}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
