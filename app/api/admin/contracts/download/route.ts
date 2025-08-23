// app/api/admin/contrats/download/route.ts
import { NextResponse } from "next/server";
import { getSignedContractUrl } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const { path } = await req.json();
    if (!path) {
      return NextResponse.json({ error: "Path manquant" }, { status: 400 });
    }

    const url = await getSignedContractUrl(path, 3600); // 1h
    return NextResponse.redirect(url);
  } catch (e: any) {
    console.error("download contract error:", e?.message || e);
    return NextResponse.json({ error: "Impossible de générer l’URL" }, { status: 500 });
  }
}