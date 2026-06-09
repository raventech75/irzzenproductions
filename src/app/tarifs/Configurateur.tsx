"use client";

import { useState } from "react";
import { Check, Plus, Minus, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
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

export function Configurateur() {
  const [formuleSelectee, setFormuleSelectee] = useState<Formule>(formules[2]);
  const [optionsSelectees, setOptionsSelectees] = useState<Set<string>>(new Set());
  const [categorieOuverte, setCategorieOuverte] = useState<Categorie | null>("photo");

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
  const acompte = Math.round(total * 0.15);

  const optionsParCategorie = (cat: Categorie) =>
    options.filter((o) => o.categorie === cat);

  const params = new URLSearchParams({
    formule: formuleSelectee.id,
    options: Array.from(optionsSelectees).join(","),
    total: total.toString(),
  });

  return (
    <section className="px-6 pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Colonne gauche : Formules + Options */}
          <div className="lg:col-span-2 space-y-8">
            {/* Formules */}
            <div>
              <h2 className="text-xs tracking-[0.4em] uppercase text-[#C9A84C] mb-6 font-medium">
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
                        ? "border-[#C9A84C] bg-[#C9A84C]/5"
                        : "border-[#C9A84C]/15 bg-[#111111] hover:border-[#C9A84C]/40"
                    )}
                  >
                    {/* Badge */}
                    {f.tag && (
                      <span className="absolute -top-2.5 left-4 px-3 py-0.5 bg-[#C9A84C] text-[#0A0A0A] text-[10px] font-bold tracking-widest uppercase">
                        {f.tag}
                      </span>
                    )}

                    {/* Check */}
                    {formuleSelectee.id === f.id && (
                      <div className="absolute top-4 right-4 w-5 h-5 bg-[#C9A84C] flex items-center justify-center">
                        <Check size={11} className="text-[#0A0A0A]" strokeWidth={3} />
                      </div>
                    )}

                    <div className="text-xs text-[#C9A84C]/60 tracking-widest uppercase mb-3">
                      {f.duree}
                    </div>
                    <div
                      className="text-xl font-bold text-[#FAFAFA] mb-1"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {f.nom}
                    </div>
                    <div className="text-2xl font-bold text-gradient-gold mb-3">
                      {f.prix.toLocaleString("fr-FR")} €
                    </div>
                    <p className="text-xs text-[#FAFAFA]/40 leading-relaxed">
                      {f.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Détail formule sélectionnée */}
              <div className="mt-4 glass p-6">
                <h3 className="text-sm font-medium text-[#FAFAFA] mb-4 tracking-wide">
                  Inclus dans la formule{" "}
                  <span className="text-[#C9A84C]">{formuleSelectee.nom}</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formuleSelectee.inclus.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#FAFAFA]/60">
                      <Check size={14} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Options */}
            <div>
              <h2 className="text-xs tracking-[0.4em] uppercase text-[#C9A84C] mb-6 font-medium">
                2 — Personnalisez avec des options
              </h2>
              <div className="space-y-2">
                {categories.map((cat) => {
                  const opts = optionsParCategorie(cat);
                  if (opts.length === 0) return null;
                  const isOpen = categorieOuverte === cat;
                  const nbSelectees = opts.filter((o) => optionsSelectees.has(o.id)).length;

                  return (
                    <div key={cat} className="border border-[#C9A84C]/15 overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#C9A84C]/5 transition-colors"
                        onClick={() => setCategorieOuverte(isOpen ? null : cat)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-[#FAFAFA] tracking-wide">
                            {categorieLabels[cat]}
                          </span>
                          {nbSelectees > 0 && (
                            <span className="px-2 py-0.5 bg-[#C9A84C]/20 text-[#C9A84C] text-[10px] font-bold rounded-full">
                              {nbSelectees}
                            </span>
                          )}
                        </div>
                        {isOpen ? (
                          <ChevronUp size={16} className="text-[#C9A84C]/60" />
                        ) : (
                          <ChevronDown size={16} className="text-[#C9A84C]/60" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="border-t border-[#C9A84C]/10 divide-y divide-[#C9A84C]/10">
                          {opts.map((opt) => {
                            const incluse = isOptionIncluse(opt);
                            const selectee = optionsSelectees.has(opt.id);

                            return (
                              <div
                                key={opt.id}
                                className={cn(
                                  "flex items-center justify-between px-6 py-4",
                                  incluse ? "opacity-50" : "hover:bg-[#C9A84C]/3 transition-colors"
                                )}
                              >
                                <div className="flex-1 mr-4">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm text-[#FAFAFA] font-medium">
                                      {opt.nom}
                                    </span>
                                    {incluse && (
                                      <span className="text-[10px] tracking-widest uppercase text-[#C9A84C] font-medium">
                                        Inclus
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-[#FAFAFA]/40 leading-relaxed">
                                    {opt.description}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                  <span className="text-sm font-medium text-[#C9A84C]">
                                    +{opt.prix.toLocaleString("fr-FR")} €
                                  </span>
                                  {!incluse && (
                                    <button
                                      onClick={() => toggleOption(opt.id)}
                                      className={cn(
                                        "w-8 h-8 border flex items-center justify-center transition-all duration-200",
                                        selectee
                                          ? "bg-[#C9A84C] border-[#C9A84C] text-[#0A0A0A]"
                                          : "border-[#C9A84C]/40 text-[#C9A84C]/60 hover:border-[#C9A84C] hover:text-[#C9A84C]"
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
              <h2 className="text-xs tracking-[0.4em] uppercase text-[#C9A84C] mb-8 font-medium">
                Récapitulatif
              </h2>

              {/* Formule */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-[#C9A84C]/15">
                <div>
                  <div className="text-sm font-medium text-[#FAFAFA]">
                    Formule {formuleSelectee.nom}
                  </div>
                  <div className="text-xs text-[#FAFAFA]/40 mt-0.5">
                    {formuleSelectee.duree}
                  </div>
                </div>
                <span className="text-sm text-[#FAFAFA]">
                  {formuleSelectee.prix.toLocaleString("fr-FR")} €
                </span>
              </div>

              {/* Options sélectionnées */}
              {Array.from(optionsSelectees).length > 0 && (
                <div className="space-y-2 mb-4 pb-4 border-b border-[#C9A84C]/15">
                  {options
                    .filter((o) => optionsSelectees.has(o.id) && !isOptionIncluse(o))
                    .map((o) => (
                      <div key={o.id} className="flex justify-between items-center">
                        <span className="text-xs text-[#FAFAFA]/50">{o.nom}</span>
                        <span className="text-xs text-[#FAFAFA]/50">
                          +{o.prix.toLocaleString("fr-FR")} €
                        </span>
                      </div>
                    ))}
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#FAFAFA]/60">Total</span>
                <span
                  className="text-3xl font-bold text-gradient-gold"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {total.toLocaleString("fr-FR")} €
                </span>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-xs text-[#FAFAFA]/30">
                  Acompte de réservation (15%)
                </span>
                <span className="text-xs text-[#C9A84C]/70">
                  {acompte.toLocaleString("fr-FR")} €
                </span>
              </div>

              {/* CTA */}
              <Link
                href={`/contact?${params.toString()}`}
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold tracking-[0.2em] uppercase hover:bg-[#E8C96A] transition-colors duration-300 gold-glow mb-4"
              >
                Réserver maintenant
                <ArrowRight size={14} />
              </Link>

              <p className="text-center text-[10px] text-[#FAFAFA]/20 leading-relaxed">
                Sans engagement · Acompte remboursable sous 30j
                <br />
                Devis personnalisé sur demande
              </p>

              {/* Garanties */}
              <div className="mt-8 pt-6 border-t border-[#C9A84C]/15 space-y-3">
                {[
                  "Équipe de 12 professionnels",
                  "15 ans d'expérience",
                  "Galerie privée incluse",
                  "Contrat signé electroniquement",
                ].map((g) => (
                  <div key={g} className="flex items-center gap-2.5 text-xs text-[#FAFAFA]/40">
                    <Check size={12} className="text-[#C9A84C]/70 flex-shrink-0" />
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
            className="text-3xl font-bold text-[#FAFAFA] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Vous avez un projet{" "}
            <span className="text-gradient-gold italic">sur-mesure ?</span>
          </h3>
          <p className="text-[#FAFAFA]/50 text-sm mb-8 max-w-lg mx-auto">
            Votre mariage est unique. Décrivez-nous votre vision et nous créerons
            une offre personnalisée pour vous.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 border border-[#C9A84C]/40 text-[#C9A84C] text-sm font-medium tracking-widest uppercase hover:border-[#C9A84C] hover:bg-[#C9A84C]/5 transition-all duration-300"
          >
            Demander un devis personnalisé
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
