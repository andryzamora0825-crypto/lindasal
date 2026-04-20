import React from "react";
import Link from "next/link";
import bgImage from "../../../imagen de fondo/WhatsApp Image 2026-04-08 at 1.33.12 PM.jpeg";

export default function Hero() {
  return (
    <header
      id="inicio"
      className="relative min-h-[100vh] flex flex-col justify-center items-start overflow-hidden pt-32 pb-20 px-[5%] md:pt-32 lg:pt-[10%] bg-navy md:items-start text-center md:text-left"
      aria-label="Sección principal"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[8000ms] ease-out z-0 hidden md:block hover:scale-100"
        style={{ backgroundImage: `url('${bgImage.src}')` }}
        role="img" 
        aria-label="Fondo Sal marina orgánica"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent z-10 hidden md:block"></div>
      
      {/* Decorative Particles (visible on larger screens) */}
      <div className="absolute w-2 h-2 rounded-full bg-gold/60 top-[22%] left-[55%] z-20 animate-float hidden lg:block"></div>
      <div className="absolute w-[5px] h-[5px] rounded-full bg-teal/70 top-[40%] left-[70%] z-20 animate-float hidden lg:block" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-30 max-w-[680px] w-full mx-auto md:mx-0 animate-fade-in-up md:mt-0 flex flex-col items-center md:items-start">
        
        {/* Mobile Product Image to match 'lindasal' original mobile design */}
        <div className="w-full md:hidden mb-8 rounded-2xl overflow-hidden shadow-2xl relative animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <img 
            src={bgImage.src} 
            alt="Productos Lindasal" 
            className="w-full h-auto object-cover object-center"
          />
        </div>

        <div className="mb-6 animate-fade-in-up w-full flex justify-center md:justify-start" style={{ animationDelay: '0.2s' }}>
          <span className="inline-flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 px-6 py-3 md:px-4 md:py-1.5 rounded-[2rem] md:rounded-full text-[0.65rem] md:text-[0.72rem] font-semibold tracking-widest uppercase bg-gold/10 md:bg-gold/15 text-gold border border-gold/40 text-center leading-relaxed">
            <i className="fa-solid fa-seedling mb-1 md:mb-0" aria-hidden="true"></i>
            <span>100% Orgánico · Ecuador · Lindasal <span className="md:hidden">·<br/>Nalleva · Aguademar Quinton</span></span>
          </span>
        </div>

        <h1 className="font-heading text-[clamp(2.4rem,9vw,3.5rem)] md:text-[clamp(3rem,6.5vw,6rem)] font-bold text-pearl leading-[1.08] mb-6 drop-shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
          La Sal que<br className="hidden md:block" />{" "}
          <span className="bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">
            <em className="font-light italic">Sana el Alma</em>
          </span>
        </h1>

        <p className="font-body text-[clamp(1rem,1.8vw,1.2rem)] text-pearl/85 leading-[1.8] mb-8 max-w-full md:max-w-[520px] drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          Extraída artesanalmente de los mares vírgenes de Ecuador. Cada granito contiene 40% menos de cloruro de sodio y 60% de minerales naturales — potasio, calcio, magnesio, hierro y más — que tu cuerpo necesita para florecer.
        </p>

        <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start animate-fade-in-up" style={{ animationDelay: '0.65s' }} role="list">
          <a
            href="https://wa.me/message/MYAWP2XPANQSH1"
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-pearl text-sm font-semibold tracking-wide transition-all hover:-translate-y-1 hover:bg-[#25D366] hover:border-[#25D366] hover:text-white hover:shadow-[0_8px_20px_rgba(37,211,102,0.4)]"
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
          >
            <i className="fa-brands fa-whatsapp"></i> WhatsApp
          </a>
          <a
            href="https://www.instagram.com/lindasalec"
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-pearl text-sm font-semibold tracking-wide transition-all hover:-translate-y-1 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-500 hover:border-transparent hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
            role="listitem"
          >
            <i className="fa-brands fa-instagram"></i> @lindasalec
          </a>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto animate-fade-in-up justify-center md:justify-start" style={{ animationDelay: '0.8s' }}>
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-body font-semibold text-base tracking-wide bg-gradient-to-r from-gold to-gold-light text-navy shadow-[0_4px_20px_rgba(201,168,76,0.35)] transition-all transform hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(201,168,76,0.45)] w-full sm:w-auto overflow-hidden relative group"
          >
            <span className="absolute inset-0 bg-white/40 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out z-0"></span>
            <span className="relative z-10 flex items-center gap-2">Explorar Tienda <i className="fa-solid fa-arrow-right"></i></span>
          </Link>
          <a
            href="#productos"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-body font-semibold text-base tracking-wide bg-transparent border-2 border-pearl/60 text-pearl backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-pearl/10 hover:border-pearl hover:text-white w-full sm:w-auto"
          >
            Ver Productos
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex pl-[5%] md:pl-0 flex-col items-center gap-1.5 text-pearl/60 text-xs tracking-widest uppercase font-body animate-fade-in-up hidden md:flex" style={{ animationDelay: '1.5s' }}>
        <span>Descubrir</span>
        <div className="w-6 h-6 flex items-center justify-center border-2 border-pearl/40 rounded-full animate-bounce">
          <i className="fa-solid fa-chevron-down text-[10px]"></i>
        </div>
      </div>
    </header>
  );
}
