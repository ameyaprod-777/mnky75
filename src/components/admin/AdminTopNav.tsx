"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/constants";

const adminNav = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/statut", label: "Statut" },
  { href: "/admin/reservations", label: "Réservations" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/appels", label: "Appels" },
] as const;

export function AdminTopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-10 border-b border-jungle-800/50 bg-jungle-page/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/admin"
            className="font-display text-lg font-semibold text-jungle-cream"
          >
            Admin {SITE.name}
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <nav className="flex gap-1">
              {adminNav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive(href)
                      ? "bg-jungle-800/60 text-jungle-cream"
                      : "text-jungle-300 hover:bg-jungle-800/50 hover:text-jungle-cream"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <form action="/api/admin/auth/logout" method="POST" className="inline">
              <button
                type="submit"
                className="text-sm text-jungle-500 hover:text-jungle-400"
              >
                Déconnexion
              </button>
            </form>
            <Link href="/" className="text-sm text-jungle-400 hover:text-gold-400">
              ← Retour au site
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-jungle-300 hover:bg-jungle-800/50 hover:text-jungle-cream md:hidden"
            aria-label="Ouvrir le menu admin"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="mt-3 border-t border-jungle-800/50 pt-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {adminNav.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive(href)
                      ? "bg-jungle-800/60 text-jungle-cream"
                      : "text-jungle-300 hover:bg-jungle-800/50 hover:text-jungle-cream"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between border-t border-jungle-800/50 pt-3">
              <form action="/api/admin/auth/logout" method="POST" className="inline">
                <button
                  type="submit"
                  className="text-sm text-jungle-500 hover:text-jungle-400"
                >
                  Déconnexion
                </button>
              </form>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="text-sm text-jungle-400 hover:text-gold-400"
              >
                ← Retour au site
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

