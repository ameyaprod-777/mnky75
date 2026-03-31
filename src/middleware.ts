import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildSessionSeed, getAdminUsersFromEnv } from "@/lib/admin-auth";

const ADMIN_LOGIN = "/admin/login";
const ADMIN_PREFIX = "/admin";

async function hashSessionSeed(seed: string): Promise<string> {
  const data = new TextEncoder().encode(seed);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  if (pathname === ADMIN_LOGIN) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("admin_session")?.value;
  const users = getAdminUsersFromEnv();
  const allowedHashes = await Promise.all(
    users.map((user) => hashSessionSeed(buildSessionSeed(user.id, user.pwd)))
  );

  if (!cookie || !allowedHashes.includes(cookie)) {
    const loginUrl = new URL(ADMIN_LOGIN, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
