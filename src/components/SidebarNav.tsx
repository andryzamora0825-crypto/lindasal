"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  DollarSign,
  Share2,
  Newspaper,
} from "lucide-react";

const NAV_GROUPS: {
  title: string;
  items: { name: string; href: string; exact: boolean; icon: React.ElementType }[];
}[] = [
  {
    title: "Resumen",
    items: [
      { name: "Dashboard", href: "/dashboard", exact: true, icon: LayoutDashboard },
    ],
  },
  {
    title: "Operación",
    items: [
      { name: "Productos", href: "/dashboard/productos", exact: false, icon: Package },
      { name: "Inventario", href: "/dashboard/inventario", exact: false, icon: Warehouse },
      { name: "Ventas", href: "/dashboard/ventas", exact: false, icon: DollarSign },
    ],
  },
  {
    title: "Contenido",
    items: [
      { name: "Feed", href: "/dashboard/feed", exact: false, icon: Newspaper },
      { name: "Social Media", href: "/dashboard/social", exact: false, icon: Share2 },
    ],
  },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="px-4 space-y-6" aria-label="Secciones del panel">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="px-3 mb-2 text-[0.6rem] tracking-[0.28em] uppercase font-bold text-pearl/35">
            {group.title}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <li key={item.href} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-[3px] rounded-r-full bg-gold shadow-[0_0_12px_rgba(201,168,76,0.6)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? "bg-white/[0.06] text-gold"
                        : "text-pearl/65 hover:text-pearl hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] transition-colors ${
                        isActive ? "text-gold" : "text-pearl/55 group-hover:text-pearl/85"
                      }`}
                      strokeWidth={1.75}
                    />
                    <span className="tracking-tight">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
