import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams?.session_id;

  if (!sessionId) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        Erreur : session Stripe introuvable.
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-16 text-center">Chargement…</div>}>
      <SuccessClient sessionId={sessionId} />
    </Suspense>
  );
}