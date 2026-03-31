import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Politique de confidentialité — ${SITE.name}`,
  description: `Politique de confidentialité de ${SITE.name}.`,
};

export default function PolitiqueConfidentialitePage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <h1 className="font-display text-3xl font-bold text-jungle-cream">
          Politique de confidentialité
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-jungle-300/90">
          <p>
            La présente politique explique comment {SITE.name} collecte et
            traite vos données personnelles lors de l&apos;utilisation du site.
          </p>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Données collectées
            </h2>
            <p>
              Dans le cadre des réservations, commandes et appels, nous pouvons
              collecter : prénom, nom, téléphone, email, nombre de personnes,
              date/créneau, commentaires et informations utiles au service.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Finalités
            </h2>
            <p>
              Les données sont utilisées pour gérer les demandes clients
              (réservations, confirmation/refus, organisation du service) et
              assurer le bon fonctionnement du restaurant.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Durée de conservation
            </h2>
            <p>
              Les données sont conservées pendant la durée nécessaire à la
              gestion opérationnelle et aux obligations légales applicables.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Vos droits
            </h2>
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
              rectification, d&apos;effacement, d&apos;opposition et de limitation du
              traitement de vos données. Vous pouvez exercer ces droits en
              écrivant à : contact@moonkeyparis.fr.
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-base font-semibold text-jungle-cream">
              Sécurité
            </h2>
            <p>
              Nous mettons en place des mesures techniques et
              organisationnelles pour protéger vos données contre les accès non
              autorisés, pertes ou divulgations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

