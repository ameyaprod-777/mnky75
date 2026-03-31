import { Metadata } from "next";
import { Suspense } from "react";
import { MenuClient } from "@/components/menu/MenuClient";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Carte & Menu — ${SITE.name}`,
  description: `Découvrez la carte Moonkey Paris : sandwiches, plats thaï, pâtes, burgers, soft, mocktails, smoothies et plus. ${SITE.fullAddress}.`,
};

export default function MenuPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="min-h-screen" />}>
        <MenuClient />
      </Suspense>
    </div>
  );
}
