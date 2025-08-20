import { NextResponse } from "next/server";
import { getSignedUrl } from "@/lib/storage";

export async function POST(req: Request) {
  const { path } = await req.json();
  try {
    const url = await getSignedUrl(path, 60 * 10);
    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}