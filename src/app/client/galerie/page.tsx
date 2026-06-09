import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientShell } from "@/components/client/ClientShell";
import { Images, Clock } from "lucide-react";
import Link from "next/link";

export default async function GalerieClientPage() {
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
    .eq("actif", true)
    .order("created_at", { ascending: false });

  const nomClient = client
    ? `${client.prenom_marie1} & ${client.prenom_marie2}`
    : user.email ?? "Client";

  return (
    <ClientShell clientNom={nomClient}>
      <div className="mb-10">
        <p className="text-xs tracking-[0.4em] uppercase text-[#C4A5B5]/60 mb-2">Espace Client</p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#1A1520]"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Mes <span className="text-gradient-gold">galeries</span>
        </h1>
        <p className="text-[#1A1520]/40 text-sm mt-2">
          Téléchargez vos photos et vidéos en haute résolution
        </p>
      </div>

      {galeries && galeries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {galeries.map((g) => (
            <Link
              key={g.id}
              href={`/client/galerie/${g.id}`}
              className="group glass border border-[#C4A5B5]/15 hover:border-[#C4A5B5]/40 transition-all overflow-hidden"
            >
              {/* Preview placeholder */}
              <div className="aspect-video bg-[#FAFAF8] flex items-center justify-center text-[#C4A5B5]/20 border-b border-[#C4A5B5]/10 group-hover:text-[#C4A5B5]/40 transition-colors">
                <Images size={32} />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1520]" style={{ fontFamily: "var(--font-playfair)" }}>
                      {g.nom}
                    </h2>
                    <p className="text-xs text-[#1A1520]/30 mt-1 capitalize">{g.type}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/15 text-green-400 text-[10px] tracking-widest uppercase font-medium">
                    Disponible
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#1A1520]/40">
                  <span>{g.nb_fichiers} fichier{g.nb_fichiers > 1 ? "s" : ""}</span>
                  <span>·</span>
                  <span>{(g.taille_totale / 1024 / 1024 / 1024).toFixed(1)} Go</span>
                </div>
                <div className="mt-4 pt-4 border-t border-[#C4A5B5]/10 flex items-center justify-between">
                  <span className="text-xs text-[#C4A5B5] tracking-widest uppercase font-medium">
                    Ouvrir la galerie →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass p-16 text-center border border-[#C4A5B5]/15">
          <Clock size={40} className="text-[#C4A5B5]/20 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-[#1A1520] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            Vos photos arrivent bientôt
          </h2>
          <p className="text-[#1A1520]/40 text-sm max-w-sm mx-auto leading-relaxed">
            Nous travaillons à la retouche de vos photos avec le plus grand soin.
            Vous recevrez un email dès que votre galerie sera disponible.
          </p>
          <p className="text-xs text-[#1A1520]/20 mt-4">
            Délai habituel : 4 à 6 semaines après votre mariage
          </p>
        </div>
      )}
    </ClientShell>
  );
}
