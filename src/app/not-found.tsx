import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500/90">
        Erreur
      </p>
      <h1 className="mt-4 font-display text-6xl font-bold tracking-tight text-jungle-cream sm:text-7xl md:text-8xl">
        404
      </h1>
      <div className="mt-4 h-px w-20 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      <p className="mt-6 max-w-sm text-lg text-jungle-300/90">
        Cette page n’existe pas ou le lien est incorrect.
      </p>
      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-5">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-gold-500/90 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-jungle-deep transition-all duration-300 hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/20"
        >
          Retour à l’accueil
        </Link>
        <a
          href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(SITE.whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-jungle-300/40 bg-jungle-300/5 px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-jungle-cream transition-all duration-300 hover:border-gold-500/40 hover:bg-gold-500/10 hover:text-gold-400"
        >
          Nous contacter (WhatsApp)
        </a>
      </div>
    </div>
  );
}
