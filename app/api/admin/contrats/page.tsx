"use client";

import { useEffect, useState } from "react";

type Item = {
  path: string;
  name: string;
  bytes: number;
  created_at: string | null;
  signedUrl?: string | null;
};

export default function AdminContractsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/contracts/list", { cache: "no-store" });
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const sendMail = async (path: string) => {
    const to = prompt("Envoyer à (email) :");
    if (!to) return;
    const res = await fetch("/api/admin/contracts/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, to }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert("Erreur d’envoi: " + (j?.error || res.statusText));
    } else {
      alert("Email envoyé ✅");
    }
  };

  const removeFile = async (path: string) => {
    if (!confirm(`Supprimer ce contrat ?\n${path}`)) return;
    const res = await fetch("/api/admin/contracts/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert("Erreur suppression: " + (j?.error || res.statusText));
    } else {
      await load();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-orange-600">Admin — Contrats</h1>
        <button
          onClick={load}
          className="rounded-lg border border-orange-300 px-3 py-2 hover:bg-orange-50"
        >
          Rafraîchir
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Chargement…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">Aucun contrat trouvé.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-orange-50 text-orange-900">
              <tr>
                <th className="text-left px-4 py-3">Fichier</th>
                <th className="text-left px-4 py-3">Taille</th>
                <th className="text-left px-4 py-3">Créé</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.path} className="border-t">
                  <td className="px-4 py-3 font-mono">{it.name}</td>
                  <td className="px-4 py-3">{(it.bytes / 1024).toFixed(1)} Ko</td>
                  <td className="px-4 py-3">{it.created_at ? new Date(it.created_at).toLocaleString("fr-FR") : "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <a
                        href={`/api/admin/contracts/signed-url?path=${encodeURIComponent(it.path)}`}
                        className="rounded-lg border px-3 py-1 hover:bg-orange-50"
                        target="_blank"
                      >
                        Télécharger
                      </a>
                      <button
                        onClick={() => sendMail(it.path)}
                        className="rounded-lg border px-3 py-1 hover:bg-orange-50"
                      >
                        Envoyer par mail
                      </button>
                      <button
                        onClick={() => removeFile(it.path)}
                        className="rounded-lg border px-3 py-1 hover:bg-red-50 text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-4">
        Astuce : “Télécharger” génère une URL signée temporaire (1h) et ouvre le PDF dans un nouvel onglet.
      </p>
    </div>
  );
}