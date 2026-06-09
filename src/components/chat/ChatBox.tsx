"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  contenu: string;
  auteur: "client" | "admin";
  lu: boolean;
  created_at: string;
};

export function ChatBox({
  clientId,
  auteur,
  initialMessages = [],
}: {
  clientId: string;
  auteur: "client" | "admin";
  initialMessages?: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [texte, setTexte] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Marquer comme lus
  useEffect(() => {
    const opposite = auteur === "admin" ? "client" : "admin";
    fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, auteur: opposite }),
    });
  }, [clientId, auteur]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${clientId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `client_id=eq.${clientId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [clientId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!texte.trim() || sending) return;
    setSending(true);
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, contenu: texte.trim(), auteur }),
    });
    setTexte("");
    setSending(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex flex-col h-full min-h-[400px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 pr-2">
        {messages.length === 0 && (
          <div className="text-center text-[#1A1520]/20 text-sm py-12">
            {auteur === "admin"
              ? "Aucun message. Commencez la conversation."
              : "Aucun message de votre équipe pour l'instant."}
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.auteur === auteur;
          return (
            <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] px-4 py-2.5 text-sm leading-relaxed",
                  isMine
                    ? "bg-[#C4A5B5] text-[#13111A] rounded-tl-2xl rounded-tr-sm rounded-bl-2xl rounded-br-2xl"
                    : "bg-[#F0EBE5] border border-[#C4A5B5]/15 text-[#1A1520]/80 rounded-tl-sm rounded-tr-2xl rounded-bl-2xl rounded-br-2xl"
                )}
              >
                {msg.contenu}
                <div className={cn("text-[10px] mt-1 opacity-50", isMine ? "text-right" : "text-left")}>
                  {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Saisie */}
      <div className="border-t border-[#C4A5B5]/10 p-3 flex gap-2 items-end">
        <textarea
          rows={1}
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Votre message…"
          className="flex-1 bg-[#FAFAF8] border border-[#C4A5B5]/20 text-[#1A1520] text-sm px-4 py-2.5 resize-none focus:outline-none focus:border-[#C4A5B5]/50 transition-colors placeholder-[#F0EBE8]/20 rounded-sm"
          style={{ minHeight: 42, maxHeight: 120 }}
        />
        <button
          onClick={handleSend}
          disabled={!texte.trim() || sending}
          className="w-10 h-10 bg-[#C4A5B5] text-[#13111A] flex items-center justify-center hover:bg-[#DEC8D6] transition-colors disabled:opacity-40 flex-shrink-0"
        >
          {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        </button>
      </div>
    </div>
  );
}
