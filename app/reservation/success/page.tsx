// app/reservation/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { jsPDF } from "jspdf";

// --------------------------------------
// Utilitaires
// --------------------------------------
dayjs.locale("fr");

type ReservationData = {
  bride_first_name: string;
  bride_last_name: string;
  groom_first_name: string;
  groom_last_name: string;

  contact_email: string;          // l'email de contact (doit aussi recevoir le contrat)
  couple_email?: string;          // email du couple (optionnel, si vous voulez leur envoyer aussi)
  phone?: string;

  wedding_date: string;           // YYYY-MM-DD
  ceremony_location?: string;
  reception_location?: string;
  addresses?: string;

  schedule?: string;              // horaires du jour J
  guests_count?: string;

  package_name?: string;          // formule choisie
  options?: string;               // options + demandes spéciales
  total_price?: string;
  deposit_amount?: string;

  notes?: string;
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

// --------------------------------------
// Composant principal
// --------------------------------------
export default function ReservationPage() {
  const [formData, setFormData] = useState<ReservationData>({
    bride_first_name: "",
    bride_last_name: "",
    groom_first_name: "",
    groom_last_name: "",
    contact_email: "",
    couple_email: "",
    phone: "",
    wedding_date: "",
    ceremony_location: "",
    reception_location: "",
    addresses: "",
    schedule: "",
    guests_count: "",
    package_name: "",
    options: "",
    total_price: "",
    deposit_amount: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Générer le PDF
      const { blob, fileName } = generateContractPDF(formData);
      
      // Télécharger le PDF automatiquement
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Simulation d'envoi (remplacez par votre logique d'envoi réelle)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus("success");
    } catch (error) {
      console.error("Erreur lors du traitement:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = useMemo(() => {
    return (
      formData.bride_first_name.trim() &&
      formData.bride_last_name.trim() &&
      formData.groom_first_name.trim() &&
      formData.groom_last_name.trim() &&
      formData.contact_email.trim() &&
      formData.wedding_date.trim()
    );
  }, [formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Réservation Reportage Photo
            </h1>
            <p className="text-gray-600 text-lg">
              Créez votre contrat personnalisé
            </p>
          </div>

          {/* Success/Error Messages */}
          {submitStatus === "success" && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              ✅ Contrat généré avec succès ! Le fichier PDF a été téléchargé.
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              ❌ Une erreur s'est produite. Veuillez réessayer.
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            {/* Informations du couple */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-orange-200">
                👰🤵 Informations du couple
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom de la mariée *
                  </label>
                  <input
                    type="text"
                    name="bride_first_name"
                    value={formData.bride_first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la mariée *
                  </label>
                  <input
                    type="text"
                    name="bride_last_name"
                    value={formData.bride_last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom du marié *
                  </label>
                  <input
                    type="text"
                    name="groom_first_name"
                    value={formData.groom_first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du marié *
                  </label>
                  <input
                    type="text"
                    name="groom_last_name"
                    value={formData.groom_last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-orange-200">
                📧 Contact
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contact *
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email du couple (optionnel)
                  </label>
                  <input
                    type="email"
                    name="couple_email"
                    value={formData.couple_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Détails du mariage */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-orange-200">
                💒 Détails du mariage
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date du mariage *
                  </label>
                  <input
                    type="date"
                    name="wedding_date"
                    value={formData.wedding_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre d'invités
                  </label>
                  <input
                    type="text"
                    name="guests_count"
                    value={formData.guests_count}
                    onChange={handleInputChange}
                    placeholder="ex: 80 personnes"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu de cérémonie
                  </label>
                  <input
                    type="text"
                    name="ceremony_location"
                    value={formData.ceremony_location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lieu de réception
                  </label>
                  <input
                    type="text"
                    name="reception_location"
                    value={formData.reception_location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresses complètes
                  </label>
                  <textarea
                    name="addresses"
                    value={formData.addresses}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Adresses détaillées des lieux"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planning de la journée
                  </label>
                  <textarea
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="ex: 14h30 - Préparatifs, 16h00 - Cérémonie, 18h00 - Cocktail..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Prestation */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-orange-200">
                📸 Prestation
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formule choisie
                  </label>
                  <select
                    name="package_name"
                    value={formData.package_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Sélectionnez une formule</option>
                    <option value="Essentiel">Formule Essentiel</option>
                    <option value="Complète">Formule Complète</option>
                    <option value="Premium">Formule Premium</option>
                    <option value="Sur mesure">Formule sur mesure</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options et demandes spéciales
                  </label>
                  <textarea
                    name="options"
                    value={formData.options}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Décrivez vos options et demandes particulières..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Aspects financiers */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-orange-200">
                💰 Aspects financiers
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix total
                  </label>
                  <input
                    type="text"
                    name="total_price"
                    value={formData.total_price}
                    onChange={handleInputChange}
                    placeholder="ex: 1500€"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acompte
                  </label>
                  <input
                    type="text"
                    name="deposit_amount"
                    value={formData.deposit_amount}
                    onChange={handleInputChange}
                    placeholder="ex: 500€"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-orange-200">
                📝 Notes supplémentaires
              </h2>
              
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Ajoutez ici toute information complémentaire..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`
                  px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200
                  ${isFormValid && !isSubmitting
                    ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Génération en cours...
                  </span>
                ) : (
                  "🎯 Générer le contrat PDF"
                )}
              </button>
              
              {!isFormValid && (
                <p className="text-red-500 text-sm mt-2">
                  Veuillez remplir tous les champs obligatoires (*)
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}