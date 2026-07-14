"use client";

import React, { useState } from "react";

const tabs = [
  { id: "isotonica", label: "Bebida Isotónica", icon: "fa-flask-vial" },
  { id: "energetica", label: "Bebida Energética", icon: "fa-bolt" },
  { id: "enjuague", label: "Enjuague Bucal", icon: "fa-teeth" },
  { id: "atm", label: "ATM / Aceite de Magnesio", icon: "fa-hand-dots" },
];

export default function Usage() {
  const [activeTab, setActiveTab] = useState("isotonica");

  return (
    <section id="uso" className="py-28 px-[5%] bg-[#f8f5f0] relative overflow-hidden" aria-labelledby="usage-title">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal/[0.03] rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-[1200px] mx-auto z-10 relative">
        <div className="text-center mb-16">
          <span className="inline-block text-[0.7rem] font-bold tracking-[0.2em] uppercase text-teal/80 mb-4 bg-teal/[0.06] px-4 py-1.5 rounded-full border border-teal/10">Instrucciones</span>
          <h2 className="font-heading font-bold text-[clamp(2rem,4vw,3.2rem)] text-navy leading-[1.15] mb-5" id="usage-title">
            Modos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#d4b55a] to-teal">Uso</span>
          </h2>
          <div className="w-16 h-[3px] bg-gradient-to-r from-gold to-teal mx-auto rounded-full mb-5"></div>
          <p className="font-body text-navy/60 max-w-[620px] mx-auto text-[1.05rem] leading-[1.8]">
            Instrucciones de preparación y uso para cada producto. Todos basados exclusivamente en productos Lindasal.
          </p>
        </div>

        {/* Tab switcher — segmented control */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap justify-center gap-1.5 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-2.5 rounded-xl font-body font-semibold text-[0.85rem] whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-navy text-pearl shadow-md"
                    : "text-navy/60 hover:bg-white hover:text-navy"
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                <i className={`fa-solid ${tab.icon} text-[0.7rem] ${activeTab === tab.id ? "text-gold" : "opacity-50"}`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-[900px] mx-auto relative min-h-[400px]">
          {/* BEBIDA ISOTÓNICA */}
          <div className={`transition-all duration-500 absolute w-full ${activeTab === 'isotonica' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 -z-10 pointer-events-none'}`}>
            <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="font-heading text-[1.7rem] font-bold text-navy mb-2">Bebida Isotónica Lindasal</h3>
              <p className="text-[0.9rem] text-navy/55 leading-[1.7] mb-8">
                Apta para cualquier persona con cualquier tipo de enfermedad: cáncer, diabetes, coronavirus, personas sanas. Potencia y balancea el sistema inmunológico.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-[#f8f5f0]/60 rounded-2xl p-6 border border-pearl-dark/30">
                  <p className="font-body text-[0.72rem] font-bold tracking-[0.15em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/[0.08] flex items-center justify-center"><i className="fa-solid fa-flask-vial text-gold text-[0.65rem]"></i></span> Preparación
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> Galón (4 L): 1 cucharada</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> 2 litros: ½ cucharada</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> Botella 6 L: 1½ cucharadas</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> Usar agua purificada</li>
                  </ul>
                </div>
                <div className="bg-[#f8f5f0]/60 rounded-2xl p-6 border border-pearl-dark/30">
                  <p className="font-body text-[0.72rem] font-bold tracking-[0.15em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/[0.08] flex items-center justify-center"><i className="fa-solid fa-clock text-gold text-[0.65rem]"></i></span> Frecuencia
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> <strong>Preventivo:</strong> cada 4 horas (mín. 3/día)</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> <strong>Tratamiento:</strong> cada 2 horas (mín. 6/día)</li>
                  </ul>
                </div>
                <div className="bg-[#f8f5f0]/60 rounded-2xl p-6 border border-pearl-dark/30 lg:col-span-1 sm:col-span-2">
                  <p className="font-body text-[0.72rem] font-bold tracking-[0.15em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/[0.08] flex items-center justify-center"><i className="fa-solid fa-child text-gold text-[0.65rem]"></i></span> Dosis por edad
                  </p>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                    {[
                      { age: "0 – 1 año", amt: "1 cdta" }, { age: "1 – 3 años", amt: "1 cda" },
                      { age: "3 – 6 años", amt: "3 ml" }, { age: "6 – 9 años", amt: "5 ml" },
                      { age: "9 – 12 años", amt: "20 ml" }, { age: "+12 años", amt: "30 ml" }
                    ].map(d => (
                      <div key={d.age} className="bg-gold/[0.06] rounded-lg pt-1.5 pb-1.5 px-3 flex justify-between items-center text-xs border border-gold/[0.08]">
                        <span className="font-semibold text-navy">{d.age}</span>
                        <span className="text-navy/50 text-right font-medium">{d.amt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BEBIDA ENERGÉTICA */}
          <div className={`transition-all duration-500 absolute w-full ${activeTab === 'energetica' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 -z-10 pointer-events-none'}`}>
            <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="font-heading text-[1.7rem] font-bold text-navy mb-2">Bebida Energética y Preventora</h3>
              <p className="text-[0.9rem] text-navy/55 leading-[1.7] mb-8">
                Balanceas el pH de la sangre, sube el sistema inmunológico, previene enfermedades e incrementa la energía.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-[#f8f5f0]/60 rounded-2xl p-6 border border-pearl-dark/30">
                  <p className="font-body text-[0.72rem] font-bold tracking-[0.15em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/[0.08] flex items-center justify-center"><i className="fa-solid fa-flask-vial text-gold text-[0.65rem]"></i></span> Preparación
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> 1 vaso de agua</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> Jugo de 1 limón</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> ½ cucharadita de Lindasal</li>
                  </ul>
                </div>
                <div className="bg-[#f8f5f0]/60 rounded-2xl p-6 border border-pearl-dark/30">
                  <p className="font-body text-[0.72rem] font-bold tracking-[0.15em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/[0.08] flex items-center justify-center"><i className="fa-solid fa-sun text-gold text-[0.65rem]"></i></span> Modo de Uso
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> Tomar 2 veces al día</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> 1ª vez: en ayunas</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> 2ª vez: antes de las 4 pm</li>
                  </ul>
                </div>
                <div className="bg-[#f8f5f0]/60 rounded-2xl p-6 border border-pearl-dark/30">
                  <p className="font-body text-[0.72rem] font-bold tracking-[0.15em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/[0.08] flex items-center justify-center"><i className="fa-solid fa-star text-gold text-[0.65rem]"></i></span> Beneficios
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> Energía todo el día</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> Refuerzo inmunológico</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> Balance pH estomacal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ENJUAGUE BUCAL */}
          <div className={`transition-all duration-500 absolute w-full ${activeTab === 'enjuague' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 -z-10 pointer-events-none'}`}>
            <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="font-heading text-[1.7rem] font-bold text-navy mb-2">Enjuague Bucal Antibacterial</h3>
              <p className="text-[0.9rem] text-navy/55 leading-[1.7] mb-8">
                Desinfectante natural para boca y garganta. Especialmente útil para prevenir infecciones.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-[#f8f5f0]/60 rounded-2xl p-6 border border-pearl-dark/30">
                  <p className="font-body text-[0.72rem] font-bold tracking-[0.15em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/[0.08] flex items-center justify-center"><i className="fa-solid fa-flask-vial text-gold text-[0.65rem]"></i></span> Preparación
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> 1 vaso de agua</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> 1 cucharadita de Lindasal</li>
                  </ul>
                </div>
                <div className="bg-[#f8f5f0]/60 rounded-2xl p-6 border border-pearl-dark/30">
                  <p className="font-body text-[0.72rem] font-bold tracking-[0.15em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/[0.08] flex items-center justify-center"><i className="fa-solid fa-clock text-gold text-[0.65rem]"></i></span> Modo de Uso
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> <strong>Prevención:</strong> gárgaras 3 veces/día</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> <strong>Infecciones:</strong> gárgaras 6 veces/día</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ATM */}
          <div className={`transition-all duration-500 absolute w-full ${activeTab === 'atm' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 -z-10 pointer-events-none'}`}>
            <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 md:p-10 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h3 className="font-heading text-[1.7rem] font-bold text-navy mb-2">ATM — Aceite de Magnesio</h3>
              <p className="text-[0.9rem] text-navy/55 leading-[1.7] mb-8">
                Aplicación tópica directa sobre la piel para absorción transdérmica del cloruro de magnesio.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-[#f8f5f0]/60 rounded-2xl p-6 border border-pearl-dark/30">
                  <p className="font-body text-[0.72rem] font-bold tracking-[0.15em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/[0.08] flex items-center justify-center"><i className="fa-solid fa-hand-dots text-gold text-[0.65rem]"></i></span> Aplicación
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> 10 gotas en axilas y bajo vientre</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> 5 gotas en cada planta del pie</li>
                    <li className="text-[0.87rem] text-navy/65 flex items-start gap-2"><span className="text-gold font-bold">·</span> En ganglios linfáticos</li>
                  </ul>
                </div>
                <div className="bg-[#f8f5f0]/60 rounded-2xl p-6 border border-pearl-dark/30">
                  <p className="font-body text-[0.72rem] font-bold tracking-[0.15em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-gold/[0.08] flex items-center justify-center"><i className="fa-solid fa-circle-info text-gold text-[0.65rem]"></i></span> Dato Importante
                  </p>
                  <p className="text-[0.87rem] text-navy/55 leading-[1.75]">
                    Más del <strong>80% de la población mundial</strong> carece de las dosis adecuadas de magnesio. El cloruro de magnesio cumple con más de <strong>350 funciones</strong> vitales.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
