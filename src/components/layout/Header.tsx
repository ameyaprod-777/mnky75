"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-jungle-deep/95 backdrop-blur-md border-b border-jungle-800/40 shadow-lg shadow-black/10"
          : "bg-transparent border-b border-white/5"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="relative flex items-center py-3"
          aria-label="Moonkey Paris - Accueil"
        >
          <Image
            src="/images/logo-moonkey-gold.png"
            alt="Moonkey Paris"
            width={140}
            height={40}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-3 text-[13px] font-medium uppercase tracking-[0.12em] text-jungle-200/90 transition-colors duration-200 hover:text-gold-400",
                link.href === "/" && "text-gold-400"
              )}
            >
              {link.label}
              <span className="absolute bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-gold-500/70 transition-all duration-200 group-hover:w-4" />
            </Link>
          ))}
          <Link
            href="/reservation"
            className="ml-4 inline-flex items-center justify-center rounded-full border border-gold-500/50 bg-gold-500/10 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-widest text-gold-400 transition-all duration-300 hover:bg-gold-500/20 hover:border-gold-400/60"
          >
            Réserver
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={mobileOpen}
          className="flex h-12 w-12 items-center justify-center rounded-full text-jungle-200 transition-colors hover:bg-white/5 hover:text-gold-400 md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-jungle-800/40 bg-jungle-deep/98 backdrop-blur-md md:hidden"
          >
            <nav className="flex flex-col px-5 py-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-jungle-800/30 py-4 text-sm font-medium uppercase tracking-widest text-jungle-200 transition-colors hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/reservation"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gold-500/20 py-3.5 text-sm font-semibold uppercase tracking-widest text-gold-400"
              >
                Réserver une table
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
