// app/success/page.tsx
import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-16 text-center">Chargement…</div>}>
      <SuccessClient />
    </Suspense>
  );
}