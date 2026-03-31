import { Metadata } from "next";
import { ReservationPageClient } from "@/components/reservation/ReservationPageClient";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Réservation — ${SITE.name}`,
  description: `Réservez votre table au ${SITE.name}. ${SITE.fullAddress}.`,
};

export default function ReservationPage() {
  return (
    <div className="min-h-screen">
      <ReservationPageClient />
    </div>
  );
}
