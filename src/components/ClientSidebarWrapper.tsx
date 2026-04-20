"use client";

import { useState, useEffect } from "react";
import { Menu, X, Waves } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ClientSidebarWrapper({
  userButton,
  sidebarNav,
  children,
}: {
  userButton: React.ReactNode;
  sidebarNav: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar sidebar al navegar (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-[100dvh] bg-pearl overflow-hidden relative">

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-navy border-b border-white/5 flex items-center justify-between px-4 z-40 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-teal flex items-center justify-center">
            <Waves className="w-4 h-4 text-navy" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-[family-name:var(--font-heading)]">
            Lindasal
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-white hover:bg-white/10 rounded-xl"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 lg:w-64 bg-navy text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out border-r border-white/5 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between lg:justify-center gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-teal flex items-center justify-center shadow-[0_0_12px_rgba(201,168,76,0.3)]">
              <Waves className="w-5 h-5 text-navy" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight font-[family-name:var(--font-heading)]">
                Lindasal
              </span>
              <span className="text-[10px] text-gold uppercase font-bold tracking-widest">
                Admin Panel
              </span>
            </div>
          </div>

          <button
            className="lg:hidden p-1 bg-white/5 rounded-lg text-gray-300 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navegación inyectada */}
        {sidebarNav}

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20 flex items-center gap-3">
          {userButton}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Sesión Activa</span>
            <span className="text-[10px] text-gold uppercase font-bold tracking-widest">
              Administrador
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 h-[100dvh]">
        {children}
      </main>
    </div>
  );
}
