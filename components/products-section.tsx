"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, CheckCircle } from "lucide-react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const PRODUCTS = [
  {
    id: 1,
    category: "wash",
    slug: "joint-hublot-whirlpool-c00094128",
    nameKey: "products.product1Name",
    brands: "Whirlpool, Bauknecht, Bosch",
    ref: "C00094128",
    price: 42.9,
    stock: "in",
    img: "/images/products/1-joint-hublot.jpg",
  },
  {
    id: 2,
    category: "wash",
    slug: "pompe-vidange-beko-481281729632",
    nameKey: "products.product2Name",
    brands: "Beko, Arçelik",
    ref: "481281729632",
    price: 38.5,
    oldPrice: 49.0,
    stock: "in",
    img: "/images/products/2-pompe-vidange.jpg",
  },
  {
    id: 3,
    category: "wash",
    slug: "courroie-miele-1258c-epj",
    nameKey: "products.product3Name",
    brands: "Miele, AEG, Electrolux",
    ref: "1258C-EPJ",
    price: 16.2,
    stock: "in",
    img: "/images/products/3-courroie.jpg",
  },
  {
    id: 4,
    category: "fridge",
    slug: "thermostat-liebherr-ts-r59l1102",
    nameKey: "products.product4Name",
    brands: "Liebherr, Siemens",
    ref: "TS-R59L1102",
    price: 28.0,
    stock: "in",
    img: "/images/products/4-thermostat.jpg",
  },
  {
    id: 5,
    category: "oven",
    slug: "resistance-four-brandt-rf-78954",
    nameKey: "products.product5Name",
    brands: "Brandt, De Dietrich",
    ref: "RF-78954",
    price: 45.9,
    stock: "order",
    img: "/images/products/5-resistance-four.jpg",
  },
  {
    id: 6,
    category: "dish",
    slug: "electrovanne-bosch-ev-2v-bsh",
    nameKey: "products.product6Name",
    brands: "Bosch, Siemens, Neff",
    ref: "EV-2V-BSH",
    price: 32.5,
    stock: "in",
    img: "/images/products/6-electrovanne.jpg",
  },
  {
    id: 7,
    category: "vacuum",
    slug: "filtre-hepa-dyson-hepa-dy-r",
    nameKey: "products.product7Name",
    brands: "Dyson, Rowenta",
    ref: "HEPA-DY-R",
    price: 24.9,
    stock: "in",
    img: "/images/products/7-filtre-hepa.jpg",
  },
  {
    id: 8,
    category: "wash",
    slug: "moteur-indesit-mu-ih-550w",
    nameKey: "products.product8Name",
    brands: "Indesit, Hotpoint",
    ref: "MU-IH-550W",
    price: 89.0,
    stock: "in",
    img: "/images/products/8-moteur.jpg",
  },
];


const TABS = [
  { id: "all",     labelKey: "products.tabAll" },
  { id: "wash",    labelKey: "products.tabWash" },
  { id: "dish",    labelKey: "products.tabDish" },
  { id: "fridge",  labelKey: "products.tabFridge" },
  { id: "oven",    labelKey: "products.tabOven" },
];

function ProductCard({ product, t }: { product: typeof PRODUCTS[0]; t: (k: string) => string }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.22 }}
      className="group bg-white rounded-[14px] overflow-hidden border border-abelec-cream-line hover:border-abelec-orange hover:shadow-card-md transition-[border-color,box-shadow] duration-200 flex flex-col"
    >
      {/* Photo */}
      <Link href={`/produit/${product.slug}`} className="block relative bg-white border-b border-abelec-cream-line overflow-hidden" style={{ height: "160px" }}>
        {product.oldPrice && (
          <span className="absolute top-2 left-2 z-10 font-mono text-[9px] bg-abelec-orange text-white px-1.5 py-0.5 rounded-full">
            {t("products.promo")}
          </span>
        )}
        <span className="absolute top-2 right-2 z-10 font-mono text-[9px] text-abelec-muted-2 tracking-[0.06em]">
          {t("products.ref")}{product.ref.slice(0, 6)}
        </span>
        <Image
          src={product.img}
          alt={t(product.nameKey)}
          fill
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300 will-change-transform"
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 20vw, 16vw"
        />
      </Link>

      {/* Info */}
      <div className="p-[12px] flex flex-col flex-1">
        <div>
          <Link href={`/produit/${product.slug}`}>
            <h3 className="font-slab text-abelec-navy font-bold text-[13px] mb-0.5 leading-snug group-hover:text-abelec-orange transition-colors">
              {t(product.nameKey)}
            </h3>
          </Link>

          <p className="text-[11px] text-abelec-muted truncate">{product.brands}</p>
          <p className="text-[11px] font-mono text-abelec-muted-2 mb-1">{t("products.ref")} {product.ref}</p>

          {/* Price row */}
          <div className="flex items-baseline gap-1 mb-1.5 mt-1">
            <span className="font-slab font-bold text-abelec-navy text-[16px] tracking-[-0.01em]">
              {product.price.toFixed(2)}&euro;
            </span>
            {product.oldPrice && (
              <span className="text-[11px] text-abelec-muted-2 line-through">
                {product.oldPrice.toFixed(2)}&euro;
              </span>
            )}
            <span className="text-[10px] text-abelec-muted">{t("products.tax")}</span>
          </div>

          {/* Stock badge */}
          <div className="flex items-center gap-1 mb-1">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                product.stock === "in" ? "bg-green-500" : "bg-abelec-orange"
              )}
            />
            <span
              className={cn(
                "text-[11px] font-medium",
                product.stock === "in" ? "text-green-700" : "text-abelec-orange"
              )}
            >
              {product.stock === "in" ? t("products.inStock") : t("products.onOrder")}
            </span>
          </div>

          {/* DIY hint */}
          <p className="text-[11px] mb-2" style={{ color: "rgba(26,58,92,0.45)" }}>
            {t("products.diyHint")}
          </p>
        </div>

        {/* Add to cart — anchored to bottom */}
        <div className="mt-auto px-1 pb-0.5">
          <button
            onClick={handleAdd}
            className={cn(
              "w-full h-[34px] rounded-lg font-semibold text-[12px] flex items-center justify-center gap-1.5 transition-[background-color] duration-150",
              added
                ? "bg-green-500 text-white"
                : "bg-abelec-orange hover:bg-[#b8612a] text-white shadow-[inset_0_-2px_0_rgba(0,0,0,.12)]"
            )}
          >
            {added ? (
              <>
                <CheckCircle size={13} />
                {t("products.added")}
              </>
            ) : (
              <>
                <ShoppingBag size={13} strokeWidth={2} />
                {t("products.addToCart")}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductsSection() {
  const t = useT();
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeTab);

  return (
    <section className="bg-abelec-cream-light py-16 px-6">
      <div className="max-w-[1240px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="eyebrow mb-4">&mdash; {t("products.selectionEyebrow")} &mdash;</p>
          <h2 className="font-slab text-abelec-navy">
            {t("products.title")}{" "}
            <span className="text-abelec-orange italic">{t("products.titleAccent")}</span>
          </h2>
          <p className="mt-4 text-[17px] text-abelec-muted">
            {t("products.sub")}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-[13.5px] font-medium transition-all",
                activeTab === tab.id
                  ? "bg-abelec-navy text-white shadow-card-sm"
                  : "bg-white border border-abelec-cream-line text-abelec-navy hover:border-abelec-orange"
              )}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Grid title */}
        <p style={{ fontWeight: 700, color: "#E8732A", fontSize: "clamp(18px, 2vw, 22px)", marginBottom: "1.25rem" }}>
          {t("products.sectionTitle")}
        </p>

        {/* Grid 5×2 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-4 gap-3 max-lg:grid-cols-3 max-sm:grid-cols-2"
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} t={t} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View all CTA */}
        <div className="text-center mt-8">
          <a
            href="#"
            className="inline-flex items-center gap-2 font-semibold text-abelec-navy hover:text-abelec-orange transition-colors text-[15px]"
          >
            {t("products.viewAll")}
            <ArrowRight size={16} strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </section>
  );
}
