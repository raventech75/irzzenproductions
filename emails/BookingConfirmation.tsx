import * as React from "react";
import { Html, Head, Preview, Body, Container, Section, Text, Link } from "@react-email/components";

export default function BookingConfirmation({
  couple,
  total,
  deposit,
  remaining,
  driveLink
}: {
  couple: string;
  total: number;
  deposit: number;
  remaining: number;
  driveLink?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Réservation Irzzenproductions confirmée</Preview>
      <Body style={{ background: "#ffffff", margin: 0, fontFamily: "ui-sans-serif, system-ui" }}>
        <Container style={{ padding: "32px 20px" }}>
          <Section>
            <Text style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
              Merci {couple} !
            </Text>
            <Text>Votre processus de réservation est terminé.</Text>
            <Text>Récapitulatif :</Text>
            <Text>Total TTC : {total.toLocaleString("fr-FR")} €</Text>
            <Text>Acompte conseillé (non obligatoire) : {deposit.toLocaleString("fr-FR")} €</Text>
            <Text>Reste à payer le jour J : {remaining.toLocaleString("fr-FR")} €</Text>
            {driveLink && (
              <Text>
                Dossier partagé : <Link href={driveLink}>{driveLink}</Link>
              </Text>
            )}
          </Section>

          <Section style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: 600 }}>Conditions de règlement</Text>
            <Text>
              • Aucune annulation, pour quelque raison que ce soit, n’est recevable. <br />
              • L’acompte n’est en aucun cas remboursable. <br />
              • La livraison des fichiers digitaux intervient au plus tard dans un délai de 6 mois. <br />
              • Tout solde non réglé à l’échéance convenue suspend la livraison. <br />
            </Text>
            <Text style={{ fontSize: 12, color: "#6b7280" }}>
              Irzzenproductions — 15+ ans d’expérience — Équipe de 12 professionnels.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}