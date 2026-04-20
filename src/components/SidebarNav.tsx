"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  DollarSign,
  Share2,
  Settings,
  Waves,
  Newspaper,
} from "lucide-react";

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard",    href: "/dashboard",            exact: true,  icon: LayoutDashboard },
    { name: "Productos",    href: "/dashboard/productos",  exact: false, icon: Package },
    { name: "Inventario",   href: "/dashboard/inventario", exact: false, icon: Warehouse },
    { name: "Ventas",       href: "/dashboard/ventas",     exact: false, icon: DollarSign },
    { name: "Feed",         href: "/dashboard/feed",       exact: false, icon: Newspaper },
    { name: "Social Media", href: "/dashboard/social",     exact: false, icon: Share2 },
    { name: "Configuración",href: "/dashboard/configuracion", exact: false, icon: Settings },
  ];

  return (
    <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
              isActive
                ? "bg-gradient-to-r from-gold to-gold-light text-navy shadow-[0_0_20px_rgba(201,168,76,0.3)] transform scale-[1.02]"
                : "text-gray-400 hover:text-gold hover:bg-gold/8 hover:shadow-[0_0_15px_rgba(201,168,76,0.08)]"
            }`}
          >
            <Icon className="w-5 h-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
