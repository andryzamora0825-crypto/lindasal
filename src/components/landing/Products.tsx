import React from "react";

export default function Products() {
  return (
    <section id="productos" className="py-24 px-[5%] bg-pearl relative overflow-hidden" aria-labelledby="products-title">
      <div className="max-w-[1200px] mx-auto z-10 relative">
        <h2 className="font-heading font-bold text-center relative mb-4 text-[clamp(2rem,4vw,3.2rem)] text-navy leading-[1.15] after:content-[''] after:block after:w-[60px] after:h-[3px] after:bg-gradient-to-r after:from-gold after:to-teal after:my-3 after:mx-auto after:rounded-full" id="products-title">
          Nuestros <span className="bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">Productos</span>
        </h2>
        <p className="font-body text-center text-navy-light/60 max-w-[620px] mx-auto mb-16 text-[1.05rem] leading-[1.8]">
          Tres líneas orgánicas 100% naturales. Fabricados en Ecuador con ingredientes de fuentes puras: sal marina virgen, agua de mar y cloruro de magnesio.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* LINDASAL */}
          <article className="bg-white rounded-3xl p-8 border border-transparent shadow-sm transition-all hover:-translate-y-2.5 hover:border-gold/35 hover:shadow-[0_20px_48px_rgba(10,22,40,0.18),0_4px_20px_rgba(201,168,76,0.35)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-teal"></div>
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/10 to-teal/10 border border-gold/25 flex items-center justify-center mb-6">
              <i className="fa-solid fa-mountain-sun text-[1.7rem] bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent"></i>
            </div>
            <p className="font-body text-[0.68rem] font-bold tracking-[0.14em] uppercase text-gold mb-1">Lindasal</p>
            <h3 className="font-heading text-2xl font-semibold text-navy mb-2 leading-[1.2]">Sal Marina Gourmet</h3>
            <p className="text-[0.9rem] text-navy-light/60 leading-[1.75] mb-6">
              Sal marina virgen extraída artesanalmente. Contiene <strong>40% menos cloruro de sodio</strong> que la sal común y <strong>60% de minerales naturales</strong>: potasio, calcio, magnesio, borato, sulfato, hierro, fluoruro, bromuro y más.
            </p>
            <ul className="flex flex-col gap-2 mb-6">
              <li className="text-[0.84rem] text-navy-light/70 flex items-start gap-2"><i className="fa-solid fa-check text-teal text-xs mt-1 shrink-0"></i> Sal Gourmet 500 g y 227 g</li>
              <li className="text-[0.84rem] text-navy-light/70 flex items-start gap-2"><i className="fa-solid fa-check text-teal text-xs mt-1 shrink-0"></i> Sal Ahumada funda 227 g</li>
              <li className="text-[0.84rem] text-navy-light/70 flex items-start gap-2"><i className="fa-solid fa-check text-teal text-xs mt-1 shrink-0"></i> Sal Parrillera</li>
              <li className="text-[0.84rem] text-navy-light/70 flex items-start gap-2"><i className="fa-solid fa-check text-teal text-xs mt-1 shrink-0"></i> Sal con Especias</li>
            </ul>
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[0.7rem] font-semibold tracking-wider uppercase bg-teal/10 text-teal-dark border border-teal/30">
              <i className="fa-solid fa-leaf"></i> 100% Orgánica · Sin aditivos
            </span>
          </article>

          {/* NALLEVA */}
          <article className="bg-white rounded-3xl p-8 border border-transparent shadow-sm transition-all hover:-translate-y-2.5 hover:border-gold/35 hover:shadow-[0_20px_48px_rgba(10,22,40,0.18),0_4px_20px_rgba(201,168,76,0.35)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-teal"></div>
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/10 to-teal/10 border border-gold/25 flex items-center justify-center mb-6">
              <i className="fa-solid fa-spa text-[1.7rem] bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent"></i>
            </div>
            <p className="font-body text-[0.68rem] font-bold tracking-[0.14em] uppercase text-gold mb-1">Nalleva Skincare</p>
            <h3 className="font-heading text-2xl font-semibold text-navy mb-2 leading-[1.2]">Cuidado Personal</h3>
            <p className="text-[0.9rem] text-navy-light/60 leading-[1.75] mb-6">
              Línea de cuidado personal a base de sal marina y minerales naturales. Formulada para potenciar tu piel y bienestar con ingredientes 100% orgánicos.
            </p>
            <ul className="flex flex-col gap-2 mb-6">
              <li className="text-[0.84rem] text-navy-light/70 flex items-start gap-2"><i className="fa-solid fa-check text-teal text-xs mt-1 shrink-0"></i> Jabón Íntimo natural</li>
              <li className="text-[0.84rem] text-navy-light/70 flex items-start gap-2"><i className="fa-solid fa-check text-teal text-xs mt-1 shrink-0"></i> Derma Tonificador</li>
              <li className="text-[0.84rem] text-navy-light/70 flex items-start gap-2"><i className="fa-solid fa-check text-teal text-xs mt-1 shrink-0"></i> Previene el envejecimiento prematuro</li>
              <li className="text-[0.84rem] text-navy-light/70 flex items-start gap-2"><i className="fa-solid fa-check text-teal text-xs mt-1 shrink-0"></i> Promueve la regeneración celular</li>
            </ul>
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[0.7rem] font-semibold tracking-wider uppercase bg-teal/10 text-teal-dark border border-teal/30">
              <i className="fa-solid fa-heart"></i> Cuidado Natural
            </span>
          </article>

          {/* AGUADEMAR QUINTON */}
          <article className="bg-white rounded-3xl p-8 border border-transparent shadow-sm transition-all hover:-translate-y-2.5 hover:border-gold/35 hover:shadow-[0_20px_48px_rgba(10,22,40,0.18),0_4px_20px_rgba(201,168,76,0.35)] relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-teal"></div>
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/10 to-teal/10 border border-gold/25 flex items-center justify-center mb-6">
              <i className="fa-solid fa-droplet text-[1.7rem] bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent"></i>
            </div>
            <p className="font-body text-[0.68rem] font-bold tracking-[0.14em] uppercase text-gold mb-1">Aguademar Quinton</p>
            <h3 className="font-heading text-2xl font-semibold text-navy mb-2 leading-[1.2]">Suplemento Rico en Minerales</h3>
            <p className="text-[0.9rem] text-navy-light/60 leading-[1.75] mb-6">
              Agua de mar hipertónica e isotónica rica en electrolitos. El complemento dietético ideal para regular el balance celular de tu cuerpo al instante.
            </p>
            <ul className="flex flex-col gap-2 mb-6">
              <li className="text-[0.84rem] text-navy-light/70 flex items-start gap-2"><i className="fa-solid fa-check text-teal text-xs mt-1 shrink-0"></i> Terapéutica 1000ml (Hipertónica)</li>
              <li className="text-[0.84rem] text-navy-light/70 flex items-start gap-2"><i className="fa-solid fa-check text-teal text-xs mt-1 shrink-0"></i> Rehidratante 1000ml (Isotónica)</li>
              <li className="text-[0.84rem] text-navy-light/70 flex items-start gap-2"><i className="fa-solid fa-check text-teal text-xs mt-1 shrink-0"></i> Rehidrata activamente las células</li>
              <li className="text-[0.84rem] text-navy-light/70 flex items-start gap-2"><i className="fa-solid fa-check text-teal text-xs mt-1 shrink-0"></i> Restaura el nivel de plasma</li>
            </ul>
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[0.7rem] font-semibold tracking-wider uppercase bg-teal/10 text-teal-dark border border-teal/30">
              <i className="fa-solid fa-bolt"></i> Máxima Energía
            </span>
          </article>

        </div>
      </div>
    </section>
  );
}
