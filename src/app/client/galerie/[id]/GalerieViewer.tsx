"use client";

import { useState } from "react";
import { Download, X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type Galerie = Database["public"]["Tables"]["galeries"]["Row"];
type Fichier = Database["public"]["Tables"]["fichiers"]["Row"];

export function GalerieViewer({
  galerie,
  fichiers,
}: {
  galerie: Galerie;
  fichiers: Fichier[];
}) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);

  const current = lightbox !== null ? fichiers[lightbox] : null;
  const prev = () => setLightbox((i) => (i !== null ? (i - 1 + fichiers.length) % fichiers.length : null));
  const next = () => setLightbox((i) => (i !== null ? (i + 1) % fichiers.length : null));

  const downloadAll = async () => {
    setDownloading(true);
    // Chaque fichier est téléchargé individuellement via l'URL Supabase Storage
    for (const f of fichiers) {
      const a = document.createElement("a");
      a.href = f.url;
      a.download = f.nom;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      await new Promise((r) => setTimeout(r, 300));
    }
    setDownloading(false);
  };

  const downloadOne = (fichier: Fichier) => {
    const a = document.createElement("a");
    a.href = fichier.url;
    a.download = fichier.nom;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link
            href="/client/galerie"
            className="flex items-center gap-1.5 text-xs text-[#1A1520]/30 hover:text-[#C4A5B5]/60 transition-colors mb-3"
          >
            <ArrowLeft size={12} /> Retour aux galeries
          </Link>
          <h1
            className="text-3xl font-bold text-[#1A1520]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {galerie.nom}
          </h1>
          <p className="text-sm text-[#1A1520]/40 mt-1">
            {galerie.nb_fichiers} fichier{galerie.nb_fichiers > 1 ? "s" : ""} ·{" "}
            {(galerie.taille_totale / 1024 / 1024 / 1024).toFixed(1)} Go ·{" "}
            <span className="capitalize">{galerie.type}</span>
          </p>
        </div>
        {fichiers.length > 0 && (
          <button
            onClick={downloadAll}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-3 bg-[#C4A5B5] text-[#13111A] text-sm font-semibold tracking-widest uppercase hover:bg-[#DEC8D6] transition-colors disabled:opacity-60"
          >
            <Download size={14} />
            {downloading ? "Téléchargement…" : "Tout télécharger"}
          </button>
        )}
      </div>

      {/* Grille photos */}
      {fichiers.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {fichiers.map((f, idx) => (
            <div
              key={f.id}
              className="relative group aspect-square bg-[#FAFAF8] border border-[#C4A5B5]/10 hover:border-[#C4A5B5]/40 transition-all cursor-pointer overflow-hidden"
              onClick={() => setLightbox(idx)}
            >
              {f.url_miniature ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.url_miniature}
                  alt={f.nom}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#C4A5B5]/20 text-xs">
                  {f.nom}
                </div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-[#F7F3EF]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); downloadOne(f); }}
                  className="w-9 h-9 bg-[#C4A5B5] flex items-center justify-center text-[#13111A] hover:bg-[#DEC8D6] transition-colors"
                  title="Télécharger"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass p-16 text-center">
          <p className="text-[#1A1520]/40 text-sm">
            Les fichiers de cette galerie seront disponibles prochainement.
          </p>
        </div>
      )}

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-50 bg-[#F7F3EF]/97 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 text-[#1A1520]/50 hover:text-[#C4A5B5] transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={26} />
          </button>

          {fichiers.length > 1 && (
            <>
              <button
                className="absolute left-4 text-[#1A1520]/30 hover:text-[#C4A5B5] transition-colors p-2"
                onClick={(e) => { e.stopPropagation(); prev(); }}
              >
                <ChevronLeft size={34} />
              </button>
              <button
                className="absolute right-4 text-[#1A1520]/30 hover:text-[#C4A5B5] transition-colors p-2"
                onClick={(e) => { e.stopPropagation(); next(); }}
              >
                <ChevronRight size={34} />
              </button>
            </>
          )}

          <div
            className="max-w-5xl w-full mx-16 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {current.url_miniature ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.url_miniature}
                alt={current.nom}
                className="max-h-[75vh] max-w-full object-contain border border-[#C4A5B5]/15"
              />
            ) : (
              <div className="aspect-[3/2] w-full max-w-2xl bg-[#FAFAF8] border border-[#C4A5B5]/15 flex items-center justify-center text-[#C4A5B5]/20 text-sm">
                {current.nom}
              </div>
            )}
            <div className="mt-4 flex items-center gap-6">
              <span className="text-sm text-[#1A1520]/60">{current.nom}</span>
              <button
                onClick={() => downloadOne(current)}
                className="flex items-center gap-2 px-4 py-2 border border-[#C4A5B5]/40 text-[#C4A5B5] text-xs tracking-widest uppercase hover:bg-[#C4A5B5]/10 transition-colors"
              >
                <Download size={12} /> Télécharger
              </button>
            </div>
            <div className="text-xs text-[#1A1520]/20 mt-2">
              {(lightbox ?? 0) + 1} / {fichiers.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
