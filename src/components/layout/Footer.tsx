"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Instagram, Calendar } from "lucide-react";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative border-t border-jungle-800/50 bg-jungle-page">
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="flex items-center">
              <Image
                src="/images/logo-moonkey-gold.png"
                alt="Moonkey Paris"
                width={180}
                height={60}
                className="h-10 w-auto"
                priority
              />
            </div>
            <p className="mt-2 text-sm text-jungle-300/80">
              Restaurant Lounge Chicha
            </p>
            <div className="mt-6 h-px w-16 bg-gradient-to-r from-gold-500/60 to-transparent" />
          </div>

          <div className="space-y-8 sm:grid sm:grid-cols-2 sm:space-y-0 lg:col-span-7 lg:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500/90">
                Adresse
              </p>
              <a
                href={SITE.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-start gap-3 text-sm leading-relaxed text-jungle-200/90 transition-colors hover:text-gold-400"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/70" />
                <span>
                  {SITE.address}
                  <br />
                  {SITE.city}
                </span>
              </a>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500/90">
                Nous suivre
              </p>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-3 text-sm text-jungle-200/90 transition-colors hover:text-gold-400"
              >
                <Instagram className="h-4 w-4 shrink-0 text-gold-500/70" />
                Instagram
              </a>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500/90">
                Réservation
              </p>
              <Link
                href="/reservation"
                className="mt-3 flex items-center gap-3 text-sm text-jungle-200/90 transition-colors hover:text-gold-400"
              >
                <Calendar className="h-4 w-4 shrink-0 text-gold-500/70" />
                Réserver une table
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-jungle-800/40 pt-8 sm:flex-row">
          <p className="text-xs text-jungle-500">
            © {new Date().getFullYear()} {SITE.name}. Tous droits réservés. AXIOM
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-jungle-500 sm:justify-end sm:gap-6">
            <Link href="/reservation" className="hover:text-gold-500/80">
              Réservation
            </Link>
            <Link href="/menu" className="hover:text-gold-500/80">
              Menu
            </Link>
            <Link href="/mentions-legales" className="hover:text-gold-500/80">
              Mentions légales
            </Link>
            <Link
              href="/politique-confidentialite"
              className="hover:text-gold-500/80"
            >
              Confidentialité
            </Link>
            <Link href="/politique-cookies" className="hover:text-gold-500/80">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
