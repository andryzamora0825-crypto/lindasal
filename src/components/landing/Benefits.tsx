"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const featured = [
  {
    n: "01",
    icon: "fa-heart-pulse",
    title: "Cardio-protección",
    body: "Regula la presión arterial, fortalece el sistema vascular y favorece una circulación equilibrada.",
  },
  {
    n: "02",
    icon: "fa-bolt",
    title: "Energía celular",
    body: "Restaura electrolitos esenciales y eleva tu vitalidad sin estimulantes ni efectos secundarios.",
  },
  {
    n: "03",
    icon: "fa-brain",
    title: "Claridad mental",
    body: "Combate la fatiga, equilibra el ánimo y favorece un descanso profundo y reparador.",
  },
];

const supporting = [
  { icon: "fa-bone", title: "Fortalece los huesos" },
  { icon: "fa-shield-halved", title: "Refuerza el sistema inmune" },
  { icon: "fa-lungs", title: "Mejora la función pulmonar" },
  { icon: "fa-bed", title: "Reduce el insomnio" },
  { icon: "fa-spa", title: "Disminuye el estrés" },
  { icon: "fa-wand-magic-sparkles", title: "Combate el envejecimiento" },
  { icon: "fa-check", title: "Antiácido natural" },
  { icon: "fa-flask", title: "Antioxidante celular" },
  { icon: "fa-utensils", title: "Estimula la digestión" },
  { icon: "fa-droplet", title: "Forma glóbulos rojos" },
  { icon: "fa-fire", title: "Regula el metabolismo" },
  { icon: "fa-arrow-up-right-dots", title: "Alcaliniza el cuerpo" },
  { icon: "fa-wind", title: "Despeja vías respiratorias" },
  { icon: "fa-dumbbell", title: "Alivia calambres musculares" },
  { icon: "fa-water", title: "Equilibra los líquidos" },
  { icon: "fa-cubes", title: "Regula glucosa celular" },
  { icon: "fa-arrows-spin", title: "Regeneración celular" },
  { icon: "fa-heart", title: "Protege el corazón" },
];

export default function Benefits() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (!e.isIntersecting && !video.paused) video.pause(); }),
      { threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="beneficios"
      className="relative bg-bone py-28 md:py-36 overflow-hidden"
      aria-labelledby="benefits-title"
    >
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-teal/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-gold/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-y-10 md:gap-x-10 mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-7"
          >
            <span className="eyebrow">Beneficios</span>
            <h2
              id="benefits-title"
              className="mt-6 font-display text-display-lg text-navy"
            >
              Más que sal.{" "}
              <em className="font-light text-navy/65">Una herencia para tu salud.</em>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-5 md:pt-10 flex"
          >
            <p className="font-body text-navy/60 text-[1.02rem] leading-[1.85] max-w-md md:ml-auto">
              Veintiuna razones por las que el mar guarda el secreto de la vida —
              ahora respaldadas por <strong className="text-navy">Lindasal</strong>,{" "}
              <strong className="text-navy">Nalleva</strong> y{" "}
              <strong className="text-navy">Aguademar Quinton</strong>.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-20">
          {featured.map((item, i) => (
            <motion.article
              key={item.n}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-12 md:col-span-4 group"
            >
              <div className="relative h-full bg-white rounded-[1.75rem] p-8 md:p-10 border border-navy/[0.06] overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_24px_60px_-20px_rgba(10,22,40,0.18)] hover:border-gold/30">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex items-start justify-between">
                  <span className="font-heading text-7xl md:text-8xl text-navy/[0.08] font-light leading-none select-none">
                    {item.n}
                  </span>
                  <i className={`fa-solid ${item.icon} text-2xl text-gold/80`} aria-hidden="true" />
                </div>

                <h3 className="mt-6 font-heading text-2xl md:text-3xl text-navy leading-[1.15]">
                  {item.title}
                </h3>
                <p className="mt-4 font-body text-navy/60 text-[0.95rem] leading-[1.75]">
                  {item.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-y-10 md:gap-x-10 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-3"
          >
            <span className="eyebrow">Y mucho más</span>
            <p className="mt-4 font-heading text-2xl text-navy leading-[1.25]">
              <em className="font-light">Dieciocho beneficios más</em> respaldados por la composición mineral del mar.
            </p>
          </motion.div>

          <ul className="col-span-12 md:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-1 border-t border-navy/10">
            {supporting.map((b, i) => (
              <motion.li
                key={b.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (i % 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="group flex items-center gap-3 py-4 border-b border-navy/[0.06]"
              >
                <i className={`fa-solid ${b.icon} text-gold/70 text-sm w-5 transition-transform duration-500 group-hover:scale-125 group-hover:text-gold`} aria-hidden="true" />
                <span className="font-body text-navy/75 text-[0.9rem] leading-snug group-hover:text-navy transition-colors">
                  {b.title}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-12 gap-y-8 md:gap-x-10 items-center"
        >
          <div className="col-span-12 md:col-span-4">
            <span className="eyebrow">Testimonio</span>
            <h3 className="mt-4 font-display text-display-md text-navy">
              <em className="font-light">«Una vida</em><br />sin déficit».
            </h3>
            <p className="mt-6 font-body text-navy/60 leading-[1.75]">
              Conoce la historia detrás de Lindasal en voz de Enrique, fundador de la marca.
              Una conversación íntima sobre el mar, la familia y la salud.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="divider-mark" />
              <span className="text-eyebrow text-gold-dark">@lindasalec</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="relative rounded-[1.5rem] overflow-hidden bg-navy shadow-[var(--shadow-floating)] border border-navy/10">
              <video
                ref={videoRef}
                src="/entrevistaaenrique/WhatsApp Video 2026-04-19 at 10.46.39 PM (3).mp4"
                controls
                preload="metadata"
                className="w-full aspect-video object-contain bg-navy"
                onPlay={(e) => {
                  document.querySelectorAll("video").forEach((v) => {
                    if (v !== e.currentTarget) v.pause();
                  });
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
