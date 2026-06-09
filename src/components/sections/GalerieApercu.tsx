"use client";

import Link from "next/link";
import Image from "next/image";

const photos = [
  { src: "/photos/1L9A7763.JPG",                              alt: "Mariage", span: "row-span-2" },
  { src: encodeURI("/photos/Zineb & Fares - 00471.jpg"),      alt: "Couple", span: "" },
  { src: "/photos/1L9A7557.JPG",                              alt: "Château", span: "" },
  { src: encodeURI("/photos/Ines & Umit- 0040.jpg"),          alt: "Couple", span: "" },
  { src: "/photos/1L9A7115.JPG",                              alt: "Décoration", span: "" },
];

export function GalerieApercu() {
  return (
    <section style={{ background: "#F9F6F2", padding: "120px 0" }}>
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "0 40px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <p className="label" style={{ marginBottom: 12 }}>Portfolio</p>
            <h2
              className="serif"
              style={{
                fontSize: "clamp(32px, 4vw, 56px)",
                fontWeight: 700,
                color: "#111010",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Nos plus belles histoires
            </h2>
          </div>
          <Link
            href="/galerie"
            style={{
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(17,16,16,0.4)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            Voir tout
            <span style={{ display: "block", width: 32, height: 1, background: "currentColor" }} />
          </Link>
        </div>

        {/* Grille */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "320px 320px",
          gap: 6,
        }}>
          {/* Grande photo gauche */}
          <div style={{ gridRow: "1 / 3", position: "relative", overflow: "hidden" }}>
            <Image src={photos[0].src} alt={photos[0].alt} fill sizes="33vw" quality={80}
              style={{ objectFit: "cover", transition: "transform 0.7s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
          {/* 4 photos droite */}
          {photos.slice(1).map((p, i) => (
            <div key={i} style={{ position: "relative", overflow: "hidden" }}>
              <Image src={p.src} alt={p.alt} fill sizes="22vw" quality={80}
                style={{ objectFit: "cover", transition: "transform 0.7s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
