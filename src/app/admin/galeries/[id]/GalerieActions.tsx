"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Bell, CheckCircle, Loader2, Trash2, Pencil } from "lucide-react";
import Link from "next/link";

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
      <div className="flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 text-xs font-semibold tracking-widest uppercase">
        <CheckCircle size={13} /> Galerie publiée
      </div>
    );
  }

  return (
    <button
      onClick={handlePublier}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 bg-[#E8A87C] text-[#261E14] text-xs font-semibold tracking-widest uppercase hover:bg-[#d4905e] transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 size={13} className="animate-spin" /> : <Bell size={13} />}
      {loading ? "Envoi…" : "Publier & notifier le client"}
    </button>
  );
}

export function ModifierGalerieButton({ galerieId }: { galerieId: string }) {
  return (
    <Link
      href={`/admin/galeries/${galerieId}/modifier`}
      className="flex items-center gap-1.5 px-4 py-2 border border-[#261E14]/12 text-[#261E14]/50 text-xs font-medium hover:border-[#E8A87C]/40 hover:text-[#E8A87C] transition-all"
    >
      <Pencil size={12} /> Modifier
    </Link>
  );
}

export function SupprimerGalerieButton({ galerieId }: { galerieId: string }) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const supabase = createClient();
    await (supabase.from("galeries") as any).delete().eq("id", galerieId);
    router.push("/admin/galeries");
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setConfirmDelete(true)}
        className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-400 text-xs font-medium hover:bg-red-50 hover:text-red-600 transition-all"
      >
        <Trash2 size={12} /> Supprimer
      </button>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#261E14]/30 backdrop-blur-sm">
          <div className="bg-white border border-[#261E14]/10 p-8 max-w-sm w-full mx-4 shadow-xl rounded-sm">
            <h3 className="text-lg font-bold text-[#261E14] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              Supprimer cette galerie ?
            </h3>
            <p className="text-sm text-[#261E14]/50 mb-6 leading-relaxed">
              Cette action est irréversible. Tous les fichiers associés seront supprimés.
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
