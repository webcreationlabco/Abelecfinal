"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useT } from "@/lib/i18n";

export default function HelpdeskFloat() {
  const t = useT();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 220, damping: 18 }}
      whileHover={{ y: -2 }}
      className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-[200]"
    >
      <Link
        href="/contact"
        className="bg-abelec-orange text-white flex items-center gap-2 px-4 sm:px-[22px] py-3 sm:py-3.5 rounded-full font-semibold text-[13px] sm:text-[14px] overflow-hidden"
        style={{ boxShadow: "0 8px 32px rgba(217,126,58,.4), inset 0 -3px 0 rgba(0,0,0,.15)" }}
        aria-label={t("helpdesk")}
      >
        <MessageCircle size={20} strokeWidth={2.2} />
        <span className="hidden sm:inline">{t("helpdesk")}</span>
        <span className="w-[9px] h-[9px] rounded-full bg-green-400 animate-pulse shrink-0" />
      </Link>
    </motion.div>
  );
}
