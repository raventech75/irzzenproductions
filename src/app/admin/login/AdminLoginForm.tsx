"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError, data } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !data.user) {
      setError("Identifiants incorrects.");
      setLoading(false);
      return;
    }

    // Vérifier que c'est bien un admin
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", data.user.id)
      .single();

    if (!admin) {
      await supabase.auth.signOut();
      setError("Accès refusé. Compte non administrateur.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-8 space-y-5">
      <h2 className="text-lg font-bold text-[#FAFAFA]" style={{ fontFamily: "var(--font-playfair)" }}>
        Connexion administrateur
      </h2>

      {error && (
        <div className="px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-[#C9A84C]/60 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-[#111111] border border-[#C9A84C]/20 text-[#FAFAFA] text-sm px-4 py-3 placeholder-[#FAFAFA]/20 focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-[#C9A84C]/60 mb-2">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-[#111111] border border-[#C9A84C]/20 text-[#FAFAFA] text-sm px-4 py-3 placeholder-[#FAFAFA]/20 focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#E8C96A] transition-colors disabled:opacity-60"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
        ) : (
          <><LogIn size={14} /> Accéder</>
        )}
      </button>
    </form>
  );
}
