import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Mentions légales — ${SITE.name}`,
  description: `Mentions légales de ${SITE.name}.`,
};

export default function MentionsLegalesPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <h1 className="font-display text-3xl font-bold text-jungle-cream">
          Mentions légales
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-jungle-300/90">
          <p>
            Conformément aux dispositions des articles 6-III et 19 de la loi
            n°2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie
            numérique, il est précisé aux utilisateurs du site les présentes
            mentions légales.
          </p>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Éditeur du site
            </h2>
            <p>
              Raison sociale : <strong>Moonkey Paris</strong>
              <br />
              Adresse : {SITE.fullAddress}
              <br />
              Téléphone : 07 44 54 87 13
              <br />
              Email : contact@moonkeyparis.fr
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Responsable de la publication
            </h2>
            <p>Moonkey Paris (à compléter avec nom/prénom du responsable).</p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Hébergement
            </h2>
            <p>
              Le site est hébergé par votre fournisseur serveur / cloud
              (à compléter : nom, adresse, téléphone de l&apos;hébergeur).
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble des contenus présents sur ce site (textes, images,
              logos, éléments graphiques) est protégé par le droit de la
              propriété intellectuelle. Toute reproduction, représentation ou
              diffusion, totale ou partielle, sans autorisation préalable est
              interdite.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

