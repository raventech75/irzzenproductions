// components/FAQ.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: "general" | "pricing" | "technical" | "planning" | "delivery";
  popular?: boolean;
};

const FAQ_DATA: FAQItem[] = [
  // QUESTIONS POPULAIRES
  {
    id: "pricing-deposit",
    question: "Comment fonctionne le paiement de l'acompte ?",
    answer: "L'acompte représente 15% du montant total (arrondi à la centaine supérieure) et est obligatoire pour confirmer votre réservation. Il peut être réglé par carte bancaire ou par virement. Le solde restant sera réglé le jour de votre mariage.",
    category: "pricing",
    popular: true
  },
  {
    id: "delivery-time",
    question: "Quand recevrai-je mes photos et vidéos ?",
    answer: "Les délais varient selon la formule choisie : 3-4 semaines pour l'Essentielle, 4-5 semaines pour la Classique et Complète, 5-6 semaines pour la Premium, et 6-8 semaines pour la Prestige. Nous proposons également une option de livraison express sous 48h pour une sélection de photos.",
    category: "delivery",
    popular: true
  },
  {
    id: "coverage-duration",
    question: "Puis-je modifier la durée de couverture le jour J ?",
    answer: "Les extensions de dernière minute sont possibles selon ma disponibilité, facturées 120€/heure supplémentaire. Pour éviter tout stress, je recommande de prévoir à l'avance si votre planning risque de déborder et d'ajouter l'option 'Extension soirée' lors de la réservation.",
    category: "planning",
    popular: true
  },

  // TARIFS & PAIEMENTS
  {
    id: "payment-methods",
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "J'accepte les paiements par carte bancaire (via Stripe sécurisé) et les virements bancaires. Pour les virements, le RIB est disponible sur la page dédiée. Les paiements en espèces ne sont pas acceptés pour des raisons de sécurité et de traçabilité.",
    category: "pricing"
  },
  {
    id: "price-changes",
    question: "Les tarifs peuvent-ils changer après la réservation ?",
    answer: "Une fois votre acompte versé, le tarif de votre formule est définitivement fixé, même si mes prix évoluent par la suite. Seuls les ajouts d'options supplémentaires peuvent modifier le montant total.",
    category: "pricing"
  },
  {
    id: "cancellation",
    question: "Que se passe-t-il en cas d'annulation ?",
    answer: "L'acompte n'est pas remboursable en cas d'annulation de votre part, car il me permet de réserver votre date et de refuser d'autres demandes. En cas de report de date, l'acompte reste valable sous réserve de ma disponibilité.",
    category: "pricing"
  },
  {
    id: "travel-fees",
    question: "Y a-t-il des frais de déplacement ?",
    answer: "Les déplacements dans un rayon de 50km autour de ma base sont inclus. Au-delà, des frais de transport peuvent s'appliquer (0,60€/km) ainsi qu'éventuellement des frais d'hébergement pour les mariages très éloignés. Ces frais sont précisés lors du devis.",
    category: "pricing"
  },

  // TECHNIQUE & MATÉRIEL
  {
    id: "backup-equipment",
    question: "Que se passe-t-il en cas de panne de matériel ?",
    answer: "Je travaille toujours avec du matériel en double (boîtiers, objectifs, cartes mémoire) et des batteries de secours. Toutes les photos sont enregistrées simultanément sur deux cartes mémoire pour éviter toute perte. De plus, j'ai un réseau de photographes de confiance en cas d'urgence absolue.",
    category: "technical"
  },
  {
    id: "weather-conditions",
    question: "Comment gérez-vous les conditions météo difficiles ?",
    answer: "Mon matériel professionnel est tropicalisé (résistant à la pluie légère). J'adapte la couverture selon la météo : reportage en intérieur, utilisation de parapluies transparents pour les photos de couple, recherche d'abris naturels... La pluie peut créer des ambiances très romantiques !",
    category: "technical"
  },
  {
    id: "drone-authorization",
    question: "Le drone est-il toujours possible ?",
    answer: "L'utilisation du drone dépend de plusieurs facteurs : autorisation du lieu (certains châteaux/mairies l'interdisent), conditions météo, et réglementation aérienne. Je vérifie systématiquement ces points avant votre mariage et vous informe si le drone n'est pas réalisable.",
    category: "technical"
  },
  {
    id: "low-light",
    question: "Comment gérez-vous les éclairages difficiles (églises sombres, soirées) ?",
    answer: "J'utilise des boîtiers haute sensibilité ISO et des objectifs lumineux professionnels qui permettent de photographier en lumière naturelle sans flash. Pour les soirées, j'ai également un éclairage LED discret et des flashs externes si nécessaire.",
    category: "technical"
  },

  // ORGANISATION & PLANNING
  {
    id: "planning-meeting",
    question: "Avons-nous une réunion de préparation avant le mariage ?",
    answer: "Absolument ! Nous organisons un rendez-vous (en personne ou visio) 2-3 semaines avant votre mariage pour finaliser le planning, repérer les lieux si nécessaire, et discuter de vos attentes spécifiques. C'est également le moment d'établir la liste des photos de groupe souhaitées.",
    category: "planning"
  },
  {
    id: "shot-list",
    question: "Puis-je vous donner une liste de photos que je veux absolument ?",
    answer: "Bien sûr ! Je suis à l'écoute de vos souhaits spécifiques : photos avec certaines personnes, lieux symboliques, traditions familiales... N'hésitez pas à me partager votre Pinterest ou vos inspirations. Gardez cependant une liste raisonnable pour préserver la spontanéité.",
    category: "planning"
  },
  {
    id: "timeline-delays",
    question: "Que se passe-t-il si le planning prend du retard ?",
    answer: "C'est très courant le jour J ! Je m'adapte en temps réel et réorganise ma couverture pour ne rien manquer d'important. Si les retards sont importants et dépassent ma tranche horaire, nous pouvons discuter d'une extension sur place (120€/heure supplémentaire).",
    category: "planning"
  },
  {
    id: "vendor-coordination",
    question: "Travaillez-vous en coordination avec les autres prestataires ?",
    answer: "Oui, je communique régulièrement avec votre organisatrice de mariage, le DJ, le traiteur... pour optimiser le timing et éviter de me gêner mutuellement. Une bonne coordination entre prestataires est essentielle pour la réussite de votre journée.",
    category: "planning"
  },

  // LIVRAISON & POST-PRODUCTION
  {
    id: "photo-selection",
    question: "Comment sélectionnez-vous les photos à livrer ?",
    answer: "Je fais d'abord un tri technique (suppression des doublons, photos floues, yeux fermés...) puis une sélection artistique pour ne garder que les meilleures. Je privilégie la qualité à la quantité, tout en m'assurant de couvrir tous les moments importants de votre journée.",
    category: "delivery"
  },
  {
    id: "retouching-level",
    question: "Quel niveau de retouche appliquez-vous aux photos ?",
    answer: "Toutes les photos livrées bénéficient d'une retouche de base : correction de l'exposition, des couleurs, contraste... Pour un rendu naturel et professionnel. Les retouches avancées (lissage peau, suppression d'éléments...) sont disponibles en option pour un nombre limité de photos.",
    category: "delivery"
  },
  {
    id: "extra-photos",
    question: "Puis-je avoir accès à toutes les photos, même celles non sélectionnées ?",
    answer: "Les photos non sélectionnées ne sont généralement pas disponibles car elles ne respectent pas mes standards de qualité (technique ou artistique). Cependant, si vous souhaitez une photo spécifique que vous avez vue pendant la journée, n'hésitez pas à me la décrire, je peux vérifier si elle est récupérable.",
    category: "delivery"
  },
  {
    id: "video-music",
    question: "Puis-je choisir la musique de ma vidéo de mariage ?",
    answer: "Oui, vous pouvez me suggérer des musiques qui vous tiennent à cœur. J'utilise des bibliothèques musicales libres de droits professionnelles, mais je peux adapter le style selon vos goûts : romantique, moderne, cinématographique... L'important est que la musique colle à l'ambiance de votre mariage.",
    category: "delivery"
  },

  // QUESTIONS GÉNÉRALES
  {
    id: "experience",
    question: "Depuis combien de temps photographiez-vous des mariages ?",
    answer: "Je photographie des mariages depuis plus de 8 ans avec plus de 300 célébrations à mon actif. Cette expérience me permet d'anticiper les moments importants, de gérer les imprévus avec sérénité, et de vous conseiller pour optimiser votre planning photo.",
    category: "general"
  },
  {
    id: "assistant-photographer",
    question: "Quand recommandez-vous un second photographe ?",
    answer: "Je recommande un second photographe pour les mariages de plus de 100 invités, les cérémonies avec préparatifs simultanés mariée/marié éloignés, ou simplement si vous souhaitez multiplier les angles et ne rien manquer. C'est particulièrement utile pour les moments d'émotion où plusieurs réactions sont intéressantes à capter.",
    category: "general"
  },
  {
    id: "style-description",
    question: "Comment décririez-vous votre style photographique ?",
    answer: "Mon style se veut naturel et intemporel, mélange de photojournalisme (moments spontanés) et de portraits posés élégants. J'aime capter les émotions vraies, les regards complices, tout en créant des images esthétiques que vous aimerez regarder dans 20 ans. Mes couleurs sont douces et chaleureuses.",
    category: "general"
  },
  {
    id: "availability",
    question: "Comment vérifier votre disponibilité pour ma date ?",
    answer: "Le plus simple est de me contacter via le formulaire de contact ou directement par email/téléphone en précisant votre date de mariage. Je vous confirme ma disponibilité sous 24h et peux vous proposer un rendez-vous pour discuter de votre projet.",
    category: "general"
  }
];

const CATEGORY_LABELS = {
  general: "🌟 Questions générales",
  pricing: "💰 Tarifs & Paiements", 
  technical: "📷 Technique & Matériel",
  planning: "📅 Organisation",
  delivery: "📦 Livraison & Retouches"
};

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<string>("popular");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const getFilteredFAQ = () => {
    if (activeCategory === "popular") {
      return FAQ_DATA.filter(item => item.popular);
    }
    return FAQ_DATA.filter(item => item.category === activeCategory);
  };

  const filteredFAQ = getFilteredFAQ();

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Questions fréquentes</h2>
        <p className="text-gray-600">
          Trouvez rapidement les réponses à vos questions. Si vous ne trouvez pas ce que vous cherchez, 
          n'hésitez pas à utiliser le chat en bas à droite pour me poser votre question directement !
        </p>
      </div>

      {/* Onglets de catégories */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveCategory("popular")}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
            activeCategory === "popular"
              ? "bg-orange-100 text-orange-700 border-b-2 border-orange-500"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          ⭐ Les plus demandées
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeCategory === key
                ? "bg-orange-100 text-orange-700 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Liste des questions */}
      <div className="space-y-3">
        {filteredFAQ.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl transition-all duration-200 ${
              openItems.has(item.id) 
                ? "border-orange-300 bg-orange-50" 
                : "border-gray-200 hover:border-orange-200"
            }`}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-orange-25 rounded-xl transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 pr-4">
                  {item.question}
                  {item.popular && (
                    <span className="ml-2 text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
                      Populaire
                    </span>
                  )}
                </h3>
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                  openItems.has(item.id) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {openItems.has(item.id) && (
              <div className="px-5 pb-4">
                <div className="border-t border-orange-200 pt-3">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Message d'encouragement */}
      <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💬</span>
          <div>
            <h4 className="font-semibold text-orange-800 mb-1">Une question spécifique ?</h4>
            <p className="text-sm text-orange-700">
              N'hésitez pas à utiliser le chat en bas à droite pour me poser directement vos questions. 
              Je réponds généralement sous quelques minutes pendant les heures ouvrables !
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}