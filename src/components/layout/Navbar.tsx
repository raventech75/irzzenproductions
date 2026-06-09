"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#C9A84C]/20 py-3"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group">
          <span
            className="text-2xl font-bold tracking-widest uppercase text-gradient-gold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Irzzen
          </span>
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#C9A84C]/60 font-light">
            Productions
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-widest uppercase text-[#FAFAFA]/60 hover:text-[#C9A84C] transition-colors duration-300 font-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/client"
            className="text-sm tracking-widest uppercase text-[#FAFAFA]/50 hover:text-[#C9A84C] transition-colors duration-300"
          >
            Espace Client
          </Link>
          <Link
            href="/tarifs"
            className="px-6 py-2.5 bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold tracking-widest uppercase hover:bg-[#E8C96A] transition-colors duration-300"
          >
            Réserver
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="lg:hidden text-[#FAFAFA]/80 hover:text-[#C9A84C] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#0A0A0A]/98 backdrop-blur-xl border-t border-[#C9A84C]/20">
          <nav className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm tracking-widest uppercase text-[#FAFAFA]/60 hover:text-[#C9A84C] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[#C9A84C]/20 pt-6 flex flex-col gap-4">
              <Link
                href="/client"
                onClick={() => setOpen(false)}
                className="text-sm tracking-widest uppercase text-[#FAFAFA]/50 hover:text-[#C9A84C] transition-colors"
              >
                Espace Client
              </Link>
              <Link
                href="/tarifs"
                onClick={() => setOpen(false)}
                className="px-6 py-3 bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold tracking-widest uppercase text-center hover:bg-[#E8C96A] transition-colors"
              >
                Réserver
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
