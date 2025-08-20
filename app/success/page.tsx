'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface SessionData {
  id: string;
  customer_email: string;
  payment_status: string;
  metadata: Record<string, string>;
  pdfUrl?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Session ID manquant');
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function verifySession() {
      try {
        console.log('🔍 Vérification session:', sessionId);
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }
        
        const data = await response.json();
        
        if (isMounted) {
          setSessionData(data);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('❌ Erreur vérification:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="text-red-500 mb-4">❌ Erreur</div>
        <p>Session Stripe introuvable.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Vérification de votre paiement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="text-red-500 mb-4">❌ Erreur</div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Paiement confirmé !
        </h1>
        <p className="text-gray-600">
          Merci pour votre confiance. Votre réservation est confirmée.
        </p>
      </div>

      {sessionData && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📋 Détails de votre réservation</h2>
          
          <div className="space-y-2">
            <p><span className="font-medium">Email :</span> {sessionData.customer_email}</p>
            <p><span className="font-medium">Mariée :</span> {sessionData.metadata?.bride_first_name || 'N/A'}</p>
            <p><span className="font-medium">Marié :</span> {sessionData.metadata?.groom_first_name || 'N/A'}</p>
            <p><span className="font-medium">Date du mariage :</span> {sessionData.metadata?.wedding_date || 'N/A'}</p>
          </div>

          {sessionData.pdfUrl ? (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">📄 Votre contrat</h3>
              <p className="text-sm text-blue-600 mb-3">
                Votre contrat PDF a été généré automatiquement.
              </p>
              <div className="flex gap-3">
                <a
                  href={sessionData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  👁️ Voir le contrat
                </a>
                <a
                  href={sessionData.pdfUrl}
                  download={`contrat-${sessionData.id}.pdf`}
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  📥 Télécharger le PDF
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">⏳ Génération en cours</h3>
              <p className="text-sm text-yellow-600">
                Votre contrat PDF est en cours de génération. Rafraîchissez la page dans quelques instants.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                🔄 Rafraîchir
              </button>
            </div>
          )}
        </div>
      )}

      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Un email de confirmation vous a été envoyé avec tous les détails.
        </p>
        <a
          href="/"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          ← Retour à l'accueil
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Chargement...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}