import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "placeholder");
}

const FROM = "Irzzen Productions <contact@irzzenproductions.fr>";
const ADMIN_EMAIL = "contact@irzzenproductions.fr";

// ─── Email de confirmation au client après soumission du formulaire ───────────
export async function sendConfirmationContact({
  nomClient,
  email,
  dateMariage,
  formule,
  total,
}: {
  nomClient: string;
  email: string;
  dateMariage?: string;
  formule?: string;
  total?: number;
}) {
  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Nous avons bien reçu votre demande — Irzzen Productions",
    html: emailConfirmationContact({ nomClient, dateMariage, formule, total }),
  });
}

// ─── Notification admin à chaque nouvelle demande ────────────────────────────
export async function sendNotificationAdmin({
  nomClient,
  email,
  telephone,
  dateMariage,
  lieu,
  formule,
  total,
  message,
}: {
  nomClient: string;
  email: string;
  telephone?: string;
  dateMariage?: string;
  lieu?: string;
  formule?: string;
  total?: number;
  message?: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `🔔 Nouvelle demande — ${nomClient}`,
    html: emailNotificationAdmin({ nomClient, email, telephone, dateMariage, lieu, formule, total, message }),
  });
}

// ─── Notification galerie disponible ─────────────────────────────────────────
export async function sendGalerieDisponible({
  nomClient,
  email,
  nomGalerie,
  nbPhotos,
}: {
  nomClient: string;
  email: string;
  nomGalerie: string;
  nbPhotos: number;
}) {
  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Vos photos sont prêtes ! 📸 — Irzzen Productions",
    html: emailGalerieDisponible({ nomClient, nomGalerie, nbPhotos }),
  });
}

// ─── Email bienvenue espace client ───────────────────────────────────────────
export async function sendBienvenueClient({
  nomClient,
  email,
  motDePasse,
}: {
  nomClient: string;
  email: string;
  motDePasse: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Votre espace client est prêt — Irzzen Productions",
    html: emailBienvenueClient({ nomClient, email, motDePasse }),
  });
}

// ─── Email contrat à signer ───────────────────────────────────────────────────
export async function sendContratASigner({
  nomClient,
  email,
  titreContrat,
}: {
  nomClient: string;
  email: string;
  titreContrat: string;
}) {
  return getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Votre contrat est prêt à signer — Irzzen Productions",
    html: emailContratASigner({ nomClient, titreContrat }),
  });
}

// ─── Templates HTML ───────────────────────────────────────────────────────────

function baseLayout(content: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #13111A; font-family: Georgia, serif; color: #F0EBE8; }
    .wrapper { max-width: 600px; margin: 0 auto; }
    .header { padding: 40px 40px 0; text-align: center; border-bottom: 1px solid rgba(196,165,181,0.2); padding-bottom: 32px; }
    .logo { font-size: 28px; letter-spacing: 0.15em; color: #C4A5B5; font-weight: bold; text-transform: uppercase; }
    .logo-sub { font-size: 10px; letter-spacing: 0.4em; color: rgba(196,165,181,0.5); text-transform: uppercase; margin-top: 4px; }
    .content { padding: 40px; }
    h1 { font-size: 24px; color: #F0EBE8; margin-bottom: 16px; line-height: 1.3; }
    p { font-size: 15px; color: rgba(250,250,250,0.6); line-height: 1.7; margin-bottom: 16px; }
    .highlight { color: #C4A5B5; }
    .box { background: rgba(196,165,181,0.05); border: 1px solid rgba(196,165,181,0.2); padding: 24px; margin: 24px 0; }
    .box-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
    .box-label { color: rgba(250,250,250,0.4); }
    .box-value { color: rgba(250,250,250,0.8); font-weight: bold; }
    .btn { display: inline-block; background: #C4A5B5; color: #13111A; padding: 14px 32px; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: bold; text-decoration: none; margin: 24px 0; }
    .footer { padding: 24px 40px; border-top: 1px solid rgba(196,165,181,0.1); text-align: center; }
    .footer p { font-size: 11px; color: rgba(250,250,250,0.2); }
    .divider { height: 1px; background: rgba(196,165,181,0.1); margin: 24px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">Irzzen</div>
      <div class="logo-sub">Productions</div>
    </div>
    <div class="content">${content}</div>
    <div class="footer">
      <p>© 2025 Irzzen Productions — Photographes & Vidéastes Mariage</p>
      <p style="margin-top:6px"><a href="https://www.irzzenproductions.fr" style="color:rgba(196,165,181,0.4);text-decoration:none;">www.irzzenproductions.fr</a></p>
    </div>
  </div>
</body>
</html>`;
}

function emailConfirmationContact({ nomClient, dateMariage, formule, total }: {
  nomClient: string; dateMariage?: string; formule?: string; total?: number;
}) {
  return baseLayout(`
    <h1>Merci, <span class="highlight">${nomClient}</span> !</h1>
    <p>Nous avons bien reçu votre demande et nous vous répondrons dans les <strong style="color:#F0EBE8">24 heures</strong> avec nos disponibilités et votre devis personnalisé.</p>
    ${formule ? `
    <div class="box">
      <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(196,165,181,0.6);margin-bottom:16px;">Votre sélection</div>
      ${formule ? `<div class="box-row"><span class="box-label">Formule</span><span class="box-value" style="text-transform:capitalize">${formule}</span></div>` : ""}
      ${dateMariage ? `<div class="box-row"><span class="box-label">Date du mariage</span><span class="box-value">${dateMariage}</span></div>` : ""}
      ${total ? `<div class="box-row"><span class="box-label">Total estimé</span><span class="box-value" style="color:#C4A5B5">${total.toLocaleString("fr-FR")} €</span></div>` : ""}
    </div>` : ""}
    <div class="divider"></div>
    <p>En attendant, n'hésitez pas à parcourir notre galerie ou à lire nos conseils sur le blog.</p>
    <a href="https://www.irzzenproductions.fr/galerie" class="btn">Voir notre portfolio</a>
    <p style="font-size:13px;color:rgba(250,250,250,0.3);">Une question urgente ? Répondez directement à cet email ou appelez-nous.</p>
  `);
}

function emailNotificationAdmin({ nomClient, email, telephone, dateMariage, lieu, formule, total, message }: {
  nomClient: string; email: string; telephone?: string; dateMariage?: string;
  lieu?: string; formule?: string; total?: number; message?: string;
}) {
  return baseLayout(`
    <h1>🔔 Nouvelle demande de <span class="highlight">${nomClient}</span></h1>
    <div class="box">
      <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(196,165,181,0.6);margin-bottom:16px;">Informations client</div>
      <div class="box-row"><span class="box-label">Email</span><span class="box-value">${email}</span></div>
      ${telephone ? `<div class="box-row"><span class="box-label">Téléphone</span><span class="box-value">${telephone}</span></div>` : ""}
      ${dateMariage ? `<div class="box-row"><span class="box-label">Date mariage</span><span class="box-value">${dateMariage}</span></div>` : ""}
      ${lieu ? `<div class="box-row"><span class="box-label">Lieu</span><span class="box-value">${lieu}</span></div>` : ""}
      ${formule ? `<div class="box-row"><span class="box-label">Formule</span><span class="box-value" style="text-transform:capitalize">${formule}</span></div>` : ""}
      ${total ? `<div class="box-row"><span class="box-label">Total estimé</span><span class="box-value" style="color:#C4A5B5">${total.toLocaleString("fr-FR")} €</span></div>` : ""}
    </div>
    ${message ? `<div class="box"><div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(196,165,181,0.6);margin-bottom:12px;">Message</div><p style="margin:0;color:rgba(250,250,250,0.7);font-size:14px;">${message}</p></div>` : ""}
    <a href="https://irzzen-productions.vercel.app/admin/clients" class="btn">Voir dans l'admin</a>
  `);
}

function emailGalerieDisponible({ nomClient, nomGalerie, nbPhotos }: {
  nomClient: string; nomGalerie: string; nbPhotos: number;
}) {
  return baseLayout(`
    <h1>Vos photos sont prêtes, <span class="highlight">${nomClient}</span> ! 🎉</h1>
    <p>Nous avons le plaisir de vous annoncer que votre galerie <strong style="color:#F0EBE8">${nomGalerie}</strong> est maintenant disponible dans votre espace client.</p>
    <div class="box">
      <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(196,165,181,0.6);margin-bottom:16px;">Votre galerie</div>
      <div class="box-row"><span class="box-label">Galerie</span><span class="box-value">${nomGalerie}</span></div>
      <div class="box-row"><span class="box-label">Nombre de photos</span><span class="box-value" style="color:#C4A5B5">${nbPhotos} photos</span></div>
    </div>
    <p>Toutes vos photos sont disponibles en haute résolution. Vous pouvez les télécharger, les partager avec vos proches et les conserver pour toujours.</p>
    <a href="https://irzzen-productions.vercel.app/client/galerie" class="btn">Accéder à ma galerie</a>
    <p style="font-size:13px;color:rgba(250,250,250,0.3);">Vos photos resteront disponibles indéfiniment dans votre espace client.</p>
  `);
}

function emailContratASigner({ nomClient, titreContrat }: {
  nomClient: string; titreContrat: string;
}) {
  return baseLayout(`
    <h1>Votre contrat est prêt, <span class="highlight">${nomClient}</span></h1>
    <p>Votre contrat de prestation <strong style="color:#F0EBE8">${titreContrat}</strong> est disponible dans votre espace client et attend votre signature électronique.</p>
    <div class="box">
      <p style="margin:0;font-size:13px;color:rgba(250,250,250,0.5);">La signature est simple et 100% en ligne. Il vous suffit de vous connecter à votre espace client et de saisir votre nom pour valider.</p>
    </div>
    <a href="https://irzzen-productions.vercel.app/client/contrat" class="btn">Signer mon contrat</a>
    <p style="font-size:13px;color:rgba(250,250,250,0.3);">Une fois signé, votre date est officiellement réservée. L'acompte de 15% vous sera demandé pour confirmer définitivement.</p>
  `);
}

function emailBienvenueClient({ nomClient, email, motDePasse }: {
  nomClient: string; email: string; motDePasse: string;
}) {
  return baseLayout(`
    <h1>Bienvenue dans votre espace client, <span class="highlight">${nomClient}</span> !</h1>
    <p>Votre acompte a bien été reçu et votre dossier mariage est maintenant créé. Retrouvez dans votre espace client vos photos, vidéos, contrats et communiquez directement avec notre équipe.</p>
    <div class="box">
      <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(196,165,181,0.6);margin-bottom:16px;">Vos identifiants de connexion</div>
      <div class="box-row"><span class="box-label">Adresse email</span><span class="box-value">${email}</span></div>
      <div class="box-row"><span class="box-label">Mot de passe</span><span class="box-value" style="color:#C4A5B5;font-size:26px;letter-spacing:0.2em;font-weight:bold;">${motDePasse}</span></div>
    </div>
    <div class="box" style="background:rgba(196,165,181,0.08);border-color:rgba(196,165,181,0.3);">
      <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(196,165,181,0.6);margin-bottom:12px;">✍ Votre contrat est prêt</div>
      <p style="margin:0;font-size:14px;color:rgba(250,250,250,0.7);line-height:1.6;">Votre contrat de prestation a été généré automatiquement. Connectez-vous à votre espace pour le consulter et le signer électroniquement afin de finaliser votre réservation.</p>
    </div>
    <a href="https://www.irzzenproductions.fr/client/login" class="btn">Accéder à mon espace client</a>
    <p style="font-size:13px;color:rgba(250,250,250,0.3);">Vous pouvez modifier ce mot de passe à tout moment depuis votre espace. Pour toute question, répondez directement à cet email.</p>
  `);
}

// ─── Devis ────────────────────────────────────────────────────────────────────

export async function sendDevisClient(
  devis: {
    client_email: string;
    client_nom: string;
    numero: string;
    objet: string;
    total_ttc: number;
    date_validite: string;
  },
  pdfBuffer?: Buffer | null,
) {
  return getResend().emails.send({
    from: FROM,
    to: devis.client_email,
    bcc: ADMIN_EMAIL,
    subject: `Votre devis ${devis.numero} — Irzzen Productions`,
    html: emailDevisClient(devis),
    ...(pdfBuffer ? {
      attachments: [{
        filename: `Devis_${devis.numero}.pdf`,
        content: pdfBuffer,
      }],
    } : {}),
  });
}

export async function sendDevisAdmin(devis: {
  client_email: string;
  client_nom: string;
  client_societe?: string | null;
  numero: string;
  objet: string;
  total_ttc: number;
}) {
  return getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `[Devis envoyé] ${devis.numero} — ${devis.client_nom}`,
    html: emailDevisAdmin(devis),
  });
}

function emailDevisClient(devis: {
  client_nom: string;
  numero: string;
  objet: string;
  total_ttc: number;
  date_validite: string;
}) {
  const dateVal = new Date(devis.date_validite).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return baseLayout(`
    <h1>Votre devis est prêt, <span class="highlight">${devis.client_nom}</span> !</h1>
    <p>Nous avons préparé un devis personnalisé pour votre demande. Vous trouverez ci-dessous le récapitulatif de notre proposition.</p>
    <div class="box">
      <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(196,165,181,0.6);margin-bottom:16px;">Récapitulatif du devis</div>
      <div class="box-row"><span class="box-label">Numéro</span><span class="box-value" style="font-family:monospace">${devis.numero}</span></div>
      <div class="box-row"><span class="box-label">Objet</span><span class="box-value">${devis.objet}</span></div>
      <div class="box-row"><span class="box-label">Total TTC</span><span class="box-value" style="color:#C4A5B5;font-size:20px">${Number(devis.total_ttc).toLocaleString("fr-FR")} €</span></div>
      <div class="box-row"><span class="box-label">Valable jusqu'au</span><span class="box-value">${dateVal}</span></div>
    </div>
    <p>Pour accepter ce devis ou pour toute question, répondez directement à cet email. Nous sommes disponibles du lundi au vendredi de 9h à 19h.</p>
    <a href="mailto:contact@irzzenproductions.fr" class="btn">Répondre à ce devis</a>
    <p style="font-size:13px;color:rgba(250,250,250,0.3);">Le devis complet avec le détail des prestations vous a été joint à cet email.</p>
  `);
}

function emailDevisAdmin(devis: {
  client_nom: string;
  client_email: string;
  client_societe?: string | null;
  numero: string;
  objet: string;
  total_ttc: number;
}) {
  return baseLayout(`
    <h1>Devis <span class="highlight">${devis.numero}</span> envoyé</h1>
    <p>Un devis vient d'être envoyé au client.</p>
    <div class="box">
      <div class="box-row"><span class="box-label">Client</span><span class="box-value">${devis.client_nom}${devis.client_societe ? ` (${devis.client_societe})` : ""}</span></div>
      <div class="box-row"><span class="box-label">Email</span><span class="box-value">${devis.client_email}</span></div>
      <div class="box-row"><span class="box-label">Objet</span><span class="box-value">${devis.objet}</span></div>
      <div class="box-row"><span class="box-label">Total TTC</span><span class="box-value" style="color:#C4A5B5">${Number(devis.total_ttc).toLocaleString("fr-FR")} €</span></div>
    </div>
  `);
}
