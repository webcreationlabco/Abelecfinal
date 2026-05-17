"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { useT, useI18n } from "@/lib/i18n";

export default function Footer() {
  const t = useT();
  const { t: raw, locale } = useI18n();

  // Access arrays directly from the raw translation object
  const getArray = (path: string): string[] => {
    const parts = path.split(".");
    let val: unknown = raw;
    for (const p of parts) {
      if (val == null || typeof val !== "object") return [];
      val = (val as Record<string, unknown>)[p];
    }
    return Array.isArray(val) ? (val as string[]) : [];
  };

  const categories = getArray("footer.categories");
  const services   = getArray("footer.services");
  const company    = getArray("footer.company");

  // Static href maps (index-aligned with locale arrays)
  const CATEGORY_HREFS = [
    "/catalogue?categorie=lave-linge",
    "/catalogue?categorie=lave-vaisselle",
    "/catalogue?categorie=refrigerateur",
    "/catalogue?categorie=four-cuisiniere",
    "/catalogue?categorie=seche-linge",
    "/catalogue?categorie=aspirateur",
  ];
  const SERVICE_HREFS = [
    "/suivi-commande",
    "/contact",
    "/partenaires",
    "/livraison-retours",
    "/cgv#garantie",
  ];
  const COMPANY_HREFS = [
    "/a-propos",
    "/#timeline",
    "/marques",
    "/cgv",
    "/mentions-legales",
    "/politique-de-confidentialite",
  ];

  return (
    <footer className="relative bg-abelec-navy text-white pt-20 pb-8">
      {/* Orange stripe at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] opacity-80"
        style={{
          background:
            "linear-gradient(to right,#d97e3a 0,#d97e3a 30%,transparent 30%,transparent 33%,#d97e3a 33%,#d97e3a 36%,transparent 36%,transparent 50%,#d97e3a 50%,#d97e3a 100%)",
        }}
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-4 gap-10 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {/* Brand col */}
          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="rounded-lg px-2 py-1.5">
                <Image src="/logo-abelec.png" alt="Abelec" width={96} height={32} className="h-8 w-auto object-contain brightness-0 invert" />
              </div>
            </div>
            <p className="text-[#cfdbe8] text-[14px] leading-relaxed font-slab italic font-normal mt-1 max-w-full sm:max-w-[320px]">
              {t("footer.tagline")}
            </p>
            <address className="not-italic mt-6 text-[12.5px] text-[#b8c6d6] leading-[1.7] font-mono">
              <strong className="text-white font-slab not-italic font-bold block mb-1 text-[11px] uppercase tracking-[0.04em]">
                {t("footer.hq")}
              </strong>
              {t("footer.address")}<br />
              {t("footer.city")}<br />
              {t("footer.country")}<br /><br />
              {t("footer.vat")}
            </address>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`mailto:${t("footer.email")}`}
                className="inline-flex items-center gap-2.5 text-[13px] text-white px-3 py-2 bg-white/[0.04] rounded-lg border border-white/[0.08] font-mono w-fit transition-colors hover:bg-abelec-orange/[0.15] hover:border-abelec-orange"
              >
                <Mail size={13} className="text-abelec-orange" />
                {t("footer.email")}
              </a>
            </div>
            <div className="mt-5 flex items-center gap-2.5">
              {[
                { label: "LinkedIn",  d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 4a2 2 0 1 1-.001 4A2 2 0 0 1 4 4z" },
                { label: "Instagram", d: "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z M16.5 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16.5 11.37z M17.5 6.5h.01" },
                { label: "Facebook",  d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
              ].map(({ label, d }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-[34px] h-[34px] rounded-lg grid place-items-center bg-white/5 text-[#b8c6d6] hover:bg-abelec-orange hover:text-white transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-slab text-[13px] font-bold uppercase tracking-[0.06em] flex items-center gap-2 mb-[18px]">
              {t("footer.catTitle")}
              <span className="font-mono text-abelec-orange text-[11px] font-medium">01</span>
            </h4>
            <ul className="flex flex-col gap-2.5">
              {categories.map((item, i) => (
                <li key={item}><Link href={CATEGORY_HREFS[i] ?? "#"} className="text-[13.5px] text-[#b8c6d6] hover:text-abelec-orange transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-slab text-[13px] font-bold uppercase tracking-[0.06em] flex items-center gap-2 mb-[18px]">
              {t("footer.servTitle")}
              <span className="font-mono text-abelec-orange text-[11px] font-medium">02</span>
            </h4>
            <ul className="flex flex-col gap-2.5">
              {services.map((item, i) => (
                <li key={item}><Link href={SERVICE_HREFS[i] ?? "#"} className="text-[13.5px] text-[#b8c6d6] hover:text-abelec-orange transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-slab text-[13px] font-bold uppercase tracking-[0.06em] flex items-center gap-2 mb-[18px]">
              {t("footer.compTitle")}
              <span className="font-mono text-abelec-orange text-[11px] font-medium">03</span>
            </h4>
            <ul className="flex flex-col gap-2.5">
              {company.map((item, i) => (
                <li key={item}><Link href={COMPANY_HREFS[i] ?? "#"} className="text-[13.5px] text-[#b8c6d6] hover:text-abelec-orange transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[12.5px] text-[#cfdbe8] font-mono">{t("footer.copyright")}</p>
            <p className="text-[11.5px] text-[#8ea4bd] italic mt-1 max-w-full sm:max-w-[520px]">{t("footer.mention")}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex px-2.5 py-1.5 border border-white/[0.18] rounded-lg font-mono text-[12px] text-white items-center gap-1.5">
              {locale.toUpperCase()}
            </span>
            <div className="flex gap-1.5">
              {[
                { label: "LinkedIn",  d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 4a2 2 0 1 1-.001 4A2 2 0 0 1 4 4z" },
                { label: "Instagram", d: "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z M16.5 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16.5 11.37z M17.5 6.5h.01" },
                { label: "Facebook",  d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
              ].map(({ label, d }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-[34px] h-[34px] rounded-lg grid place-items-center bg-white/5 text-[#b8c6d6] hover:bg-abelec-orange hover:text-white transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
