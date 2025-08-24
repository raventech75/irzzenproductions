"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

export default function SuccessPage() {
  const search = useSearchParams();
  const sessionId = search.get("session_id") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [payload, setPayload] = useState<EmailPayload | null>(null);
  const [pdfUrl, setPdfUrl]   = useState<string>("");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        const j = await res.json();
        console.log("📋 JSON brut:", JSON.stringify(j, null, 2));

        if (!res.ok || j?.ok === false) {
          setError(j?.error || `Erreur API (${res.status})`);
        }

        // Lis d'abord data.urlPdf (que l'API renvoie tjrs désormais)
        const url = j?.data?.urlPdf || j?.data?.pdfUrl || j?.data?.url_pdf || j?.data?.emailPayload?.lienPdf || "";
        setPdfUrl(url);
        setPayload(j?.data?.emailPayload || null);
      } catch (e: any) {
        setError(e.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    if (sessionId) void run();
  }, [sessionId]);

  if (loading) return <main className="p-6">⏳ Génération en cours…</main>;

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="rounded-xl border bg-emerald-50 p-6 shadow-sm">
        <h2 className="text-xl font-semibold">📄 Votre contrat est prêt !</h2>

        <div className="mt-4 flex flex-col gap-2">
          <a
            href={pdfUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 rounded-lg text-center text-white ${pdfUrl ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
          >
            👁️ Consulter le contrat
          </a>
          <a
            href={pdfUrl || "#"}
            download
            className={`px-4 py-2 rounded-lg text-center text-white ${pdfUrl ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
          >
            📩 Télécharger le PDF
          </a>
        </div>

        {pdfUrl && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Aperçu :</h3>
            <div className="w-full h-[600px] border rounded-lg overflow-hidden shadow">
              <iframe src={pdfUrl} className="w-full h-full" style={{ border: "none" }} />
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      </div>

      <div>
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
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Le lien PDF fonctionne, mais le payload d’email est incomplet.
          </div>
        )}
      </div>
    </main>
  );
}