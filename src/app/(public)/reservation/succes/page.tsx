import Link from "next/link";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Réservation confirmée — Irzzen Productions" };

export default function SuccesPage() {
  return (
    <div className="min-h-screen g-bg flex items-center justify-center">
      <div className="wrap py-28 text-center max-w-[600px]">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full g-bar flex items-center justify-center">
            <CheckCircle size={36} className="text-white" />
          </div>
        </div>

        <p className="label-tag mb-4">Paiement confirmé</p>
        <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight mb-5"
          style={{ fontSize: "clamp(28px,4vw,52px)" }}>
          Votre date est <span className="g-text">réservée !</span>
        </h1>
        <p className="text-[15px] text-[rgba(38,30,20,0.5)] font-light leading-[1.75] mb-4">
          Votre acompte a bien été reçu. Votre dossier mariage est créé et votre espace client est prêt.
        </p>
        <p className="text-[14px] text-[rgba(38,30,20,0.42)] font-light leading-[1.7] mb-3">
          Vous allez recevoir dans quelques instants un email avec vos identifiants de connexion et votre contrat prêt à signer.
        </p>
        <p className="text-[13px] text-[rgba(38,30,20,0.35)] font-light leading-[1.7] mb-10 flex items-start gap-2 justify-center">
          <span className="mt-0.5">📬</span>
          <span>Si vous ne voyez pas l'email dans les prochaines minutes, <strong className="text-[rgba(38,30,20,0.55)]">vérifiez votre dossier spam / courriers indésirables.</strong></span>
        </p>

        <div className="card rounded-sm p-6 mb-10 text-left space-y-3">
          {[
            "Identifiants de connexion envoyés par email",
            "Votre dossier mariage est créé",
            "Contrat pré-rempli prêt à signer",
            "Espace client disponible immédiatement",
          ].map(step => (
            <div key={step} className="flex items-center gap-3 text-[13px] text-[rgba(38,30,20,0.55)]">
              <div className="w-1.5 h-1.5 rounded-full g-bar flex-shrink-0" />
              {step}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/client/dashboard" className="btn-fill">Mon espace client</Link>
          <Link href="/" className="btn-ghost">Retour à l&apos;accueil</Link>
        </div>
      </div>
    </div>
  );
}
