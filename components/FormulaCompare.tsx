"use client";

import React from "react";
import { FORMULAS_DETAILED, Specs, MODULE_RENDERERS } from "@/lib/modules";
import { ModuleBullet } from "./ModuleBullet";

// Icône check locale (évite tout souci de typage avec lucide/@types/react)
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function valueToText(key: keyof Specs, v: any): { present: boolean; text?: string } {
  if (v === undefined || v === null || v === false) return { present: false };
  switch (key) {
    case "cameramen":
      return { present: true, text: `${v} cam.` };
    case "albumImprime":
      return { present: true, text: v?.size ? `${v.size}${v.extras?.length ? " +" : ""}` : "Oui" };
    case "projectionEcran":
      return { present: true, text: v === "photos+videos" ? "Photos+Vidéos" : "Vidéos" };
    default:
      return { present: true };
  }
}

export function FormulaCompareTable() {
  const rows = MODULE_RENDERERS.sort((a, b) => a.order - b.order).map((m) => m.key);

  return (
    <div className="overflow-x-auto rounded-2xl border border-orange-100 bg-white/70">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-orange-50/60">
            <th className="px-4 py-3 text-left">Modules</th>
            {FORMULAS_DETAILED.map((f) => (
              <th key={f.id} className="px-4 py-3 text-left">
                {f.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((key) => (
            <tr key={String(key)} className="border-t align-top">
              <td className="px-4 py-3 w-[240px]">
                <ModuleBullet iconKey={String(key)}>
                  {
                    MODULE_RENDERERS.find((r) => r.key === key)?.render(
                      key === "cameramen" ? 2 :
                      key === "albumImprime" ? { size: "30x30" } :
                      key === "projectionEcran" ? "videos" : true
                    )
                  }
                </ModuleBullet>
              </td>
              {FORMULAS_DETAILED.map((f) => {
                const raw = (f.specs as any)[key];
                const parsed = valueToText(key as keyof Specs, raw);
                return (
                  <td key={f.id} className="px-4 py-3">
                    {parsed.present ? (
                      <div className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-2 py-1 text-orange-700">
                        <CheckIcon className="w-4 h-4" />
                        <span className="text-xs">{parsed.text}</span>
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

export default FormulaCompareTable;