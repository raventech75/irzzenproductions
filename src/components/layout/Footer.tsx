import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#C9A84C]/15">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2
                className="text-3xl font-bold tracking-widest uppercase text-gradient-gold mb-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Irzzen
              </h2>
              <p className="text-xs tracking-[0.4em] uppercase text-[#C9A84C]/50">
                Productions
              </p>
            </div>
            <p className="text-[#FAFAFA]/50 text-sm leading-relaxed max-w-sm mb-8">
              Photographes et vidéastes spécialisés dans le mariage haut de
              gamme. 15 ans d&apos;expérience, une équipe de 12 professionnels
              passionnés pour immortaliser votre histoire.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]/60 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]/60 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs tracking-[0.3em] uppercase text-[#C9A84C] mb-6 font-medium">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/mariage", label: "Mariage" },
                { href: "/formations", label: "Formations" },
                { href: "/galerie", label: "Galerie" },
                { href: "/tarifs", label: "Tarifs" },
                { href: "/a-propos", label: "À propos" },
                { href: "/blog", label: "Blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#FAFAFA]/50 hover:text-[#C9A84C] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs tracking-[0.3em] uppercase text-[#C9A84C] mb-6 font-medium">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:contact@irzzenproductions.fr"
                  className="flex items-center gap-3 text-sm text-[#FAFAFA]/50 hover:text-[#C9A84C] transition-colors group"
                >
                  <Mail size={14} className="text-[#C9A84C]/60 group-hover:text-[#C9A84C]" />
                  contact@irzzenproductions.fr
                </a>
              </li>
              <li>
                <a
                  href="tel:+33600000000"
                  className="flex items-center gap-3 text-sm text-[#FAFAFA]/50 hover:text-[#C9A84C] transition-colors group"
                >
                  <Phone size={14} className="text-[#C9A84C]/60 group-hover:text-[#C9A84C]" />
                  +33 6 00 00 00 00
                </a>
              </li>
            </ul>
            <div className="mt-8">
              <Link
                href="/tarifs"
                className="inline-block px-6 py-3 bg-[#C9A84C] text-[#0A0A0A] text-xs font-semibold tracking-widest uppercase hover:bg-[#E8C96A] transition-colors duration-300"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#C9A84C]/15 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#FAFAFA]/30 tracking-wide">
            © 2025 Irzzen Productions. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link
              href="/mentions-legales"
              className="text-xs text-[#FAFAFA]/30 hover:text-[#C9A84C]/60 transition-colors"
            >
              Mentions légales
            </Link>
            <Link
              href="/cgv"
              className="text-xs text-[#FAFAFA]/30 hover:text-[#C9A84C]/60 transition-colors"
            >
              CGV
            </Link>
            <Link
              href="/confidentialite"
              className="text-xs text-[#FAFAFA]/30 hover:text-[#C9A84C]/60 transition-colors"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
