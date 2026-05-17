"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, X, Phone, Mail, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/lib/i18n";

export default function HelpdeskFloat() {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── FAB ── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 220, damping: 18 }}
        whileHover={{ y: -2 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-[200] bg-abelec-orange text-white flex items-center gap-2 px-4 sm:px-[22px] py-3 sm:py-3.5 rounded-full font-semibold text-[13px] sm:text-[14px] cursor-pointer overflow-hidden"
        style={{ boxShadow: "0 8px 32px rgba(217,126,58,.4), inset 0 -3px 0 rgba(0,0,0,.15)" }}
        aria-label={t("helpdesk")}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={20} strokeWidth={2.2} />
            </motion.span>
          ) : (
            <motion.span key="chat"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle size={20} strokeWidth={2.2} />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="hidden sm:inline">{t("helpdesk")}</span>
        {!open && <span className="w-[9px] h-[9px] rounded-full bg-green-400 animate-pulse shrink-0" />}
      </motion.button>

      {/* ── Panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit={{   opacity: 0, y: 16, scale: 0.97  }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed z-[199]"
            style={{
              right: "clamp(8px, 4vw, 24px)",
              bottom: "clamp(68px, 12vw, 96px)",
              width: "min(320px, calc(100vw - 16px))",
              background: "#ffffff",
              borderRadius: "18px",
              boxShadow: "0 20px 60px rgba(15,35,64,0.16), 0 4px 16px rgba(15,35,64,0.07)",
              border: "1px solid rgba(26,58,92,0.08)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div className="px-5 pt-5 pb-4 bg-abelec-navy">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-abelec-orange flex items-center justify-center shrink-0">
                  <MessageCircle size={17} strokeWidth={2} className="text-white" />
                </div>
                <div>
                  <p className="font-slab font-bold text-white text-[15px] leading-tight">Support Abelec</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                    <span className="text-[11px] text-white/60 font-mono">En ligne</span>
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-white/70 leading-relaxed mt-1">
                Notre équipe répond en moins de 2h
              </p>
            </div>

            {/* Contact options */}
            <div className="px-4 py-4 flex flex-col gap-2.5">
              {/* Phone */}
              <a
                href="tel:+3264330000"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-abelec-cream-line bg-abelec-cream-light hover:border-abelec-orange hover:bg-abelec-orange/[0.05] transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-abelec-cream-line flex items-center justify-center shrink-0 group-hover:border-abelec-orange transition-colors">
                  <Phone size={15} strokeWidth={1.8} className="text-abelec-orange" />
                </div>
                <div>
                  <p className="text-[12px] font-mono text-abelec-muted uppercase tracking-[0.08em]">Téléphone</p>
                  <p className="text-[14px] font-semibold text-abelec-navy-ink">+32 64 33 00 00</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:info@abelec.be"
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-abelec-cream-line bg-abelec-cream-light hover:border-abelec-orange hover:bg-abelec-orange/[0.05] transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-abelec-cream-line flex items-center justify-center shrink-0 group-hover:border-abelec-orange transition-colors">
                  <Mail size={15} strokeWidth={1.8} className="text-abelec-orange" />
                </div>
                <div>
                  <p className="text-[12px] font-mono text-abelec-muted uppercase tracking-[0.08em]">Email</p>
                  <p className="text-[14px] font-semibold text-abelec-navy-ink">info@abelec.be</p>
                </div>
              </a>

              {/* Contact form link */}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-abelec-navy hover:bg-abelec-navy/90 text-white font-semibold text-[14px] transition-colors"
                style={{ boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)" }}
              >
                <FileText size={15} strokeWidth={2} />
                Formulaire de contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
