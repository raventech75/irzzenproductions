"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Filtre = "tout" | "photo" | "video";

type Item = {
  id: number;
  type: "photo" | "video";
  titre: string;
  lieu: string;
  annee: string;
  aspect: "tall" | "wide" | "square";
  src: string;
  // Pour les vidéos : ID YouTube ou Vimeo
  videoId?: string;
  videoProvider?: "youtube" | "vimeo";
  // Miniature pour les vidéos (photo de couverture)
  thumbnail?: string;
};

const e = encodeURI;

const items: Item[] = [
  { id: 1,  type: "photo", titre: "Zineb & Farès",          lieu: "Paris", annee: "2024", aspect: "tall",   src: e("/photos/Zineb & Fares - 00471.jpg") },
  { id: 2,  type: "photo", titre: "Irzzen Productions",     lieu: "Paris", annee: "2024", aspect: "wide",   src: "/photos/1L9A7557.JPG" },
  { id: 3,  type: "photo", titre: "Irzzen Productions",     lieu: "Paris", annee: "2024", aspect: "square", src: "/photos/1L9A7155.JPG" },
  { id: 4,  type: "photo", titre: "Zineb & Farès",          lieu: "Paris", annee: "2024", aspect: "tall",   src: e("/photos/Zineb & Fares - 00381.jpg") },
  { id: 5,  type: "photo", titre: "Irzzen Productions",     lieu: "Paris", annee: "2024", aspect: "square", src: "/photos/1L9A7115.JPG" },
  { id: 6,  type: "photo", titre: "Zineb & Farès",          lieu: "Paris", annee: "2024", aspect: "square", src: e("/photos/Zineb & Fares - 00482.jpg") },
  { id: 7,  type: "photo", titre: "Inès & Ümit",            lieu: "Paris", annee: "2024", aspect: "wide",   src: e("/photos/Ines & Umit- 0040.jpg") },
  { id: 8,  type: "photo", titre: "Inès & Ümit",            lieu: "Paris", annee: "2024", aspect: "square", src: e("/photos/Ines & Umit- 0042.jpg") },
  { id: 9,  type: "photo", titre: "Inès & Ümit",            lieu: "Paris", annee: "2024", aspect: "tall",   src: e("/photos/Ines & Umit- 0069.jpg") },
  { id: 10, type: "photo", titre: "Inès & Ümit",            lieu: "Paris", annee: "2024", aspect: "square", src: e("/photos/Ines & Umit- 0152.jpg") },
  { id: 11, type: "photo", titre: "Inès & Ümit",            lieu: "Paris", annee: "2024", aspect: "wide",   src: e("/photos/Ines & Umit- 0173.jpg") },
  { id: 12, type: "photo", titre: "Başak & Oğuzhan",        lieu: "Paris", annee: "2024", aspect: "square", src: e("/photos/Basak & Oguzhan - dugun - 0169.jpg") },
  { id: 13, type: "photo", titre: "Başak & Oğuzhan",        lieu: "Paris", annee: "2024", aspect: "tall",   src: e("/photos/Basak & Oguzhan - dugun - 0188.jpg") },
  { id: 14, type: "photo", titre: "Başak & Oğuzhan",        lieu: "Paris", annee: "2024", aspect: "square", src: e("/photos/Basak & Oguzhan - dugun - 0189.jpg") },
  { id: 15, type: "photo", titre: "Başak & Oğuzhan — Kına", lieu: "Paris", annee: "2024", aspect: "wide",   src: e("/photos/Basak & Oguzhan - kina - 0073.jpg") },
  { id: 16, type: "photo", titre: "Başak & Oğuzhan — Kına", lieu: "Paris", annee: "2024", aspect: "square", src: e("/photos/Basak & Oguzhan - kina - 0108.jpg") },
  { id: 17, type: "photo", titre: "Başak & Oğuzhan — Kına", lieu: "Paris", annee: "2024", aspect: "square", src: e("/photos/Basak & Oguzhan - kina - 0135.jpg") },
  { id: 18, type: "photo", titre: "Başak & Oğuzhan — Kına", lieu: "Paris", annee: "2024", aspect: "tall",   src: e("/photos/Basak & Oguzhan - kina - 0136.jpg") },
  { id: 19, type: "photo", titre: "Berfin & Fırat",         lieu: "Paris", annee: "2023", aspect: "wide",   src: e("/photos/Berfin & Firat - 0153.jpg") },
  { id: 20, type: "photo", titre: "Berfin & Fırat",         lieu: "Paris", annee: "2023", aspect: "square", src: e("/photos/Berfin & Firat - 0164.jpg") },
  { id: 21, type: "photo", titre: "Faiza & Feridun",        lieu: "Paris", annee: "2023", aspect: "tall",   src: e("/photos/Faiza & Feridun -  276.jpg") },
  { id: 22, type: "photo", titre: "Faiza & Feridun",        lieu: "Paris", annee: "2023", aspect: "square", src: e("/photos/Faiza & Feridun -  278.jpg") },
  { id: 23, type: "photo", titre: "Tuğba & Serdar",         lieu: "Paris", annee: "2024", aspect: "wide",   src: e("/photos/Tugba & Serdar - Dugun - 0001.jpg") },
  { id: 24, type: "photo", titre: "Tuğba & Serdar",         lieu: "Paris", annee: "2024", aspect: "square", src: e("/photos/Tugba & Serdar - Dugun - 0112.jpg") },
  { id: 25, type: "photo", titre: "Irzzen Productions", lieu: "Paris", annee: "2024", aspect: "square", src: "/photos/1L9A7763.JPG" },
  { id: 26, type: "video", titre: "Film Mariage",      lieu: "Paris", annee: "2024", aspect: "wide", src: "", videoId: "EOju7dQWBso", videoProvider: "youtube" },
  { id: 27, type: "video", titre: "Film Mariage",      lieu: "Paris", annee: "2024", aspect: "wide", src: "", videoId: "hFUL4K45LPo", videoProvider: "youtube" },
  { id: 28, type: "video", titre: "Film Mariage",      lieu: "Paris", annee: "2024", aspect: "wide", src: "", videoId: "NrWhBOLfcfQ", videoProvider: "youtube" },
];

const aspectClass: Record<Item["aspect"], string> = {
  tall: "row-span-2",
  wide: "col-span-2",
  square: "",
};

function getYoutubeThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function getEmbedUrl(item: Item) {
  if (item.videoProvider === "youtube") return `https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0`;
  if (item.videoProvider === "vimeo") return `https://player.vimeo.com/video/${item.videoId}?autoplay=1`;
  return "";
}

export function GalerieClient() {
  const [filtre, setFiltre] = useState<Filtre>("tout");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filtre === "tout" ? items : items.filter((i) => i.type === filtre);
  const lightboxItem = lightbox !== null ? filtered[lightbox] : null;

  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % filtered.length : null));

  const getThumbnail = (item: Item) => {
    if (item.type === "video" && item.videoProvider === "youtube" && item.videoId)
      return getYoutubeThumbnail(item.videoId);
    return item.src;
  };

  return (
    <section className="px-8 lg:px-12 pb-32">
      <div className="max-w-[1400px] mx-auto">
        {/* Filtres */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {(["tout", "photo", "video"] as Filtre[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={cn(
                "px-6 py-2 text-xs tracking-[0.3em] uppercase transition-all duration-300",
                filtre === f
                  ? "bg-[#0E0C10] text-[#F6F2EE] font-semibold"
                  : "border border-[#0E0C10]/15 text-[#0E0C10]/40 hover:border-[#0E0C10]/40 hover:text-[#0E0C10]"
              )}
            >
              {f === "tout" ? "Tout" : f === "photo" ? "Photo" : "Vidéo"}
            </button>
          ))}
        </div>

        {/* Grille masonry */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-3">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightbox(idx)}
              className={cn(
                "relative overflow-hidden cursor-pointer group border border-[#C4A5B5]/10 hover:border-[#C4A5B5]/40 transition-all duration-500",
                aspectClass[item.aspect]
              )}
            >
              <Image
                src={getThumbnail(item)}
                alt={item.titre}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                quality={75}
              />
              {/* Overlay hover */}
              <div className="absolute inset-0 bg-[#F7F3EF]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-10">
                {item.type === "video" && (
                  <div className="w-12 h-12 border-2 border-[#C4A5B5] rounded-full flex items-center justify-center mb-3">
                    <Play size={16} className="text-[#C4A5B5] ml-0.5" fill="currentColor" />
                  </div>
                )}
                <div className="text-center px-4">
                  <div className="text-sm font-medium text-[#1A1520]">{item.titre}</div>
                  <div className="text-xs text-[#C4A5B5]/70 mt-1">{item.lieu} · {item.annee}</div>
                </div>
              </div>

              {item.type === "video" && (
                <div className="absolute top-3 right-3 w-7 h-7 bg-[#C4A5B5]/90 flex items-center justify-center z-10">
                  <Play size={10} className="text-[#13111A] ml-0.5" fill="currentColor" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxItem && (
          <div
            className="fixed inset-0 z-50 bg-[#F7F3EF]/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-[#1A1520]/60 hover:text-[#C4A5B5] transition-colors" onClick={() => setLightbox(null)}>
              <X size={28} />
            </button>
            <button className="absolute left-4 md:left-8 text-[#1A1520]/40 hover:text-[#C4A5B5] transition-colors p-2" onClick={(e) => { e.stopPropagation(); prev(); }}>
              <ChevronLeft size={36} />
            </button>
            <button className="absolute right-4 md:right-8 text-[#1A1520]/40 hover:text-[#C4A5B5] transition-colors p-2" onClick={(e) => { e.stopPropagation(); next(); }}>
              <ChevronRight size={36} />
            </button>

            <div className="max-w-4xl w-full mx-16 flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <div className="w-full mb-6">
                {lightboxItem.type === "video" && lightboxItem.videoId ? (
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src={getEmbedUrl(lightboxItem)}
                      className="absolute inset-0 w-full h-full border border-[#C4A5B5]/20"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="relative w-full max-h-[70vh] flex items-center justify-center">
                    <img
                      src={lightboxItem.src}
                      alt={lightboxItem.titre}
                      className="max-w-full max-h-[70vh] object-contain border border-[#C4A5B5]/20"
                    />
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-[#1A1520]">{lightboxItem.titre}</div>
                <div className="text-sm text-[#C4A5B5]/60 mt-1">{lightboxItem.lieu} · {lightboxItem.annee}</div>
              </div>
              <div className="text-xs text-[#1A1520]/20 mt-4 tracking-wide">
                {(lightbox ?? 0) + 1} / {filtered.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
