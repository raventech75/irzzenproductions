import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import { getArticle, articles, type Section } from "@/lib/articles";

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.titre,
    description: article.metaDescription,
    openGraph: {
      title: article.titre,
      description: article.metaDescription,
      images: [{ url: article.image }],
      type: "article",
      publishedTime: article.dateISO,
    },
  };
}

function RenderSection({ section }: { section: Section }) {
  switch (section.type) {
    case "intro":
      return (
        <p className="text-xl text-[#FAFAFA]/70 leading-relaxed font-light border-l-2 border-[#C9A84C] pl-6 my-8">
          {section.contenu}
        </p>
      );
    case "h2":
      return (
        <h2
          className="text-3xl font-bold text-[#FAFAFA] mt-12 mb-5"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {section.contenu}
        </h2>
      );
    case "h3":
      return (
        <h3 className="text-xl font-semibold text-[#C9A84C] mt-6 mb-3">
          {section.contenu}
        </h3>
      );
    case "p":
      return (
        <p className="text-[#FAFAFA]/60 leading-relaxed mb-5 text-base">
          {section.contenu}
        </p>
      );
    case "ul":
      return (
        <ul className="space-y-2 my-5 pl-1">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#FAFAFA]/60 text-sm leading-relaxed">
              <span className="text-[#C9A84C] mt-1 flex-shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-3 my-5 pl-1">
          {section.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-4 text-[#FAFAFA]/60 text-sm leading-relaxed">
              <span
                className="text-[#C9A84C] font-bold text-lg leading-none flex-shrink-0 mt-0.5"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {i + 1}.
              </span>
              {item}
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="my-8 glass p-8 border-l-4 border-[#C9A84C] italic text-[#FAFAFA]/70 text-lg leading-relaxed">
          {section.contenu}
        </blockquote>
      );
    case "image":
      return (
        <figure className="my-10">
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={section.src!}
              alt={section.alt!}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {section.legende && (
            <figcaption className="text-xs text-[#FAFAFA]/30 text-center mt-3 italic">
              {section.legende}
            </figcaption>
          )}
        </figure>
      );
    case "cta":
      return (
        <div className="my-12 glass p-10 text-center border border-[#C9A84C]/25 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
          <p className="text-[#FAFAFA]/70 text-lg mb-6">{section.contenu}</p>
          <Link
            href={section.lien!}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold tracking-widest uppercase hover:bg-[#E8C96A] transition-colors gold-glow"
          >
            {section.bouton} <ArrowRight size={13} />
          </Link>
        </div>
      );
    default:
      return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const idx = articles.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? articles[idx - 1] : null;
  const next = idx < articles.length - 1 ? articles[idx + 1] : null;

  const autresArticles = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24">
      {/* Hero image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[#C9A84C]/20 text-[#C9A84C] text-xs tracking-widest uppercase font-medium">
              {article.categorie}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#FAFAFA]/40">
              <Clock size={11} /> {article.lecture} de lecture
            </span>
            <span className="text-xs text-[#FAFAFA]/30">{article.date}</span>
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold text-[#FAFAFA] leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {article.titre}
          </h1>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs text-[#FAFAFA]/30 hover:text-[#C9A84C]/60 transition-colors mb-12"
        >
          <ArrowLeft size={12} /> Retour au blog
        </Link>

        <article className="prose-custom">
          {article.contenu.map((section, i) => (
            <RenderSection key={i} section={section} />
          ))}
        </article>

        {/* Navigation articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20 pt-12 border-t border-[#C9A84C]/15">
          {prev && (
            <Link href={`/blog/${prev.slug}`} className="group glass p-6 border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 transition-all">
              <div className="flex items-center gap-2 text-xs text-[#FAFAFA]/30 mb-2">
                <ArrowLeft size={11} /> Article précédent
              </div>
              <div className="text-sm font-medium text-[#FAFAFA]/70 group-hover:text-[#C9A84C] transition-colors leading-snug">
                {prev.titre}
              </div>
            </Link>
          )}
          {next && (
            <Link href={`/blog/${next.slug}`} className="group glass p-6 border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 transition-all md:text-right md:col-start-2">
              <div className="flex items-center gap-2 text-xs text-[#FAFAFA]/30 mb-2 md:justify-end">
                Article suivant <ArrowRight size={11} />
              </div>
              <div className="text-sm font-medium text-[#FAFAFA]/70 group-hover:text-[#C9A84C] transition-colors leading-snug">
                {next.titre}
              </div>
            </Link>
          )}
        </div>

        {/* Autres articles */}
        <div className="mt-20">
          <h2
            className="text-2xl font-bold text-[#FAFAFA] mb-8"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            À lire aussi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {autresArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group glass border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 transition-all overflow-hidden"
              >
                <div className="relative aspect-video">
                  <Image src={a.image} alt={a.imageAlt} fill className="object-cover" sizes="400px" />
                  <div className="absolute inset-0 bg-[#0A0A0A]/40 group-hover:bg-[#0A0A0A]/20 transition-colors" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={10} className="text-[#C9A84C]/60" />
                    <span className="text-[10px] text-[#C9A84C]/60 uppercase tracking-widest">{a.categorie}</span>
                  </div>
                  <h3 className="text-sm font-medium text-[#FAFAFA]/70 group-hover:text-[#FAFAFA] transition-colors leading-snug">
                    {a.titre}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
