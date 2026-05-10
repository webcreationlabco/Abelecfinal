"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Package, Tag } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HelpdeskFloat from "@/components/helpdesk-float";
import { useT } from "@/lib/i18n";

interface CartItem {
  id:    number;
  name:  string;
  ref:   string;
  brand: string;
  price: number;
  img:   string;
  qty:   number;
}

const INITIAL_ITEMS: CartItem[] = [
  { id: 1, name: "Joint de hublot lave-linge",    ref: "C00094128",      brand: "Whirlpool · Bauknecht · Bosch", price: 42.90, img: "/images/products/1-joint-hublot.jpg",   qty: 1 },
  { id: 2, name: "Pompe de vidange universelle",   ref: "481281729632",   brand: "Beko · Arçelik",                price: 38.50, img: "/images/products/2-pompe-vidange.jpg",  qty: 2 },
  { id: 3, name: "Courroie sèche-linge 1258C",     ref: "1258C-EPJ",      brand: "Miele · AEG · Electrolux",      price: 16.20, img: "/images/products/3-courroie.jpg",        qty: 1 },
];

const SHIPPING_FREE_THRESHOLD = 59;
const SHIPPING_COST = 4.95;

function EmptyCartSVG() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="60" fill="#F4EFE6" />
      <path d="M32 42h8l8 34h32l6-22H44" stroke="#E8DFD0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M32 42h8l8 34h32l6-22H44" stroke="#d97e3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="52" cy="82" r="4" fill="#d97e3a" opacity="0.8"/>
      <circle cx="72" cy="82" r="4" fill="#d97e3a" opacity="0.8"/>
      <path d="M44 54h24" stroke="#1a3a5c" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" opacity="0.3"/>
      <path d="M44 62h18" stroke="#1a3a5c" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" opacity="0.2"/>
    </svg>
  );
}

function CartItemRow({ item, onQty, onRemove, t }: { item: CartItem; onQty: (id: number, d: number) => void; onRemove: (id: number) => void; t: (k: string) => string }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.22 } }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="bg-white rounded-2xl border border-abelec-cream-line p-4 sm:p-5 flex items-center gap-4 sm:gap-6 max-sm:flex-col max-sm:items-start"
    >
      <Link href="/#produits" className="relative w-[80px] h-[80px] sm:w-[96px] sm:h-[96px] shrink-0 rounded-xl overflow-hidden bg-abelec-cream-light border border-abelec-cream-line">
        <Image src={item.img} alt={item.name} fill className="object-contain p-2.5" sizes="96px" />
      </Link>

      <div className="flex-1 min-w-0">
        <h3 className="font-slab text-abelec-navy font-bold text-[16px] leading-snug mb-1">{item.name}</h3>
        <p className="font-mono text-[11px] text-abelec-muted-2 mb-0.5">{t("cart.ref")} {item.ref}</p>
        <p className="text-[12px] text-abelec-muted truncate mb-2">{item.brand}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="font-slab font-bold text-abelec-navy-ink text-[18px]">
            {(item.price * item.qty).toFixed(2).replace(".", ",")}€
          </span>
          {item.qty > 1 && (
            <span className="font-mono text-[11.5px] text-abelec-muted-2">
              ({item.price.toFixed(2).replace(".", ",")}€ / {t("cart.unitPrice")})
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 max-sm:w-full max-sm:justify-between">
        <div className="flex items-center h-10 rounded-xl overflow-hidden border border-abelec-cream-line bg-abelec-cream-light">
          <button onClick={() => onQty(item.id, -1)} aria-label="-" className="w-9 h-full flex items-center justify-center hover:bg-abelec-cream-deep transition-colors">
            <Minus size={13} strokeWidth={2.2} className="text-abelec-navy" />
          </button>
          <motion.span key={item.qty} initial={{ scale: 1.3, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.18 }}
            className="w-10 text-center font-mono text-[14px] font-bold text-abelec-navy-ink select-none">
            {item.qty}
          </motion.span>
          <button onClick={() => onQty(item.id, 1)} aria-label="+" className="w-9 h-full flex items-center justify-center hover:bg-abelec-cream-deep transition-colors">
            <Plus size={13} strokeWidth={2.2} className="text-abelec-navy" />
          </button>
        </div>
        <button onClick={() => onRemove(item.id)} aria-label="Supprimer"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-abelec-muted-2 hover:text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100">
          <Trash2 size={15} strokeWidth={1.8} />
        </button>
      </div>
    </motion.div>
  );
}

export default function PanierPage() {
  const t = useT();
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);

  const updateQty  = (id: number, d: number) => setItems((p) => p.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const removeItem = (id: number) => setItems((p) => p.filter((i) => i.id !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping  = subtotal > 0 && subtotal < SHIPPING_FREE_THRESHOLD ? SHIPPING_COST : 0;
  const total     = subtotal + shipping;
  const isEmpty   = items.length === 0;
  const totalQty  = items.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <Header />
      <main className="min-h-[70vh]">
        {/* ── Title bar ───────────────────────────────────────────── */}
        <div className="border-b border-abelec-cream-line py-10 px-6" style={{ background: "linear-gradient(180deg,#F8F5F0 0%,#F4EFE6 100%)" }}>
          <div className="max-w-[1240px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}>
              <p className="eyebrow mb-3">{t("cart.pageEyebrow")}</p>
              <h1 className="font-slab text-abelec-navy-ink" style={{ fontSize: "clamp(30px,4.5vw,52px)", letterSpacing: "-0.025em" }}>
                {t("cart.pageTitle")}
                <AnimatePresence mode="wait">
                  {!isEmpty && (
                    <motion.span key="count" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.25 }} className="text-abelec-orange">
                      &nbsp;({items.length})
                    </motion.span>
                  )}
                </AnimatePresence>
              </h1>
            </motion.div>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────── */}
        <section className="py-12 px-6 bg-abelec-cream-light">
          <div className="max-w-[1240px] mx-auto">
            <AnimatePresence mode="wait">

              {isEmpty ? (
                /* ── Empty state ─────────────────────────────────── */
                <motion.div key="empty" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }} className="flex flex-col items-center justify-center py-24 text-center gap-7">
                  <EmptyCartSVG />
                  <div>
                    <h2 className="font-slab text-abelec-navy text-[28px] mb-2">{t("cart.emptyTitle")}</h2>
                    <p className="text-abelec-muted text-[16px] max-w-[340px] mx-auto leading-relaxed">{t("cart.emptySub")}</p>
                  </div>
                  <Link href="/#produits">
                    <motion.span whileHover={{ scale: 1.03, boxShadow: "0 8px 28px rgba(217,126,58,0.30)" }} whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2.5 bg-abelec-orange hover:bg-abelec-orange-dark text-white font-bold text-[15px] px-8 py-4 rounded-2xl shadow-[inset_0_-3px_0_rgba(0,0,0,.14)] transition-colors cursor-pointer">
                      <ShoppingCart size={17} strokeWidth={2} />
                      {t("cart.browseCta")}
                    </motion.span>
                  </Link>
                </motion.div>
              ) : (

              /* ── Filled state ────────────────────────────────────── */
                <motion.div key="filled" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                  className="grid grid-cols-[1fr_minmax(280px,360px)] gap-8 max-lg:grid-cols-1">

                  {/* Left — items */}
                  <div className="flex flex-col gap-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <CartItemRow key={item.id} item={item} onQty={updateQty} onRemove={removeItem} t={t} />
                      ))}
                    </AnimatePresence>

                    {/* Promo */}
                    <div className="bg-white rounded-2xl border border-dashed border-abelec-cream-line p-4 flex items-center gap-3">
                      <Tag size={15} strokeWidth={1.8} className="text-abelec-muted-2 shrink-0" />
                      <input type="text" placeholder={t("cart.promoPlaceholder")}
                        className="flex-1 bg-transparent text-[14px] text-abelec-navy-ink placeholder:text-abelec-muted-2 outline-none" />
                      <button className="font-mono text-[11.5px] font-bold text-abelec-orange hover:text-abelec-orange-dark transition-colors uppercase tracking-[0.08em]">
                        {t("cart.promoApply")}
                      </button>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                      <Link href="/#produits" className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-abelec-navy hover:text-abelec-orange transition-colors">
                        <ArrowRight size={14} strokeWidth={2.2} className="rotate-180" />
                        {t("cart.continueShopping")}
                      </Link>
                      <button onClick={() => setItems([])} className="text-[12.5px] text-abelec-muted-2 hover:text-red-500 transition-colors font-mono">
                        {t("cart.clearCart")}
                      </button>
                    </div>
                  </div>

                  {/* Right — summary */}
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} className="self-start sticky top-24">
                    <div className="bg-white rounded-2xl border border-abelec-cream-line shadow-card-md overflow-hidden">
                      <div className="px-6 pt-6 pb-4 border-b border-abelec-cream-line">
                        <h2 className="font-slab text-abelec-navy font-bold text-[20px]">{t("cart.summaryTitle")}</h2>
                      </div>
                      <div className="p-6 flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center text-[14px]">
                            <span className="text-abelec-muted">{t("cart.subtotal")} ({totalQty} {t("cart.articles")})</span>
                            <motion.span key={subtotal} initial={{ opacity: 0.5, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                              className="font-semibold text-abelec-navy-ink tabular-nums">
                              {subtotal.toFixed(2).replace(".", ",")}€
                            </motion.span>
                          </div>
                          <div className="flex justify-between items-center text-[14px]">
                            <span className="text-abelec-muted">{t("cart.shipping")}</span>
                            {shipping === 0
                              ? <span className="font-semibold text-[#2d6a4f]">{t("cart.shippingFree")}</span>
                              : <span className="font-semibold text-abelec-navy-ink tabular-nums">{shipping.toFixed(2).replace(".", ",")}€</span>
                            }
                          </div>
                          {shipping > 0 && (
                            <div className="rounded-lg px-3 py-2.5 text-[11.5px] font-mono" style={{ background: "#FDF7F0", color: "#c07b2a" }}>
                              {t("cart.shippingAdd")}{" "}
                              <strong>{(SHIPPING_FREE_THRESHOLD - subtotal).toFixed(2).replace(".", ",")}€</strong>{" "}
                              {t("cart.shippingFreeFrom")}
                            </div>
                          )}
                        </div>
                        <div className="h-px bg-abelec-cream-line" />
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="font-slab text-abelec-navy font-bold text-[17px]">{t("cart.totalLabel")}</p>
                            <p className="font-mono text-[10.5px] text-abelec-muted-2 mt-0.5">{t("cart.vatIncluded")}</p>
                          </div>
                          <motion.span key={total} initial={{ opacity: 0.5, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}
                            className="font-slab font-bold text-abelec-navy-ink tabular-nums" style={{ fontSize: "clamp(22px,3vw,28px)" }}>
                            {total.toFixed(2).replace(".", ",")}€
                          </motion.span>
                        </div>
                        <motion.button whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(217,126,58,0.35)" }} whileTap={{ scale: 0.99 }}
                          className="w-full h-[54px] rounded-2xl bg-abelec-orange hover:bg-abelec-orange-dark text-white font-bold text-[16px] flex items-center justify-center gap-2.5 transition-colors shadow-[inset_0_-3px_0_rgba(0,0,0,.14)]">
                          {t("cart.checkoutBtn")}
                          <ArrowRight size={16} strokeWidth={2.3} />
                        </motion.button>
                        <div className="flex flex-col gap-2.5 pt-1 border-t border-abelec-cream-line">
                          {([
                            { Icon: ShieldCheck, label: t("cart.badge1Label"), sub: t("cart.badge1Sub") },
                            { Icon: Truck,       label: t("cart.badge2Label"), sub: t("cart.badge2Sub") },
                            { Icon: Package,     label: t("cart.badge3Label"), sub: t("cart.badge3Sub") },
                          ] as const).map(({ Icon, label, sub }) => (
                            <div key={label} className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-abelec-cream-light flex items-center justify-center shrink-0">
                                <Icon size={13} strokeWidth={1.8} className="text-abelec-navy" />
                              </div>
                              <div>
                                <p className="text-[12.5px] font-semibold text-abelec-navy-ink">{label}</p>
                                <p className="font-mono text-[10px] text-abelec-muted-2">{sub}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
      <Footer />
      <HelpdeskFloat />
    </>
  );
}
