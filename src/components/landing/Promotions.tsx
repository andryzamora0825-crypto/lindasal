import React from "react";

export default function Promotions() {
  return (
    <section id="promociones" className="py-24 px-[5%] bg-navy relative overflow-hidden" aria-labelledby="promotions-title">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 55%), radial-gradient(ellipse at 80% 30%, rgba(126,202,195,0.06) 0%, transparent 55%)"
      }}></div>
      
      <div className="container relative z-10 mx-auto max-w-[1200px]">
        <h2 className="font-heading font-bold text-center relative mb-4 text-[clamp(2rem,4vw,3.2rem)] text-pearl leading-[1.15] after:content-[''] after:block after:w-[60px] after:h-[3px] after:bg-gradient-to-r after:from-gold after:to-teal after:my-3 after:mx-auto after:rounded-full" id="promotions-title">
          Promociones <span className="bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">Especiales</span>
        </h2>
        <p className="font-body text-center text-pearl/60 max-w-[620px] mx-auto mb-16 text-[1.05rem] leading-[1.8]">
          Aprovecha nuestras ofertas. Pregunta disponibilidad y vigencia escribiéndonos directamente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">

          {/* COMBO SALUDABLE */}
          <article className="bg-[#0b172a] border border-white/5 rounded-3xl p-8 relative overflow-hidden transition-all hover:-translate-y-2 hover:border-gold/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_20px_rgba(201,168,76,0.15)]">
            <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[0.68rem] font-bold tracking-[0.1em] uppercase mb-6 bg-red-500/10 text-red-400 border border-red-500/30">
              <i className="fa-solid fa-fire"></i> Hasta agotar stock
            </div>
            <h3 className="font-heading text-[1.7rem] font-bold text-pearl mb-2 leading-[1.2]">Combo Saludable</h3>
            <div className="font-heading text-[2.8rem] font-bold bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent leading-none mb-4">$20</div>
            <p className="text-[0.88rem] text-pearl/60 leading-[1.75] mb-8">
              1 litro de Solución Hipertónica Aguademar Quinton. El combo ideal para potenciar tu sistema inmunológico y revitalizar tu organismo.
            </p>
            <ul className="flex flex-col gap-2 mb-8">
              <li className="text-[0.85rem] text-pearl/80 flex items-start gap-2"><i className="fa-solid fa-check-circle text-gold mt-1 shrink-0"></i> 1 L Solución Hipertónica Aguademar Quinton</li>
              <li className="text-[0.85rem] text-pearl/80 flex items-start gap-2"><i className="fa-solid fa-check-circle text-gold mt-1 shrink-0"></i> Efecto revitalizador y mineralizante</li>
              <li className="text-[0.85rem] text-pearl/80 flex items-start gap-2"><i className="fa-solid fa-check-circle text-gold mt-1 shrink-0"></i> Entrega a domicilio disponible</li>
            </ul>
            <a href="https://wa.me/message/MYAWP2XPANQSH1" target="_blank" rel="noopener noreferrer" className="mt-auto block w-full py-3 text-center rounded-xl bg-white/5 border border-white/10 text-pearl font-semibold tracking-wide transition-all hover:bg-white/10">
              <i className="fa-brands fa-whatsapp"></i> Pedir ahora
            </a>
          </article>

          {/* 4 + 1 GRATIS */}
          <article className="bg-[#0b172a] border border-white/5 rounded-3xl p-8 relative overflow-hidden transition-all hover:-translate-y-2 hover:border-gold/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_20px_rgba(201,168,76,0.15)]">
            <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[0.68rem] font-bold tracking-[0.1em] uppercase mb-6 bg-gold/10 text-gold border border-gold/30">
              <i className="fa-solid fa-gift"></i> Oferta Semanal
            </div>
            <h3 className="font-heading text-[1.7rem] font-bold text-pearl mb-2 leading-[1.2]">Compra 4,<br/>llévate el 5° Gratis</h3>
            <div className="font-heading text-[2.8rem] font-bold bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent leading-none mb-4">4 + 1</div>
            <p className="text-[0.88rem] text-pearl/60 leading-[1.75] mb-8">
              Compra 4 productos de cualquiera de nuestras marcas y llévate el 5° gratis. Puedes mezclar las líneas siempre que sean del mismo valor.
            </p>
            <ul className="flex flex-col gap-2 mb-8">
              <li className="text-[0.85rem] text-pearl/80 flex items-start gap-2"><i className="fa-solid fa-check-circle text-gold mt-1 shrink-0"></i> Válido para Lindasal, Nalleva y Quinton</li>
              <li className="text-[0.85rem] text-pearl/80 flex items-start gap-2"><i className="fa-solid fa-check-circle text-gold mt-1 shrink-0"></i> Puedes mezclar marcas del mismo valor</li>
              <li className="text-[0.85rem] text-pearl/80 flex items-start gap-2"><i className="fa-solid fa-check-circle text-gold mt-1 shrink-0"></i> Pregunta vigencia por WhatsApp</li>
            </ul>
            <a href="https://wa.me/message/CG6G5CVXSSSVO1" target="_blank" rel="noopener noreferrer" className="mt-auto block w-full py-3 text-center rounded-xl bg-white/5 border border-white/10 text-pearl font-semibold tracking-wide transition-all hover:bg-white/10">
              <i className="fa-brands fa-whatsapp"></i> Consultar
            </a>
          </article>

          {/* BLACK FRIDAY */}
          <article className="bg-[#0b172a] border border-white/5 rounded-3xl p-8 relative overflow-hidden transition-all hover:-translate-y-2 hover:border-gold/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_20px_rgba(201,168,76,0.15)]">
            <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[0.68rem] font-bold tracking-[0.1em] uppercase mb-6 bg-teal/10 text-teal border border-teal/30">
              <i className="fa-solid fa-tag"></i> Descuento Especial
            </div>
            <h3 className="font-heading text-[1.7rem] font-bold text-pearl mb-2 leading-[1.2]">20% de Descuento</h3>
            <div className="font-heading text-[2.8rem] font-bold bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent leading-none mb-4">−20%</div>
            <p className="text-[0.88rem] text-pearl/60 leading-[1.75] mb-8">
              Todos los productos de Lindasal, Nalleva y Aguademar Quinton con 20% de descuento. Ejemplo: Sal Gourmet 500 g pasa de $5.00 a <strong className="text-teal">$4.00</strong>.
            </p>
            <ul className="flex flex-col gap-2 mb-8">
              <li className="text-[0.85rem] text-pearl/80 flex items-start gap-2"><i className="fa-solid fa-check-circle text-gold mt-1 shrink-0"></i> Toda la línea Lindasal</li>
              <li className="text-[0.85rem] text-pearl/80 flex items-start gap-2"><i className="fa-solid fa-check-circle text-gold mt-1 shrink-0"></i> Toda la línea Nalleva Skincare</li>
              <li className="text-[0.85rem] text-pearl/80 flex items-start gap-2"><i className="fa-solid fa-check-circle text-gold mt-1 shrink-0"></i> Aguademar Quinton</li>
            </ul>
            <a href="https://wa.me/message/MYAWP2XPANQSH1" target="_blank" rel="noopener noreferrer" className="mt-auto block w-full py-3 text-center rounded-xl bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold tracking-wide transition-all hover:shadow-[0_4px_15px_rgba(201,168,76,0.3)]">
              <i className="fa-brands fa-whatsapp"></i> Aprovechar oferta
            </a>
          </article>

        </div>
      </div>
    </section>
  );
}
