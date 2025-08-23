"use client";
import { useEffect, useMemo, useState } from "react";
import { Button, Card } from "@/components/ui";

type Row = {
  id: string;
  file_path: string;
  bytes: number;
  created_at: string;
  bookings: {
    id: string;
    couple_name: string;
    wedding_date: string | null;
    customers: { email: string | null; first_name: string | null; last_name: string | null } | null;
  } | null;
};

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024*1024) return `${(n/1024).toFixed(1)} KB`;
  return `${(n/1024/1024).toFixed(1)} MB`;
}

export default function Admin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailTo, setEmailTo] = useState("");
  const [filter, setFilter] = useState("");

  const refresh = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/contrats/list");
    const data = await res.json();
    setRows(data.items || []);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    return rows.filter(r =>
      (r.bookings?.couple_name || "").toLowerCase().includes(q) ||
      (r.bookings?.customers?.email || "").toLowerCase().includes(q) ||
      r.file_path.toLowerCase().includes(q)
    );
  }, [rows, filter]);

  const download = async (path: string) => {
    const res = await fetch("/api/admin/contrats/download", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ path }) });
    const { url } = await res.json();
    if (url) window.open(url, "_blank");
  };

  const send = async (row: Row) => {
    const to = emailTo || row.bookings?.customers?.email;
    if (!to) { alert("Renseignez un email destinataire."); return; }
    const filename = row.file_path.split("/").pop();
    const res = await fetch("/api/admin/contrats/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, path: row.file_path, filename })
    });
    const data = await res.json();
    if (data.ok) alert("Email envoyé ✅"); else alert(data.error || "Échec envoi");
  };

  const remove = async (row: Row) => {
    if (!confirm("Supprimer définitivement ce PDF ?")) return;
    const res = await fetch("/api/admin/contrats/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: row.id, path: row.file_path })
    });
    const data = await res.json();
    if (data.ok) { refresh(); } else { alert(data.error || "Échec suppression"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Admin — Contrats</h1>
        <Button onClick={refresh}>Rafraîchir</Button>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input className="border rounded-xl px-3 py-2 w-full md:w-80" placeholder="Rechercher (couple, email, chemin)" value={filter} onChange={e=>setFilter(e.target.value)} />
        <div className="flex items-center gap-2">
          <input className="border rounded-xl px-3 py-2 w-72" placeholder="Email destinataire (par défaut: client)" value={emailTo} onChange={e=>setEmailTo(e.target.value)} />
        </div>
      </Card>

      <Card className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left bg-soft">
              <th className="px-4 py-3">Couple</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Fichier</th>
              <th className="px-4 py-3">Taille</th>
              <th className="px-4 py-3">Créé le</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center opacity-70">Chargement…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center opacity-70">Aucun contrat</td></tr>
            )}
            {filtered.map(r => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">
                  <div className="font-medium">{r.bookings?.couple_name || "—"}</div>
                  <div className="opacity-70">{r.bookings?.customers?.email || ""}</div>
                </td>
                <td className="px-4 py-3">{r.bookings?.wedding_date || "—"}</td>
                <td className="px-4 py-3">{r.file_path.split("/").pop()}</td>
                <td className="px-4 py-3">{fmtBytes(r.bytes)}</td>
                <td className="px-4 py-3">{new Date(r.created_at).toLocaleString("fr-FR")}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button onClick={()=>download(r.file_path)}>Télécharger</Button>
                    <Button className="bg-ink/90" onClick={()=>send(r)}>Envoyer</Button>
                    <Button className="bg-red-500 hover:brightness-95" onClick={()=>remove(r)}>Supprimer</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
