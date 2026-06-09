import type { Metadata } from "next";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin — Connexion",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#070707] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-widest uppercase text-gradient-gold" style={{ fontFamily: "var(--font-playfair)" }}>
            Irzzen
          </h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#C4A5B5]/40 mt-1">Back-office</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
