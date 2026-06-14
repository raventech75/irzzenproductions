import Link from "next/link";
import { XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Paiement annulé — Irzzen Productions" };

export default function AnnulationPage() {
  return (
    <div className="min-h-screen g-bg flex items-center justify-center">
      <div className="wrap py-28 text-center max-w-[520px]">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[rgba(38,30,20,0.08)] flex items-center justify-center">
            <XCircle size={36} className="text-[rgba(38,30,20,0.3)]" />
          </div>
        </div>

        <p className="label-tag mb-4">Paiement annulé</p>
        <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight mb-5"
          style={{ fontSize: "clamp(28px,4vw,52px)" }}>
          Pas de souci
        </h1>
        <p className="text-[15px] text-[rgba(38,30,20,0.5)] font-light leading-[1.75] mb-10">
          Votre paiement a été annulé. Aucun montant n&apos;a été débité. Revenez quand vous le souhaitez pour finaliser votre réservation.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/tarifs" className="btn-fill">Retour aux formules</Link>
          <Link href="/contact" className="btn-ghost">Nous contacter</Link>
        </div>
      </div>
    </div>
  );
}
