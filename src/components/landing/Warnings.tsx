import React from "react";

export default function Warnings() {
  return (
    <section className="py-16 px-[5%] bg-[#0d1e38] relative" aria-label="Advertencias importantes">
      <div className="max-w-[860px] mx-auto flex flex-col gap-4">
        <div className="flex items-start gap-5 bg-red-500/5 border border-red-500/20 rounded-2xl p-6 sm:p-8">
          <i className="fa-solid fa-triangle-exclamation text-2xl text-red-400 shrink-0 mt-0.5" aria-hidden="true"></i>
          <p className="font-body text-[0.9rem] text-[#f5f0e8]/80 leading-[1.7] font-medium">
            <strong className="text-red-300 block text-[0.72rem] tracking-[0.12em] uppercase mb-1.5">Advertencia</strong>
            Todas estas recomendaciones son para ser preparadas única y exclusivamente con productos de Lindasal.
          </p>
        </div>
        <div className="flex items-start gap-5 bg-red-500/5 border border-red-500/20 rounded-2xl p-6 sm:p-8">
          <i className="fa-solid fa-triangle-exclamation text-2xl text-red-400 shrink-0 mt-0.5" aria-hidden="true"></i>
          <p className="font-body text-[0.9rem] text-[#f5f0e8]/80 leading-[1.7] font-medium">
            <strong className="text-red-300 block text-[0.72rem] tracking-[0.12em] uppercase mb-1.5">Advertencia</strong>
            Las propiedades rehabilitadoras de Lindasal no son iguales a las de otras sales. No utilizar otra sal para estos modos de uso y preparaciones.
          </p>
        </div>
      </div>
    </section>
  );
}
