// app/reservation/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { FORMULAS_DETAILED, type FormulaDetailed } from "@/lib/modules";
import { OPTIONS, euros } from "@/lib/products";
import { computePricing } from "@/lib/pricing";
import { Button, Card, Money, SecondaryButton } from "@/components/ui";
import FormulaCard from "@/components/FormulaCard";

/** Questionnaire : tout FACULTATIF */
type Questionnaire = {
  brideFirstName: string;
  brideLastName: string;
  groomFirstName: string;
  groomLastName: string;

  email: string;
  phone: string;

  address: string;
  postalCode: string;
  city: string;
  country: string;

  weddingDate: string; // yyyy-mm-dd
  guests: string;

  prepLocation: string;
  prepTime: string;

  mairieLocation: string;
  mairieTime: string;

  ceremonyLocation: string;
  ceremonyTime: string;

  receptionLocation: string;
  receptionTime: string;

  schedule: string;
  specialRequests: string;
};

const initialQ: Questionnaire = {
  brideFirstName: "",
  brideLastName: "",
  groomFirstName: "",
  groomLastName: "",

  email: "",
  phone: "",

  address: "",
  postalCode: "",
  city: "",
  country: "",

  weddingDate: "",
  guests: "",

  prepLocation: "",
  prepTime: "",

  mairieLocation: "",
  mairieTime: "",

  ceremonyLocation: "",
  ceremonyTime: "",

  receptionLocation: "",
  receptionTime: "",

  schedule: "",
  specialRequests: "",
};

export default function Reservation() {
  const router = useRouter();

  // ——————————— Sélection formule / options ———————————
  const [formulaId, setFormulaId] = useState<string>(FORMULAS_DETAILED[0].id);
  const currentFormula: FormulaDetailed = FORMULAS_DETAILED.find((f) => f.id === formulaId)!;

  const [selected, setSelected] = useState<string[]>([]);
  const [extras, setExtras] = useState<{ label: string; price: number }[]>([]);
  const [extraLabel, setExtraLabel] = useState("");
  const [extraPrice, setExtraPrice] = useState<number | "">("");

  const base = useMemo(() => currentFormula.price, [currentFormula.price]);
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

  // ——————————— Questionnaire (facultatif) ———————————
  const [q, setQ] = useState<Questionnaire>(initialQ);
  const onQ = (k: keyof Questionnaire, v: string) => setQ((prev) => ({ ...prev, [k]: v }));

  // ——————————— Aller au paiement DIRECT ———————————
  const [loading, setLoading] = useState(false);

  const goCheckout = async () => {
    setLoading(true);
    
    try {
      // 🔍 Debug complet : voir tous les calculs
      console.log("💰 Prix de base (formule):", base);
      console.log("💸 Prix des options:", optionPrices);
      console.log("🧮 Totals calculés:", totals);
      console.log("💳 Acompte qui sera facturé:", totals.depositSuggested);
      console.log("📋 Options sélectionnées (IDs):", selected);
      console.log("🎯 Extras ajoutés:", extras);

      // 🔍 Debug : voir exactement ce qui est envoyé
      console.log("💾 Données du questionnaire:", q);
      console.log("📋 Formule sélectionnée:", currentFormula);

      // 🎯 Appel direct à l'API pour créer la session Stripe
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Customer info (minimal pour Stripe)
          customer: {
            email: q.email || "",
            firstName: q.brideFirstName || "",
            lastName: q.brideLastName || "",
            coupleName: `${q.brideFirstName} & ${q.groomFirstName}`.trim(),
            weddingDate: q.weddingDate || "",
          },
          // Toutes les données du questionnaire détaillé
          questionnaire: q,
          // Configuration de la prestation
          config: {
            formulaId,
            options: selected,
            extras,
          },
          // Force le paiement par carte
          payWith: "card"
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Erreur ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.url) {
        throw new Error("URL de paiement Stripe non reçue");
      }

      // 🚀 Redirection directe vers Stripe
      console.log("🎉 Redirection vers Stripe:", data.url);
      window.location.href = data.url;

    } catch (error: any) {
      console.error("❌ Erreur lors de la création du paiement:", error);
      alert(`Erreur: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Barre d'actions */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <a
            href="/rib"
            className="rounded-xl border border-orange-300 px-3 py-2 text-orange-700 hover:bg-orange-50"
          >
            RIB / Virement
          </a>
        </div>
      </div>

      {/* Titre */}
      <div className="flex items-center justify-center">
        <h1 className="font-serif text-4xl">Votre configuration</h1>
      </div>

      {/* ——— Questionnaire (facultatif) ——— */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">Informations du mariage (facultatif)</h2>
          <span className="text-xs text-gray-500">Aucun champ n'est obligatoire</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Prénom de la mariée"
            value={q.brideFirstName}
            onChange={(e) => onQ("brideFirstName", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Nom de la mariée"
            value={q.brideLastName}
            onChange={(e) => onQ("brideLastName", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Prénom du marié"
            value={q.groomFirstName}
            onChange={(e) => onQ("groomFirstName", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Nom du marié"
            value={q.groomLastName}
            onChange={(e) => onQ("groomLastName", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2"
            type="email"
            placeholder="Email de contact"
            value={q.email}
            onChange={(e) => onQ("email", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            type="tel"
            placeholder="Téléphone"
            value={q.phone}
            onChange={(e) => onQ("phone", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Adresse postale"
            value={q.address}
            onChange={(e) => onQ("address", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Code postal"
            value={q.postalCode}
            onChange={(e) => onQ("postalCode", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Ville"
            value={q.city}
            onChange={(e) => onQ("city", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Pays"
            value={q.country}
            onChange={(e) => onQ("country", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2"
            type="date"
            placeholder="Date du mariage"
            value={q.weddingDate}
            onChange={(e) => onQ("weddingDate", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            type="number"
            min={0}
            placeholder="Nombre d'invités"
            value={q.guests}
            onChange={(e) => onQ("guests", e.target.value)}
          />
        </div>

        {/* Lieux & horaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Lieu préparatifs"
            value={q.prepLocation}
            onChange={(e) => onQ("prepLocation", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            type="time"
            placeholder="Heure préparatifs"
            value={q.prepTime}
            onChange={(e) => onQ("prepTime", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Adresse mairie"
            value={q.mairieLocation}
            onChange={(e) => onQ("mairieLocation", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            type="time"
            placeholder="Heure mairie"
            value={q.mairieTime}
            onChange={(e) => onQ("mairieTime", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Lieu cérémonie (église/laïque)"
            value={q.ceremonyLocation}
            onChange={(e) => onQ("ceremonyLocation", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            type="time"
            placeholder="Heure cérémonie"
            value={q.ceremonyTime}
            onChange={(e) => onQ("ceremonyTime", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Lieu cocktail / soirée"
            value={q.receptionLocation}
            onChange={(e) => onQ("receptionLocation", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            type="time"
            placeholder="Heure début réception"
            value={q.receptionTime}
            onChange={(e) => onQ("receptionTime", e.target.value)}
          />
        </div>

        <textarea
          className="border rounded-xl px-3 py-2 w-full mt-4"
          placeholder="Déroulement de la journée (horaires, moments clés...)"
          rows={4}
          value={q.schedule}
          onChange={(e) => onQ("schedule", e.target.value)}
        />

        <textarea
          className="border rounded-xl px-3 py-2 w-full mt-3"
          placeholder="Demandes particulières (style, préférences, surprises...)"
          rows={4}
          value={q.specialRequests}
          onChange={(e) => onQ("specialRequests", e.target.value)}
        />
      </Card>

      {/* ——— Sélection des formules ——— */}
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

      {/* ——— Options & extras ——— */}
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

        {/* Extras personnalisés */}
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

      {/* ——— Récap + CTA ——— */}
      <div className="lg:sticky lg:bottom-4 z-10">
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
            L'acompte (15% arrondi à la centaine sup.) n'est pas obligatoire.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button 
              onClick={goCheckout} 
              className="flex-1 min-w-[220px]"
              disabled={loading}
            >
              {loading ? "Redirection vers Stripe..." : "Aller au paiement CB"}
            </Button>
            <a
              href="/rib"
              className="flex-1 min-w-[160px] text-center rounded-xl border border-orange-300 px-4 py-2 text-orange-700 hover:bg-orange-50"
            >
              Voir le RIB / Virement
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}