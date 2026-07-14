import React from "react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-28 px-[5%] bg-navy relative overflow-hidden" aria-labelledby="cta-title">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.08]" style={{ backgroundImage: "url('/images/WhatsApp Image 2026-04-08 at 1.33.12 PM.jpeg')" }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/90 to-navy/60"></div>
      
      {/* Ambient glow */}
      <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-gold/[0.05] rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] bg-teal/[0.04] rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-[800px] mx-auto text-center flex flex-col items-center">
        <span className="inline-block text-[0.7rem] font-bold tracking-[0.2em] uppercase text-gold/70 mb-5 bg-gold/[0.06] px-4 py-1.5 rounded-full border border-gold/10">Tu salud lo vale</span>
        
        <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-bold text-pearl leading-[1.08] mb-6 drop-shadow-xl tracking-tight" id="cta-title">
          ¿Listo para<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#e6c86a] to-teal">transformar tu salud?</span>
        </h2>
        
        <p className="font-body text-[1.1rem] text-pearl/70 leading-[1.8] mb-12 max-w-[600px] mx-auto font-medium">
          Pregúntanos cómo mejorar tu calidad de vida con nuestros productos. Te ayudamos con enfermedades como cáncer, diabetes, hipertensión y mucho más.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/message/MYAWP2XPANQSH1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full font-body font-bold text-[0.95rem] tracking-wide bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.25)] transition-all duration-500 transform hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(37,211,102,0.35)] group"
          >
            <i className="fa-brands fa-whatsapp text-lg group-hover:scale-110 transition-transform"></i> Soledad — 099 112 8230
          </a>
          <a
            href="https://wa.me/message/CG6G5CVXSSSVO1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full font-body font-bold text-[0.95rem] tracking-wide bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.25)] transition-all duration-500 transform hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(37,211,102,0.35)] group"
          >
            <i className="fa-brands fa-whatsapp text-lg group-hover:scale-110 transition-transform"></i> Gabriela — 098 995 4925
          </a>
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full font-body font-bold text-[0.95rem] tracking-wide bg-gradient-to-r from-gold via-[#d4b55a] to-gold-light text-navy shadow-[0_8px_30px_rgba(201,168,76,0.2)] transition-all duration-500 transform hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(201,168,76,0.35)] group"
          >
            <i className="fa-solid fa-bag-shopping group-hover:rotate-[-8deg] transition-transform"></i> Ir a la Tienda
          </Link>
        </div>
      </div>
    </section>
  );
}
