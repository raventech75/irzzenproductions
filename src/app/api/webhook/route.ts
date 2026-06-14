import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendBienvenueClient, sendNotificationAdmin } from "@/lib/email";
import { formules, options as allOptions } from "@/lib/prestations";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith("sk_test_REMPLACER")) throw new Error("Clé Stripe non configurée");
  return new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
}

function genererCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Formate une date "YYYY-MM-DD" en "15 septembre 2025" */
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

/** Résout les IDs d'options en noms lisibles */
function resolveOptions(optionIds: string): string {
  if (!optionIds) return "Aucune option";
  const ids = optionIds.split(",").filter(Boolean);
  if (ids.length === 0) return "Aucune option";
  const noms = ids.map((id) => allOptions.find((o) => o.id === id)?.nom ?? id);
  return noms.join(", ");
}

/** Génère le contrat pré-rempli */
function genererContrat({
  prenomMarie1,
  prenomMarie2,
  formuleNom,
  optionsTexte,
  total,
  acompte,
  dateMariage,
  lieu,
}: {
  prenomMarie1: string;
  prenomMarie2: string;
  formuleNom: string;
  optionsTexte: string;
  total: string;
  acompte: string;
  dateMariage: string;
  lieu: string;
}) {
  const formule = formules.find((f) => f.nom === formuleNom || f.id === formuleNom);
  const inclusTexte = formule ? formule.inclus.map((i) => `  - ${i}`).join("\n") : "";
  const dateLisible = formatDate(dateMariage);

  return `CONTRAT DE PRESTATION DE SERVICES PHOTOGRAPHIQUES ET VIDÉOGRAPHIQUES

Entre les soussignés :
Irzzen Productions — SIRET [SIRET], ci-après dénommé "le Prestataire"
Et ${prenomMarie1} & ${prenomMarie2}, ci-après dénommés "les Clients"

────────────────────────────────────────────────────────

ARTICLE 1 — OBJET DU CONTRAT
Le Prestataire s'engage à assurer la couverture photo et/ou vidéo du mariage
des Clients selon les conditions définies ci-après.

ARTICLE 2 — DATE ET LIEU
Date du mariage : ${dateLisible || "[À COMPLÉTER]"}
Lieu de la cérémonie : ${lieu || "[À COMPLÉTER]"}

ARTICLE 3 — PRESTATIONS
Formule sélectionnée : ${formuleNom}
${inclusTexte ? `Prestations incluses :\n${inclusTexte}` : ""}
Options supplémentaires : ${optionsTexte}

ARTICLE 4 — TARIFS ET MODALITÉS DE PAIEMENT
Montant total TTC : ${Number(total).toLocaleString("fr-FR")} €
Acompte de réservation (20%) déjà réglé : ${Number(acompte).toLocaleString("fr-FR")} €
Solde restant dû : ${(Number(total) - Number(acompte)).toLocaleString("fr-FR")} €
— Le solde sera exigible 30 jours avant la date du mariage.
— L'acompte de réservation n'est pas remboursable en cas d'annulation par les Clients.

ARTICLE 5 — LIVRAISON
Les photos retouchées seront livrées via la galerie privée en ligne dans les délais
propres à la formule choisie.
Les vidéos seront livrées via la galerie privée ou un lien de téléchargement dédié.

ARTICLE 6 — DROITS D'AUTEUR
Le Prestataire conserve les droits d'auteur sur l'ensemble des images et vidéos produites.
Les Clients bénéficient d'une licence d'utilisation personnelle non commerciale.
Toute utilisation commerciale ou publication sur des supports tiers requiert l'accord
écrit préalable du Prestataire.

ARTICLE 7 — RESPONSABILITÉS
En cas d'événement de force majeure (maladie, accident, catastrophe naturelle), le
Prestataire s'engage à proposer un remplaçant de niveau équivalent ou, à défaut,
à rembourser intégralement les sommes versées.

ARTICLE 8 — SIGNATURE ÉLECTRONIQUE
La signature électronique des présentes vaut acceptation pleine et entière des conditions.
Les Clients reconnaissent avoir pris connaissance de l'ensemble des articles ci-dessus.

────────────────────────────────────────────────────────
Fait à Paris, le ${new Date().toLocaleDateString("fr-FR")}`;
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // ── Extraction des métadonnées ──────────────────────────────────────────
    const meta = session.metadata ?? {};
    const prenomMarie1 = meta.prenom_marie1 || session.customer_details?.name || "Marié(e) 1";
    const prenomMarie2 = meta.prenom_marie2 || "Marié(e) 2";
    const emailClient  = meta.email_client  || session.customer_details?.email || "";
    const telephone    = meta.telephone  || "";
    const dateMariage  = meta.date_mariage || "";
    const lieu         = meta.lieu        || "";
    const formuleNom   = meta.formule     || "";
    const totalStr     = meta.total       || "0";
    const acompteStr   = meta.acompte     || "0";
    const optionsStr   = meta.options     || "";
    const nomCouple    = `${prenomMarie1} & ${prenomMarie2}`;

    if (!emailClient) {
      console.error("Webhook: email client manquant");
      return NextResponse.json({ received: true });
    }

    const adminSupabase = createAdminClient();

    try {
      // ── 1. Vérification idempotence : client déjà créé ? ──────────────────
      const { data: clientExistant } = await adminSupabase
        .from("clients")
        .select("id, user_id")
        .eq("email", emailClient)
        .maybeSingle();

      let clientId: string;

      if (clientExistant) {
        clientId = clientExistant.id;
        console.log(`Webhook: client existant ${clientId}`);
      } else {
        // ── 2. Création de la fiche client ────────────────────────────────
        const { data: newClient, error: clientError } = await adminSupabase
          .from("clients")
          .insert({
            prenom_marie1: prenomMarie1,
            prenom_marie2: prenomMarie2,
            email: emailClient,
            telephone,
            date_mariage: dateMariage || null,
            lieu,
            formule: formuleNom,
            total_ttc: Number(totalStr),
            acompte_verse: true,
            statut: "confirme",
            notes_internes: `Réservation automatique via Stripe. Session : ${session.id}`,
          })
          .select("id")
          .single();

        if (clientError || !newClient) {
          console.error("Webhook: erreur création client:", clientError);
          return NextResponse.json({ received: true });
        }
        clientId = newClient.id;
      }

      // ── 3. Création du compte Supabase Auth ───────────────────────────────
      const motDePasse = genererCode();
      let authUserId: string;

      const { data: { users } } = await adminSupabase.auth.admin.listUsers();
      const existingUser = users.find((u) => u.email === emailClient);

      if (existingUser) {
        authUserId = existingUser.id;
        await adminSupabase.auth.admin.updateUserById(authUserId, { password: motDePasse });
      } else {
        const { data: created, error: createError } = await adminSupabase.auth.admin.createUser({
          email: emailClient,
          password: motDePasse,
          email_confirm: true,
        });
        if (createError || !created.user) {
          console.error("Webhook: erreur création auth user:", createError);
          return NextResponse.json({ received: true });
        }
        authUserId = created.user.id;
      }

      // ── 4. Liaison user_id ↔ client ───────────────────────────────────────
      await adminSupabase
        .from("clients")
        .update({ user_id: authUserId })
        .eq("id", clientId);

      // ── 5. Génération et insertion du contrat ─────────────────────────────
      const optionsTexte = resolveOptions(optionsStr);
      const contenuContrat = genererContrat({
        prenomMarie1,
        prenomMarie2,
        formuleNom,
        optionsTexte,
        total: totalStr,
        acompte: acompteStr,
        dateMariage,
        lieu,
      });
      const titreContrat = `Contrat Mariage ${nomCouple}${dateMariage ? ` — ${formatDate(dateMariage)}` : ""}`;

      console.log(`Webhook: insertion contrat pour client_id=${clientId}, titre="${titreContrat}"`);

      const { data: contratData, error: contratError } = await (adminSupabase as any)
        .from("contrats")
        .insert({
          client_id: clientId,
          titre: titreContrat,
          contenu: contenuContrat,
          statut: "en_attente",
        })
        .select("id")
        .single();

      if (contratError) {
        console.error("Webhook: erreur création contrat:", JSON.stringify(contratError));
      } else {
        console.log(`Webhook: contrat créé id=${contratData?.id}`);
      }

      // ── 6. Email de bienvenue avec identifiants ───────────────────────────
      await sendBienvenueClient({
        nomClient: nomCouple,
        email: emailClient,
        motDePasse,
      });

      // ── 7. Notification admin ─────────────────────────────────────────────
      await sendNotificationAdmin({
        nomClient: nomCouple,
        email: emailClient,
        telephone,
        dateMariage: dateMariage ? formatDate(dateMariage) : undefined,
        lieu,
        formule: formuleNom,
        total: Number(totalStr),
        message: `Acompte reçu via Stripe (${acompteStr} €). Dossier et espace client créés automatiquement. Session : ${session.id}`,
      });

      console.log(`Webhook: workflow complet pour ${nomCouple} (${emailClient})`);
    } catch (err) {
      console.error("Webhook: erreur inattendue:", err);
    }
  }

  return NextResponse.json({ received: true });
}
