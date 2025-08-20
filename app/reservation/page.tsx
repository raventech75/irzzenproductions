"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { FORMULAS_DETAILED } from "@/lib/modules";
import { OPTIONS, euros } from "@/lib/products";
import { computePricing } from "@/lib/pricing";
import { Button, Card, Money, SecondaryButton, Stepper } from "@/components/ui";
import FormulaCard from "@/components/FormulaCard"; // <- default export

export default function Reservation() {
  const router = useRouter();
  const [step] = useState<1>(1);

  const [formulaId, setFormulaId] = useState<string>(FORMULAS_DETAILED[0].id);
  const currentFormula = FORMULAS_DETAILED.find((f) => f.id === formulaId)!;

  const [selected, setSelected] = useState<string[]>([]);
  const [extras, setExtras] = useState<{ label: string; price: number }[]>([]);
  const [extraLabel, setExtraLabel] = useState("");
  const [extraPrice, setExtraPrice] = useState<number | "">("");

  const base = useMemo(() => currentFormula.price, [formulaId]);
  const optionPrices = useMemo(
    () => [
      ...OPTIONS.filter((o) => selected.includes(o.id)).map((o) => o.price),
      ...extras.map((e) => e.price),
    ],
    [selected, extras]
  );
  const totals = computePricing(base, optionPrices);

  const toggleOption = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const addExtra = () => {
    const price = typeof extraPrice === "string" ? 0 : extraPrice;
    if (!extraLabel || !price || price <= 0) return;
    setExtras((prev) => [...prev, { label: extraLabel.trim(), price }]);
    setExtraLabel("");
    setExtraPrice("");
  };

  const next = () => {
    const payload = { formulaId, options: selected, extras, pricing: totals };
    sessionStorage.setItem("bookingConfig", JSON.stringify(payload));
    router.push("/questionnaire");
  };

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-4xl">Votre configuration</h1>
          <Stepper step={step} />
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-5">Sélectionnez une formule</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FORMULAS_DETAILED.map((f) => (
              <FormulaCard
                key={f.id}
                formula={f}
                selected={formulaId === f.id}
                onSelect={() => setFormulaId(f.id)}
              />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-5">Options</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {OPTIONS.map((o) => (
              <label
                key={o.id}
                className={`rounded-2xl border px-5 py-4 flex items-center justify-between cursor-pointer transition ${
                  selected.includes(o.id) ? "border-orange-500 bg-orange-50" : "hover:bg-white"
                }`}
              >
                <div>
                  <div className="font-medium">{o.label}</div>
                  <div className="text-sm opacity-70">
                    <Money value={o.price} />
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selected.includes(o.id)}
                  onChange={() => toggleOption(o.id)}
                  className="w-5 h-5"
                />
              </label>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <div className="font-medium">Ajouter un extra personnalisé</div>
            <div className="grid md:grid-cols-[1fr_160px_140px] gap-2">
              <input
                className="border rounded-2xl px-3 py-2"
                placeholder="Intitulé (ex. heure sup., déplacement…)"
                value={extraLabel}
                onChange={(e) => setExtraLabel(e.target.value)}
              />
              <input
                className="border rounded-2xl px-3 py-2"
                type="number"
                min={1}
                placeholder="Prix (€)"
                value={extraPrice}
                onChange={(e) => setExtraPrice(e.target.value === "" ? "" : Number(e.target.value))}
              />
              <SecondaryButton onClick={addExtra}>Ajouter</SecondaryButton>
            </div>
            {extras.length > 0 && (
              <ul className="text-sm opacity-80 list-disc pl-5">
                {extras.map((x, i) => (
                  <li key={i}>
                    {x.label} — {euros(x.price)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      <div className="lg:sticky lg:top-20 h-max">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">Récapitulatif</h3>
          <div className="space-y-2 text-[15px]">
            <div className="flex justify-between">
              <span>Total estimé</span>
              <b>
                <Money value={totals.total} />
              </b>
            </div>
            <div className="flex justify-between">
              <span>Acompte conseillé</span>
              <b>
                <Money value={totals.depositSuggested} />
              </b>
            </div>
            <div className="flex justify-between">
              <span>Reste à payer le jour J</span>
              <b>
                <Money value={totals.remainingDayJ} />
              </b>
            </div>
          </div>
          <p className="text-xs opacity-70 mt-3">
            L’acompte (15% arrondi à la centaine sup.) n’est pas obligatoire.
          </p>
          <button onClick={next} className="w-full mt-5 rounded-xl bg-orange-500 px-4 py-2 text-white hover:bg-orange-400 transition">
            Continuer
          </button>
        </Card>
      </div>
    </div>
  );
}