// app/success/SuccessClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type VerifyResponse = {
  paid: boolean;
  email: string | null;
  pdfUrl: string;
  metadata: Record<string, string>;
  error?: string;
};

export default function SuccessClient() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id") || "";
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendMsg, setSendMsg] = useState<string | null>(null);

  const clientName =
    data?.metadata?.couple_name ||
    [data?.metadata?.bride_first_name, data?.metadata?.bride_last_name]
      .filter(Boolean)
      .join(" ") ||
    "Client";

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      try {
        const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as VerifyResponse;
        if (mounted) setData(json);
      } catch (e) {
        if (mounted) setData({ paid: false, email: null, pdfUrl: "", metadata: {}, error: String(e) });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (sessionId) run();
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  const canDownload = useMemo(() => Boolean(data?.pdfUrl), [data]);
  const toEmail = useMemo(() => data?.email || data?.metadata?.email || "", [data]);

  const handleDownload = () => {
    if (!data?.pdfUrl) return;
    window.open(data.pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleResend = async () => {
    if (!toEmail || !data) {
      setSendMsg("Email ou contrat indisponible.");
      return;
    }
    setSendMsg("Envoi en cours…");
    try {
      const res = await fetch("/api/send-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: toEmail,
          pdfUrl: data.pdfUrl || null,
          pdfPath: data.metadata?.pdfPath || null,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSendMsg(`Erreur d'envoi : ${j?.error || res.statusText}`);
        return;
      }
      setSendMsg("Contrat renvoyé par mail ✅");
    } catch (e: any) {
      setSendMsg(`Erreur d'envoi : ${e?.message || e}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center py-16">
      <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600">
        Merci pour votre réservation 🎉
      </h1>
      <p className="mt-3 text-gray-600 text-lg">
        Votre contrat a été généré pour <b>{clientName}</b>.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={handleDownload}
          disabled={!canDownload || loading}
          className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 disabled:opacity-50"
        >
          📄 Télécharger le contrat
        </button>
        <button
          onClick={handleResend}
          disabled={!canDownload || loading}
          className="px-6 py-3 rounded-xl border border-orange-400 text-orange-600 font-semibold hover:bg-orange-50 disabled:opacity-50"
        >
          ✉️ Renvoyer par email
        </button>
      </div>

      <div className="mt-6 text-sm text-gray-700">
        {loading && <p>Vérification du paiement…</p>}
        {!loading && !canDownload && <p>Aucun contrat généré.</p>}
        {sendMsg && <p className="mt-2">{sendMsg}</p>}
      </div>
    </div>
  );
}