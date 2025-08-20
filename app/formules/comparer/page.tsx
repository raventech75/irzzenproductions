import React from "react";
import FormulaCompareTable from "@/components/FormulaCompare";

export default function Comparer() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl">Comparer les formules</h1>
        <p className="text-gray-600">Visualisez en un coup d’œil les différences.</p>
      </header>
      <FormulaCompareTable />
    </div>
  );
}