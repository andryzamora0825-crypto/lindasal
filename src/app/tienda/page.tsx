import React from "react";
import StoreClient from "./StoreClient";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function TiendaPage() {
  return (
    <main className="flex flex-col min-h-screen bg-pearl pt-[100px]">
      <div className="bg-navy absolute top-0 left-0 right-0 h-[100px] z-0"></div>
      <Navbar />
      
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 md:px-8 py-6 sm:py-10 flex flex-col grow">
        <header className="mb-6 sm:mb-10 text-center md:text-left">
          <nav className="flex items-center justify-center md:justify-start gap-2 text-xs sm:text-sm text-navy-light/60 font-body mb-3 sm:mb-4" aria-label="Breadcrumb">
            <a href="/" className="hover:text-gold transition-colors"><i className="fa-solid fa-house"></i> Inicio</a>
            <span>/</span>
            <span className="text-navy font-semibold">Tienda</span>
          </nav>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-2 sm:mb-3">
            Nuestra <span className="bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">Tienda</span>
          </h1>
          <p className="font-body text-navy-light/70 text-sm sm:text-lg">Sales naturales de los mares de Ecuador, directo a tu mesa.</p>
        </header>

        <StoreClient />
      </div>

      <Footer />
    </main>
  );
}
