"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

function RollingCounter({ value }: { value: number }) {
  const digits = String(value).split("");

  return (
    <div
      className="inline-flex items-baseline justify-center"
      style={{
        fontFamily: "var(--font-slab), Georgia, serif",
        fontWeight: 700,
        fontSize: "clamp(28px, 8vw, 52px)",
        lineHeight: 1,
        letterSpacing: "-0.045em",
        fontFeatureSettings: '"tnum" 1',
        fontVariantNumeric: "tabular-nums",
        textShadow: "0 2px 0 rgba(0,0,0,.1)",
        color: "#d97e3a",
      }}
      aria-live="polite"
    >
      {digits.map((d, idx) => {
        const posFromEnd = digits.length - idx;
        const target = parseInt(d, 10);
        const isLast = idx === digits.length - 1;

        return (
          <span key={idx} className="inline-flex">
            {isLast ? (
              /* Last digit only — arcade roll */
              <span className="digit-roll">
                <span
                  className="stack"
                  style={{ transform: `translateY(-${target}em)` }}
                >
                  {[...Array(10)].map((_, n) => (
                    <span key={n}>{n}</span>
                  ))}
                </span>
              </span>
            ) : (
              /* All other digits — static */
              <span>{d}</span>
            )}
            {/* Thousands separator */}
            {posFromEnd > 1 && (posFromEnd - 1) % 3 === 0 && (
              <span style={{ width: "0.22em", textAlign: "center", opacity: 0.35 }}>
                {"\u2009"}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export default function CounterBand() {
  const t = useT();
  const [count, setCount] = useState(287543);

  /* Random increment */
  useEffect(() => {
    let tid: ReturnType<typeof setTimeout>;
    const tick = () => {
      setCount((c) => c + Math.floor(Math.random() * 2) + 1);
      tid = setTimeout(tick, 4000 + Math.random() * 20000);
    };
    tid = setTimeout(tick, 5000);
    return () => clearTimeout(tid);
  }, []);

  return (
    <section
      className="relative text-center overflow-hidden text-white"
      style={{ background: "#1a3a5c", paddingTop: "20px", paddingBottom: "20px" }}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 relative z-10">

        <RollingCounter value={count} />

        <p className="text-[12px] sm:text-[13px] text-white/70" style={{ marginTop: "4px" }}>
          {t("counter.sub")}
        </p>

      </div>
    </section>
  );
}
