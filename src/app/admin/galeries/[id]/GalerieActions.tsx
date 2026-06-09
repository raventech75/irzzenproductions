"use client";

import { useState } from "react";
import { Bell, CheckCircle, Loader2 } from "lucide-react";

export function PublierGalerieButton({ galerieId, actif }: { galerieId: string; actif: boolean }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handlePublier = async () => {
    if (!confirm("Publier la galerie et notifier le client par email ?")) return;
    setLoading(true);
    const res = await fetch("/api/admin/galerie-notif", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ galerieId }),
    });
    setLoading(false);
    if (res.ok) setDone(true);
    else alert("Erreur lors de la publication");
  };

  if (done || actif) {
    return (
      <div className="flex items-center gap-2 px-5 py-2.5 bg-green-400/10 text-green-400 text-xs font-semibold tracking-widest uppercase">
        <CheckCircle size={13} /> Galerie publiée
      </div>
    );
  }

  return (
    <button
      onClick={handlePublier}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 bg-[#C4A5B5] text-[#13111A] text-xs font-semibold tracking-widest uppercase hover:bg-[#DEC8D6] transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <Bell size={13} />}
      {loading ? "Envoi…" : "Publier & notifier le client"}
    </button>
  );
}
