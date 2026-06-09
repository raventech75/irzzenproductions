import Link from "next/link";
import { Mail } from "lucide-react";

const nav = [
  { href: "/mariage", label: "Mariage" },
  { href: "/formations", label: "Formations" },
  { href: "/galerie", label: "Galerie" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/a-propos", label: "À propos" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="bg-[#F6F2EE] border-t border-[#0E0C10]/8 relative z-10">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 py-20">

        {/* Top */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">

          {/* Marque */}
          <div className="lg:col-span-4">
            <h2
              className="text-[clamp(32px,4vw,56px)] font-bold text-[#0E0C10] leading-none tracking-[-0.02em] mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Irzzen<br />
              <span className="text-gradient-gold">Productions</span>
            </h2>
            <p className="text-[#0E0C10]/40 text-sm font-light leading-relaxed max-w-xs">
              Photographes & vidéastes spécialisés dans le mariage haut de gamme. 15 ans d'expérience, 500+ histoires immortalisées.
            </p>
          </div>

          {/* Nav */}
          <div className="lg:col-span-3 lg:col-start-6">
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#A8919E] mb-6">Navigation</p>
            <ul className="space-y-3">
              {nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#0E0C10]/45 hover:text-[#0E0C10] transition-colors font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-[10px] tracking-[0.5em] uppercase text-[#A8919E] mb-6">Contact</p>
            <a
              href="mailto:contact@irzzenproductions.fr"
              className="flex items-center gap-3 text-sm text-[#0E0C10]/45 hover:text-[#0E0C10] transition-colors font-light mb-4"
            >
              <Mail size={13} className="text-[#A8919E]" />
              contact@irzzenproductions.fr
            </a>
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#0E0C10]/12 flex items-center justify-center text-[#0E0C10]/30 hover:border-[#0E0C10]/40 hover:text-[#0E0C10] transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-[#0E0C10]/12 flex items-center justify-center text-[#0E0C10]/30 hover:border-[#0E0C10]/40 hover:text-[#0E0C10] transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
            </div>
            <div className="mt-8">
              <Link
                href="/tarifs"
                className="inline-block px-6 py-3 bg-[#0E0C10] text-[#F6F2EE] text-[11px] tracking-[0.35em] uppercase hover:bg-[#2A2028] transition-colors"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#0E0C10]/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#0E0C10]/25 tracking-wide">
            © 2025 Irzzen Productions
          </p>
          <div className="flex gap-8">
            {[
              { href: "/mentions-legales", label: "Mentions légales" },
              { href: "/cgv", label: "CGV" },
              { href: "/confidentialite", label: "Confidentialité" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-[11px] text-[#0E0C10]/25 hover:text-[#0E0C10]/50 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
