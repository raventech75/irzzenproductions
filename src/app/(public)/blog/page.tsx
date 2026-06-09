import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Blog — Conseils & Inspirations Mariage",
  description:
    "Conseils photo, inspirations mariage, tendances et guides pratiques. Le blog d'Irzzen Productions pour préparer votre reportage mariage avec sérénité.",
};

export default function BlogPage() {
  const [une, ...reste] = articles;

  return (
    <div className="min-h-screen bg-[#F7F3EF] pt-24">
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <p className="text-xs tracking-[0.5em] uppercase text-[#C4A5B5] mb-4">Blog</p>
        <h1
          className="text-5xl md:text-7xl font-bold text-[#1A1520] leading-tight mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Conseils &{" "}
          <span className="text-gradient-gold italic">inspirations</span>
        </h1>
        <p className="text-[#1A1520]/50 text-lg max-w-xl mx-auto font-light">
          Nos experts partagent leurs conseils pour un reportage mariage réussi.
        </p>
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Article à la une */}
          <Link href={`/blog/${une.slug}`} className="group block mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[#C4A5B5]/15 hover:border-[#C4A5B5]/40 transition-all overflow-hidden">
              <div className="relative aspect-video lg:aspect-auto">
                <Image
                  src={une.image}
                  alt={une.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-[#F7F3EF]/20 group-hover:bg-[#F7F3EF]/10 transition-colors" />
              </div>
              <div className="flex flex-col justify-center p-10 bg-[#0E0E0E]">
                <div className="flex items-center gap-3 mb-5">
                  <span className="px-3 py-1 bg-[#C4A5B5]/15 text-[#C4A5B5] text-xs tracking-widest uppercase">
                    {une.categorie}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#1A1520]/30">
                    <Clock size={11} /> {une.lecture}
                  </span>
                  <span className="text-xs text-[#1A1520]/25">{une.date}</span>
                </div>
                <h2
                  className="text-3xl font-bold text-[#1A1520] mb-5 group-hover:text-[#C4A5B5] transition-colors leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {une.titre}
                </h2>
                <p className="text-[#1A1520]/50 text-sm leading-relaxed mb-8">
                  {une.extrait}
                </p>
                <div className="flex items-center gap-2 text-sm text-[#C4A5B5] tracking-widest uppercase font-medium group-hover:gap-4 transition-all">
                  Lire l&apos;article <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>

          {/* Grille articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reste.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group border border-[#C4A5B5]/15 hover:border-[#C4A5B5]/40 transition-all overflow-hidden flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-[#F7F3EF]/20" />
                </div>
                <div className="p-6 flex flex-col flex-1 bg-[#0E0E0E]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] px-2 py-0.5 bg-[#C4A5B5]/15 text-[#C4A5B5] tracking-widest uppercase">
                      {article.categorie}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[#1A1520]/30">
                      <Clock size={9} /> {article.lecture}
                    </span>
                  </div>
                  <h2
                    className="text-lg font-bold text-[#1A1520] mb-3 flex-1 group-hover:text-[#C4A5B5] transition-colors leading-snug"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {article.titre}
                  </h2>
                  <p className="text-xs text-[#1A1520]/40 leading-relaxed mb-5 line-clamp-2">
                    {article.extrait}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[#C4A5B5]/60 tracking-widest uppercase group-hover:gap-3 transition-all">
                    Lire <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
