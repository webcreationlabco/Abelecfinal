"use client";

import LegalPage, { Section } from "@/components/legal/LegalPage";

const SECTIONS = [
  { id: "collecte",      title: "Données collectées" },
  { id: "utilisation",   title: "Utilisation des données" },
  { id: "conservation",  title: "Conservation" },
  { id: "droits",        title: "Vos droits" },
  { id: "cookies",       title: "Cookies" },
  { id: "dpo",           title: "Contact DPO" },
];

function DataCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="bg-abelec-cream-light border border-abelec-cream-line rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-abelec-orange/10 flex items-center justify-center text-abelec-orange shrink-0">
          {icon}
        </div>
        <p className="font-slab text-abelec-navy text-[14px] font-semibold">{title}</p>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] text-abelec-muted">
            <span className="text-abelec-orange mt-0.5 shrink-0">›</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RightCard({ right, desc }: { right: string; desc: string }) {
  return (
    <div className="flex gap-4 p-4 bg-abelec-cream-light rounded-xl border border-abelec-cream-line">
      <div className="w-2 h-2 rounded-full bg-abelec-orange mt-2 shrink-0" />
      <div>
        <p className="font-slab text-abelec-navy text-[14px] font-semibold mb-1">{right}</p>
        <p className="text-[13px] text-abelec-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function CookieRow({ name, purpose, duration, optional }: { name: string; purpose: string; duration: string; optional: boolean }) {
  return (
    <div className="grid grid-cols-[1fr_2fr_auto_auto] gap-4 items-center py-3 border-b border-abelec-cream-line last:border-none text-[13px]">
      <span className="font-mono text-abelec-navy font-semibold">{name}</span>
      <span className="text-abelec-muted">{purpose}</span>
      <span className="text-abelec-muted-2 whitespace-nowrap">{duration}</span>
      <span className={`text-[11px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full ${
        optional
          ? "bg-abelec-orange/10 text-abelec-orange"
          : "bg-abelec-navy/8 text-abelec-navy"
      }`}>
        {optional ? "Optionnel" : "Requis"}
      </span>
    </div>
  );
}

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      eyebrow="Légal"
      title="Politique de Confidentialité"
      subtitle="Comment Abelec collecte, utilise et protège vos données personnelles, conformément au RGPD."
      lastUpdated="1er mai 2025"
      sections={SECTIONS}
    >
      <div className="mb-8 bg-abelec-navy/5 border border-abelec-navy/10 rounded-xl p-5 flex gap-4">
        <svg className="text-abelec-navy shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <p className="text-[13.5px] text-abelec-navy/80 leading-relaxed">
          Abelec s&apos;engage à protéger votre vie privée. Cette politique est conforme au Règlement Général sur la Protection des Données (RGPD – Règlement UE 2016/679) et à la législation belge en vigueur.
        </p>
      </div>

      <Section id="collecte" title="Données collectées">
        <p>
          Dans le cadre de votre utilisation du site et de vos achats, Abelec collecte les catégories de données suivantes :
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <DataCard
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            title="Données d'identification"
            items={["Nom et prénom", "Adresse email", "Numéro de téléphone", "Adresse de livraison et facturation"]}
          />
          <DataCard
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>}
            title="Données de commande"
            items={["Historique des commandes", "Produits consultés", "Pièces compatibles recherchées", "Statut et suivi de livraison"]}
          />
          <DataCard
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
            title="Données de navigation"
            items={["Adresse IP", "Type de navigateur et système d'exploitation", "Pages visitées et durée de session", "Cookies techniques et analytiques"]}
          />
          <DataCard
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
            title="Communications"
            items={["Demandes via le formulaire de contact", "Échanges avec le service client", "Préférences de communication", "Langue préférée"]}
          />
        </div>
        <p className="mt-4">
          Abelec ne collecte aucune donnée sensible au sens de l&apos;article 9 du RGPD (données de santé, opinion politique, religion, etc.). Les données de paiement sont gérées exclusivement par nos prestataires de paiement certifiés PCI-DSS et ne transitent pas par nos serveurs.
        </p>
      </Section>

      <Section id="utilisation" title="Utilisation des données">
        <p>Les données collectées sont utilisées aux fins suivantes, sur la base des fondements juridiques correspondants :</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-abelec-navy text-white">
                <th className="text-left px-4 py-3 rounded-tl-lg font-mono font-normal text-[11px] uppercase tracking-wide">Finalité</th>
                <th className="text-left px-4 py-3 font-mono font-normal text-[11px] uppercase tracking-wide">Base juridique</th>
                <th className="text-left px-4 py-3 rounded-tr-lg font-mono font-normal text-[11px] uppercase tracking-wide">Données concernées</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-abelec-cream-line">
              {[
                ["Traitement et gestion des commandes", "Exécution du contrat", "Identification, commande, livraison"],
                ["Gestion du service client et litiges", "Intérêt légitime / obligation légale", "Identification, communications"],
                ["Amélioration du site et statistiques", "Intérêt légitime", "Navigation, cookies analytiques"],
                ["Envoi de newsletters (opt-in)", "Consentement", "Email, préférences"],
                ["Obligations comptables et fiscales", "Obligation légale", "Facturation, commandes"],
              ].map(([fin, base, data], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-abelec-cream-light/50"}>
                  <td className="px-4 py-3 text-abelec-navy-ink font-medium">{fin}</td>
                  <td className="px-4 py-3 text-abelec-muted">{base}</td>
                  <td className="px-4 py-3 text-abelec-muted">{data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          Abelec ne revend ni ne partage vos données personnelles à des tiers à des fins commerciales. Vos données peuvent être partagées avec des sous-traitants strictement nécessaires à l&apos;exécution de nos services (transporteurs, prestataires de paiement, hébergeur), liés par des accords de confidentialité conformes au RGPD.
        </p>
      </Section>

      <Section id="conservation" title="Conservation des données">
        <p>Vos données sont conservées pour des durées déterminées selon leur nature :</p>
        <div className="mt-4 space-y-2.5">
          {[
            { cat: "Données de compte client", dur: "3 ans après la dernière commande ou connexion", detail: "Puis suppression automatique ou anonymisation" },
            { cat: "Données de commandes et factures", dur: "10 ans", detail: "Conformément aux obligations comptables belges (art. III.86 CDE)" },
            { cat: "Logs de navigation", dur: "13 mois maximum", detail: "Conformément aux recommandations de l'APD" },
            { cat: "Cookies analytiques", dur: "13 mois", detail: "Renouvelés uniquement après nouveau consentement" },
            { cat: "Données de contact (formulaire)", dur: "3 ans après la dernière interaction", detail: "Ou jusqu'à exercice du droit à l'effacement" },
            { cat: "Listes de diffusion newsletter", dur: "Jusqu'au retrait du consentement + 1 an", detail: "Preuve de consentement conservée 5 ans" },
          ].map(({ cat, dur, detail }, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-3 border-b border-abelec-cream-line last:border-none">
              <div className="sm:w-56 shrink-0">
                <p className="font-semibold text-abelec-navy-ink text-[13.5px]">{cat}</p>
              </div>
              <div>
                <p className="text-abelec-navy text-[13.5px] font-medium">{dur}</p>
                <p className="text-abelec-muted-2 text-[12px] mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4">
          À l&apos;expiration des délais de conservation, les données sont supprimées de manière sécurisée ou anonymisées de façon irréversible. Aucune donnée n&apos;est conservée au-delà de ces durées sans fondement légal.
        </p>
      </Section>

      <Section id="droits" title="Vos droits">
        <p>
          Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles. Chaque demande sera traitée dans un délai maximum d&apos;un mois.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <RightCard
            right="Droit d'accès"
            desc="Vous pouvez obtenir une copie de toutes les données personnelles que nous détenons vous concernant."
          />
          <RightCard
            right="Droit de rectification"
            desc="Vous pouvez demander la correction de données inexactes ou incomplètes."
          />
          <RightCard
            right="Droit à l'effacement"
            desc="Vous pouvez demander la suppression de vos données dans certaines conditions (« droit à l'oubli »)."
          />
          <RightCard
            right="Droit à la portabilité"
            desc="Vous pouvez recevoir vos données dans un format structuré, lisible par machine, pour les transférer à un autre responsable."
          />
          <RightCard
            right="Droit d'opposition"
            desc="Vous pouvez vous opposer à certains traitements, notamment à des fins de prospection commerciale."
          />
          <RightCard
            right="Droit de limitation"
            desc="Vous pouvez demander la restriction du traitement de vos données dans des cas spécifiques prévus par le RGPD."
          />
        </div>
        <p className="mt-4">
          Pour exercer l&apos;un de ces droits, contactez notre DPO à <a href="mailto:dpo@abelec.be" className="text-abelec-orange hover:underline">dpo@abelec.be</a> en joignant une copie de votre pièce d&apos;identité. Vous disposez également du droit d&apos;introduire une réclamation auprès de l&apos;Autorité de Protection des Données belge :<br />
          <a href="https://www.autoriteprotectiondonnees.be" target="_blank" rel="noopener noreferrer" className="text-abelec-orange hover:underline">www.autoriteprotectiondonnees.be</a>
        </p>
      </Section>

      <Section id="cookies" title="Cookies">
        <p>
          Le site abelec.be utilise des cookies et technologies similaires. Un cookie est un petit fichier texte déposé sur votre terminal lors de votre visite. Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site pourraient ne plus être disponibles.
        </p>
        <div className="mt-4 overflow-x-auto bg-abelec-cream-light rounded-xl border border-abelec-cream-line p-4">
          <div className="grid grid-cols-[1fr_2fr_auto_auto] gap-4 pb-2 border-b border-abelec-cream-line mb-1">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-abelec-muted-2">Cookie</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-abelec-muted-2">Finalité</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-abelec-muted-2">Durée</span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-abelec-muted-2">Type</span>
          </div>
          <CookieRow name="abelec_session"  purpose="Gestion du panier et de la session utilisateur" duration="Session" optional={false} />
          <CookieRow name="abelec_locale"   purpose="Mémorisation de la langue préférée" duration="365 jours" optional={false} />
          <CookieRow name="abelec_auth"     purpose="Maintien de la connexion au compte client" duration="30 jours" optional={false} />
          <CookieRow name="_ga, _gid"       purpose="Google Analytics — mesure d'audience anonymisée" duration="13 mois" optional={true} />
          <CookieRow name="_fbp"            purpose="Facebook Pixel — mesure de conversions publicitaires" duration="90 jours" optional={true} />
          <CookieRow name="consent_v2"      purpose="Mémorisation de vos préférences de cookies" duration="12 mois" optional={false} />
        </div>
        <p className="mt-4">
          Vous pouvez modifier vos préférences de cookies à tout moment via notre bandeau de gestion des cookies accessible en bas de page, ou via les paramètres de votre navigateur.
        </p>
      </Section>

      <Section id="dpo" title="Contact DPO">
        <p>
          Abelec a désigné un Délégué à la Protection des Données (DPO) chargé de veiller au respect du RGPD et de répondre à vos questions concernant la protection de vos données.
        </p>
        <div className="mt-4 bg-abelec-cream-light border border-abelec-cream-line rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-12 h-12 rounded-xl bg-abelec-orange/10 flex items-center justify-center text-abelec-orange shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="space-y-2">
            <p className="font-slab text-abelec-navy text-[16px] font-semibold">Délégué à la Protection des Données</p>
            <p className="text-[13.5px] text-abelec-muted">Abelec — Fiordaliso Nicola<br />Avenue Léopold III 38B, 7134 Péronnes-lez-Binche, Belgique</p>
            <p className="text-[13.5px]">
              <span className="text-abelec-muted-2">Email :</span>{" "}
              <a href="mailto:dpo@abelec.be" className="text-abelec-orange hover:underline font-medium">dpo@abelec.be</a>
            </p>
            <p className="text-[13px] text-abelec-muted-2 mt-2">
              Délai de réponse : 30 jours maximum à compter de la réception de votre demande.
            </p>
          </div>
        </div>
      </Section>
    </LegalPage>
  );
}
