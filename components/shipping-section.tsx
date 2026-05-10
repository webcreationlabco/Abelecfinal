"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import Image from "next/image";

const BULLETS = [
  { titleKey: "shipping.bullet1Title", descKey: "shipping.bullet1Desc" },
  { titleKey: "shipping.bullet2Title", descKey: "shipping.bullet2Desc" },
  { titleKey: "shipping.bullet3Title", descKey: "shipping.bullet3Desc" },
];

// All logos: same fixed height (h-6 = 24px), greyscale by default, color on hover
const CARRIERS = [
  { name: "Amazon Prime", src: "/images/carriers/amazon-prime.png", h: 32 },
  { name: "Colissimo",    src: "/images/carriers/colissimo.png",    h: 44 },
  { name: "DHL",          src: "/images/carriers/DHL.png",          h: 44 },
  { name: "GLS",          src: "/images/carriers/GLS.png",          h: 26 },
  { name: "Chronopost",   src: "/images/carriers/chronopost.png",   h: 32 },
  { name: "Colis Privé",  src: "/images/carriers/colis-prive.png",  h: 32 },
];

export default function ShippingSection() {
  const t = useT();

  return (
    <section className="bg-abelec-cream-deep py-16 px-6">
      <div className="max-w-[1240px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-slab text-abelec-navy">
            {t("shipping.title")}{" "}
            <span className="text-abelec-orange italic">en 48h.</span>
          </h2>
          <p className="mt-4 text-[17px] text-abelec-muted max-w-[540px] mx-auto leading-relaxed">
            {t("shipping.subtext")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 max-lg:grid-cols-1" style={{ alignItems: "center" }}>
          {/* Left — Delivery map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-[10px] text-abelec-muted-2 uppercase tracking-[0.12em] mb-4">
              {t("shipping.zoneLabel")}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/delivery-map.png"
              alt="Zone de livraison"
              className="w-full h-auto rounded-[14px]"
              draggable={false}
            />
          </motion.div>

          {/* Right — bullets + carriers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-8"
            style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}
          >
            {/* 3 bullet points */}
            <div className="space-y-6">
              {BULLETS.map(({ titleKey, descKey }, i) => (
                <motion.div
                  key={titleKey}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div style={{ width: 32, height: 3, background: "#E8732A", borderRadius: 2, flexShrink: 0, alignSelf: "flex-start", marginTop: 6 }} />
                  <div>
                    <div className="mb-1.5">
                      <h3 className="font-slab text-abelec-navy font-bold text-[16.5px]">
                        {t(titleKey)}
                      </h3>
                    </div>
                    <p className="text-[14px] text-abelec-muted leading-relaxed">
                      {t(descKey)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Carriers — single line, uniform height */}
            <div>
              <p className="font-mono text-[10px] text-abelec-muted-2 uppercase tracking-[0.12em] mb-3">
                {t("shipping.carriers")}
              </p>
              <div className="flex items-center gap-5 overflow-x-auto pb-1 scrollbar-none">
                {CARRIERS.map((carrier) => (
                  <Image
                    key={carrier.name}
                    src={carrier.src}
                    alt={carrier.name}
                    width={120}
                    height={carrier.h}
                    style={{ height: `${carrier.h}px`, width: "auto" }}
                    className="object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200 cursor-pointer"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
