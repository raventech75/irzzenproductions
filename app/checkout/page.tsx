"use client";

import { useEffect, useState } from "react";

type BookingConfig = {
  formulaId: string;
  options: string[];
  extras: { label: string; price: number }[];
  pricing: { total: number; depositSuggested: number; remainingDayJ: number };
};

export default function CheckoutPage() {
  const [config, setConfig] = useState<BookingConfig | null>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [coupleName, setCoupleName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("bookingConfig");
    if (!raw) return;
    try {
      const parsed: BookingConfig = JSON.parse(raw);
      setConfig(parsed);
    } catch {
      setConfig(null);
    }
  }, []);

  const goToStripe = async () => {
    if (!config) {
      alert("Configuration manquante. Reprenez depuis la page de réservation.");
      return;
    }
    if (!email) {
      alert("Merci de renseigner l’email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { email, firstName, lastName, coupleName, weddingDate },
          config: {
            formulaId: config.formulaId,
            options: config.options,
            extras: config.extras,
          },
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || res.statusText);
      }
      const data = await res.json();
      if (!data.url) throw new Error("URL Stripe absente dans la réponse serveur.");
      // 👉 Redirige vers la page de paiement Stripe
      window.location.href = data.url;
    } catch (e: any) {
      alert(`Erreur paiement: ${e.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-orange-600">Paiement sécurisé</h1>
      <p className="mt-2 text-gray-600">
        Vos informations nous permettent de générer le contrat et de finaliser la réservation.
      </p>

      {!config && (
        <div className="mt-6 text-red-600">
          Configuration introuvable. Retournez à la{" "}
          <a href="/reservation" className="underline">
            page de réservation
          </a>
          .
        </div>
      )}

      <div className="mt-8 grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <input
          className="border rounded-xl px-3 py-2"
          type="email"
          placeholder="Email (reçu contrat + confirmation)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded-xl px-3 py-2"
          placeholder="Nom du couple (ex. Sarah & Yassine)"
          value={coupleName}
          onChange={(e) => setCoupleName(e.target.value)}
        />
        <input
          className="border rounded-xl px-3 py-2"
          type="date"
          placeholder="Date du mariage"
          value={weddingDate}
          onChange={(e) => setWeddingDate(e.target.value)}
        />
      </div>

      <div className="mt-8">
        <button
          onClick={goToStripe}
          disabled={loading || !config}
          className="rounded-xl bg-orange-500 px-5 py-3 text-white font-semibold hover:bg-orange-400 disabled:opacity-60"
        >
          {loading ? "Redirection vers Stripe…" : "Aller au paiement"}
        </button>
      </div>

      {config && (
        <p className="text-xs text-gray-500 mt-4">
          Montant estimé : {config.pricing.total.toLocaleString("fr-FR")} € — Acompte conseillé :{" "}
          {config.pricing.depositSuggested.toLocaleString("fr-FR")} €
        </p>
      )}
    </div>
  );
}