"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Warehouse,
  DollarSign,
  Megaphone,
  Settings,
  ArrowRight,
  ArrowUpRight,
  Waves,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { fadeUp, PageHeader } from "@/components/admin/AdminUI";

const MODULES = [
  {
    title: "Productos",
    desc: "Gestiona tu catálogo, precios, descuentos e imágenes.",
    href: "/admin/productos",
    icon: Package,
    tone: "text-gold-dark bg-gold/10 border-gold/20",
    accent: "group-hover:border-gold/40",
  },
  {
    title: "Inventario",
    desc: "Supervisa existencias, valor de mercancía y alertas de stock.",
    href: "/admin/inventario",
    icon: Warehouse,
    tone: "text-teal-dark bg-teal/10 border-teal/25",
    accent: "group-hover:border-teal/40",
  },
  {
    title: "Ventas",
    desc: "Historial de pedidos, estados y recibos PDF.",
    href: "/admin/ventas",
    icon: DollarSign,
    tone: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    accent: "group-hover:border-emerald-500/40",
  },
  {
    title: "Publicidad IA",
    desc: "Genera imágenes publicitarias profesionales con inteligencia artificial.",
    href: "/admin/social",
    icon: Megaphone,
    tone: "text-purple-600 bg-purple-500/10 border-purple-500/20",
    accent: "group-hover:border-purple-500/40",
    badge: "IA",
  },
  {
    title: "Configuración",
    desc: "Personaliza el logo y la identidad de tu marca.",
    href: "/admin/config",
    icon: Settings,
    tone: "text-navy bg-navy/8 border-navy/15",
    accent: "group-hover:border-navy/30",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Panel central"
        title="Bienvenido al"
        accent="panel."
        subtitle="Tu centro de control: catálogo, inventario, ventas y marketing con IA en un solo lugar."
      />

      {/* Hero de bienvenida */}
      <motion.div
        variants={fadeUp}
        custom={1}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-3xl bg-navy texture-grain text-pearl p-8 sm:p-12"
      >
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-[100px] animate-float-slow"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-teal/10 blur-[90px] animate-float-slow"
        />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8 justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-body text-[0.62rem] font-bold uppercase tracking-[0.22em] text-gold-light mb-5">
              <Sparkles aria-hidden="true" className="h-3 w-3" />
              Lindasal Admin
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl leading-[1.1]">
              El poder del mar,{" "}
              <span className="italic gradient-text-warm">bajo control.</span>
            </h2>
            <p className="mt-4 text-pearl/65 text-sm sm:text-base leading-relaxed">
              Desde aquí gestionas productos, revisas el inventario, administras
              ventas y creas publicidad con el módulo de Inteligencia Artificial.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/dashboard"
              className="btn-gold group text-sm !py-3.5 !px-6"
            >
              <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
              Dashboard Integrado
              <ArrowRight
                className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link href="/tienda" className="btn-ghost text-sm !py-3.5 !px-6">
              <Waves className="w-4 h-4" aria-hidden="true" />
              Ver la tienda
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Tarjetas de módulos */}
      <div>
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="visible"
          className="flex items-baseline justify-between mb-6"
        >
          <h3 className="font-heading text-2xl text-navy">Módulos</h3>
          <span
            aria-hidden="true"
            className="hidden sm:block h-px flex-1 mx-6 bg-gradient-to-r from-pearl-dark via-gold/30 to-transparent"
          />
          <span className="text-[0.65rem] uppercase tracking-[0.22em] text-navy/40 font-bold">
            Acceso rápido
          </span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.href}
                variants={fadeUp}
                custom={3 + i}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={mod.href}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white border border-pearl-dark/70 p-7 shadow-soft hover:shadow-raised transition-[box-shadow,border-color] duration-500 ${mod.accent}`}
                >
                  <div
                    aria-hidden="true"
                    className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-br from-gold/10 to-teal/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  />
                  <div className="relative flex items-start justify-between">
                    <span
                      className={`w-13 h-13 rounded-2xl border flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${mod.tone}`}
                    >
                      <Icon className="w-5.5 h-5.5" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="w-9 h-9 rounded-full border border-pearl-dark/70 flex items-center justify-center text-navy/30 transition-all duration-500 group-hover:bg-navy group-hover:text-gold group-hover:border-navy">
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </div>
                  <h4 className="relative mt-6 font-heading text-2xl text-navy flex items-center gap-2">
                    {mod.title}
                    {mod.badge && (
                      <span className="rounded bg-teal/15 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.18em] text-teal-dark">
                        {mod.badge}
                      </span>
                    )}
                  </h4>
                  <p className="relative mt-2 text-sm leading-relaxed text-navy/55">
                    {mod.desc}
                  </p>
                  <span className="relative mt-5 inline-flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-gold-dark opacity-0 -translate-x-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                    Abrir módulo
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
