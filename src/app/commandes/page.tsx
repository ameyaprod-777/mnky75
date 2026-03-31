import { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { CommanderClient } from "@/components/commandes/CommanderClient";

export const metadata: Metadata = {
  title: `Commander — ${SITE.name}`,
  description: `Passez commande : chichas, boissons, plats. ${SITE.fullAddress}.`,
  robots: "noindex, nofollow",
};

export default function CommanderPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24">
      <CommanderClient />
    </div>
  );
}
