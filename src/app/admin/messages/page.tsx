import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/AdminShell";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  // Derniers messages groupés par client
  const { data: clients } = await supabase
    .from("clients")
    .select(`
      id, prenom_marie1, prenom_marie2,
      messages(id, contenu, auteur, lu, created_at)
    `)
    .order("created_at", { ascending: false });

  const clientsAvecMessages = (clients as any[] ?? []).filter(
    (c) => c.messages && c.messages.length > 0
  );

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="text-xs tracking-[0.4em] uppercase text-[#C4A5B5]/50 mb-1">Back-office</p>
        <h1 className="text-2xl font-bold text-[#1A1520]" style={{ fontFamily: "var(--font-playfair)" }}>
          Messages
        </h1>
      </div>

      {clientsAvecMessages.length > 0 ? (
        <div className="space-y-3">
          {clientsAvecMessages.map((c) => {
            const msgs = c.messages as any[];
            const dernierMsg = msgs.sort((a: any, b: any) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )[0];
            const nonLus = msgs.filter((m: any) => !m.lu && m.auteur === "client").length;

            return (
              <Link
                key={c.id}
                href={`/admin/clients/${c.id}`}
                className="flex items-center justify-between glass border border-[#C4A5B5]/15 px-5 py-4 hover:border-[#C4A5B5]/40 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-[#C4A5B5]/10 border border-[#C4A5B5]/20 flex items-center justify-center text-[#C4A5B5]">
                    <MessageCircle size={15} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#1A1520]/80">
                      {c.prenom_marie1} & {c.prenom_marie2}
                    </div>
                    <div className="text-xs text-[#1A1520]/30 mt-0.5 truncate max-w-xs">
                      {dernierMsg.contenu}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {nonLus > 0 && (
                    <span className="w-5 h-5 bg-[#C4A5B5] text-[#13111A] text-[10px] font-bold rounded-full flex items-center justify-center">
                      {nonLus}
                    </span>
                  )}
                  <span className="text-xs text-[#1A1520]/20">
                    {new Date(dernierMsg.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="glass border border-[#C4A5B5]/15 p-16 text-center">
          <MessageCircle size={36} className="text-[#C4A5B5]/15 mx-auto mb-4" />
          <p className="text-[#1A1520]/20 text-sm">Aucun message client pour l&apos;instant</p>
        </div>
      )}
    </AdminShell>
  );
}
