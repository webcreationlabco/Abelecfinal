"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useT } from "@/lib/i18n";

function TeamPhoto({
  src,
  label,
  imgHeight,
  wrapperClassName,
}: {
  src: string;
  label: string;
  imgHeight: string;
  wrapperClassName?: string;
}) {
  return (
    <div className={wrapperClassName}>
      <div className={`relative rounded-[14px] overflow-hidden border border-abelec-cream-line ${imgHeight}`}>
        <Image
          src={src}
          alt={label}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}

export default function ExpertsSection() {
  const t = useT();

  return (
    <section className="bg-abelec-cream-light py-16 px-6">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-2 gap-14 items-center max-lg:grid-cols-1">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="font-slab text-abelec-navy mb-6">
              {t("experts.title")}{" "}
              <span className="text-abelec-orange italic">
                {t("experts.titleAccent")}
              </span>
            </h2>

            <p className="text-[18px] text-abelec-navy/80 mb-5 leading-relaxed font-medium">
              {t("experts.lead")}
            </p>

            <p className="text-[15.5px] text-abelec-muted mb-10 leading-relaxed">
              {t("experts.sub")}
            </p>

            <Link href="/contact" className="inline-flex items-center gap-2.5 bg-abelec-orange hover:bg-[#b8612a] text-white px-7 py-3.5 rounded-xl font-semibold text-[15px] transition-colors shadow-[inset_0_-2px_0_rgba(0,0,0,.12)]">
              <MessageCircle size={18} strokeWidth={2} />
              {t("experts.cta")}
            </Link>

          </motion.div>

          {/* Right — photos grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Photo 1 — wide (team/store photo) */}
            <TeamPhoto
              src="/images/team/travail.jpg"
              label={t("experts.photo1")}
              imgHeight="h-[220px]"
              wrapperClassName="col-span-2"
            />

            {/* Photo 2 */}
            <TeamPhoto
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DSC08676-Gf3fatnZm5vcydCNKzdFAlMRrHdpS6.jpg"
              label={t("experts.photo2")}
              imgHeight="h-[160px]"
            />

            {/* Photo 3 */}
            <TeamPhoto
              src="/images/team/mains.jpg"
              label={t("experts.photo3")}
              imgHeight="h-[160px]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
