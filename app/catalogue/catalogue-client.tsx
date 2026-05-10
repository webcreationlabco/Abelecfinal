"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, X, ShoppingCart, Check,
  LayoutGrid, List, SlidersHorizontal,
  ChevronLeft, ChevronRight, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RAW_PRODUCTS from "@/data/products";

/* ═══════════════════════════════════════════════════════════════════════════
   Types & data
   ═══════════════════════════════════════════════════════════════════════════ */
type Category = "lave-linge" | "lave-vaisselle" | "refrigerateur" | "four" | "seche-linge" | "aspirateur";
type ViewMode = "grid" | "list";
type SortKey = "pertinence" | "prix-asc" | "prix-desc" | "ventes" | "nouveautes";

interface Product {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  ref: string;
  category: Category;
  brands: string[];
  price: number;
  oldPrice?: number;
  stock: "in" | "order";
  rating: number;
  reviews: number;
  img: string;
}

const CAT_MAP: Record<string, Category> = {
  "Lave-linge":        "lave-linge",
  "Lave-vaisselle":    "lave-vaisselle",
  "Réfrigérateur":     "refrigerateur",
  "Four & Cuisinière": "four",
  "Sèche-linge":       "seche-linge",
  "Aspirateur":        "aspirateur",
};

const PRODUCTS: Product[] = RAW_PRODUCTS
  .filter((p) => !!CAT_MAP[p.category[0]])
  .map((p) => ({
    id:       p.id,
    slug:     p.slug,
    name:     p.name,
    subtitle: p.subtitle,
    ref:      p.ref,
    category: CAT_MAP[p.category[0]],
    brands:   p.brands,
    price:    p.price,
    oldPrice: p.oldPrice,
    stock:    p.stock,
    rating:   p.rating,
    reviews:  p.reviewCount,
    img:      p.images[0],
  }));

const CATEGORY_LABELS: Record<Category, string> = {
  "lave-linge":     "Lave-linge",
  "lave-vaisselle": "Lave-vaisselle",
  "refrigerateur":  "Réfrigérateur",
  "four":           "Four",
  "seche-linge":    "Sèche-linge",
  "aspirateur":     "Aspirateur",
};

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS) as [Category, string][];
const ALL_BRANDS = ["Whirlpool", "Bosch", "Miele", "AEG", "Beko", "Siemens", "Liebherr", "Dyson", "Indesit", "Brandt"];
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "pertinence",  label: "Pertinence" },
  { value: "prix-asc",    label: "Prix croissant" },
  { value: "prix-desc",   label: "Prix décroissant" },
  { value: "ventes",      label: "Meilleures ventes" },
  { value: "nouveautes",  label: "Nouveautés" },
];
const PER_PAGE = 9;

/* ═══════════════════════════════════════════════════════════════════════════
   Price range slider
   ═══════════════════════════════════════════════════════════════════════════ */
function PriceRangeSlider({
  minVal, maxVal, onChange,
}: { minVal: number; maxVal: number; onChange: (min: number, max: number) => void }) {
  const ABS_MIN = 0, ABS_MAX = 200;
  const minPct = ((minVal - ABS_MIN) / (ABS_MAX - ABS_MIN)) * 100;
  const maxPct = ((maxVal - ABS_MIN) / (ABS_MAX - ABS_MIN)) * 100;

  return (
    <>
      {/* thumb styles injected once per page (class-scoped) */}
      <style>{`
        .cat-range { -webkit-appearance:none; appearance:none; position:absolute;
          width:100%; height:4px; background:transparent; pointer-events:none; outline:none; }
        .cat-range::-webkit-slider-thumb { -webkit-appearance:none; pointer-events:all;
          width:18px; height:18px; background:#d97e3a; border:2.5px solid #fff;
          border-radius:50%; cursor:pointer; box-shadow:0 1px 4px rgba(0,0,0,.18); }
        .cat-range::-moz-range-thumb { pointer-events:all; width:18px; height:18px;
          background:#d97e3a; border:2.5px solid #fff; border-radius:50%; cursor:pointer; }
      `}</style>

      <div className="relative" style={{ height: 20 }}>
        {/* Track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-[4px] rounded-full bg-[rgba(26,58,92,0.10)]" />
        {/* Fill */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[4px] rounded-full bg-abelec-orange"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {/* Min handle */}
        <input
          type="range" className="cat-range" min={ABS_MIN} max={ABS_MAX}
          value={minVal}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), maxVal - 5);
            onChange(v, maxVal);
          }}
          style={{ zIndex: minVal > ABS_MAX - 20 ? 5 : 3 }}
        />
        {/* Max handle */}
        <input
          type="range" className="cat-range" min={ABS_MIN} max={ABS_MAX}
          value={maxVal}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), minVal + 5);
            onChange(minVal, v);
          }}
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex justify-between mt-3 text-xs font-mono text-abelec-muted">
        <span>{minVal} €</span>
        <span>{maxVal} €</span>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Collapsible filter section
   ═══════════════════════════════════════════════════════════════════════════ */
function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-abelec-cream-line py-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-[13px] font-semibold text-abelec-navy-ink tracking-wide">{title}</span>
        <ChevronDown
          size={15}
          className="text-abelec-muted shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? 600 : 0,
          overflow: "hidden",
          transition: "max-height 0.28s ease",
        }}
      >
        <div className="pt-3">{children}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Sidebar panel (also used inside mobile drawer)
   ═══════════════════════════════════════════════════════════════════════════ */
interface SidebarProps {
  selectedCategories: Set<string>;
  selectedBrands: Set<string>;
  priceRange: [number, number];
  inStockOnly: boolean;
  minRating: number;
  onToggleCategory: (c: string) => void;
  onToggleBrand: (b: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onStockToggle: () => void;
  onRatingChange: (r: number) => void;
  onReset: () => void;
}

function SidebarPanel(props: SidebarProps) {
  const {
    selectedCategories, selectedBrands, priceRange, inStockOnly, minRating,
    onToggleCategory, onToggleBrand, onPriceChange, onStockToggle, onRatingChange, onReset,
  } = props;
  const [showAllBrands, setShowAllBrands] = useState(false);
  const visibleBrands = showAllBrands ? ALL_BRANDS : ALL_BRANDS.slice(0, 6);

  const activeCount = selectedCategories.size + selectedBrands.size +
    (priceRange[0] > 0 || priceRange[1] < 200 ? 1 : 0) +
    (inStockOnly ? 1 : 0) + (minRating > 0 ? 1 : 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-1 pb-3 border-b border-abelec-cream-line">
        <span className="text-[15px] font-semibold text-abelec-navy-ink">Filtrer</span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] font-mono font-medium text-abelec-orange hover:text-abelec-orange-dark transition-colors tracking-wide"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Type d'appareil */}
      <FilterSection title="Type d'appareil">
        <div className="flex flex-col gap-2.5">
          {CATEGORY_OPTIONS.map(([value, label]) => (
            <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.has(value)}
                onChange={() => onToggleCategory(value)}
                className="sr-only"
              />
              <span
                className={cn(
                  "w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors",
                  selectedCategories.has(value)
                    ? "bg-abelec-orange border-abelec-orange"
                    : "border-abelec-cream-line bg-white group-hover:border-abelec-orange/40"
                )}
              >
                {selectedCategories.has(value) && (
                  <Check size={10} className="text-white" strokeWidth={3} />
                )}
              </span>
              <span className="text-[13px] text-abelec-muted group-hover:text-abelec-navy-ink transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Marque */}
      <FilterSection title="Marque">
        <div className="flex flex-col gap-2.5">
          {visibleBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.has(brand)}
                onChange={() => onToggleBrand(brand)}
                className="sr-only"
              />
              <span
                className={cn(
                  "w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors",
                  selectedBrands.has(brand)
                    ? "bg-abelec-orange border-abelec-orange"
                    : "border-abelec-cream-line bg-white group-hover:border-abelec-orange/40"
                )}
              >
                {selectedBrands.has(brand) && (
                  <Check size={10} className="text-white" strokeWidth={3} />
                )}
              </span>
              <span className="text-[13px] text-abelec-muted group-hover:text-abelec-navy-ink transition-colors">{brand}</span>
            </label>
          ))}
        </div>
        {!showAllBrands && (
          <button
            type="button"
            onClick={() => setShowAllBrands(true)}
            className="mt-2.5 text-[12px] font-medium text-abelec-orange hover:text-abelec-orange-dark transition-colors"
          >
            + voir plus
          </button>
        )}
      </FilterSection>

      {/* Prix */}
      <FilterSection title="Prix">
        <PriceRangeSlider
          minVal={priceRange[0]}
          maxVal={priceRange[1]}
          onChange={onPriceChange}
        />
      </FilterSection>

      {/* Disponibilité */}
      <FilterSection title="Disponibilité">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-[13px] text-abelec-muted">En stock uniquement</span>
          <button
            type="button"
            onClick={onStockToggle}
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0",
              inStockOnly ? "bg-abelec-orange" : "bg-[rgba(26,58,92,0.12)]"
            )}
            role="switch"
            aria-checked={inStockOnly}
          >
            <span
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200"
              style={{ transform: inStockOnly ? "translateX(22px)" : "translateX(2px)" }}
            />
          </button>
        </label>
      </FilterSection>

      {/* Note client */}
      <FilterSection title="Note client" defaultOpen={false}>
        <div className="flex flex-col gap-2">
          {[4, 3, 2].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onRatingChange(minRating === n ? 0 : n)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-colors",
                minRating === n
                  ? "border-abelec-orange bg-abelec-orange/5"
                  : "border-abelec-cream-line hover:border-abelec-orange/40"
              )}
            >
              <span className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className={s <= n ? "text-amber-400 fill-amber-400" : "text-[rgba(26,58,92,0.15)] fill-[rgba(26,58,92,0.15)]"}
                  />
                ))}
              </span>
              <span className="text-[12px] text-abelec-muted">et plus</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Product card
   ═══════════════════════════════════════════════════════════════════════════ */
function CatalogProductCard({ product, listMode }: { product: Product; listMode: boolean }) {
  const [added, setAdded] = useState(false);
  const [pulse, setPulse] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (added) return;
    setPulse(true);
    setTimeout(() => {
      setPulse(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    }, 300);
  }

  if (listMode) {
    return (
      <Link href={`/produit/${product.slug}`} className="block group">
        <div className="flex gap-5 bg-white rounded-xl border border-[rgba(26,58,92,0.07)] hover:border-abelec-orange/30 hover:shadow-card-md transition-all duration-200 overflow-hidden p-4">
          {/* Image */}
          <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-abelec-cream-light">
            <Image
              src={product.img}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
              sizes="96px"
            />
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] text-abelec-muted mb-0.5">{product.ref}</p>
                <h3 className="text-[14px] font-semibold text-abelec-navy-ink leading-snug">{product.name}</h3>
                <p className="text-[12px] text-abelec-muted mt-0.5">Compatible : {product.brands.slice(0, 4).join(", ")}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={10} className={s <= Math.round(product.rating) ? "text-amber-400 fill-amber-400" : "text-[rgba(26,58,92,0.15)] fill-[rgba(26,58,92,0.15)]"} />
                  ))}
                  <span className="text-[11px] text-abelec-muted ml-1">({product.reviews})</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                {product.oldPrice && (
                  <p className="text-[11px] text-abelec-muted line-through">{product.oldPrice.toFixed(2)} €</p>
                )}
                <p className="text-[18px] font-bold text-abelec-navy-ink">{product.price.toFixed(2)} €</p>
                <span className={cn(
                  "inline-block mt-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full",
                  product.stock === "in"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                )}>
                  {product.stock === "in" ? "En stock" : "Sur commande"}
                </span>
              </div>
            </div>
          </div>
          {/* Cart button */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleAdd}
              className={cn(
                "relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                added
                  ? "bg-emerald-500 text-white"
                  : "bg-abelec-orange/10 text-abelec-orange hover:bg-abelec-orange hover:text-white",
                pulse && "scale-110"
              )}
              aria-label="Ajouter au panier"
            >
              {added ? <Check size={16} strokeWidth={2.5} /> : <ShoppingCart size={16} />}
              {pulse && (
                <span className="absolute inset-0 rounded-lg bg-abelec-orange animate-ping opacity-40" />
              )}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/produit/${product.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-[rgba(26,58,92,0.07)] hover:border-abelec-orange/30 hover:shadow-card-md transition-all duration-200 overflow-hidden flex flex-col">
        {/* Image */}
        <div className="relative w-full overflow-hidden bg-abelec-cream-light" style={{ height: 180 }}>
          <Image
            src={product.img}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
            sizes="(max-width: 768px) 50vw, 280px"
          />
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            {product.oldPrice && (
              <span className="bg-abelec-orange text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Promo
              </span>
            )}
            <span className={cn(
              "text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide",
              product.stock === "in"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            )}>
              {product.stock === "in" ? "En stock" : "Commande"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4">
          {/* Ref */}
          <p className="font-mono text-[9px] text-abelec-muted-2 tracking-wide mb-1">
            Réf. {product.ref.slice(0, 14)}
          </p>

          {/* Name */}
          <h3 className="text-[13.5px] font-semibold text-abelec-navy-ink leading-snug mb-1 flex-1">
            {product.name}
          </h3>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-1.5">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={11} className={s <= Math.round(product.rating) ? "text-amber-400 fill-amber-400" : "text-[rgba(26,58,92,0.12)] fill-[rgba(26,58,92,0.12)]"} />
            ))}
            <span className="text-[11px] text-abelec-muted ml-0.5">({product.reviews})</span>
          </div>

          {/* Compat */}
          <p className="text-[11.5px] text-abelec-muted leading-snug mb-3 line-clamp-1">
            {product.brands.slice(0, 4).join(", ")}
          </p>

          {/* Price row */}
          <div className="flex items-end justify-between mt-auto pt-3 border-t border-abelec-cream-line">
            <div>
              {product.oldPrice && (
                <p className="text-[11px] text-abelec-muted line-through leading-none">{product.oldPrice.toFixed(2)} €</p>
              )}
              <p className="text-[17px] font-bold text-abelec-navy-ink leading-tight">
                {product.price.toFixed(2)} <span className="text-[13px] font-medium">€</span>
              </p>
            </div>
            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAdd}
              className={cn(
                "relative flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-lg transition-all duration-200",
                added
                  ? "bg-emerald-500 text-white"
                  : "bg-abelec-orange text-white hover:bg-abelec-orange-dark",
                pulse && "scale-105"
              )}
              aria-label="Ajouter au panier"
            >
              {added ? <Check size={13} strokeWidth={2.5} /> : <ShoppingCart size={13} />}
              {added ? "Ajouté" : "Panier"}
              {pulse && (
                <span className="absolute inset-0 rounded-lg bg-abelec-orange animate-ping opacity-50" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Category / search banner
   ═══════════════════════════════════════════════════════════════════════════ */
function ResultsBanner({ category, query, count }: { category?: string; query?: string; count: number }) {
  if (!category && !query) return null;

  const catLabel = category ? CATEGORY_LABELS[category as Category] : null;

  return (
    <div className="bg-abelec-cream-light border-b border-abelec-cream-line">
      <div className="max-w-[1340px] mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] font-mono text-abelec-muted mb-3">
          <Link href="/" className="hover:text-abelec-orange transition-colors">Accueil</Link>
          <ChevronRight size={11} className="opacity-50" />
          <Link href="/catalogue" className="hover:text-abelec-orange transition-colors">Catalogue</Link>
          {catLabel && (
            <>
              <ChevronRight size={11} className="opacity-50" />
              <span className="text-abelec-navy-ink font-semibold">{catLabel}</span>
            </>
          )}
        </nav>

        {catLabel ? (
          <div className="flex items-end gap-4">
            <div className="w-1 h-10 bg-abelec-orange rounded-full shrink-0" />
            <div>
              <h1 className="font-slab text-[28px] font-bold text-abelec-navy-ink leading-none">
                {catLabel}
              </h1>
              <p className="text-[13px] text-abelec-muted mt-1">{count} références disponibles</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-[13px] text-abelec-muted mb-1">Résultats pour :</p>
            <h1 className="font-slab text-[24px] font-bold text-abelec-navy-ink">
              <span className="text-abelec-orange">&ldquo;{query}&rdquo;</span>
            </h1>
            <p className="text-[13px] text-abelec-muted mt-1">{count} résultats trouvés</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Active filter pills
   ═══════════════════════════════════════════════════════════════════════════ */
function ActivePills({
  selectedCategories, selectedBrands, priceRange, inStockOnly, minRating,
  onRemoveCategory, onRemoveBrand, onResetPrice, onResetStock, onResetRating,
}: {
  selectedCategories: Set<string>; selectedBrands: Set<string>;
  priceRange: [number, number]; inStockOnly: boolean; minRating: number;
  onRemoveCategory: (c: string) => void; onRemoveBrand: (b: string) => void;
  onResetPrice: () => void; onResetStock: () => void; onResetRating: () => void;
}) {
  const pills: { label: string; onRemove: () => void }[] = [
    ...Array.from(selectedCategories).map((c) => ({
      label: CATEGORY_LABELS[c as Category] ?? c,
      onRemove: () => onRemoveCategory(c),
    })),
    ...Array.from(selectedBrands).map((b) => ({
      label: b,
      onRemove: () => onRemoveBrand(b),
    })),
    ...(priceRange[0] > 0 || priceRange[1] < 200
      ? [{ label: `${priceRange[0]}€ – ${priceRange[1]}€`, onRemove: onResetPrice }]
      : []),
    ...(inStockOnly ? [{ label: "En stock", onRemove: onResetStock }] : []),
    ...(minRating > 0 ? [{ label: `${minRating}★ et plus`, onRemove: onResetRating }] : []),
  ];

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      <AnimatePresence>
        {pills.map(({ label, onRemove }) => (
          <motion.button
            key={label}
            type="button"
            onClick={onRemove}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-abelec-orange/10 border border-abelec-orange/25 text-abelec-orange rounded-full text-[11px] font-semibold hover:bg-abelec-orange/20 transition-colors"
          >
            {label}
            <X size={11} strokeWidth={2.5} />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Pagination
   ═══════════════════════════════════════════════════════════════════════════ */
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const MAX_VISIBLE = 5;

  // Build page list with potential ellipsis
  function buildPages(): (number | "...")[] {
    if (total <= MAX_VISIBLE + 2) return pages;
    const result: (number | "...")[] = [1];
    if (current > 3) result.push("...");
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) result.push(p);
    if (current < total - 2) result.push("...");
    result.push(total);
    return result;
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-abelec-cream-line text-abelec-muted hover:border-abelec-orange hover:text-abelec-orange disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
        aria-label="Page précédente"
      >
        <ChevronLeft size={16} />
      </button>

      {buildPages().map((page, i) =>
        page === "..." ? (
          <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-abelec-muted text-[13px]">…</span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onChange(page)}
            className={cn(
              "w-9 h-9 flex items-center justify-center rounded-lg text-[13px] font-medium border transition-colors",
              current === page
                ? "bg-abelec-orange text-white border-abelec-orange"
                : "border-abelec-cream-line text-abelec-muted hover:border-abelec-orange hover:text-abelec-orange"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-abelec-cream-line text-abelec-muted hover:border-abelec-orange hover:text-abelec-orange disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
        aria-label="Page suivante"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main page component
   ═══════════════════════════════════════════════════════════════════════════ */
interface ClientProps {
  initialCategory?: string;
  searchQuery?: string;
}

export default function CatalogueClient({ initialCategory, searchQuery }: ClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => initialCategory ? new Set([initialCategory]) : new Set()
  );
  const [selectedBrands, setSelectedBrands]   = useState<Set<string>>(new Set());
  const [priceRange, setPriceRange]            = useState<[number, number]>([0, 200]);
  const [inStockOnly, setInStockOnly]          = useState(false);
  const [minRating, setMinRating]              = useState(0);
  const [sortBy, setSortBy]                    = useState<SortKey>("pertinence");
  const [viewMode, setViewMode]                = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage]          = useState(1);
  const [drawerOpen, setDrawerOpen]            = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Reset to page 1 when filters change
  const resetPage = () => setCurrentPage(1);

  /* Filter helpers */
  function toggleCategory(c: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(c)) { next.delete(c); } else { next.add(c); }
      return next;
    });
    resetPage();
  }
  function toggleBrand(b: string) {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(b)) { next.delete(b); } else { next.add(b); }
      return next;
    });
    resetPage();
  }
  function resetAll() {
    setSelectedCategories(new Set());
    setSelectedBrands(new Set());
    setPriceRange([0, 200]);
    setInStockOnly(false);
    setMinRating(0);
    resetPage();
  }

  /* Filtered + sorted products */
  const filtered = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      if (selectedCategories.size && !selectedCategories.has(p.category)) return false;
      if (selectedBrands.size && !p.brands.some((b) => selectedBrands.has(b))) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (inStockOnly && p.stock !== "in") return false;
      if (p.rating < minRating) return false;
      return true;
    });

    switch (sortBy) {
      case "prix-asc":   result = [...result].sort((a, b) => a.price - b.price); break;
      case "prix-desc":  result = [...result].sort((a, b) => b.price - a.price); break;
      case "ventes":     result = [...result].sort((a, b) => b.reviews - a.reviews); break;
      case "nouveautes": result = [...result].sort((a, b) => b.id - a.id); break;
    }
    return result;
  }, [selectedCategories, selectedBrands, priceRange, inStockOnly, minRating, sortBy]);

  const totalPages   = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage     = Math.min(currentPage, totalPages);
  const paginated    = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  /* Grid animation key — changes when filters change, triggers stagger re-entrance */
  const gridKey = useMemo(() =>
    `${Array.from(selectedCategories).sort()}-${Array.from(selectedBrands).sort()}-${priceRange}-${inStockOnly}-${minRating}-${safePage}-${sortBy}`,
    [selectedCategories, selectedBrands, priceRange, inStockOnly, minRating, safePage, sortBy]
  );

  const sidebarProps = {
    selectedCategories, selectedBrands, priceRange, inStockOnly, minRating,
    onToggleCategory: toggleCategory,
    onToggleBrand: toggleBrand,
    onPriceChange: (min: number, max: number) => { setPriceRange([min, max]); resetPage(); },
    onStockToggle: () => { setInStockOnly((v) => !v); resetPage(); },
    onRatingChange: (r: number) => { setMinRating(r); resetPage(); },
    onReset: resetAll,
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Full-width category / search banner */}
      <ResultsBanner category={initialCategory} query={searchQuery} count={filtered.length} />

      <div className="max-w-[1340px] mx-auto px-4 md:px-6 py-8">
        <div className="flex gap-8 items-start">

          {/* ── Desktop sidebar ── */}
          <aside className="hidden md:block w-[260px] shrink-0 sticky top-[90px]">
            <SidebarPanel {...sidebarProps} />
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Top bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-abelec-cream-line">
              {/* Breadcrumb + count */}
              <div className="flex flex-col gap-0.5">
                {!initialCategory && !searchQuery && (
                  <nav className="flex items-center gap-1.5 text-[11px] font-mono text-abelec-muted">
                    <Link href="/" className="hover:text-abelec-orange transition-colors">Accueil</Link>
                    <ChevronRight size={10} className="opacity-50" />
                    <span className="text-abelec-navy-ink">Catalogue</span>
                  </nav>
                )}
                <p className="text-[13px] font-semibold text-abelec-navy-ink">
                  {filtered.length} <span className="font-normal text-abelec-muted">résultat{filtered.length !== 1 ? "s" : ""}</span>
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value as SortKey); resetPage(); }}
                  className="text-[12px] border border-abelec-cream-line rounded-lg px-3 py-2 text-abelec-navy-ink bg-white focus:outline-none focus:border-abelec-orange cursor-pointer"
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>

                {/* View toggle */}
                <div className="flex border border-abelec-cream-line rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-abelec-navy text-white" : "text-abelec-muted hover:text-abelec-navy")}
                    aria-label="Vue grille"
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={cn("p-2 transition-colors", viewMode === "list" ? "bg-abelec-navy text-white" : "text-abelec-muted hover:text-abelec-navy")}
                    aria-label="Vue liste"
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter pills */}
            <ActivePills
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              priceRange={priceRange}
              inStockOnly={inStockOnly}
              minRating={minRating}
              onRemoveCategory={toggleCategory}
              onRemoveBrand={toggleBrand}
              onResetPrice={() => { setPriceRange([0, 200]); resetPage(); }}
              onResetStock={() => { setInStockOnly(false); resetPage(); }}
              onResetRating={() => { setMinRating(0); resetPage(); }}
            />

            {/* Product grid */}
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-[32px] mb-3">🔍</p>
                <p className="text-[16px] font-semibold text-abelec-navy-ink mb-2">Aucun résultat</p>
                <p className="text-[13px] text-abelec-muted mb-5">Essayez de modifier vos filtres.</p>
                <button type="button" onClick={resetAll} className="text-[12px] font-semibold text-abelec-orange border border-abelec-orange/30 px-4 py-2 rounded-lg hover:bg-abelec-orange/5 transition-colors">
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <motion.div
                key={gridKey}
                className={cn(
                  "grid gap-4",
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                )}
              >
                {paginated.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.055, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  >
                    <CatalogProductCard product={product} listMode={viewMode === "list"} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            <Pagination
              current={safePage}
              total={totalPages}
              onChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile filter button (fixed) ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-abelec-navy text-white rounded-full shadow-card-lg text-[13px] font-semibold"
        >
          <SlidersHorizontal size={15} />
          Filtrer
          {(selectedCategories.size + selectedBrands.size + (inStockOnly ? 1 : 0) + (minRating > 0 ? 1 : 0)) > 0 && (
            <span className="bg-abelec-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {selectedCategories.size + selectedBrands.size + (inStockOnly ? 1 : 0) + (minRating > 0 ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* ── Mobile filter drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 w-[300px] bg-white z-50 shadow-card-lg md:hidden overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-abelec-cream-line sticky top-0 bg-white">
                <span className="text-[15px] font-semibold text-abelec-navy-ink">Filtres</span>
                <button type="button" onClick={() => setDrawerOpen(false)} className="p-1.5 text-abelec-muted hover:text-abelec-navy-ink" aria-label="Fermer">
                  <X size={18} />
                </button>
              </div>
              <div className="px-5 pb-24">
                <SidebarPanel {...sidebarProps} />
              </div>
              {/* Drawer footer */}
              <div className="fixed bottom-0 left-0 w-[300px] bg-white border-t border-abelec-cream-line px-5 py-4">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full bg-abelec-orange text-white text-[13px] font-semibold py-3 rounded-xl"
                >
                  Voir {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
