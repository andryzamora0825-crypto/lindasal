import React from "react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 px-[5%] bg-navy relative overflow-hidden" aria-labelledby="cta-title">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: "url('/images/WhatsApp Image 2026-04-08 at 1.33.12 PM.jpeg')" }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/40"></div>
      
      <div className="relative z-10 max-w-[800px] mx-auto text-center flex flex-col items-center">
        <span className="font-body text-[0.8rem] font-bold tracking-[0.15em] uppercase text-gold mb-4 inline-block">Tu salud lo vale</span>
        
        <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-bold text-pearl leading-[1.1] mb-6 drop-shadow-xl" id="cta-title">
          ¿Listo para<br/>
          <span className="bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">transformar tu salud?</span>
        </h2>
        
        <p className="font-body text-[1.1rem] text-pearl/80 leading-[1.8] mb-10 max-w-[600px] mx-auto">
          Pregúntanos cómo mejorar tu calidad de vida con nuestros productos. Te ayudamos con enfermedades como cáncer, diabetes, hipertensión y mucho más.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://wa.me/message/MYAWP2XPANQSH1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-body font-semibold text-[0.95rem] tracking-wide bg-[#25D366] text-white shadow-[0_4px_15px_rgba(37,211,102,0.3)] transition-all transform hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(37,211,102,0.4)]">
            <i className="fa-brands fa-whatsapp"></i> Soledad — 099 112 8230
          </a>
          <a href="https://wa.me/message/CG6G5CVXSSSVO1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-body font-semibold text-[0.95rem] tracking-wide bg-[#25D366] text-white shadow-[0_4px_15px_rgba(37,211,102,0.3)] transition-all transform hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(37,211,102,0.4)]">
            <i className="fa-brands fa-whatsapp"></i> Gabriela — 098 995 4925
          </a>
          <Link href="/tienda" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-body font-semibold text-[0.95rem] tracking-wide bg-gradient-to-r from-gold to-gold-dark text-navy shadow-[0_4px_15px_rgba(201,168,76,0.3)] transition-all transform hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(201,168,76,0.4)]">
            <i className="fa-solid fa-bag-shopping"></i> Ir a la Tienda
          </Link>
        </div>
      </div>
    </section>
  );
}
