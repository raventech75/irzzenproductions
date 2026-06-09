import Link from "next/link";

export function CTABanner() {
  return (
    <section className="bg-[#0E0C10] py-32 relative overflow-hidden z-10">

      {/* Photo ambiance */}
      <img
        src="/photos/1L9A7557.JPG"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">

          {/* Gauche */}
          <div>
            <div className="flex items-center gap-6 mb-10">
              <span className="block w-12 h-px bg-[#A8919E]" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-[#A8919E]">Votre date approche</span>
            </div>
            <h2
              className="text-[clamp(40px,6vw,88px)] font-bold leading-[0.9] tracking-[-0.02em] text-[#F6F2EE] mb-8"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Réservez<br />
              <em className="not-italic text-gradient-gold">dès maintenant</em>
            </h2>
          </div>

          {/* Droite */}
          <div className="lg:pb-2">
            <p className="text-[#F6F2EE]/35 text-sm font-light leading-relaxed mb-10 max-w-sm">
              Les dates se remplissent rapidement. Contactez-nous pour vérifier la disponibilité de notre équipe pour votre mariage.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/tarifs"
                className="px-8 py-3.5 bg-[#F6F2EE] text-[#0E0C10] text-[11px] font-semibold tracking-[0.35em] uppercase hover:bg-white transition-colors gold-glow"
              >
                Voir les formules
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 border border-[#F6F2EE]/20 text-[#F6F2EE]/50 text-[11px] tracking-[0.35em] uppercase hover:border-[#F6F2EE]/50 hover:text-[#F6F2EE] transition-all"
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
