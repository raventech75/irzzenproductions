"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/client/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1A1520] mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
          Connexion
        </h2>
        <p className="text-xs text-[#1A1520]/40">
          Accédez à vos photos et vidéos de mariage
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#C4A5B5]/60 mb-2">
            Adresse email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="sophie.karim@email.com"
            className="w-full bg-[#FAFAF8] border border-[#C4A5B5]/20 text-[#1A1520] text-sm px-4 py-3 placeholder-[#F0EBE8]/20 focus:outline-none focus:border-[#C4A5B5]/60 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#C4A5B5]/60 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#FAFAF8] border border-[#C4A5B5]/20 text-[#1A1520] text-sm px-4 py-3 pr-12 placeholder-[#F0EBE8]/20 focus:outline-none focus:border-[#C4A5B5]/60 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1520]/30 hover:text-[#C4A5B5]/60 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 bg-[#C4A5B5] text-[#13111A] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#DEC8D6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed gold-glow"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-[#13111A]/30 border-t-[#13111A] rounded-full animate-spin" />
        ) : (
          <>
            Se connecter <LogIn size={14} />
          </>
        )}
      </button>

      <div className="text-center">
        <a
          href="/client/reset-password"
          className="text-xs text-[#1A1520]/30 hover:text-[#C4A5B5]/60 transition-colors"
        >
          Mot de passe oublié ?
        </a>
      </div>
    </form>
  );
}
