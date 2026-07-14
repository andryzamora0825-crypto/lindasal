"use client";

import React, { useEffect, useRef } from "react";
import { motion, animate, useMotionValue } from "framer-motion";

/* ── Variants compartidos ── */
export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.08 },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

export const rowVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ── Número animado (count-up) ── */
export function AnimatedNumber({
  value,
  format,
  duration = 1.4,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = format ? format(v) : Math.round(v).toString();
        }
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{format ? format(0) : "0"}</span>;
}

/* ── Cabecera de página ── */
export function PageHeader({
  eyebrow,
  title,
  accent,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.header
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5"
    >
      <div>
        <span className="eyebrow mb-2">{eyebrow}</span>
        <h1 className="font-display text-4xl sm:text-5xl text-navy">
          {title}{" "}
          {accent && <span className="italic gradient-text-warm">{accent}</span>}
        </h1>
        {subtitle && (
          <p className="mt-2.5 text-sm sm:text-base text-navy/55 max-w-xl">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </motion.header>
  );
}

/* ── Tonos para KPI ── */
const TONES: Record<string, { chip: string; glow: string }> = {
  gold: { chip: "bg-gold/10 text-gold-dark border-gold/20", glow: "from-gold/10" },
  teal: { chip: "bg-teal/10 text-teal-dark border-teal/25", glow: "from-teal/10" },
  navy: { chip: "bg-navy/8 text-navy border-navy/15", glow: "from-navy/5" },
  green: { chip: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", glow: "from-emerald-500/10" },
  red: { chip: "bg-red-500/10 text-red-500 border-red-500/20", glow: "from-red-500/10" },
  purple: { chip: "bg-purple-500/10 text-purple-600 border-purple-500/20", glow: "from-purple-500/10" },
};

/* ── Tarjeta KPI animada ── */
export function KpiCard({
  icon,
  label,
  value,
  format,
  tone = "gold",
  index = 0,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  format?: (n: number) => string;
  tone?: keyof typeof TONES;
  index?: number;
  hint?: string;
}) {
  const t = TONES[tone] ?? TONES.gold;
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden bg-white rounded-2xl p-5 border border-pearl-dark/70 shadow-soft hover:shadow-raised hover:border-gold/30 transition-[box-shadow,border-color] duration-500"
    >
      <div
        aria-hidden="true"
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${t.glow} to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
      />
      <div className="relative flex items-center gap-4">
        <div
          className={`w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 ${t.chip}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[0.62rem] font-bold text-navy/40 uppercase tracking-[0.18em] mb-1 truncate">
            {label}
          </p>
          <p className="font-heading text-[1.75rem] leading-none text-navy tabular-nums">
            <AnimatedNumber value={value} format={format} />
          </p>
          {hint && <p className="text-[0.65rem] text-navy/40 mt-1 truncate">{hint}</p>}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Panel / tarjeta contenedora ── */
export function Panel({
  title,
  subtitle,
  icon,
  actions,
  children,
  index = 0,
  className = "",
  bodyClassName = "",
}: {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  index?: number;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <motion.section
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-3xl border border-pearl-dark/70 shadow-soft overflow-hidden ${className}`}
    >
      {(title || actions) && (
        <div className="px-6 py-4.5 border-b border-pearl-dark/50 bg-gradient-to-r from-pearl/60 to-transparent flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="w-9 h-9 rounded-xl bg-navy text-gold flex items-center justify-center shrink-0">
                {icon}
              </span>
            )}
            <div>
              {title && <h2 className="font-heading text-xl text-navy leading-tight">{title}</h2>}
              {subtitle && <p className="text-xs text-navy/45 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {actions}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </motion.section>
  );
}

/* ── Loader de marca ── */
export function BrandLoader({ label = "Cargando…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-16">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-gold/15" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
        <div className="absolute inset-2.5 rounded-full bg-gold/10 animate-pulse" />
      </div>
      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-navy/40 font-bold">{label}</p>
    </div>
  );
}

/* ── Estado vacío animado ── */
export function EmptyPanelState({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="p-16 flex flex-col items-center justify-center text-center"
    >
      <div className="w-20 h-20 rounded-full bg-pearl flex items-center justify-center mb-6 text-navy/30 animate-float">
        {icon}
      </div>
      <h3 className="font-heading text-2xl text-navy mb-2">{title}</h3>
      <p className="text-sm text-navy/50 max-w-[400px] leading-relaxed">{description}</p>
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  );
}
