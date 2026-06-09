"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  FileText,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/client/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/client/galerie", label: "Mes galeries", icon: Images },
  { href: "/client/contrat", label: "Mon contrat", icon: FileText },
];

export function ClientShell({
  children,
  clientNom,
}: {
  children: React.ReactNode;
  clientNom: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/client/login");
    router.refresh();
  };

  const Sidebar = ({ mobile = false }) => (
    <nav
      className={cn(
        "flex flex-col h-full",
        mobile ? "p-6" : "p-6"
      )}
    >
      {/* Logo */}
      <div className="mb-10">
        <Link href="/" className="flex flex-col leading-none group">
          <span
            className="text-xl font-bold tracking-widest uppercase text-gradient-gold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Irzzen
          </span>
          <span className="text-[9px] tracking-[0.35em] uppercase text-[#C9A84C]/50 font-light">
            Espace Client
          </span>
        </Link>
      </div>

      {/* Client info */}
      <div className="mb-8 p-4 border border-[#C9A84C]/20 bg-[#C9A84C]/5">
        <div className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]/50 mb-1">
          Bienvenue
        </div>
        <div className="text-sm font-medium text-[#FAFAFA]">{clientNom}</div>
      </div>

      {/* Nav links */}
      <ul className="space-y-1 flex-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200",
                  active
                    ? "bg-[#C9A84C]/15 text-[#C9A84C] border-l-2 border-[#C9A84C]"
                    : "text-[#FAFAFA]/50 hover:text-[#FAFAFA]/80 hover:bg-[#FAFAFA]/5 border-l-2 border-transparent"
                )}
              >
                <item.icon size={16} className="flex-shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Bottom */}
      <div className="space-y-2 border-t border-[#C9A84C]/15 pt-6 mt-6">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 text-xs text-[#FAFAFA]/30 hover:text-[#C9A84C]/60 transition-colors"
        >
          <ExternalLink size={13} />
          Retour au site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-[#FAFAFA]/30 hover:text-red-400 transition-colors"
        >
          <LogOut size={13} />
          Déconnexion
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#080808] border-r border-[#C9A84C]/10 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-64 bg-[#080808] border-r border-[#C9A84C]/10 z-50 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar mobile />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-[#C9A84C]/10 bg-[#080808]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#FAFAFA]/60 hover:text-[#C9A84C] transition-colors"
          >
            <Menu size={22} />
          </button>
          <span
            className="text-lg font-bold tracking-widest uppercase text-gradient-gold"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Irzzen
          </span>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
