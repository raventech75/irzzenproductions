// app/rib/page.tsx
"use client";

import { useState } from "react";

const RIB = {
  IBAN: "FR76 3000 4000 5000 6000 7000 890",
  BIC: "BNPAFRPPXXX",
  BANK: "BNP Paribas",
  HOLDER: "Irzzen Productions",
};

export default function RIBPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (txt: string, label: string) => {
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(label);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  return (
    <div className="max-w-lg mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold text-orange-600 text-center">Coordonnées bancaires</h1>
      <p className="mt-2 text-center text-gray-600">
        Vous pouvez réaliser un virement avec les informations ci-dessous.
      </p>

      <div className="mt-8 space-y-3 bg-white rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">IBAN</div>
            <div className="font-mono">{RIB.IBAN}</div>
          </div>
          <button
            onClick={() => copy(RIB.IBAN, "IBAN")}
            className="rounded-lg border px-3 py-1 text-sm hover:bg-orange-50"
          >
            {copied === "IBAN" ? "Copié ✓" : "Copier"}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">BIC</div>
            <div className="font-mono">{RIB.BIC}</div>
          </div>
          <button
            onClick={() => copy(RIB.BIC, "BIC")}
            className="rounded-lg border px-3 py-1 text-sm hover:bg-orange-50"
          >
            {copied === "BIC" ? "Copié ✓" : "Copier"}
          </button>
        </div>

        <div>
          <div className="text-sm text-gray-500">Banque</div>
          <div>{RIB.BANK}</div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Titulaire</div>
          <div>{RIB.HOLDER}</div>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-500 text-center">
        Merci d’indiquer en référence : votre nom + date du mariage.
      </p>
    </div>
  );
}