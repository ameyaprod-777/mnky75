/**
 * Rate limiting en mémoire par IP (anti-spam réservations et commandes).
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_RESERVATION = 5;
const MAX_COMMANDE = 15;
const MAX_APPEL = 10;

const store = new Map<
  string,
  { count: number; resetAt: number }
>();

type Action = "reservation" | "commande" | "appel";

function getKey(ip: string, action: Action): string {
  return `${ip}:${action}`;
}

function getMax(action: Action): number {
  if (action === "reservation") return MAX_RESERVATION;
  if (action === "commande") return MAX_COMMANDE;
  return MAX_APPEL;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function cleanup(): void {
  const now = Date.now();
  for (const [key, data] of store.entries()) {
    if (data.resetAt < now) store.delete(key);
  }
}

/**
 * Vérifie la limite pour une IP et une action. Incrémente le compteur.
 * Retourne true si la requête est autorisée, false si limite dépassée.
 */
export function checkRateLimit(
  request: Request,
  action: Action
): { allowed: boolean; remaining: number; retryAfterMs?: number } {
  if (store.size > 10000) cleanup();

  const ip = getClientIp(request);
  const key = getKey(ip, action);
  const max = getMax(action);
  const now = Date.now();

  let data = store.get(key);
  if (!data || data.resetAt < now) {
    data = { count: 0, resetAt: now + WINDOW_MS };
    store.set(key, data);
  }

  data.count += 1;
  const allowed = data.count <= max;
  const remaining = Math.max(0, max - data.count);
  const retryAfterMs = allowed ? undefined : data.resetAt - now;

  return { allowed, remaining, retryAfterMs };
}
