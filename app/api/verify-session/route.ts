// 🔧 CORRECTION VERCEL: Forcer le rendu dynamique
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../../lib/supabase-admin";
import { createProfessionalPDF } from "@/lib/pdf-generator"; // ✅ Utiliser le VRAI générateur

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

/* -------- helpers format ---------- */
function toTitleCase(s?: string) {
  if (!s) return "";
  return s.trim().toLowerCase().replace(/\b\p{L}/gu, (m) => m.toUpperCase());
}

function fullName(first?: string, last?: string) {
  const f = toTitleCase(first);
  const l = toTitleCase(last);
  return [f, l].filter(Boolean).join(" ");
}

function humanDate(input?: string) {
  if (!input) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) return input; // DD/MM/YYYY
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [y, m, d] = input.split("-");
    return `${d}/${m}/${y}`;
  }
  const dt = new Date(input);
  return !isNaN(dt.getTime()) ? dt.toLocaleDateString("fr-FR") : input;
}

function dateForFile(input?: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(input || "")) return input!;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(input || "")) {
    const [dd, mm, yy] = (input as string).split("/");
    return `${yy}-${mm}-${dd}`;
  }
  const dt = input ? new Date(input) : new Date();
  const y = String(dt.getFullYear());
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function slug(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* -------- ROUTE ---------- */
export async function GET(req: Request) {
  try {
    console.log("🚀 [API] verify-session appelée");
    
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      console.error("❌ [API] session_id manquant");
      return NextResponse.json({ ok: false, error: "session_id manquant" }, { status: 400 });
    }

    console.log("🔥 [API] Récupération session Stripe:", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["customer_details"] });
    const md = (session.metadata || {}) as Record<string, string | undefined>;

    console.log("📊 [API] Métadonnées reçues:", Object.keys(md));

    /* === HARMONISATION DES MÉTADONNÉES pour createProfessionalPDF === */
    
    // Le générateur professionnel attend des noms spécifiques, on les mappe
    const harmonizedMetadata = {
      // Identité
      couple_name: md.couple_name || "",
      bride_first_name: md.bride_first_name || "",
      bride_last_name: md.bride_last_name || "",
      groom_first_name: md.groom_first_name || "",
      groom_last_name: md.groom_last_name || "",
      
      // Contact
      email: md.email || session.customer_details?.email || "",
      phone: md.phone || "",
      address: md.address || "",
      postalCode: md.postal_code || "",
      city: md.city || "",
      country: md.country || "",
      
      // Mariage
      wedding_date: md.wedding_date || "",
      guests: md.guests || "",
      
      // Lieux - Mapping des noms
      prepLocation: md.prep_location || "",
      prepTime: md.prep_time || "",
      mairieLocation: md.mairie_location || "",
      mairieTime: md.mairie_time || "",
      ceremonyLocation: md.ceremony_location || "",
      ceremonyTime: md.ceremony_time || "",
      receptionLocation: md.reception_location || "",
      receptionTime: md.reception_time || "",
      
      // Planning
      schedule: md.schedule || "",
      specialRequests: md.special_requests || "",
      notes: md.notes || "",
      
      // Prestation
      formula: md.formula || "Formule",
      formula_description: md.formula_description || "",
      formula_id: md.formula_id || "",
      
      // 🔧 AJOUT: Support prix personnalisé
      custom_price: md.custom_price || "",
      
      // Finances
      total_eur: md.total_eur || "0",
      deposit_eur: md.deposit_eur || "0",
      remaining_eur: md.remaining_eur || "0",
      
      // Options - Parse JSON si nécessaire
      selected_options: (() => {
        try {
          const options = md.selected_options ? JSON.parse(md.selected_options) : [];
          return Array.isArray(options) ? options.join(', ') : md.selected_options_labels || "";
        } catch {
          return md.selected_options_labels || "";
        }
      })(),
      
      // Extras - Parse JSON et formate
      extras: (() => {
        try {
          const extras = md.extras ? JSON.parse(md.extras) : [];
          if (Array.isArray(extras)) {
            return extras.map(e => `${e.label}:${e.price}`).join('|');
          }
          return "";
        } catch {
          return "";
        }
      })(),
    };

    console.log("📄 [API] Métadonnées harmonisées pour le générateur professionnel");

    /* === GÉNÉRATION PDF AVEC LE GÉNÉRATEUR PROFESSIONNEL === */
    console.log("📄 [API] Génération PDF avec createProfessionalPDF...");
    
    const pdfBytes = await createProfessionalPDF(harmonizedMetadata, session);
    
    console.log("✅ [API] PDF généré avec succès, taille:", pdfBytes.length);

    /* === UPLOAD SUPABASE === */
    console.log("📤 [API] Upload vers Supabase...");
    
    const brideFirst = harmonizedMetadata.bride_first_name || "";
    const groomFirst = harmonizedMetadata.groom_first_name || "";
    const rawWeddingDate = harmonizedMetadata.wedding_date;
    
    const namePart = slug([brideFirst, groomFirst].filter(Boolean).join("-")) || "contrat";
    const datePart = dateForFile(rawWeddingDate);
    const fileName = `${namePart}_${datePart}_${sessionId.substring(0, 8)}.pdf`;

    const { error: upErr } = await supabaseAdmin
      .storage
      .from("contrats")
      .upload(fileName, pdfBytes, { contentType: "application/pdf", upsert: true });
      
    if (upErr) {
      console.error("❌ [API] Erreur upload:", upErr);
      throw upErr;
    }

    const { data: pub } = supabaseAdmin.storage.from("contrats").getPublicUrl(fileName);
    const lienPdf = pub?.publicUrl || "";

    console.log("✅ [API] PDF uploadé:", lienPdf);

    /* === PAYLOAD EMAIL ENRICHI === */
    const couple = harmonizedMetadata.couple_name || 
      `${harmonizedMetadata.bride_first_name} & ${harmonizedMetadata.groom_first_name}`.replace(/^\s*&\s*|\s*&\s*$/g, '') || 
      "Couple";
    
    const emailPayload = {
      toEmail: harmonizedMetadata.email,
      couple: couple,
      coupleName: couple,
      dateMariage: humanDate(harmonizedMetadata.wedding_date),
      weddingDate: humanDate(harmonizedMetadata.wedding_date),
      formule: harmonizedMetadata.formula,
      formula: harmonizedMetadata.formula,
      montant: Number(harmonizedMetadata.total_eur || 0),
      totalAmount: Number(harmonizedMetadata.total_eur || 0),
      acompte: Number(harmonizedMetadata.deposit_eur || 0),
      depositAmount: Number(harmonizedMetadata.deposit_eur || 0),
      solde: Number(harmonizedMetadata.remaining_eur || 0),
      remainingAmount: Number(harmonizedMetadata.remaining_eur || 0),
      dateContrat: new Date().toLocaleDateString("fr-FR"),
      contractDate: new Date().toLocaleDateString("fr-FR"),
      lienPdf: lienPdf,
      pdfUrl: lienPdf,
      fileName: fileName,
      // Informations supplémentaires
      clientPhone: harmonizedMetadata.phone,
      clientAddress: harmonizedMetadata.address,
      clientCity: harmonizedMetadata.city,
      guests: harmonizedMetadata.guests,
      specialRequests: harmonizedMetadata.specialRequests,
      notes: harmonizedMetadata.notes,
      // 🔧 AJOUT: Support prix personnalisé dans l'email
      customPrice: harmonizedMetadata.custom_price,
      isCustomFormula: harmonizedMetadata.formula_id === "custom",
    };

    console.log("🎉 [API] Succès complet !");
    
    return NextResponse.json({
      ok: true,
      data: {
        sessionId,
        emailPayload,
        urlPdf: lienPdf,
        pdfUrl: lienPdf,
        url_pdf: lienPdf,
        fileName,
      },
    });
    
  } catch (err: any) {
    console.error("❌ [API] Erreur verify-session:", err);
    console.error("❌ [API] Stack:", err.stack);
    
    return NextResponse.json({ 
      ok: false, 
      error: err?.message || "Erreur serveur",
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }, { status: 500 });
  }
}