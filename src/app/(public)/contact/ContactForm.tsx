"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formules, options } from "@/lib/prestations";

type Champ = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  span?: boolean;
};

const champs: Champ[] = [
  { id: "prenom_marie1", label: "Prénom marié·e 1", type: "text", placeholder: "Sophie", required: true },
  { id: "prenom_marie2", label: "Prénom marié·e 2", type: "text", placeholder: "Karim", required: true },
  { id: "email", label: "Email", type: "email", placeholder: "sophie.karim@email.com", required: true },
  { id: "telephone", label: "Téléphone", type: "tel", placeholder: "+33 6 00 00 00 00" },
  { id: "date_mariage", label: "Date du mariage", type: "date", placeholder: "", required: true },
  { id: "lieu", label: "Lieu de la cérémonie", type: "text", placeholder: "Paris, Château de Versailles…" },
  { id: "message", label: "Votre message", type: "textarea", placeholder: "Parlez-nous de votre mariage, vos attentes, vos idées…", span: true },
];

export function ContactForm() {
  const searchParams = useSearchParams();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  // Pré-remplissage depuis le configurateur
  const formuleId = searchParams.get("formule");
  const optionsIds = searchParams.get("options")?.split(",").filter(Boolean) ?? [];
  const totalParam = searchParams.get("total");

  const formulePresel = formules.find((f) => f.id === formuleId);
  const optionsPresel = options.filter((o) => optionsIds.includes(o.id));

  const handleChange = (id: string, val: string) =>
    setValues((prev) => ({ ...prev, [id]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        formule: formulePresel?.id,
        total: totalParam,
      }),
    });

    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="glass p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
        <CheckCircle size={48} className="text-[var(--c-rose)] mb-6" />
        <h2
          className="text-3xl font-bold text-[var(--c-text)] mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Message envoyé !
        </h2>
        <p className="text-[var(--c-text)]/50 text-sm leading-relaxed max-w-sm">
          Nous avons bien reçu votre demande et vous répondrons dans les 24h
          avec nos disponibilités et votre devis personnalisé.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card rounded-sm p-8 space-y-6">
      {/* Récap configurateur si arrivé depuis /tarifs */}
      {formulePresel && (
        <div className="p-4 border border-[var(--c-rose)]/30 bg-[var(--c-rose)]/5 space-y-2">
          <div className="text-xs tracking-[0.3em] uppercase text-[var(--c-rose)] mb-3">
            Votre sélection
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--c-text)]/70">Formule {formulePresel.nom}</span>
            <span className="text-[var(--c-text)]/70">{formulePresel.prix.toLocaleString("fr-FR")} €</span>
          </div>
          {optionsPresel.map((o) => (
            <div key={o.id} className="flex justify-between text-xs text-[var(--c-text)]/40">
              <span>+ {o.nom}</span>
              <span>+{o.prix.toLocaleString("fr-FR")} €</span>
            </div>
          ))}
          {totalParam && (
            <div className="flex justify-between text-sm font-medium border-t border-[var(--c-rose)]/20 pt-2 mt-2">
              <span className="text-[var(--c-rose)]">Total estimé</span>
              <span className="text-[var(--c-rose)]">
                {parseInt(totalParam).toLocaleString("fr-FR")} €
              </span>
            </div>
          )}
        </div>
      )}

      {/* Champs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {champs.map((champ) => (
          <div key={champ.id} className={cn(champ.span ? "sm:col-span-2" : "")}>
            <label className="block text-xs tracking-[0.2em] uppercase text-[var(--c-rose)]/60 mb-2">
              {champ.label}
              {champ.required && <span className="text-[var(--c-rose)] ml-1">*</span>}
            </label>
            {champ.type === "textarea" ? (
              <textarea
                rows={4}
                placeholder={champ.placeholder}
                required={champ.required}
                value={values[champ.id] ?? ""}
                onChange={(e) => handleChange(champ.id, e.target.value)}
                className="w-full bg-[#FAFAF8] border border-[var(--c-rose)]/20 text-[var(--c-text)] text-sm px-4 py-3 placeholder-[#F0EBE8]/20 focus:outline-none focus:border-[var(--c-rose)]/60 transition-colors resize-none"
              />
            ) : (
              <input
                type={champ.type}
                placeholder={champ.placeholder}
                required={champ.required}
                value={values[champ.id] ?? ""}
                onChange={(e) => handleChange(champ.id, e.target.value)}
                className="w-full bg-[#FAFAF8] border border-[var(--c-rose)]/20 text-[var(--c-text)] text-sm px-4 py-3 placeholder-[#F0EBE8]/20 focus:outline-none focus:border-[var(--c-rose)]/60 transition-colors"
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-fill w-full justify-center py-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[var(--c-text)]/30 border-t-[var(--c-text)] rounded-full animate-spin" />
            Envoi en cours…
          </span>
        ) : (
          <>
            Envoyer ma demande
            <Send size={14} />
          </>
        )}
      </button>

      <p className="text-center text-[10px] text-[var(--c-text)]/20">
        En soumettant ce formulaire vous acceptez notre{" "}
        <a href="/confidentialite" className="underline hover:text-[var(--c-rose)]/40 transition-colors">
          politique de confidentialité
        </a>
      </p>
    </form>
  );
}
