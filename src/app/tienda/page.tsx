import React from "react";
import StoreClient from "./StoreClient";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function TiendaPage() {
  return (
    <main className="flex flex-col min-h-screen bg-bone selection:bg-gold/30 selection:text-navy">
      <Navbar />

      <section className="relative overflow-hidden pt-[120px] pb-16 sm:pb-24 surface-pearl texture-grain">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" aria-hidden="true" />
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-24 w-[420px] h-[420px] bg-teal/10 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <nav className="text-eyebrow text-navy/50 mb-10 flex items-center gap-3" aria-label="Breadcrumb">
            <a href="/" className="link-underline hover:text-gold-dark transition-colors">Inicio</a>
            <span aria-hidden="true">/</span>
            <span className="text-navy">Tienda</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-8">
              <span className="eyebrow mb-6">Coleccion 2026</span>
              <h1 className="font-display text-display-lg text-navy mt-4 mb-6">
                Sales del oceano,
                <br />
                <span className="gradient-text-warm italic">capturadas a mano</span>
              </h1>
              <p className="font-body text-navy/65 text-base sm:text-lg max-w-xl leading-relaxed">
                Una seleccion editorial de sales marinas y aguas mineralizadas, cosechadas con respeto en las costas del Ecuador. Cada pieza, una invitacion al ritual.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="surface-glass rounded-3xl p-6 w-full lg:max-w-[280px]">
                <div className="divider-mark mb-4" />
                <p className="font-display text-2xl text-navy leading-snug mb-3">
                  Origen <span className="italic text-gold-dark">Ecuador</span>
                </p>
                <p className="text-sm text-navy/60 leading-relaxed">
                  Producto artesanal, sin refinar, libre de aditivos. Trazabilidad completa desde la salina hasta tu mesa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-10 py-12 sm:py-16 flex flex-col grow">
        <StoreClient />
      </div>

      <Footer />
    </main>
  );
}
