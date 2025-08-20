"use client";

import React, { useMemo } from "react";
import { FORMULAS_DETAILED } from "@/lib/modules";

// Check minimaliste inline (pas de dépendance icônes)
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function FormulaCompareTable() {
  // On agrège toutes les features de toutes les formules, en liste unique triée
  const allFeatures = useMemo(() => {
    const set = new Set<string>();
    for (const f of FORMULAS_DETAILED) for (const feat of f.features) set.add(feat);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
  }, []);

  return (
    <div className="overflow-x-auto rounded-2xl border border-orange-100 bg-white/70">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-orange-50/60">
            <th className="px-4 py-3 text-left">Éléments inclus</th>
            {FORMULAS_DETAILED.map((f) => (
              <th key={f.id} className="px-4 py-3 text-left">{f.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allFeatures.map((feat) => (
            <tr key={feat} className="border-t align-top">
              <td className="px-4 py-3 w-[280px]">{feat}</td>
              {FORMULAS_DETAILED.map((f) => {
                const present = f.features.includes(feat);
                return (
                  <td key={f.id} className="px-4 py-3">
                    {present ? (
                      <div className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-2 py-1 text-orange-700">
                        <CheckIcon className="w-4 h-4" />
                        <span className="text-xs">Inclus</span>
                      </div>
                    ) : (
                      <span className="text-xs opacity-50">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}