"use client";

import { FormulaDef, OPTIONS_DETAILED, Specs, specsToBullets, euros } from "@/lib/modules";
import { ModuleBullet } from "./ModuleBullet";
import { MODULE_RENDERERS } from "@/lib/modules";
import { clsx } from "clsx";

function bulletsWithKeys(specs: Specs) {
  // renvoie [{key,label}]
  return MODULE_RENDERERS
    .sort((a, b) => a.order - b.order)
    .map((m) => ({ key: m.key, label: m.render(specs[m.key]) }))
    .filter((x) => Boolean(x.label)) as { key: keyof Specs; label: string }[];
}

export function FormulaCard({
  formula,
  selected,
  onSelect
}: {
  formula: FormulaDef;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const bullets = bulletsWithKeys(formula.specs);

  return (
    <div
      className={clsx(
        "rounded-3xl border bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70",
        "border-orange-100 shadow-[0_10px_30px_-12px_rgba(255,165,0,.25)]",
        selected ? "ring-2 ring-orange-400" : "hover:shadow-[0_16px_40px_-14px_rgba(255,165,0,.35)]",
        "transition"
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{formula.title}</h3>
            <p className="mt-1 text-sm text-gray-500">Pack IRZZEN</p>
          </div>
          <div className="shrink-0 rounded-xl bg-orange-50 px-3 py-1 text-orange-600 text-sm font-medium">
            {euros(formula.price)}
          </div>
        </div>

        <ul className="mt-4 space-y-1.5">
          {bullets.map((b) => (
            <ModuleBullet key={String(b.key)} iconKey={String(b.key)}>
              {b.label}
            </ModuleBullet>
          ))}
        </ul>

        {onSelect && (
          <div className="mt-5">
            <button
              onClick={onSelect}
              className={clsx(
                "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium",
                "bg-orange-500 text-white shadow hover:bg-orange-400 transition"
              )}
            >
              Choisir cette formule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function SelectedFormulaDetails({ formula }: { formula: FormulaDef }) {
  const items = bulletsWithKeys(formula.specs);
  return (
    <div className="rounded-2xl border border-orange-100 bg-white/70 p-5">
      <div className="flex items-center justify-between">
        <div className="font-medium">{formula.title}</div>
        <div className="text-orange-600 text-sm rounded-lg bg-orange-50 px-3 py-1">
          {euros(formula.price)}
        </div>
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((b) => (
          <ModuleBullet key={String(b.key)} iconKey={String(b.key)}>
            {b.label}
          </ModuleBullet>
        ))}
      </ul>
    </div>
  );
}

export function OptionsList() {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white/80 p-6 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <h4 className="text-lg font-semibold">Options à la carte</h4>
      <ul className="mt-3 space-y-2">
        {OPTIONS_DETAILED.map((o) => (
          <li key={o.id} className="flex items-center justify-between">
            <span>{o.label}</span>
            <span className="rounded-lg bg-orange-50 px-3 py-1 text-orange-600 text-sm font-medium">
              {euros(o.price)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}