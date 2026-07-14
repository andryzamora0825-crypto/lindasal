import React from "react";

const promos = [
  {
    badge: { icon: "fa-fire", text: "Hasta agotar stock", color: "bg-red-500/[0.08] text-red-400 border-red-500/20" },
    title: "Combo Saludable",
    price: "$20",
    description: "1 litro de Solución Hipertónica Aguademar Quinton. El combo ideal para potenciar tu sistema inmunológico y revitalizar tu organismo.",
    features: [
      "1 L Solución Hipertónica Aguademar Quinton",
      "Efecto revitalizador y mineralizante",
      "Entrega a domicilio disponible",
    ],
    link: "https://wa.me/message/MYAWP2XPANQSH1",
    btnText: "Pedir ahora",
    highlight: false,
  },
  {
    badge: { icon: "fa-gift", text: "Oferta Semanal", color: "bg-gold/[0.08] text-gold border-gold/20" },
    title: <>Compra 4,<br/>llévate el 5° Gratis</>,
    price: "4 + 1",
    description: "Compra 4 productos de cualquiera de nuestras marcas y llévate el 5° gratis. Puedes mezclar las líneas siempre que sean del mismo valor.",
    features: [
      "Válido para Lindasal, Nalleva y Quinton",
      "Puedes mezclar marcas del mismo valor",
      "Pregunta vigencia por WhatsApp",
    ],
    link: "https://wa.me/message/CG6G5CVXSSSVO1",
    btnText: "Consultar",
    highlight: false,
  },
  {
    badge: { icon: "fa-tag", text: "Descuento Especial", color: "bg-teal/[0.08] text-teal border-teal/20" },
    title: "20% de Descuento",
    price: "−20%",
    description: <>Todos los productos de Lindasal, Nalleva y Aguademar Quinton con 20% de descuento. Ejemplo: Sal Gourmet 500 g pasa de $5.00 a <strong className="text-teal">$4.00</strong>.</>,
    features: [
      "Toda la línea Lindasal",
      "Toda la línea Nalleva Skincare",
      "Aguademar Quinton",
    ],
    link: "https://wa.me/message/MYAWP2XPANQSH1",
    btnText: "Aprovechar oferta",
    highlight: true,
  },
];

export default function Promotions() {
  return (
    <section id="promociones" className="py-28 px-[5%] bg-navy relative overflow-hidden" aria-labelledby="promotions-title">
      {/* Ambient glow */}
      <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-gold/[0.04] rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-teal/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="container relative z-10 mx-auto max-w-[1200px]">
        <div className="text-center mb-16">
          <span className="inline-block text-[0.7rem] font-bold tracking-[0.2em] uppercase text-gold/70 mb-4 bg-gold/[0.06] px-4 py-1.5 rounded-full border border-gold/10">Ofertas</span>
          <h2 className="font-heading font-bold text-[clamp(2rem,4vw,3.2rem)] text-pearl leading-[1.15] mb-5" id="promotions-title">
            Promociones <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#e6c86a] to-teal">Especiales</span>
          </h2>
          <div className="w-16 h-[3px] bg-gradient-to-r from-gold to-teal mx-auto rounded-full mb-5"></div>
          <p className="font-body text-pearl/55 max-w-[620px] mx-auto text-[1.05rem] leading-[1.8]">
            Aprovecha nuestras ofertas. Pregunta disponibilidad y vigencia escribiéndonos directamente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((promo, idx) => (
            <article
              key={idx}
              className={`rounded-[2rem] p-8 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col ${
                promo.highlight
                  ? "bg-gradient-to-br from-[#0f1f38] to-[#0a1628] border border-gold/15 hover:border-gold/30 hover:shadow-[0_20px_60px_rgba(201,168,76,0.12)]"
                  : "bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-white/10 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
              }`}
            >
              {/* Highlight glow */}
              {promo.highlight && (
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gold/[0.06] rounded-full blur-[80px] pointer-events-none"></div>
              )}
              
              <div className={`inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full text-[0.68rem] font-bold tracking-[0.12em] uppercase mb-6 border self-start ${promo.badge.color}`}>
                <i className={`fa-solid ${promo.badge.icon}`}></i> {promo.badge.text}
              </div>
              
              <h3 className="font-heading text-[1.7rem] font-bold text-pearl mb-3 leading-[1.2]">{promo.title}</h3>
              
              <div className="font-heading text-[3rem] font-black bg-gradient-to-r from-gold via-[#e6c86a] to-teal bg-clip-text text-transparent leading-none mb-5">{promo.price}</div>
              
              <p className="text-[0.88rem] text-pearl/55 leading-[1.75] mb-8">{promo.description}</p>
              
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {promo.features.map((feat, i) => (
                  <li key={i} className="text-[0.85rem] text-pearl/75 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-gold/[0.08] flex items-center justify-center shrink-0 mt-0.5 border border-gold/10">
                      <i className="fa-solid fa-check text-gold text-[0.55rem]"></i>
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
              
              <a
                href={promo.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-3.5 text-center rounded-xl font-bold tracking-wide transition-all duration-500 ${
                  promo.highlight
                    ? "bg-gradient-to-r from-gold to-[#d4b55a] text-navy shadow-[0_8px_25px_rgba(201,168,76,0.2)] hover:shadow-[0_12px_35px_rgba(201,168,76,0.35)] hover:-translate-y-0.5"
                    : "bg-white/[0.04] border border-white/[0.08] text-pearl hover:bg-white/[0.08] hover:border-white/15"
                }`}
              >
                <i className="fa-brands fa-whatsapp mr-1.5"></i> {promo.btnText}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
