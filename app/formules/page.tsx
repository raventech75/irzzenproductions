"use client";

import React from "react";
import { FORMULAS_DETAILED } from "@/lib/modules";
import { SelectedFormulaDetails } from "@/components/FormulaModules";

export default function FormulesPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl">Nos formules</h1>
        <p className="text-gray-600">Présentation claire, sans images — avec détails interactifs.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {FORMULAS_DETAILED.map((f) => (
          <SelectedFormulaDetails key={f.id} formula={f} />
        ))}
      </div>
    </div>
  );
}