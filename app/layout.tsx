export const metadata = {
  title: "IRZZEN Productions",
  description: "Photographe & vidéaste de mariage — réservation élégante"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-dvh bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-soft to-white text-ink">
        <div className="relative">
          {/* Ruban décoratif pastel */}
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-48 bg-gradient-to-r from-[#f7caa466] via-[#98c9ae55] to-[#f7caa466] blur-2xl" />
          <header className="max-w-6xl mx-auto px-6 pt-10 pb-6">
            <div className="flex items-center justify-between">
              <a href="/" className="text-2xl font-semibold tracking-tight">IRZZEN <span className="opacity-60">Productions</span></a>
              <nav className="hidden md:flex items-center gap-6 text-sm opacity-80">
                <a href="/reservation" className="hover:opacity-100">Réserver</a>
                <a href="#formules" className="hover:opacity-100">Formules</a>
                <a href="/rib.pdf" target="_blank" className="hover:opacity-100">RIB</a>
              </nav>
              <a href="/reservation" className="btn">Commencer</a>
            </div>
          </header>
          <main className="max-w-6xl mx-auto px-6 pb-16">
            {children}
          </main>
          <footer className="border-t border-soft/60 bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/40">
            <div className="max-w-6xl mx-auto px-6 py-8 text-sm opacity-70 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} IRZZEN Productions — 15+ ans — Équipe de 12 pros</p>
              <p>Conditions : aucune annulation recevable · acompte non remboursable · livraison ≤ 6 mois</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}