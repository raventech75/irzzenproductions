import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Zones à protéger par Basic Auth :
 *  - /admin
 *  - /api/admin/*
 */
const PROTECTED = [/^\/admin(?:\/.*)?$/, /^\/api\/admin(?:\/.*)?$/];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // On laisse passer tout ce qui n'est pas protégé
  const mustProtect = PROTECTED.some((re) => re.test(pathname));
  if (!mustProtect) return NextResponse.next();

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  // Si variables manquantes → 500 explicite (sinon écran blanc)
  if (!username || !password) {
    return new NextResponse("Admin auth is not configured (missing ADMIN_USERNAME / ADMIN_PASSWORD).", {
      status: 500,
    });
  }

  // Vérifie l'en-tête Authorization: Basic xxxx
  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Basic ")) {
    return unauthorized();
  }

  const base64 = authHeader.replace("Basic ", "");
  let decoded = "";
  try {
    decoded = Buffer.from(base64, "base64").toString("utf8");
  } catch {
    return unauthorized();
  }

  const [user, pass] = decoded.split(":");
  if (user !== username || pass !== password) {
    return unauthorized();
  }

  return NextResponse.next();
}

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
  });
}

// ✅ Applique le middleware uniquement là où nécessaire
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};