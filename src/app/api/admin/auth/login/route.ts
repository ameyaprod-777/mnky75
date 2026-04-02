import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { buildSessionSeed, getAdminUsersFromEnv, isValidAdminCredentials } from "@/lib/admin-auth";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 jours

function hashSessionSeed(seed: string): string {
  return createHash("sha256").update(seed).digest("hex");
}

export async function POST(request: NextRequest) {
  let body: { identifiant?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Données invalides." },
      { status: 400 }
    );
  }

  const identifiant = typeof body.identifiant === "string" ? body.identifiant.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const configuredUsers = getAdminUsersFromEnv();

  if (configuredUsers.length === 0) {
    return NextResponse.json(
      { error: "Aucun compte admin configuré. Vérifie ADMIN_USERS dans .env.local." },
      { status: 500 }
    );
  }

  if (!isValidAdminCredentials(identifiant, password)) {
    return NextResponse.json(
      { error: "Identifiant ou mot de passe incorrect." },
      { status: 401 }
    );
  }

  const value = hashSessionSeed(buildSessionSeed(identifiant, password));
  const res = NextResponse.json({ ok: true }, { status: 200 });

  // Le cookie `secure` ne doit être activé que si la requête arrive en HTTPS.
  // Sinon, en test via `http://IP:PORT`, le navigateur refuse d'enregistrer le cookie.
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isHttps =
    forwardedProto === "https" || request.nextUrl.protocol === "https:";
  res.cookies.set(COOKIE_NAME, value, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return res;
}
