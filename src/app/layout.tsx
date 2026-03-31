import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { SITE } from "@/lib/constants";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline} | ${SITE.city}`,
  description: `Restaurant Lounge Chicha haut de gamme à Paris. ${SITE.fullAddress}. Réservez votre table, découvrez notre menu chichas, plats et boissons.`,
  keywords: ["chicha", "lounge", "restaurant", "Paris", "75014", "Moonkey"],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: `Restaurant Lounge Chicha. ${SITE.fullAddress}.`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${syne.variable} ${plusJakarta.variable} font-sans antialiased`}
      >
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
