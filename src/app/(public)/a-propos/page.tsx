import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos — Notre équipe",
  description: "15 ans d'expérience, 12 professionnels passionnés.",
};

const valeurs = [
  { titre: "Discrétion",  texte: "Nous nous fondons dans votre journée pour capturer l'authenticité sans jamais la perturber.", bar: "bg-[#E8A87C]" },
  { titre: "Exigence",    texte: "Chaque photo est retouchée, chaque image est choisie avec soin. Rien n'est laissé au hasard.", bar: "bg-[#DFA0AE]" },
  { titre: "Émotion",     texte: "Nous ne photographions pas des poses. Nous capturons des instants vrais, inoubliables.", bar: "bg-[#8FAF78]" },
  { titre: "Fiabilité",   texte: "15 ans de mariages sans un seul incident. Contrat, acompte, livraison — toujours tenu.", bar: "bg-[#E8A87C]" },
];

const stats = [
  { v: "15+",  l: "Ans d'expérience",  bar: "bg-[#E8A87C]" },
  { v: "12",   l: "Professionnels",     bar: "bg-[#DFA0AE]" },
  { v: "500+", l: "Mariages",           bar: "bg-[#8FAF78]" },
  { v: "4.9",  l: "Note moyenne",       bar: "bg-[#DFA0AE]" },
];

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF7]">

      {/* ── Hero ── */}
      <div className="wrap pt-[120px] pb-20 border-b border-[rgba(38,30,20,0.06)]">
        <p className="label-tag mb-4">Notre histoire</p>
        <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight leading-[0.94] mb-14"
          style={{ fontSize: "clamp(38px,6vw,88px)" }}>
          Une passion, <span className="g-text">15 ans de maîtrise.</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-[15px] text-[rgba(38,30,20,0.5)] font-light leading-[1.8] mb-5">
              Irzzen Productions est né d&apos;une conviction simple : chaque mariage mérite d&apos;être immortalisé avec l&apos;attention et l&apos;art qu&apos;il mérite.
            </p>
            <p className="text-[15px] text-[rgba(38,30,20,0.5)] font-light leading-[1.8] mb-10">
              Depuis 15 ans, notre équipe de 12 professionnels capture des histoires d&apos;amour à travers toute la France et au-delà.
            </p>
            <Link href="/contact" className="btn-fill">Travailler avec nous</Link>
          </div>
          <div className="aspect-[4/5] g-bg border border-white/80 flex items-center justify-center rounded-sm">
            <span className="label-tag opacity-40">Photo équipe</span>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="g-bg border-b border-[rgba(38,30,20,0.06)]">
        <div className="wrap py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgba(38,30,20,0.06)]">
            {stats.map(s => (
              <div key={s.l} className="bg-[#FDFAF7]/80 p-10 text-center">
                <div className={`h-[2px] w-8 rounded-full mx-auto mb-5 ${s.bar}`} />
                <p className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] text-[40px] leading-none mb-2">{s.v}</p>
                <p className="label-tag">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Valeurs ── */}
      <div className="wrap py-24">
        <p className="label-tag mb-4">Ce qui nous guide</p>
        <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight mb-14"
          style={{ fontSize: "clamp(26px,3.5vw,46px)" }}>
          Nos valeurs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(38,30,20,0.06)]">
          {valeurs.map(v => (
            <div key={v.titre} className="bg-[#FDFAF7] p-10 flex gap-6">
              <span className={`w-[3px] h-12 rounded-full shrink-0 mt-1 ${v.bar}`} />
              <div>
                <h3 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] text-[22px] mb-3">{v.titre}</h3>
                <p className="text-[14px] text-[rgba(38,30,20,0.48)] leading-[1.75] font-light">{v.texte}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
