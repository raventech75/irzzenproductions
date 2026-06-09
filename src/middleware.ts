import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "@/lib/supabase/middleware";

async function isAdmin(request: NextRequest): Promise<boolean> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from("admins").select("id").eq("user_id", user.id).single();
  return !!data;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger /admin/* (sauf /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const admin = await isAdmin(request);
    if (!admin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protéger /client/* (sauf /client/login)
  return await updateSession(request);
}

export const config = {
  matcher: ["/client/:path*", "/admin/:path*"],
};
