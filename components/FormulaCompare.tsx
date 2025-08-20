// components/FormulaCompare.tsx
"use client";

import React, { useMemo } from "react";
import { FORMULAS_DETAILED, type FormulaDetailed } from "@/lib/modules";

type Row = {
  feature: string;
  presence: Record<string, boolean>; // key = formula.id
};

function buildRows(formulas: FormulaDetailed[]): Row[] {
  const featuresSet = new Set<string>();
  for (const f of formulas) {
    for (const feat of f.features ?? []) {
      featuresSet.add(feat);
    }
  }
  const allFeatures = Array.from(featuresSet).sort((a, b) => a.localeCompare(b, "fr"));

  return allFeatures.map((feat) => {
    const presence: Record<string, boolean> = {};
    for (const f of formulas) {
      presence[f.id] = (f.features ?? []).includes(feat);
    }
    return { feature: feat, presence };
  });
}

export default function FormulaCompareTable() {
  const formulas = FORMULAS_DETAILED;
  const rows = useMemo(() => buildRows(formulas), [formulas]);

  return (
    <div className="w-full overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-orange-50 text-orange-900">
            <th className="text-left px-4 py-3">Caractéristiques</th>
            {formulas.map((f) => (
              <th key={f.id} className="text-left px-4 py-3">
                <div className="font-semibold">{f.name}</div>
                <div className="text-xs opacity-70">
                  {f.price.toLocaleString("fr-FR")} €
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.feature} className="border-t">
              <td className="px-4 py-3">{r.feature}</td>
              {formulas.map((f) => (
                <td key={f.id} className="px-4 py-3">
                  {r.presence[f.id] ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-orange-700">
                      <span aria-hidden>✅</span>
                      <span className="text-xs">Inclus</span>
                    </span>
                  ) : (
                    <span className="text-xs opacity-50">—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}