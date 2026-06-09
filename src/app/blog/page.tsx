import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Conseils & Inspirations Mariage",
  description:
    "Conseils photo, inspirations mariage, tendances et témoignages. Le blog d'Irzzen Productions pour préparer votre reportage mariage avec sérénité.",
};

const articles = [
  {
    slug: "comment-choisir-photographe-mariage",
    titre: "Comment choisir son photographe de mariage : 7 critères essentiels",
    extrait: "Le choix du photographe est l'une des décisions les plus importantes de votre mariage. Voici les critères qui font la différence entre un souvenir ordinaire et des images qui traversent le temps.",
    categorie: "Conseils",
    date: "15 novembre 2024",
    lecture: "6 min",
  },
  {
    slug: "tendances-photo-mariage-2025",
    titre: "Tendances photographie mariage 2025 : ce qui va marquer les albums",
    extrait: "Film argentique, lumières dorées, formats carrés… Découvrez les grandes tendances qui vont définir l'esthétique des mariages en 2025.",
    categorie: "Tendances",
    date: "3 octobre 2024",
    lecture: "4 min",
  },
  {
    slug: "preparer-reportage-photo-mariage",
    titre: "Préparer son reportage photo mariage : le guide complet",
    extrait: "Timeline, liste de photos, séance couple… Tout ce que vous devez savoir pour préparer au mieux votre reportage photo et obtenir les plus belles images.",
    categorie: "Guides",
    date: "22 septembre 2024",
    lecture: "8 min",
  },
  {
    slug: "film-mariage-cinematographique-vs-reportage",
    titre: "Film cinématographique vs reportage vidéo : lequel choisir ?",
    extrait: "Deux approches radicalement différentes pour immortaliser votre mariage en vidéo. On vous explique tout pour faire le bon choix.",
    categorie: "Conseils",
    date: "10 août 2024",
    lecture: "5 min",
  },
  {
    slug: "drone-mariage-tout-savoir",
    titre: "Drone de mariage : tout ce qu'il faut savoir avant de commander",
    extrait: "Réglementation, météo, lieux autorisés, surcoût… Le guide complet sur la photographie et vidéo par drone pour votre mariage.",
    categorie: "Guides",
    date: "28 juillet 2024",
    lecture: "7 min",
  },
  {
    slug: "album-photo-mariage-comment-choisir",
    titre: "Album photo de mariage : formats, papiers, reliures — comment choisir",
    extrait: "L'album photo est le seul support qui traversera les générations. Voici comment choisir un album qui sera encore magnifique dans 50 ans.",
    categorie: "Conseils",
    date: "15 juin 2024",
    lecture: "5 min",
  },
];

const categories = ["Tous", "Conseils", "Guides", "Tendances"];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24">
      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <p className="text-xs tracking-[0.5em] uppercase text-[#C9A84C] mb-4">Blog</p>
        <h1
          className="text-5xl md:text-7xl font-bold text-[#FAFAFA] leading-tight mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Conseils &{" "}
          <span className="text-gradient-gold italic">inspirations</span>
        </h1>
        <p className="text-[#FAFAFA]/50 text-lg max-w-xl mx-auto font-light">
          Nos experts partagent leurs conseils pour un reportage mariage réussi.
        </p>
      </section>

      {/* Articles */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {/* Article à la une */}
          <Link href={`/blog/${articles[0].slug}`} className="group block mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 glass p-8 hover:border-[#C9A84C]/40 transition-all border border-[#C9A84C]/15">
              <div className="aspect-video bg-[#111111] border border-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]/20">
                <span className="text-xs tracking-widest uppercase">Image article</span>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#C9A84C]/15 text-[#C9A84C] text-xs tracking-widest uppercase">
                    {articles[0].categorie}
                  </span>
                  <span className="text-xs text-[#FAFAFA]/30">{articles[0].date}</span>
                  <span className="text-xs text-[#FAFAFA]/30">· {articles[0].lecture}</span>
                </div>
                <h2
                  className="text-3xl font-bold text-[#FAFAFA] mb-4 group-hover:text-[#C9A84C] transition-colors leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {articles[0].titre}
                </h2>
                <p className="text-[#FAFAFA]/50 text-sm leading-relaxed mb-6">
                  {articles[0].extrait}
                </p>
                <div className="flex items-center gap-2 text-sm text-[#C9A84C] tracking-widest uppercase font-medium">
                  Lire l&apos;article <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>

          {/* Grille articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(1).map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group glass p-6 flex flex-col hover:border-[#C9A84C]/40 transition-all border border-[#C9A84C]/15"
              >
                <div className="aspect-video bg-[#111111] border border-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C]/20 mb-5">
                  <span className="text-[10px] tracking-widest uppercase">Image</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] px-2 py-0.5 bg-[#C9A84C]/15 text-[#C9A84C] tracking-widest uppercase">
                    {article.categorie}
                  </span>
                  <span className="text-[10px] text-[#FAFAFA]/30">{article.lecture}</span>
                </div>
                <h2
                  className="text-lg font-bold text-[#FAFAFA] mb-3 flex-1 group-hover:text-[#C9A84C] transition-colors leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {article.titre}
                </h2>
                <p className="text-xs text-[#FAFAFA]/40 leading-relaxed mb-4 line-clamp-3">
                  {article.extrait}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#C9A84C]/70 tracking-widest uppercase group-hover:gap-3 transition-all">
                  Lire <ArrowRight size={11} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
