"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export function CTABanner() {
  return (
    <section className="bg-[#FDFAF7] py-28 border-t border-[rgba(38,30,20,0.06)]">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <Reveal direction="left">
            <div>
              <p className="label-tag mb-5">Votre date approche</p>
              <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#261E14] tracking-tight leading-[0.94]"
                style={{ fontSize: "clamp(38px,5.5vw,76px)" }}>
                Réservez<br />
                <span className="g-text">dès maintenant.</span>
              </h2>
            </div>
          </Reveal>

          <Reveal direction="right" delay={120}>
            <div>
              <p className="text-[15px] text-[rgba(38,30,20,0.45)] font-light leading-[1.72] mb-9 max-w-md">
                Les dates se remplissent rapidement. Contactez-nous pour vérifier la disponibilité de notre équipe pour votre mariage.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn-fill">Nous contacter</Link>
                <Link href="/tarifs"  className="btn-ghost">Voir les formules</Link>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
