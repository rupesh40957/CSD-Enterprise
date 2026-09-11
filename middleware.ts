import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "csd_admin_session";
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-development-must-be-replaced";
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload.role === "admin" && payload.sub === "admin";
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Protect Admin UI Pages
  if (pathname.startsWith("/admin")) {
    const authenticated = await isValidSession(token);

    if (pathname === "/admin/login") {
      if (authenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!authenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
