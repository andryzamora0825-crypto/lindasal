"use client";

import { useState, useEffect } from "react";
import { Menu, X, Waves } from "lucide-react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-[100dvh] bg-bone overflow-hidden relative">
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 bg-navy texture-grain border-b border-white/5 flex items-center justify-between px-5 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-teal flex items-center justify-center shadow-[0_0_18px_rgba(201,168,76,0.35)]">
            <Waves className="w-4 h-4 text-navy" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-xl text-pearl">Lindasal</p>
            <p className="text-[0.55rem] text-gold tracking-[0.25em] uppercase font-bold">Studio</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Abrir navegación"
          className="p-2.5 text-pearl hover:bg-white/10 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-navy-deep/70 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : undefined }}
        className={`fixed lg:static inset-y-0 left-0 w-[280px] lg:w-[260px] bg-navy texture-grain text-pearl flex flex-col z-50 border-r border-white/5 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        aria-label="Navegación principal"
      >
        <div className="px-6 pt-6 pb-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-teal flex items-center justify-center shadow-[0_0_18px_rgba(201,168,76,0.35)]">
              <Waves className="w-5 h-5 text-navy" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <p className="font-display text-2xl text-pearl tracking-tight">Lindasal</p>
              <p className="text-[0.6rem] text-gold tracking-[0.28em] uppercase font-bold">Studio Privado</p>
            </div>
          </div>

          <button
            className="lg:hidden p-1.5 bg-white/5 rounded-lg text-pearl/70 hover:text-pearl transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar navegación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-5 pb-3">
          <p className="text-eyebrow text-pearl/40">Espacio</p>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">{sidebarNav}</div>

        <div className="mt-auto border-t border-white/5">
          <div className="px-5 py-4 flex items-center gap-3">
            <div className="shrink-0">{userButton}</div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-sm font-semibold text-pearl truncate">Sesión Activa</span>
              <span className="text-[0.6rem] text-gold tracking-[0.25em] uppercase font-bold">
                Administrador
              </span>
            </div>
          </div>
        </div>
      </motion.aside>

      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 h-[100dvh] bg-bone">
        {children}
      </main>
    </div>
  );
}
