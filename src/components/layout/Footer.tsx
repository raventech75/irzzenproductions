"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

const nav = [
  { href: "/mariage", label: "Mariage" },
  { href: "/galerie", label: "Galerie" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/a-propos", label: "À propos" },
  { href: "/formations", label: "Formations" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer style={{ background: "#111010", padding: "80px 0 40px" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 40px" }}>

        {/* Top */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 60, paddingBottom: 60, borderBottom: "1px solid rgba(249,246,242,0.07)" }}>

          {/* Marque */}
          <div>
            <div className="serif" style={{ fontSize: 28, fontWeight: 700, color: "#F9F6F2", marginBottom: 16, letterSpacing: "-0.01em" }}>
              Irzzen<br />
              <span style={{ color: "#9E8A94" }}>Productions</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(249,246,242,0.3)", lineHeight: 1.7, maxWidth: 260, fontWeight: 300 }}>
              Photographes & vidéastes spécialisés dans le mariage haut de gamme.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="label" style={{ marginBottom: 24, color: "rgba(249,246,242,0.25)" }}>Navigation</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      fontSize: 13,
                      color: "rgba(249,246,242,0.35)",
                      textDecoration: "none",
                      fontWeight: 300,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#F9F6F2")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(249,246,242,0.35)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="label" style={{ marginBottom: 24, color: "rgba(249,246,242,0.25)" }}>Contact</p>
            <a
              href="mailto:contact@irzzenproductions.fr"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                color: "rgba(249,246,242,0.4)",
                textDecoration: "none",
                marginBottom: 32,
                fontWeight: 300,
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F9F6F2")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(249,246,242,0.4)")}
            >
              <Mail size={13} style={{ color: "#9E8A94" }} />
              contact@irzzenproductions.fr
            </a>
            <div style={{ display: "flex", gap: 12 }}>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, border: "1px solid rgba(249,246,242,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(249,246,242,0.3)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,246,242,0.4)"; e.currentTarget.style.color = "#F9F6F2"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(249,246,242,0.1)"; e.currentTarget.style.color = "rgba(249,246,242,0.3)"; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, border: "1px solid rgba(249,246,242,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(249,246,242,0.3)", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,246,242,0.4)"; e.currentTarget.style.color = "#F9F6F2"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(249,246,242,0.1)"; e.currentTarget.style.color = "rgba(249,246,242,0.3)"; }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <p style={{ fontSize: 11, color: "rgba(249,246,242,0.2)", letterSpacing: "0.1em" }}>
            © 2025 Irzzen Productions
          </p>
          <div style={{ display: "flex", gap: 32 }}>
            {[
              { href: "/mentions-legales", label: "Mentions légales" },
              { href: "/cgv", label: "CGV" },
              { href: "/confidentialite", label: "Confidentialité" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 11, color: "rgba(249,246,242,0.2)", textDecoration: "none", letterSpacing: "0.1em" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
