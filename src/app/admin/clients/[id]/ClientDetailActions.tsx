"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

  const handleStatutChange = async (newStatut: string) => {
    setSaving(true);
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("clients") as any).update({ statut: newStatut }).eq("id", clientId);
    setStatut(newStatut);
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#1A1520]/30 tracking-wide">Statut :</span>
        <select
          value={statut}
          onChange={(e) => handleStatutChange(e.target.value)}
          disabled={saving}
          className="bg-[#FAFAF8] border border-[#C4A5B5]/30 text-[#1A1520]/80 text-xs px-3 py-2 focus:outline-none focus:border-[#C4A5B5]/60 transition-colors disabled:opacity-50"
        >
          {statuts.map((s) => (
            <option key={s} value={s}>{statutLabels[s]}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
