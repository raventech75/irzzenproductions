"use client";

import { useState } from "react";
import { FileText, CheckCircle, Download, Clock, PenLine } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/database";

type Contrat = Database["public"]["Tables"]["contrats"]["Row"];

export function ContratViewer({
  contrats,
  clientNom,
}: {
  contrats: Contrat[];
  clientNom: string;
}) {
  const [signing, setSigning] = useState<string | null>(null);
  const [signed, setSigned] = useState<Set<string>>(new Set());
  const [confirmNom, setConfirmNom] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSign = async (contrat: Contrat) => {
    if (confirmNom.trim().toLowerCase() !== clientNom.toLowerCase().trim()) {
      setError("Le nom saisi ne correspond pas. Veuillez écrire : " + clientNom);
      return;
    }
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("contrats")
      .update({ statut: "signe", signe_le: new Date().toISOString() })
      .eq("id", contrat.id);

    if (!updateError) {
      setSigned((prev) => new Set([...prev, contrat.id]));
      setSigning(null);
      setConfirmNom("");
    }
  };

  if (contrats.length === 0) {
    return (
      <div className="glass p-16 text-center border border-[#C9A84C]/15">
        <Clock size={40} className="text-[#C9A84C]/20 mx-auto mb-6" />
        <h2 className="text-xl font-bold text-[#FAFAFA] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
          Aucun contrat disponible
        </h2>
        <p className="text-[#FAFAFA]/40 text-sm max-w-sm mx-auto">
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

        return (
          <div key={contrat.id} className="glass border border-[#C9A84C]/15 overflow-hidden">
            {/* Header contrat */}
            <div className="p-6 flex items-center justify-between flex-wrap gap-4 border-b border-[#C9A84C]/10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C]">
                  <FileText size={17} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#FAFAFA]">{contrat.titre}</h2>
                  <p className="text-xs text-[#FAFAFA]/30 mt-0.5">
                    Émis le {new Date(contrat.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isSigned ? (
                  <span className="flex items-center gap-1.5 text-xs text-green-400">
                    <CheckCircle size={13} /> Signé
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-yellow-400">
                    <Clock size={13} /> En attente de signature
                  </span>
                )}
                {contrat.pdf_url && (
                  <a
                    href={contrat.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#C9A84C]/30 text-[#C9A84C]/70 text-xs hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
                  >
                    <Download size={11} /> PDF
                  </a>
                )}
              </div>
            </div>

            {/* Aperçu contrat (placeholder — en prod: iframe PDF ou rendu HTML) */}
            <div className="p-6 bg-[#0E0E0E] min-h-[200px] text-sm text-[#FAFAFA]/30 leading-relaxed border-b border-[#C9A84C]/10">
              <div className="max-w-2xl">
                <p className="font-medium text-[#FAFAFA]/50 mb-4">
                  Contrat de prestation photographique et vidéographique
                </p>
                <p className="mb-3">
                  Entre <strong className="text-[#FAFAFA]/60">Irzzen Productions</strong> (prestataire) et{" "}
                  <strong className="text-[#FAFAFA]/60">{clientNom}</strong> (client), il est convenu ce qui suit…
                </p>
                <p className="italic text-[#FAFAFA]/20 text-xs">
                  {contrat.pdf_url
                    ? "Consultez le PDF pour lire le contrat complet."
                    : "Le document complet sera disponible ici dès sa finalisation."}
                </p>
              </div>
            </div>

            {/* Signature */}
            {!isSigned && (
              <div className="p-6">
                {!isSigningThis ? (
                  <button
                    onClick={() => setSigning(contrat.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold tracking-widest uppercase hover:bg-[#E8C96A] transition-colors gold-glow"
                  >
                    <PenLine size={14} /> Signer le contrat
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-[#FAFAFA]/60">
                      Pour signer, tapez exactement votre nom :{" "}
                      <strong className="text-[#FAFAFA]">{clientNom}</strong>
                    </p>
                    <input
                      type="text"
                      value={confirmNom}
                      onChange={(e) => { setConfirmNom(e.target.value); setError(null); }}
                      placeholder={clientNom}
                      className="w-full max-w-sm bg-[#111111] border border-[#C9A84C]/20 text-[#FAFAFA] text-sm px-4 py-3 placeholder-[#FAFAFA]/20 focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                    />
                    {error && (
                      <p className="text-xs text-red-400">{error}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSign(contrat)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold tracking-widest uppercase hover:bg-[#E8C96A] transition-colors"
                      >
                        <CheckCircle size={14} /> Confirmer la signature
                      </button>
                      <button
                        onClick={() => { setSigning(null); setConfirmNom(""); setError(null); }}
                        className="px-4 py-3 text-xs text-[#FAFAFA]/30 hover:text-[#FAFAFA]/60 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                    <p className="text-[10px] text-[#FAFAFA]/20 leading-relaxed max-w-sm">
                      En signant, vous acceptez les termes du contrat. Cette signature a valeur légale
                      conformément au règlement eIDAS.
                    </p>
                  </div>
                )}
              </div>
            )}

            {isSigned && (
              <div className="p-6 flex items-center gap-3 text-sm text-green-400">
                <CheckCircle size={16} />
                Contrat signé électroniquement
                {contrat.signe_le && (
                  <span className="text-[#FAFAFA]/30 text-xs">
                    le {new Date(contrat.signe_le).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
