"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

export function EnvoyerContratButton({ contratId, statut }: { contratId: string; statut: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleEnvoyer = async () => {
    if (!confirm("Envoyer le contrat au client par email pour signature ?")) return;
    setLoading(true);
    const res = await fetch("/api/admin/contrat-notif", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contratId }),
    });
    setLoading(false);
    if (res.ok) setDone(true);
    else alert("Erreur lors de l'envoi");
  };

  if (statut === "signe") {
    return (
      <div className="flex items-center gap-2 px-5 py-2.5 bg-green-400/10 text-green-400 text-xs font-semibold tracking-widest uppercase">
        <CheckCircle size={13} /> Contrat signé
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 px-5 py-2.5 bg-[#C4A5B5]/10 text-[#C4A5B5] text-xs font-semibold tracking-widest uppercase">
        <CheckCircle size={13} /> Email envoyé
      </div>
    );
  }

  return (
    <button
      onClick={handleEnvoyer}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 bg-[#C4A5B5] text-[#13111A] text-xs font-semibold tracking-widest uppercase hover:bg-[#DEC8D6] transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
      {loading ? "Envoi…" : "Envoyer pour signature"}
    </button>
  );
}
