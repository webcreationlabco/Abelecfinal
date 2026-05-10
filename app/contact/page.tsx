"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ChevronDown } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TrustPillars from "@/components/trust-pillars";
import HelpdeskFloat from "@/components/helpdesk-float";
import BrandStrip from "@/components/brand-strip";
import { useT } from "@/lib/i18n";

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0 },
  transition: { delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

const slideIn = (delay = 0, x = 0) => ({
  initial:    { opacity: 0, x, y: x === 0 ? 16 : 0 },
  animate:    { opacity: 1, x: 0, y: 0 },
  transition: { delay, duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export default function ContactPage() {
  const t = useT();

  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };

  const inputCls =
    "w-full h-11 px-4 rounded-xl bg-abelec-cream-light border border-abelec-cream-line text-[14px] text-abelec-navy-ink placeholder:text-abelec-muted-2 outline-none focus:border-abelec-orange transition-colors";

  const INFO_BLOCKS = [
    { icon: MapPin, title: t("contact.addrTitle"),  lines: [t("contact.addrLine1"), t("contact.addrLine2"), t("contact.addrLine3")], href: "https://maps.google.com/maps?q=Péronnes-lez-Binche,Belgium" },
    { icon: Phone,  title: t("contact.phoneTitle"), lines: ["+32 64 33 00 00"],                                                       href: "tel:+3264330000" },
    { icon: Mail,   title: t("contact.emailTitle"), lines: ["info@abelec.be", "commandes@abelec.be"],                                 href: "mailto:info@abelec.be" },
    { icon: Clock,  title: t("contact.hoursTitle"), lines: [t("contact.hoursLine1"), t("contact.hoursLine2"), t("contact.hoursLine3")], href: null },
  ] as const;

  const SUBJECTS = [
    { value: "commande",  label: t("contact.subject1") },
    { value: "piece",     label: t("contact.subject2") },
    { value: "technique", label: t("contact.subject3") },
    { value: "autre",     label: t("contact.subject4") },
  ];

  return (
    <>
      <Header />
      <main>
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section
          className="w-full border-b border-abelec-cream-line py-16 px-6 text-center"
          style={{ background: "linear-gradient(180deg,#F8F5F0 0%,#F4EFE6 100%)" }}
        >
          <div className="max-w-[720px] mx-auto">
            <motion.p {...fadeUp(0)} className="eyebrow mb-4">
              {t("contact.eyebrow")}
            </motion.p>
            <motion.h1
              {...fadeUp(0.07)}
              className="font-slab text-abelec-navy-ink mx-auto"
              style={{ fontSize: "clamp(38px, 5.5vw, 68px)", letterSpacing: "-0.03em", lineHeight: 1.04 }}
            >
              {t("contact.h1")}
              <span className="text-abelec-orange italic">{t("contact.h1Accent")}</span>
            </motion.h1>
            <motion.p {...fadeUp(0.14)} className="mt-5 text-[17px] text-abelec-muted leading-relaxed">
              {t("contact.sub")}
            </motion.p>
          </div>
        </section>

        {/* ── 2-col ──────────────────────────────────────────────────── */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-[1240px] mx-auto grid grid-cols-2 gap-14 max-lg:grid-cols-1">

            {/* LEFT — form */}
            <motion.div {...slideIn(0.1, -20)}>
              <p className="eyebrow mb-3">{t("contact.formEyebrow")}</p>
              <h2 className="font-slab text-abelec-navy mb-8 leading-tight" style={{ fontSize: "clamp(22px,2.6vw,30px)" }}>
                {t("contact.formTitle")}
              </h2>

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  className="flex flex-col items-center justify-center gap-5 py-20 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#f0faf5] border border-[rgba(45,106,79,0.25)] flex items-center justify-center">
                    <CheckCircle size={28} strokeWidth={1.8} className="text-[#2d6a4f]" />
                  </div>
                  <div>
                    <h3 className="font-slab text-abelec-navy text-[24px] mb-1">{t("contact.successTitle")}</h3>
                    <p className="text-abelec-muted text-[15px]">{t("contact.successSub")}</p>
                  </div>
                  <button
                    onClick={() => { setSent(false); setForm({ nom: "", email: "", sujet: "", message: "" }); }}
                    className="text-[13px] text-abelec-orange font-semibold hover:underline"
                  >
                    {t("contact.successReset")}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-abelec-muted-2">{t("contact.labelNom")}</label>
                      <input type="text" required value={form.nom} onChange={set("nom")} placeholder={t("contact.placeholderNom")} className={inputCls} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-abelec-muted-2">{t("contact.labelEmail")}</label>
                      <input type="email" required value={form.email} onChange={set("email")} placeholder={t("contact.placeholderEmail")} className={inputCls} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-abelec-muted-2">{t("contact.labelSujet")}</label>
                    <div className="relative">
                      <select required value={form.sujet} onChange={set("sujet")}
                        className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                        style={{ color: form.sujet ? "#0f2340" : "#8a8a8a" }}>
                        <option value="">{t("contact.subjectDefault")}</option>
                        {SUBJECTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-abelec-muted-2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-abelec-muted-2">{t("contact.labelMessage")}</label>
                    <textarea required rows={6} value={form.message} onChange={set("message")} placeholder={t("contact.placeholderMessage")}
                      className="px-4 py-3 rounded-xl bg-abelec-cream-light border border-abelec-cream-line text-[14px] text-abelec-navy-ink placeholder:text-abelec-muted-2 outline-none focus:border-abelec-orange transition-colors resize-none" />
                  </div>

                  <motion.button
                    type="submit" disabled={sending}
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(217,126,58,0.30)" }}
                    whileTap={{ scale: 0.99 }}
                    className="h-[52px] rounded-2xl bg-abelec-orange hover:bg-abelec-orange-dark disabled:opacity-70 text-white font-bold text-[16px] flex items-center justify-center gap-2.5 transition-colors shadow-[inset_0_-3px_0_rgba(0,0,0,.14)]"
                  >
                    <Send size={16} strokeWidth={2} />
                    {sending ? t("contact.sending") : t("contact.submit")}
                  </motion.button>
                  <p className="text-[11.5px] text-abelec-muted-2 font-mono text-center">{t("contact.privacy")}</p>
                </form>
              )}
            </motion.div>

            {/* RIGHT — info + map */}
            <motion.div {...slideIn(0.18, 20)} className="flex flex-col gap-8">
              <div>
                <p className="eyebrow mb-3">{t("contact.infoEyebrow")}</p>
                <h2 className="font-slab text-abelec-navy mb-7 leading-tight" style={{ fontSize: "clamp(22px,2.6vw,30px)" }}>
                  {t("contact.infoTitle")}
                </h2>
                <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                  {INFO_BLOCKS.map(({ icon: Icon, title, lines, href }) => {
                    const Wrapper = href ? "a" : "div";
                    return (
                      <Wrapper
                        key={title}
                        {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
                        className={`p-4 rounded-2xl bg-abelec-cream-light border border-abelec-cream-line flex flex-col gap-3 transition-all duration-200 ${href ? "hover:border-abelec-orange hover:-translate-y-0.5 cursor-pointer" : ""}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-abelec-orange/10 border border-abelec-orange/20 flex items-center justify-center shrink-0">
                            <Icon size={15} className="text-abelec-orange" strokeWidth={1.8} />
                          </div>
                          <span className="font-slab text-abelec-navy font-bold text-[13.5px]">{title}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 pl-[42px]">
                          {lines.map((line) => <p key={line} className="text-[13px] text-abelec-muted leading-relaxed">{line}</p>)}
                        </div>
                      </Wrapper>
                    );
                  })}
                </div>
              </div>

              {/* Google Maps */}
              <div className="rounded-2xl overflow-hidden border border-abelec-cream-line shadow-card-sm" style={{ height: "clamp(200px,30vh,260px)" }}>
                <iframe
                  src="https://maps.google.com/maps?q=P%C3%A9ronnes-lez-Binche%2C+Belgium&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%" height="100%" style={{ border: 0 }}
                  loading="lazy" title={t("contact.mapTitle")} referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border" style={{ background: "#FDF7F0", borderColor: "rgba(217,126,58,0.28)" }}>
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
                <p className="text-[13px] text-abelec-muted leading-snug">
                  <strong className="text-abelec-navy-ink">{t("contact.responseStrong")}</strong>{" "}
                  {t("contact.responseTime")}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <BrandStrip />
        <TrustPillars />
      </main>
      <Footer />
      <HelpdeskFloat />
    </>
  );
}
