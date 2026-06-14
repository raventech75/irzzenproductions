"use client";

import { useState } from "react";
import { FileText, CheckCircle, Clock, PenLine, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Contrat = {
  id: string;
  titre: string;
  statut: string;
  created_at: string;
  contenu?: string | null;
  signe_le?: string | null;
  pdf_url?: string | null;
};

export function ContratViewer({
  contrats,
  clientNom,
}: {
  contrats: Contrat[];
  clientNom: string;
}) {
  const [signing, setSigning] = useState<string | null>(null);
  const [signed, setSigned] = useState<Set<string>>(new Set());
  const [signedDates, setSignedDates] = useState<Record<string, string>>({});
  const [confirmNom, setConfirmNom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadPdf = async (contrat: Contrat) => {
    setDownloading(contrat.id);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const marginLeft = 20;
      const marginRight = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxWidth = pageWidth - marginLeft - marginRight;
      let y = 20;

      // En-tête
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(38, 30, 20);
      doc.text("IRZZEN PRODUCTIONS", pageWidth / 2, y, { align: "center" });
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 100, 80);
      doc.text("Photographes & Vidéastes Mariage — Paris", pageWidth / 2, y, { align: "center" });
      y += 4;
      doc.setDrawColor(196, 165, 181);
      doc.setLineWidth(0.4);
      doc.line(marginLeft, y, pageWidth - marginRight, y);
      y += 10;

      // Titre du contrat
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(38, 30, 20);
      const titreLines = doc.splitTextToSize(contrat.titre, maxWidth);
      doc.text(titreLines, pageWidth / 2, y, { align: "center" });
      y += titreLines.length * 6 + 4;

      // Statut
      const isSigned = contrat.statut === "signe" || signed.has(contrat.id);
      const dateSign = signedDates[contrat.id] ?? contrat.signe_le;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(isSigned ? 34 : 180, isSigned ? 120 : 120, isSigned ? 34 : 0);
      const statutText = isSigned
        ? `Signé électroniquement${dateSign ? " le " + new Date(dateSign).toLocaleDateString("fr-FR") : ""}`
        : "En attente de signature";
      doc.text(statutText, pageWidth / 2, y, { align: "center" });
      y += 8;

      doc.setDrawColor(220, 210, 200);
      doc.setLineWidth(0.2);
      doc.line(marginLeft, y, pageWidth - marginRight, y);
      y += 8;

      // Contenu du contrat
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(60, 50, 40);

      // Remplace les caractères Unicode non supportés par Helvetica
      const contenu = (contrat.contenu ?? "")
        .replace(/[─━═]/g, "-")
        .replace(/[│┃]/g, "|")
        .replace(/[^\x00-\x7FÀ-ɏ]/g, (c) => {
          const map: Record<string, string> = {
            "é": "e", "è": "e", "ê": "e", "ë": "e",
            "à": "a", "â": "a", "ä": "a",
            "ù": "u", "û": "u", "ü": "u",
            "î": "i", "ï": "i",
            "ô": "o", "ö": "o",
            "ç": "c", "œ": "oe", "æ": "ae",
            "É": "E", "È": "E", "Ê": "E",
            "À": "A", "Â": "A",
            "Ù": "U", "Û": "U",
            "Î": "I", "Ô": "O",
            "Ç": "C", "Œ": "OE", "Æ": "AE",
            "—": "--", "–": "-", "’": "'", "‘": "'",
            "“": '"', "”": '"',
          };
          return map[c] ?? c;
        });
      const lignes = contenu.split("\n");

      for (const ligne of lignes) {
        const isTitre = ligne.startsWith("ARTICLE") || ligne.startsWith("────");
        const isEmpty = ligne.trim() === "";

        if (isEmpty) {
          y += 3;
          continue;
        }

        if (isTitre) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(38, 30, 20);
        } else {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(60, 50, 40);
        }

        const wrapped = doc.splitTextToSize(ligne, maxWidth);
        for (const wl of wrapped) {
          if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
          }
          doc.text(wl, marginLeft, y);
          y += 5;
        }
      }

      // Pied de page sur chaque page
      const totalPages = (doc.internal as any).getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(160, 140, 120);
        doc.text(
          `Irzzen Productions — www.irzzenproductions.fr — Page ${i}/${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }

      const nomFichier = `Contrat_${contrat.titre.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
      doc.save(nomFichier);
    } catch (e) {
      console.error("Erreur génération PDF:", e);
    } finally {
      setDownloading(null);
    }
  };

  const handleSign = async (contrat: Contrat) => {
    if (confirmNom.trim().toLowerCase() !== clientNom.toLowerCase().trim()) {
      setError("Le nom saisi ne correspond pas. Veuillez écrire : " + clientNom);
      return;
    }
    setError(null);
    const supabase = createClient();
    const now = new Date().toISOString();
    const { error: updateError } = await (supabase.from("contrats") as any)
      .update({ statut: "signe", signe_le: now })
      .eq("id", contrat.id);

    if (!updateError) {
      setSigned((prev) => new Set([...prev, contrat.id]));
      setSignedDates((prev) => ({ ...prev, [contrat.id]: now }));
      setSigning(null);
      setConfirmNom("");
    } else {
      setError("Erreur lors de la signature. Veuillez réessayer.");
    }
  };

  if (contrats.length === 0) {
    return (
      <div className="glass p-16 text-center border border-[#C4A5B5]/15">
        <Clock size={40} className="text-[#C4A5B5]/20 mx-auto mb-6" />
        <h2 className="text-xl font-bold text-[#1A1520] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
          Aucun contrat disponible
        </h2>
        <p className="text-[#1A1520]/40 text-sm max-w-sm mx-auto">
          Votre contrat vous sera envoyé dès que votre réservation sera confirmée.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {contrats.map((contrat) => {
        const isSigned = contrat.statut === "signe" || signed.has(contrat.id);
        const isSigningThis = signing === contrat.id;
        const dateSignature = signedDates[contrat.id] ?? contrat.signe_le;

        return (
          <div key={contrat.id} className="glass border border-[#C4A5B5]/15 overflow-hidden">

            {/* Header */}
            <div className="p-6 flex items-center justify-between flex-wrap gap-4 border-b border-[#C4A5B5]/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-[#C4A5B5]/30 flex items-center justify-center text-[#C4A5B5]">
                  <FileText size={17} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#1A1520]">{contrat.titre}</h2>
                  <p className="text-xs text-[#1A1520]/30 mt-0.5">
                    Émis le {new Date(contrat.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isSigned ? (
                  <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                    <CheckCircle size={13} /> Signé
                    {dateSignature && (
                      <span className="text-[#1A1520]/30 font-normal ml-1">
                        le {new Date(dateSignature).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-amber-600">
                    <Clock size={13} /> En attente de signature
                  </span>
                )}
                {contrat.contenu && (
                  <button
                    onClick={() => handleDownloadPdf(contrat)}
                    disabled={downloading === contrat.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#C4A5B5]/30 text-[#C4A5B5]/70 text-xs hover:border-[#C4A5B5] hover:text-[#C4A5B5] transition-colors disabled:opacity-50"
                  >
                    <Download size={11} />
                    {downloading === contrat.id ? "Génération…" : "PDF"}
                  </button>
                )}
              </div>
            </div>

            {/* Contenu du contrat */}
            {contrat.contenu && (
              <div className="p-8 bg-white border-b border-[#C4A5B5]/10">
                <pre
                  className="whitespace-pre-wrap font-sans text-sm text-[#1A1520]/70 leading-relaxed max-w-2xl"
                  style={{ fontFamily: "Georgia, serif", lineHeight: "1.8" }}
                >
                  {contrat.contenu}
                </pre>
              </div>
            )}

            {/* Zone signature */}
            {!isSigned && (
              <div className="p-6 bg-[#FDFAF7]">
                {!isSigningThis ? (
                  <button
                    onClick={() => setSigning(contrat.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#C4A5B5] text-[#13111A] text-sm font-semibold tracking-widest uppercase hover:bg-[#DEC8D6] transition-colors"
                  >
                    <PenLine size={14} /> Signer le contrat
                  </button>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <p className="text-sm text-[#1A1520]/60">
                      Pour valider votre signature, tapez exactement :{" "}
                      <strong className="text-[#1A1520]">{clientNom}</strong>
                    </p>
                    <input
                      type="text"
                      value={confirmNom}
                      onChange={(e) => { setConfirmNom(e.target.value); setError(null); }}
                      placeholder={clientNom}
                      className="w-full bg-white border border-[#C4A5B5]/30 text-[#1A1520] text-sm px-4 py-3 placeholder-[#1A1520]/20 focus:outline-none focus:border-[#C4A5B5]/70 transition-colors rounded-sm"
                    />
                    {error && (
                      <p className="text-xs text-red-500">{error}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSign(contrat)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#C4A5B5] text-[#13111A] text-sm font-semibold tracking-widest uppercase hover:bg-[#DEC8D6] transition-colors"
                      >
                        <CheckCircle size={14} /> Confirmer la signature
                      </button>
                      <button
                        onClick={() => { setSigning(null); setConfirmNom(""); setError(null); }}
                        className="px-4 py-3 text-xs text-[#1A1520]/30 hover:text-[#1A1520]/60 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                    <p className="text-[10px] text-[#1A1520]/20 leading-relaxed">
                      En signant, vous acceptez les termes du contrat. Cette signature a valeur légale
                      conformément au règlement eIDAS.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Confirmation signé */}
            {isSigned && (
              <div className="p-5 bg-green-50 flex items-center gap-3 text-sm text-green-700 border-t border-green-100">
                <CheckCircle size={16} />
                <span>
                  Contrat signé électroniquement
                  {dateSignature && (
                    <span className="text-green-600/60 ml-1">
                      le {new Date(dateSignature).toLocaleDateString("fr-FR", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
