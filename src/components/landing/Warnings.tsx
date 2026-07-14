import React from "react";

export default function Warnings() {
  return (
    <section className="py-16 px-[5%] bg-[#0d1e38] relative overflow-hidden" aria-label="Advertencias importantes">
      <div className="absolute inset-0 bg-gradient-to-b from-navy to-[#0d1e38] pointer-events-none"></div>
      
      <div className="max-w-[860px] mx-auto flex flex-col gap-5 relative z-10">
        <div className="flex items-start gap-5 bg-red-500/[0.04] backdrop-blur-md border border-red-500/10 rounded-[1.5rem] p-6 sm:p-8 hover:border-red-500/20 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-red-500/[0.08] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-500/15 transition-colors border border-red-500/10">
            <i className="fa-solid fa-triangle-exclamation text-lg text-red-400" aria-hidden="true"></i>
          </div>
          <p className="font-body text-[0.9rem] text-[#f5f0e8]/75 leading-[1.7] font-medium">
            <strong className="text-red-400/90 block text-[0.68rem] tracking-[0.15em] uppercase mb-1.5 font-bold">Advertencia</strong>
            Todas estas recomendaciones son para ser preparadas única y exclusivamente con productos de Lindasal.
          </p>
        </div>
        <div className="flex items-start gap-5 bg-red-500/[0.04] backdrop-blur-md border border-red-500/10 rounded-[1.5rem] p-6 sm:p-8 hover:border-red-500/20 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-red-500/[0.08] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-500/15 transition-colors border border-red-500/10">
            <i className="fa-solid fa-triangle-exclamation text-lg text-red-400" aria-hidden="true"></i>
          </div>
          <p className="font-body text-[0.9rem] text-[#f5f0e8]/75 leading-[1.7] font-medium">
            <strong className="text-red-400/90 block text-[0.68rem] tracking-[0.15em] uppercase mb-1.5 font-bold">Advertencia</strong>
            Las propiedades rehabilitadoras de Lindasal no son iguales a las de otras sales. No utilizar otra sal para estos modos de uso y preparaciones.
          </p>
        </div>
      </div>
    </section>
  );
}
