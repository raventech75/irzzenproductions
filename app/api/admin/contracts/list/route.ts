import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Essaye de lister à la racine et dans "contrats/" pour couvrir les 2 conventions
async function listAt(prefix: string) {
  const { data, error } = await supabaseAdmin.storage.from("contrats").list(prefix, {
    limit: 1000,
    offset: 0,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error) return [];
  return (data || [])
    .filter((o) => o.name.toLowerCase().endsWith(".pdf"))
    .map((o) => ({
      path: prefix ? `${prefix.replace(/\/$/, "")}/${o.name}` : o.name,
      name: o.name,
      bytes: o.metadata?.size ?? 0,
      created_at: o.created_at ?? null,
    }));
}

export async function GET() {
  const a = await listAt("");
  const b = await listAt("contrats");
  const merged = [...a, ...b]
    .filter((v, i, arr) => arr.findIndex((x) => x.path === v.path) === i)
    .sort((x, y) => (y.created_at || "").localeCompare(x.created_at || ""));
  return NextResponse.json({ items: merged });
}