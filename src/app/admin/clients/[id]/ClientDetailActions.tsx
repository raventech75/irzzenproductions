"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, Loader2, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

const statuts = ["prospect", "confirme", "en_cours", "livre", "termine"] as const;

const statutLabels: Record<string, string> = {
  prospect: "Prospect",
  confirme: "Confirmé",
  en_cours: "En cours",
  livre: "Livré",
  termine: "Terminé",
};

export function ClientDetailActions({
  clientId,
  statutActuel,
}: {
  clientId: string;
  statutActuel: string;
}) {
  const router = useRouter();
  const [statut, setStatut] = useState(statutActuel);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [sendingAccess, setSendingAccess] = useState(false);
  const [accessSent, setAccessSent] = useState(false);

  const handleStatutChange = async (newStatut: string) => {
    setSaving(true);
    const supabase = createClient();
    await (supabase.from("clients") as any).update({ statut: newStatut }).eq("id", clientId);
    setStatut(newStatut);
    setSaving(false);
    router.refresh();
  };

  const handleCreerAcces = async () => {
    setSendingAccess(true);
    const res = await fetch("/api/admin/creer-acces-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    });
    setSendingAccess(false);
    if (res.ok) {
      setAccessSent(true);
    } else {
      const d = await res.json();
      alert("Erreur : " + (d.error ?? "inconnue"));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const supabase = createClient();
    await (supabase.from("clients") as any).delete().eq("id", clientId);
    router.push("/admin/clients");
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Statut */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#261E14]/30 tracking-wide">Statut :</span>
          <select
            value={statut}
            onChange={(e) => handleStatutChange(e.target.value)}
            disabled={saving}
            className="bg-white border border-[#E8A87C]/30 text-[#261E14]/80 text-xs px-3 py-2 focus:outline-none focus:border-[#E8A87C]/60 transition-colors disabled:opacity-50"
          >
            {statuts.map((s) => (
              <option key={s} value={s}>{statutLabels[s]}</option>
            ))}
          </select>
        </div>

        {/* Accès espace client */}
        {accessSent ? (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 text-xs font-medium">
            <CheckCircle size={12} /> Email envoyé
          </div>
        ) : (
          <button
            onClick={handleCreerAcces}
            disabled={sendingAccess}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E8A87C]/10 border border-[#E8A87C]/30 text-[#E8A87C] text-xs font-medium hover:bg-[#E8A87C]/20 transition-all disabled:opacity-60"
          >
            {sendingAccess ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
            {sendingAccess ? "Envoi…" : "Créer l'accès client"}
          </button>
        )}

        {/* Modifier */}
        <Link
          href={`/admin/clients/${clientId}/modifier`}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#261E14]/12 text-[#261E14]/50 text-xs font-medium tracking-wide hover:border-[#E8A87C]/40 hover:text-[#E8A87C] transition-all"
        >
          <Pencil size={12} /> Modifier
        </Link>

        {/* Supprimer */}
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-400 text-xs font-medium tracking-wide hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <Trash2 size={12} /> Supprimer
        </button>
      </div>

      {/* Modal confirmation suppression */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#261E14]/30 backdrop-blur-sm">
          <div className="bg-white border border-[#261E14]/10 p-8 max-w-sm w-full mx-4 shadow-xl rounded-sm">
            <h3 className="text-lg font-bold text-[#261E14] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              Supprimer ce client ?
            </h3>
            <p className="text-sm text-[#261E14]/50 mb-6 leading-relaxed">
              Cette action est irréversible. Toutes les données associées (contrats, galeries, messages) seront également supprimées.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white text-xs font-semibold tracking-widest uppercase hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Supprimer définitivement
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-[#261E14]/40 hover:text-[#261E14]/70 transition-colors px-3 py-2.5"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
