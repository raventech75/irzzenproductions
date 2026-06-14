import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF7]">
      <div className="wrap pt-[140px] pb-28 max-w-[720px]">
        <p className="label-tag mb-4">Légal</p>
        <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] text-[clamp(28px,4vw,48px)] mb-12">
          Mentions légales
        </h1>
        <div className="card rounded-sm p-10 text-center">
          <div className="g-bar h-[2px] w-10 rounded-full mx-auto mb-6" />
          <p className="font-[family-name:var(--font-playfair)] italic text-[18px] text-[rgba(38,30,20,0.5)] mb-4">
            Page en cours de rédaction
          </p>
          <p className="text-[14px] text-[rgba(38,30,20,0.38)] mb-8">
            Nos mentions légales seront disponibles très prochainement.
          </p>
          <Link href="/" className="btn-ghost">Retour à l&apos;accueil</Link>
        </div>
      </div>
    </div>
  );
}
