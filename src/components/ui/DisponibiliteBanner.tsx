"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, X } from "lucide-react";

export function DisponibiliteBanner() {
  const [date, setDate] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  if (dismissed) return null;

  const handleCheck = () => {
    if (date) {
      router.push(`/contact?date_mariage=${date}&source=banner`);
    } else {
      router.push("/contact");
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] max-w-xl">
      <div className="card rounded-sm shadow-lg border border-[var(--c-border)] px-5 py-4 flex items-center gap-4">
        <div className="w-8 h-8 rounded-full g-bar flex items-center justify-center flex-shrink-0">
          <Calendar size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] tracking-[0.25em] uppercase text-[var(--c-rose)] mb-1">Vérifiez votre date</p>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="flex-1 bg-transparent border-b border-[var(--c-border)] text-[13px] text-[var(--c-text)] py-1 focus:outline-none focus:border-[var(--c-orange)]"
            />
            <button onClick={handleCheck} className="btn-fill text-[10px] py-2 px-4 flex-shrink-0">
              Vérifier
            </button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-[var(--c-muted)] hover:text-[var(--c-text)] transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
