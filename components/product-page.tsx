"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ShoppingBag, ShoppingCart, ShieldCheck, RotateCcw, Truck,
  CheckCircle, Search, ChevronDown, Play, X, Clock, Zap,
  MessageCircle, ArrowRight, ZoomIn, Star, Minus, Plus, Package, MapPin,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HelpdeskFloat from "@/components/helpdesk-float";
import { cn } from "@/lib/utils";
import { useT, useI18n } from "@/lib/i18n";
import { type ProductData, getProductBySlug, getRelatedProducts } from "@/data/products";

// ── Locale → Intl locale code ─────────────────────────────────────────────
const INTL_LOCALE: Record<string, string> = {
  fr: "fr-FR", nl: "nl-NL", en: "en-GB", de: "de-DE", it: "it-IT",
};

// ── Difficulty key map (internal French value → translation key) ──────────
const DIFFICULTY_KEY: Record<string, string> = {
  "Facile":        "productPage.difficultyEasy",
  "Intermédiaire": "productPage.difficultyIntermediate",
  "Expert":        "productPage.difficultyExpert",
};

const DIFFICULTY_STYLE: Record<string, React.CSSProperties> = {
  Facile:        { background: "#f0faf5", color: "#2d6a4f" },
  Intermédiaire: { background: "#fff8f0", color: "#c07b2a" },
  Expert:        { background: "#fff5f3", color: "#c0392b" },
};

// ── Date helpers ───────────────────────────────────────────────────────────
function addBusinessDays(from: Date, n: number): Date {
  const d = new Date(from);
  let added = 0;
  while (added < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) added++;
  }
  return d;
}

function fmtDate(d: Date, intlLocale: string): string {
  return new Intl.DateTimeFormat(intlLocale, {
    weekday: "long", day: "numeric", month: "long",
  }).format(d);
}

// ── Photo gallery ──────────────────────────────────────────────────────────
function PhotoGallery({ images, name, has3D }: { images: string[]; name: string; has3D: boolean }) {
  const t = useT();
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Main image */}
        <div
          className="relative overflow-hidden cursor-zoom-in"
          style={{ background: "transparent", aspectRatio: "1/1" }}
          onClick={() => setLightbox(true)}
        >
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={images[active]}
              alt={name}
              fill
              className="object-contain p-10"
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
          </motion.div>

          <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 pointer-events-none">
            <ZoomIn size={14} className="text-abelec-navy opacity-60" />
          </div>

          {has3D && (
            <div className="absolute bottom-3 left-3 bg-abelec-orange text-white font-mono text-[10px] font-semibold px-3 py-1.5 rounded-full tracking-[0.1em]">
              {t("productPage.view3d")}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2.5">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0",
                  i === active
                    ? "border-abelec-orange shadow-[0_0_0_3px_rgba(217,126,58,0.15)]"
                    : "border-abelec-cream-line hover:border-abelec-orange/50"
                )}
                style={{ background: "#F8F5F0" }}
              >
                <Image src={src} alt={`${i + 1}`} fill className="object-contain p-1.5" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-6"
            style={{ background: "rgba(15,35,64,0.88)" }}
            onClick={() => setLightbox(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden border border-abelec-cream-line"
              style={{ background: "#F8F5F0", aspectRatio: "1/1" }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[active]} alt={name} fill className="object-contain p-12" sizes="80vw" priority />
              <button
                onClick={() => setLightbox(false)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
              >
                <X size={16} className="text-abelec-navy" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Purchase panel ─────────────────────────────────────────────────────────
function PurchasePanel({ product }: { product: ProductData }) {
  const t = useT();
  const { locale } = useI18n();
  const intlLocale = INTL_LOCALE[locale] ?? "fr-FR";

  const [addedCart, setAddedCart] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [stockMsg, setStockMsg] = useState("");
  const [deliveryStandard, setDeliveryStandard] = useState("");
  const [deliveryExpress, setDeliveryExpress] = useState("");

  useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    if (product.stock !== "in") {
      setStockMsg(t("productPage.stockDelay"));
      setDeliveryStandard(t("productPage.deliveryPending"));
      setDeliveryExpress(t("productPage.deliveryPending"));
      return;
    }
    if (h < 14) {
      setStockMsg(t("productPage.stockOrderedBefore14"));
      setDeliveryStandard(`${t("productPage.deliveredOn")} ${fmtDate(addBusinessDays(now, 2), intlLocale)}`);
      setDeliveryExpress(`${t("productPage.deliveredOn")} ${fmtDate(addBusinessDays(now, 1), intlLocale)}`);
    } else {
      const nextBiz = addBusinessDays(now, 1);
      setStockMsg(`${t("productPage.stockShippedOn")} ${fmtDate(nextBiz, intlLocale)}`);
      setDeliveryStandard(`${t("productPage.deliveredOn")} ${fmtDate(addBusinessDays(now, 3), intlLocale)}`);
      setDeliveryExpress(`${t("productPage.deliveredOn")} ${fmtDate(addBusinessDays(now, 2), intlLocale)}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.stock, locale]);

  const isInStock = product.stock === "in";
  const visibleBrands = product.brands.slice(0, 3);
  const hiddenBrands = product.brands.slice(3);

  const microGuarantees = [
    { Icon: ShieldCheck, label: t("productPage.guarantee") },
    { Icon: RotateCcw,   label: t("productPage.returns") },
    { Icon: Truck,       label: t("productPage.delivery48h") },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-5"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 flex-wrap" aria-label={t("productPage.breadcrumbAria")}>
        <Link href="/" className="text-[12px] font-mono text-abelec-muted-2 hover:text-abelec-navy transition-colors">
          {t("productPage.breadcrumbHome")}
        </Link>
        {product.category.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1">
            <ChevronRight size={11} className="text-abelec-muted-2 shrink-0" />
            <span className={cn(
              "text-[12px] font-mono",
              i === product.category.length - 1
                ? "text-abelec-navy-ink font-semibold"
                : "text-abelec-muted-2"
            )}>
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Name + reference */}
      <div>
        <h1 className="font-slab text-abelec-navy-ink leading-tight mb-2"
          style={{ fontSize: "clamp(26px,3vw,36px)" }}>
          {t(product.nameKey)}
        </h1>
        <p className="font-slab text-abelec-muted text-[17px] mb-2">{t(product.subtitleKey)}</p>
        <p className="font-mono text-abelec-orange text-[14px] tracking-[0.05em]">
          {t("productPage.ref")}&nbsp;{product.ref}
          <span className="ml-3 text-abelec-muted-2 text-[11px] tracking-normal">EAN {product.ean}</span>
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={13}
              className={s <= Math.round(product.rating) ? "text-abelec-orange fill-abelec-orange" : "text-abelec-cream-line fill-abelec-cream-line"}
            />
          ))}
        </div>
        <span className="font-mono text-[12px] text-abelec-muted-2">
          {product.rating} · {product.reviewCount} {t("productPage.verifiedReviews")}
        </span>
      </div>

      {/* Compatibility */}
      <div>
        <button onClick={() => setBrandsOpen((o) => !o)} className="flex items-start gap-1 text-left group">
          <span className="text-[13.5px] text-abelec-muted leading-relaxed">
            <span className="font-semibold text-abelec-navy-ink">{t("productPage.compatibleWith")}</span>{" "}
            {visibleBrands.join(" · ")}
            {hiddenBrands.length > 0 && (
              <span className="ml-1.5 text-abelec-orange font-semibold">
                +{hiddenBrands.length} {t("productPage.moreBrands")}
                <ChevronDown size={13} className={cn("inline ml-0.5 transition-transform duration-200", brandsOpen && "rotate-180")} />
              </span>
            )}
          </span>
        </button>
        <AnimatePresence>
          {brandsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {hiddenBrands.map((b) => (
                  <span key={b} className="font-mono text-[11px] bg-abelec-cream-deep text-abelec-navy px-2.5 py-1 rounded-full border border-abelec-cream-line">
                    {b}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 pt-1">
        <span className="font-slab font-bold text-abelec-navy-ink leading-none tracking-tight"
          style={{ fontSize: "clamp(18px,1.6vw,22px)" }}>
          {product.price.toFixed(2).replace(".", ",")}€
        </span>
        {product.oldPrice && (
          <span className="text-[15px] text-abelec-muted-2 line-through">
            {product.oldPrice.toFixed(2).replace(".", ",")}€
          </span>
        )}
        <div className="flex flex-col pb-0.5">
          <span className="text-[11.5px] text-abelec-muted font-mono">{t("productPage.ttc")}</span>
          <span className="text-[11px] text-abelec-muted-2 font-mono">
            {product.priceHT.toFixed(2).replace(".", ",")}€ HT
          </span>
        </div>
      </div>

      {/* Stock badge */}
      <div
        className="w-full rounded-[8px] px-4 py-3 flex items-center gap-2.5"
        style={isInStock
          ? { background: "#f0faf4", border: "1px solid rgba(45,106,79,0.35)" }
          : { background: "#fff8f0", border: "1px solid rgba(217,126,58,0.35)" }
        }
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: isInStock ? "#2d6a4f" : "#d97e3a" }}
        />
        <span className="text-[13.5px] font-semibold text-abelec-navy-ink">
          {isInStock
            ? `${t("productPage.inStock")} — ${stockMsg}`
            : `${t("productPage.onOrder")} — ${stockMsg}`
          }
        </span>
      </div>

      {/* Quantity + Add to cart */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex items-center gap-3">
          <span className="text-[12.5px] text-abelec-muted font-medium">{t("productPage.quantity")}</span>
          <div
            className="flex items-center h-11 rounded-xl overflow-hidden bg-white"
            style={{ width: "120px", border: "1px solid #1a3a5c" }}
          >
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-10 h-full flex items-center justify-center hover:bg-abelec-cream-light transition-colors shrink-0"
            >
              <Minus size={14} strokeWidth={2} className="text-abelec-navy" />
            </button>
            <span className="flex-1 text-center font-mono text-[15px] font-semibold text-abelec-navy-ink select-none">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              className="w-10 h-full flex items-center justify-center hover:bg-abelec-cream-light transition-colors shrink-0"
            >
              <Plus size={14} strokeWidth={2} className="text-abelec-navy" />
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(217,126,58,0.38)" }}
          whileTap={{ scale: 0.99 }}
          onClick={() => { setAddedCart(true); setTimeout(() => setAddedCart(false), 2000); }}
          className={cn(
            "w-full h-[52px] rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2.5 transition-colors duration-200",
            addedCart ? "bg-[#2d6a4f] text-white" : "bg-abelec-orange hover:bg-abelec-orange-dark text-white shadow-[inset_0_-3px_0_rgba(0,0,0,.14)]"
          )}
        >
          {addedCart
            ? <><CheckCircle size={18} strokeWidth={2.2} /> {t("productPage.addedToCart")}</>
            : <><ShoppingCart size={18} strokeWidth={2.2} /> {t("productPage.addToCart")}</>
          }
        </motion.button>
      </div>

      {/* Expert callout */}
      <div className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl"
        style={{ background: "#FDF7F0", border: "1px solid rgba(217,126,58,0.28)" }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <MessageCircle size={15} className="text-abelec-orange shrink-0" />
          <span className="text-[13px] text-abelec-muted leading-snug">{t("productPage.compatibilityDoubt")}</span>
        </div>
        <a href="#" className="flex items-center gap-1 text-[13px] font-semibold text-abelec-orange hover:underline whitespace-nowrap shrink-0">
          {t("productPage.talkToExpert")} <ArrowRight size={13} strokeWidth={2.2} />
        </a>
      </div>

      {/* Delivery options */}
      <div
        className="rounded-[8px] px-4 py-4"
        style={{ background: "#FAF7F3", border: "1px solid rgba(26,58,92,0.1)" }}
      >
        <div className="flex flex-col gap-3.5">
          <div className="flex items-start gap-3">
            <Truck size={16} className="text-abelec-navy shrink-0 mt-0.5" strokeWidth={1.8} />
            <div>
              <p className="text-[13.5px] font-semibold text-abelec-navy-ink">{t("productPage.deliveryStandard")}</p>
              <p className="text-[12.5px] text-abelec-muted">{deliveryStandard}</p>
            </div>
          </div>
          <div className="border-t border-abelec-cream-line" />
          <div className="flex items-start gap-3">
            <Package size={16} className="text-abelec-navy shrink-0 mt-0.5" strokeWidth={1.8} />
            <div>
              <p className="text-[13.5px] font-semibold text-abelec-navy-ink">{t("productPage.deliveryExpress")}</p>
              <p className="text-[12.5px] text-abelec-muted">{deliveryExpress}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store pickup */}
      <div className="flex items-center gap-2">
        <MapPin size={14} className="shrink-0" style={{ color: "rgba(26,58,92,0.6)" }} strokeWidth={1.8} />
        <p className="text-[12.5px]" style={{ color: "rgba(26,58,92,0.6)" }}>
          {t("productPage.storePickup")}
        </p>
      </div>

      {/* Micro-guarantees */}
      <div className="flex items-center gap-5 flex-wrap pt-1 border-t border-abelec-cream-line">
        {microGuarantees.map(({ Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[12.5px] text-abelec-muted">
            <Icon size={14} strokeWidth={1.8} className="text-abelec-navy shrink-0" />
            {label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Compatibility checker ──────────────────────────────────────────────────
function CompatibilityChecker({ product }: { product: ProductData }) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<"compatible" | "incompatible" | null>(null);

  const checkModel = (q: string) => {
    const norm = q.trim().toUpperCase();
    if (!norm) return;
    const match = product.compatibleModels.some(
      (m) => m.toUpperCase().includes(norm) || norm.includes(m.toUpperCase())
    );
    setResult(match ? "compatible" : "incompatible");
  };

  const exampleChips = product.compatibleModels.slice(0, 4);

  return (
    <section className="py-16 px-6" style={{ background: "#F0EBE3" }}>
      <div className="max-w-[1240px] mx-auto">
        <div className="max-w-[640px] mx-auto text-center">
          <p className="eyebrow mb-3">— {t("productPage.compatEyebrow")} —</p>
          <h2 className="font-slab text-abelec-navy mb-3" style={{ fontSize: "clamp(22px,2.6vw,30px)" }}>
            {t("productPage.compatTitle")}
          </h2>
          <p className="text-[15px] text-abelec-muted mb-8 leading-relaxed">
            {t("productPage.compatSub")}
          </p>

          <form onSubmit={(e) => { e.preventDefault(); checkModel(query); }} className="flex gap-2 max-sm:flex-col">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-abelec-muted-2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setResult(null); }}
                placeholder={t("productPage.compatPlaceholder")}
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-abelec-cream-line text-[14px] font-mono text-abelec-navy-ink placeholder:text-abelec-muted-2 outline-none focus:border-abelec-orange transition-colors"
              />
            </div>
            <button type="submit" className="h-12 px-6 bg-abelec-navy text-white rounded-xl font-semibold text-[14px] hover:bg-abelec-navy-ink transition-colors shrink-0">
              {t("productPage.compatCheck")}
            </button>
          </form>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={result}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="mt-4 flex items-start gap-3 px-4 py-3.5 rounded-xl text-[14px] font-medium text-left border"
                style={result === "compatible"
                  ? { background: "#f0faf5", borderColor: "rgba(45,106,79,0.22)", color: "#2d6a4f" }
                  : { background: "#fff5f3", borderColor: "rgba(220,60,60,0.22)", color: "#c0392b" }}
              >
                {result === "compatible" ? (
                  <><CheckCircle size={18} className="shrink-0 mt-0.5" />
                  <span>
                    <strong>{t("productPage.compatOkPrefix")}</strong>{" "}
                    {t("productPage.compatOkWith")}{" "}
                    <span className="font-mono">{query.trim().toUpperCase()}</span>.{" "}
                    {t("productPage.compatOkSuffix")}
                  </span></>
                ) : (
                  <><X size={18} className="shrink-0 mt-0.5" />
                  <span>
                    <strong>{t("productPage.compatFailPrefix")}</strong>{" "}
                    {t("productPage.compatFailWith")}{" "}
                    <span className="font-mono">{query.trim().toUpperCase()}</span>.{" "}
                    <a href="#" className="underline hover:opacity-80">{t("productPage.compatFailLink")}</a>
                  </span></>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            <span className="text-[11px] text-abelec-muted-2 font-mono self-center mr-1">{t("productPage.compatTry")}</span>
            {exampleChips.map((m) => (
              <button key={m} onClick={() => { setQuery(m); checkModel(m); }}
                className="font-mono text-[11px] bg-white text-abelec-navy px-2.5 py-1 rounded-full border border-abelec-cream-line hover:border-abelec-orange transition-colors">
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Description & Installation tabs ───────────────────────────────────────
function DescriptionTabs({ product }: { product: ProductData }) {
  const t = useT();
  const [tab, setTab] = useState<"desc" | "install">("desc");

  const specs = [
    { label: t("productPage.specRef"),        value: product.ref },
    { label: "EAN",                            value: product.ean },
    { label: t("productPage.specDimensions"), value: product.dimensions },
    { label: t("productPage.specMaterial"),   value: product.material },
    { label: t("productPage.specWeight"),     value: product.weight },
    { label: t("productPage.specWarranty"),   value: t("productPage.specWarrantyValue") },
    { label: t("productPage.specCondition"),  value: t("productPage.specConditionValue") },
  ];

  const TABS = [
    { id: "desc",    label: t("productPage.tabDescription") },
    { id: "install", label: t("productPage.tabInstallation") },
  ];

  return (
    <section className="py-16 px-6 bg-abelec-cream-light">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex gap-1 bg-abelec-cream-deep rounded-2xl p-1 mb-10 w-fit">
          {TABS.map((tab_) => (
            <button key={tab_.id} onClick={() => setTab(tab_.id as "desc" | "install")}
              className={cn(
                "px-6 py-2.5 rounded-xl text-[14px] font-semibold transition-all",
                tab === tab_.id ? "bg-white text-abelec-navy-ink shadow-card-sm" : "text-abelec-muted hover:text-abelec-navy-ink"
              )}>
              {tab_.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "desc" ? (
            <motion.div key="desc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
              className="grid grid-cols-2 gap-12 max-lg:grid-cols-1">
              <div>
                <h3 className="font-slab text-abelec-navy text-[20px] mb-5">{t("productPage.techSpecs")}</h3>
                <div className="divide-y divide-abelec-cream-line">
                  {specs.map(({ label, value }) => (
                    <div key={label} className="py-3 grid gap-2 sm:gap-4" style={{ gridTemplateColumns: "clamp(90px, 30%, 140px) 1fr" }}>
                      <span className="text-[11.5px] font-mono text-abelec-muted-2 uppercase tracking-[0.07em] self-center">{label}</span>
                      <span className="text-[14px] text-abelec-navy-ink font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-slab text-abelec-navy text-[20px] mb-4">{t("productPage.compatBrands")}</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.brands.map((b) => (
                    <span key={b} className="font-mono text-[12px] bg-white text-abelec-navy px-3 py-1.5 rounded-full border border-abelec-cream-line">{b}</span>
                  ))}
                </div>
                <h3 className="font-slab text-abelec-navy text-[20px] mb-4">
                  {t("productPage.compatModels")}{" "}
                  <span className="text-[14px] font-sans font-normal text-abelec-muted-2">{t("productPage.partialList")}</span>
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {product.compatibleModels.map((m) => (
                    <span key={m} className="font-mono text-[12px] text-abelec-muted flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "rgba(217,126,58,0.5)" }} />
                      {m}
                    </span>
                  ))}
                  <span className="font-mono text-[12px] text-abelec-orange col-span-2 mt-1">
                    {t("productPage.moreModels")}
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="install" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <div className="flex items-center gap-4 mb-10 flex-wrap">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[13px] px-3.5 py-1.5 rounded-full"
                  style={DIFFICULTY_STYLE[product.installDifficulty]}>
                  <Zap size={13} strokeWidth={2} />
                  {t(DIFFICULTY_KEY[product.installDifficulty] ?? "productPage.difficultyEasy")}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-abelec-muted font-mono">
                  <Clock size={13} strokeWidth={1.8} className="text-abelec-navy" />
                  {t("productPage.estimatedDuration")} {product.installTime}
                </span>
                <a href={product.installVideoUrl} className="flex items-center gap-1.5 text-[13px] text-abelec-orange font-semibold hover:underline">
                  <Play size={13} strokeWidth={2} className="fill-abelec-orange" />
                  {t("productPage.watchTutorial")}
                </a>
              </div>

              <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1 mb-10">
                {product.installSteps.map((step, idx) => (
                  <motion.div key={step.num} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.45 }} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-abelec-navy text-white font-slab font-bold text-[18px] flex items-center justify-center shrink-0 mt-0.5">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="font-slab text-abelec-navy font-bold text-[16px] mb-2">{step.title}</h4>
                      <p className="text-[13.5px] text-abelec-muted leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl"
                style={{ background: "#F0EBE3", border: "1px solid #E8DFD0" }}>
                <div>
                  <p className="font-slab text-abelec-navy font-bold text-[17px] mb-1">{t("productPage.installHelp")}</p>
                  <p className="text-[13.5px] text-abelec-muted">{t("productPage.installHelpSub")}</p>
                </div>
                <a href="#" className="flex items-center gap-2 bg-abelec-navy text-white font-semibold text-[14px] px-5 py-3 rounded-xl hover:bg-abelec-navy-ink transition-colors shrink-0">
                  <MessageCircle size={15} strokeWidth={2} /> {t("productPage.contactHelpdesk")}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Related product card ───────────────────────────────────────────────────
function RelatedCard({ product }: { product: ProductData }) {
  const t = useT();
  const [added, setAdded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
      className="group bg-white rounded-[14px] overflow-hidden border border-abelec-cream-line hover:border-abelec-orange hover:shadow-card-md transition-[border-color,box-shadow] duration-200 flex flex-col"
    >
      <Link href={`/produit/${product.slug}`} className="relative aspect-square bg-white border-b border-abelec-cream-line overflow-hidden block">
        {product.oldPrice && (
          <span className="absolute top-3 left-3 z-10 font-mono text-[9.5px] bg-abelec-orange text-white px-2 py-0.5 rounded-full">
            {t("productPage.promo")}
          </span>
        )}
        <Image src={product.images[0]} alt={t(product.nameKey)} fill
          className="object-contain p-5 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/produit/${product.slug}`}>
          <h3 className="font-slab text-abelec-navy font-bold text-[15px] mb-1 group-hover:text-abelec-orange transition-colors">
            {t(product.nameKey)}
          </h3>
        </Link>
        <p className="text-[12px] text-abelec-muted truncate mb-1">{product.brands.slice(0, 3).join(", ")}</p>
        <p className="text-[11px] font-mono text-abelec-muted-2 mb-3">{t("productPage.ref")}&nbsp;{product.ref}</p>
        <div className="flex items-baseline gap-1.5 mb-4 mt-auto">
          <span className="font-slab font-bold text-abelec-navy text-[20px]">
            {product.price.toFixed(2).replace(".", ",")}€
          </span>
          {product.oldPrice && (
            <span className="text-[13px] text-abelec-muted-2 line-through">
              {product.oldPrice.toFixed(2).replace(".", ",")}€
            </span>
          )}
          <span className="text-[11px] text-abelec-muted">{t("productPage.ttc")}</span>
        </div>
        <button
          onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1500); }}
          className={cn(
            "w-full py-2.5 rounded-xl font-semibold text-[13.5px] flex items-center justify-center gap-2 transition-colors duration-150",
            added ? "bg-green-500 text-white" : "bg-abelec-orange hover:bg-abelec-orange-dark text-white shadow-[inset_0_-2px_0_rgba(0,0,0,.12)]"
          )}
        >
          {added
            ? <><CheckCircle size={14} strokeWidth={2} /> {t("productPage.added")}</>
            : <><ShoppingBag size={14} strokeWidth={2} /> {t("productPage.addToCart")}</>
          }
        </button>
      </div>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ProductPage({ slug }: { slug: string }) {
  const t = useT();
  const product = getProductBySlug(slug);
  const related = product ? getRelatedProducts(product) : [];

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6">
          <p className="font-slab text-abelec-navy text-[28px]">{t("productPage.notFound")}</p>
          <p className="text-abelec-muted">{t("productPage.notFoundSub")}</p>
          <Link href="/#produits" className="mt-4 inline-flex items-center gap-2 bg-abelec-orange text-white font-semibold px-6 py-3 rounded-xl hover:bg-abelec-orange-dark transition-colors">
            <ArrowRight size={16} /> {t("productPage.viewAllParts")}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        {/* Above the fold */}
        <section className="bg-abelec-cream-light py-10 px-6">
          <div className="max-w-[1240px] mx-auto">
            <div className="grid gap-12 max-lg:grid-cols-1" style={{ gridTemplateColumns: "55fr 45fr" }}>
              <PhotoGallery images={product.images} name={t(product.nameKey)} has3D={product.has3D} />
              <PurchasePanel product={product} />
            </div>
          </div>
        </section>

        <CompatibilityChecker product={product} />
        <DescriptionTabs product={product} />

        {/* Related products */}
        <section className="py-16 px-6 bg-abelec-cream-deep">
          <div className="max-w-[1240px] mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="eyebrow mb-2">— {t("productPage.relatedEyebrow")} —</p>
                <h2 className="font-slab text-abelec-navy" style={{ fontSize: "clamp(22px,2.6vw,30px)" }}>
                  {t("productPage.relatedTitle")}
                </h2>
              </div>
              <Link href="/#produits" className="hidden sm:flex items-center gap-1.5 text-[14px] font-semibold text-abelec-navy hover:text-abelec-orange transition-colors">
                {t("productPage.viewAll")} <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-5 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {related.map((p) => <RelatedCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <HelpdeskFloat />
    </>
  );
}
