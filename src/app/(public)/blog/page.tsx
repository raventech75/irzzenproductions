import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Blog — Conseils & Inspirations Mariage",
  description: "Conseils photo, inspirations mariage, tendances et guides pratiques.",
};

export default function BlogPage() {
  const [une, ...reste] = articles;

  return (
    <div className="min-h-screen bg-[#FDFAF7]">

      {/* Hero */}
      <section className="g-bg pt-[140px] pb-16">
        <div className="wrap text-center">
          <p className="label-tag mb-4">Blog</p>
          <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight leading-[0.93] mb-5"
            style={{ fontSize: "clamp(38px,5.5vw,80px)" }}>
            Conseils &amp; <span className="g-text italic">inspirations</span>
          </h1>
          <p className="text-[15px] text-[rgba(38,30,20,0.48)] max-w-md mx-auto font-light">
            Nos experts partagent leurs conseils pour un reportage mariage réussi.
          </p>
        </div>
      </section>

      <section className="bg-[#FDFAF7] py-16 pb-28">
        <div className="wrap">

          {/* Article à la une */}
          <Link href={`/blog/${une.slug}`} className="group block mb-10 no-underline">
            <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden border border-[rgba(38,30,20,0.07)] hover:border-[#DFA0AE]/40 transition-colors">
              <div className="relative aspect-video lg:aspect-auto overflow-hidden">
                <Image src={une.image} alt={une.imageAlt} fill sizes="50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700" priority />
              </div>
              <div className="flex flex-col justify-center p-10 bg-white/60">
                <div className="flex items-center gap-3 mb-5">
                  <span className="px-3 py-1 text-[10px] tracking-[0.35em] uppercase text-[#DFA0AE] border border-[#DFA0AE]/30">{une.categorie}</span>
                  <span className="flex items-center gap-1 text-[11px] text-[rgba(38,30,20,0.35)]"><Clock size={11} /> {une.lecture}</span>
                  <span className="text-[11px] text-[rgba(38,30,20,0.3)]">{une.date}</span>
                </div>
                <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] text-[28px] mb-4 leading-tight group-hover:text-[#DFA0AE] transition-colors">{une.titre}</h2>
                <p className="text-[14px] text-[rgba(38,30,20,0.48)] leading-[1.7] mb-8 font-light">{une.extrait}</p>
                <span className="label-tag group-hover:opacity-70 transition-opacity">Lire l&apos;article →</span>
              </div>
            </div>
          </Link>

          {/* Grille */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reste.map(article => (
              <Link key={article.slug} href={`/blog/${article.slug}`}
                className="group border border-[rgba(38,30,20,0.07)] hover:border-[#DFA0AE]/30 transition-colors overflow-hidden flex flex-col no-underline">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={article.image} alt={article.imageAlt} fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="flex flex-col flex-1 p-6 bg-white/50">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-[#DFA0AE]">{article.categorie}</span>
                    <span className="flex items-center gap-1 text-[10px] text-[rgba(38,30,20,0.3)]"><Clock size={9} /> {article.lecture}</span>
                  </div>
                  <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] text-[17px] mb-3 flex-1 leading-tight group-hover:text-[#DFA0AE] transition-colors">{article.titre}</h2>
                  <p className="text-[12px] text-[rgba(38,30,20,0.42)] leading-[1.65] mb-4 line-clamp-2">{article.extrait}</p>
                  <span className="label-tag text-[9px]">Lire →</span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
