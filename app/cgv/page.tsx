"use client";

import LegalPage, { Section } from "@/components/legal/LegalPage";

const SECTIONS = [
  { id: "objet",        title: "Objet et champ d'application" },
  { id: "prix",         title: "Prix et paiement" },
  { id: "livraison",    title: "Livraison" },
  { id: "retours",      title: "Retours et garantie" },
  { id: "responsabilite", title: "Responsabilité" },
  { id: "droit",        title: "Droit applicable" },
];

export default function CGVPage() {
  return (
    <LegalPage
      eyebrow="Légal"
      title="Conditions Générales de Vente"
      subtitle="Les présentes conditions régissent tout achat effectué sur abelec.be."
      lastUpdated="1er mai 2025"
      sections={SECTIONS}
    >
      <Section id="objet" title="Objet et champ d'application">
        <p>
          Les présentes Conditions Générales de Vente (ci-après « CGV ») s&apos;appliquent à toutes les ventes de pièces détachées et accessoires pour appareils électroménagers conclues entre Abelec (ci-après « le Vendeur ») et tout acheteur professionnel ou consommateur (ci-après « l&apos;Acheteur ») via le site internet <strong>www.abelec.be</strong>.
        </p>
        <p>
          Toute commande passée sur le site implique l&apos;acceptation pleine et entière des présentes CGV, lesquelles prévalent sur tout document émanant de l&apos;Acheteur. Le Vendeur se réserve le droit de modifier les présentes CGV à tout moment ; les conditions applicables sont celles en vigueur au moment de la validation de la commande.
        </p>
        <p>
          Les présentes CGV s&apos;appliquent exclusivement à la vente en ligne à destination des particuliers et des professionnels résidant en Belgique, en France, aux Pays-Bas, au Luxembourg, en Allemagne et en Italie.
        </p>
      </Section>

      <Section id="prix" title="Prix et paiement">
        <p>
          Tous les prix affichés sur le site sont exprimés en euros (€) et incluent la TVA applicable au taux en vigueur au moment de la commande. Les frais de livraison sont indiqués séparément et précisés avant la validation du panier.
        </p>
        <p>
          Le Vendeur se réserve le droit de modifier ses prix à tout moment. Toutefois, les produits seront facturés sur la base des tarifs en vigueur au moment de l&apos;enregistrement de la commande.
        </p>
        <p>
          Les modes de paiement acceptés sont les suivants :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Carte bancaire (Visa, Mastercard, Bancontact)</li>
          <li>PayPal</li>
          <li>Virement bancaire (délai de traitement : 2–3 jours ouvrables)</li>
          <li>iDEAL (Pays-Bas uniquement)</li>
        </ul>
        <p>
          Le paiement est exigible intégralement au moment de la commande. En cas de défaut de paiement, le Vendeur se réserve le droit d&apos;annuler la commande de plein droit, après mise en demeure restée sans effet dans un délai de 48 heures.
        </p>
        <p>
          Les données bancaires transmises lors du paiement sont cryptées et sécurisées via le protocole SSL. Abelec n&apos;a à aucun moment accès aux informations bancaires de l&apos;Acheteur.
        </p>
      </Section>

      <Section id="livraison" title="Livraison">
        <p>
          Les commandes sont expédiées dans un délai de <strong>1 à 2 jours ouvrables</strong> après confirmation du paiement. Les délais de livraison estimés sont :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Belgique et Luxembourg :</strong> 1–3 jours ouvrables</li>
          <li><strong>France, Pays-Bas, Allemagne :</strong> 3–5 jours ouvrables</li>
          <li><strong>Italie :</strong> 4–7 jours ouvrables</li>
        </ul>
        <p>
          Un email de confirmation contenant un numéro de suivi de colis est envoyé dès l&apos;expédition. Le Vendeur ne peut être tenu responsable des retards imputables au transporteur ou à des événements de force majeure.
        </p>
        <p>
          Le transfert des risques intervient dès la remise du colis au transporteur. En cas de dommage constaté à la livraison, l&apos;Acheteur doit émettre des réserves précises sur le bon de livraison et contacter le service client dans un délai de <strong>48 heures</strong>.
        </p>
        <p>
          En cas d&apos;absence lors de la livraison, un avis de passage sera déposé. L&apos;Acheteur dispose d&apos;un délai de 15 jours pour récupérer son colis avant retour au Vendeur. Des frais de réexpédition pourront être facturés.
        </p>
      </Section>

      <Section id="retours" title="Retours et garantie">
        <p>
          Conformément à la législation belge et européenne, tout consommateur dispose d&apos;un <strong>droit de rétractation de 30 jours</strong> à compter de la réception du colis, sans avoir à justifier sa décision ni à payer de pénalité.
        </p>
        <p>
          Pour exercer ce droit, l&apos;Acheteur doit contacter le service client par email à <strong>retours@abelec.be</strong> en précisant le numéro de commande. Les produits doivent être retournés dans leur emballage d&apos;origine, en parfait état, non utilisés et accompagnés de tous leurs accessoires.
        </p>
        <p>
          Les frais de retour sont à la charge de l&apos;Acheteur, sauf en cas de produit défectueux ou d&apos;erreur d&apos;expédition de notre part. Le remboursement est effectué dans un délai de <strong>14 jours</strong> après réception et vérification du retour, via le même moyen de paiement utilisé lors de la commande.
        </p>
        <p>
          <strong>Garantie légale :</strong> Tous les produits bénéficient de la garantie légale de conformité de 2 ans prévue par le Code civil belge. Cette garantie couvre les défauts de conformité existant au moment de la livraison. Elle ne s&apos;applique pas aux dommages résultant d&apos;une installation incorrecte, d&apos;une utilisation anormale ou d&apos;une usure normale.
        </p>
        <p>
          <strong>Garantie commerciale :</strong> Certaines pièces peuvent bénéficier d&apos;une garantie commerciale supplémentaire mentionnée sur la fiche produit. Les conditions spécifiques de cette garantie sont précisées dans les documents l&apos;accompagnant.
        </p>
      </Section>

      <Section id="responsabilite" title="Responsabilité">
        <p>
          Il appartient à l&apos;Acheteur de vérifier la compatibilité de la pièce commandée avec son appareil avant tout achat. Abelec fournit à titre indicatif des outils de sélection par marque et modèle, mais ne saurait garantir l&apos;exactitude de ces informations dans tous les cas.
        </p>
        <p>
          Abelec ne pourra être tenu responsable des dommages directs ou indirects causés par une installation incorrecte de la pièce par l&apos;Acheteur ou par un tiers non qualifié. Il est recommandé de faire appel à un technicien agréé pour les réparations impliquant le circuit électrique ou le circuit frigorifique.
        </p>
        <p>
          En tout état de cause, la responsabilité d&apos;Abelec est limitée au montant de la commande concernée. Abelec ne saurait être tenu responsable en cas de force majeure telle que grèves, incendies, inondations, défaillances du réseau internet ou dysfonctionnements du transporteur.
        </p>
        <p>
          Les photographies et descriptions des produits présentées sur le site sont fournies à titre illustratif et peuvent légèrement différer de la réalité du produit livré, notamment en raison d&apos;évolutions techniques apportées par les fabricants.
        </p>
      </Section>

      <Section id="droit" title="Droit applicable et litiges">
        <p>
          Les présentes CGV sont soumises au droit belge. Tout litige relatif à leur interprétation ou leur exécution sera soumis aux tribunaux compétents de l&apos;arrondissement judiciaire de <strong>Charleroi (Belgique)</strong>, sauf dispositions légales impératives contraires.
        </p>
        <p>
          En cas de litige, l&apos;Acheteur consommateur peut recourir gratuitement à la médiation via la plateforme européenne de règlement en ligne des litiges :
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
            className="text-abelec-orange hover:underline ml-1">
            ec.europa.eu/consumers/odr
          </a>
        </p>
        <p>
          L&apos;Acheteur peut également contacter le Service de Médiation pour le Consommateur (Belgique) :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Boulevard du Roi Albert II, 8, bte 1 — 1000 Bruxelles</li>
          <li>contact@mediationconsommateur.be</li>
          <li>www.mediationconsommateur.be</li>
        </ul>
        <p>
          Avant tout recours à la médiation, nous vous encourageons à contacter notre service client afin de trouver une solution amiable dans les meilleurs délais.
        </p>
      </Section>
    </LegalPage>
  );
}
