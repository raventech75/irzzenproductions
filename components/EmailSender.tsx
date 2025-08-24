"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

type EmailSenderProps = {
  toEmail: string;             // email du client
  couple: string;
  dateMariage?: string;        // optionnel
  formule: string;
  montant: string | number;
  dateContrat: string;
  lienPdf: string;
  buttonLabel?: string;
  notifyEmail?: string;        // si non fourni => NEXT_PUBLIC_NOTIFY_EMAIL
};

export default function EmailSender(props: EmailSenderProps) {
  const {
    toEmail,
    couple,
    dateMariage,
    formule,
    montant,
    dateContrat,
    lienPdf,
    buttonLabel = "Envoyer le contrat ✉️",
    notifyEmail = process.env.NEXT_PUBLIC_NOTIFY_EMAIL || "contact@irzzenproductions.fr",
  } = props;

  const [sending, setSending]   = useState(false);
  const [sentInfo, setSentInfo] = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);

  // Champs obligatoires (dateMariage NON bloquant)
  const required: (keyof EmailSenderProps)[] = [
    "toEmail",
    "couple",
    "formule",
    "montant",
    "dateContrat",
    "lienPdf",
  ];
  const missing = required.filter((f) => !props[f] || props[f]!.toString().trim() === "");
  const isDisabled = sending || missing.length > 0;

  const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  const templateVars = (to: string) => ({
    to_email: to,                 // ⚠️ ton template doit utiliser {{to_email}} dans le champ "To"
    reply_to: toEmail,            // répondre -> client
    couple,
    date_mariage: dateMariage || "-",
    formule,
    montant,
    date_contrat: dateContrat,
    lien_pdf: lienPdf,
  });

  const sendOnce = async (to: string) => {
    return emailjs.send(serviceId, templateId, templateVars(to), publicKey);
  };

  const handleSend = async () => {
    setSending(true);
    setError(null);
    setSentInfo(null);

    try {
      const recipients: string[] = [toEmail];
      if (notifyEmail && notifyEmail !== toEmail) recipients.push(notifyEmail);

      const results = await Promise.allSettled(recipients.map(sendOnce));
      const okCount = results.filter((r) => r.status === "fulfilled").length;
      const fail    = results.find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;

      if (okCount > 0) {
        setSentInfo(`✅ Contrat envoyé à ${recipients.join(", ")}`);
      }
      if (fail) {
        setError((fail.reason && (fail.reason.message || fail.reason)) || "Une partie des envois a échoué.");
      }
    } catch (e: any) {
      setError(e?.message || "Erreur lors de l’envoi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-8 flex w-full justify-center">
      <div className="w-full max-w-md">
        <button
          disabled={isDisabled}
          onClick={handleSend}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition
            ${isDisabled
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow"}
          `}
          aria-disabled={isDisabled}
        >
          {sending ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
              Envoi en cours…
            </>
          ) : sentInfo ? (
            <>✅ Contrat envoyé</>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {buttonLabel}
            </>
          )}
        </button>

        {sentInfo && <p className="mt-2 text-center text-sm text-emerald-700">{sentInfo}</p>}
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}

        {missing.length > 0 && (
          <p className="mt-2 text-center text-xs text-gray-500">
            Diagnostic (pourquoi le bouton est grisé) : {missing.join(", ")}
          </p>
        )}

        <p className="mt-1 text-center text-xs text-gray-400">
          Copie envoyée à : {notifyEmail || "—"}
        </p>
      </div>
    </div>
  );
}