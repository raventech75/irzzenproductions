import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientShell } from "@/components/client/ClientShell";
import { Images, FileText, Calendar, CheckCircle, Clock, Download } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client/login");

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: galeries } = await supabase
    .from("galeries")
    .select("*")
    .eq("client_id", client?.id ?? "")
    .eq("actif", true);

  const { data: contrats } = await supabase
    .from("contrats")
    .select("*")
    .eq("client_id", client?.id ?? "");

  const nomClient = client
    ? `${client.prenom_marie1} & ${client.prenom_marie2}`
    : user.email ?? "Client";

  const statutLabels: Record<string, { label: string; couleur: string }> = {
    prospect:  { label: "Demande reçue",    couleur: "text-yellow-400" },
    confirme:  { label: "Réservation confirmée", couleur: "text-blue-400" },
    en_cours:  { label: "En cours",         couleur: "text-purple-400" },
    livre:     { label: "Livraison prête",  couleur: "text-[#C4A5B5]" },
    termine:   { label: "Terminé",          couleur: "text-green-400" },
  };

  const statut = client?.statut ? statutLabels[client.statut] : null;

  return (
    <ClientShell clientNom={nomClient}>
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs tracking-[0.4em] uppercase text-[#C4A5B5]/60 mb-2">
          Tableau de bord
        </p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1520]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Bonjour,{" "}
          <span className="text-gradient-gold">{client?.prenom_marie1 ?? "cher client"}</span>
        </h1>
        {client && (
          <p className="text-[#1A1520]/40 text-sm mt-2">
            Mariage le {new Date(client.date_mariage).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            {client.lieu ? ` · ${client.lieu}` : ""}
          </p>
        )}
      </div>

      {/* Statut */}
      {statut && (
        <div className="mb-8 glass p-5 flex items-center gap-4 border border-[#C4A5B5]/20">
          <div className="w-2 h-2 rounded-full bg-[#C4A5B5] flex-shrink-0" />
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-[#1A1520]/40">Statut de votre dossier</span>
            <div className={`text-sm font-medium mt-0.5 ${statut.couleur}`}>{statut.label}</div>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 border border-[#C4A5B5]/30 flex items-center justify-center text-[#C4A5B5]">
              <Images size={15} />
            </div>
            <span className="text-xs tracking-[0.2em] uppercase text-[#1A1520]/40">Galeries</span>
          </div>
          <div className="text-3xl font-bold text-[#1A1520]" style={{ fontFamily: "var(--font-playfair)" }}>
            {galeries?.length ?? 0}
          </div>
          <div className="text-xs text-[#1A1520]/30 mt-1">disponible{(galeries?.length ?? 0) > 1 ? "s" : ""}</div>
        </div>

        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 border border-[#C4A5B5]/30 flex items-center justify-center text-[#C4A5B5]">
              <FileText size={15} />
            </div>
            <span className="text-xs tracking-[0.2em] uppercase text-[#1A1520]/40">Contrat</span>
          </div>
          <div className="text-3xl font-bold text-[#1A1520]" style={{ fontFamily: "var(--font-playfair)" }}>
            {contrats?.find((c) => c.statut === "signe") ? (
              <span className="text-green-400 text-lg">Signé</span>
            ) : contrats?.length ? (
              <span className="text-yellow-400 text-lg">En attente</span>
            ) : (
              <span className="text-[#1A1520]/30 text-lg">—</span>
            )}
          </div>
          <div className="text-xs text-[#1A1520]/30 mt-1">signature électronique</div>
        </div>

        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 border border-[#C4A5B5]/30 flex items-center justify-center text-[#C4A5B5]">
              <Calendar size={15} />
            </div>
            <span className="text-xs tracking-[0.2em] uppercase text-[#1A1520]/40">Formule</span>
          </div>
          <div className="text-xl font-bold text-[#C4A5B5] capitalize" style={{ fontFamily: "var(--font-playfair)" }}>
            {client?.formule ?? "—"}
          </div>
          <div className="text-xs text-[#1A1520]/30 mt-1">votre prestation</div>
        </div>
      </div>

      {/* Galeries disponibles */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs tracking-[0.4em] uppercase text-[#C4A5B5]/60 font-medium">
            Vos galeries
          </h2>
          <Link href="/client/galerie" className="text-xs text-[#C4A5B5]/60 hover:text-[#C4A5B5] transition-colors tracking-wide">
            Voir tout →
          </Link>
        </div>

        {galeries && galeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {galeries.map((g) => (
              <Link
                key={g.id}
                href={`/client/galerie/${g.id}`}
                className="glass p-5 flex items-center justify-between group hover:border-[#C4A5B5]/40 transition-all border border-[#C4A5B5]/15"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#C4A5B5]/10 border border-[#C4A5B5]/20 flex items-center justify-center text-[#C4A5B5]">
                    <Images size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#1A1520]">{g.nom}</div>
                    <div className="text-xs text-[#1A1520]/30 mt-0.5">
                      {g.nb_fichiers} fichier{g.nb_fichiers > 1 ? "s" : ""} ·{" "}
                      {(g.taille_totale / 1024 / 1024 / 1024).toFixed(1)} Go
                    </div>
                  </div>
                </div>
                <Download size={15} className="text-[#C4A5B5]/40 group-hover:text-[#C4A5B5] transition-colors" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass p-10 text-center">
            <Clock size={32} className="text-[#C4A5B5]/20 mx-auto mb-4" />
            <p className="text-sm text-[#1A1520]/40">
              Votre galerie sera disponible ici dès que les photos seront prêtes.
            </p>
            <p className="text-xs text-[#1A1520]/20 mt-2">Délai : 4 à 6 semaines après votre mariage</p>
          </div>
        )}
      </div>

      {/* Contrat */}
      {contrats && contrats.length > 0 && (
        <div>
          <h2 className="text-xs tracking-[0.4em] uppercase text-[#C4A5B5]/60 font-medium mb-5">
            Votre contrat
          </h2>
          <div className="space-y-3">
            {contrats.map((c) => (
              <div key={c.id} className="glass p-5 flex items-center justify-between border border-[#C4A5B5]/15">
                <div className="flex items-center gap-4">
                  <FileText size={16} className="text-[#C4A5B5]/60" />
                  <div>
                    <div className="text-sm font-medium text-[#1A1520]">{c.titre}</div>
                    <div className="text-xs mt-0.5">
                      {c.statut === "signe" ? (
                        <span className="text-green-400 flex items-center gap-1">
                          <CheckCircle size={11} /> Signé le {c.signe_le ? new Date(c.signe_le).toLocaleDateString("fr-FR") : ""}
                        </span>
                      ) : (
                        <span className="text-yellow-400">En attente de signature</span>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href="/client/contrat"
                  className="text-xs px-4 py-2 border border-[#C4A5B5]/40 text-[#C4A5B5] hover:bg-[#C4A5B5]/10 transition-colors tracking-widest uppercase"
                >
                  {c.statut === "signe" ? "Voir" : "Signer"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </ClientShell>
  );
}
