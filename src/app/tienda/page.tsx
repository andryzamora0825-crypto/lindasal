import React from "react";
import StoreClient from "./StoreClient";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ScrollProgress from "@/components/landing/ScrollProgress";

const BADGES = [
  { icon: "fa-leaf", label: "100% Orgánico" },
  { icon: "fa-droplet", label: "Origen Ecuador" },
  { icon: "fa-hand-holding-heart", label: "Artesanal · Sin aditivos" },
  { icon: "fa-truck-fast", label: "Envíos a todo el país" },
];

export default function TiendaPage() {
  return (
    <main className="flex flex-col min-h-screen bg-bone selection:bg-gold/30 selection:text-navy">
      <ScrollProgress />
      <Navbar />

      {/* Cabecera compacta de tienda */}
      <section className="relative overflow-hidden pt-[100px] pb-8 sm:pt-[112px] sm:pb-10 surface-pearl border-b border-pearl-dark/50">
        <div className="absolute -top-24 -right-24 w-[380px] h-[380px] bg-gold/10 blur-[110px] rounded-full pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <nav className="text-eyebrow text-navy/50 mb-4 flex items-center gap-3" aria-label="Breadcrumb">
            <a href="/" className="link-underline hover:text-gold-dark transition-colors">Inicio</a>
            <span aria-hidden="true">/</span>
            <span className="text-navy">Tienda</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <h1 className="font-display text-4xl sm:text-5xl text-navy">
              Tienda{" "}
              <span className="gradient-text-warm italic">Lindasal</span>
            </h1>
            <p className="font-body text-navy/60 text-sm sm:text-base max-w-md leading-relaxed">
              Sales marinas y aguas mineralizadas cosechadas a mano en las costas del Ecuador.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {BADGES.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white/70 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-navy/65"
              >
                <i className={`fa-solid ${b.icon} text-gold-dark text-[0.65rem]`} aria-hidden="true" />
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10 py-8 sm:py-10 flex flex-col grow">
        <StoreClient />
      </div>

      <Footer />
    </main>
  );
}
