"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/mariage",   label: "Mariage" },
  { href: "/galerie",   label: "Galerie" },
  { href: "/tarifs",    label: "Tarifs" },
  { href: "/a-propos",  label: "À propos" },
  { href: "/contact",   label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pathname = usePathname();
  const onHome   = pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* transparent only on homepage before scroll */
  const solid = scrolled || !onHome;

  return (
    <>
      {/* ── Bar principale ── */}
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solid
            ? "bg-[#FDFAF7]/95 backdrop-blur-md border-b border-[rgba(38,30,20,0.07)]"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
      >
        <div className="wrap flex items-center justify-between h-[70px]">

          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-2 no-underline">
            <span
              className={[
                "font-[family-name:var(--font-playfair)] font-bold text-[17px] tracking-[0.15em] uppercase transition-colors duration-500",
                solid ? "text-[#261E14]" : "text-[#261E14]",
              ].join(" ")}
            >
              Irzzen
            </span>
            <span className="hidden sm:inline text-[9px] tracking-[0.45em] uppercase font-light text-[rgba(38,30,20,0.35)]">
              Productions
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[11px] tracking-[0.28em] uppercase font-normal text-[rgba(38,30,20,0.52)] hover:text-[#261E14] transition-colors no-underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/client/dashboard"
              className="text-[11px] tracking-[0.28em] uppercase font-light text-[rgba(38,30,20,0.38)] hover:text-[#261E14] transition-colors no-underline"
            >
              Espace client
            </Link>
            <Link href="/contact" className="btn-fill text-[10px] py-[10px] px-5">
              Réserver
            </Link>
          </div>

          {/* Burger */}
          <button
            className="lg:hidden text-[#261E14] bg-transparent border-0 cursor-pointer p-1"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Menu mobile ── */}
      <div
        className={[
          "fixed inset-0 z-40 bg-[#FDFAF7] flex flex-col pt-[100px] px-8 pb-12 transition-all duration-400",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="g-bar h-[2px] w-12 mb-10 rounded-full" />
        <nav className="flex flex-col gap-6 flex-1">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-baseline gap-4 no-underline group"
            >
              <span className="text-[10px] text-[rgba(38,30,20,0.25)] tracking-[0.3em] w-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-[family-name:var(--font-playfair)] text-[clamp(26px,6vw,44px)] font-bold text-[#261E14] group-hover:g-text transition-colors leading-tight">
                {l.label}
              </span>
            </Link>
          ))}
        </nav>
        <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn-fill self-start mt-8">
          Réserver
        </Link>
      </div>
    </>
  );
}
