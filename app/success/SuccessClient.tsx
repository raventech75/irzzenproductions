"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type VerifyResp = {
  ok: boolean;
  paid: boolean;
  email: string | null;
  pdfUrl: string | null;
  currency?: string | null;
  amount_total?: number | null;
  session_status?: string | null;
  // métadonnées Stripe (si présentes)
  metadata?: Record<string, string | null | undefined>;
  error?: string;
};

export default function SuccessClient() {
  const params = useSearchParams();
  const sessionId = params.get("session_id"); // Stripe renvoie ?session_id=...

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerifyResp | null>(null);
  const [toEmail, setToEmail] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!sessionId) {
        setData({ ok: false, paid: false, email: null, pdfUrl: null, error: "Session Stripe introuvable." });
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/verify-session?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        const j: VerifyResp = await res.json();
        setData(j);
        if (j?.email) setToEmail(j.email);
      } catch (e: any) {
        setData({ ok: false, paid: false, email: null, pdfUrl: null, error: e?.message || "Erreur réseau" });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [sessionId]);

  const paid = !!data?.paid;
  const pdfUrl = data?.pdfUrl ?? null;

  const amount = useMemo(() => {
    if (!data?.amount_total) return null;
    return (data.amount_total / 100).toLocaleString("fr-FR") + " €";
  }, [data?.amount_total]);

  // Récap depuis metadata si dispo
  const md = data?.metadata || {};
  const couple =
    [md.bride_first_name, md.bride_last_name, md.groom_first_name, md.groom_last_name]
      .filter(Boolean)
      .join(" ");
  const formula = md.formula || null;
  const weddingDate = md.wedding_date || md.ceremony_date || null;
  const ceremony = [md.ceremony_address, md.ceremony_time].filter(Boolean).join(" — ");
  const reception = [md.reception_address, md.reception_time].filter(Boolean).join(" — ");

  const resendEmail = async () => {
    if (!pdfUrl || !toEmail) return;
    const res = await fetch("/api/send-contract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: toEmail, pdfUrl }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(`Erreur d’envoi: ${j?.error ?? res.statusText}`);
      return;
    }
    alert("Contrat renvoyé par mail ✅");
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 text-gray-500">
        Vérification du paiement en cours…
      </div>
    );
  }

  if (!paid) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-orange-600">Paiement non confirmé</h1>
        <p className="mt-2 text-gray-600">
          Si vous avez été débité, contactez-nous avec votre preuve de paiement.
        </p>
        <a
          href="/reservation"
          className="inline-flex mt-6 rounded-xl border border-orange-300 px-4 py-2 text-orange-700 hover:bg-orange-50"
        >
          Revenir à la réservation
        </a>
        {data?.error && <p className="mt-4 text-xs text-red-500">{data.error}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold text-orange-600 text-center">Merci pour votre réservation 🎉</h1>
      <p className="mt-2 text-center text-gray-600">
        Votre paiement a bien été validé.
      </p>

      <div className="mt-8 grid gap-4 rounded-xl border bg-white p-5">
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-gray-500">Nom / Couple</div>
            <div className="font-medium">{couple || "—"}</div>
          </div>
          <div>
            <div className="text-gray-500">Email</div>
            <div className="font-medium">{data?.email || "—"}</div>
          </div>
          <div>
            <div className="text-gray-500">Formule</div>
            <div className="font-medium">{formula || "—"}</div>
          </div>
          <div>
            <div className="text-gray-500">Montant</div>
            <div className="font-medium">{amount || "—"}</div>
          </div>
          <div>
            <div className="text-gray-500">Date du mariage</div>
            <div className="font-medium">{weddingDate || "—"}</div>
          </div>
          <div>
            <div className="text-gray-500">Cérémonie</div>
            <div className="font-medium">{ceremony || "—"}</div>
          </div>
          <div>
            <div className="text-gray-500">Réception</div>
            <div className="font-medium">{reception || "—"}</div>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-3">
          {pdfUrl ? (
            <a
              href={pdfUrl}
              className="rounded-xl bg-orange-500 px-4 py-2 text-white hover:bg-orange-400"
              target="_blank"
              rel="noreferrer"
            >
              Télécharger le contrat (PDF)
            </a>
          ) : (
            <span className="text-sm text-gray-500">Lien contrat indisponible.</span>
          )}

          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="email destinataire"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className="border rounded-xl px-3 py-2"
            />
            <button
              onClick={resendEmail}
              disabled={!pdfUrl || !toEmail}
              className="rounded-xl border px-3 py-2 hover:bg-orange-50 disabled:opacity-60"
            >
              Renvoyer par email
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-6 text-center">
        Un email de confirmation contenant votre contrat vous a été envoyé. Conservez ce document.
      </p>
    </div>
  );
}