"use client";

import React, { useRef } from "react";

const benefitsData = [
  { icon: "fa-bone", title: "Fortalece los huesos" },
  { icon: "fa-shield-halved", title: "Aumenta el sistema inmunodefensivo" },
  { icon: "fa-lungs", title: "Mejora la función respiratoria y pulmonar" },
  { icon: "fa-bed", title: "Reduce el insomnio y mejora el sueño" },
  { icon: "fa-spa", title: "Reduce los niveles de estrés" },
  { icon: "fa-wand-magic-sparkles", title: "Combate los efectos del envejecimiento" },
  { icon: "fa-heart-pulse", title: "Protege la salud vascular y cardiovascular" },
  { icon: "fa-check", title: "Antiácido natural y anti flatulento" },
  { icon: "fa-flask", title: "Antioxidante — combate radicales libres" },
  { icon: "fa-utensils", title: "Estimula y fortalece el sistema digestivo" },
  { icon: "fa-droplet", title: "Incrementa la hemoglobina y forma glóbulos rojos" },
  { icon: "fa-fire", title: "Quema grasas — regula el metabolismo" },
  { icon: "fa-arrow-up-right-dots", title: "Alcaliniza el cuerpo y eleva el pH" },
  { icon: "fa-wind", title: "Combate el asma y despeja los pulmones" },
  { icon: "fa-dumbbell", title: "Alivia dolores musculares y calambres" },
  { icon: "fa-brain", title: "Combate la depresión y mejora el estado mental" },
  { icon: "fa-water", title: "Regula la retención de líquidos en el cuerpo" },
  { icon: "fa-heart", title: "Reduce la presión arterial y regula la circulación" },
  { icon: "fa-cubes", title: "Regula el azúcar en la célula" },
  { icon: "fa-bolt", title: "Aumenta tu energía sin cansancio" },
  { icon: "fa-arrows-spin", title: "Regeneración celular y vitalidad" },
];

export default function Benefits() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section id="beneficios" className="py-24 px-[5%] bg-pearl relative overflow-hidden" aria-labelledby="benefits-title">
      <div className="max-w-[1200px] mx-auto z-10 relative">
        <h2 className="font-heading font-bold text-center relative mb-4 text-[clamp(2rem,4vw,3.2rem)] text-navy leading-[1.15] after:content-[''] after:block after:w-[60px] after:h-[3px] after:bg-gradient-to-r after:from-gold after:to-teal after:my-3 after:mx-auto after:rounded-full" id="benefits-title">
          Por qué elegir <span className="bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">Lindasal</span>
        </h2>
        <p className="font-body text-center text-navy-light/60 max-w-[620px] mx-auto mb-16 text-[1.05rem] leading-[1.8]">
          Más que sal. Una aliada para tu salud y bienestar, avalada por la naturaleza. Todos los beneficios aplican a <strong>Lindasal, Nalleva y Aguademar Quinton</strong>.
        </p>

        <div className="relative max-w-[1200px] mx-auto md:px-14">
          <button
            onClick={scrollLeft}
            className="hidden md:flex absolute top-[40%] -translate-y-1/2 left-0 w-11 h-11 rounded-full bg-white border border-pearl-dark shadow-sm items-center justify-center text-navy text-lg cursor-pointer z-10 transition-all hover:bg-gold hover:text-navy hover:border-gold hover:shadow-md"
            aria-label="Anterior"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            onClick={scrollRight}
            className="hidden md:flex absolute top-[40%] -translate-y-1/2 right-0 w-11 h-11 rounded-full bg-white border border-pearl-dark shadow-sm items-center justify-center text-navy text-lg cursor-pointer z-10 transition-all hover:bg-gold hover:text-navy hover:border-gold hover:shadow-md"
            aria-label="Siguiente"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8"
            style={{ scrollbarWidth: 'none' }}
          >
            {benefitsData.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-[0.85rem] bg-white rounded-2xl p-4 md:p-5 border border-pearl-dark shadow-[0_2px_8px_rgba(10,22,40,0.04)] transition-all flex-[0_0_85%] md:flex-[0_0_calc(50%-0.75rem)] lg:flex-[0_0_calc(33.333%-1rem)] snap-start group hover:-translate-y-1 hover:border-gold/30 hover:shadow-md"
              >
                <span className="w-9 h-9 flex items-center justify-center rounded-md bg-teal/10 text-teal-dark text-[1.15rem] shrink-0 transition-all group-hover:bg-gold/20 group-hover:text-gold-dark group-hover:scale-110">
                  <i className={`fa-solid ${item.icon}`}></i>
                </span>
                <span className="text-[0.88rem] font-body text-navy font-medium leading-[1.45]">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 max-w-[800px] mx-auto rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(10,22,40,0.12)] border-[4px] border-white bg-black">
          <video 
            src="/entrevistaaenrique/WhatsApp Video 2026-04-19 at 10.46.39 PM (3).mp4"
            controls
            preload="metadata"
            className="w-full aspect-video object-contain"
            onPlay={(e) => {
              const allVideos = document.querySelectorAll("video");
              allVideos.forEach(vid => {
                if (vid !== e.currentTarget) vid.pause();
              });
            }}
          />
        </div>

        <p className="text-center mt-10 text-[0.85rem] text-navy-light/50 italic">
          Tu cuerpo te lo agradecerá. — <strong>@lindasalec</strong>
        </p>
      </div>
    </section>
  );
}
