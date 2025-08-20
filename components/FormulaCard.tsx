"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Money } from "@/components/ui";
import type { FormulaDetailed } from "@/lib/modules";

type Props = {
  formula: FormulaDetailed;
  selected: boolean;
  onSelect: () => void;
};

export default function FormulaCard({ formula, selected, onSelect }: Props) {
  return (
    <motion.label
      layout
      onClick={onSelect}
      role="button"
      aria-pressed={selected}
      className={cn(
        "cursor-pointer rounded-2xl border px-5 py-4 transition flex flex-col gap-2",
        selected
          ? "border-orange-500 bg-orange-50 shadow-md"
          : "hover:border-orange-300 hover:bg-white"
      )}
      initial={{ opacity: 0.0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
    >
      <div className="flex items-center justify-between">
        <div className="font-semibold text-lg">{formula.label}</div>
        <input
          type="radio"
          name="formula"
          checked={selected}
          onChange={onSelect}
          className="w-5 h-5 accent-orange-500"
          aria-label={`Choisir ${formula.label}`}
        />
      </div>

      <div className="opacity-70 text-sm">
        <Money value={formula.price} />
      </div>

      {/* Liste des features */}
      <ul className="mt-2 space-y-1.5 text-sm opacity-90">
        {formula.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            {/* pastille minimaliste */}
            <span className="mt-[7px] inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </motion.label>
  );
}