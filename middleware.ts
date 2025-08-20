import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const USER = process.env.ADMIN_USERNAME || "";
const PASS = process.env.ADMIN_PASSWORD || "";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protéger toutes les routes /admin et leurs APIs
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Basic ")) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin Zone"' },
      });
    }
    const [u, p] = Buffer.from(auth.split(" ")[1], "base64").toString().split(":");
    if (u !== USER || p !== PASS) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};