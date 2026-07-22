"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  DollarSign,
  Megaphone,
  Settings,
  LogOut,
  Waves,
  Store,
  Newspaper,
} from "lucide-react";

type NavItem = {
  label: string;
  short: string;
  href: string;
  icon: React.ElementType;
  group: string;
  special?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", short: "Inicio", href: "/admin", icon: LayoutDashboard, group: "Resumen" },
  { label: "Productos", short: "Productos", href: "/admin/productos", icon: Package, group: "Operación" },
  { label: "Inventario", short: "Stock", href: "/admin/inventario", icon: Warehouse, group: "Operación" },
  { label: "Ventas", short: "Ventas", href: "/admin/ventas", icon: DollarSign, group: "Operación" },
  { label: "Publicidad IA", short: "IA", href: "/admin/social", icon: Megaphone, group: "Marketing", special: true },
  { label: "Feed", short: "Feed", href: "/admin/feed", icon: Newspaper, group: "Marketing" },
  { label: "Configuración", short: "Ajustes", href: "/admin/config", icon: Settings, group: "Sistema" },
];

const GROUPS = ["Resumen", "Operación", "Marketing", "Sistema"];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

/* ══════════════ ESCRITORIO: SIDEBAR ══════════════ */
function DesktopSidebar() {
  const { user } = useUser();
  const isActive = useIsActive();

  return (
    <aside
      className="hidden md:flex fixed top-0 left-0 z-40 h-full w-[264px] flex-col bg-navy texture-grain text-pearl border-r border-white/5"
      aria-label="Navegación administrativa"
    >
      {/* Marca */}
      <div className="px-6 pt-6 pb-5 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-teal flex items-center justify-center shadow-[0_0_18px_rgba(201,168,76,0.35)] transition-transform duration-500 group-hover:rotate-6">
            <Waves className="w-5 h-5 text-navy" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-2xl text-pearl tracking-tight">Lindasal</p>
            <p className="text-[0.58rem] text-gold tracking-[0.28em] uppercase font-bold">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Usuario */}
      {user && (
        <div className="mx-4 mt-4 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.imageUrl}
            alt={user.fullName || "Administrador"}
            className="w-9 h-9 rounded-full bg-navy-light border border-gold/30 object-cover"
          />
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-[0.8rem] font-semibold truncate text-pearl">
              {user.fullName || "Administrador"}
            </p>
            <p className="text-[0.62rem] text-pearl/40 truncate">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      )}

      {/* Navegación */}
      <nav className="flex-1 px-4 pt-4 pb-3 space-y-5 overflow-y-auto">
        {GROUPS.map((group) => (
          <div key={group}>
            <p className="px-3 mb-1.5 text-[0.58rem] tracking-[0.28em] uppercase font-bold text-pearl/30">
              {group}
            </p>
            <ul className="space-y-1">
              {NAV_ITEMS.filter((i) => i.group === group).map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href} className="relative">
                    {active && (
                      <motion.span
                        layoutId="admin-desktop-active"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/[0.14] to-transparent border border-gold/20"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-300 ${
                        active
                          ? "text-gold"
                          : "text-pearl/60 hover:text-pearl hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] transition-colors ${
                          active
                            ? "text-gold"
                            : item.special
                            ? "text-teal/85"
                            : "text-pearl/50"
                        }`}
                        strokeWidth={1.75}
                      />
                      <span className="tracking-tight">{item.label}</span>
                      {item.special && !active && (
                        <span className="ml-auto bg-teal/15 text-teal text-[0.5rem] uppercase font-bold tracking-[0.18em] px-1.5 py-0.5 rounded">
                          IA
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Pie */}
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/tienda"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-pearl/60 hover:text-pearl hover:bg-white/[0.04] transition-colors text-sm font-medium"
        >
          <Store className="w-[18px] h-[18px]" strokeWidth={1.75} />
          <span>Ver la tienda</span>
        </Link>
        <SignOutButton>
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-pearl/60 hover:text-red-300 hover:bg-red-500/[0.08] transition-colors text-sm font-medium"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.75} />
            <span>Cerrar sesión</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}

/* ══════════════ MÓVIL: BARRA SUPERIOR ══════════════ */
function MobileTopBar() {
  const isActive = useIsActive();
  return (
    <header
      className="md:hidden fixed top-0 inset-x-0 z-40 bg-navy/95 backdrop-blur-xl border-b border-white/10 text-pearl"
      role="banner"
    >
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-teal flex items-center justify-center">
            <Waves className="w-4 h-4 text-navy" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <p className="font-display text-lg text-pearl tracking-tight leading-none">Lindasal</p>
            <p className="text-[0.5rem] text-gold tracking-[0.26em] uppercase font-bold mt-0.5">
              Admin
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href="/admin/config"
            aria-label="Configuración"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isActive("/admin/config")
                ? "bg-gold/15 text-gold"
                : "text-pearl/60 active:bg-white/10"
            }`}
          >
            <Settings className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </Link>
          <Link
            href="/tienda"
            aria-label="Ver la tienda"
            className="w-9 h-9 rounded-full flex items-center justify-center text-pearl/60 active:bg-white/10 transition-colors"
          >
            <Store className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </Link>
          <SignOutButton>
            <button
              type="button"
              aria-label="Cerrar sesión"
              className="w-9 h-9 rounded-full flex items-center justify-center text-pearl/60 active:bg-red-500/15 active:text-red-300 transition-colors"
            >
              <LogOut className="w-[18px] h-[18px]" strokeWidth={1.75} />
            </button>
          </SignOutButton>
        </div>
      </div>
    </header>
  );
}

/* ══════════════ MÓVIL: BARRA INFERIOR (TAB BAR) ══════════════ */
function MobileBottomNav() {
  const isActive = useIsActive();
  // Config vive en la barra superior; abajo van las 5 secciones de trabajo
  const tabs = NAV_ITEMS.filter((i) => i.href !== "/admin/config");

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-navy-deep/95 backdrop-blur-xl border-t border-white/10"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navegación principal"
    >
      <ul className="grid grid-cols-6 h-[62px]">
        {tabs.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="relative flex h-full flex-col items-center justify-center gap-1"
              >
                {active && (
                  <motion.span
                    layoutId="admin-mobile-active"
                    className="absolute top-0 h-[2.5px] w-10 rounded-b-full bg-gold shadow-[0_0_10px_rgba(201,168,76,0.7)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon
                  className={`w-[21px] h-[21px] transition-colors duration-300 ${
                    active ? "text-gold" : item.special ? "text-teal/70" : "text-pearl/45"
                  }`}
                  strokeWidth={active ? 2 : 1.75}
                />
                <span
                  className={`text-[0.58rem] font-bold tracking-wide transition-colors duration-300 ${
                    active ? "text-gold" : "text-pearl/40"
                  }`}
                >
                  {item.short}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function AdminSidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileTopBar />
      <MobileBottomNav />
    </>
  );
}
