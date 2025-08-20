"use client";
import { useMemo, useState } from "react";
import { FORMULAS, OPTIONS, euros } from "@/lib/products";
import { computePricing } from "@/lib/pricing";
import { useRouter } from "next/navigation";
import { Button, Card, Money, SecondaryButton, Stepper } from "@/components/ui";

export default function Reservation() {
  const router = useRouter();
  const [step] = useState<1>(1);

  const [formulaId, setFormulaId] = useState(FORMULAS[0].id);
  const [selected, setSelected] = useState<string[]>([]);
  const [extras, setExtras] = useState<{ label: string; price: number }[]>([]);
  const [extraLabel, setExtraLabel] = useState("");
  const [extraPrice, setExtraPrice] = useState<number | "">("");

  const base = useMemo(() => FORMULAS.find(f => f.id === formulaId)!.price, [formulaId]);
  const optionPrices = useMemo(() => [
    ...OPTIONS.filter(o => selected.includes(o.id)).map(o => o.price),
    ...extras.map(e => e.price)
  ], [selected, extras]);

  const totals = computePricing(base, optionPrices);

  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const addExtra = () => {
    const price = typeof extraPrice === "string" ? 0 : extraPrice;
    if (!extraLabel || !price || price <= 0) return;
    setExtras(prev => [...prev, { label: extraLabel.trim(), price }]);
    setExtraLabel(""); setExtraPrice("");
  };

  const next = () => {
    const payload = { formulaId, options: selected, extras, pricing: totals };
    sessionStorage.setItem("bookingConfig", JSON.stringify(payload));
    router.push("/questionnaire");
  };

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Votre configuration</h1>
          <Stepper step={step} />
        </div>

        {/* Formules */}
        <Card className="p-5">
          <h2 className="text-xl font-semibold mb-4">Sélectionnez une formule</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FORMULAS.map(f => (
              <label key={f.id} className={`rounded-2xl border px-4 py-3 cursor-pointer transition ${formulaId===f.id?"border-[hsl(var(--p))] bg-soft":"hover:bg-soft"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{f.label}</div>
                    <div className="opacity-70"><Money value={f.price} /></div>
                  </div>
                  <input type="radio" name="formula" checked={formulaId===f.id} onChange={()=>setFormulaId(f.id)} className="w-5 h-5"/>
                </div>
                <p className="text-sm opacity-70 mt-2">Couverture journée, montage complet, remise numérique.</p>
              </label>
            ))}
          </div>
        </Card>

        {/* Options */}
        <Card className="p-5">
          <h2 className="text-xl font-semibold mb-4">Options</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {OPTIONS.map(o => (
              <label key={o.id} className={`rounded-2xl border px-4 py-3 flex items-center justify-between cursor-pointer transition ${selected.includes(o.id)?"border-[hsl(var(--p))] bg-soft":"hover:bg-soft"}`}>
                <div>
                  <div className="font-medium">{o.label}</div>
                  <div className="text-sm opacity-70"><Money value={o.price} /></div>
                </div>
                <input type="checkbox" checked={selected.includes(o.id)} onChange={()=>toggle(o.id)} className="w-5 h-5"/>
              </label>
            ))}
          </div>

          {/* Extra perso */}
          <div className="mt-5 space-y-2">
            <div className="font-medium">Ajouter un extra personnalisé</div>
            <div className="grid md:grid-cols-[1fr_160px_120px] gap-2">
              <input className="border rounded-xl px-3 py-2" placeholder="Intitulé (ex. heure sup., déplacement…)" value={extraLabel} onChange={e=>setExtraLabel(e.target.value)} />
              <input className="border rounded-xl px-3 py-2" type="number" min={1} placeholder="Prix (€)" value={extraPrice} onChange={e=>setExtraPrice(e.target.value===""?"":Number(e.target.value))} />
              <SecondaryButton onClick={addExtra}>Ajouter</SecondaryButton>
            </div>
            {extras.length>0 && (
              <ul className="text-sm opacity-80 list-disc pl-5">
                {extras.map((x,i)=>(<li key={i}>{x.label} — {euros(x.price)}</li>))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      {/* Résumé sticky */}
      <div className="lg:sticky lg:top-20 h-max">
        <Card className="p-5">
          <h3 className="text-lg font-semibold mb-3">Résumé</h3>
          <div className="space-y-1">
            <div className="flex justify-between"><span>Total estimé</span><b><Money value={totals.total} /></b></div>
            <div className="flex justify-between"><span>Acompte conseillé</span><b><Money value={totals.depositSuggested} /></b></div>
            <div className="flex justify-between"><span>Reste à payer le jour J</span><b><Money value={totals.remainingDayJ} /></b></div>
          </div>
          <p className="text-xs opacity-70 mt-2">L’acompte (15% arrondi à la centaine sup.) n’est pas obligatoire.</p>
          <Button onClick={next} className="w-full mt-4">Continuer</Button>
        </Card>
      </div>
    </div>
  );
}
