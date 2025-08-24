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
      try {
        const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`);
        const j = await res.json();
        console.log("[SuccessClient] JSON brut:", JSON.stringify(j, null, 2));

        if (!res.ok) throw new Error(j?.error || "Erreur API");

        const ep: EmailPayload | null =
          j?.data?.emailPayload ?? j?.data?.email_payload ?? null;

        // On cherche dans urlPdf, url_pdf ou directement lienPdf
        const url: string =
          j?.data?.urlPdf ||
          j?.data?.url_pdf ||
          ep?.lienPdf ||
          (ep as any)?.lien_pdf ||
          "";

        if (!url) {
          setError("⚠️ Aucun lien PDF trouvé dans la réponse API");
          return;
        }

        setPayload(ep);
        setPdfUrl(url);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) void load();
  }, [sessionId]);

  if (loading) return <p>⏳ Génération en cours…</p>;
  if (error)   return <p className="text-red-600">{error}</p>;

  return (
    <>
      <div className="rounded-xl border bg-emerald-50 p-6">
        <h2 className="text-xl font-semibold">📄 Votre contrat est prêt !</h2>

        <div className="mt-4 flex flex-col gap-2">
          <a href={pdfUrl} target="_blank" className="bg-green-600 text-white px-4 py-2 rounded-lg text-center">
            👁️ Consulter le contrat
          </a>
          <a href={pdfUrl} download className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
            📩 Télécharger le PDF
          </a>
        </div>

        {pdfUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Aperçu :</h3>
            <iframe src={pdfUrl} className="w-full h-[600px] border rounded-lg" />
          </div>
        )}
      </div>

      <div className="mt-6">
        {payload ? (
          <EmailSender
            toEmail={payload.toEmail}
            couple={payload.couple}
            dateMariage={payload.dateMariage}
            formule={payload.formule}
            montant={payload.montant}
            dateContrat={payload.dateContrat}
            lienPdf={pdfUrl}
            buttonLabel="Envoyer le contrat ✉️"
          />
        ) : (
          <p className="text-sm text-amber-700">
            Payload incomplet → Email désactivé.
          </p>
        )}
      </div>
    </>
  );
}