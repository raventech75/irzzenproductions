// app/reservation/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { FORMULAS_DETAILED, type FormulaDetailed } from "@/lib/modules";
import { OPTIONS, euros, getOptionsByCategory, getPopularOptions, CATEGORY_LABELS } from "@/lib/products";
import { computePricing } from "@/lib/pricing";
import { Button, Card, Money, SecondaryButton } from "@/components/ui";
// import CrispChat from '@/components/CrispChat'; // Commenté temporairement

/** Questionnaire : tout FACULTATIF - avec champs supplémentaires */
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
  shootingLocation: string; // Nouveau champ
  shootingTime: string;     // Nouveau champ
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

// Données des formules avec icônes/émojis
const getFormulaIcon = (id: string) => {
  const icons: { [key: string]: string } = {
    essential: "💎",
    premium: "👑",
    luxury: "✨",
    custom: "🎯"
  };
  return icons[id] || "📷";
};

const getFormulaColor = (id: string) => {
  const colors: { [key: string]: { bg: string; border: string; text: string } } = {
    essential: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
    premium: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
    luxury: { bg: "bg-gold-50", border: "border-yellow-200", text: "text-yellow-700" },
    custom: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" }
  };
  return colors[id] || { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700" };
};

export default function Reservation() {
  const router = useRouter();

  // ––––––––––– Sélection formule / options –––––––––––
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
  const [customPrice, setCustomPrice] = useState<number | "">("");
  const [activeCategory, setActiveCategory] = useState<string>("popular");
  const [summaryCollapsed, setSummaryCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  // ––––––––––– Questionnaire –––––––––––
  const [q, setQ] = useState<Questionnaire>(initialQ);
  const onQ = (k: keyof Questionnaire, v: string) => setQ((prev) => ({ ...prev, [k]: v }));

  // Logique de calcul - GARDÉE IDENTIQUE
  const base = useMemo(() => {
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
  const optionsByCategory = getOptionsByCategory();
  const popularOptions = getPopularOptions();

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

  // Logique de paiement - GARDÉE IDENTIQUE (celle qui fonctionne)
  const goCheckout = async () => {
    setLoading(true);
    
    try {
      console.log("💰 Prix de base (formule):", base);
      console.log("💸 Prix des options:", optionPrices);
      console.log("🧮 Totals calculés:", totals);
      console.log("💳 Acompte qui sera facturé:", totals.depositSuggested);
      console.log("📋 Options sélectionnées (IDs):", selected);
      console.log("🎯 Extras ajoutés:", extras);

      console.log("💾 Données du questionnaire:", q);
      console.log("📋 Formule sélectionnée:", currentFormula);

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

      console.log("🎉 Redirection vers Stripe:", data.url);
      window.location.href = data.url;

    } catch (error: any) {
      console.error("⛔ Erreur lors de la création du paiement:", error);
      alert(`Erreur: ${error.message}`);
      setLoading(false);
    }
  };

  // Préparer les données pour Crisp Chat (temporairement désactivé)
  /*
  const crispUserData = {
    userEmail: q.email,
    userFirstName: q.brideFirstName,
    userLastName: q.brideLastName, 
    weddingDate: q.weddingDate,
    currentFormula: currentFormula.name,
    estimatedBudget: totals.total
  };
  */

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Barre d'actions avec gradient */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <a
            href="/rib"
            className="group relative overflow-hidden rounded-xl border border-orange-300 px-4 py-2 text-orange-700 hover:bg-orange-50 transition-all duration-300 flex items-center gap-2"
          >
            <span className="text-lg">🏦</span>
            <span className="font-medium">RIB / Virement</span>
          </a>
        </div>
      </div>

      {/* Titre avec style amélioré */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full px-6 py-2">
          <span className="text-2xl">💒</span>
          <span className="text-sm font-medium text-orange-700">Votre jour J parfait nous attend</span>
        </div>
        <h1 className="font-serif text-4xl lg:text-5xl bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Configurez votre prestation
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Créons ensemble des souvenirs inoubliables de votre mariage ✨
        </p>
      </div>

      {/* ––– Questionnaire avec icônes ––– */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        
        <div className="mb-6 relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📋</span>
            <h2 className="text-xl font-semibold">Informations du mariage</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Facultatif</span>
          </div>
          <p className="text-gray-600 text-sm">
            Ces informations nous aideront à mieux préparer votre séance et à vous accompagner le jour J
          </p>
        </div>

        {/* Section mariés */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">👰💒🤵</span>
            <span className="font-medium text-gray-700">Les futurs mariés</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400">👰</span>
              <input
                className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                placeholder="Prénom de la mariée"
                value={q.brideFirstName}
                onChange={(e) => onQ("brideFirstName", e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400">✨</span>
              <input
                className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                placeholder="Nom de la mariée"
                value={q.brideLastName}
                onChange={(e) => onQ("brideLastName", e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">🤵</span>
              <input
                className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                placeholder="Prénom du marié"
                value={q.groomFirstName}
                onChange={(e) => onQ("groomFirstName", e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">👔</span>
              <input
                className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                placeholder="Nom du marié"
                value={q.groomLastName}
                onChange={(e) => onQ("groomLastName", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section contact */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📞</span>
            <span className="font-medium text-gray-700">Coordonnées de contact</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400">✉️</span>
              <input
                className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                type="email"
                placeholder="Email de contact"
                value={q.email}
                onChange={(e) => onQ("email", e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400">📱</span>
              <input
                className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                type="tel"
                placeholder="Téléphone"
                value={q.phone}
                onChange={(e) => onQ("phone", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section adresse */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🏠</span>
            <span className="font-medium text-gray-700">Adresse postale</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative md:col-span-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">📍</span>
              <input
                className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                placeholder="Adresse postale"
                value={q.address}
                onChange={(e) => onQ("address", e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400">🏘️</span>
              <input
                className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                placeholder="Code postal"
                value={q.postalCode}
                onChange={(e) => onQ("postalCode", e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400">🏙️</span>
              <input
                className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                placeholder="Ville"
                value={q.city}
                onChange={(e) => onQ("city", e.target.value)}
              />
            </div>
            <div className="relative md:col-span-2">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400">🌍</span>
              <input
                className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                placeholder="Pays"
                value={q.country}
                onChange={(e) => onQ("country", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section détails mariage */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💖</span>
            <span className="font-medium text-gray-700">Détails du mariage</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400">📅</span>
              <input
                className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                type="date"
                placeholder="Date du mariage"
                value={q.weddingDate}
                onChange={(e) => onQ("weddingDate", e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400">👥</span>
              <input
                className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
                type="number"
                min={0}
                placeholder="Nombre d'invités"
                value={q.guests}
                onChange={(e) => onQ("guests", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section lieux et horaires */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📍</span>
            <span className="font-medium text-gray-700">Lieux et horaires de la journée</span>
          </div>
          
          {/* Préparatifs */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💅</span>
              <span className="font-medium text-blue-700">Préparatifs</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="border-blue-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                placeholder="Lieu préparatifs"
                value={q.prepLocation}
                onChange={(e) => onQ("prepLocation", e.target.value)}
              />
              <input
                className="border-blue-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                type="time"
                value={q.prepTime}
                onChange={(e) => onQ("prepTime", e.target.value)}
              />
            </div>
          </div>

          {/* Mairie */}
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🏛️</span>
              <span className="font-medium text-red-700">Mairie</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="border-red-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                placeholder="Adresse mairie"
                value={q.mairieLocation}
                onChange={(e) => onQ("mairieLocation", e.target.value)}
              />
              <input
                className="border-red-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-200 focus:border-red-400"
                type="time"
                value={q.mairieTime}
                onChange={(e) => onQ("mairieTime", e.target.value)}
              />
            </div>
          </div>

          {/* Cérémonie */}
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⛪</span>
              <span className="font-medium text-purple-700">Cérémonie religieuse/laïque</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="border-purple-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                placeholder="Lieu cérémonie (église/laïque)"
                value={q.ceremonyLocation}
                onChange={(e) => onQ("ceremonyLocation", e.target.value)}
              />
              <input
                className="border-purple-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                type="time"
                value={q.ceremonyTime}
                onChange={(e) => onQ("ceremonyTime", e.target.value)}
              />
            </div>
          </div>

          {/* Shooting */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📸</span>
              <span className="font-medium text-green-700">Séance photos</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="border-green-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-400"
                placeholder="Lieu du shooting"
                value={q.shootingLocation}
                onChange={(e) => onQ("shootingLocation", e.target.value)}
              />
              <input
                className="border-green-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-200 focus:border-green-400"
                type="time"
                value={q.shootingTime}
                onChange={(e) => onQ("shootingTime", e.target.value)}
              />
            </div>
          </div>

          {/* Réception */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🥂</span>
              <span className="font-medium text-yellow-700">Cocktail & Réception</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="border-yellow-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400"
                placeholder="Lieu cocktail / soirée"
                value={q.receptionLocation}
                onChange={(e) => onQ("receptionLocation", e.target.value)}
              />
              <input
                className="border-yellow-200 bg-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-yellow-200 focus:border-yellow-400"
                type="time"
                value={q.receptionTime}
                onChange={(e) => onQ("receptionTime", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Sections texte */}
        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📝</span>
              <span className="font-medium text-gray-700">Déroulement de la journée</span>
            </div>
            <textarea
              className="border rounded-xl px-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
              placeholder="Décrivez le déroulement prévu : horaires, moments clés, traditions particulières..."
              rows={4}
              value={q.schedule}
              onChange={(e) => onQ("schedule", e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">💭</span>
              <span className="font-medium text-gray-700">Demandes particulières</span>
            </div>
            <textarea
              className="border rounded-xl px-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
              placeholder="Partagez vos attentes : style souhaité, moments importants à ne pas rater, surprises prévues..."
              rows={4}
              value={q.specialRequests}
              onChange={(e) => onQ("specialRequests", e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* ––– Formules avec icônes et couleurs ––– */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-20 -translate-x-20 opacity-30"></div>
        
        <div className="mb-6 relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📦</span>
            <h2 className="text-2xl font-semibold">Choisissez votre formule</h2>
          </div>
          <p className="text-gray-600">Sélectionnez la formule qui correspond le mieux à vos besoins et votre budget</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {FORMULAS_DETAILED.map((f) => {
            const colors = getFormulaColor(f.id);
            return (
              <div
                key={f.id}
                className={`relative rounded-3xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  formulaId === f.id 
                    ? `border-orange-500 bg-gradient-to-br from-orange-50 to-pink-50 shadow-2xl transform scale-[1.02]` 
                    : `border-gray-200 hover:border-orange-300 ${colors.bg}`
                }`}
                onClick={() => setFormulaId(f.id)}
              >
                {/* Badge populaire */}
                {f.id === 'premium' && (
                  <div className="absolute -top-3 left-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    ⭐ Populaire
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{getFormulaIcon(f.id)}</span>
                      <div>
                        <h3 className="font-bold text-xl">{f.name}</h3>
                        <p className="text-gray-600 text-sm">{f.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 mb-4 text-sm">
                      {f.duration && (
                        <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2">
                          <span className="text-orange-600">⏱️</span>
                          <span className="font-medium">Durée:</span>
                          <span className="text-gray-600">{f.duration}</span>
                        </div>
                      )}
                      {f.deliverables && (
                        <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2">
                          <span className="text-orange-600">📦</span>
                          <span className="font-medium">Livrables:</span>
                          <span className="text-gray-600">{f.deliverables}</span>
                        </div>
                      )}
                      {f.deliveryTime && (
                        <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2">
                          <span className="text-orange-600">🚚</span>
                          <span className="font-medium">Livraison:</span>
                          <span className="text-gray-600">{f.deliveryTime}</span>
                        </div>
                      )}
                    </div>
                    
                    {f.idealFor && (
                      <div className="bg-white/80 rounded-xl p-3 mb-4 border border-orange-200">
                        <span className="text-sm font-medium text-orange-800 flex items-center gap-1">
                          💡 Idéal pour:
                        </span>
                        <p className="text-sm text-orange-700 mt-1">{f.idealFor}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {euros(f.price)}
                    </div>
                    <div className="relative">
                      <input
                        type="radio"
                        checked={formulaId === f.id}
                        onChange={() => setFormulaId(f.id)}
                        className="w-6 h-6 text-orange-600 cursor-pointer"
                      />
                      {formulaId === f.id && (
                        <div className="absolute -inset-1 bg-orange-200 rounded-full animate-pulse -z-10"></div>
                      )}
                    </div>
                  </div>
                </div>

                {f.highlights && f.highlights.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      ✨ Points forts:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {f.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 text-xs px-3 py-1 rounded-full border border-orange-200"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {f.features && f.features.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      📋 Inclus:
                    </div>
                    <div className="space-y-1">
                      {f.features.map((feature, idx) => (
                        <div key={idx} className="text-sm text-gray-600 flex items-start gap-2 bg-white/50 rounded-lg p-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Devis personnalisé */}
          <div
            className={`relative rounded-3xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
              formulaId === "custom" 
                ? "border-orange-500 bg-gradient-to-br from-orange-50 to-pink-50 shadow-2xl transform scale-[1.02]" 
                : "border-gray-200 hover:border-orange-300 bg-gradient-to-br from-green-50 to-blue-50"
            }`}
            onClick={() => setFormulaId("custom")}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <h3 className="font-bold text-xl">Devis personnalisé</h3>
                    <p className="text-gray-600 text-sm">
                      Vous avez déjà reçu un devis sur mesure ? Saisissez le montant convenu.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="radio"
                  checked={formulaId === "custom"}
                  onChange={() => setFormulaId("custom")}
                  className="w-6 h-6 text-orange-600 cursor-pointer"
                />
                {formulaId === "custom" && (
                  <div className="absolute -inset-1 bg-orange-200 rounded-full animate-pulse -z-10"></div>
                )}
              </div>
            </div>
            
            {formulaId === "custom" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  💰 Montant de votre devis personnalisé
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 text-lg">💵</span>
                  <input
                    className="border rounded-xl pl-12 pr-12 py-3 w-full text-lg font-semibold focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors"
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
            
            <div className="mt-4 bg-white/60 rounded-xl p-3 border border-green-200">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <span>🤝</span>
                <span className="font-medium">Sur mesure pour vous</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Prestation entièrement personnalisée selon vos besoins spécifiques
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ––– Options avec icônes améliorées ––– */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-40"></div>
        
        <div className="mb-6 relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🛠️</span>
            <h2 className="text-2xl font-semibold">Personnalisez votre prestation</h2>
          </div>
          <p className="text-gray-600">Ajoutez des options pour enrichir votre expérience et créer des souvenirs encore plus mémorables</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 border-b pb-2">
          <button
            onClick={() => setActiveCategory("popular")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeCategory === "popular"
                ? "bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 border-2 border-orange-300 shadow-md"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <span className="text-lg">⭐</span>
            <span>Populaires</span>
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
            const categoryIcons: { [key: string]: string } = {
              photo: "📸",
              video: "🎬", 
              album: "📖",
              extras: "✨"
            };
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeCategory === key
                    ? "bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 border-2 border-orange-300 shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <span className="text-lg">{categoryIcons[key] || "📦"}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeCategory === "popular" 
            ? popularOptions 
            : optionsByCategory[activeCategory as keyof typeof optionsByCategory] || []
          ).map((option) => (
            <label
              key={option.id}
              className={`group relative rounded-2xl border-2 px-5 py-4 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                selected.includes(option.id) 
                  ? "border-orange-500 bg-gradient-to-br from-orange-50 to-pink-50 shadow-lg" 
                  : "border-gray-200 hover:border-orange-300 bg-gradient-to-br from-gray-50 to-white"
              }`}
            >
              {/* Badge populaire */}
              {option.popular && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  🔥
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{option.icon}</span>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800 block">{option.label}</span>
                      {option.popular && (
                        <div className="flex gap-1 mt-1">
                          <span className="bg-gradient-to-r from-orange-200 to-pink-200 text-orange-800 text-xs px-2 py-0.5 rounded-full border border-orange-300">
                            🌟 Populaire
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-3 leading-relaxed">{option.description}</div>
                  <div className="font-bold text-orange-600 flex items-center gap-1">
                    <span className="text-lg">💎</span>
                    <Money value={option.price} />
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selected.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                    className="w-6 h-6 text-orange-600 rounded cursor-pointer"
                  />
                  {selected.includes(option.id) && (
                    <div className="absolute -inset-1 bg-orange-200 rounded animate-pulse -z-10"></div>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Extras personnalisés avec style amélioré */}
        <div className="mt-8 border-t pt-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎨</span>
              <h3 className="font-semibold text-lg">Ajouter un extra sur mesure</h3>
            </div>
            <p className="text-sm text-gray-600">
              Besoin de quelque chose de spécifique ? Créez vos propres options personnalisées.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-200">
            <div className="grid md:grid-cols-[1fr_160px_140px] gap-3 mb-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">📝</span>
                <input
                  className="border rounded-xl pl-10 pr-3 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors bg-white"
                  placeholder="Intitulé (ex: heure supplémentaire...)"
                  value={extraLabel}
                  onChange={(e) => setExtraLabel(e.target.value)}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400">💰</span>
                <input
                  className="border rounded-xl pl-10 pr-12 py-3 w-full focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors bg-white"
                  type="number"
                  min={1}
                  placeholder="Prix"
                  value={extraPrice}
                  onChange={(e) => setExtraPrice(e.target.value === "" ? "" : Number(e.target.value))}
                />
                <span className="absolute right-3 top-3 text-gray-500">€</span>
              </div>
              <SecondaryButton onClick={addExtra} className="h-12 flex items-center gap-2">
                <span>➕</span>
                <span>Ajouter</span>
              </SecondaryButton>
            </div>
          </div>
          
          {extras.length > 0 && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <h4 className="font-medium text-gray-700">Vos extras personnalisés:</h4>
              </div>
              <div className="grid gap-3">
                {extras.map((extra, i) => (
                  <div key={i} className="flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 rounded-xl px-4 py-3 border border-green-200">
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 text-lg">🎯</span>
                      <span className="font-medium">{extra.label}</span>
                      <span className="text-gray-400">—</span>
                      <span className="font-bold text-orange-600 flex items-center gap-1">
                        <span className="text-sm">💎</span>
                        {euros(extra.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeExtra(i)}
                      className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      title="Supprimer cet extra"
                    >
                      <span className="text-lg">🗑️</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* ––– Récapitulatif avec style premium ––– */}
      <div className="lg:sticky lg:bottom-4 z-10">
        <Card className="p-4 bg-gradient-to-r from-white to-orange-50 shadow-2xl border-2 border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h3 className="text-lg font-semibold">Récapitulatif</h3>
            </div>
            <div className="flex items-center gap-3">
              {(selected.length + extras.length) > 0 && (
                <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  <span>✨</span>
                  <span>{selected.length + extras.length} option{selected.length + extras.length > 1 ? 's' : ''}</span>
                </div>
              )}
              <button
                onClick={() => setSummaryCollapsed(!summaryCollapsed)}
                className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-orange-100 transition-colors"
                title={summaryCollapsed ? "Afficher le détail" : "Réduire le récapitulatif"}
              >
                <span className={`text-lg transition-transform ${summaryCollapsed ? 'rotate-180' : ''}`}>
                  🔽
                </span>
              </button>
            </div>
          </div>
          
          <div className={`${summaryCollapsed ? 'hidden md:hidden' : ''}`}>
            <div className="space-y-3 text-sm mb-4 bg-white rounded-xl p-3 border border-orange-200">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span>💰</span>
                  <span>Total estimé</span>
                </span>
                <span className="font-bold text-orange-600 text-lg">
                  <Money value={totals.total} />
                </span>
              </div>
              <div className="flex justify-between items-center text-orange-700 bg-orange-50 rounded-lg p-2">
                <span className="flex items-center gap-2">
                  <span>💳</span>
                  <span className="font-medium">Acompte à régler</span>
                </span>
                <span className="font-bold text-lg">
                  <Money value={totals.depositSuggested} />
                </span>
              </div>
              <div className="flex justify-between text-gray-500 text-xs">
                <span className="flex items-center gap-2">
                  <span>📅</span>
                  <span>Solde restant (jour J)</span>
                </span>
                <span><Money value={totals.remainingDayJ} /></span>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 mb-4">
              <div className="flex items-center gap-2 text-xs text-blue-700">
                <span>ℹ️</span>
                <span>Acompte de 15% requis pour confirmer votre réservation</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={goCheckout} 
              className="flex-1 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-xl">⏳</span>
                  <span>Redirection...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="text-xl">💳</span>
                  <span>
                    {summaryCollapsed ? `Régler ${euros(totals.depositSuggested)}` : 'Régler par carte'}
                  </span>
                </span>
              )}
            </Button>
            <a
              href="/rib"
              className="flex-1 text-center rounded-xl border-2 border-orange-300 px-3 py-4 text-orange-700 hover:bg-orange-50 font-medium transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
            >
              <span className="text-lg">🏦</span>
              <span>Virement</span>
            </a>
          </div>

          {summaryCollapsed && (
            <div className="hidden md:block mt-3 pt-3 border-t border-orange-200">
              <div className="flex items-center justify-between text-sm bg-white rounded-lg p-2">
                <span className="text-gray-600 flex items-center gap-2">
                  <span>{getFormulaIcon(currentFormula.id)}</span>
                  <span>
                    {currentFormula.name}
                    {(selected.length + extras.length) > 0 && (
                      <span className="text-orange-600 ml-1">+ {selected.length + extras.length} option{selected.length + extras.length > 1 ? 's' : ''}</span>
                    )}
                  </span>
                </span>
                <span className="font-bold text-orange-600">
                  <Money value={totals.total} />
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Message d'invitation chat avec design moderne */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 via-pink-50 to-purple-100 opacity-50"></div>
        <div className="relative">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-full p-3 text-white text-2xl">
              💬
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-orange-800 mb-2 text-lg">Des questions ? Parlons-en !</h4>
              <p className="text-orange-700 mb-3">
                N'hésitez pas à utiliser le chat en bas à droite pour me poser directement vos questions ! 
                Je suis là pour vous aider à choisir la formule parfaite et répondre à toutes vos interrogations. 
              </p>
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <span>✨</span>
                <span>Réponse rapide garantie</span>
                <span>•</span>
                <span>👨‍💼</span>
                <span>Conseils personnalisés</span>
                <span>•</span>
                <span>🎯</span>
                <span>Devis sur mesure</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Chat contextuel avec données utilisateur - Temporairement désactivé */}
      {/* <CrispChat {...crispUserData} /> */}
    </div>
  );
}