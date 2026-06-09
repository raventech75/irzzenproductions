import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientShell } from "@/components/client/ClientShell";
import { ChatBox } from "@/components/chat/ChatBox";

export default async function ClientMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/client/login");

  const { data: client } = await (supabase.from("clients") as any)
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!client) redirect("/client/dashboard");

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("client_id", client.id)
    .order("created_at", { ascending: true });

  return (
    <ClientShell>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <p className="text-xs tracking-[0.4em] uppercase text-[#C4A5B5]/50 mb-1">Espace client</p>
          <h1 className="text-2xl font-bold text-[#1A1520]" style={{ fontFamily: "var(--font-playfair)" }}>
            Messages
          </h1>
          <p className="text-sm text-[#1A1520]/40 mt-1">Échangez directement avec votre équipe Irzzen Productions.</p>
        </div>

        <div className="glass border border-[#C4A5B5]/15 overflow-hidden" style={{ height: 520 }}>
          <ChatBox
            clientId={client.id}
            auteur="client"
            initialMessages={(messages ?? []) as any}
          />
        </div>
      </div>
    </ClientShell>
  );
}
