import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos — Notre équipe",
  description: "15 ans d'expérience, 12 professionnels passionnés. Découvrez l'histoire d'Irzzen Productions.",
};

const valeurs = [
  { titre: "Discrétion", texte: "Nous nous fondons dans votre journée pour capturer l'authenticité sans jamais la perturber." },
  { titre: "Exigence", texte: "Chaque photo est retouchée, chaque image est choisie avec soin. Rien n'est laissé au hasard." },
  { titre: "Émotion", texte: "Nous ne photographions pas des poses. Nous capturons des instants vrais, inoubliables." },
  { titre: "Fiabilité", texte: "15 ans de mariages sans un seul incident. Contrat, acompte, livraison — toujours tenu." },
];

export default function AProposPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F9F6F2", paddingTop: 72 }}>

      {/* Hero */}
      <section style={{ padding: "80px 40px 0", maxWidth: 1380, margin: "0 auto" }}>
        <p className="label" style={{ marginBottom: 20 }}>Notre histoire</p>
        <h1
          className="serif"
          style={{
            fontSize: "clamp(40px, 6vw, 88px)",
            fontWeight: 700,
            color: "#111010",
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            marginBottom: 48,
            maxWidth: 800,
          }}
        >
          Une passion,<br />
          <span style={{ color: "#9E8A94" }}>15 ans de maîtrise.</span>
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start", paddingBottom: 80, borderBottom: "1px solid rgba(17,16,16,0.08)" }}>
          <div>
            <p style={{ fontSize: 15, color: "rgba(17,16,16,0.5)", lineHeight: 1.8, fontWeight: 300, marginBottom: 20 }}>
              Irzzen Productions est né d&apos;une conviction simple : chaque mariage mérite d&apos;être immortalisé avec l&apos;attention et l&apos;art qu&apos;il mérite.
            </p>
            <p style={{ fontSize: 15, color: "rgba(17,16,16,0.5)", lineHeight: 1.8, fontWeight: 300, marginBottom: 40 }}>
              Depuis 15 ans, notre équipe de 12 professionnels capture des histoires d&apos;amour à travers toute la France et au-delà. Chaque couple repart avec des souvenirs qui traverseront le temps.
            </p>
            <Link href="/contact" className="btn-dark" style={{ textDecoration: "none" }}>
              Travailler avec nous
            </Link>
          </div>
          <div style={{ aspectRatio: "4/5", background: "#E8E4DF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="label" style={{ color: "rgba(17,16,16,0.2)" }}>Photo équipe</span>
          </div>
        </div>
      </section>

      {/* Chiffres */}
      <section style={{ background: "#111010", padding: "80px 40px" }}>
        <div style={{ maxWidth: 1380, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {[
            { value: "15+", label: "Ans d'expérience" },
            { value: "12", label: "Professionnels" },
            { value: "500+", label: "Mariages" },
            { value: "4.9", label: "Note moyenne" },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: "40px 32px", borderTop: "1px solid rgba(249,246,242,0.07)", textAlign: "center" }}>
              <div className="serif" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: "#F9F6F2", marginBottom: 12, letterSpacing: "-0.02em" }}>
                {stat.value}
              </div>
              <div className="label" style={{ color: "rgba(249,246,242,0.2)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Valeurs */}
      <section style={{ padding: "80px 40px", maxWidth: 1380, margin: "0 auto" }}>
        <p className="label" style={{ marginBottom: 16 }}>Ce qui nous guide</p>
        <h2 className="serif" style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 700, color: "#111010", letterSpacing: "-0.02em", marginBottom: 56 }}>
          Nos valeurs
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {valeurs.map((v) => (
            <div key={v.titre} style={{ padding: "40px 0", borderTop: "1px solid rgba(17,16,16,0.08)", display: "flex", gap: 32, alignItems: "start" }}>
              <span style={{ display: "block", width: 1, height: 48, background: "#9E8A94", flexShrink: 0, marginTop: 4 }} />
              <div>
                <h3 className="serif" style={{ fontSize: 22, fontWeight: 700, color: "#111010", marginBottom: 12, letterSpacing: "-0.01em" }}>
                  {v.titre}
                </h3>
                <p style={{ fontSize: 14, color: "rgba(17,16,16,0.45)", lineHeight: 1.75, fontWeight: 300 }}>{v.texte}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
