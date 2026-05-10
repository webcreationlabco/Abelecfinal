"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, MapPin, FileText, Heart, Settings, LogOut,
  ChevronRight, Package, Truck, Clock, Check, Download,
  Edit2, Trash2, Plus, Star, Phone, Mail, Lock, Globe,
  Eye, EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RAW_PRODUCTS from "@/data/products";

/* ═══════════════════════════════════════════════════════════════════════════
   Types & mock data
   ═══════════════════════════════════════════════════════════════════════════ */
type Tab = "commandes" | "adresses" | "factures" | "favoris" | "parametres";

type OrderStatus = "livre" | "en-cours" | "en-attente";

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: number;
  total: number;
}

interface Address {
  id: number;
  label: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  postal: string;
  country: string;
  isDefault: boolean;
}

interface Invoice {
  id: string;
  date: string;
  orderId: string;
  amount: number;
}

const MOCK_USER = {
  prenom: "Thomas",
  nom: "Dubois",
  email: "thomas.dubois@gmail.com",
  tel: "+32 476 12 34 56",
};

const MOCK_ORDERS: Order[] = [
  { id: "ABL-2024-0892", date: "12 avr. 2025", status: "livre",     items: 3, total: 84.70 },
  { id: "ABL-2025-0341", date: "02 mai 2025",  status: "en-cours",  items: 1, total: 38.50 },
  { id: "ABL-2025-0418", date: "08 mai 2025",  status: "en-attente",items: 2, total: 61.80 },
  { id: "ABL-2024-0701", date: "19 jan. 2025", status: "livre",     items: 4, total: 123.40 },
];

const MOCK_ADDRESSES: Address[] = [
  {
    id: 1, label: "Domicile", isDefault: true,
    name: "Thomas Dubois",
    line1: "Rue de la Loi 42", city: "Bruxelles", postal: "1000", country: "Belgique",
  },
  {
    id: 2, label: "Bureau", isDefault: false,
    name: "Thomas Dubois",
    line1: "Avenue Louise 123", line2: "Bte 7",
    city: "Bruxelles", postal: "1050", country: "Belgique",
  },
];

const MOCK_INVOICES: Invoice[] = [
  { id: "FAC-2025-0341", date: "02 mai 2025",  orderId: "ABL-2025-0341", amount: 38.50 },
  { id: "FAC-2025-0418", date: "08 mai 2025",  orderId: "ABL-2025-0418", amount: 61.80 },
  { id: "FAC-2024-0892", date: "12 avr. 2025", orderId: "ABL-2024-0892", amount: 84.70 },
  { id: "FAC-2024-0701", date: "19 jan. 2025", orderId: "ABL-2024-0701", amount: 123.40 },
];

const MOCK_FAVORITES = RAW_PRODUCTS.slice(0, 3);

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  "livre":     { label: "Livré",     color: "#15803d", bg: "#dcfce7", Icon: Check },
  "en-cours":  { label: "En cours",  color: "#d97e3a", bg: "#fff7ed", Icon: Truck },
  "en-attente":{ label: "En attente",color: "#64748b", bg: "#f1f5f9", Icon: Clock },
};

const NAV_ITEMS: { key: Tab; label: string; Icon: React.ElementType }[] = [
  { key: "commandes",  label: "Mes commandes",        Icon: ShoppingBag },
  { key: "adresses",   label: "Mes adresses",          Icon: MapPin },
  { key: "factures",   label: "Mes factures",          Icon: FileText },
  { key: "favoris",    label: "Mes pièces favorites",  Icon: Heart },
  { key: "parametres", label: "Paramètres du compte",  Icon: Settings },
];

/* ═══════════════════════════════════════════════════════════════════════════
   Reusable atoms
   ═══════════════════════════════════════════════════════════════════════════ */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-5 w-[3px] rounded-full bg-abelec-orange" />
      <h2 className="font-slab text-[20px] font-bold text-abelec-navy-ink">{children}</h2>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white rounded-2xl border border-[rgba(26,58,92,0.07)] p-5 sm:p-6", className)}>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[rgba(26,58,92,0.07)] p-5 flex flex-col gap-1">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted">{label}</p>
      <p className="font-slab text-[26px] font-bold text-abelec-navy-ink leading-none">{value}</p>
      {sub && <p className="text-[12px] text-abelec-muted mt-0.5">{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Tab: Commandes
   ═══════════════════════════════════════════════════════════════════════════ */
function TabCommandes() {
  const total = MOCK_ORDERS.reduce((s, o) => s + o.total, 0);
  const enCours = MOCK_ORDERS.filter((o) => o.status === "en-cours").length;

  return (
    <div>
      <SectionTitle>Mes commandes</SectionTitle>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Total commandes" value={String(MOCK_ORDERS.length)} />
        <StatCard label="En cours" value={String(enCours)} sub={enCours === 1 ? "livraison en cours" : "livraisons en cours"} />
        <StatCard label="Montant total" value={`${total.toFixed(2)} €`} sub="toutes commandes" />
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-3">
        {MOCK_ORDERS.map((order) => {
          const s = STATUS_CONFIG[order.status];
          const SIcon = s.Icon;
          return (
            <Card key={order.id} className="p-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <span className="font-mono text-[13px] font-semibold text-abelec-navy-ink">#{order.id}</span>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold"
                      style={{ color: s.color, background: s.bg }}
                    >
                      <SIcon size={11} strokeWidth={2.5} />
                      {s.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[12.5px] text-abelec-muted">
                    <span>{order.date}</span>
                    <span>{order.items} article{order.items > 1 ? "s" : ""}</span>
                    <span className="font-semibold text-abelec-navy">{order.total.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button className="h-9 px-3.5 rounded-xl border border-[rgba(26,58,92,0.12)] text-[12.5px] font-semibold text-abelec-navy hover:border-abelec-orange hover:text-abelec-orange transition-colors">
                    Voir le détail
                  </button>
                  {order.status !== "livre" && (
                    <button className="h-9 px-3.5 rounded-xl bg-abelec-orange hover:bg-abelec-orange-dark text-white text-[12.5px] font-semibold transition-colors flex items-center gap-1.5">
                      <Truck size={13} strokeWidth={2} /> Suivre
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Tab: Adresses
   ═══════════════════════════════════════════════════════════════════════════ */
function TabAdresses() {
  return (
    <div>
      <SectionTitle>Mes adresses</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-4">
        {MOCK_ADDRESSES.map((addr) => (
          <Card key={addr.id} className="relative">
            {addr.isDefault && (
              <span className="absolute top-4 right-4 text-[10.5px] font-mono font-semibold text-abelec-orange bg-abelec-orange/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Par défaut
              </span>
            )}
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted mb-2">{addr.label}</p>
            <p className="font-semibold text-[14px] text-abelec-navy-ink mb-1">{addr.name}</p>
            <p className="text-[13.5px] text-abelec-muted leading-relaxed">
              {addr.line1}<br />
              {addr.line2 && <>{addr.line2}<br /></>}
              {addr.postal} {addr.city}<br />
              {addr.country}
            </p>
            <div className="flex gap-2 mt-4 pt-4 border-t border-[rgba(26,58,92,0.06)]">
              <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[rgba(26,58,92,0.12)] text-[12px] font-medium text-abelec-navy hover:border-abelec-orange hover:text-abelec-orange transition-colors">
                <Edit2 size={12} strokeWidth={2} /> Modifier
              </button>
              {!addr.isDefault && (
                <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-red-100 text-[12px] font-medium text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 size={12} strokeWidth={2} /> Supprimer
                </button>
              )}
            </div>
          </Card>
        ))}

        {/* Add new */}
        <button className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[rgba(26,58,92,0.15)] bg-transparent hover:border-abelec-orange hover:bg-abelec-orange/[0.03] transition-colors p-8 min-h-[160px] group">
          <div className="w-10 h-10 rounded-full bg-abelec-cream-light group-hover:bg-abelec-orange/10 flex items-center justify-center transition-colors">
            <Plus size={18} className="text-abelec-muted group-hover:text-abelec-orange transition-colors" strokeWidth={2} />
          </div>
          <span className="text-[13.5px] font-semibold text-abelec-muted group-hover:text-abelec-orange transition-colors">
            Ajouter une adresse
          </span>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Tab: Factures
   ═══════════════════════════════════════════════════════════════════════════ */
function TabFactures() {
  return (
    <div>
      <SectionTitle>Mes factures</SectionTitle>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(26,58,92,0.07)]">
                {["Date", "N° Facture", "Commande liée", "Montant", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map((inv, i) => (
                <tr
                  key={inv.id}
                  className={cn("border-b border-[rgba(26,58,92,0.05)] hover:bg-[rgba(26,58,92,0.02)] transition-colors",
                    i === MOCK_INVOICES.length - 1 && "border-0")}
                >
                  <td className="px-5 py-4 text-[13px] text-abelec-muted">{inv.date}</td>
                  <td className="px-5 py-4 font-mono text-[12.5px] font-semibold text-abelec-navy-ink">{inv.id}</td>
                  <td className="px-5 py-4 font-mono text-[12px] text-abelec-muted">#{inv.orderId}</td>
                  <td className="px-5 py-4 text-[13.5px] font-semibold text-abelec-navy-ink">{inv.amount.toFixed(2)} €</td>
                  <td className="px-5 py-4">
                    <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-abelec-cream-light hover:bg-abelec-orange/10 hover:text-abelec-orange text-[12px] font-medium text-abelec-navy transition-colors">
                      <Download size={12} strokeWidth={2} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Tab: Favoris
   ═══════════════════════════════════════════════════════════════════════════ */
function TabFavoris() {
  const [removed, setRemoved] = useState<number[]>([]);
  const visible = MOCK_FAVORITES.filter((p) => !removed.includes(p.id));

  return (
    <div>
      <SectionTitle>Mes pièces favorites</SectionTitle>
      {visible.length === 0 ? (
        <Card className="text-center py-14">
          <Heart size={36} className="mx-auto text-abelec-muted/40 mb-3" strokeWidth={1.5} />
          <p className="text-[14px] text-abelec-muted mb-4">Aucune pièce sauvegardée.</p>
          <Link href="/catalogue"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-abelec-orange text-white text-[13.5px] font-semibold hover:bg-abelec-orange-dark transition-colors">
            Parcourir le catalogue <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {visible.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.22 }}
              >
                <Link href={`/produit/${p.slug}`} className="block group">
                  <div className="bg-white rounded-2xl border border-[rgba(26,58,92,0.07)] hover:border-abelec-orange/30 hover:shadow-card-md transition-all duration-200 overflow-hidden flex flex-col">
                    {/* Image */}
                    <div className="relative h-[160px] bg-[#F8F5F0] overflow-hidden">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                        sizes="280px"
                      />
                      {/* Heart badge */}
                      <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center">
                        <Heart size={13} className="text-abelec-orange fill-abelec-orange" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="font-mono text-[10px] text-abelec-muted mb-0.5">{p.ref}</p>
                      <h3 className="text-[13.5px] font-semibold text-abelec-navy-ink leading-snug mb-1 line-clamp-2">{p.name}</h3>
                      <div className="flex items-center gap-0.5 mb-3">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={11} strokeWidth={1.5}
                            className={s <= Math.round(p.rating) ? "fill-amber-400 text-amber-400" : "text-abelec-muted/30"} />
                        ))}
                        <span className="text-[11px] text-abelec-muted ml-1">({p.reviewCount})</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-bold text-[16px] text-abelec-navy-ink">{p.price.toFixed(2)} €</span>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setRemoved((r) => [...r, p.id]); }}
                          className="flex items-center gap-1 h-7 px-2.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 text-[11.5px] font-medium transition-colors"
                        >
                          <Trash2 size={11} strokeWidth={2} /> Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Tab: Paramètres
   ═══════════════════════════════════════════════════════════════════════════ */
function TabParametres() {
  const [form, setForm] = useState({ prenom: MOCK_USER.prenom, nom: MOCK_USER.nom, email: MOCK_USER.email, tel: MOCK_USER.tel });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [lang, setLang] = useState<"FR" | "NL">("FR");
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div>
      <SectionTitle>Paramètres du compte</SectionTitle>
      <form onSubmit={handleSave} className="flex flex-col gap-5">

        {/* Informations personnelles */}
        <Card>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted mb-4">Informations personnelles</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Prénom", key: "prenom" as const, icon: <Package size={14} className="text-abelec-muted" /> },
              { label: "Nom",    key: "nom"    as const, icon: <Package size={14} className="text-abelec-muted" /> },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted block mb-1.5">{label}</label>
                <input
                  type="text" value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full h-10 px-3.5 rounded-xl border border-[rgba(26,58,92,0.12)] bg-abelec-cream-light text-[13.5px] text-abelec-navy-ink outline-none focus:border-abelec-orange transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-abelec-muted pointer-events-none" />
                <input type="email" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-[rgba(26,58,92,0.12)] bg-abelec-cream-light text-[13.5px] text-abelec-navy-ink outline-none focus:border-abelec-orange transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted block mb-1.5">Téléphone</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-abelec-muted pointer-events-none" />
                <input type="tel" value={form.tel}
                  onChange={(e) => setForm((f) => ({ ...f, tel: e.target.value }))}
                  className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-[rgba(26,58,92,0.12)] bg-abelec-cream-light text-[13.5px] text-abelec-navy-ink outline-none focus:border-abelec-orange transition-colors"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Mot de passe */}
        <Card>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted mb-4">Changer le mot de passe</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Mot de passe actuel", key: "current" as const },
              { label: "Nouveau mot de passe", key: "next" as const },
              { label: "Confirmer", key: "confirm" as const },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted block mb-1.5">{label}</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-abelec-muted pointer-events-none" />
                  <input
                    type={showPw ? "text" : "password"} value={pw[key]}
                    onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full h-10 pl-9 pr-9 rounded-xl border border-[rgba(26,58,92,0.12)] bg-abelec-cream-light text-[13.5px] text-abelec-navy-ink outline-none focus:border-abelec-orange transition-colors"
                  />
                  {key === "current" && (
                    <button type="button" onClick={() => setShowPw((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-abelec-muted hover:text-abelec-navy transition-colors">
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Langue */}
        <Card>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-abelec-muted mb-4">Langue préférée</p>
          <div className="flex items-center gap-3">
            <Globe size={16} className="text-abelec-muted" />
            <div className="flex rounded-xl border border-[rgba(26,58,92,0.12)] overflow-hidden">
              {(["FR", "NL"] as const).map((l) => (
                <button key={l} type="button" onClick={() => setLang(l)}
                  className={cn("h-9 w-16 text-[13px] font-semibold transition-colors",
                    lang === l ? "bg-abelec-orange text-white" : "bg-white text-abelec-muted hover:text-abelec-navy")}>
                  {l}
                </button>
              ))}
            </div>
            <span className="text-[13px] text-abelec-muted">{lang === "FR" ? "Français" : "Nederlands"}</span>
          </div>
        </Card>

        {/* Save */}
        <div className="flex items-center gap-4">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(217,126,58,0.28)" }}
            whileTap={{ scale: 0.99 }}
            className="h-11 px-7 rounded-2xl bg-abelec-orange hover:bg-abelec-orange-dark text-white font-bold text-[14px] shadow-[inset_0_-3px_0_rgba(0,0,0,.12)] transition-colors"
          >
            Enregistrer les modifications
          </motion.button>
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-[13px] text-green-600 font-medium"
              >
                <Check size={14} strokeWidth={2.5} /> Sauvegardé
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Main dashboard
   ═══════════════════════════════════════════════════════════════════════════ */
const TAB_COMPONENTS: Record<Tab, React.ComponentType> = {
  commandes:  TabCommandes,
  adresses:   TabAdresses,
  factures:   TabFactures,
  favoris:    TabFavoris,
  parametres: TabParametres,
};

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<Tab>("commandes");
  const ActivePanel = TAB_COMPONENTS[activeTab];

  const initials = `${MOCK_USER.prenom[0]}${MOCK_USER.nom[0]}`;

  return (
    <main className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* ── Mobile: top tab bar ──────────────────────────── */}
        <div className="flex md:hidden gap-1 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {NAV_ITEMS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-[12.5px] font-semibold transition-colors whitespace-nowrap",
                activeTab === key
                  ? "bg-abelec-orange text-white"
                  : "bg-white text-abelec-muted border border-[rgba(26,58,92,0.08)] hover:text-abelec-navy"
              )}
            >
              <Icon size={13} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-6 items-start">

          {/* ── Desktop sidebar ──────────────────────────────── */}
          <aside className="hidden md:flex flex-col w-[240px] flex-shrink-0 gap-3">
            {/* Avatar card */}
            <div className="bg-white rounded-2xl border border-[rgba(26,58,92,0.07)] p-5 flex flex-col items-center text-center gap-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-[22px] font-bold text-white select-none"
                style={{ background: "#1a3a5c", letterSpacing: "0.05em" }}
              >
                {initials}
              </div>
              <div>
                <p className="font-slab font-bold text-[15px] text-abelec-navy-ink leading-tight">
                  {MOCK_USER.prenom} {MOCK_USER.nom}
                </p>
                <p className="font-mono text-[11px] text-abelec-muted mt-0.5 break-all">{MOCK_USER.email}</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="bg-white rounded-2xl border border-[rgba(26,58,92,0.07)] overflow-hidden flex flex-col">
              {NAV_ITEMS.map(({ key, label, Icon }, i) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 text-[13.5px] font-medium transition-colors relative text-left",
                    i < NAV_ITEMS.length - 1 && "border-b border-[rgba(26,58,92,0.05)]",
                    activeTab === key
                      ? "text-abelec-orange bg-abelec-orange/[0.05]"
                      : "text-abelec-navy hover:bg-[rgba(26,58,92,0.03)]"
                  )}
                >
                  {activeTab === key && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-abelec-orange" />
                  )}
                  <Icon size={15} strokeWidth={1.8} />
                  {label}
                  {activeTab === key && <ChevronRight size={13} className="ml-auto" strokeWidth={2} />}
                </button>
              ))}

              <div className="border-t border-[rgba(26,58,92,0.06)]">
                <button className="w-full flex items-center gap-3 px-4 py-3.5 text-[13.5px] font-medium text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={15} strokeWidth={1.8} />
                  Déconnexion
                </button>
              </div>
            </nav>
          </aside>

          {/* ── Content area ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              >
                <ActivePanel />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: logout */}
        <div className="flex md:hidden justify-center mt-8">
          <button className="flex items-center gap-2 text-[13px] font-medium text-red-400 hover:text-red-500 transition-colors">
            <LogOut size={14} strokeWidth={2} /> Déconnexion
          </button>
        </div>
      </div>
    </main>
  );
}
