"use client";

import Link from "next/link";
import Image from "next/image";

const photos = [
  { src: "/photos/1L9A7763.JPG", alt: "Mariage" },
  { src: encodeURI("/photos/Zineb & Fares - 00471.jpg"), alt: "Couple" },
  { src: "/photos/1L9A7557.JPG", alt: "Château" },
  { src: encodeURI("/photos/Ines & Umit- 0040.jpg"), alt: "Couple" },
  { src: "/photos/1L9A7115.JPG", alt: "Décoration" },
];

export function GalerieApercu() {
  return (
    <section style={{ background: "var(--fond)", padding: "100px 0" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 40px" }}>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <p className="label" style={{ marginBottom: 12 }}>Portfolio</p>
            <h2 className="serif" style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 700, color: "#2C2416", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              Nos plus belles histoires
            </h2>
          </div>
          <Link href="/galerie" style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--rose)", textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            Voir tout <span style={{ display: "block", width: 24, height: 1, background: "var(--rose)" }} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "300px 300px", gap: 8 }}>
          {/* Grande photo gauche */}
          <div style={{ gridRow: "1 / 3", position: "relative", overflow: "hidden" }}>
            <Image src={photos[0].src} alt={photos[0].alt} fill sizes="33vw" quality={80}
              style={{ objectFit: "cover", transition: "transform 0.8s ease" }}
              className="hover:scale-105"
            />
          </div>
          {photos.slice(1).map((p, i) => (
            <div key={i} style={{ position: "relative", overflow: "hidden" }}>
              <Image src={p.src} alt={p.alt} fill sizes="22vw" quality={80}
                style={{ objectFit: "cover", transition: "transform 0.8s ease" }}
                className="hover:scale-105"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
