"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type SuccessClientProps = {
  bookingId: string;
};

export default function SuccessClient({ bookingId }: SuccessClientProps) {
  const [loading, setLoading] = useState(true);
  const [contractPath, setContractPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Récupération du contrat associé à la réservation
  useEffect(() => {
    async function fetchContract() {
      try {
        const res = await fetch(`/api/admin/contracts/by-booking`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
        });

        if (!res.ok) throw new Error("Impossible de récupérer le contrat");

        const data = await res.json();
        setContractPath(data?.file_path || null);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (bookingId) fetchContract();
  }, [bookingId]);

  // Téléchargement
  async function handleDownload() {
    if (!contractPath) return;
    try {
      const res = await fetch(`/api/admin/contracts/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: contractPath }),
      });
      if (!res.ok) throw new Error("Erreur téléchargement");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "contrat.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Envoi par mail
  async function handleSendEmail() {
    if (!contractPath) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/contracts/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: contractPath, bookingId }),
      });
      if (!res.ok) throw new Error("Erreur envoi email");

      alert("Contrat envoyé avec succès ✅");
    } catch (err: any) {
      setError("Erreur d'envoi : " + err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
      <h1 className="text-2xl font-bold">Merci pour votre réservation 🎉</h1>
      <p className="text-gray-600">
        Votre contrat est prêt. Vous pouvez le télécharger ou le recevoir par
        email.
      </p>

      {loading ? (
        <p>Chargement du contrat…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleDownload}
            disabled={!contractPath}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Télécharger le contrat
          </Button>

          <Button
            onClick={handleSendEmail}
            disabled={!contractPath || sending}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {sending ? "Envoi…" : "Renvoyer par email"}
          </Button>
        </div>
      )}
    </div>
  );
}