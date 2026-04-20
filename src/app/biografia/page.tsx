"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

/* ─── Info‑card data (Wikipedia style) ─── */
const infoCard = {
  nombre: "Enrique Avellán Portes",
  rol: "Fundador de Lindasal",
  nacimiento: "Ecuador",
  ocupacion: "Empresario · Investigador Natural",
  conocidoPor: "Sal marina artesanal 100% orgánica",
  marcas: ["Lindasal", "Nalleva", "Aguademar Quinton"],
  redes: {
    instagram: "https://www.instagram.com/lindasalec",
    whatsapp: "https://wa.me/message/MYAWP2XPANQSH1",
  },
  datos: [
    { label: "Industria", value: "Alimentos naturales" },
    { label: "Sede", value: "Ecuador 🇪🇨" },
    { label: "Productos", value: "Sal marina, Aguademar, Aceite de Magnesio" },
    { label: "Filosofía", value: "100% Natural, sin químicos" },
    { label: "Minerales", value: "84 oligoelementos" },
    { label: "Sodio", value: "40% menos que sal común" },
  ],
};

/* ─── Timeline ─── */
const timeline = [
  { year: "Orígenes", text: "Enrique descubre las extraordinarias propiedades de la sal marina artesanal en las costas vírgenes ecuatorianas, iniciando años de investigación sobre sus beneficios para la salud humana." },
  { year: "Investigación", text: "Combina conocimiento ancestral con ciencia moderna para desarrollar un proceso de recolección y secado solar que preserva los 84 minerales y oligoelementos naturales del agua de mar." },
  { year: "Fundación", text: "Nace oficialmente Lindasal con la misión de entregar sal marina 100% orgánica — libre de refinamiento industrial, aditivos químicos y blanqueadores — directo desde el océano Pacífico a tu mesa." },
  { year: "Expansión", text: "La marca crece con nuevas líneas de productos: Nalleva (sal gourmet) y Aguademar Quinton (agua de mar concentrada), ampliando el alcance de los beneficios marinos a miles de hogares." },
  { year: "Actualidad", text: "Lindasal se consolida como referente nacional en productos marinos naturales, con una comunidad creciente de familias que eligen la vía natural para su bienestar y salud." },
];

/* ─── Process ─── */
const proceso = [
  { icon: "fa-water", title: "Recolección", text: "El agua de mar se extrae de zonas vírgenes, libres de contaminación, en la costa ecuatoriana." },
  { icon: "fa-sun", title: "Evaporación Solar", text: "Se evapora naturalmente bajo el sol ecuatorial, un proceso lento que conserva todos los minerales." },
  { icon: "fa-hand-sparkles", title: "Selección Manual", text: "Cada lote se inspecciona y selecciona a mano, garantizando la máxima pureza y calidad artesanal." },
  { icon: "fa-jar", title: "Empaque", text: "Se empaca en materiales ecológicos que sellan la frescura, los nutrientes y la pureza de origen." },
];

/* ─── Videos ─── */
const videos = [
  { title: "Entrevista a Enrique Avellán — Fundador", desc: "La historia, la pasión y la visión detrás de Lindasal.", tag: "Entrevista" },
  { title: "El proceso artesanal de la sal marina", desc: "Del océano a tu mesa: un viaje fascinante paso a paso.", tag: "Documental" },
  { title: "Beneficios del Aguademar Quinton", desc: "Cómo el agua de mar concentrada transforma tu salud.", tag: "Educativo" },
];

/* ─── Beneficios clave ─── */
const beneficiosDestacados = [
  { icon: "fa-bone", text: "Fortalece huesos y articulaciones" },
  { icon: "fa-shield-halved", text: "Refuerza el sistema inmunológico" },
  { icon: "fa-heart-pulse", text: "Protege la salud cardiovascular" },
  { icon: "fa-fire", text: "Regula el metabolismo y quema grasas" },
  { icon: "fa-brain", text: "Mejora la función cerebral y el ánimo" },
  { icon: "fa-lungs", text: "Optimiza la capacidad pulmonar" },
  { icon: "fa-bed", text: "Combate el insomnio naturalmente" },
  { icon: "fa-droplet", text: "Incrementa hemoglobina y glóbulos rojos" },
];

/* ════════════════════════════════════════════════════════ */
export default function BiografiaPage() {
  const s1 = useInView(); const s2 = useInView(); const s3 = useInView();
  const s4 = useInView(); const s5 = useInView(); const s6 = useInView();

  const [tlActive, setTlActive] = useState(0);

  /* Auto‑advance timeline */
  useEffect(() => {
    const t = setInterval(() => setTlActive(p => (p + 1) % timeline.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="flex flex-col bg-pearl min-h-screen overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 w-full px-5 lg:px-[5%] flex justify-between items-center z-50 bg-navy/95 backdrop-blur-md border-b border-gold/15 py-3 shadow-lg">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg className="w-9 h-9" viewBox="0 0 36 36" fill="none"><path d="M3 22C3 22 7 14 12 14C17 14 19 20 24 20C29 20 33 14 33 14" stroke="url(#bwG1)" strokeWidth="2.5" strokeLinecap="round"/><path d="M3 27C3 27 7 19 12 19C17 19 19 25 24 25C29 25 33 19 33 19" stroke="url(#bwG2)" strokeWidth="2" strokeLinecap="round" opacity="0.6"/><circle cx="18" cy="10" r="3.5" fill="url(#bdG)" opacity="0.8"/><defs><linearGradient id="bwG1" x1="3" y1="14" x2="33" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#c9a84c"/><stop offset="1" stopColor="#7ecac3"/></linearGradient><linearGradient id="bwG2" x1="3" y1="19" x2="33" y2="19" gradientUnits="userSpaceOnUse"><stop stopColor="#7ecac3"/><stop offset="1" stopColor="#c9a84c"/></linearGradient><linearGradient id="bdG" x1="14.5" y1="6.5" x2="21.5" y2="13.5" gradientUnits="userSpaceOnUse"><stop stopColor="#e8d08a"/><stop offset="1" stopColor="#c9a84c"/></linearGradient></defs></svg>
          <span className="font-heading text-2xl font-bold bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">Lindasal</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex items-center px-4 py-1.5 rounded-full font-body font-semibold text-[0.82rem] bg-gold text-navy transition-all hover:-translate-y-0.5 hover:shadow-lg"><i className="fa-solid fa-arrow-left text-[0.65rem] mr-1.5"/>Inicio</Link>
          <Link href="/tienda" className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full font-body font-semibold text-[0.82rem] bg-gold text-navy transition-all hover:-translate-y-0.5 hover:shadow-lg"><i className="fa-solid fa-bag-shopping text-[0.65rem] mr-1.5"/>Tienda</Link>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  HERO — EDITORIAL COVER                                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <header className="relative bg-navy pt-28 pb-0 overflow-hidden">
        {/* BG Accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-gold/[0.04] blur-[100px]"/>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-teal/[0.04] blur-[80px]"/>
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-5 lg:px-8 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

          {/* LEFT — Article intro */}
          <div className="flex-1 pt-4 pb-16 lg:pb-24">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[0.68rem] font-bold tracking-[0.2em] uppercase bg-gold/10 text-gold border border-gold/25">
                <i className="fa-solid fa-feather-pointed text-[0.6rem]"/>Biografía
              </span>
            </div>

            <h1 className="font-heading text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-pearl leading-[1.05] mb-3">
              Enrique Avellán<br/>
              <span className="bg-gradient-to-r from-gold via-gold-light to-teal bg-clip-text text-transparent">
                <em className="font-light">Portes</em>
              </span>
            </h1>

            <p className="font-body text-gold/70 text-sm tracking-[0.18em] uppercase font-semibold mb-8">
              Fundador de Lindasal · Ecuador
            </p>

            <p className="font-body text-pearl/70 text-[1.08rem] leading-[1.95] max-w-[580px] mb-8">
              Emprendedor, investigador y apasionado por la salud natural. Enrique Avellán Portes dedicó
              su vida a descubrir y compartir el poder curativo del mar a través de la sal marina artesanal
              más pura de Ecuador — sin químicos, sin refinamiento, solo naturaleza.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href={infoCard.redes.whatsapp} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-semibold text-sm bg-[#25D366] text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(37,211,102,0.35)]">
                <i className="fa-brands fa-whatsapp"/> Contactar
              </a>
              <a href={infoCard.redes.instagram} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-semibold text-sm border border-pearl/20 text-pearl/80 transition-all hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-yellow-500 hover:via-pink-500 hover:to-purple-500 hover:border-transparent hover:text-white">
                <i className="fa-brands fa-instagram"/> @lindasalec
              </a>
            </div>
          </div>

          {/* RIGHT — Wikipedia‑style Info Card */}
          <aside className="w-full lg:w-[340px] shrink-0 lg:-mt-2 mb-8 lg:mb-0 lg:sticky lg:top-24 self-start">
            <div className="bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
              {/* Photo Area */}
              <div className="relative bg-gradient-to-br from-navy-light to-navy-mid aspect-square flex items-center justify-center overflow-hidden">
                <div className="w-28 h-28 rounded-full border-[3px] border-gold/30 bg-navy flex items-center justify-center shadow-[0_0_50px_rgba(201,168,76,0.15)]">
                  <i className="fa-solid fa-user text-4xl text-gold/30"/>
                </div>
                {/* Decorative corner accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold/20 rounded-tl-lg"/>
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold/20 rounded-br-lg"/>
              </div>

              {/* Name bar */}
              <div className="bg-gradient-to-r from-gold/15 to-teal/10 px-5 py-3 border-b border-white/[0.06]">
                <h2 className="font-heading text-lg font-bold text-pearl text-center">{infoCard.nombre}</h2>
                <p className="font-body text-[0.72rem] text-gold/70 text-center tracking-widest uppercase mt-0.5">{infoCard.rol}</p>
              </div>

              {/* Data rows */}
              <div className="divide-y divide-white/[0.05]">
                {infoCard.datos.map((d, i) => (
                  <div key={i} className="flex px-5 py-2.5">
                    <span className="font-body text-[0.78rem] font-semibold text-gold/60 w-[95px] shrink-0">{d.label}</span>
                    <span className="font-body text-[0.78rem] text-pearl/70">{d.value}</span>
                  </div>
                ))}
              </div>

              {/* Brands */}
              <div className="px-5 py-4 border-t border-white/[0.06]">
                <span className="font-body text-[0.68rem] font-bold text-gold/50 tracking-widest uppercase block mb-2">Marcas</span>
                <div className="flex flex-wrap gap-1.5">
                  {infoCard.marcas.map((m, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-[0.72rem] font-semibold bg-gold/10 text-gold border border-gold/20">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Wave separator */}
        <svg className="relative z-10 w-full -mb-1" viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{height:'50px'}}>
          <path d="M0 60V30C240 5 480 50 720 30C960 10 1200 45 1440 25V60H0Z" fill="#f5f0e8"/>
        </svg>
      </header>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  ARTICLE BODY — HISTORIA                               */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={s1.ref} className="py-20 px-5 lg:px-8 bg-pearl">
        <div className={`max-w-[900px] mx-auto transition-all duration-800 ${s1.vis ? 'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`}>

          {/* Section heading */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/15 to-teal/15 flex items-center justify-center border border-gold/15 shrink-0">
              <i className="fa-solid fa-scroll text-gold"/>
            </div>
            <div>
              <h2 className="font-heading text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold text-navy leading-tight">
                La Historia
              </h2>
              <div className="w-[50px] h-[2px] bg-gradient-to-r from-gold to-teal mt-1 rounded-full"/>
            </div>
          </div>

          {/* Timeline — Editorial vertical */}
          <div className="relative pl-8 md:pl-12 border-l-2 border-pearl-dark">
            {timeline.map((t, i) => (
              <div
                key={i}
                className={`relative mb-10 last:mb-0 transition-all duration-700 ${s1.vis ? 'opacity-100 translate-x-0':'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Dot */}
                <div className={`absolute -left-[calc(1rem+9px)] md:-left-[calc(1.5rem+9px)] top-1 w-4 h-4 rounded-full border-[3px] transition-colors duration-500 ${
                  tlActive === i ? 'bg-gold border-gold shadow-[0_0_12px_rgba(201,168,76,0.4)]' : 'bg-pearl border-pearl-dark'
                }`}/>

                <button
                  onClick={() => setTlActive(i)}
                  className={`w-full text-left group cursor-pointer rounded-xl p-5 -ml-2 transition-all duration-300 ${
                    tlActive === i
                      ? 'bg-white shadow-[0_2px_20px_rgba(10,22,40,0.06)] border border-pearl-dark'
                      : 'hover:bg-white/60'
                  }`}
                >
                  <span className={`font-body text-[0.7rem] font-bold tracking-[0.2em] uppercase transition-colors ${
                    tlActive === i ? 'text-gold' : 'text-navy-light/40 group-hover:text-gold/60'
                  }`}>{t.year}</span>
                  <p className={`font-body text-[0.95rem] leading-[1.85] mt-1.5 transition-colors ${
                    tlActive === i ? 'text-navy' : 'text-navy-light/50 group-hover:text-navy/70'
                  }`}>{t.text}</p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  PROCESO ARTESANAL                                     */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={s2.ref} className="py-20 px-5 lg:px-8 bg-white border-y border-pearl-dark">
        <div className="max-w-[1100px] mx-auto">
          {/* Heading */}
          <div className={`flex items-center gap-4 mb-14 transition-all duration-700 ${s2.vis ? 'opacity-100 translate-y-0':'opacity-0 translate-y-6'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal/15 to-gold/15 flex items-center justify-center border border-teal/15 shrink-0">
              <i className="fa-solid fa-water text-teal-dark"/>
            </div>
            <div>
              <h2 className="font-heading text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold text-navy leading-tight">
                Del Océano a tu Mesa
              </h2>
              <div className="w-[50px] h-[2px] bg-gradient-to-r from-teal to-gold mt-1 rounded-full"/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {proceso.map((p, i) => (
              <div
                key={i}
                className={`group relative bg-pearl/60 rounded-2xl p-6 border border-pearl-dark transition-all duration-700 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgba(10,22,40,0.07)] hover:border-gold/25 ${s2.vis ? 'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Step number */}
                <span className="absolute top-4 right-5 font-heading text-[3.5rem] font-bold text-navy/[0.04] leading-none select-none">
                  {String(i+1).padStart(2, '0')}
                </span>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal/15 to-gold/15 flex items-center justify-center mb-4 border border-teal/10 transition-transform group-hover:scale-110">
                  <i className={`fa-solid ${p.icon} text-teal-dark text-lg`}/>
                </div>
                <h3 className="font-heading text-[1.05rem] font-bold text-navy mb-1.5">{p.title}</h3>
                <p className="font-body text-navy-light/55 text-[0.85rem] leading-[1.75]">{p.text}</p>

                {/* Arrow connector */}
                {i < proceso.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 text-pearl-dark text-xs z-10">
                    <i className="fa-solid fa-chevron-right"/>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  BENEFICIOS DESTACADOS                                 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={s3.ref} className="py-20 px-5 lg:px-8 bg-pearl">
        <div className="max-w-[900px] mx-auto">
          <div className={`flex items-center gap-4 mb-10 transition-all duration-700 ${s3.vis ? 'opacity-100 translate-y-0':'opacity-0 translate-y-6'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/15 to-teal/15 flex items-center justify-center border border-gold/15 shrink-0">
              <i className="fa-solid fa-heart-pulse text-gold"/>
            </div>
            <div>
              <h2 className="font-heading text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold text-navy leading-tight">
                Beneficios para tu Salud
              </h2>
              <div className="w-[50px] h-[2px] bg-gradient-to-r from-gold to-teal mt-1 rounded-full"/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {beneficiosDestacados.map((b, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-pearl-dark transition-all duration-500 hover:border-gold/25 hover:shadow-sm group ${s3.vis ? 'opacity-100 translate-y-0':'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 transition-all group-hover:bg-gold/15 group-hover:scale-105">
                  <i className={`fa-solid ${b.icon} text-teal-dark text-sm transition-colors group-hover:text-gold`}/>
                </span>
                <span className="font-body text-[0.9rem] text-navy font-medium leading-snug">{b.text}</span>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-[0.82rem] text-navy-light/40 italic font-body">
            Todos los beneficios aplican a <strong>Lindasal, Nalleva y Aguademar Quinton</strong>.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  QUOTE — Breakout                                      */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={s4.ref} className="py-20 px-5 lg:px-8 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/[0.03] blur-[100px]"/>
        </div>
        <div className={`max-w-[750px] mx-auto text-center relative z-10 transition-all duration-1000 ${s4.vis ? 'opacity-100 scale-100':'opacity-0 scale-95'}`}>
          <i className="fa-solid fa-quote-left text-3xl text-gold/15 mb-5 block"/>
          <blockquote className="font-heading text-[clamp(1.4rem,3vw,2.4rem)] font-light italic text-pearl leading-[1.45] mb-6">
            &ldquo;La sal del mar no es solo un condimento.
            Es la esencia misma de la vida, el primer mineral
            que nuestro cuerpo necesita para existir.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-[1.5px] bg-gradient-to-r from-transparent to-gold"/>
            <span className="font-body text-[0.78rem] text-pearl/50 tracking-[0.18em] uppercase font-semibold">Enrique Avellán Portes</span>
            <div className="w-10 h-[1.5px] bg-gradient-to-l from-transparent to-gold"/>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  VIDEOS                                                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={s5.ref} className="py-20 px-5 lg:px-8 bg-pearl">
        <div className="max-w-[1100px] mx-auto">
          <div className={`flex items-center gap-4 mb-14 transition-all duration-700 ${s5.vis ? 'opacity-100 translate-y-0':'opacity-0 translate-y-6'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/15 to-teal/15 flex items-center justify-center border border-gold/15 shrink-0">
              <i className="fa-solid fa-clapperboard text-gold"/>
            </div>
            <div>
              <h2 className="font-heading text-[clamp(1.6rem,3.5vw,2.6rem)] font-bold text-navy leading-tight">
                Videos & Documentales
              </h2>
              <div className="w-[50px] h-[2px] bg-gradient-to-r from-gold to-teal mt-1 rounded-full"/>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((v, i) => (
              <div
                key={i}
                className={`group bg-white rounded-2xl overflow-hidden border border-pearl-dark transition-all duration-700 hover:-translate-y-1.5 hover:shadow-[0_8px_32px_rgba(10,22,40,0.08)] hover:border-gold/25 ${s5.vis ? 'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 130}ms` }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-navy to-navy-mid flex items-center justify-center overflow-hidden">
                  {/* Subtle wave texture */}
                  <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 200 120" preserveAspectRatio="none">
                    <path d="M0 60C40 40 80 80 120 50C160 20 200 70 200 70V120H0Z" fill="#c9a84c"/>
                    <path d="M0 80C50 60 100 90 150 70C200 50 200 90 200 90V120H0Z" fill="#7ecac3"/>
                  </svg>

                  {/* Play */}
                  <div className="relative z-10 w-14 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center transition-all group-hover:bg-gold/25 group-hover:border-gold/40 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(201,168,76,0.25)]">
                    <i className="fa-solid fa-play text-white/80 group-hover:text-gold ml-0.5"/>
                  </div>

                  {/* Tag */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-gold/15 text-gold text-[0.65rem] font-bold tracking-widest uppercase border border-gold/20 backdrop-blur-sm">{v.tag}</span>

                  {/* Coming soon */}
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-md bg-navy/60 text-pearl/70 text-[0.65rem] font-semibold backdrop-blur-sm border border-white/10">Próximamente</span>
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-[0.95rem] font-bold text-navy mb-1 leading-snug group-hover:text-gold-dark transition-colors">{v.title}</h3>
                  <p className="font-body text-navy-light/50 text-[0.82rem] leading-[1.7]">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  CTA                                                   */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={s6.ref} className="py-20 px-5 lg:px-8 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-teal/[0.03] blur-[80px]"/>
        </div>
        <div className={`max-w-[650px] mx-auto text-center relative z-10 transition-all duration-800 ${s6.vis ? 'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`}>
          <h2 className="font-heading text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-pearl mb-5 leading-[1.15]">
            Descubre la Diferencia{" "}
            <span className="bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">Natural</span>
          </h2>
          <p className="font-body text-pearl/50 mb-10 text-[1rem] leading-[1.85]">
            Conoce nuestros productos y únete a miles de familias que ya eligieron vivir más sano.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tienda"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-body font-semibold text-base bg-gradient-to-r from-gold to-gold-light text-navy shadow-[0_4px_20px_rgba(201,168,76,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(201,168,76,0.4)] relative group overflow-hidden">
              <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out z-0"/>
              <span className="relative z-10 flex items-center gap-2">Explorar Tienda <i className="fa-solid fa-arrow-right"/></span>
            </Link>
            <Link href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-body font-semibold text-base border-2 border-pearl/30 text-pearl/80 transition-all hover:-translate-y-1 hover:bg-pearl/10 hover:border-pearl/60">
              <i className="fa-solid fa-arrow-left text-xs"/> Volver al Inicio
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer mini ── */}
      <footer className="bg-navy border-t border-white/5 py-8 px-5 text-center">
        <p className="font-body text-pearl/25 text-sm">© {new Date().getFullYear()} Lindasal — Sal Marina Orgánica · Ecuador</p>
      </footer>
    </main>
  );
}
