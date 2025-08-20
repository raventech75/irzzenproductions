// app/success/page.tsx
import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto text-center py-20 text-gray-500">
          Chargement de votre confirmation…
        </div>
      }
    >
      <SuccessClient />
    </Suspense>
  );
}