// app/formules/page.tsx
"use client";

import { useState } from "react";
import { FORMULAS_DETAILED } from "@/lib/modules";
import { FormulaCard, OptionsList } from "@/components/FormulaModules";

export default function Formules() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="uppercase tracking-[.2em] text-xs text-gray-500">
          Photographie & Vidéo de mariage
        </p>
        <h1 className="font-serif text-4xl md:text-5xl">Nos formules</h1>
        <p className="text-gray-600">
          Des collections <span className="text-orange-600 font-medium">pastel orange</span>, sans surprise.
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        {FORMULAS_DETAILED.map(f => (
          <FormulaCard
            key={f.id}
            formula={f}
            selected={selected === f.id}
            onSelect={() => setSelected(f.id)}
          />
        ))}
      </section>

      <OptionsList />

      <p className="text-sm text-gray-500">
        Acompte conseillé : 15% arrondi à la centaine supérieure (facultatif). Reste à payer le jour J.
      </p>
    </div>
  );
}