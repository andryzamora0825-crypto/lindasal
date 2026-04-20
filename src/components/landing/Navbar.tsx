"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const btnStyle = "inline-flex items-center px-4 py-1.5 rounded-full font-body font-semibold text-[0.82rem] tracking-wide bg-gold text-navy shadow-[0_2px_12px_rgba(201,168,76,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(201,168,76,0.4)]";
const btnDisabled = "inline-flex items-center px-4 py-1.5 rounded-full font-body font-semibold text-[0.82rem] tracking-wide bg-gold text-navy shadow-[0_2px_12px_rgba(201,168,76,0.3)] cursor-default select-none";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full px-5 lg:px-[5%] flex justify-between items-center z-50 transition-all duration-500 ${
        scrolled
          ? "bg-navy/95 backdrop-blur-md border-b border-gold/15 py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
      aria-label="Navegación principal"
    >
      {/* Logo */}
      <Link href="#inicio" className="flex items-center gap-2 shrink-0">
        <svg className="w-9 h-9 shrink-0" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 22C3 22 7 14 12 14C17 14 19 20 24 20C29 20 33 14 33 14" stroke="url(#wG1)" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M3 27C3 27 7 19 12 19C17 19 19 25 24 25C29 25 33 19 33 19" stroke="url(#wG2)" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
          <circle cx="18" cy="10" r="3.5" fill="url(#dG)" opacity="0.8"/>
          <defs>
            <linearGradient id="wG1" x1="3" y1="14" x2="33" y2="14" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#c9a84c"/><stop offset="100%" stopColor="#7ecac3"/></linearGradient>
            <linearGradient id="wG2" x1="3" y1="19" x2="33" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#7ecac3"/><stop offset="100%" stopColor="#c9a84c"/></linearGradient>
            <linearGradient id="dG" x1="14.5" y1="6.5" x2="21.5" y2="13.5" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#e8d08a"/><stop offset="100%" stopColor="#c9a84c"/></linearGradient>
          </defs>
        </svg>
        <span className="font-heading text-2xl font-bold tracking-tight bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent leading-none">
          Lindasal
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-2">
        <Link href="#inicio" className={btnStyle}>Inicio</Link>
        <Link href="/tienda" className={btnStyle}>
          <i className="fa-solid fa-bag-shopping text-[0.7rem] mr-1.5" aria-hidden="true"/> Tienda
        </Link>
        <Link href="/feed" className={btnStyle}>Feed</Link>
        <span className={btnDisabled} title="Próximamente">Reels</span>
      </div>

      {/* Hamburger — solo móvil */}
      <button
        className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10 bg-white/5 border border-white/10 rounded-sm shrink-0 z-[55]"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
      >
        <span className={`block w-[22px] h-[2px] bg-pearl rounded-full transition-all ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}/>
        <span className={`block w-[22px] h-[2px] bg-pearl rounded-full transition-all ${menuOpen ? "opacity-0 scale-x-0" : ""}`}/>
        <span className={`block w-[22px] h-[2px] bg-pearl rounded-full transition-all ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}/>
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-navy z-50 flex flex-col justify-center items-center gap-6 md:hidden">
          <button
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-pearl text-2xl"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
          <Link href="#inicio" className="px-8 py-3 rounded-full font-body font-semibold text-lg bg-gold text-navy" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link href="/tienda" className="px-8 py-3 rounded-full font-body font-semibold text-lg bg-gold text-navy" onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-bag-shopping mr-2" aria-hidden="true"/>Tienda
          </Link>
          <Link href="/feed" className="px-8 py-3 rounded-full font-body font-semibold text-lg bg-gold text-navy" onClick={() => setMenuOpen(false)}>Feed</Link>
          <span className="px-8 py-3 rounded-full font-body font-semibold text-lg bg-gold text-navy opacity-50">Reels</span>
        </div>
      )}
    </nav>
  );
}
