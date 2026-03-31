/**
 * Sons d'alarme pour notifier les serveurs :
 * - Nouvelle commande
 * - Appel serveur
 * - Appel charbon
 * - Nouvelle réservation
 * Chaque alarme se répète 5 fois pour bien prévenir.
 * Utilise la Web Audio API (pas de fichier audio requis).
 */

const REPEAT_COUNT = 5;
const DELAY_BETWEEN_REPEATS_MS = 600;

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioContext;
}

function beep(
  frequency: number,
  durationMs: number,
  volume = 0.4,
  type: OscillatorType = "sine"
): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.type = type;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationMs / 1000);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // ignore
  }
}

/**
 * Répète une séquence sonore 5 fois avec une pause entre chaque.
 */
function repeatAlarm(playOnce: () => void): void {
  for (let i = 0; i < REPEAT_COUNT; i++) {
    setTimeout(() => playOnce(), i * DELAY_BETWEEN_REPEATS_MS);
  }
}

/**
 * Joue une séquence de bips pour une nouvelle commande (double bip), 5 fois.
 */
export function playCommandeAlarm(): void {
  const playOnce = () => {
    beep(880, 120, 0.35, "sine");
    setTimeout(() => beep(880, 120, 0.35, "sine"), 180);
  };
  repeatAlarm(playOnce);
}

/**
 * Joue l'alarme pour un appel serveur (bip aigu), 5 fois.
 */
export function playAppelServeurAlarm(): void {
  const playOnce = () => beep(1200, 200, 0.4, "sine");
  repeatAlarm(playOnce);
}

/**
 * Joue l'alarme pour un appel charbon (triple bip grave), 5 fois.
 */
export function playAppelCharbonAlarm(): void {
  const playOnce = () => {
    beep(520, 100, 0.45, "square");
    setTimeout(() => beep(520, 100, 0.45, "square"), 120);
    setTimeout(() => beep(520, 100, 0.45, "square"), 240);
  };
  repeatAlarm(playOnce);
}

/**
 * Joue l'alarme pour une nouvelle réservation (séquence distincte), 5 fois.
 */
export function playReservationAlarm(): void {
  const playOnce = () => {
    beep(660, 150, 0.4, "sine");
    setTimeout(() => beep(880, 150, 0.4, "sine"), 200);
    setTimeout(() => beep(660, 150, 0.4, "sine"), 400);
  };
  repeatAlarm(playOnce);
}

/**
 * Demande la permission et affiche une notification navigateur (optionnel).
 * À appeler après un geste utilisateur (ex: premier chargement de la page admin).
 */
export function requestNotificationPermission(): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

/**
 * Affiche une notification système (si autorisée).
 */
export function showNotification(title: string, options?: { body?: string }): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      icon: "/favicon.ico",
      ...options,
    });
  } catch {
    // ignore
  }
}
