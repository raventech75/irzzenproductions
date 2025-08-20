import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { bookingId?: string };
}) {
  const bookingId = searchParams?.bookingId;

  if (!bookingId) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        Erreur : réservation introuvable
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto py-16 text-center">Chargement…</div>
      }
    >
      <SuccessClient bookingId={bookingId} />
    </Suspense>
  );
}