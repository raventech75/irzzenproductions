import Image from "next/image";
import { Button, Card } from "@/components/ui";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="grid md:grid-cols-[1.2fr_.8fr] gap-8 items-center">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-semibold leading-tight">Mariages capturés <span className="text-[hsl(var(--p))]">avec grâce</span> et douceur</h1>
          <p className="text-lg opacity-80">Un accompagnement d’atelier : discret, attentif, et toujours à la recherche de lumière naturelle. Réservez en ligne en quelques minutes.</p>
          <div className="flex gap-3">
            <Button as="a" href="/reservation">Choisir une formule</Button>
            <Button as="a" href="#formules" className="bg-ink/90">Voir nos offres</Button>
          </div>
        </div>
        <Card className="overflow-hidden">
          <Image src="/formules-1.jpg" alt="Formules" width={1400} height={1800} className="w-full h-auto" />
        </Card>
      </section>

      <section id="formules" className="grid md:grid-cols-2 gap-6">
        <Card className="overflow-hidden"><Image src="/formules-1.jpg" alt="Formules 1" width={1200} height={1700} /></Card>
        <Card className="overflow-hidden"><Image src="/formules-2.jpg" alt="Formules 2" width={1200} height={1700} /></Card>
      </section>

      <section className="text-center pt-4">
        <p className="opacity-70">Acompte conseillé : 15% arrondi à la centaine supérieure (non obligatoire). Solde le jour J.</p>
      </section>
    </div>
  );
}