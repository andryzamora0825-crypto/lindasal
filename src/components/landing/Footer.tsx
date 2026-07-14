import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy pt-20 pb-6 inset-x-0 relative border-t border-white/[0.04] overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute bottom-0 left-[20%] w-[400px] h-[300px] bg-gold/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="mx-auto max-w-[1200px] px-[5%] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12 mb-16">
          
          <div className="flex flex-col gap-4">
            <Link href="#inicio" className="flex items-center gap-2.5 mb-2" aria-label="Lindasal - Inicio">
              <svg className="w-8 h-8 shrink-0" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 22C3 22 7 14 12 14C17 14 19 20 24 20C29 20 33 14 33 14" stroke="url(#waveGrad1)" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M3 27C3 27 7 19 12 19C17 19 19 25 24 25C29 25 33 19 33 19" stroke="url(#waveGrad2)" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                <circle cx="18" cy="10" r="3.5" fill="url(#dotGrad)" opacity="0.8"/>
              </svg>
              <span className="font-heading text-xl font-bold tracking-tight bg-gradient-to-r from-gold via-[#e6c86a] to-teal bg-clip-text text-transparent leading-none">Lindasal</span>
            </Link>
            <p className="text-[0.88rem] text-pearl/60 leading-[1.7] mb-4">
              Lindasal es producida en tierras protegidas y cuidadas por nuestra familia durante más de 86 años, lo que permite conservar sus minerales y ofrecer un producto 100% natural.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/lindasalec" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] text-pearl/60 border border-white/[0.06] transition-all duration-500 hover:-translate-y-1 hover:bg-gold/15 hover:border-gold/25 hover:text-gold hover:shadow-[0_8px_20px_rgba(201,168,76,0.15)]">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://wa.me/message/MYAWP2XPANQSH1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] text-pearl/60 border border-white/[0.06] transition-all duration-500 hover:-translate-y-1 hover:bg-[#25D366]/15 hover:border-[#25D366]/25 hover:text-[#25D366] hover:shadow-[0_8px_20px_rgba(37,211,102,0.15)]">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-body text-[0.72rem] font-bold tracking-[0.15em] text-white/90 uppercase mb-4">Nuestras Marcas</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#productos" className="text-[0.9rem] text-pearl/50 transition-all duration-300 hover:text-gold hover:pl-1.5 block">Lindasal Gourmet</Link></li>
              <li><Link href="#productos" className="text-[0.9rem] text-pearl/50 transition-all duration-300 hover:text-gold hover:pl-1.5 block">Nalleva Skincare</Link></li>
              <li><Link href="#productos" className="text-[0.9rem] text-pearl/50 transition-all duration-300 hover:text-gold hover:pl-1.5 block">Aguademar Quinton</Link></li>
              <li><Link href="#productos" className="text-[0.9rem] text-pearl/50 transition-all duration-300 hover:text-gold hover:pl-1.5 block">ATM Aceite de Magnesio</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-body text-[0.72rem] font-bold tracking-[0.15em] text-white/90 uppercase mb-4">Secciones</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="#beneficios" className="text-[0.9rem] text-pearl/50 transition-all duration-300 hover:text-gold hover:pl-1.5 block">Beneficios y Propiedades</Link></li>
              <li><Link href="#promociones" className="text-[0.9rem] text-pearl/50 transition-all duration-300 hover:text-gold hover:pl-1.5 block">Promociones Activas</Link></li>
              <li><Link href="#uso" className="text-[0.9rem] text-pearl/50 transition-all duration-300 hover:text-gold hover:pl-1.5 block">Modos de Uso y Dosis</Link></li>
              <li><Link href="/tienda" className="text-[0.9rem] text-pearl/50 transition-all duration-300 hover:text-gold hover:pl-1.5 block font-medium flex items-center gap-2"><i className="fa-solid fa-bag-shopping text-xs"></i> Tienda Online</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-body text-[0.72rem] font-bold tracking-[0.15em] text-white/90 uppercase mb-4">Contacto Directo</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gold/[0.06] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-gold/15 transition-colors border border-gold/[0.08]">
                  <i className="fa-solid fa-location-dot text-gold/70 text-sm"></i>
                </div>
                <span className="text-[0.9rem] text-pearl/50 leading-[1.6]">Urdesa Central<br/>Bálsamo #913, Guayaquil, Ecuador</span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gold/[0.06] flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors border border-gold/[0.08]">
                  <i className="fa-brands fa-whatsapp text-gold/70 text-sm"></i>
                </div>
                <a href="https://wa.me/message/MYAWP2XPANQSH1" className="text-[0.9rem] text-pearl/50 transition-colors hover:text-gold">099 112 8230 - Soledad</a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gold/[0.06] flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors border border-gold/[0.08]">
                  <i className="fa-brands fa-whatsapp text-gold/70 text-sm"></i>
                </div>
                <a href="https://wa.me/message/CG6G5CVXSSSVO1" className="text-[0.9rem] text-pearl/50 transition-colors hover:text-gold">098 995 4925 - Gabriela</a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gold/[0.06] flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors border border-gold/[0.08]">
                  <i className="fa-regular fa-envelope text-gold/70 text-sm"></i>
                </div>
                <a href="mailto:ealindasal@hotmail.com" className="text-[0.9rem] text-pearl/50 transition-colors hover:text-gold">ealindasal@hotmail.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/[0.06] pt-6 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[0.8rem] text-pearl/40 font-body">
          <p>© {new Date().getFullYear()} Lindasal Ecuador. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">Desarrollado con <i className="fa-solid fa-heart text-red-500/70"></i> para tu bienestar</p>
        </div>
      </div>
    </footer>
  );
}
