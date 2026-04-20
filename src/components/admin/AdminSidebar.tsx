"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    { label: "Dashboard", href: "/admin", icon: "fa-chart-pie" },
    { label: "Productos", href: "/admin/productos", icon: "fa-box-open" },
    { label: "Inventario", href: "/admin/inventario", icon: "fa-warehouse" },
    { label: "Ventas", href: "/admin/ventas", icon: "fa-cash-register" },
    { label: "Redes Sociales (AI)", href: "/admin/social", icon: "fa-hashtag", isSpecial: true },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-[90] w-10 h-10 bg-navy text-pearl rounded-lg flex items-center justify-center shadow-lg"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <i className={`fa-solid ${isMobileOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-[80] backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-navy text-white w-[260px] z-[85] flex flex-col border-r border-white/5 transition-transform duration-300 md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo / Brand */}
        <div className="p-6 pb-2 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-teal flex items-center justify-center text-navy shadow-lg">
            <i className="fa-solid fa-water text-lg"></i>
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl leading-none">Lindasal</h2>
            <span className="text-[0.65rem] text-gold tracking-widest uppercase font-bold">Admin Panel</span>
          </div>
        </div>

        {/* User Card */}
        {user && (
          <div className="m-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user.imageUrl} alt={user.fullName || "User"} className="w-10 h-10 rounded-full bg-navy border border-white/20" />
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold truncate text-pearl">{user.fullName || "Administrador"}</p>
              <p className="text-[0.7rem] text-pearl/50 truncate w-full">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all font-medium text-sm group ${
                  isActive 
                    ? "bg-gold text-navy shadow-[0_4px_15px_rgba(201,168,76,0.2)]" 
                    : "text-pearl/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <i className={`fa-solid ${link.icon} w-5 text-center ${link.isSpecial && !isActive ? 'text-teal' : ''}`}></i>
                <span>{link.label}</span>
                {link.isSpecial && (
                  <span className="ml-auto bg-teal text-navy text-[0.55rem] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm">Beta</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-pearl/70 hover:bg-white/10 hover:text-white transition-all font-medium text-sm mb-1 group">
            <i className="fa-solid fa-arrow-left w-5 text-center"></i>
            <span>Volver a la Tienda</span>
          </Link>
          <SignOutButton>
            <button className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-red-400 border border-red-400/20 bg-red-400/10 hover:bg-red-500 hover:text-white hover:border-red-500 font-medium text-sm transition-all text-center">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              Cerrar Sesión
            </button>
          </SignOutButton>
        </div>
      </aside>
    </>
  );
}
