"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut"
      className={[
        "fixed bottom-6 right-6 z-30 w-10 h-10 card border border-[var(--c-border)] flex items-center justify-center text-[var(--c-muted)] hover:text-[var(--c-text)] hover:border-[var(--c-rose)] transition-all duration-300",
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none",
      ].join(" ")}
    >
      <ChevronUp size={16} />
    </button>
  );
}
