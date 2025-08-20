"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const pdfUrl = searchParams.get("pdfUrl"); // URL publique ou signée Supabase
  const clientEmail = searchParams.get("email") || "client@email.com";
  const clientName = searchParams.get("name") || "Client";

  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!pdfUrl) {
      setStatus("Aucun contrat généré.");
    }
  }, [pdfUrl]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, "_blank");
  };

  const handleResend = async () => {
    if (!pdfUrl) {
      setStatus("Aucun contrat disponible.");
      return;
    }
    setStatus("Envoi en cours...");

    try {
      const res = await fetch("/api/admin/contracts/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: clientEmail,
          pdfUrl,
        }),
      });

      if (!res.ok) throw new Error("Erreur serveur");
      setStatus("Contrat renvoyé avec succès ✅");
    } catch (err) {
      console.error(err);
      setStatus("Erreur lors de l’envoi ❌");
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <h1 className="text-3xl font-bold text-orange-600">
        Merci pour votre réservation 🎉
      </h1>
      <p className="mt-2 text-gray-600">
        Votre contrat a été généré pour <b>{clientName}</b>.
      </p>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleDownload}
          disabled={!pdfUrl}
          className="px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
        >
          📄 Télécharger le contrat
        </button>
        <button
          onClick={handleResend}
          disabled={!pdfUrl}
          className="px-5 py-2 rounded-lg border border-orange-500 text-orange-600 hover:bg-orange-50 disabled:opacity-50"
        >
          ✉️ Renvoyer par email
        </button>
      </div>

      {status && (
        <p className="mt-4 text-sm text-gray-700">
          {status}
        </p>
      )}
    </div>
  );
}