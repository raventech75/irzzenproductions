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
// PDF PRO — propre & lisible
// --------------------------------------
function generateContractPDF(data: ReservationData): { blob: Blob; fileName: string } {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 48;
  let y = 72;

  // En-tête coloré
  doc.setFillColor(234, 88, 12); // ORANGE
  doc.rect(0, 0, pageWidth, 120, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Contrat – Reportage Photo Mariage", marginX, 56);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("IRZZEN Productions — Soin & professionnalisme", marginX, 80);

  // Carte d’infos client
  y = 140;
  const cardTop = y;
  doc.setFillColor(255, 244, 236); // LIGHT_ORANGE
  doc.roundedRect(marginX, y, pageWidth - marginX * 2, 120, 8, 8, "F");

  y += 28;
  doc.setTextColor(55, 65, 81); // GRAY_TEXT
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Informations du couple", marginX + 16, y);

  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  const line = (label: string, value?: string) => {
    const val = safe(value) || "—";
    doc.setTextColor(55, 65, 81);
    doc.text(`${label}:`, marginX + 16, y);
    doc.setTextColor(107, 114, 128);
    doc.text(val, marginX + 140, y);
    y += 18;
  };

  line("Mariée (prénom/nom)", `${safe(data.bride_first_name)} ${safe(data.bride_last_name)}`);
  line("Marié (prénom/nom)", `${safe(data.groom_first_name)} ${safe(data.groom_last_name)}`);
  line("Email contact", data.contact_email);
  line("Email couple", data.couple_email);
  line("Téléphone", data.phone);

  // Infos mariage
  y += 10;
  doc.setDrawColor(234, 88, 12);
  doc.line(marginX + 16, y, pageWidth - marginX - 16, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(55, 65, 81);
  doc.text("Détails du mariage", marginX + 16, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  line("Date", safe(data.wedding_date) ? dayjs(data.wedding_date).format("dddd D MMMM YYYY") : "—");
  line("Lieu cérémonie", data.ceremony_location);
  line("Lieu réception", data.reception_location);
  line("Adresses", data.addresses);
  line("Horaires", data.schedule);
  line("Nombre d'invités", data.guests_count);

  // Formule & options
  y += 10;
  doc.setDrawColor(234, 88, 12);
  doc.line(marginX + 16, y, pageWidth - marginX - 16, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(55, 65, 81);
  doc.text("Formule & options", marginX + 16, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  line("Formule", data.package_name);
  line("Options / demandes spéciales", data.options);
  line("Prix total", data.total_price);
  line("Acompte", data.deposit_amount);

  // Notes
  y += 10;
  doc.setDrawColor(234, 88, 12);
  doc.line(marginX + 16, y, pageWidth - marginX - 16, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(55, 65, 81);
  doc.text("Notes", marginX + 16, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  const notes = doc.splitTextToSize(safe(data.notes) || "—", pageWidth - marginX * 2 - 32);
  doc.text(notes, marginX + 16, y);
  y += (Array.isArray(notes) ? notes.length : 1) * 14 + 8;

  // Mentions spéciales Mariage
  y += 10;
  doc.setDrawColor(234, 88, 12);
  doc.line(marginX + 16, y, pageWidth - marginX - 16, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(55, 65, 81);
  doc.text("Mentions spéciales", marginX + 16, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  const mentions =
    "• Les délais de livraison des photos sont indiqués contractuellement.\n" +
    "• Droit à l'image : l'autorisation de diffusion (site / réseaux sociaux) peut être consentie ou refusée par le couple.\n" +
    "• L'acompte valide la date et n'est pas remboursable, sauf cas de force majeure spécifiés au contrat.\n" +
    "• Les horaires dépassant la plage prévue seront facturés selon les conditions établies.\n" +
    "• Toute demande spécifique (lieux, poses, invités) doit être intégrée au brief en amont.";
  const mentionsWrapped = doc.splitTextToSize(mentions, pageWidth - marginX * 2 - 32);
  doc.text(mentionsWrapped, marginX + 16, y);

  const fileName = pdfFileName(data);
  const blob = doc.output("blob") as Blob;
  return { blob, fileName };
}

// --------------------------------------
// Envoi vers votre API (facultatif)
// --------------------------------------
async function sendContract(data: ReservationData, pdfBlob: Blob) {
  // ⚠️ Remplacez l’URL si votre endpoint diffère.
  const url = "/api/send-contract";

  // Encodage PDF en base64 pour envoi JSON
  const pdfBuffer = await pdfBlob.arrayBuffer();
  const pdfBase64 = btoa(
    new Uint8Array(pdfBuffer).reduce((acc, b) => acc + String.fromCharCode(b), "")
  );

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data,
      pdfBase64,
      fileName: pdfFileName(data),

      // 👇 IMPORTANT : l’email de contact reçoit systématiquement le mail
      // Ajoutez ici d'autres destinataires si souhaité (couple, etc.)
      recipients: [safe(data.contact_email), safe(data.couple_email)].filter(Boolean),
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Échec envoi contrat (${res.status}) ${txt}`);
  }
}

// --------------------------------------
// UI
// --------------------------------------
export default function ReservationPage() {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => dayjs().format("YYYY-MM-DD"), []);

  const [form, setForm] = useState<ReservationData>({
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

  function update<K extends keyof ReservationData>(key: K, val: ReservationData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSending(true);
    try {
      // 1) Générer le PDF
      const { blob, fileName } = generateContractPDF(form);

      // 2) Sauvegarde locale immédiate (téléchargement)
      //    -> si vous ne voulez pas télécharger côté client, commentez ce bloc.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      // 3) Envoi au(x) destinataire(s) (si votre API existe)
      try {
        await sendContract(form, blob);
        setMessage("Contrat envoyé par email avec succès ✅");
      } catch (err: any) {
        // On n’empêche pas la réussite globale : le PDF a été généré/téléchargé.
        console.error(err);
        setMessage("PDF généré. L’envoi email a échoué (vérifiez l’API).");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full border-b border-gray-100 bg-gradient-to-b from-orange-50 to-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                IRZZEN Productions
              </h1>
              <p className="text-sm text-gray-500">
                Reportage Photo Mariage — soin & professionnalisme
              </p>
            </div>
            <div className="hidden md:block rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-orange-700">
              {dayjs().format("dddd D MMMM YYYY")}
            </div>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 rounded-2xl border border-orange-100 bg-orange-50 p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Contrat & Informations — Mariage
          </h2>
          <p className="text-sm text-gray-600">
            Remplissez les champs ci-dessous. À l’envoi, un PDF propre sera
            généré et renommé automatiquement{" "}
            <span className="font-semibold">
              (prénoms + date du mariage)
            </span>
            . L’email de contact renseigné recevra également le contrat.
          </p>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Carte Couple */}
          <section className="lg:col-span-2 rounded-2xl border border-gray-200 p-6">
            <h3 className="mb-4 text-base font-semibold text-gray-800">
              Le couple
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Prénom mariée"
                placeholder="Ex: Justine"
                value={form.bride_first_name}
                onChange={(v) => update("bride_first_name", v)}
              />
              <Input
                label="Nom mariée"
                placeholder="Ex: Dupont"
                value={form.bride_last_name}
                onChange={(v) => update("bride_last_name", v)}
              />
              <Input
                label="Prénom marié"
                placeholder="Ex: Valentin"
                value={form.groom_first_name}
                onChange={(v) => update("groom_first_name", v)}
              />
              <Input
                label="Nom marié"
                placeholder="Ex: Martin"
                value={form.groom_last_name}
                onChange={(v) => update("groom_last_name", v)}
              />
              <Input
                type="email"
                label="Email (contact)"
                placeholder="contact@irzzenproductions.fr"
                required
                value={form.contact_email}
                onChange={(v) => update("contact_email", v)}
              />
              <Input
                type="email"
                label="Email (couple) — optionnel"
                placeholder="justine.valentin@email.com"
                value={form.couple_email}
                onChange={(v) => update("couple_email", v)}
              />
              <Input
                label="Téléphone"
                placeholder="+33 6 12 34 56 78"
                value={form.phone}
                onChange={(v) => update("phone", v)}
              />
            </div>
          </section>

          {/* Carte Mariage */}
          <section className="rounded-2xl border border-gray-200 p-6">
            <h3 className="mb-4 text-base font-semibold text-gray-800">
              Détails du mariage
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <Input
                type="date"
                label="Date"
                min={today}
                value={form.wedding_date}
                onChange={(v) => update("wedding_date", v)}
              />
              <Input
                label="Lieu cérémonie"
                placeholder="Ex: Église Saint-Pierre, Nantes"
                value={form.ceremony_location}
                onChange={(v) => update("ceremony_location", v)}
              />
              <Input
                label="Lieu réception"
                placeholder="Ex: Château de la Trinité"
                value={form.reception_location}
                onChange={(v) => update("reception_location", v)}
              />
              <Textarea
                label="Adresses"
                placeholder="Adresses détaillées des lieux"
                value={form.addresses}
                onChange={(v) => update("addresses", v)}
              />
              <Textarea
                label="Horaires du jour J"
                placeholder="Ex: Préparatifs 9h, Cérémonie 14h, Cocktail 17h..."
                value={form.schedule}
                onChange={(v) => update("schedule", v)}
              />
              <Input
                label="Nombre d'invités"
                placeholder="Ex: 120"
                value={form.guests_count}
                onChange={(v) => update("guests_count", v)}
              />
            </div>
          </section>

          {/* Carte Formule */}
          <section className="lg:col-span-2 rounded-2xl border border-gray-200 p-6">
            <h3 className="mb-4 text-base font-semibold text-gray-800">
              Formule & options
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Formule choisie"
                placeholder="Ex: Formule Or (12h de couverture)"
                value={form.package_name}
                onChange={(v) => update("package_name", v)}
              />
              <Input
                label="Acompte"
                placeholder="Ex: 500 €"
                value={form.deposit_amount}
                onChange={(v) => update("deposit_amount", v)}
              />
              <Input
                label="Prix total"
                placeholder="Ex: 2 200 €"
                value={form.total_price}
                onChange={(v) => update("total_price", v)}
              />
              <Textarea
                className="sm:col-span-2"
                label="Options / demandes spéciales"
                placeholder="Préparatifs, séance couple, drone, livre photo, etc."
                value={form.options}
                onChange={(v) => update("options", v)}
              />
            </div>
          </section>

          {/* Carte Notes */}
          <section className="rounded-2xl border border-gray-200 p-6">
            <h3 className="mb-4 text-base font-semibold text-gray-800">
              Notes supplémentaires
            </h3>
            <Textarea
              label="Notes"
              placeholder="Précisions utiles, contraintes, consignes..."
              value={form.notes}
              onChange={(v) => update("notes", v)}
            />
          </section>

          {/* Actions — bouton centré et pro */}
          <div className="lg:col-span-3">
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={sending || !form.contact_email}
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? (
                  <span className="animate-pulse">Génération & envoi…</span>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 8H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2z"
                      />
                    </svg>
                    Envoyer le contrat
                  </>
                )}
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-gray-500">
              Le contact renseigné recevra automatiquement le contrat par email
              (si l’API est configurée). Le PDF est aussi téléchargé localement.
            </p>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} IRZZEN Productions — Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}

// --------------------------------------
// Composants UI minimalistes
// --------------------------------------
function Input(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  min?: string;
  className?: string;
}) {
  const { label, value, onChange, placeholder, type = "text", required, min, className } = props;
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      />
    </div>
  );
}

function Textarea(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  const { label, value, onChange, placeholder, rows = 4, className } = props;
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
      />
    </div>
  );
}