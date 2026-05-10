"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ShieldCheck, Star } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

interface InputProps {
  label:         string;
  type:          string;
  placeholder:   string;
  value:         string;
  onChange:      (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon:          React.ElementType;
  autoComplete?: string;
}

function InputField({ label, type, placeholder, value, onChange, icon: Icon, autoComplete }: InputProps) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  const inputType  = isPassword && showPw ? "text" : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[11px] uppercase tracking-[0.1em] text-abelec-muted-2">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon size={15} strokeWidth={1.8} className="text-abelec-muted-2" />
        </div>
        <input
          type={inputType} required value={value} onChange={onChange}
          placeholder={placeholder} autoComplete={autoComplete}
          className="w-full h-11 pl-10 pr-11 rounded-xl bg-abelec-cream-light border border-abelec-cream-line text-[14px] text-abelec-navy-ink placeholder:text-abelec-muted-2 outline-none focus:border-abelec-orange transition-colors"
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-abelec-muted-2 hover:text-abelec-navy transition-colors p-0.5"
            aria-label={showPw ? "Hide password" : "Show password"}>
            {showPw ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
          </button>
        )}
      </div>
    </div>
  );
}

type Tab = "login" | "register";

export default function ComptePage() {
  const t = useT();

  const [tab, setTab] = useState<Tab>("login");
  const [loginForm,    setLoginForm]    = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ prenom: "", nom: "", email: "", password: "", confirm: "" });

  const setL = (k: keyof typeof loginForm)    => (e: React.ChangeEvent<HTMLInputElement>) => setLoginForm((f)    => ({ ...f, [k]: e.target.value }));
  const setR = (k: keyof typeof registerForm) => (e: React.ChangeEvent<HTMLInputElement>) => setRegisterForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <Header />
      <main className="min-h-[85vh] py-14 px-6 flex items-center justify-center"
        style={{ background: "linear-gradient(160deg,#F8F5F0 0%,#EDE7DB 100%)" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="w-full max-w-[440px]"
        >
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <Link href="/">
              <Image src="/logo-abelec.png" alt="Abelec" width={130} height={44} className="h-11 w-auto object-contain" />
            </Link>
            <p className="font-mono text-[11px] text-abelec-muted-2 uppercase tracking-[0.12em]">
              {t("account.tagline")}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-[24px] border border-abelec-cream-line shadow-card-lg overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-abelec-cream-line">
              {(["login", "register"] as const).map((t_) => (
                <button key={t_} type="button" onClick={() => setTab(t_)}
                  className={cn("relative flex-1 py-4 font-slab text-[15px] font-bold transition-colors",
                    tab === t_ ? "text-abelec-navy-ink" : "text-abelec-muted hover:text-abelec-navy")}>
                  {t_ === "login" ? t("account.loginTab") : t("account.registerTab")}
                  {tab === t_ && (
                    <motion.div layoutId="compte-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-abelec-orange"
                      style={{ borderRadius: "3px 3px 0 0" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>

                {/* ── LOGIN ─────────────────────────────────────── */}
                {tab === "login" && (
                  <motion.form key="login" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }} onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                    <InputField label={t("account.emailLabel")} type="email" placeholder={t("account.emailPlaceholder")}
                      value={loginForm.email} onChange={setL("email")} icon={Mail} autoComplete="email" />
                    <InputField label={t("account.passwordLabel")} type="password" placeholder={t("account.passwordPlaceholder")}
                      value={loginForm.password} onChange={setL("password")} icon={Lock} autoComplete="current-password" />
                    <div className="flex justify-end -mt-1">
                      <a href="#" className="text-[12.5px] text-abelec-orange hover:text-abelec-orange-dark hover:underline font-medium transition-colors">
                        {t("account.forgotPassword")}
                      </a>
                    </div>
                    <motion.button type="submit" whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(217,126,58,0.30)" }} whileTap={{ scale: 0.99 }}
                      className="mt-1 h-[52px] w-full rounded-2xl bg-abelec-orange hover:bg-abelec-orange-dark text-white font-bold text-[16px] flex items-center justify-center gap-2.5 transition-colors shadow-[inset_0_-3px_0_rgba(0,0,0,.14)]">
                      {t("account.loginBtn")} <ArrowRight size={16} strokeWidth={2.3} />
                    </motion.button>
                    <div className="flex items-center gap-3 my-1">
                      <div className="flex-1 h-px bg-abelec-cream-line" />
                      <span className="font-mono text-[10.5px] text-abelec-muted-2 uppercase tracking-[0.1em]">ou</span>
                      <div className="flex-1 h-px bg-abelec-cream-line" />
                    </div>
                    <button type="button"
                      className="h-11 w-full rounded-xl border border-abelec-cream-line bg-abelec-cream-light hover:border-abelec-navy/30 text-abelec-navy font-semibold text-[14px] flex items-center justify-center gap-2.5 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      {t("account.googleBtn")}
                    </button>
                  </motion.form>
                )}

                {/* ── REGISTER ──────────────────────────────────── */}
                {tab === "register" && (
                  <motion.form key="register" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }} onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <InputField label={t("account.firstnameLabel")} type="text" placeholder={t("account.firstnamePlaceholder")}
                        value={registerForm.prenom} onChange={setR("prenom")} icon={User} autoComplete="given-name" />
                      <InputField label={t("account.lastnameLabel")} type="text" placeholder={t("account.lastnamePlaceholder")}
                        value={registerForm.nom} onChange={setR("nom")} icon={User} autoComplete="family-name" />
                    </div>
                    <InputField label={t("account.emailLabel")} type="email" placeholder={t("account.emailPlaceholder")}
                      value={registerForm.email} onChange={setR("email")} icon={Mail} autoComplete="email" />
                    <InputField label={t("account.passwordLabel")} type="password" placeholder={t("account.newPasswordPlaceholder")}
                      value={registerForm.password} onChange={setR("password")} icon={Lock} autoComplete="new-password" />
                    <InputField label={t("account.confirmLabel")} type="password" placeholder={t("account.confirmPlaceholder")}
                      value={registerForm.confirm} onChange={setR("confirm")} icon={Lock} autoComplete="new-password" />
                    <motion.button type="submit" whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(217,126,58,0.30)" }} whileTap={{ scale: 0.99 }}
                      className="mt-1 h-[52px] w-full rounded-2xl bg-abelec-orange hover:bg-abelec-orange-dark text-white font-bold text-[16px] flex items-center justify-center gap-2.5 transition-colors shadow-[inset_0_-3px_0_rgba(0,0,0,.14)]">
                      {t("account.registerBtn")} <ArrowRight size={16} strokeWidth={2.3} />
                    </motion.button>
                    <p className="text-[11.5px] text-abelec-muted-2 text-center leading-relaxed">
                      {t("account.legalPrefix")}{" "}
                      <a href="#" className="text-abelec-orange hover:underline">{t("account.legalTerms")}</a>{" "}
                      {t("account.legalAnd")}{" "}
                      <a href="#" className="text-abelec-orange hover:underline">{t("account.legalPrivacy")}</a>.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Toggle link */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}
            className="text-center text-[13.5px] text-abelec-muted mt-6">
            {tab === "login" ? (
              <>{t("account.noAccount")}{" "}<button type="button" onClick={() => setTab("register")} className="text-abelec-orange font-semibold hover:underline">{t("account.registerLink")}</button></>
            ) : (
              <>{t("account.alreadyAccount")}{" "}<button type="button" onClick={() => setTab("login")} className="text-abelec-orange font-semibold hover:underline">{t("account.loginLink")}</button></>
            )}
          </motion.p>

          {/* Trust micro-badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.4 }}
            className="flex items-center justify-center gap-5 mt-7 flex-wrap">
            {([
              { Icon: ShieldCheck, label: t("account.sslBadge") },
              { Icon: Star,        label: t("account.ratingBadge") },
            ] as const).map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon size={13} className="text-abelec-orange" strokeWidth={1.8} />
                <span className="font-mono text-[11px] text-abelec-muted-2">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
