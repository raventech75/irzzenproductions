"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Images,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  ExternalLink,
  ChevronRight,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin",          label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/clients",  label: "Clients",    icon: Users },
  { href: "/admin/galeries", label: "Galeries",   icon: Images },
  { href: "/admin/contrats", label: "Contrats",   icon: FileText },
  { href: "/admin/devis",    label: "Devis",      icon: Receipt },
  { href: "/admin/messages", label: "Messages",   icon: MessageSquare },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const Sidebar = () => (
    <nav className="flex flex-col h-full p-5">
      {/* Logo */}
      <div className="mb-10">
        <div className="flex flex-col leading-none">
          <span
            className="text-xl font-bold tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-playfair)",
              background: "linear-gradient(110deg, var(--c-orange) 0%, var(--c-rose) 55%, var(--c-olive) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Irzzen
          </span>
          <span className="text-[9px] tracking-[0.35em] uppercase text-[#261E14]/30 mt-0.5">
            Back-office
          </span>
        </div>
      </div>

      {/* Nav */}
      <ul className="space-y-0.5 flex-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 rounded-sm",
                  active
                    ? "bg-[#E8A87C]/12 text-[#E8A87C] font-medium"
                    : "text-[#261E14]/40 hover:text-[#261E14]/70 hover:bg-[#261E14]/4"
                )}
              >
                <item.icon size={15} className="flex-shrink-0" />
                {item.label}
                {active && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom links */}
      <div className="border-t border-[#261E14]/8 pt-4 space-y-1 mt-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-xs text-[#261E14]/25 hover:text-[#E8A87C]/70 transition-colors"
        >
          <ExternalLink size={12} /> Voir le site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#261E14]/25 hover:text-red-500/70 transition-colors"
        >
          <LogOut size={12} /> Déconnexion
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#FDFAF7] flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#F5EDE0] border-r border-[#261E14]/7 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#261E14]/30" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={cn(
        "lg:hidden fixed top-0 left-0 h-full w-56 bg-[#F5EDE0] border-r border-[#261E14]/7 z-50 transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar />
      </aside>

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center gap-4 px-5 py-3 border-b border-[#261E14]/7 bg-[#F5EDE0]">
          <button onClick={() => setSidebarOpen(true)} className="text-[#261E14]/50">
            <Menu size={20} />
          </button>
          <span
            className="text-sm font-bold tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-playfair)",
              background: "linear-gradient(110deg, var(--c-orange), var(--c-rose))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Admin
          </span>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
