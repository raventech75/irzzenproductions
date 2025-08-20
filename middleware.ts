import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="IRZZEN Admin"' }
    });
  }
  const [user, pass] = Buffer.from(auth.replace("Basic ", ""), "base64").toString().split(":");
  if (user === process.env.ADMIN_USERNAME && pass === process.env.ADMIN_PASSWORD) return NextResponse.next();
  return new NextResponse("Forbidden", { status: 403 });
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };

