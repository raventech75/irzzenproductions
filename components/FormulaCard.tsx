// components/FormulaCard.tsx
"use client";

import type { FormulaDetailed } from "@/lib/modules";
import { eur } from "@/lib/modules";

type Props = {
  formula: FormulaDetailed;
  selected: boolean;
  onSelect: () => void;
};

export default function FormulaCard({ formula, selected, onSelect }: Props) {
  return (
    <label
      className={[
        "rounded-2xl border px-5 py-4 cursor-pointer transition block bg-white",
        selected ? "border-orange-500 ring-1 ring-orange-200" : "hover:bg-orange-50/40",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-lg">{formula.name}</div>
          <div className="opacity-70 text-sm">{formula.description}</div>
          <div className="mt-1 text-orange-700 font-medium">{eur(formula.price)}</div>
        </div>
        <input
          type="radio"
          name="formula"
          checked={selected}
          onChange={onSelect}
          className="mt-1 w-5 h-5"
        />
      </div>

      {formula.features && formula.features.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm opacity-90">
          {formula.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-[7px] inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}
    </label>
  );
}