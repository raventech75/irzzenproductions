import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Espace Client — Connexion",
  description: "Accédez à votre espace privé pour télécharger vos photos et vidéos de mariage.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      {/* Halo doré */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9A84C]/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl font-bold tracking-widest uppercase text-gradient-gold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Irzzen
          </h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A84C]/50 mt-1">
            Espace Client
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-xs text-[#FAFAFA]/20 mt-8">
          Vous n&apos;avez pas encore reçu vos accès ?{" "}
          <a href="mailto:contact@irzzenproductions.fr" className="text-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors underline">
            Contactez-nous
          </a>
        </p>
      </div>
    </div>
  );
}
