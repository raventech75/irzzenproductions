// app/reservation/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { FORMULAS_DETAILED, type FormulaDetailed } from "@/lib/modules";
import { OPTIONS, euros, getOptionsByCategory, getPopularOptions, CATEGORY_LABELS } from "@/lib/products";
import { computePricing } from "@/lib/pricing";
import { Button, Card, Money, SecondaryButton } from "@/components/ui";
// Nous n'utilisons plus FormulaCard car nous avons intégré le design directement

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

  shootingLocation: string;
  shootingTime: string;

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

  shootingLocation: "",
  shootingTime: "",

  receptionLocation: "",
  receptionTime: "",

  schedule: "",
  specialRequests: "",
};

export default function Reservation() {
  const router = useRouter();

  // ——————————— Sélection formule / options ———————————
  const [formulaId, setFormulaId] = useState<string>(FORMULAS_DETAILED[0].id);
  const currentFormula: FormulaDetailed = FORMULAS_DETAILED.find((f) => f.id === formulaId) || {
    id: "custom",
    name: "Devis personnalisé",
    price: 0,
    description: "Montant personnalisé",
    features: []
  };

  const [selected, setSelected] = useState<string[]>([]);
  const [extras, setExtras] = useState<{ label: string; price: number }[]>([]);
  const [extraLabel, setExtraLabel] = useState("");
  const [extraPrice, setExtraPrice] = useState<number | "">("");
  
  // Devis personnalisé
  const [customPrice, setCustomPrice] = useState<number | "">("");
  
  // Affichage des options par catégorie
  const [activeCategory, setActiveCategory] = useState<string>("popular");

  const base = useMemo(() => {
    // Si c'est un devis personnalisé, utiliser le prix saisi par le client
    if (formulaId === "custom") {
      return typeof customPrice === "number" ? customPrice : 0;
    }
    return currentFormula.price;
  }, [formulaId, currentFormula.price, customPrice]);
  
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

  const removeExtra = (index: number) => {
    setExtras((prev) => prev.filter((_, i) => i !== index));
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
            customPrice: formulaId === "custom" ? (typeof customPrice === "number" ? customPrice : 0) : undefined,
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

  const optionsByCategory = getOptionsByCategory();
  const popularOptions = getPopularOptions();

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
        <h1 className="font-serif text-4xl">Configurez votre prestation</h1>
      </div>

      {/* ——— Questionnaire (facultatif) ——— */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">Informations du mariage (facultatif)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Prénom de la mariée"
            value={q.brideFirstName}
            onChange={(e) => onQ("brideFirstName", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Nom de la mariée"
            value={q.brideLastName}
            onChange={(e) => onQ("brideLastName", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Prénom du marié"
            value={q.groomFirstName}
            onChange={(e) => onQ("groomFirstName", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Nom du marié"
            value={q.groomLastName}
            onChange={(e) => onQ("groomLastName", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            type="email"
            placeholder="Email de contact"
            value={q.email}
            onChange={(e) => onQ("email", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            type="tel"
            placeholder="Téléphone"
            value={q.phone}
            onChange={(e) => onQ("phone", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Adresse postale"
            value={q.address}
            onChange={(e) => onQ("address", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Code postal"
            value={q.postalCode}
            onChange={(e) => onQ("postalCode", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Ville"
            value={q.city}
            onChange={(e) => onQ("city", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Pays"
            value={q.country}
            onChange={(e) => onQ("country", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            type="date"
            placeholder="Date du mariage"
            value={q.weddingDate}
            onChange={(e) => onQ("weddingDate", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
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
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Lieu préparatifs"
            value={q.prepLocation}
            onChange={(e) => onQ("prepLocation", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            type="time"
            placeholder="Heure préparatifs"
            value={q.prepTime}
            onChange={(e) => onQ("prepTime", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Adresse mairie"
            value={q.mairieLocation}
            onChange={(e) => onQ("mairieLocation", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            type="time"
            placeholder="Heure mairie"
            value={q.mairieTime}
            onChange={(e) => onQ("mairieTime", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Lieu cérémonie (église/laïque)"
            value={q.ceremonyLocation}
            onChange={(e) => onQ("ceremonyLocation", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            type="time"
            placeholder="Heure cérémonie"
            value={q.ceremonyTime}
            onChange={(e) => onQ("ceremonyTime", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Lieu du shooting"
            value={q.shootingLocation}
            onChange={(e) => onQ("shootingLocation", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            type="time"
            placeholder="Heure shooting"
            value={q.shootingTime}
            onChange={(e) => onQ("shootingTime", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            placeholder="Lieu cocktail / soirée"
            value={q.receptionLocation}
            onChange={(e) => onQ("receptionLocation", e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            type="time"
            placeholder="Heure début réception"
            value={q.receptionTime}
            onChange={(e) => onQ("receptionTime", e.target.value)}
          />
        </div>

        <textarea
          className="border rounded-xl px-3 py-2 w-full mt-4 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
          placeholder="Déroulement de la journée (horaires, moments clés...)"
          rows={4}
          value={q.schedule}
          onChange={(e) => onQ("schedule", e.target.value)}
        />

        <textarea
          className="border rounded-xl px-3 py-2 w-full mt-3 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
          placeholder="Demandes particulières (style, préférences, surprises...)"
          rows={4}
          value={q.specialRequests}
          onChange={(e) => onQ("specialRequests", e.target.value)}
        />
      </Card>

      {/* ——— Sélection des formules ——— */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-2">Choisissez votre formule</h2>
        <p className="text-gray-600 mb-6">Sélectionnez la formule qui correspond le mieux à vos besoins et votre budget</p>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {FORMULAS_DETAILED.map((f) => (
            <div
              key={f.id}
              className={`rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                formulaId === f.id 
                  ? "border-orange-500 bg-orange-50 shadow-lg transform scale-[1.02]" 
                  : "border-gray-200 hover:border-orange-300 hover:bg-orange-25"
              }`}
              onClick={() => setFormulaId(f.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2">{f.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{f.description}</p>
                  
                  {/* Informations clés */}
                  <div className="grid grid-cols-1 gap-2 mb-4 text-sm">
                    {f.duration && (
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600">⏱️</span>
                        <span className="font-medium">Durée:</span>
                        <span className="text-gray-600">{f.duration}</span>
                      </div>
                    )}
                    {f.deliverables && (
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600">📦</span>
                        <span className="font-medium">Livrables:</span>
                        <span className="text-gray-600">{f.deliverables}</span>
                      </div>
                    )}
                    {f.deliveryTime && (
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600">🚚</span>
                        <span className="font-medium">Livraison:</span>
                        <span className="text-gray-600">{f.deliveryTime}</span>
                      </div>
                    )}
                  </div>
                  
                  {f.idealFor && (
                    <div className="bg-white/60 rounded-lg p-3 mb-4 border border-orange-200">
                      <span className="text-sm font-medium text-orange-800">💡 Idéal pour:</span>
                      <p className="text-sm text-orange-700 mt-1">{f.idealFor}</p>
                    </div>
                  )}
                </div>
                
                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {euros(f.price)}
                  </div>
                  <input
                    type="radio"
                    checked={formulaId === f.id}
                    onChange={() => setFormulaId(f.id)}
                    className="w-5 h-5 text-orange-600"
                  />
                </div>
              </div>

              {/* Points forts */}
              {f.highlights && f.highlights.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">✨ Points forts:</div>
                  <div className="flex flex-wrap gap-2">
                    {f.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features détaillées */}
              {f.features && f.features.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700 mb-2">📋 Inclus dans cette formule:</div>
                  <div className="space-y-1">
                    {f.features.map((feature, idx) => (
                      <div key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Devis personnalisé */}
          <div
            className={`rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 ${
              formulaId === "custom" 
                ? "border-orange-500 bg-orange-50 shadow-lg transform scale-[1.02]" 
                : "border-gray-200 hover:border-orange-300"
            }`}
            onClick={() => setFormulaId("custom")}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">💼 Devis personnalisé</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Vous avez déjà reçu un devis sur mesure ? Saisissez le montant convenu.
                </p>
              </div>
              <input
                type="radio"
                checked={formulaId === "custom"}
                onChange={() => setFormulaId("custom")}
                className="w-5 h-5 text-orange-600 mt-2"
              />
            </div>
            
            {formulaId === "custom" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant de votre devis personnalisé
                </label>
                <div className="relative">
                  <input
                    className="border rounded-xl px-3 py-3 w-full text-lg font-semibold focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    type="number"
                    min={0}
                    placeholder="1500"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="absolute right-3 top-3 text-gray-500 font-medium">€</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ——— Options & extras améliorées ——— */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold mb-1">Personnalisez votre prestation</h2>
            <p className="text-gray-600">Ajoutez des options pour enrichir votre expérience</p>
          </div>
        </div>

        {/* Onglets de catégories */}
        <div className="flex flex-wrap gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveCategory("popular")}
            className={`px-4 py-2 rounded-t-lg font-medium transition ${
              activeCategory === "popular"
                ? "bg-orange-100 text-orange-700 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            ⭐ Populaires
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-4 py-2 rounded-t-lg font-medium transition ${
                activeCategory === key
                  ? "bg-orange-100 text-orange-700 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Options selon la catégorie active */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeCategory === "popular" 
            ? popularOptions 
            : optionsByCategory[activeCategory as keyof typeof optionsByCategory] || []
          ).map((option) => (
            <label
              key={option.id}
              className={`rounded-2xl border-2 px-5 py-4 flex flex-col cursor-pointer transition-all duration-200 ${
                selected.includes(option.id) 
                  ? "border-orange-500 bg-orange-50 shadow-md" 
                  : "border-gray-200 hover:border-orange-300 hover:bg-orange-25"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-semibold text-gray-800">{option.label}</span>
                    {option.popular && (
                      <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full">
                        Populaire
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{option.description}</div>
                  <div className="font-bold text-orange-600">
                    <Money value={option.price} />
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selected.includes(option.id)}
                  onChange={() => toggleOption(option.id)}
                  className="w-5 h-5 text-orange-600 rounded mt-1"
                />
              </div>
            </label>
          ))}
        </div>

        {/* Extras personnalisés */}
        <div className="mt-8 border-t pt-6">
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">➕ Ajouter un extra sur mesure</h3>
            <p className="text-sm text-gray-600">
              Besoin de quelque chose de spécifique ? Ajoutez vos propres options personnalisées.
            </p>
          </div>
          
          <div className="grid md:grid-cols-[1fr_160px_140px] gap-3 mb-4">
            <input
              className="border rounded-2xl px-4 py-3 focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              placeholder="Intitulé (ex: heure supplémentaire, déplacement spécial...)"
              value={extraLabel}
              onChange={(e) => setExtraLabel(e.target.value)}
            />
            <div className="relative">
              <input
                className="border rounded-2xl px-4 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                type="number"
                min={1}
                placeholder="Prix"
                value={extraPrice}
                onChange={(e) => setExtraPrice(e.target.value === "" ? "" : Number(e.target.value))}
              />
              <span className="absolute right-3 top-3 text-gray-500">€</span>
            </div>
            <SecondaryButton onClick={addExtra} className="h-12">
              Ajouter
            </SecondaryButton>
          </div>
          
          {extras.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Vos extras personnalisés:</h4>
              {extras.map((extra, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border">
                  <div className="flex items-center gap-3">
                    <span className="text-orange-600">🎯</span>
                    <span className="font-medium">{extra.label}</span>
                    <span className="text-gray-500">—</span>
                    <span className="font-bold text-orange-600">{euros(extra.price)}</span>
                  </div>
                  <button
                    onClick={() => removeExtra(i)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition-colors"
                    title="Supprimer cet extra"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* ——— Récap + CTA ——— */}
      <div className="lg:sticky lg:bottom-4 z-10">
        <Card className="p-4 bg-white shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Récapitulatif</h3>
            {(selected.length + extras.length) > 0 && (
              <div className="text-xs text-gray-500">
                {selected.length + extras.length} option{selected.length + extras.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
          
          {/* Résumé simplifié */}
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span>Total estimé</span>
              <span className="font-bold text-orange-600">
                <Money value={totals.total} />
              </span>
            </div>
            <div className="flex justify-between text-orange-700">
              <span>Acompte à régler</span>
              <span className="font-semibold">
                <Money value={totals.depositSuggested} />
              </span>
            </div>
            <div className="flex justify-between text-gray-500 text-xs">
              <span>Solde restant</span>
              <span><Money value={totals.remainingDayJ} /></span>
            </div>
          </div>
          
          <p className="text-xs text-gray-600 mb-4">
            Acompte de 15% requis pour confirmer votre réservation
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={goCheckout} 
              className="flex-1 py-3"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Redirection...
                </span>
              ) : (
                <span>Régler par carte</span>
              )}
            </Button>
            <a
              href="/rib"
              className="flex-1 text-center rounded-xl border border-orange-300 px-3 py-3 text-orange-700 hover:bg-orange-50 text-sm transition-colors"
            >
              Virement
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}