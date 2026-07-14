"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/biografia", label: "Biografía" },
  { href: "/feed", label: "Feed" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        initial={false}
        animate={{
          paddingTop: scrolled ? 10 : 22,
          paddingBottom: scrolled ? 10 : 22,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[999] px-5 lg:px-10 flex items-center justify-between transition-colors duration-700 ${
          scrolled
            ? "bg-navy-deep/85 backdrop-blur-2xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
        aria-label="Navegación principal"
      >
        <Link href="/" className="flex items-center gap-3 group" aria-label="Lindasal — Inicio">
          <motion.span
            className="relative inline-flex items-center justify-center"
            whileHover={{ rotate: 8 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 22C3 22 7 14 12 14C17 14 19 20 24 20C29 20 33 14 33 14" stroke="url(#nvG1)" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M3 27C3 27 7 19 12 19C17 19 19 25 24 25C29 25 33 19 33 19" stroke="url(#nvG2)" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
              <circle cx="18" cy="10" r="3.5" fill="url(#nvD)" opacity="0.85"/>
              <defs>
                <linearGradient id="nvG1" x1="3" y1="14" x2="33" y2="14" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#c9a84c"/><stop offset="100%" stopColor="#7ecac3"/></linearGradient>
                <linearGradient id="nvG2" x1="3" y1="19" x2="33" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#7ecac3"/><stop offset="100%" stopColor="#c9a84c"/></linearGradient>
                <linearGradient id="nvD" x1="14.5" y1="6.5" x2="21.5" y2="13.5" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#e8d08a"/><stop offset="100%" stopColor="#c9a84c"/></linearGradient>
              </defs>
            </svg>
          </motion.span>
          <span className="font-heading text-2xl tracking-tight text-pearl leading-none">
            Lindasal
            <sup className="ml-1 font-body text-[0.5rem] font-bold tracking-[0.25em] uppercase text-gold/70 align-super">EC</sup>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 surface-glass-dark rounded-full pl-2 pr-2 py-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative inline-flex items-center px-4 py-2 rounded-full font-body font-medium text-[0.78rem] tracking-wide text-pearl/75 hover:text-pearl transition-colors duration-500 group"
            >
              <span className="relative z-10">{link.label}</span>
              <span className="absolute inset-0 rounded-full bg-gold/0 group-hover:bg-gold/15 transition-colors duration-500" />
            </Link>
          ))}
          <span
            className="inline-flex items-center px-4 py-2 rounded-full font-body font-medium text-[0.78rem] tracking-wide text-pearl/25 cursor-default select-none"
            title="Próximamente"
          >
            Reels
          </span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://wa.me/message/MYAWP2XPANQSH1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-semibold text-[0.78rem] tracking-wide text-navy bg-gradient-to-r from-gold-light via-gold to-gold-soft shadow-[0_8px_24px_-8px_rgba(201,168,76,0.6)] hover:shadow-[0_16px_40px_-12px_rgba(201,168,76,0.7)] hover:-translate-y-0.5 transition-all duration-500"
          >
            <i className="fa-brands fa-whatsapp text-sm" aria-hidden="true"></i>
            <span>Pedir</span>
          </a>
        </div>

        <button
          className="md:hidden relative flex flex-col justify-center items-center gap-[6px] w-11 h-11 surface-glass-dark rounded-xl"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          <span className={`block w-[22px] h-[1.5px] bg-pearl rounded-full transition-all duration-500 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block w-[22px] h-[1.5px] bg-pearl rounded-full transition-all duration-500 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-[22px] h-[1.5px] bg-pearl rounded-full transition-all duration-500 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>

        <motion.div
          style={{ scaleX: progress }}
          className="absolute left-0 right-0 bottom-0 h-[1.5px] origin-left bg-gradient-to-r from-gold via-gold-light to-teal"
          aria-hidden="true"
        />
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[1000] md:hidden bg-navy-deep/95 backdrop-blur-3xl flex flex-col"
          >
            <div className="absolute inset-0 texture-grain pointer-events-none" />
            <div className="absolute top-[10%] left-[15%] w-[280px] h-[280px] bg-gold/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[10%] w-[280px] h-[280px] bg-teal/10 rounded-full blur-[120px]" />

            <div className="flex items-center justify-between px-5 pt-5">
              <span className="font-heading text-2xl text-pearl">Lindasal</span>
              <button
                className="w-11 h-11 flex items-center justify-center text-pearl/70 rounded-full surface-glass-dark"
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <i className="fa-solid fa-xmark text-lg" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center items-start gap-2 px-8">
              <span className="text-eyebrow text-gold/60 mb-6">Menú</span>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-heading text-display-md text-pearl block leading-[1.1] hover:text-gold transition-colors duration-500"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <span className="font-heading text-display-md text-pearl/20 leading-[1.1]">
                Reels <em className="text-base font-body not-italic tracking-[0.2em] uppercase ml-3 align-middle">Pronto</em>
              </span>
            </nav>

            <div className="px-8 pb-10 flex flex-col gap-4">
              <a
                href="https://wa.me/message/MYAWP2XPANQSH1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full"
                onClick={() => setMenuOpen(false)}
              >
                <i className="fa-brands fa-whatsapp" aria-hidden="true" /> Escribir por WhatsApp
              </a>
              <div className="flex items-center justify-between text-pearl/50 text-xs tracking-[0.2em] uppercase font-body">
                <span>Guayaquil · EC</span>
                <span>@lindasalec</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
