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
      <h2 className="text-lg font-bold text-[#261E14]" style={{ fontFamily: "var(--font-playfair)" }}>
        Connexion administrateur
      </h2>

      {error && (
        <div className="px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-600 text-xs">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-[#E8A87C]/60 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-[#FAFAF8] border border-[#E8A87C]/20 text-[#261E14] text-sm px-4 py-3 placeholder-[#F0EBE8]/20 focus:outline-none focus:border-[#E8A87C]/60 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase text-[#E8A87C]/60 mb-2">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-[#FAFAF8] border border-[#E8A87C]/20 text-[#261E14] text-sm px-4 py-3 placeholder-[#F0EBE8]/20 focus:outline-none focus:border-[#E8A87C]/60 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#E8A87C] text-[#261E14] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#d4905e] transition-colors disabled:opacity-60"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-[#261E14]/30 border-t-[#261E14] rounded-full animate-spin" />
        ) : (
          <><LogIn size={14} /> Accéder</>
        )}
      </button>
    </form>
  );
}
