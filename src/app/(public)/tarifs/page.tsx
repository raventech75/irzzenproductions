import type { Metadata } from "next";
import { Configurateur } from "./Configurateur";

export const metadata: Metadata = {
  title: "Tarifs & Formules",
  description: "Configurez votre prestation mariage sur-mesure. 5 formules de 890€ à 3890€, options à la carte.",
};

export default function TarifsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--fond)", paddingTop: 72 }}>
      <section style={{ padding: "72px 40px 48px", maxWidth: 1380, margin: "0 auto" }}>
        <p className="label" style={{ marginBottom: 16 }}>Tarifs & Formules</p>
        <h1 className="serif" style={{
          fontSize: "clamp(36px, 5vw, 72px)",
          fontWeight: 700, color: "#2C2416",
          lineHeight: 0.95, letterSpacing: "-0.025em", marginBottom: 20,
        }}>
          Configurez votre <span className="gradient-text">prestation</span>
        </h1>
        <p style={{ fontSize: 15, color: "rgba(44,36,22,0.45)", maxWidth: 520, fontWeight: 300, lineHeight: 1.7 }}>
          Choisissez la formule qui correspond à votre mariage et personnalisez-la avec vos options.
        </p>
      </section>
      <Configurateur />
    </div>
  );
}
