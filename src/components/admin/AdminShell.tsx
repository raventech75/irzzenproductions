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
  Settings,
  LogOut,
  Menu,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin",          label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/clients",  label: "Clients",    icon: Users },
  { href: "/admin/galeries", label: "Galeries",   icon: Images },
  { href: "/admin/contrats", label: "Contrats",   icon: FileText },
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
      <div className="mb-8">
        <div className="flex flex-col leading-none">
          <span
            className="text-xl font-bold tracking-widest uppercase text-gradient-gold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Irzzen
          </span>
          <span className="text-[9px] tracking-[0.35em] uppercase text-[#C9A84C]/40 mt-0.5">
            Back-office
          </span>
        </div>
      </div>

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
                    ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                    : "text-[#FAFAFA]/40 hover:text-[#FAFAFA]/70 hover:bg-[#FAFAFA]/5"
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

      <div className="border-t border-[#C9A84C]/10 pt-4 space-y-1 mt-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-xs text-[#FAFAFA]/25 hover:text-[#C9A84C]/50 transition-colors"
        >
          <ExternalLink size={12} /> Voir le site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[#FAFAFA]/25 hover:text-red-400 transition-colors"
        >
          <LogOut size={12} /> Déconnexion
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#070707] flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#060606] border-r border-[#C9A84C]/10 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/70" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={cn(
        "lg:hidden fixed top-0 left-0 h-full w-56 bg-[#060606] border-r border-[#C9A84C]/10 z-50 transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar />
      </aside>

      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center gap-4 px-5 py-3 border-b border-[#C9A84C]/10 bg-[#060606]">
          <button onClick={() => setSidebarOpen(true)} className="text-[#FAFAFA]/50">
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold tracking-widest uppercase text-gradient-gold" style={{ fontFamily: "var(--font-playfair)" }}>
            Admin
          </span>
        </header>
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
