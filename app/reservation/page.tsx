// app/reservation/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";

import { FORMULAS_DETAILED, type FormulaDetailed } from "@/lib/modules";
import { OPTIONS, euros, getOptionsByCategory, getPopularOptions, CATEGORY_LABELS } from "@/lib/products";
import { computePricing } from "@/lib/pricing";
import { Button, Card, Money, SecondaryButton } from "@/components/ui";
import CrispChat from '@/components/CrispChat';

// --------------------------------------
// Utilitaires
// --------------------------------------
dayjs.locale("fr");

/** Questionnaire : tout FACULTATIF mais adapté pour les besoins PDF */
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

type ReservationData = {
  bride_first_name: string;
  bride_last_name: string;
  groom_first_name: string;
  groom_last_name: string;
  contact_email: string;
  couple_email?: string;
  phone?: string;
  wedding_date: string;
  ceremony_location?: string;
  reception_location?: string;
  addresses?: string;
  schedule?: string;
  guests_count?: string;
  package_name?: string;
  options?: string;
  total_price?: string;
  deposit_amount?: string;
  notes?: string;
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

const ORANGE = "#ea580c"; // Tailwind orange-600
const LIGHT_ORANGE = "#fff4ec";
const GRAY_TEXT = "#374151";
const LIGHT_GRAY = "#6b7280";

function safe(val?: string) {
  return val?.trim() ?? "";
}

function pdfFileName(data: ReservationData) {
  const date = safe(data.wedding_date)
    ? dayjs(data.wedding_date).format("YYYY-MM-DD")
    : dayjs().format("YYYY-MM-DD");

  const couple =
    [safe(data.bride_first_name), safe(data.groom_first_name)]
      .filter(Boolean)
      .join("_")
      .replace(/\s+/g, "-");

  return `Contrat-${couple || "Couple"}-${date}.pdf`;
}

// --------------------------------------
// PDF PRO - propre & lisible
// --------------------------------------
function generateContractPDF(data: ReservationData): { blob: Blob; fileName: string } {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 48;
  let y = 72;

  // En-tête coloré
  doc.setFillColor(234, 88, 12); // ORANGE
  doc.rect(0, 0, pageWidth, 120, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Contrat - Reportage Photo Mariage", marginX, 56);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Irzen Productions", marginX, 85);

  y = 160;

  // Reset text color for body
  doc.setTextColor(55, 65, 81); // GRAY_TEXT

  // Date du contrat
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Contrat établi le : ${dayjs().format("DD MMMM YYYY")}`, pageWidth - marginX - 150, y);
  y += 30;

  // Section Informations des mariés
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("INFORMATIONS DU COUPLE", marginX, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  const brideFullName = `${safe(data.bride_first_name)} ${safe(data.bride_last_name)}`.trim();
  const groomFullName = `${safe(data.groom_first_name)} ${safe(data.groom_last_name)}`.trim();
  
  if (brideFullName) {
    doc.text(`Mariée : ${brideFullName}`, marginX, y);
    y += 16;
  }
  
  if (groomFullName) {
    doc.text(`Marié : ${groomFullName}`, marginX, y);
    y += 16;
  }

  if (safe(data.contact_email)) {
    doc.text(`Email de contact : ${safe(data.contact_email)}`, marginX, y);
    y += 16;
  }

  if (safe(data.couple_email)) {
    doc.text(`Email du couple : ${safe(data.couple_email)}`, marginX, y);
    y += 16;
  }

  if (safe(data.phone)) {
    doc.text(`Téléphone : ${safe(data.phone)}`, marginX, y);
    y += 16;
  }

  y += 20;

  // Section Détails du mariage
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("DÉTAILS DU MARIAGE", marginX, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  if (safe(data.wedding_date)) {
    const formattedDate = dayjs(data.wedding_date).format("dddd DD MMMM YYYY");
    doc.text(`Date du mariage : ${formattedDate}`, marginX, y);
    y += 16;
  }

  if (safe(data.ceremony_location)) {
    doc.text(`Lieu de cérémonie : ${safe(data.ceremony_location)}`, marginX, y);
    y += 16;
  }

  if (safe(data.reception_location)) {
    doc.text(`Lieu de réception : ${safe(data.reception_location)}`, marginX, y);
    y += 16;
  }

  if (safe(data.addresses)) {
    const lines = safe(data.addresses).split('\n');
    doc.text("Adresses :", marginX, y);
    y += 16;
    lines.forEach(line => {
      if (line.trim()) {
        doc.text(`  ${line.trim()}`, marginX + 20, y);
        y += 14;
      }
    });
    y += 6;
  }

  if (safe(data.schedule)) {
    doc.text(`Planning : ${safe(data.schedule)}`, marginX, y);
    y += 16;
  }

  if (safe(data.guests_count)) {
    doc.text(`Nombre d'invités : ${safe(data.guests_count)}`, marginX, y);
    y += 16;
  }

  y += 20;

  // Check if we need a new page
  if (y > pageHeight - 150) {
    doc.addPage();
    y = 72;
  }

  // Section Prestation
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("PRESTATION", marginX, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  if (safe(data.package_name)) {
    doc.text(`Formule choisie : ${safe(data.package_name)}`, marginX, y);
    y += 16;
  }

  if (safe(data.options)) {
    const lines = safe(data.options).split('\n');
    doc.text("Options et demandes spéciales :", marginX, y);
    y += 16;
    lines.forEach(line => {
      if (line.trim()) {
        doc.text(`  ${line.trim()}`, marginX + 20, y);
        y += 14;
      }
    });
    y += 6;
  }

  y += 20;

  // Section Financière
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ASPECTS FINANCIERS", marginX, y);
  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  if (safe(data.total_price)) {
    doc.text(`Prix total : ${safe(data.total_price)}`, marginX, y);
    y += 16;
  }

  if (safe(data.deposit_amount)) {
    doc.text(`Acompte : ${safe(data.deposit_amount)}`, marginX, y);
    y += 16;
  }

  y += 20;

  // Notes supplémentaires
  if (safe(data.notes)) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("NOTES SUPPLÉMENTAIRES", marginX, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const noteLines = safe(data.notes).split('\n');
    noteLines.forEach(line => {
      if (line.trim()) {
        doc.text(line.trim(), marginX, y);
        y += 14;
      }
    });
    y += 20;
  }

  // Check if we need a new page for signatures
  if (y > pageHeight - 200) {
    doc.addPage();
    y = 72;
  }

  // Section Signatures
  y += 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("SIGNATURES", marginX, y);
  y += 40;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  const leftSignX = marginX;
  const rightSignX = pageWidth - marginX - 150;
  
  doc.text("Le Photographe", leftSignX, y);
  doc.text("Les Clients", rightSignX, y);
  
  y += 20;
  doc.text("Date : _______________", leftSignX, y);
  doc.text("Date : _______________", rightSignX, y);
  
  y += 40;
  doc.text("Signature :", leftSignX, y);
  doc.text("Signature :", rightSignX, y);

  // Pied de page
  y = pageHeight - 60;
  doc.setTextColor(107, 114, 128); // LIGHT_GRAY
  doc.setFontSize(9);
  doc.text("Irzen Productions - Reportage Photo Mariage", marginX, y);

  const pdfBlob = new Blob([doc.output("blob")], { type: "application/pdf" });
  const fileName = pdfFileName(data);

  return { blob: pdfBlob, fileName };
}

// Fonction pour convertir le questionnaire en format ReservationData
function convertToReservationData(q: Questionnaire, currentFormula: FormulaDetailed, selected: string[], extras: any[], totals: any): ReservationData {
  // Construire les adresses
  const addresses = [
    q.prepLocation && `Préparatifs: ${q.prepLocation}`,
    q.mairieLocation && `Mairie: ${q.mairieLocation}`,
    q.ceremonyLocation && `Cérémonie: ${q.ceremonyLocation}`,
    q.shootingLocation && `Shooting: ${q.shootingLocation}`,
    q.receptionLocation && `Réception: ${q.receptionLocation}`,
    q.address && `Adresse postale: ${q.address}, ${q.postalCode} ${q.city}`,
  ].filter(Boolean).join('\n');

  // Construire le planning
  const scheduleItems = [
    q.prepTime && q.prepLocation && `${q.prepTime} - Préparatifs (${q.prepLocation})`,
    q.mairieTime && q.mairieLocation && `${q.mairieTime} - Mairie (${q.mairieLocation})`,
    q.ceremonyTime && q.ceremonyLocation && `${q.ceremonyTime} - Cérémonie (${q.ceremonyLocation})`,
    q.shootingTime && q.shootingLocation && `${q.shootingTime} - Shooting (${q.shootingLocation})`,
    q.receptionTime && q.receptionLocation && `${q.receptionTime} - Réception (${q.receptionLocation})`,
    q.schedule && `Planning détaillé: ${q.schedule}`,
  ].filter(Boolean).join('\n');

  // Construire les options sélectionnées
  const selectedOptions = OPTIONS.filter(o => selected.includes(o.id)).map(o => `${o.label} (${euros(o.price)})`);
  const extraOptions = extras.map(e => `${e.label} (${euros(e.price)})`);
  const allOptions = [...selectedOptions, ...extraOptions].join('\n');

  return {
    bride_first_name: q.brideFirstName,
    bride_last_name: q.brideLastName,
    groom_first_name: q.groomFirstName,
    groom_last_name: q.groomLastName,
    contact_email: q.email,
    phone: q.phone,
    wedding_date: q.weddingDate,
    ceremony_location: q.ceremonyLocation,
    reception_location: q.receptionLocation,
    addresses: addresses,
    schedule: scheduleItems,
    guests_count: q.guests,
    package_name: currentFormula.name,
    options: allOptions || q.specialRequests,
    total_price: euros(totals.total),
    deposit_amount: euros(totals.depositSuggested),
    notes: q.specialRequests,
  };
}

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
  const [customPrice, setCustomPrice] = useState<number | "">("");
  const [activeCategory, setActiveCategory] = useState<string>("popular");
  const [summaryCollapsed, setSummaryCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contractMode, setContractMode] = useState(false); // Mode contrat PDF

  // ——————————— Questionnaire ———————————
  const [q, setQ] = useState<Questionnaire>(initialQ);
  const onQ = (k: keyof Questionnaire, v: string) => setQ((prev) => ({ ...prev, [k]: v }));

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

  // Fonction pour générer le contrat PDF
  const generateContract = () => {
    try {
      const reservationData = convertToReservationData(q, currentFormula, selected, extras, totals);
      const { blob, fileName } = generateContractPDF(reservationData);
      
      // Télécharger le PDF automatiquement
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Contrat PDF généré avec succès !');
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Erreur lors de la génération du contrat PDF. Veuillez réessayer.");
    }
  };

  const goCheckout = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            email: q.email || "",
            firstName: q.brideFirstName || "",
            lastName: q.brideLastName || "",
            coupleName: `${q.brideFirstName} & ${q.groomFirstName}`.trim(),
            weddingDate: q.weddingDate || "",
          },
          questionnaire: q,
          config: {
            formulaId,
            customPrice: formulaId === "custom" ? (typeof customPrice === "number" ? customPrice : 0) : undefined,
            options: selected,
            extras,
          },
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

      window.location.href = data.url;

    } catch (error: any) {
      console.error("❌ Erreur lors de la création du paiement:", error);
      alert(`Erreur: ${error.message}`);
      setLoading(false);
    }
  };

  // Préparer les données pour Crisp Chat
  const crispUserData = {
    userEmail: q.email,
    userFirstName: q.brideFirstName,
    userLastName: q.brideLastName, 
    weddingDate: q.weddingDate,
    currentFormula: currentFormula.name,
    estimatedBudget: totals.total
  };

  // Validation pour le mode contrat
  const isValidForContract = q.brideFirstName && q.brideLastName && q.groomFirstName && q.groomLastName && q.weddingDate;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Barre d'actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setContractMode(!contractMode)}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
              contractMode 
                ? 'border-orange-500 bg-orange-50 text-orange-700' 
                : 'border-gray-300 text-gray-600 hover:border-orange-300 hover:text-orange-600'
            }`}
          >
            📄 {contractMode ? 'Mode Paiement' : 'Mode Contrat'}
          </button>
        </div>
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
        <h1 className="font-serif text-4xl">
          {contractMode ? 'Générer votre contrat' : 'Configurez votre prestation'}
        </h1>
      </div>

      {/* Message d'information pour le mode contrat */}
      {contractMode && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center gap-3">
            <span className="text-orange-600 text-xl">📋</span>
            <div>
              <h3 className="font-semibold text-orange-800">Mode Contrat PDF</h3>
              <p className="text-sm text-orange-700">
                Remplissez les informations ci-dessous pour générer un contrat professionnel en PDF. 
                Les champs marqués d'un astérisque (*) sont requis pour le contrat.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ——— Formules ——— */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-2">Choisissez votre formule</h2>
        <p className="text-gray-600 mb-6">Sélectionnez la formule qui correspond le mieux à vos besoins</p>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {FORMULAS_DETAILED.map((f) => (
            <div
              key={f.id}
              className={`rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                formulaId === f.id 
                  ? "border-orange-500 bg-orange-50 shadow-lg transform scale-[1.02]" 
                  : "border-gray-200 hover:border-orange-300"
              }`}
              onClick={() => setFormulaId(f.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-2">{f.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{f.description}</p>
                  
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

              {f.features && f.features.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-700 mb-2">📋 Inclus:</div>
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

      {/* ——— Questionnaire ——— */}
      <Card className="p-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            Informations du mariage {contractMode && <span className="text-red-500">*</span>}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {contractMode 
              ? "Ces informations sont requises pour générer le contrat PDF" 
              : "Informations facultatives pour personnaliser votre devis"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className={`border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 ${
              contractMode && !q.brideFirstName ? 'border-red-300 bg-red-50' : ''
            }`}
            placeholder={`Prénom de la mariée${contractMode ? ' *' : ''}`}
            value={q.brideFirstName}
            onChange={(e) => onQ("brideFirstName", e.target.value)}
            required={contractMode}
          />
          <input
            className={`border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 ${
              contractMode && !q.brideLastName ? 'border-red-300 bg-red-50' : ''
            }`}
            placeholder={`Nom de la mariée${contractMode ? ' *' : ''}`}
            value={q.brideLastName}
            onChange={(e) => onQ("brideLastName", e.target.value)}
            required={contractMode}
          />
          <input
            className={`border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 ${
              contractMode && !q.groomFirstName ? 'border-red-300 bg-red-50' : ''
            }`}
            placeholder={`Prénom du marié${contractMode ? ' *' : ''}`}
            value={q.groomFirstName}
            onChange={(e) => onQ("groomFirstName", e.target.value)}
            required={contractMode}
          />
          <input
            className={`border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 ${
              contractMode && !q.groomLastName ? 'border-red-300 bg-red-50' : ''
            }`}
            placeholder={`Nom du marié${contractMode ? ' *' : ''}`}
            value={q.groomLastName}
            onChange={(e) => onQ("groomLastName", e.target.value)}
            required={contractMode}
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
            className={`border rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 ${
              contractMode && !q.weddingDate ? 'border-red-300 bg-red-50' : ''
            }`}
            type="date"
            placeholder="Date du mariage"
            value={q.weddingDate}
            onChange={(e) => onQ("weddingDate", e.target.value)}
            required={contractMode}
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

      {/* ——— Options ——— */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-1">Personnalisez votre prestation</h2>
          <p className="text-gray-600">Ajoutez des options pour enrichir votre expérience</p>
        </div>

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
                  : "border-gray-200 hover:border-orange-300"
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
              placeholder="Intitulé (ex: heure supplémentaire...)"
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

      {/* ——— Récapitulatif ——— */}
      <div className="lg:sticky lg:bottom-4 z-10">
        <Card className="p-4 bg-white shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Récapitulatif</h3>
            <div className="flex items-center gap-3">
              {(selected.length + extras.length) > 0 && (
                <div className="text-xs text-gray-500">
                  {selected.length + extras.length} option{selected.length + extras.length > 1 ? 's' : ''}
                </div>
              )}
              <button
                onClick={() => setSummaryCollapsed(!summaryCollapsed)}
                className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                title={summaryCollapsed ? "Afficher le détail" : "Réduire le récapitulatif"}
              >
                <svg 
                  className={`w-4 h-4 text-gray-600 transition-transform ${summaryCollapsed ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className={`${summaryCollapsed ? 'hidden md:hidden' : ''}`}>
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
              {contractMode 
                ? "Générez votre contrat PDF personnalisé" 
                : "Acompte de 15% requis pour confirmer votre réservation"
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {contractMode ? (
              <Button 
                onClick={generateContract} 
                className="flex-1 py-3"
                disabled={!isValidForContract}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger le contrat PDF
                </span>
              </Button>
            ) : (
              <>
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
                    <span>
                      {summaryCollapsed ? `Régler ${euros(totals.depositSuggested)}` : 'Régler par carte'}
                    </span>
                  )}
                </Button>
                <a
                  href="/rib"
                  className="flex-1 text-center rounded-xl border border-orange-300 px-3 py-3 text-orange-700 hover:bg-orange-50 text-sm transition-colors"
                >
                  Virement
                </a>
              </>
            )}
          </div>

          {contractMode && !isValidForContract && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">
                ⚠️ Informations requises manquantes
              </p>
              <p className="text-xs text-red-600 mt-1">
                Pour générer le contrat, veuillez remplir : noms des mariés et date du mariage.
              </p>
            </div>
          )}

          {summaryCollapsed && (
            <div className="hidden md:block mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {currentFormula.name}
                  {(selected.length + extras.length) > 0 && (
                    <span className="text-orange-600"> + {selected.length + extras.length} option{selected.length + extras.length > 1 ? 's' : ''}</span>
                  )}
                </span>
                <span className="font-bold text-orange-600">
                  <Money value={totals.total} />
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Message d'invitation à utiliser le chat */}
      <Card className="p-6">
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
          <div className="flex items-start gap-3 p-4">
            <span className="text-2xl">💬</span>
            <div>
              <h4 className="font-semibold text-orange-800 mb-1">Des questions ?</h4>
              <p className="text-sm text-orange-700">
                N'hésitez pas à utiliser le chat en bas à droite pour me poser directement vos questions ! 
                Je suis là pour vous aider à choisir la formule parfaite. 😊
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Chat contextuel avec données utilisateur */}
      <CrispChat {...crispUserData} />
    </div>
  );
}