"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const url = searchParams.get("pdfUrl");
    if (url) setPdfUrl(url);
  }, [searchParams]);

  const sendMail = async () => {
    if (!pdfUrl || !email) return;
    const res = await fetch("/api/send-contract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: email, pdfUrl }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(`Erreur d’envoi: ${j?.error ?? res.statusText}`);
      return;
    }
    alert("Contrat envoyé par mail ✅");
  };

  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <h1 className="text-2xl font-bold text-orange-600">
        Merci pour votre réservation 🎉
      </h1>
      <p className="mt-4">Votre paiement a bien été validé.</p>

      {pdfUrl && (
        <div className="mt-8 space-y-4">
          <div>
            <Button asChild>
              <a href={pdfUrl} download>
                Télécharger le contrat (PDF)
              </a>
            </Button>
          </div>

          <div className="text-left space-y-2">
            <label className="block text-sm font-medium">Envoyer le contrat par email</label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="email destinataire"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border rounded-xl px-3 py-2"
              />
              <Button onClick={sendMail}>Envoyer</Button>
            </div>
            <p className="text-xs text-gray-500">
              Un lien de téléchargement vers votre contrat PDF sera envoyé.
            </p>
          </div>
        </div>
      )}

      {!pdfUrl && (
        <p className="mt-6 text-sm text-gray-500">
          Le lien du contrat n’a pas été trouvé dans l’URL. Si le paiement est validé,
          contactez-nous pour recevoir votre contrat par email.
        </p>
      )}
    </div>
  );
}