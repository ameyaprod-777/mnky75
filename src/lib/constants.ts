export const SITE = {
  name: "Moonkey Paris",
  tagline: "Restaurant Lounge Chicha",
  address: "192 Rue Raymond Losserand",
  city: "75014 Paris",
  fullAddress: "192 Rue Raymond Losserand, 75014 Paris",
  whatsapp: "+33744548713", // 07 44 54 87 13
  whatsappMessage: `Bonjour,

Je souhaiterais effectuer une réservation au Moonkey Paris pour le [Date, ex: samedi 14 février].

Nombre de personnes : [Nombre]

Heure souhaitée : [Heure]

Pourriez-vous me confirmer vos disponibilités.

Cordialement,`,
  instagram: "https://www.instagram.com/moonkey_paris/",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=192+Rue+Raymond+Losserand+75014+Paris",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/#concept", label: "Concept" },
  { href: "/menu", label: "Menu" },
  { href: "/#reservation", label: "Réservation" },
] as const;

export const WEEKDAY_CRENEAUX = [
  "20h00",
  "20h30",
  "21h00",
  "21h30",
  "22h00",
  "22h30",
  "23h00",
  "23h30",
  "00h00",
  "00h30",
  "01h00",
  "01h30",
] as const;

export const WEEKEND_EXTRA_CRENEAUX = [
  "02h00",
  "02h30",
  "03h00",
  "03h30",
] as const;

export const ALL_CRENEAUX = [
  ...WEEKDAY_CRENEAUX,
  ...WEEKEND_EXTRA_CRENEAUX,
] as const;

function isWeekendDate(date: string): boolean {
  const [year, month, day] = date.split("-").map((n) => Number(n));
  const safeDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const dayOfWeek = safeDate.getUTCDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

export function getReservationCreneaux(date?: string): readonly string[] {
  if (!date) return WEEKDAY_CRENEAUX;
  return isWeekendDate(date) ? ALL_CRENEAUX : WEEKDAY_CRENEAUX;
}
