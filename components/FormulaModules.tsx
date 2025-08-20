"use client";

import React from "react";
import type { FormulaDetailed } from "@/lib/modules";

// pastille minimaliste
const Dot = () => <span className="mt-[7px] inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />;

export function SelectedFormulaDetails({ formula }: { formula: FormulaDetailed }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white/70 p-5">
      <div className="font-medium">{formula.label}</div>
      <ul className="mt-3 space-y-1.5">
        {formula.features.map((text, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Dot />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}