// app/success/SuccessClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type VerifyResponse =
  | { ok: true; email: string | null; pdfUrl: string | null; pdfPath: string | null }
  | { error: string };

export default function SuccessClient() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id") || "";

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState<string | null>(null);

  const hasContract = useMemo(() => Boolean(pdfUrl || pdfPath), [pdfUrl, pdfPath]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!sessionId) {
        setFetchError("Aucun identifiant de session trouvé.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`, {
          cache: "no-store",
        });
        const data: VerifyResponse = await res.json();
        if (cancelled) return;

        if ("error" in data) {
          setFetchError(data.error || "Erreur inconnue.");
        } else {
          setEmail(data.email || "");
          setPdfUrl(data.pdfUrl);
          setPdfPath(data.pdfPath);
        }
      } catch (e: any) {
        if (!cancelled) setFetchError(e?.message || "Erreur réseau.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const onSend = async () => {
    setSendMsg(null);
    if (!pdfPath) {
      setSendMsg("Aucun contrat disponible pour l'envoi.");
      return;
    }
    const to = prompt("À quelle adresse email envoyer le contrat ?", email || "") || "";
    if (!to) return;

    try {
      setSending(true);
      const r = await fetch("/api/admin/contracts/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pdfPath, to }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.error || "Échec d'envoi.");
      setSendMsg("Email envoyé ✅");
    } catch (e: any) {
      setSendMsg(`Erreur d'envoi : ${e?.message || "inconnue"}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-orange-600">
        Merci pour votre réservation 🎉
      </h1>

      <p className="mt-4 text-lg text-slate-700">
        {email ? (
          <>Votre contrat a été généré pour <span className="font-semibold">{email}</span>.</>
        ) : (
          <>Votre contrat a été généré pour <span className="font-semibold">Client</span>.</>
        )}
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href={pdfUrl || undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-base font-medium border transition ${
            hasContract && pdfUrl
              ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-400"
              : "bg-orange-200/60 text-orange-900/60 border-orange-300 cursor-not-allowed"
          }`}
        >
          <span role="img" aria-label="doc">📄</span>
          Télécharger le contrat
        </a>

        <button
          onClick={onSend}
          disabled={!hasContract || sending}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-base font-medium border transition ${
            hasContract && !sending
              ? "text-orange-700 border-orange-300 hover:bg-orange-50"
              : "text-orange-900/60 border-orange-200 cursor-not-allowed"
          }`}
        >
          <span role="img" aria-label="mail">✉️</span>
          {sending ? "Envoi..." : "Renvoyer par email"}
        </button>
      </div>

      <div className="mt-8 text-sm text-slate-600">
        {loading && <p>Vérification du contrat en cours…</p>}
        {!loading && !hasContract && !fetchError && <p>Aucun contrat généré.</p>}
        {fetchError && <p className="text-red-600">Erreur : {fetchError}</p>}
        {sendMsg && <p className="mt-2">{sendMsg}</p>}
      </div>
    </div>
  );
}