import Link from "next/link";
import { Button, Card, Stepper } from "@/components/ui";

export default function Merci({ searchParams }: { searchParams: Record<string,string | string[] | undefined> }) {
  const byCard = !!searchParams?.session_id;
  const byBank = searchParams?.method === "bank";
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Merci !</h1>
        <Stepper step={3} />
      </div>
      <Card className="p-8 text-center space-y-4">
        {byCard && (
          <p>Votre acompte par carte a été pris en compte. Un email de confirmation avec récapitulatif et conditions vous sera envoyé.</p>
        )}
        {byBank && (
          <>
            <p>Votre demande est enregistrée. Vous allez recevoir un email avec le récapitulatif et notre RIB.</p>
            <p className="opacity-70 text-sm">Rappel : aucune annulation recevable ; acompte non remboursable ; livraison ≤ 6 mois.</p>
            <a className="btn" href="/rib.pdf" target="_blank" rel="noreferrer">Télécharger le RIB</a>
          </>
        )}
        {!byCard && !byBank && <p>Votre réservation a bien été prise en compte.</p>}
        <div className="pt-2"><Button as={Link} href="/">Retour à l’accueil</Button></div>
      </Card>
    </div>
  );
}