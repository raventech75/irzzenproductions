import Link from "next/link";

export function CTABanner() {
  return (
    <section className="py-32 px-6 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass p-16 relative overflow-hidden">
          {/* Accent lumineux */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
          <div className="absolute inset-0 bg-[#C9A84C]/3 rounded-sm" />

          <div className="relative z-10">
            <p className="text-xs tracking-[0.5em] uppercase text-[#C9A84C] mb-6">
              Votre date approche
            </p>
            <h2
              className="text-4xl md:text-6xl font-bold text-[#FAFAFA] leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Réservez votre équipe
              <br />
              <span className="text-gradient-gold italic">dès maintenant</span>
            </h2>
            <p className="text-[#FAFAFA]/50 text-lg mb-12 max-w-xl mx-auto font-light">
              Les dates se remplissent vite. Contactez-nous pour vérifier la
              disponibilité de notre équipe pour votre mariage.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tarifs"
                className="px-10 py-4 bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#E8C96A] transition-colors duration-300 gold-glow"
              >
                Voir les formules
              </Link>
              <Link
                href="/contact"
                className="px-10 py-4 border border-[#C9A84C]/40 text-[#FAFAFA]/80 text-sm font-light tracking-[0.2em] uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
