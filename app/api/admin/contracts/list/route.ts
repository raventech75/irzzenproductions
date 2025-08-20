import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("contracts")
    .select(`
      id,
      file_path,
      bytes,
      created_at,
      bookings (
        id,
        couple_name,
        wedding_date,
        customers:customer_id (
          email,
          first_name,
          last_name
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data });
}