// app/success/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui";

// Composant qui utilise useSearchParams, enveloppé dans Suspense
function SuccessContent() {
  const searchParams = useSearchParams();
  const [verificationData, setVerificationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      setError("ID de session manquant");
      setLoading(false);
      return;
    }

    // Vérifier la session et générer le contrat
    const verifySession = async () => {
      try {
        console.log("🔍 Vérification de la session:", sessionId);
        
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
        const data = await response.json();
        
        if (!response.ok || !data.ok) {
          throw new Error(data.error || "Erreur lors de la vérification");
        }
        
        console.log("✅ Session vérifiée avec succès");
        setVerificationData(data.data);
        
      } catch (err: any) {
        console.error("❌ Erreur verification:", err);
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Traitement de votre paiement...
          </h2>
          <p className="text-gray-600">
            Nous vérifions votre paiement et générons votre contrat.
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Erreur de traitement
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href="/reservation"
            className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Retour à la réservation
          </a>
        </Card>
      </div>
    );
  }

  if (!verificationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="text-gray-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Aucune donnée trouvée
          </h2>
          <p className="text-gray-600">
            Impossible de récupérer les informations de votre réservation.
          </p>
        </Card>
      </div>
    );
  }

  const { emailPayload, pdfUrl, fileName } = verificationData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header de succès */}
          <Card className="p-8 text-center mb-8">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Paiement confirmé !
            </h1>
            <p className="text-gray-600 text-lg">
              Votre réservation a été enregistrée avec succès
            </p>
          </Card>

          {/* Détails de la réservation */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📋 Récapitulatif de votre réservation
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Couple :</span>
                <span className="font-medium">{emailPayload?.coupleName || "Non renseigné"}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Date du mariage :</span>
                <span className="font-medium">{emailPayload?.dateMariage || "Non renseignée"}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Formule :</span>
                <span className="font-medium">{emailPayload?.formule || "Non renseignée"}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total :</span>
                  <span className="font-bold text-lg">{emailPayload?.montant || 0}€</span>
                </div>
                
                <div className="flex justify-between text-green-600">
                  <span>Acompte réglé :</span>
                  <span className="font-semibold">{emailPayload?.acompte || 0}€</span>
                </div>
                
                <div className="flex justify-between text-orange-600">
                  <span>Solde restant :</span>
                  <span className="font-semibold">{emailPayload?.solde || 0}€</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Contrat PDF */}
          {pdfUrl && (
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📄 Votre contrat
              </h2>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-orange-800">
                  <strong>Votre contrat a été généré automatiquement.</strong> 
                  Vous pouvez le télécharger ci-dessous et il vous sera également envoyé par email.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-orange-600 text-white text-center px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                >
                  📥 Télécharger le contrat PDF
                </a>
                
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="flex-1 border border-orange-600 text-orange-600 text-center px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
                >
                  👁️ Voir en ligne
                </a>
              </div>
              
              {fileName && (
                <p className="text-sm text-gray-500 mt-2">
                  Nom du fichier : {fileName}
                </p>
              )}
            </Card>
          )}

          {/* Prochaines étapes */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🎯 Prochaines étapes
            </h2>
            
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-green-500 font-bold">1.</span>
                <p>
                  <strong>Contrat signé :</strong> Signez et retournez-nous votre contrat pour officialiser votre réservation.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold">2.</span>
                <p>
                  <strong>Solde restant :</strong> Le solde de {emailPayload?.solde || 0}€ sera à régler le jour J.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">3.</span>
                <p>
                  <strong>Contact :</strong> Nous vous recontacterons prochainement pour finaliser les détails de votre reportage photo.
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="text-center mt-8">
            <a
              href="/"
              className="inline-block bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              🏠 Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant de chargement pour Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <Card className="p-8 max-w-md text-center">
        <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Chargement...
        </h2>
        <p className="text-gray-600">
          Préparation de votre page de confirmation.
        </p>
      </Card>
    </div>
  );
}

// Composant principal avec Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}