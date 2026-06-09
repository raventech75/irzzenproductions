"use client";

import { useState } from "react";
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
  bg: string;
};

const items: Item[] = [
  { id: 1, type: "photo", titre: "Sophie & Karim", lieu: "Paris", annee: "2024", aspect: "tall", bg: "#1C1C1C" },
  { id: 2, type: "photo", titre: "Marie & Thomas", lieu: "Bordeaux", annee: "2024", aspect: "wide", bg: "#161616" },
  { id: 3, type: "video", titre: "Leïla & Youssef", lieu: "Lyon", annee: "2024", aspect: "square", bg: "#1A1A1A" },
  { id: 4, type: "photo", titre: "Clara & Antoine", lieu: "Nice", annee: "2023", aspect: "tall", bg: "#181818" },
  { id: 5, type: "photo", titre: "Emma & Lucas", lieu: "Marseille", annee: "2024", aspect: "square", bg: "#141414" },
  { id: 6, type: "video", titre: "Amina & Pierre", lieu: "Strasbourg", annee: "2023", aspect: "wide", bg: "#131313" },
  { id: 7, type: "photo", titre: "Julie & Marc", lieu: "Toulouse", annee: "2024", aspect: "square", bg: "#1E1E1E" },
  { id: 8, type: "photo", titre: "Nadia & Julien", lieu: "Nantes", annee: "2023", aspect: "tall", bg: "#171717" },
  { id: 9, type: "video", titre: "Sarah & Kevin", lieu: "Lille", annee: "2024", aspect: "square", bg: "#151515" },
  { id: 10, type: "photo", titre: "Camille & Romain", lieu: "Rennes", annee: "2023", aspect: "wide", bg: "#1B1B1B" },
  { id: 11, type: "photo", titre: "Fatima & David", lieu: "Montpellier", annee: "2024", aspect: "square", bg: "#121212" },
  { id: 12, type: "video", titre: "Lucie & Nicolas", lieu: "Grenoble", annee: "2023", aspect: "tall", bg: "#1F1F1F" },
];

const aspectClass: Record<Item["aspect"], string> = {
  tall: "row-span-2",
  wide: "col-span-2",
  square: "",
};

export function GalerieClient() {
  const [filtre, setFiltre] = useState<Filtre>("tout");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filtre === "tout" ? items : items.filter((i) => i.type === filtre);
  const lightboxItem = lightbox !== null ? filtered[lightbox] : null;

  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % filtered.length : null));

  return (
    <section className="px-6 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Filtres */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {(["tout", "photo", "video"] as Filtre[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={cn(
                "px-6 py-2 text-xs tracking-[0.3em] uppercase transition-all duration-300",
                filtre === f
                  ? "bg-[#C9A84C] text-[#0A0A0A] font-semibold"
                  : "border border-[#C9A84C]/30 text-[#FAFAFA]/50 hover:border-[#C9A84C]/60 hover:text-[#C9A84C]"
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
                "relative overflow-hidden cursor-pointer group border border-[#C9A84C]/10 hover:border-[#C9A84C]/40 transition-all duration-500",
                aspectClass[item.aspect]
              )}
              style={{ backgroundColor: item.bg }}
            >
              {/* Overlay au hover */}
              <div className="absolute inset-0 bg-[#0A0A0A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                {item.type === "video" && (
                  <div className="w-12 h-12 border-2 border-[#C9A84C] rounded-full flex items-center justify-center mb-3">
                    <Play size={16} className="text-[#C9A84C] ml-0.5" fill="currentColor" />
                  </div>
                )}
                <div className="text-center px-4">
                  <div className="text-sm font-medium text-[#FAFAFA]">{item.titre}</div>
                  <div className="text-xs text-[#C9A84C]/70 mt-1">
                    {item.lieu} · {item.annee}
                  </div>
                </div>
              </div>

              {/* Badge vidéo */}
              {item.type === "video" && (
                <div className="absolute top-3 right-3 w-7 h-7 bg-[#C9A84C]/90 flex items-center justify-center">
                  <Play size={10} className="text-[#0A0A0A] ml-0.5" fill="currentColor" />
                </div>
              )}

              {/* Placeholder visuel */}
              <div className="w-full h-full flex items-end p-4">
                <div className="text-[#C9A84C]/10 text-[10px] tracking-widest uppercase">
                  {item.type}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxItem && (
          <div
            className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* Fermer */}
            <button
              className="absolute top-6 right-6 text-[#FAFAFA]/60 hover:text-[#C9A84C] transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X size={28} />
            </button>

            {/* Navigation */}
            <button
              className="absolute left-4 md:left-8 text-[#FAFAFA]/40 hover:text-[#C9A84C] transition-colors p-2"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={36} />
            </button>
            <button
              className="absolute right-4 md:right-8 text-[#FAFAFA]/40 hover:text-[#C9A84C] transition-colors p-2"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={36} />
            </button>

            {/* Contenu */}
            <div
              className="max-w-4xl w-full mx-16 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full aspect-[3/2] border border-[#C9A84C]/20 flex items-center justify-center mb-6"
                style={{ backgroundColor: lightboxItem.bg }}
              >
                {lightboxItem.type === "video" ? (
                  <div className="flex flex-col items-center gap-4 text-[#C9A84C]/40">
                    <div className="w-16 h-16 border-2 border-[#C9A84C]/40 rounded-full flex items-center justify-center">
                      <Play size={24} className="ml-1" />
                    </div>
                    <span className="text-xs tracking-widest uppercase">Vidéo</span>
                  </div>
                ) : (
                  <span className="text-xs tracking-widest uppercase text-[#C9A84C]/20">Photo</span>
                )}
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-[#FAFAFA]">{lightboxItem.titre}</div>
                <div className="text-sm text-[#C9A84C]/60 mt-1">
                  {lightboxItem.lieu} · {lightboxItem.annee}
                </div>
              </div>
              <div className="text-xs text-[#FAFAFA]/20 mt-4 tracking-wide">
                {(lightbox ?? 0) + 1} / {filtered.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
