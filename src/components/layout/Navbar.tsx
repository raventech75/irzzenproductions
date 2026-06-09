"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/mariage", label: "Mariage" },
  { href: "/galerie", label: "Galerie" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "background 0.5s, border-color 0.5s",
          background: transparent ? "transparent" : "rgba(249,246,242,0.97)",
          borderBottom: transparent ? "1px solid transparent" : "1px solid rgba(17,16,16,0.08)",
          backdropFilter: transparent ? "none" : "blur(12px)",
        }}
      >
        <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 40px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              className="serif"
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: transparent ? "#F9F6F2" : "#111010",
                transition: "color 0.5s",
              }}
            >
              Irzzen
            </span>
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.45em",
                textTransform: "uppercase",
                marginLeft: 8,
                color: transparent ? "rgba(249,246,242,0.4)" : "rgba(17,16,16,0.3)",
                transition: "color 0.5s",
                fontWeight: 300,
              }}
            >
              Productions
            </span>
          </Link>

          {/* Nav desktop */}
          <nav style={{ display: "flex", gap: 40 }} className="hidden lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                  textDecoration: "none",
                  color: transparent ? "rgba(249,246,242,0.7)" : "rgba(17,16,16,0.55)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = transparent ? "#F9F6F2" : "#111010")}
                onMouseLeave={e => (e.currentTarget.style.color = transparent ? "rgba(249,246,242,0.7)" : "rgba(17,16,16,0.55)")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden lg:flex" style={{ alignItems: "center", gap: 28 }}>
            <Link
              href="/client/dashboard"
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: transparent ? "rgba(249,246,242,0.45)" : "rgba(17,16,16,0.35)",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = transparent ? "#F9F6F2" : "#111010")}
              onMouseLeave={e => (e.currentTarget.style.color = transparent ? "rgba(249,246,242,0.45)" : "rgba(17,16,16,0.35)")}
            >
              Espace client
            </Link>
            <Link
              href="/contact"
              style={{
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 500,
                textDecoration: "none",
                padding: "10px 24px",
                border: `1px solid ${transparent ? "rgba(249,246,242,0.4)" : "rgba(17,16,16,0.2)"}`,
                color: transparent ? "#F9F6F2" : "#111010",
                transition: "all 0.2s",
              }}
            >
              Réserver
            </Link>
          </div>

          {/* Burger mobile */}
          <button
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", color: transparent ? "#F9F6F2" : "#111010" }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Menu mobile */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 99,
        background: "#111010",
        display: "flex",
        flexDirection: "column",
        padding: "100px 40px 60px",
        transition: "opacity 0.4s, transform 0.4s",
        opacity: open ? 1 : 0,
        transform: open ? "translateY(0)" : "translateY(-8px)",
        pointerEvents: open ? "auto" : "none",
      }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 20 }}
            >
              <span style={{ fontSize: 10, color: "rgba(249,246,242,0.25)", letterSpacing: "0.3em", width: 24 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="serif"
                style={{ fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 700, color: "#F9F6F2", lineHeight: 1.1 }}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: "auto" }}>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            style={{
              display: "inline-block",
              padding: "14px 32px",
              background: "#F9F6F2",
              color: "#111010",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Réserver
          </Link>
        </div>
      </div>
    </>
  );
}
