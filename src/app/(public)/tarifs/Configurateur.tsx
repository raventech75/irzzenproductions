"use client";

import { useState } from "react";
import { Check, Plus, Minus, ArrowRight, ChevronDown, ChevronUp, CreditCard, Loader2, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  formules,
  options,
  categorieLabels,
  type Formule,
  type Option,
  type Categorie,
} from "@/lib/prestations";

const categories: Categorie[] = ["photo", "video", "equipement", "postprod", "livraison"];

type InfoForm = {
  prenom_marie1: string;
  prenom_marie2: string;
  email: string;
  telephone: string;
  date_mariage: string;
  lieu: string;
};

export function Configurateur() {
  const [formuleSelectee, setFormuleSelectee] = useState<Formule>(formules[2]);
  const [optionsSelectees, setOptionsSelectees] = useState<Set<string>>(new Set());
  const [categorieOuverte, setCategorieOuverte] = useState<Categorie | null>("photo");
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [infoForm, setInfoForm] = useState<InfoForm>({
    prenom_marie1: "",
    prenom_marie2: "",
    email: "",
    telephone: "",
    date_mariage: "",
    lieu: "",
  });

  const handlePayer = () => setShowModal(true);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingStripe(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formule: formuleSelectee.nom,
          formule_id: formuleSelectee.id,
          total,
          acompte,
          options: Array.from(optionsSelectees).join(","),
          prenom_marie1: infoForm.prenom_marie1,
          prenom_marie2: infoForm.prenom_marie2,
          email_client: infoForm.email,
          telephone: infoForm.telephone,
          date_mariage: infoForm.date_mariage,
          lieu: infoForm.lieu,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Erreur lors de la redirection vers le paiement. Veuillez réessayer.");
    } finally {
      setLoadingStripe(false);
    }
  };

  const setField = (field: keyof InfoForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInfoForm((prev) => ({ ...prev, [field]: e.target.value }));

  const toggleOption = (id: string) => {
    setOptionsSelectees((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const optionsDroneIncluses = ["premium", "prestige"].includes(formuleSelectee.id);
  const optionsSeanceIncluse = formuleSelectee.id === "prestige";

  const isOptionIncluse = (opt: Option) => {
    if (opt.id === "drone" && optionsDroneIncluses) return true;
    if (opt.id === "seance-couple" && optionsSeanceIncluse) return true;
    if (opt.id === "teaser" && ["complete", "premium", "prestige"].includes(formuleSelectee.id)) return true;
    return false;
  };

  const totalOptions = options
    .filter((o) => optionsSelectees.has(o.id) && !isOptionIncluse(o))
    .reduce((sum, o) => sum + o.prix, 0);

  const total = formuleSelectee.prix + totalOptions;
  const acompte = Math.ceil((total * 0.20) / 100) * 100;

  const optionsParCategorie = (cat: Categorie) =>
    options.filter((o) => o.categorie === cat);

  const params = new URLSearchParams({
    formule: formuleSelectee.id,
    options: Array.from(optionsSelectees).join(","),
    total: total.toString(),
  });

  return (
    <section className="pb-24">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Colonne gauche : Formules + Options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Formules */}
            <div>
              <h2 className="text-xs tracking-[0.4em] uppercase text-[var(--c-rose)] mb-6 font-medium">
                1 — Choisissez votre formule
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {formules.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFormuleSelectee(f)}
                    className={cn(
                      "relative text-left p-6 border transition-all duration-300 group",
                      formuleSelectee.id === f.id
                        ? "border-[var(--c-rose)] bg-[var(--c-rose)]/5"
                        : "border-[var(--c-rose)]/15 bg-[var(--c-bg)] hover:border-[var(--c-rose)]/40"
                    )}
                  >
                    {/* Badge */}
                    {f.tag && (
                      <span className="absolute -top-2.5 left-4 px-3 py-0.5 bg-[var(--c-rose)] text-[var(--c-text)] text-[10px] font-bold tracking-widest uppercase">
                        {f.tag}
                      </span>
                    )}

                    {/* Check */}
                    {formuleSelectee.id === f.id && (
                      <div className="absolute top-4 right-4 w-5 h-5 bg-[var(--c-rose)] flex items-center justify-center">
                        <Check size={11} className="text-[var(--c-text)]" strokeWidth={3} />
                      </div>
                    )}

                    <div className="text-xs text-[var(--c-rose)]/60 tracking-widest uppercase mb-3">
                      {f.duree}
                    </div>
                    <div
                      className="text-xl font-bold text-[var(--c-text)] mb-1"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {f.nom}
                    </div>
                    <div className="text-2xl font-bold text-gradient-gold mb-3">
                      {f.prix.toLocaleString("fr-FR")} €
                    </div>
                    <p className="text-xs text-[var(--c-text)]/40 leading-relaxed">
                      {f.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Détail formule sélectionnée */}
              <div className="mt-4 glass p-6">
                <h3 className="text-sm font-medium text-[var(--c-text)] mb-4 tracking-wide">
                  Inclus dans la formule{" "}
                  <span className="text-[var(--c-rose)]">{formuleSelectee.nom}</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formuleSelectee.inclus.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--c-text)]/60">
                      <Check size={14} className="text-[var(--c-rose)] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Options */}
            <div>
              <h2 className="text-xs tracking-[0.4em] uppercase text-[var(--c-rose)] mb-6 font-medium">
                2 — Personnalisez avec des options
              </h2>
              <div className="space-y-2">
                {categories.map((cat) => {
                  const opts = optionsParCategorie(cat);
                  if (opts.length === 0) return null;
                  const isOpen = categorieOuverte === cat;
                  const nbSelectees = opts.filter((o) => optionsSelectees.has(o.id)).length;

                  return (
                    <div key={cat} className="border border-[var(--c-rose)]/15 overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[var(--c-rose)]/5 transition-colors"
                        onClick={() => setCategorieOuverte(isOpen ? null : cat)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-[var(--c-text)] tracking-wide">
                            {categorieLabels[cat]}
                          </span>
                          {nbSelectees > 0 && (
                            <span className="px-2 py-0.5 bg-[var(--c-rose)]/20 text-[var(--c-rose)] text-[10px] font-bold rounded-full">
                              {nbSelectees}
                            </span>
                          )}
                        </div>
                        {isOpen ? (
                          <ChevronUp size={16} className="text-[var(--c-rose)]/60" />
                        ) : (
                          <ChevronDown size={16} className="text-[var(--c-rose)]/60" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="border-t border-[var(--c-rose)]/10 divide-y divide-[var(--c-rose)]/10">
                          {opts.map((opt) => {
                            const incluse = isOptionIncluse(opt);
                            const selectee = optionsSelectees.has(opt.id);

                            return (
                              <div
                                key={opt.id}
                                className={cn(
                                  "flex items-center justify-between px-6 py-4",
                                  incluse ? "opacity-50" : "hover:bg-[var(--c-rose)]/3 transition-colors"
                                )}
                              >
                                <div className="flex-1 mr-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm text-[var(--c-text)] font-medium">
                                      {opt.nom}
                                    </span>
                                    {incluse && (
                                      <span className="text-[10px] tracking-widest uppercase text-[var(--c-rose)] font-medium">
                                        Inclus
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-[var(--c-text)]/40 leading-relaxed">
                                    {opt.description}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                  <span className="text-sm font-medium text-[var(--c-rose)]">
                                    +{opt.prix.toLocaleString("fr-FR")} €
                                  </span>
                                  {!incluse && (
                                    <button
                                      onClick={() => toggleOption(opt.id)}
                                      className={cn(
                                        "w-8 h-8 border flex items-center justify-center transition-all duration-200",
                                        selectee
                                          ? "bg-[var(--c-rose)] border-[var(--c-rose)] text-[var(--c-text)]"
                                          : "border-[var(--c-rose)]/40 text-[var(--c-rose)]/60 hover:border-[var(--c-rose)] hover:text-[var(--c-rose)]"
                                      )}
                                    >
                                      {selectee ? <Minus size={14} /> : <Plus size={14} />}
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Colonne droite : Récapitulatif sticky */}
          <div className="lg:sticky lg:top-28">
            <div className="glass p-8">
              <h2 className="text-xs tracking-[0.4em] uppercase text-[var(--c-rose)] mb-8 font-medium">
                Récapitulatif
              </h2>

              {/* Formule */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-[var(--c-rose)]/15">
                <div>
                  <div className="text-sm font-medium text-[var(--c-text)]">
                    Formule {formuleSelectee.nom}
                  </div>
                  <div className="text-xs text-[var(--c-text)]/40 mt-0.5">
                    {formuleSelectee.duree}
                  </div>
                </div>
                <span className="text-sm text-[var(--c-text)]">
                  {formuleSelectee.prix.toLocaleString("fr-FR")} €
                </span>
              </div>

              {/* Options sélectionnées */}
              {Array.from(optionsSelectees).length > 0 && (
                <div className="space-y-2 mb-4 pb-4 border-b border-[var(--c-rose)]/15">
                  {options
                    .filter((o) => optionsSelectees.has(o.id) && !isOptionIncluse(o))
                    .map((o) => (
                      <div key={o.id} className="flex justify-between items-center">
                        <span className="text-xs text-[var(--c-text)]/50">{o.nom}</span>
                        <span className="text-xs text-[var(--c-text)]/50">
                          +{o.prix.toLocaleString("fr-FR")} €
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[var(--c-text)]/60">Total</span>
                <span
                  className="text-3xl font-bold text-gradient-gold"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {total.toLocaleString("fr-FR")} €
                </span>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-xs text-[var(--c-text)]/30">
                  Acompte de réservation (20%)
                </span>
                <span className="text-xs text-[var(--c-rose)]/70">
                  {acompte.toLocaleString("fr-FR")} €
                </span>
              </div>

              {/* CTA principal : paiement Stripe */}
              <button
                onClick={handlePayer}
                disabled={loadingStripe}
                className="btn-fill w-full justify-center mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingStripe ? (
                  <><Loader2 size={14} className="animate-spin" /> Redirection…</>
                ) : (
                  <><CreditCard size={14} /> Payer l&apos;acompte — {acompte.toLocaleString("fr-FR")} €</>
                )}
              </button>

              {/* CTA secondaire : contact */}
              <Link
                href={`/contact?${params.toString()}`}
                className="btn-ghost w-full justify-center mb-4"
              >
                Demande de devis
                <ArrowRight size={14} />
              </Link>

              <p className="text-center text-[10px] text-[var(--c-text)]/20 leading-relaxed">
                Paiement sécurisé · Aucun remboursement en cas d&apos;annulation
              </p>

              {/* Garanties */}
              <div className="mt-8 pt-6 border-t border-[var(--c-rose)]/15 space-y-3">
                {[
                  "Équipe de 12 professionnels",
                  "15 ans d'expérience",
                  "Galerie privée incluse",
                  "Contrat signé electroniquement",
                ].map((g) => (
                  <div key={g} className="flex items-center gap-2.5 text-xs text-[var(--c-text)]/40">
                    <Check size={12} className="text-[var(--c-rose)]/70 flex-shrink-0" />
                    {g}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Question perso */}
        <div className="mt-16 text-center glass p-12">
          <h3
            className="text-3xl font-bold text-[var(--c-text)] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Vous avez un projet{" "}
            <span className="text-gradient-gold italic">sur-mesure ?</span>
          </h3>
          <p className="text-[var(--c-text)]/50 text-sm mb-8 max-w-lg mx-auto">
            Votre mariage est unique. Décrivez-nous votre vision et nous créerons
            une offre personnalisée pour vous.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 border border-[var(--c-rose)]/40 text-[var(--c-rose)] text-sm font-medium tracking-widest uppercase hover:border-[var(--c-rose)] hover:bg-[var(--c-rose)]/5 transition-all duration-300"
          >
            Demander un devis personnalisé
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Modal informations client ── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(38,30,20,0.55)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-[var(--c-bg)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header modal */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--c-rose)]/15">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--c-rose)]/60 mb-1">
                  Avant le paiement
                </p>
                <h2
                  className="text-xl font-bold text-[var(--c-text)]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Vos informations
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[var(--c-text)]/30 hover:text-[var(--c-text)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Récap formule */}
            <div className="px-8 py-4 bg-[var(--c-rose)]/5 border-b border-[var(--c-rose)]/15 flex justify-between items-center">
              <span className="text-sm text-[var(--c-text)]/60">
                Formule <strong className="text-[var(--c-text)]">{formuleSelectee.nom}</strong>
              </span>
              <span className="text-sm font-bold text-[var(--c-rose)]">
                Acompte {acompte.toLocaleString("fr-FR")} €
              </span>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleCheckout} className="px-8 py-6 space-y-5">
              <p className="text-xs text-[var(--c-text)]/40 leading-relaxed">
                Ces informations nous permettent de créer votre dossier mariage et votre espace client automatiquement après le paiement.
              </p>

              {/* Prénoms */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase text-[var(--c-rose)]/60 mb-1.5">
                    Prénom marié(e) 1 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sofia"
                    value={infoForm.prenom_marie1}
                    onChange={setField("prenom_marie1")}
                    className="w-full bg-white border border-[var(--c-rose)]/20 text-[var(--c-text)] text-sm px-3 py-2.5 placeholder-[var(--c-text)]/20 focus:outline-none focus:border-[var(--c-rose)]/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase text-[var(--c-rose)]/60 mb-1.5">
                    Prénom marié(e) 2 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Karim"
                    value={infoForm.prenom_marie2}
                    onChange={setField("prenom_marie2")}
                    className="w-full bg-white border border-[var(--c-rose)]/20 text-[var(--c-text)] text-sm px-3 py-2.5 placeholder-[var(--c-text)]/20 focus:outline-none focus:border-[var(--c-rose)]/60 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[var(--c-rose)]/60 mb-1.5">
                  Adresse email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sofia.karim@email.com"
                  value={infoForm.email}
                  onChange={setField("email")}
                  className="w-full bg-white border border-[var(--c-rose)]/20 text-[var(--c-text)] text-sm px-3 py-2.5 placeholder-[var(--c-text)]/20 focus:outline-none focus:border-[var(--c-rose)]/60 transition-colors"
                />
                <p className="text-[10px] text-[var(--c-text)]/30 mt-1">
                  Vos identifiants de connexion seront envoyés à cette adresse.
                </p>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-[var(--c-rose)]/60 mb-1.5">
                  Téléphone
                </label>
                <input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={infoForm.telephone}
                  onChange={setField("telephone")}
                  className="w-full bg-white border border-[var(--c-rose)]/20 text-[var(--c-text)] text-sm px-3 py-2.5 placeholder-[var(--c-text)]/20 focus:outline-none focus:border-[var(--c-rose)]/60 transition-colors"
                />
              </div>

              {/* Date + Lieu */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase text-[var(--c-rose)]/60 mb-1.5">
                    Date du mariage *
                  </label>
                  <input
                    type="date"
                    required
                    value={infoForm.date_mariage}
                    onChange={setField("date_mariage")}
                    className="w-full bg-white border border-[var(--c-rose)]/20 text-[var(--c-text)] text-sm px-3 py-2.5 focus:outline-none focus:border-[var(--c-rose)]/60 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.25em] uppercase text-[var(--c-rose)]/60 mb-1.5">
                    Lieu de réception
                  </label>
                  <input
                    type="text"
                    placeholder="Paris, Versailles…"
                    value={infoForm.lieu}
                    onChange={setField("lieu")}
                    className="w-full bg-white border border-[var(--c-rose)]/20 text-[var(--c-text)] text-sm px-3 py-2.5 placeholder-[var(--c-text)]/20 focus:outline-none focus:border-[var(--c-rose)]/60 transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loadingStripe}
                className="btn-fill w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingStripe ? (
                  <><Loader2 size={14} className="animate-spin" /> Redirection vers le paiement…</>
                ) : (
                  <><CreditCard size={14} /> Procéder au paiement — {acompte.toLocaleString("fr-FR")} €</>
                )}
              </button>

              <p className="text-center text-[10px] text-[var(--c-text)]/20 leading-relaxed">
                Paiement 100% sécurisé par Stripe · Aucun remboursement en cas d&apos;annulation
              </p>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
