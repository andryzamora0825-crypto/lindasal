"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import bgImage from "../../../imagen de fondo/WhatsApp Image 2026-04-08 at 1.33.12 PM.jpeg";

const reveal = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.08 },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <header
      ref={ref}
      id="inicio"
      className="relative min-h-[100svh] w-full overflow-hidden bg-navy-deep text-pearl flex items-end md:items-center"
      aria-label="Sección principal Lindasal"
    >
      <motion.div
        style={{ y: bgY, scale: bgScale, backgroundImage: `url('${bgImage.src}')` }}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/80 to-navy/30" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 texture-grain" aria-hidden="true" />

      <div className="absolute -top-10 -right-20 w-[520px] h-[520px] rounded-full bg-gold/[0.06] blur-[140px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-teal/[0.05] blur-[120px] pointer-events-none animate-float-slow" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-20 md:pt-28 md:pb-24"
      >
        <div className="grid grid-cols-12 gap-y-10 md:gap-x-10 items-center">
          <div className="col-span-12 lg:col-span-8 flex flex-col">
            <motion.div
              variants={reveal}
              custom={0}
              initial="hidden"
              animate="visible"
              className="mb-8 flex items-center gap-4"
            >
              <span className="block w-10 h-px bg-gold/60" />
              <span className="text-eyebrow text-gold/80">Sal Marina · Ecuador · Desde 1939</span>
            </motion.div>

            <h1 className="font-display text-pearl">
              <motion.span
                variants={reveal}
                custom={1}
                initial="hidden"
                animate="visible"
                className="block text-display-xl tracking-[-0.03em] font-light"
              >
                El Poder
              </motion.span>
              <motion.span
                variants={reveal}
                custom={2}
                initial="hidden"
                animate="visible"
                className="block text-display-xl tracking-[-0.03em] -mt-2 md:-mt-4"
              >
                <span className="text-pearl/70">del</span>{" "}
                <span className="font-medium gradient-text-warm">Mar</span>
              </motion.span>
              <motion.span
                variants={reveal}
                custom={3}
                initial="hidden"
                animate="visible"
                className="block text-display-lg italic font-light text-teal-light/90 mt-2 md:mt-4 ml-0 md:ml-[18%]"
              >
                en tus manos.
              </motion.span>
            </h1>

            <motion.p
              variants={reveal}
              custom={4}
              initial="hidden"
              animate="visible"
              className="mt-10 max-w-[44ch] font-body text-pearl/70 text-[1.02rem] md:text-[1.12rem] leading-[1.8]"
            >
              Sal marina virgen, agua de mar Quinton y minerales puros del Pacífico ecuatoriano.
              Una herencia familiar de tres generaciones — ahora en tus manos.
            </motion.p>

            <motion.div
              variants={reveal}
              custom={5}
              initial="hidden"
              animate="visible"
              className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center"
            >
              <Link href="/tienda" className="btn-gold halo-hover group">
                <span>Explorar la colección</span>
                <i className="fa-solid fa-arrow-right text-xs transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <a href="#productos" className="inline-flex items-center gap-3 text-pearl/80 hover:text-pearl font-body text-sm tracking-[0.18em] uppercase font-semibold link-underline">
                Ver productos
              </a>
            </motion.div>

            <motion.div
              variants={reveal}
              custom={6}
              initial="hidden"
              animate="visible"
              className="mt-14 grid grid-cols-3 max-w-md gap-6 border-t border-pearl/10 pt-8"
            >
              <Stat number="03" label="Líneas orgánicas" />
              <Stat number="86" label="Años de herencia" />
              <Stat number="60%" label="Minerales naturales" />
            </motion.div>
          </div>

          <div className="hidden lg:block lg:col-span-4">
            <FloatingCallout />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-3 text-pearl/50"
      >
        <span className="text-eyebrow">Descubrir</span>
        <span className="block w-px h-10 bg-gradient-to-b from-pearl/40 to-transparent" />
      </motion.div>
    </header>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  const match = number.match(/^(\d+)(\D*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const pad = match ? match[1].length : 0;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, target, {
      duration: 1.8,
      delay: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = String(Math.round(v)).padStart(pad, "0") + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [inView, target, pad, suffix]);

  return (
    <div className="flex flex-col">
      <span ref={ref} className="font-heading text-pearl text-3xl md:text-4xl font-light leading-none tabular-nums">
        {String(0).padStart(pad, "0") + suffix}
      </span>
      <span className="mt-2 text-[0.65rem] tracking-[0.2em] uppercase text-pearl/50 font-body font-semibold leading-tight">{label}</span>
    </div>
  );
}

function FloatingCallout() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.9, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative ml-auto w-[320px]"
      aria-label="Producto destacado"
    >
      <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-gold/15 via-transparent to-teal/10 blur-2xl" aria-hidden="true" />
      <div className="relative surface-glass-dark rounded-[1.75rem] p-8 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gold/10 blur-3xl" />
        <span className="text-eyebrow text-gold-light">Producto</span>
        <h3 className="mt-4 font-heading text-3xl text-pearl leading-[1.1]">
          Lindasal <em className="font-light">Gourmet</em>
        </h3>
        <p className="mt-3 text-pearl/65 text-sm leading-[1.7]">
          40% menos sodio. 60% minerales puros: potasio, magnesio, calcio, hierro.
        </p>
        <div className="mt-6 flex items-end justify-between border-t border-pearl/10 pt-5">
          <div>
            <span className="text-eyebrow text-pearl/40 block">Desde</span>
            <span className="font-heading text-2xl text-pearl mt-1 block">$ 5.00</span>
          </div>
          <Link
            href="/tienda"
            className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gold text-navy hover:bg-gold-light transition-colors duration-500"
            aria-label="Ir a la tienda"
          >
            <i className="fa-solid fa-arrow-right text-sm" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}
