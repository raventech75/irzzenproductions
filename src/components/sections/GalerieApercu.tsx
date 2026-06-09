import Link from "next/link";
import Image from "next/image";

const photos = [
  { src: "/photos/1L9A7763.JPG",                              alt: "Couple", col: "col-span-1 row-span-2" },
  { src: "/photos/1L9A7557.JPG",                              alt: "Château", col: "col-span-2 row-span-1" },
  { src: encodeURI("/photos/Zineb & Fares - 00381.jpg"),      alt: "Couple jardin", col: "col-span-1 row-span-1" },
  { src: "/photos/1L9A7155.JPG",                              alt: "Préparatifs", col: "col-span-1 row-span-1" },
  { src: "/photos/1L9A7115.JPG",                              alt: "Décoration", col: "col-span-1 row-span-1" },
];

export function GalerieApercu() {
  return (
    <section className="bg-[#F6F2EE] py-32">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">

        <div className="flex items-end justify-between mb-16 border-b border-[#0E0C10]/10 pb-8">
          <div className="flex items-baseline gap-6">
            <span
              className="text-[clamp(48px,7vw,96px)] font-bold leading-none text-[#0E0C10]/6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              02
            </span>
            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#A8919E] mb-2">Portfolio</p>
              <h2
                className="text-3xl md:text-5xl font-bold text-[#0E0C10] leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Des instants <em className="not-italic text-gradient-gold">uniques</em>
              </h2>
            </div>
          </div>
          <Link
            href="/galerie"
            className="hidden md:flex items-center gap-3 text-[11px] tracking-[0.35em] uppercase text-[#0E0C10]/40 hover:text-[#0E0C10] transition-colors group"
          >
            Voir tout
            <span className="block w-6 h-px bg-current group-hover:w-12 transition-all duration-300" />
          </Link>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[70vh] min-h-[500px] max-h-[750px]">
          {photos.map((p, i) => (
            <div key={i} className={`relative overflow-hidden group ${p.col}`}>
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={80}
                className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-[#0E0C10]/0 group-hover:bg-[#0E0C10]/15 transition-all duration-500" />
            </div>
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link href="/galerie" className="text-[11px] tracking-[0.35em] uppercase text-[#0E0C10]/40">
            Voir toute la galerie →
          </Link>
        </div>
      </div>
    </section>
  );
}
