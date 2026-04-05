import { NextResponse } from "next/server";
import { getDatabaseHealth } from "@/lib/db";

/**
 * GET /api/health/db — Diagnostic PostgreSQL (connexion + table commandes).
 * À utiliser sur le VPS si « Base de données indisponible » sur les commandes.
 */
export async function GET() {
  const health = await getDatabaseHealth();
  return NextResponse.json(health);
}
