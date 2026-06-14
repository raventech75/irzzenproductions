import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Conditions Générales de Vente" };

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF7]">
      <div className="wrap pt-[140px] pb-28 max-w-[720px]">
        <p className="label-tag mb-4">Légal</p>
        <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] text-[clamp(28px,4vw,48px)] mb-4">
          Conditions Générales de Vente
        </h1>
        <p className="text-[15px] text-[rgba(38,30,20,0.45)] mb-12 font-light">
          En vigueur à compter de leur publication.
        </p>
        <div className="card rounded-sm p-10 text-center">
          <div className="g-bar h-[2px] w-10 rounded-full mx-auto mb-6" />
          <p className="font-[family-name:var(--font-playfair)] italic text-[18px] text-[rgba(38,30,20,0.5)] mb-4">
            Page en cours de rédaction
          </p>
          <p className="text-[14px] text-[rgba(38,30,20,0.38)] mb-2">
            Nos CGV seront disponibles très prochainement.
          </p>
          <p className="text-[13px] text-[rgba(38,30,20,0.35)] mb-8">
            À noter : en cas d&apos;annulation, quelle qu&apos;en soit la raison, l&apos;acompte versé reste définitivement acquis et ne pourra faire l&apos;objet d&apos;aucun remboursement.
          </p>
          <Link href="/" className="btn-ghost">Retour à l&apos;accueil</Link>
        </div>
      </div>
    </div>
  );
}
