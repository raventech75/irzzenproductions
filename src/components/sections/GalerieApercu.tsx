import Link from "next/link";
import Image from "next/image";

const photos = [
  { src: "/photos/1L9A7763.JPG",                                      alt: "Couple" },
  { src: encodeURI("/photos/Zineb & Fares - 00471.jpg"),              alt: "Zineb & Farès" },
  { src: "/photos/1L9A7557.JPG",                                      alt: "Château" },
  { src: encodeURI("/photos/Ines & Umit- 0040.jpg"),                  alt: "Inès & Ümit" },
  { src: encodeURI("/photos/Basak & Oguzhan - dugun - 0169.jpg"),     alt: "Başak & Oğuzhan" },
];

export function GalerieApercu() {
  return (
    <section className="bg-[#FDFAF7] pb-28">
      <div className="wrap">

        {/* En-tête */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="label-tag mb-3">Portfolio</p>
            <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight"
              style={{ fontSize: "clamp(26px,3.5vw,48px)" }}>
              Nos plus belles histoires
            </h2>
          </div>
          <Link href="/galerie"
            className="hidden md:flex items-center gap-3 text-[11px] tracking-[0.32em] uppercase text-[#DFA0AE] no-underline hover:opacity-70 transition-opacity">
            Voir tout <span className="block w-6 h-px bg-[#DFA0AE]" />
          </Link>
        </div>

        {/* Grille asymétrique */}
        <div className="grid grid-cols-3 gap-2" style={{ gridTemplateRows: "280px 280px" }}>

          {/* Grande image gauche : 2 rangées */}
          <div className="row-span-2 relative overflow-hidden rounded-sm">
            <Image src={photos[0].src} alt={photos[0].alt} fill sizes="33vw" quality={80}
              className="object-cover hover:scale-105 transition-transform duration-700" />
          </div>

          {/* 4 petites images à droite */}
          {photos.slice(1).map((p, i) => (
            <div key={i} className="relative overflow-hidden rounded-sm">
              <Image src={p.src} alt={p.alt} fill sizes="22vw" quality={80}
                className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>

        {/* Lien mobile */}
        <div className="mt-6 md:hidden text-center">
          <Link href="/galerie" className="label-tag">Voir toute la galerie →</Link>
        </div>
      </div>
    </section>
  );
}
