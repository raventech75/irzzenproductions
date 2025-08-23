import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import CrispChat from '@/components/CrispChat';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif"
});

export const metadata = {
  title: "Irzzenproductions",
  description: "Photographe & vidéaste de mariage – réservation élégante"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-dvh bg-gradient-to-br from-[#fffaf7] via-[#f7fbf9] to-[#fafcff] text-ink selection:bg-[hsl(var(--a))]/50">
        {/* Ruban décoratif */}
        <div className="pointer-events-none fixed inset-x-0 -top-24 h-56 bg-[radial-gradient(60%_60%_at_50%_0%,#f7caa455,transparent_60%),radial-gradient(50%_50%_at_20%_0%,#98c9ae55,transparent_60%)] blur-2xl" />

        <header className="max-w-6xl mx-auto px-6 pt-10 pb-6">
          <div className="flex items-center justify-center">
            <a href="/" className="font-serif text-3xl md:text-4xl tracking-tight">
              Irzzenproductions
            </a>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-20">{children}</main>

        <footer className="border-t border-soft/60 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40">
          <div className="max-w-6xl mx-auto px-6 py-8 text-sm opacity-70 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Irzzenproductions – 15+ ans – Équipe de 12 pros</p>
            <p>Conditions : aucune annulation recevable · acompte non remboursable · livraison ≤ 6 mois</p>
          </div>
        </footer>
        
        {/* Crisp Chat - Chargé globalement */}
        <CrispChat />
      </body>
    </html>
  );
}