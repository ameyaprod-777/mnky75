import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Politique cookies — ${SITE.name}`,
  description: `Politique cookies de ${SITE.name}.`,
};

export default function PolitiqueCookiesPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <h1 className="font-display text-3xl font-bold text-jungle-cream">
          Politique cookies
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-jungle-300/90">
          <p>
            Cette page explique l&apos;usage des cookies sur le site {SITE.name}.
          </p>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Qu&apos;est-ce qu&apos;un cookie ?
            </h2>
            <p>
              Un cookie est un petit fichier texte stocké sur votre appareil
              lors de la navigation. Il permet notamment de mémoriser certaines
              informations de session.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Cookies utilisés
            </h2>
            <p>
              Le site utilise principalement des cookies techniques nécessaires
              au fonctionnement (ex. session admin). Aucun cookie publicitaire
              tiers n&apos;est déployé par défaut.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Gestion des cookies
            </h2>
            <p>
              Vous pouvez configurer votre navigateur pour accepter, refuser ou
              supprimer les cookies. Le refus des cookies techniques peut
              altérer certaines fonctionnalités du site.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Contact
            </h2>
            <p>
              Pour toute question relative aux cookies : contact@moonkeyparis.fr.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

