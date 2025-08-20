// app/success/SuccessClient.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type VerifyPayload = {
  ok: boolean;
  paid: boolean;
  email: string | null;
  pdfUrl: string | null;
  currency?: string | null;
  amount_total?: number | null;
  session_status?: string | null;
  error?: string;
};

export default function SuccessClient() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(true);
  const [verify, setVerify] = useState<VerifyPayload | null>(null);
  const [email, setEmail] = useState("");

  const pdfUrl = verify?.pdfUrl ?? null;

  const amount = useMemo(() => {
    if (!verify?.amount_total) return null;
    return (verify.amount_total / 100).toLocaleString("fr-FR") + " €";
  }, [verify?.amount_total]);

  useEffect(() => {
    const run = async () => {
      if (!sessionId) {
        setLoading(false);
        setVerify({ ok: false, paid: false, email: null, pdfUrl: null, error: "Aucun session_id dans l’URL" });
        return;
      }
      try {
        const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`);
        const data: VerifyPayload = await res.json();
        setVerify(data);
        if (data?.email) setEmail(data.email);
      } catch (e: any) {
        setVerify({ ok: false, paid: false, email: null, pdfUrl: null, error: e?.message || "Erreur réseau" });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [sessionId]);

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

  if (loading) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 text-gray-500">
        Vérification du paiement en cours…
      </div>
    );
  }

  const isPaid = !!verify?.paid;
  const hasPdf = !!pdfUrl;

  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <h1 className="text-2xl font-bold text-orange-600">Merci pour votre réservation 🎉</h1>
      <p className="mt-2">
        {isPaid ? "Votre paiement a bien été validé." : "Paiement non confirmé."}
      </p>

      {amount && (
        <p className="mt-1 text-sm text-gray-600">Montant : {amount}</p>
      )}

      {!isPaid && (
        <p className="mt-6 text-sm text-red-600">
          Nous n’avons pas pu confirmer le paiement. Si vous avez été débité, contactez le support avec votre preuve de paiement.
        </p>
      )}

      {isPaid && hasPdf ? (
        <div className="mt-8 space-y-4">
          <div>
            <a
              href={pdfUrl!}
              download
              className="inline-flex items-center rounded-md bg-orange-500 px-4 py-2 text-white shadow-sm hover:bg-orange-400 transition"
            >
              Télécharger le contrat (PDF)
            </a>
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
              <button
                onClick={sendMail}
                className="rounded-xl bg-orange-500 px-4 py-2 text-white hover:bg-orange-400 transition"
              >
                Envoyer
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Un lien de téléchargement vers votre contrat PDF sera envoyé.
            </p>
          </div>
        </div>
      ) : (
        isPaid && (
          <p className="mt-6 text-sm text-gray-500">
            Le lien du contrat n’a pas été trouvé. Contactez-nous pour le recevoir par email.
          </p>
        )
      )}

      {verify?.error && (
        <p className="mt-6 text-xs text-red-500">Erreur : {verify.error}</p>
      )}
    </div>
  );
}