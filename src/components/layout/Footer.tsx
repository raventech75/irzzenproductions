import Link from "next/link";
import { Mail } from "lucide-react";

const nav = [
  { href: "/mariage",    label: "Mariage" },
  { href: "/galerie",    label: "Galerie" },
  { href: "/tarifs",     label: "Tarifs" },
  { href: "/a-propos",   label: "À propos" },
  { href: "/formations", label: "Formations" },
  { href: "/blog",       label: "Blog" },
  { href: "/contact",    label: "Contact" },
];

export function Footer() {
  return (
    <footer className="g-bg border-t border-[rgba(38,30,20,0.06)]">
      <div className="wrap pt-16 pb-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 pb-14 border-b border-[rgba(38,30,20,0.07)]">

          {/* Marque */}
          <div>
            <p className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] leading-tight mb-4"
              style={{ fontSize: "clamp(26px,3vw,38px)" }}>
              Irzzen<br />
              <span className="g-text">Productions</span>
            </p>
            <p className="text-[13px] text-[rgba(38,30,20,0.45)] leading-[1.7] font-light max-w-[240px] mb-6">
              Photographes &amp; vidéastes spécialisés dans le mariage haut de gamme.
            </p>
            <Link href="/tarifs" className="btn-fill text-[10px] py-[10px] px-5">Réserver</Link>
          </div>

          {/* Navigation */}
          <div>
            <p className="label-tag mb-5">Navigation</p>
            <ul className="space-y-3 list-none">
              {nav.map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-[13px] text-[rgba(38,30,20,0.48)] hover:text-[#261E14] transition-colors no-underline font-light">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="label-tag mb-5">Contact</p>
            <a href="mailto:contact@irzzenproductions.fr"
              className="flex items-center gap-3 text-[13px] text-[rgba(38,30,20,0.48)] hover:text-[#261E14] transition-colors no-underline font-light mb-6">
              <Mail size={13} className="text-[#DFA0AE]" />
              contact@irzzenproductions.fr
            </a>

            <div className="flex gap-2">
              {/* Instagram */}
              <a href="https://www.instagram.com/irzzenproductions" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/60 border border-[rgba(38,30,20,0.1)] flex items-center justify-center text-[rgba(38,30,20,0.4)] hover:text-[#DFA0AE] hover:border-[#DFA0AE] transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://www.youtube.com/@irzzenproductions" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/60 border border-[rgba(38,30,20,0.1)] flex items-center justify-center text-[rgba(38,30,20,0.4)] hover:text-[#DFA0AE] hover:border-[#DFA0AE] transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <p className="text-[11px] text-[rgba(38,30,20,0.28)] tracking-wide">© 2025 Irzzen Productions</p>
          <div className="flex gap-7">
            {[
              { href: "/mentions-legales", label: "Mentions légales" },
              { href: "/cgv",              label: "CGV" },
              { href: "/confidentialite",  label: "Confidentialité" },
            ].map(l => (
              <Link key={l.href} href={l.href}
                className="text-[11px] text-[rgba(38,30,20,0.28)] no-underline hover:text-[rgba(38,30,20,0.6)] transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
