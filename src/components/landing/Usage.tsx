"use client";

import React, { useState } from "react";

export default function Usage() {
  const [activeTab, setActiveTab] = useState("isotonica");

  return (
    <section id="uso" className="py-24 px-[5%] bg-pearl relative overflow-hidden" aria-labelledby="usage-title">
      <div className="max-w-[1200px] mx-auto z-10 relative">
        <h2 className="font-heading font-bold text-center relative mb-4 text-[clamp(2rem,4vw,3.2rem)] text-navy leading-[1.15] after:content-[''] after:block after:w-[60px] after:h-[3px] after:bg-gradient-to-r after:from-gold after:to-teal after:my-3 after:mx-auto after:rounded-full" id="usage-title">
          Modos de <span className="bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">Uso</span>
        </h2>
        <p className="font-body text-center text-navy-light/60 max-w-[620px] mx-auto mb-16 text-[1.05rem] leading-[1.8]">
          Instrucciones de preparación y uso para cada producto. Todos basados exclusivamente en productos Lindasal.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-[800px] mx-auto pb-4 border-b border-pearl-dark overflow-x-auto" role="tablist">
          {[
            { id: "isotonica", label: "Bebida Isotónica" },
            { id: "energetica", label: "Bebida Energética" },
            { id: "enjuague", label: "Enjuague Bucal" },
            { id: "atm", label: "ATM / Aceite de Magnesio" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full font-body font-semibold text-[0.88rem] whitespace-nowrap transition-all duration-300 border ${
                activeTab === tab.id
                  ? "bg-navy border-navy text-pearl"
                  : "bg-transparent border-pearl-dark text-navy/70 hover:bg-white hover:text-navy hover:border-gold/40"
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-w-[900px] mx-auto relative min-h-[400px]">
          {/* BEBIDA ISOTÓNICA */}
          <div className={`transition-all duration-500 absolute w-full ${activeTab === 'isotonica' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 -z-10 pointer-events-none'}`}>
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-pearl-dark shadow-sm">
              <h3 className="font-heading text-[1.7rem] font-semibold text-navy mb-2">Bebida Isotónica Lindasal</h3>
              <p className="text-[0.9rem] text-navy-light/60 leading-[1.7] mb-8">
                Apta para cualquier persona con cualquier tipo de enfermedad: cáncer, diabetes, coronavirus, personas sanas. Potencia y balancea el sistema inmunológico.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-pearl/30 rounded-2xl p-6 border border-pearl-dark/50">
                  <p className="font-body text-[0.75rem] font-bold tracking-[0.12em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-flask-vial text-gold"></i> Preparación
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> Galón (4 L): 1 cucharada</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> 2 litros: ½ cucharada</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> Botella 6 L: 1½ cucharadas</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> Usar agua purificada</li>
                  </ul>
                </div>
                <div className="bg-pearl/30 rounded-2xl p-6 border border-pearl-dark/50">
                  <p className="font-body text-[0.75rem] font-bold tracking-[0.12em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-clock text-gold"></i> Frecuencia
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> <strong>Preventivo:</strong> cada 4 horas (mín. 3/día)</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> <strong>Tratamiento:</strong> cada 2 horas (mín. 6/día)</li>
                  </ul>
                </div>
                <div className="bg-pearl/30 rounded-2xl p-6 border border-pearl-dark/50 lg:col-span-1 sm:col-span-2">
                  <p className="font-body text-[0.75rem] font-bold tracking-[0.12em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-child text-gold"></i> Dosis por edad
                  </p>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                    {[
                      { age: "0 – 1 año", amt: "1 cdta" }, { age: "1 – 3 años", amt: "1 cda" },
                      { age: "3 – 6 años", amt: "3 ml" }, { age: "6 – 9 años", amt: "5 ml" },
                      { age: "9 – 12 años", amt: "20 ml" }, { age: "+12 años", amt: "30 ml" }
                    ].map(d => (
                      <div key={d.age} className="bg-gold/10 rounded pt-1 pb-1 px-3 flex justify-between items-center text-xs">
                        <span className="font-semibold text-navy">{d.age}</span>
                        <span className="text-navy-light/60 text-right">{d.amt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BEBIDA ENERGÉTICA */}
          <div className={`transition-all duration-500 absolute w-full ${activeTab === 'energetica' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 -z-10 pointer-events-none'}`}>
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-pearl-dark shadow-sm">
              <h3 className="font-heading text-[1.7rem] font-semibold text-navy mb-2">Bebida Energética y Preventora</h3>
              <p className="text-[0.9rem] text-navy-light/60 leading-[1.7] mb-8">
                Balanceas el pH de la sangre, sube el sistema inmunológico, previene enfermedades e incrementa la energía.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-pearl/30 rounded-2xl p-6 border border-pearl-dark/50">
                  <p className="font-body text-[0.75rem] font-bold tracking-[0.12em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-flask-vial text-gold"></i> Preparación
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> 1 vaso de agua</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> Jugo de 1 limón</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> ½ cucharadita de Lindasal</li>
                  </ul>
                </div>
                <div className="bg-pearl/30 rounded-2xl p-6 border border-pearl-dark/50">
                  <p className="font-body text-[0.75rem] font-bold tracking-[0.12em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-sun text-gold"></i> Modo de Uso
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> Tomar 2 veces al día</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> 1ª vez: en ayunas</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> 2ª vez: antes de las 4 pm</li>
                  </ul>
                </div>
                <div className="bg-pearl/30 rounded-2xl p-6 border border-pearl-dark/50">
                  <p className="font-body text-[0.75rem] font-bold tracking-[0.12em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-star text-gold"></i> Beneficios
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> Energía todo el día</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> Refuerzo inmunológico</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> Balance pH estomacal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ENJUAGUE BUCAL */}
          <div className={`transition-all duration-500 absolute w-full ${activeTab === 'enjuague' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 -z-10 pointer-events-none'}`}>
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-pearl-dark shadow-sm">
              <h3 className="font-heading text-[1.7rem] font-semibold text-navy mb-2">Enjuague Bucal Antibacterial</h3>
              <p className="text-[0.9rem] text-navy-light/60 leading-[1.7] mb-8">
                Desinfectante natural para boca y garganta. Especialmente útil para prevenir infecciones.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-pearl/30 rounded-2xl p-6 border border-pearl-dark/50">
                  <p className="font-body text-[0.75rem] font-bold tracking-[0.12em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-flask-vial text-gold"></i> Preparación
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> 1 vaso de agua</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> 1 cucharadita de Lindasal</li>
                  </ul>
                </div>
                <div className="bg-pearl/30 rounded-2xl p-6 border border-pearl-dark/50">
                  <p className="font-body text-[0.75rem] font-bold tracking-[0.12em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-clock text-gold"></i> Modo de Uso
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> <strong>Prevención:</strong> gárgaras 3 veces/día</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> <strong>Infecciones:</strong> gárgaras 6 veces/día</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ATM */}
          <div className={`transition-all duration-500 absolute w-full ${activeTab === 'atm' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 -z-10 pointer-events-none'}`}>
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-pearl-dark shadow-sm">
              <h3 className="font-heading text-[1.7rem] font-semibold text-navy mb-2">ATM — Aceite de Magnesio</h3>
              <p className="text-[0.9rem] text-navy-light/60 leading-[1.7] mb-8">
                Aplicación tópica directa sobre la piel para absorción transdérmica del cloruro de magnesio.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-pearl/30 rounded-2xl p-6 border border-pearl-dark/50">
                  <p className="font-body text-[0.75rem] font-bold tracking-[0.12em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-hand-dots text-gold"></i> Aplicación
                  </p>
                  <ul className="flex flex-col gap-2">
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> 10 gotas en axilas y bajo vientre</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> 5 gotas en cada planta del pie</li>
                    <li className="text-[0.87rem] text-navy-light/70 flex items-start gap-2"><span className="text-gold font-bold">·</span> En ganglios linfáticos</li>
                  </ul>
                </div>
                <div className="bg-pearl/30 rounded-2xl p-6 border border-pearl-dark/50">
                  <p className="font-body text-[0.75rem] font-bold tracking-[0.12em] uppercase text-gold-dark mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-circle-info text-gold"></i> Dato Importante
                  </p>
                  <p className="text-[0.87rem] text-navy-light/60 leading-[1.75]">
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
