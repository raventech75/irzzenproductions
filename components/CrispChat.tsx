// components/CrispChat.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
    CRISP_TOKEN_ID?: string;
  }
}

const CRISP_WEBSITE_ID = "e25fb5b7-9d8c-4d09-bc72-d4d29d3dbb69";

interface CrispChatProps {
  userEmail?: string;
  userFirstName?: string;
  userLastName?: string;
  weddingDate?: string;
  currentFormula?: string;
  estimatedBudget?: number;
}

export default function CrispChat({
  userEmail,
  userFirstName,
  userLastName,
  weddingDate,
  currentFormula,
  estimatedBudget
}: CrispChatProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialiser Crisp
    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

    // Charger le script Crisp si pas déjà fait
    if (!document.querySelector('script[src*="crisp.chat"]')) {
      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      script.onload = () => {
        console.log("✅ Crisp Chat chargé avec succès");
        configureCrisp();
      };
      document.head.appendChild(script);
    } else {
      configureCrisp();
    }

    function configureCrisp() {
      // Configuration de sécurité
      window.$crisp.push(["safe", true]);

      // Personnalisation de l'apparence
      window.$crisp.push(["config", "color:theme", "#EA580C"]);
      window.$crisp.push(["config", "position:reverse", false]);
      
      // Messages de bienvenue contextuels selon la page
      const welcomeMessages: Record<string, string> = {
        '/': "👋 Bienvenue ! Je suis photographe de mariage. Comment puis-je vous aider ?",
        '/reservation': "💍 Je vois que vous configurez votre prestation ! Des questions sur les formules ?",
        '/portfolio': "📸 Vous regardez mon travail ? N'hésitez pas à me dire quel style vous plaît !",
        '/contact': "📞 Parfait ! Je suis là pour répondre à toutes vos questions directement."
      };

      const welcomeMessage = welcomeMessages[pathname] 
        || "👋 Bienvenue ! Je suis photographe de mariage professionnel. Comment puis-je vous aider ?";

      window.$crisp.push(["config", "chat:welcome", welcomeMessage]);

      // Configuration des informations utilisateur si disponibles
      if (userEmail) {
        window.$crisp.push(["set", "user:email", userEmail]);
      }
      
      if (userFirstName || userLastName) {
        const fullName = `${userFirstName || ''} ${userLastName || ''}`.trim();
        if (fullName) {
          window.$crisp.push(["set", "user:nickname", fullName]);
        }
      }

      // Données de session pour le contexte business
      const sessionData: [string, string][] = [];
      
      if (weddingDate) {
        sessionData.push(["date_mariage", weddingDate]);
      }
      
      if (currentFormula) {
        sessionData.push(["formule_interesse", currentFormula]);
      }
      
      if (estimatedBudget) {
        sessionData.push(["budget_estime", `${estimatedBudget}€`]);
      }
      
      sessionData.push(["page_courante", pathname]);
      sessionData.push(["timestamp_visite", new Date().toISOString()]);

      if (sessionData.length > 0) {
        window.$crisp.push(["set", "session:data", sessionData]);
      }

      // Événements pour tracking
      window.$crisp.push(["on", "chat:initiated", function() {
        console.log("💬 Chat démarré par l'utilisateur");
      }]);

      window.$crisp.push(["on", "message:sent", function() {
        console.log("📤 Message envoyé par l'utilisateur");
      }]);

      window.$crisp.push(["on", "message:received", function() {
        console.log("📨 Message reçu du photographe");
      }]);

      // Configuration des segments pour cibler les prospects
      if (pathname === '/reservation') {
        window.$crisp.push(["set", "session:segments", [["prospect_actif"]]]);
      } else if (pathname === '/portfolio') {
        window.$crisp.push(["set", "session:segments", [["interesse_portfolio"]]]);
      }
    }
  }, [pathname, userEmail, userFirstName, userLastName, weddingDate, currentFormula, estimatedBudget]);

  // Méthodes utilitaires pour interagir avec Crisp depuis votre app
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).openCrispChat = () => {
        window.$crisp.push(["do", "chat:open"]);
      };

      (window as any).updateCrispUser = (email: string, name?: string) => {
        window.$crisp.push(["set", "user:email", email]);
        if (name) {
          window.$crisp.push(["set", "user:nickname", name]);
        }
      };
    }
  }, []);

  return null;
}

// Hook personnalisé pour utiliser Crisp dans vos composants
export function useCrispChat() {
  const openChat = () => {
    if (typeof window !== 'undefined' && window.$crisp) {
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  const closeChat = () => {
    if (typeof window !== 'undefined' && window.$crisp) {
      window.$crisp.push(["do", "chat:close"]);
    }
  };

  const updateUser = (email: string, name?: string) => {
    if (typeof window !== 'undefined' && window.$crisp) {
      window.$crisp.push(["set", "user:email", email]);
      if (name) {
        window.$crisp.push(["set", "user:nickname", name]);
      }
    }
  };

  return {
    openChat,
    closeChat,
    updateUser
  };
}