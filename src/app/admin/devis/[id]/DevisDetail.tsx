"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Download, CheckCircle, XCircle, Clock, FileText, Loader2, Trash2 } from "lucide-react";

type Ligne = { id: string; description: string; quantite: number; prix_unitaire: number };

const STATUT_STYLE: Record<string, string> = {
  brouillon: "text-[#261E14]/40 bg-[#261E14]/5",
  envoye:    "text-blue-700 bg-blue-50",
  accepte:   "text-green-700 bg-green-50",
  refuse:    "text-red-600 bg-red-50",
  expire:    "text-orange-600 bg-orange-50",
};
const STATUT_LABEL: Record<string, string> = {
  brouillon: "Brouillon", envoye: "Envoyé", accepte: "Accepté", refuse: "Refusé", expire: "Expiré",
};

// Formateur sûr pour jsPDF — évite l'espace fine U+202F du locale fr-FR
const fmtPdf = (n: number) =>
  n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 2 })
   .replace(/[  ]/g, " ");


function drawPageFooter(
  doc: any, pw: number, ph: number, mL: number, mR: number,
  MUTED: [number,number,number], RULE: [number,number,number],
  page?: number, total?: number,
) {
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.15);
  doc.line(mL, ph - 16, pw - mR, ph - 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("www.irzzenproductions.fr", mL, ph - 10);
  doc.text("Irzzen Productions  -  Studio de Production Audiovisuelle", pw / 2, ph - 10, { align: "center" });
  if (page !== undefined && total !== undefined) {
    doc.text(`${page} / ${total}`, pw - mR, ph - 10, { align: "right" });
  }
}

export function DevisDetail({ devis }: { devis: any }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [currentStatut, setCurrentStatut] = useState(devis.statut);

  const lignes: Ligne[] = devis.lignes ?? [];
  const totalHt = Number(devis.total_ht);
  const totalTtc = Number(devis.total_ttc);
  const remise = Number(devis.remise_pct ?? 0);
  const tva = Number(devis.tva_pct ?? 0);
  const totalBrut = lignes.reduce((s, l) => s + l.quantite * l.prix_unitaire, 0);
  const montantRemise = totalBrut * (remise / 100);
  const montantTva = totalHt * (tva / 100);

  // Formateur pour l'interface web (rendu navigateur, unicode OK)
  const fmt = (n: number) => n.toLocaleString("fr-FR");

  // Génère le PDF et retourne le base64 (sans télécharger)
  const generatePdfBase64 = async (): Promise<string> => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const mL = 22, mR = 22;
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const maxW = pw - mL - mR;

    // Palette site
    const DARK   : [number,number,number] = [38, 30, 20];
    const ORANGE : [number,number,number] = [232, 168, 124];
    const MUTED  : [number,number,number] = [150, 125, 100];
    const RULE   : [number,number,number] = [215, 200, 182];

    // Constantes de rythme vertical
    const LH     = 5.5;  // interligne corps 8.5pt
    const PAD    = 4;    // padding cellule haut/bas

    const hairline = () => { doc.setLineWidth(0.15); doc.setDrawColor(...RULE); };
    const accentLine = (x1: number, x2: number, yy: number) => {
      doc.setLineWidth(0.35); doc.setDrawColor(...ORANGE); doc.line(x1, yy, x2, yy);
    };
    const rule = (yy: number) => { hairline(); doc.line(mL, yy, pw - mR, yy); };

    let y = 26;

    // ── HEADER ──────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...DARK);
    doc.text("IRZZEN PRODUCTIONS", mL, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text("Studio de Production Audiovisuelle", mL, y + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    doc.text("DEVIS", pw - mR, y, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...ORANGE);
    doc.text(devis.numero, pw - mR, y + 7, { align: "right" });

    // Ligne accent unique sous le header
    accentLine(mL, pw - mR, y + 13);
    y += 22;

    // ── DEUX COLONNES D'INFO ─────────────────────────────────────────
    const colW = (maxW - 12) / 2;
    const lX = mL;
    const rX = mL + colW + 12;

    const dateVal      = new Date(devis.date_validite).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    const dateEmission = new Date(devis.created_at).toLocaleDateString("fr-FR",    { day: "2-digit", month: "long", year: "numeric" });

    // Labels de section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...ORANGE);
    doc.text("DESTINATAIRE", lX, y);
    doc.text("INFORMATIONS", rX, y);

    // Gauche : infos client
    let cy = y + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(devis.client_nom, lX, cy); cy += LH + 1;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...MUTED);
    if (devis.client_societe)  { doc.text(devis.client_societe, lX, cy); cy += LH; }
    if (devis.client_siret)    { doc.text(`SIRET : ${devis.client_siret}`, lX, cy); cy += LH; }
    if (devis.client_adresse)  {
      for (const al of (devis.client_adresse as string).split("\n")) {
        doc.text(al, lX, cy); cy += LH;
      }
    }
    doc.text(devis.client_email, lX, cy); cy += LH;
    if (devis.client_telephone) { doc.text(devis.client_telephone, lX, cy); cy += LH; }

    // Droite : dates & statut
    const metaRows: [string, string][] = [
      ["Date d'emission", dateEmission],
      ["Valable jusqu'au", dateVal],
      ["Statut", STATUT_LABEL[currentStatut] ?? currentStatut],
    ];
    let ry = y + 8;
    for (const [label, val] of metaRows) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      doc.text(label, rX, ry);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      doc.text(val, pw - mR, ry, { align: "right" });
      ry += LH + 1.5;
    }

    y = Math.max(cy, ry) + 8;
    rule(y);
    y += 9;

    // Objet
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("Objet", lX, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...DARK);
    doc.text(doc.splitTextToSize(devis.objet, maxW - 22)[0], lX + 20, y);

    y += 9;
    rule(y);
    y += 10;

    // ── TABLEAU ──────────────────────────────────────────────────────
    const cDesc = mL;
    const cQte  = pw - mR - 56;
    const cPu   = pw - mR - 28;
    const cTot  = pw - mR;

    const drawTableHeader = () => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text("DESCRIPTION", cDesc, y);
      doc.text("QTE",       cQte, y, { align: "right" });
      doc.text("PU HT",     cPu,  y, { align: "right" });
      doc.text("TOTAL HT",  cTot, y, { align: "right" });
      // Ligne sous l'en-tête — espacée proprement
      y += 5;
      hairline();
      doc.line(mL, y, pw - mR, y);
      y += PAD; // padding avant le premier item
    };

    drawTableHeader();

    for (let i = 0; i < lignes.length; i++) {
      const l = lignes[i];
      const total = l.quantite * l.prix_unitaire;
      const descW = doc.splitTextToSize(l.description || "-", cQte - cDesc - 4);
      // Hauteur réelle du bloc texte (première ligne incluse, +LH par ligne sup)
      const textH = (descW.length - 1) * LH;
      const rowH  = textH + PAD * 2; // PAD dessus (déjà consommé) + contenu + PAD dessous

      if (y + rowH + 10 > ph - 55) {
        // Footer intermédiaire, nouvelle page
        drawPageFooter(doc, pw, ph, mL, mR, MUTED, RULE);
        doc.addPage();
        y = 26;
        drawTableHeader();
      }

      // ── Texte de la ligne — baseline à y (après PAD du dessus) ────
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...DARK);
      doc.text(descW, cDesc, y);

      doc.setTextColor(...MUTED);
      doc.text(String(l.quantite), cQte, y, { align: "right" });
      doc.text(l.prix_unitaire > 0 ? `${fmtPdf(l.prix_unitaire)} EUR` : "-", cPu, y, { align: "right" });

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...DARK);
      doc.text(total > 0 ? `${fmtPdf(total)} EUR` : "-", cTot, y, { align: "right" });

      // ── Séparateur APRÈS le texte + padding bas ────────────────────
      const sepY = y + textH + PAD;
      hairline();
      doc.line(mL, sepY, pw - mR, sepY);

      // Avancer y pour le prochain item (après la ligne + padding haut suivant)
      y = sepY + PAD;
    }

    y += 4;

    // ── TOTAUX ───────────────────────────────────────────────────────
    const totLabelX = pw - mR - 90;
    const totauxRows: [string, string][] = [
      ["Total brut HT", `${fmtPdf(totalBrut)} EUR`],
    ];
    if (remise > 0) totauxRows.push([`Remise (${remise}%)`, `- ${fmtPdf(montantRemise)} EUR`]);
    totauxRows.push(["Total HT", `${fmtPdf(totalHt)} EUR`]);
    if (tva > 0) totauxRows.push([`TVA (${tva}%)`, `${fmtPdf(montantTva)} EUR`]);

    for (const [label, val] of totauxRows) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      doc.text(label, totLabelX, y);
      doc.setTextColor(...DARK);
      doc.text(val, pw - mR, y, { align: "right" });
      y += LH + 2;
    }

    // Total TTC — deux traits terracotta, rien d'autre
    y += 2;
    accentLine(totLabelX, pw - mR, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...DARK);
    doc.text("TOTAL TTC", totLabelX, y);
    doc.setTextColor(...ORANGE);
    doc.text(`${fmtPdf(totalTtc)} EUR`, pw - mR, y, { align: "right" });

    y += 5;
    accentLine(totLabelX, pw - mR, y);
    y += 18;

    // ── NOTES ────────────────────────────────────────────────────────
    if (devis.notes) {
      if (y > ph - 65) {
        drawPageFooter(doc, pw, ph, mL, mR, MUTED, RULE);
        doc.addPage(); y = 26;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(...ORANGE);
      doc.text("CONDITIONS & NOTES", mL, y);
      y += 5;
      rule(y);
      y += 8;

      const notesW = doc.splitTextToSize(devis.notes, maxW);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      doc.text(notesW, mL, y);
    }

    // ── PIED DE PAGE ─────────────────────────────────────────────────
    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      drawPageFooter(doc, pw, ph, mL, mR, MUTED, RULE, i, totalPages);
    }

    return (doc.output("datauristring") as string).split(",")[1];
  };

  const handlePdf = async () => {
    setPdfLoading(true);
    try {
      const base64 = await generatePdfBase64();
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${base64}`;
      link.download = `Devis_${devis.numero}.pdf`;
      link.click();
    } catch (e) {
      console.error("PDF error:", e);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleEnvoyer = async () => {
    setSending(true);
    setMsg(null);
    try {
      const pdfBase64 = await generatePdfBase64();
      const res = await fetch("/api/admin/envoyer-devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devisId: devis.id, pdfBase64 }),
      });
      if (res.ok) {
        setMsg({ type: "ok", text: "Devis envoyé avec succès — le PDF est en pièce jointe." });
        setCurrentStatut("envoye");
      } else {
        const d = await res.json();
        setMsg({ type: "err", text: d.error ?? "Erreur lors de l'envoi." });
      }
    } catch (e: any) {
      setMsg({ type: "err", text: e.message ?? "Erreur inattendue." });
    } finally {
      setSending(false);
    }
  };

  const changerStatut = async (statut: string) => {
    setStatusLoading(true);
    const res = await fetch("/api/admin/changer-statut-devis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devisId: devis.id, statut }),
    });
    if (res.ok) setCurrentStatut(statut);
    setStatusLoading(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const res = await fetch("/api/admin/supprimer-devis", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ devisId: devis.id }),
    });
    if (res.ok) {
      router.push("/admin/devis");
      router.refresh();
    } else {
      const d = await res.json();
      setMsg({ type: "err", text: d.error ?? "Erreur lors de la suppression." });
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const btnCls = "flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-widest uppercase transition-colors";

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Actions */}
      <div className="glass border border-[#E8A87C]/15 p-4 flex items-center gap-3 flex-wrap">
        <button
          onClick={handleEnvoyer}
          disabled={sending || currentStatut === "envoye" || currentStatut === "accepte"}
          className={`${btnCls} bg-[#E8A87C] text-[#261E14] hover:bg-[#d4905e] disabled:opacity-40`}
        >
          {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          {sending ? "Génération PDF + envoi…" : "Envoyer au client"}
        </button>
        <button
          onClick={handlePdf}
          disabled={pdfLoading}
          className={`${btnCls} border border-[#E8A87C]/30 text-[#E8A87C]/70 hover:border-[#E8A87C] hover:text-[#E8A87C]`}
        >
          {pdfLoading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          {pdfLoading ? "Génération…" : "Télécharger PDF"}
        </button>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest uppercase text-[#261E14]/25">Statut :</span>
            <span className={`text-[10px] px-2 py-0.5 uppercase tracking-widest font-medium ${STATUT_STYLE[currentStatut] ?? ""}`}>
              {STATUT_LABEL[currentStatut] ?? currentStatut}
            </span>
            {statusLoading && <Loader2 size={11} className="animate-spin text-[#261E14]/20" />}
          </div>

          {/* Supprimer */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-[#261E14]/25 hover:text-red-500 border border-transparent hover:border-red-200 transition-colors"
              title="Supprimer ce devis"
            >
              <Trash2 size={13} />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200">
              <span className="text-xs text-red-600">Supprimer définitivement ?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 size={11} className="animate-spin" /> : null}
                Oui, supprimer
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-[#261E14]/30 hover:text-[#261E14]/60 transition-colors"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {(["accepte", "refuse", "expire"] as const).map((s) => (
            <button
              key={s}
              onClick={() => changerStatut(s)}
              disabled={currentStatut === s || statusLoading}
              className="p-1.5 text-[#261E14]/20 hover:text-[#261E14]/50 transition-colors disabled:opacity-20 border border-[#261E14]/8 hover:border-[#261E14]/20"
              title={`Marquer comme ${STATUT_LABEL[s]}`}
            >
              {s === "accepte" ? <CheckCircle size={13} /> : s === "refuse" ? <XCircle size={13} /> : <Clock size={13} />}
            </button>
          ))}
        </div>
      </div>

      {msg && (
        <div className={`px-4 py-3 text-sm ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Infos client */}
        <div className="glass border border-[#E8A87C]/15 p-6">
          <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 mb-4 font-medium">Client</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#261E14]/30">Nom</dt>
              <dd className="text-[#261E14]/80 font-medium">{devis.client_nom}</dd>
            </div>
            {devis.client_societe && (
              <div className="flex justify-between">
                <dt className="text-[#261E14]/30">Société</dt>
                <dd className="text-[#261E14]/60">{devis.client_societe}</dd>
              </div>
            )}
            {devis.client_siret && (
              <div className="flex justify-between">
                <dt className="text-[#261E14]/30">SIRET</dt>
                <dd className="text-[#261E14]/60 font-mono text-xs">{devis.client_siret}</dd>
              </div>
            )}
            {devis.client_adresse && (
              <div className="flex justify-between gap-4">
                <dt className="text-[#261E14]/30 shrink-0">Adresse</dt>
                <dd className="text-[#261E14]/60 text-right whitespace-pre-wrap">{devis.client_adresse}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[#261E14]/30">Email</dt>
              <dd className="text-[#261E14]/60">{devis.client_email}</dd>
            </div>
            {devis.client_telephone && (
              <div className="flex justify-between">
                <dt className="text-[#261E14]/30">Téléphone</dt>
                <dd className="text-[#261E14]/60">{devis.client_telephone}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Infos devis */}
        <div className="glass border border-[#E8A87C]/15 p-6">
          <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 mb-4 font-medium">Informations</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#261E14]/30">Numéro</dt>
              <dd className="text-[#261E14]/80 font-mono">{devis.numero}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#261E14]/30">Émis le</dt>
              <dd className="text-[#261E14]/60">{new Date(devis.created_at).toLocaleDateString("fr-FR")}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#261E14]/30">Valable jusqu'au</dt>
              <dd className={`font-medium ${new Date(devis.date_validite) < new Date() ? "text-orange-500" : "text-[#261E14]/60"}`}>
                {new Date(devis.date_validite).toLocaleDateString("fr-FR")}
              </dd>
            </div>
            {devis.envoye_le && (
              <div className="flex justify-between">
                <dt className="text-[#261E14]/30">Envoyé le</dt>
                <dd className="text-[#261E14]/60">{new Date(devis.envoye_le).toLocaleDateString("fr-FR")}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Objet */}
      <div className="glass border border-[#E8A87C]/15 p-5">
        <div className="flex items-center gap-2">
          <FileText size={13} className="text-[#E8A87C]/40" />
          <span className="text-sm text-[#261E14]/70">{devis.objet}</span>
        </div>
      </div>

      {/* Tableau lignes */}
      <div className="glass border border-[#E8A87C]/15 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[#E8A87C]/4 text-[10px] tracking-widest uppercase text-[#261E14]/25">
          <div className="col-span-6">Description</div>
          <div className="col-span-2 text-right">Qté</div>
          <div className="col-span-2 text-right">PU HT</div>
          <div className="col-span-2 text-right">Total HT</div>
        </div>
        <div className="divide-y divide-[#E8A87C]/8">
          {lignes.map((l) => (
            <div key={l.id} className="grid grid-cols-2 md:grid-cols-12 gap-4 items-center px-6 py-3">
              <div className="col-span-2 md:col-span-6 text-sm text-[#261E14]/70">{l.description}</div>
              <div className="md:col-span-2 text-sm text-right text-[#261E14]/40">{l.quantite}</div>
              <div className="md:col-span-2 text-sm text-right text-[#261E14]/50">
                {l.prix_unitaire > 0 ? `${fmt(l.prix_unitaire)} €` : "—"}
              </div>
              <div className="md:col-span-2 text-sm text-right font-medium text-[#261E14]/70">
                {l.prix_unitaire > 0 ? `${fmt(l.quantite * l.prix_unitaire)} €` : "—"}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[#E8A87C]/10 px-6 py-4 space-y-1.5 bg-[#FDFAF7]">
          <div className="flex justify-between text-sm text-[#261E14]/40">
            <span>Total brut HT</span><span>{fmt(totalBrut)} €</span>
          </div>
          {remise > 0 && (
            <div className="flex justify-between text-sm text-red-500/60">
              <span>Remise ({remise}%)</span><span>− {fmt(montantRemise)} €</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-[#261E14]/50">
            <span>Total HT</span><span>{fmt(totalHt)} €</span>
          </div>
          {tva > 0 && (
            <div className="flex justify-between text-sm text-[#261E14]/40">
              <span>TVA ({tva}%)</span><span>{fmt(montantTva)} €</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-[#261E14] pt-2 border-t border-[#E8A87C]/15">
            <span>Total TTC</span>
            <span className="text-[#E8A87C]">{fmt(totalTtc)} €</span>
          </div>
        </div>
      </div>

      {devis.notes && (
        <div className="glass border border-[#E8A87C]/15 p-6">
          <h2 className="text-xs tracking-[0.3em] uppercase text-[#E8A87C]/60 mb-3 font-medium">Notes / Conditions</h2>
          <p className="text-sm text-[#261E14]/50 leading-relaxed whitespace-pre-wrap">{devis.notes}</p>
        </div>
      )}
    </div>
  );
}
