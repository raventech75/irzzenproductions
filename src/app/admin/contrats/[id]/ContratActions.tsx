"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Send, CheckCircle, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

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
      <div className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 text-xs font-semibold tracking-widest uppercase">
        <CheckCircle size={13} /> Contrat signé
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 px-5 py-2.5 bg-[#E8A87C]/10 text-[#E8A87C] text-xs font-semibold tracking-widest uppercase">
        <CheckCircle size={13} /> Email envoyé
      </div>
    );
  }

  return (
    <button
      onClick={handleEnvoyer}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 bg-[#E8A87C] text-[#261E14] text-xs font-semibold tracking-widest uppercase hover:bg-[#d4905e] transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
      {loading ? "Envoi…" : "Envoyer pour signature"}
    </button>
  );
}

export function ContratAdminActions({ contratId }: { contratId: string }) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const supabase = createClient();
    await (supabase.from("contrats") as any).delete().eq("id", contratId);
    router.push("/admin/contrats");
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/contrats/${contratId}/modifier`}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#261E14]/12 text-[#261E14]/50 text-xs font-medium hover:border-[#E8A87C]/40 hover:text-[#E8A87C] transition-all"
        >
          <Pencil size={12} /> Modifier
        </Link>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-400 text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <Trash2 size={12} /> Supprimer
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#261E14]/30 backdrop-blur-sm">
          <div className="bg-white border border-[#261E14]/10 p-8 max-w-sm w-full mx-4 shadow-xl rounded-sm">
            <h3 className="text-lg font-bold text-[#261E14] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              Supprimer ce contrat ?
            </h3>
            <p className="text-sm text-[#261E14]/50 mb-6 leading-relaxed">
              Cette action est irréversible.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-xs font-semibold tracking-widest uppercase hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Supprimer
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-[#261E14]/40 hover:text-[#261E14]/70 transition-colors px-3 py-2.5">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
