"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  DollarSign,
  Megaphone,
  Settings,
  Menu,
  X,
  ArrowLeft,
  LogOut,
  Waves,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  isSpecial?: boolean;
};

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Resumen",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Operación",
    items: [
      { label: "Productos", href: "/admin/productos", icon: Package },
      { label: "Inventario", href: "/admin/inventario", icon: Warehouse },
      { label: "Ventas", href: "/admin/ventas", icon: DollarSign },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Publicidad IA", href: "/admin/social", icon: Megaphone, isSpecial: true },
    ],
  },
  {
    title: "Sistema",
    items: [{ label: "Configuración", href: "/admin/config", icon: Settings }],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-[90] w-11 h-11 bg-navy texture-grain text-pearl rounded-xl flex items-center justify-center shadow-[0_8px_24px_-10px_rgba(10,22,40,0.5)]"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? "Cerrar navegación" : "Abrir navegación"}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-0 bg-navy-deep/70 z-[80] backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 h-full bg-navy texture-grain text-pearl w-[260px] z-[85] flex flex-col border-r border-white/5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Navegación administrativa"
      >
        <div className="px-6 pt-6 pb-5 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-teal flex items-center justify-center shadow-[0_0_18px_rgba(201,168,76,0.35)]">
              <Waves className="w-5 h-5 text-navy" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <p className="font-display text-2xl text-pearl tracking-tight">Lindasal</p>
              <p className="text-[0.6rem] text-gold tracking-[0.28em] uppercase font-bold">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {user && (
          <div className="mx-5 mt-5 mb-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.imageUrl}
              alt={user.fullName || "Administrador"}
              className="w-9 h-9 rounded-full bg-navy-light border border-white/10 object-cover"
            />
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-[0.8rem] font-semibold truncate text-pearl">
                {user.fullName || "Administrador"}
              </p>
              <p className="text-[0.65rem] text-pearl/45 truncate">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 pt-4 pb-3 space-y-5 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-2 text-[0.6rem] tracking-[0.28em] uppercase font-bold text-pearl/35">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <li key={link.href} className="relative">
                      {isActive && (
                        <motion.span
                          layoutId="admin-active-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-[3px] rounded-r-full bg-gold shadow-[0_0_12px_rgba(201,168,76,0.6)]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Link
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive
                            ? "bg-white/[0.06] text-gold"
                            : "text-pearl/65 hover:text-pearl hover:bg-white/[0.04]"
                        }`}
                      >
                        <Icon
                          className={`w-[18px] h-[18px] transition-colors ${
                            isActive
                              ? "text-gold"
                              : link.isSpecial
                              ? "text-teal/85 group-hover:text-teal"
                              : "text-pearl/55 group-hover:text-pearl/85"
                          }`}
                          strokeWidth={1.75}
                        />
                        <span className="tracking-tight">{link.label}</span>
                        {link.isSpecial && !isActive && (
                          <span className="ml-auto bg-teal/15 text-teal text-[0.55rem] uppercase font-bold tracking-[0.18em] px-1.5 py-0.5 rounded">
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

        <div className="p-4 border-t border-white/5 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-pearl/65 hover:text-pearl hover:bg-white/[0.04] transition-all text-sm font-medium"
          >
            <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={1.75} />
            <span>Volver a la tienda</span>
          </Link>
          <SignOutButton>
            <button
              type="button"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-pearl/65 hover:text-pearl hover:bg-white/[0.04] transition-all text-sm font-medium"
            >
              <LogOut className="w-[18px] h-[18px]" strokeWidth={1.75} />
              <span>Cerrar sesión</span>
            </button>
          </SignOutButton>
        </div>
      </aside>
    </>
  );
}
