"use client";

import { useEffect, useState } from "react";
import EmailSender from "@/components/EmailSender";

type EmailPayload = {
  toEmail: string;
  couple: string;
  dateMariage: string;
  formule: string;
  montant: string | number;
  dateContrat: string;
  lienPdf: string;
};

export default function SuccessClient({ sessionId }: { sessionId: string }) {
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [payload, setPayload]   = useState<EmailPayload | null>(null);
  const [pdfUrl, setPdfUrl]     = useState<string>("");

  useEffect(() => {
    const load = async () => {
      if (!sessionId) {
        setError("Aucun session_id fourni dans l’URL.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const j = await res.json().catch(() => ({} as any));
        console.log("[SuccessClient] Réponse API /api/verify-session:", j);

        // Même si res.ok=false, l’API peut renvoyer un fallback urlPdf pour ne pas bloquer l’UI
        if (!res.ok) {
          const apiErr = j?.error || `Erreur API (${res.status})`;
          // On tente quand même de récupérer un fallback d’URL PDF si présent
          if (j?.data?.urlPdf) setPdfUrl(j.data.urlPdf);
          setError(apiErr);
          return;
        }

        // Cas “ok false mais data fournie” (fallback forcé)
        if (j && j.ok === false) {
          if (j?.data?.urlPdf) setPdfUrl(j.data.urlPdf);
          setError(j?.error || "Réponse partielle de l’API");
          return;
        }

        const ep: EmailPayload | null = j?.data?.emailPayload ?? null;
        const url: string = j?.data?.urlPdf ?? "";

        if (!url) {
          setError("L’API n’a pas renvoyé d’URL PDF.");
          return;
        }

        setPdfUrl(url);
        setPayload(ep);
      } catch (e: any) {
        console.error("[SuccessClient] erreur:", e);
        setError(e?.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
        <p className="font-semibold">session_id manquant</p>
        <p className="text-sm">La redirection Stripe doit inclure <code>?session_id=...</code>.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-lg font-semibold">Traitement en cours…</div>
        <p className="mt-2 text-gray-600">Nous vérifions votre paiement et générons votre contrat.</p>
      </div>
    );
  }

  return (
    <>
      {/* Carte PDF */}
      <div className="rounded-xl border bg-emerald-50 p-6 shadow-sm">
        <h2 className="text-xl font-semibold">📄 Votre contrat est prêt !</h2>
        <p className="text-emerald-900/80">
          {error
            ? "Un incident est survenu, mais un lien de prévisualisation est disponible."
            : "Vous pouvez le consulter, le télécharger ou l’envoyer par email."}
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <a
            href={pdfUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-center disabled:opacity-50"
          >
            👁️ Consulter le contrat (nouvel onglet)
          </a>
          <a
            href={pdfUrl || "#"}
            download
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center disabled:opacity-50"
          >
            📩 Télécharger le PDF
          </a>
        </div>

        {/* Aperçu intégré si on a bien une URL */}
        {pdfUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Aperçu du contrat :</h3>
            <div className="w-full h-[600px] border rounded-lg overflow-hidden shadow">
              <iframe src={pdfUrl} className="w-full h-full" style={{ border: "none" }} />
            </div>
          </div>
        )}

        {/* Message d’erreur éventuel */}
        {error && (
          <p className="mt-4 text-sm text-red-700">
            ⚠️ {error}
          </p>
        )}
      </div>

      {/* Bouton EmailJS (uniquement si on a un payload complet) */}
      <div className="mt-6">
        {payload ? (
          <EmailSender
            toEmail={payload.toEmail}
            couple={payload.couple}
            dateMariage={payload.dateMariage}
            formule={payload.formule}
            montant={payload.montant}
            dateContrat={payload.dateContrat}
            lienPdf={payload.lienPdf}
            buttonLabel="Envoyer le contrat ✉️"
          />
        ) : (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Le payload d’email est incomplet. Le lien PDF fonctionne, mais l’envoi automatique est désactivé.
          </div>
        )}
      </div>
    </>
  );
}