// app/api/create-payment/route.ts (VERSION COMPLÈTE)
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// 📋 Copie de vos formules (depuis modules.ts)
const FORMULAS_DETAILED = [
  {
    id: "essentielle",
    name: "Formule Essentielle",
    description: "L'essentiel de votre mariage capturé avec soin et professionnalisme",
    price: 890,
    duration: "5-6 heures de couverture",
    deliverables: "150-200 photos + vidéo courte",
    deliveryTime: "3-4 semaines",
    idealFor: "Mariages intimistes, cérémonies simples, budgets maîtrisés",
  },
  {
    id: "classique",
    name: "Formule Classique", 
    description: "Reportage complet de votre journée, des préparatifs au début de soirée",
    price: 1350,
    duration: "8-10 heures de couverture",
    deliverables: "300-400 photos + vidéo 5-8 min",
    deliveryTime: "4-5 semaines",
    idealFor: "Mariages traditionnels, journées complètes, couples souhaitant un reportage détaillé",
  },
  {
    id: "complete",
    name: "Formule Complète Photo & Vidéo",
    description: "Couverture photo et vidéo par un seul professionnel polyvalent",
    price: 1500,
    duration: "8-9 heures de couverture", 
    deliverables: "300+ photos + film 8-12 min",
    deliveryTime: "4-5 semaines",
    idealFor: "Couples cherchant photo + vidéo avec un budget maîtrisé, mariages de taille moyenne",
  },
  {
    id: "premium",
    name: "Formule Premium",
    description: "Expérience photo-vidéo complète avec équipe dédiée et livrables multiples",
    price: 2200,
    duration: "12 heures de couverture",
    deliverables: "500+ photos + film 10-15 min + teaser",
    deliveryTime: "5-6 semaines",
    idealFor: "Grands mariages, couples exigeants, événements d'envergure",
  },
  {
    id: "prestige", 
    name: "Formule Prestige",
    description: "L'excellence absolue : équipe complète, matériel haut de gamme, livrables premium",
    price: 3200,
    duration: "Journée complète illimitée",
    deliverables: "800+ photos + film 20 min + multiples formats", 
    deliveryTime: "6-8 semaines",
    idealFor: "Mariages d'exception, châteaux, événements luxe, couples célébrités",
  }
];

// 📋 Options basiques (vous pouvez les importer depuis products.ts)
const OPTIONS_MAP: Record<string, { label: string; price: number }> = {
  "second-photographer": { label: "Deuxième photographe", price: 450 },
  "engagement-session": { label: "Séance engagement", price: 280 },
  "drone-footage": { label: "Captation drone", price: 350 },
  "premium-album": { label: "Album photo premium", price: 320 },
  "advanced-retouching": { label: "Retouches avancées", price: 180 },
  "express-delivery": { label: "Livraison express", price: 120 },
  "extra-hour": { label: "Heure supplémentaire", price: 120 },
  // Ajoutez vos autres options ici
};

// 🧮 Fonction de calcul des totaux
function computePricing(basePrice: number, optionPrices: number[]) {
  const total = basePrice + optionPrices.reduce((sum, price) => sum + price, 0);
  const depositSuggested = Math.ceil(total * 0.15 / 100) * 100; // 15% arrondi à la centaine sup
  const remainingDayJ = total - depositSuggested;
  
  return {
    total,
    depositSuggested,
    remainingDayJ
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔍 Données reçues pour le paiement:", JSON.stringify(body, null, 2));

    const { customer, questionnaire, config } = body;

    // Customer info
    const customerEmail = customer?.email || questionnaire?.email || "";
    const firstName = customer?.firstName || questionnaire?.brideFirstName || "";
    const lastName = customer?.lastName || questionnaire?.brideLastName || "";
    const coupleName = customer?.coupleName || `${questionnaire?.brideFirstName || ""} & ${questionnaire?.groomFirstName || ""}`.trim();
    const weddingDate = customer?.weddingDate || questionnaire?.weddingDate || "";

    // Questionnaire complet
    const q = questionnaire || {};
    
    // Configuration de la prestation
    const formulaId = config?.formulaId || "";
    const customPrice = config?.customPrice || 0;
    const selectedOptions = config?.options || [];
    const extras = config?.extras || [];

    // 🎯 Trouver les détails de la formule
    const currentFormula = FORMULAS_DETAILED.find(f => f.id === formulaId) || {
      id: "custom",
      name: "Devis personnalisé", 
      description: "Montant personnalisé",
      price: customPrice || 0
    };

    // 🧮 Calculer les totaux avec la vraie logique
    const basePrice = formulaId === "custom" ? customPrice : currentFormula.price;
    
    const optionPrices = selectedOptions.map((optionId: string) => {
      const option = OPTIONS_MAP[optionId];
      return option ? option.price : 0;
    });
    
    const extraPrices = extras.map((extra: any) => extra.price || 0);
    const allOptionPrices = [...optionPrices, ...extraPrices];
    
    const totals = computePricing(basePrice, allOptionPrices);

    console.log("💰 Calculs détaillés:", {
      formulaName: currentFormula.name,
      basePrice,
      optionPrices,
      extraPrices, 
      totals
    });

    // Montant en centimes pour Stripe (ici l'acompte)
    const amountCents = Math.round(totals.depositSuggested * 100);

    // 📋 Préparer les options sélectionnées pour le PDF
    const selectedOptionsLabels = selectedOptions.map((optionId: string) => {
      const option = OPTIONS_MAP[optionId];
      return option ? option.label : optionId;
    });

    // 📋 Métadonnées complètes pour le webhook PDF
    const metadata = {
      // Informations du couple
      bride_first_name: q.brideFirstName || "",
      bride_last_name: q.brideLastName || "",
      groom_first_name: q.groomFirstName || "",
      groom_last_name: q.groomLastName || "",
      couple_name: coupleName,
      email: customerEmail,
      phone: q.phone || "",
      
      // Adresse complète
      address: q.address || "",
      postalCode: q.postalCode || "",
      city: q.city || "",
      country: q.country || "",
      
      // Détails du mariage
      wedding_date: weddingDate,
      guests: q.guests || "",
      
      // Lieux et horaires détaillés
      prepLocation: q.prepLocation || "",
      prepTime: q.prepTime || "",
      mairieLocation: q.mairieLocation || "",
      mairieTime: q.mairieTime || "",
      ceremonyLocation: q.ceremonyLocation || "",
      ceremonyTime: q.ceremonyTime || "",
      shootingLocation: q.shootingLocation || "",
      shootingTime: q.shootingTime || "",
      receptionLocation: q.receptionLocation || "",
      receptionTime: q.receptionTime || "",
      
      // Planning et demandes spéciales
      schedule: q.schedule || "",
      specialRequests: q.specialRequests || "",
      
      // Prestation complète
      formula_id: formulaId,
      formula: currentFormula.name,
      formula_description: currentFormula.description || "",
      
      // Totaux financiers
      total_eur: totals.total.toString(),
      deposit_eur: totals.depositSuggested.toString(),
      remaining_eur: totals.remainingDayJ.toString(),
      
      // Options et extras détaillés
      selected_options: selectedOptionsLabels.join(", "),
      extras: extras.map((extra: any) => `${extra.label}:${extra.price}`).join("|"),
      
      // Nom de fichier PDF personnalisé
      pdf_filename: `contrat-${coupleName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-")}-${Date.now()}.pdf`
    };

    console.log("📋 Métadonnées complètes:", JSON.stringify(metadata, null, 2));

    // 🎯 Créer la session Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { 
              name: `Acompte mariage - ${coupleName}`,
              description: `${currentFormula.name} - Acompte ${totals.depositSuggested}€ (Total: ${totals.total}€)`
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reservation?canceled=1`,
      metadata: metadata, // 🎯 TOUTES les métadonnées pour le PDF
    });

    console.log("✅ Session Stripe créée:", session.id);
    console.log("💳 Montant facturé:", totals.depositSuggested, "€");

    return NextResponse.json({ url: session.url }, { status: 200 });
    
  } catch (error: any) {
    console.error("❌ Erreur création session:", error);
    return NextResponse.json({ 
      error: error?.message || "Erreur serveur" 
    }, { status: 500 });
  }
}