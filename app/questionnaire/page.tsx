"use client";

import { useEffect, useState } from "react";
import { euros } from "@/lib/products";
import { useRouter } from "next/navigation";
import { Button, Card, Stepper } from "@/components/ui";

type Config = {
  formulaId: string;
  options: string[];
  extras: { label: string; price: number }[];
  pricing: { total: number; depositSuggested: number; remainingDayJ: number };
};

export default function Questionnaire() {
  const router = useRouter();
  const [conf, setConf] = useState<Config | null>(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"card" | "bank">("card");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [couple, setCouple] = useState("");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [ceremony, setCeremony] = useState("");
  const [reception, setReception] = useState("");
  const [address, setAddress] = useState("");
  const [wishes, setWishes] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("bookingConfig");
    if (raw) setConf(JSON.parse(raw));
  }, []);

  if (!conf) {
    return (
      <Card className="p-6">
        <p>Configuration introuvable. <a className="btn ml-3" href="/reservation">Revenir au choix des formules</a></p>
      </Card>
    );
  }

  const submit = async () => {
    if (!email || !couple || !date) { alert("Email, noms du couple et date sont requis."); return; }
    setLoading(true);
    const res = await fetch("/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        config: conf,
        customer: { email, phone, firstName, lastName, address },
        wedding: { couple, date, city, ceremony, reception, wishes },
        paymentMethod: method
      })
    });
    const data = await res.json();
    setLoading(false);
    if (data.error) { alert(data.error); return; }
    if (data.checkoutUrl) { window.location.href = data.checkoutUrl; return; }
    router.push("/merci?method=bank");
  };

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-4xl">Questionnaire</h1>
          <Stepper step={2} />
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Coordonnées</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <input className="border rounded-2xl px-3 py-2" placeholder="Email *" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="border rounded-2xl px-3 py-2" placeholder="Téléphone" value={phone} onChange={e=>setPhone(e.target.value)} />
            <input className="border rounded-2xl px-3 py-2" placeholder="Prénom" value={firstName} onChange={e=>setFirst(e.target.value)} />
            <input className="border rounded-2xl px-3 py-2" placeholder="Nom" value={lastName} onChange={e=>setLast(e.target.value)} />
            <input className="border rounded-2xl px-3 py-2 md:col-span-2" placeholder="Adresse postale" value={address} onChange={e=>setAddress(e.target.value)} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Jour du mariage</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <input className="border rounded-2xl px-3 py-2" placeholder="Noms des mariés * (ex : Justine & Feridun)" value={couple} onChange={e=>setCouple(e.target.value)} />
            <input className="border rounded-2xl px-3 py-2" type="date" placeholder="Date *" value={date} onChange={e=>setDate(e.target.value)} />
            <input className="border rounded-2xl px-3 py-2" placeholder="Ville" value={city} onChange={e=>setCity(e.target.value)} />
            <input className="border rounded-2xl px-3 py-2" placeholder="Lieu cérémonie" value={ceremony} onChange={e=>setCeremony(e.target.value)} />
            <input className="border rounded-2xl px-3 py-2 md:col-span-2" placeholder="Lieu réception" value={reception} onChange={e=>setReception(e.target.value)} />
            <textarea className="border rounded-2xl px-3 py-2 md:col-span-2" rows={5} placeholder="Souhaits / timing / personnes clés…" value={wishes} onChange={e=>setWishes(e.target.value)} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-3">Règlement</h2>
          <label className="flex items-center gap-2"><input type="radio" name="pay" checked={method==="card"} onChange={()=>setMethod("card")} /> Payer l’acompte conseillé par carte (Stripe)</label>
          <label className="flex items-center gap-2 mt-1"><input type="radio" name="pay" checked={method==="bank"} onChange={()=>setMethod("bank")} /> Je préfère le virement (RIB fourni)</label>
          <p className="text-sm opacity-70 mt-2">L’acompte (15% arrondi) n’est pas obligatoire. Le solde est à régler le jour J.</p>
          <Button onClick={submit} className="mt-4" disabled={loading}>{loading?"Envoi…":method==="card"?"Aller au paiement":"Finaliser (virement)"}</Button>
        </Card>
      </div>

      <div className="lg:sticky lg:top-20 h-max">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">Récapitulatif</h3>
          <div className="space-y-1">
            <div className="flex justify-between"><span>Total</span><b>{euros(conf.pricing.total)}</b></div>
            <div className="flex justify-between"><span>Acompte conseillé</span><b>{euros(conf.pricing.depositSuggested)}</b></div>
            <div className="flex justify-between"><span>Reste à payer le jour J</span><b>{euros(conf.pricing.remainingDayJ)}</b></div>
          </div>
        </Card>
      </div>
    </div>
  );
}