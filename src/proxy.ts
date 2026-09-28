import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getSessionSecret } from "@/lib/auth-secret";

const PROTECTED = ["/dashboard"];
const AUTH_ONLY = ["/login", "/signup"];

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const secret = getSessionSecret();
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p));

  if (!isProtected && !isAuthOnly) return NextResponse.next();

  const authenticated = await hasValidSession(request);

  if (isProtected && !authenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthOnly && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
