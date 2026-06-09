"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/mariage", label: "Mariage" },
  { href: "/formations", label: "Formations" },
  { href: "/galerie", label: "Galerie" },
  { href: "/a-propos", label: "À propos" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHero = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const lightMode = isHero && !scrolled;

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        scrolled || !isHero
          ? "bg-[#F6F2EE]/96 backdrop-blur-xl border-b border-[#0E0C10]/8"
          : "bg-transparent"
      )}>
        <div className="max-w-[1400px] mx-auto px-8 lg:px-12 flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-3 group">
            <span
              className={cn(
                "text-xl font-bold tracking-[0.2em] uppercase transition-colors duration-500",
                lightMode ? "text-[#F6F2EE]" : "text-[#0E0C10]"
              )}
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Irzzen
            </span>
            <span className={cn(
              "hidden sm:block text-[9px] tracking-[0.5em] uppercase font-light transition-colors duration-500",
              lightMode ? "text-[#F6F2EE]/40" : "text-[#0E0C10]/30"
            )}>
              Productions
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[11px] tracking-[0.35em] uppercase font-light transition-all duration-300 relative group",
                  lightMode ? "text-[#F6F2EE]/70 hover:text-[#F6F2EE]" : "text-[#0E0C10]/50 hover:text-[#0E0C10]"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300",
                  lightMode ? "bg-[#F6F2EE]" : "bg-[#A8919E]"
                )} />
              </Link>
            ))}
          </nav>

          {/* Droite */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/client/dashboard"
              className={cn(
                "text-[11px] tracking-[0.35em] uppercase font-light transition-colors duration-300",
                lightMode ? "text-[#F6F2EE]/50 hover:text-[#F6F2EE]" : "text-[#0E0C10]/40 hover:text-[#0E0C10]"
              )}
            >
              Espace client
            </Link>
            <Link
              href="/tarifs"
              className={cn(
                "px-5 py-2 text-[11px] tracking-[0.3em] uppercase font-semibold transition-all duration-300 gold-glow",
                lightMode
                  ? "bg-[#F6F2EE] text-[#0E0C10] hover:bg-white"
                  : "bg-[#0E0C10] text-[#F6F2EE] hover:bg-[#2A2028]"
              )}
            >
              Réserver
            </Link>
          </div>

          {/* Burger */}
          <button
            className={cn("lg:hidden transition-colors", lightMode ? "text-[#F6F2EE]" : "text-[#0E0C10]")}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Ligne architecturale */}
        {scrolled && <div className="h-px bg-[#0E0C10]/8" />}
      </header>

      {/* Menu mobile */}
      <div className={cn(
        "fixed inset-0 z-40 bg-[#0E0C10] flex flex-col justify-between p-10 transition-all duration-500",
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <button
          className="self-end text-[#F6F2EE]/60 hover:text-[#F6F2EE]"
          onClick={() => setOpen(false)}
        >
          <X size={24} />
        </button>

        <nav className="flex flex-col gap-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-4 group"
            >
              <span className="text-[10px] text-[#A8919E]/50 tracking-widest w-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-4xl font-bold text-[#F6F2EE] group-hover:text-[#A8919E] transition-colors"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-4">
          <Link href="/client/dashboard" onClick={() => setOpen(false)} className="text-[11px] tracking-widest uppercase text-[#F6F2EE]/30">
            Espace client
          </Link>
          <Link
            href="/tarifs"
            onClick={() => setOpen(false)}
            className="px-6 py-3 bg-[#A8919E] text-[#0E0C10] text-[11px] tracking-widest uppercase font-semibold text-center"
          >
            Réserver notre équipe
          </Link>
        </div>
      </div>
    </>
  );
}
