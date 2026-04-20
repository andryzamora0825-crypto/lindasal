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

/* ─── Variables de Contenido (Tramos) ─── */

const identidad = [
  { id: "mision", label: "Misión", icon: "fa-rocket", col: "text-teal", bg: "bg-teal/10", border: "group-hover:border-teal/30", desc: "Transformar la riqueza de nuestras fuentes naturales a 500 metros de altura en un ingrediente esencial para la vida. Mediante la cristalización artesanal y el respeto por los tiempos de la naturaleza, entregamos una sal orgánica, rica en minerales y libre de procesos industriales, garantizando bienestar y sabor en cada cristal." },
  { id: "vision", label: "Visión", icon: "fa-eye", col: "text-gold", bg: "bg-gold/10", border: "group-hover:border-gold/30", desc: "Consolidarnos como el proyecto líder en la revalorización de sales ancestrales, siendo el puente entre la pureza del manantial y la mesa del consumidor. Buscamos innovar en la industria alimentaria promoviendo un consumo consciente y sostenible que proteja nuestro ecosistema de altura." },
  { id: "valores", label: "Valores", icon: "fa-gem", col: "text-blue-500", bg: "bg-blue-500/10", border: "group-hover:border-blue-500/30", list: [
    { n: "Pureza de Origen", v: "Integridad total de la materia prima." },
    { n: "Sustentabilidad Activa", v: "Respeto absoluto al sol y el viento." },
    { n: "Excelencia Artesanal", v: "Valoración del trabajo manual en cada etapa." },
    { n: "Bienestar Integral", v: "Salud desde el equilibrio mineral." }
  ]}
];

const oceanoInterno = [
  { id: 1, name: "Solución Hipertónica", desc: "Una fuente natural de 118 minerales que apoya el bienestar general, potencia tu sistema inmune y regenera tus células desde la raíz.", icon: "fa-water" },
  { id: 2, name: "Aceite de Magnesio", desc: "Absorción directa y efectiva por vía tópica. Ideal para relajar músculos, disminuir el voltaje y favorecer el equilibrio del sistema nervioso.", icon: "fa-droplet" },
  { id: 3, name: "Sal Gourmet Lindasal", desc: "El sabor que tu cocina merece con la pureza que tu salud necesita. Transformamos tu alimentación cotidiana en una experiencia gourmet y saludable.", icon: "fa-leaf" },
];

const tratamos = [
  "Rectificación Cervical", "Capsulitis Adhesiva (Hombro)", "Hipercifosis", 
  "Hernias Discales", "Inflamación de Nervio Ciático", "Rectificación Lumbar", 
  "Iliacos Desalineados", "Dolores de Rodillas", "Esguinces", "Luxaciones"
];

const terapias = [
  "Percutor", "Infrarrojos", "Ventosas", "Electroestimulación", "Ultrasonido", 
  "Láser", "Acupuntura", "Masaje Craneal", "Masaje Visceral", "Ajustes Quiroprácticos"
];

const tiposDeSal = [
  { t: "Marina Integral", desc: "No refinada, secada al sol. Mantiene toda su matriz de minerales y oligoelementos intactos." },
  { t: "Refinada / Yodada", desc: "Lavadura industrial a altas temperaturas. Pierde valor nutricional. Se le añade yodo y flúor químico." },
  { t: "Cristal o Himalaya", desc: "Proveniente de minas terrestres (fósil). Destaca por su color rosado debido a su alto contenido en hierro." },
  { t: "Flor de Sal", desc: "La capa superior que cristaliza al atardecer. Exclusiva, gourmet, rica en magnesio y yodo natural." },
  { t: "Negra / Roja", desc: "Enriquecida naturalmente en regiones volcánicas con carbón activado o arcillas volcánicas de hierro." },
];

const composicion = [
  { sym: "Na", name: "Sodio", no: 11 }, { sym: "Mg", name: "Magnesio", no: 12 }, { sym: "K", name: "Potasio", no: 19 },
  { sym: "Ca", name: "Calcio", no: 20 }, { sym: "I", name: "Yodo", no: 53 }, { sym: "Zn", name: "Zinc", no: 30 },
  { sym: "Fe", name: "Hierro", no: 26 }, { sym: "Mn", name: "Manganeso", no: 25 }, { sym: "Se", name: "Selenio", no: 34 },
  { sym: "B", name: "Boro", no: 5 }, { sym: "Si", name: "Silicio", no: 14 }, { sym: "P", name: "Fósforo", no: 15 },
  { sym: "Cu", name: "Cobre", no: 29 }, { sym: "Cr", name: "Cromo", no: 24 }, { sym: "Mo", name: "Molibdeno", no: 42 }
];

const videos = [
  { 
    title: "Entrevista a Enrique Avellán — Parte 1", 
    desc: "Primer segmento de la entrevista donde Enrique comparte la visión y los orígenes de Lindasal.", 
    tag: "Entrevista",
    src: "/entrevistaaenrique/WhatsApp Video 2026-04-19 at 10.46.39 PM.mp4"
  },
  { 
    title: "Entrevista a Enrique Avellán — Parte 2", 
    desc: "Segundo segmento: Enrique explica a profundidad los beneficios y el impacto del agua de mar.", 
    tag: "Entrevista",
    src: "/entrevistaaenrique/WhatsApp Video 2026-04-19 at 10.46.39 PM (3).mp4"
  },
  { 
    title: "El proceso artesanal de la sal marina", 
    desc: "Del océano a tu mesa: un viaje fascinante paso a paso.", 
    tag: "Documental",
    src: null
  },
];

/* ════════════════════════════════════════════════════════ */
export default function BiografiaPage() {
  const sIntro = useInView(); const sId = useInView(); const sOcean = useInView();
  const sClinica = useInView(); const sEncy = useInView(); const sVid = useInView(); const sCta = useInView();

  /* Auto-pause videos that are out of view */
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          const vid = entry.target as HTMLVideoElement;
          if (!vid.paused) vid.pause();
        }
      });
    }, { threshold: 0.1 });

    const videoEls = document.querySelectorAll('video');
    videoEls.forEach(v => observer.observe(v));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="flex flex-col bg-pearl min-h-screen overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 w-full px-5 lg:px-[5%] flex justify-between items-center z-50 bg-navy/95 backdrop-blur-md border-b border-gold/15 py-3 shadow-lg">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <svg className="w-9 h-9 transition-transform group-hover:rotate-12" viewBox="0 0 36 36" fill="none"><path d="M3 22C3 22 7 14 12 14C17 14 19 20 24 20C29 20 33 14 33 14" stroke="url(#bwG1)" strokeWidth="2.5" strokeLinecap="round"/><path d="M3 27C3 27 7 19 12 19C17 19 19 25 24 25C29 25 33 19 33 19" stroke="url(#bwG2)" strokeWidth="2" strokeLinecap="round" opacity="0.6"/><circle cx="18" cy="10" r="3.5" fill="url(#bdG)" opacity="0.8"/><defs><linearGradient id="bwG1" x1="3" y1="14" x2="33" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#c9a84c"/><stop offset="1" stopColor="#7ecac3"/></linearGradient><linearGradient id="bwG2" x1="3" y1="19" x2="33" y2="19" gradientUnits="userSpaceOnUse"><stop stopColor="#7ecac3"/><stop offset="1" stopColor="#c9a84c"/></linearGradient><linearGradient id="bdG" x1="14.5" y1="6.5" x2="21.5" y2="13.5" gradientUnits="userSpaceOnUse"><stop stopColor="#e8d08a"/><stop offset="1" stopColor="#c9a84c"/></linearGradient></defs></svg>
          <span className="font-heading text-2xl font-bold bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">Lindasal</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/" className="inline-flex items-center px-4 py-1.5 rounded-full font-body font-semibold text-[0.82rem] bg-gold/10 border border-gold/20 text-gold transition-all hover:bg-gold hover:text-navy hover:-translate-y-0.5"><i className="fa-solid fa-arrow-left text-[0.65rem] mr-1.5"/>Inicio</Link>
          <Link href="/tienda" className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full font-body font-semibold text-[0.82rem] bg-gold text-navy transition-all hover:-translate-y-0.5 hover:shadow-lg"><i className="fa-solid fa-bag-shopping text-[0.65rem] mr-1.5"/>Tienda</Link>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  TRAMO 1: HERO & INTRODUCCIÓN                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      <header ref={sIntro.ref} className="relative bg-navy pt-32 pb-16 lg:pb-32 overflow-hidden">
        {/* Glows Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] rounded-full bg-gold/[0.04] blur-[120px] mix-blend-screen"/>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-teal/[0.05] blur-[100px] mix-blend-screen"/>
          {/* Subtle grid pattern for texture */}
          <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"/>
        </div>

        <div className="relative z-10 max-w-[1250px] mx-auto px-5 lg:px-8 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">
          
          {/* Main Titles */}
          <div className={`flex-1 transition-all duration-1000 ${sIntro.vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.7rem] font-bold tracking-[0.2em] uppercase bg-white/[0.05] text-gold border border-gold/20 mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(201,168,76,0.1)]">
              <i className="fa-solid fa-droplet text-[0.6rem]"/> Biografía & Propósito
            </div>

            <h1 className="font-heading text-[clamp(2.5rem,5.5vw,4.8rem)] font-bold text-pearl leading-[1.05] mb-8">
              Linda Sal, la flor de sal que renueva tu cuerpo <br className="hidden lg:block"/>
              <span className="relative inline-block mt-2">
                <span className="relative z-10 bg-gradient-to-r from-gold via-gold-light to-teal bg-clip-text text-transparent italic font-light">desde la raíz.</span>
                <span className="absolute bottom-1 lg:bottom-3 left-0 w-full h-[0.3em] bg-gold/20 -z-10 -rotate-1 rounded-sm"/>
              </span>
            </h1>

            <div className="pl-6 border-l-2 border-gold/40 relative">
              <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-gold shadow-[0_0_10px_rgba(201,168,76,0.8)]"/>
              <p className="font-body text-pearl/80 text-[1.15rem] leading-[1.8] max-w-[600px] mb-8">
                <strong>Linda Sal</strong> es la primera flor de sal en el mundo capaz de sanar, restaurar y regenerar, llevando cada mineral esencial desde las células hasta los tejidos.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <a href={infoCard.redes.whatsapp} target="_blank" rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-body font-bold text-sm bg-[#25D366] text-white overflow-hidden transition-transform hover:-translate-y-1 shadow-[0_8px_25px_rgba(37,211,102,0.3)]">
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"/>
                <i className="fa-brands fa-whatsapp text-lg relative z-10"/> <span className="relative z-10">Agendar Consulta</span>
              </a>
              <a href={infoCard.redes.instagram} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-body font-bold text-sm bg-white/[0.05] border border-white/10 text-pearl/90 transition-all hover:-translate-y-1 hover:bg-gradient-to-r hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:shadow-[0_8px_25px_rgba(220,39,67,0.3)]">
                <i className="fa-brands fa-instagram text-lg"/> Síguenos en IG
              </a>
            </div>
          </div>

          {/* Info Card (Right) */}
          <aside className={`w-full lg:w-[380px] shrink-0 transition-all duration-1000 delay-300 ${sIntro.vis ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative p-[1px] rounded-[2rem] bg-gradient-to-br from-gold/50 via-teal/20 to-navy-light shadow-[0_20px_50px_rgba(0,0,0,0.4)] group">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-teal/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>
              
              <div className="relative bg-navy-mid/95 backdrop-blur-xl rounded-[2rem] overflow-hidden flex flex-col">
                <div className="p-8 pb-6 flex flex-col items-center text-center border-b border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-50"/>
                  
                  {/* Photo Placeholder */}
                  <div className="relative w-32 h-32 rounded-full border-[3px] border-gold/40 bg-navy flex items-center justify-center mb-5 z-10 shadow-[0_0_30px_rgba(201,168,76,0.2)]">
                    <i className="fa-solid fa-user-tie text-5xl text-gold/30"/>
                    <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#25D366] border-2 border-navy flex items-center justify-center shadow-lg">
                      <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"/>
                    </div>
                  </div>

                  <h2 className="font-heading text-2xl font-bold text-pearl relative z-10 mb-1">{infoCard.nombre}</h2>
                  <p className="font-body text-[0.75rem] text-gold tracking-[0.2em] uppercase font-bold relative z-10">{infoCard.rol}</p>
                </div>

                <div className="p-6 flex flex-col gap-3 relative z-10">
                  {infoCard.datos.map((d, i) => (
                    <div key={i} className="flex justify-between items-center group/row">
                      <span className="font-body text-[0.75rem] font-medium text-gold/60 uppercase tracking-wider">{d.label}</span>
                      <span className="font-body text-[0.85rem] font-semibold text-pearl/90 text-right max-w-[170px] transition-colors group-hover/row:text-gold">{d.value}</span>
                    </div>
                  ))}
                  
                  <div className="pt-4 mt-2 border-t border-white/5">
                    <span className="font-body text-[0.7rem] font-medium text-gold/40 uppercase tracking-widest block mb-3 text-left">Marcas Notables</span>
                    <div className="flex flex-wrap gap-2">
                      {infoCard.marcas.map((m, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-md text-[0.72rem] font-bold bg-white/5 text-pearl/70 border border-white/10 hover:border-gold/40 hover:text-gold transition-colors cursor-default">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </header>


      {/* ═══════════════════════════════════════════════════════ */}
      {/*  TRAMO 2: IDENTIDAD CORPORATIVA                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={sId.ref} className="py-24 px-5 lg:px-8 bg-[#fdfcfb] relative">
        <div className="max-w-[1250px] mx-auto relative z-10">
          
          <div className={`text-center mb-16 transition-all duration-1000 ${sId.vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-gold uppercase tracking-[0.25em] font-bold text-[0.7rem] mb-3 block">Filosofía</span>
            <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-bold text-navy leading-tight mb-5">Nuestra Identidad Corporativa</h2>
            <div className="w-16 h-1.5 bg-gradient-to-r from-gold to-teal mx-auto rounded-full"/>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {identidad.map((item, i) => (
              <div 
                key={item.id}
                className={`group relative bg-white rounded-[2rem] p-8 lg:p-10 border border-pearl-dark transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(10,22,40,0.06)] ${item.border} ${sId.vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                  <i className={`fa-solid ${item.icon} text-3xl ${item.col}`}/>
                </div>
                
                <h3 className="font-heading text-2xl font-bold text-navy mb-5 uppercase tracking-wide">{item.label}</h3>
                
                {item.desc && (
                  <p className="font-body text-navy-light/65 leading-[1.85] text-[0.95rem]">
                    {item.desc}
                  </p>
                )}
                
                {item.list && (
                  <ul className="space-y-4">
                    {item.list.map((li, idx) => (
                      <li key={idx} className="flex gap-3">
                        <i className={`fa-solid fa-check ${item.col} text-[0.8rem] mt-1 shrink-0`}/>
                        <div>
                          <span className="font-heading block text-[0.95rem] font-bold text-navy mb-0.5">{li.n}</span>
                          <span className="font-body block text-[0.85rem] text-navy-light/60 leading-snug">{li.v}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  TRAMO 3: EL OCÉANO INTERNO                            */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={sOcean.ref} className="py-28 px-5 lg:px-8 bg-navy relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal/10 via-transparent to-transparent pointer-events-none"/>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent pointer-events-none"/>
        
        <div className="max-w-[1250px] mx-auto relative z-10">
          <div className={`max-w-[850px] mx-auto text-center mb-20 transition-all duration-1000 ${sOcean.vis ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 backdrop-blur-md shadow-[0_0_40px_rgba(126,202,195,0.15)]">
              <i className="fa-solid fa-water text-4xl text-teal"/>
            </div>
            <h2 className="font-heading text-[clamp(2.2rem,4.5vw,4rem)] font-bold text-pearl leading-[1.1] mb-6">
              ¿Sabías que tu cuerpo es básicamente <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal via-cyan-400 to-blue-400">un océano interno?</span>
            </h2>
            <p className="font-body text-pearl/60 text-[1.15rem] leading-[1.8] max-w-[700px] mx-auto">
              La falta de magnesio y minerales esenciales es la causa oculta de muchos malestares de hoy en día. <strong>Dale a tu vida la alcalinidad</strong> que tu cuerpo pide a gritos con nuestra línea de bienestar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {oceanoInterno.map((p, i) => (
               <div 
                  key={p.id}
                  className={`group relative rounded-[2rem] p-[1px] bg-gradient-to-br from-white/10 via-white/[0.02] to-transparent overflow-hidden transition-all duration-1000 ${sOcean.vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                  style={{ transitionDelay: `${i * 200}ms` }}
               >
                  <div className="absolute inset-0 bg-navy-mid/60 backdrop-blur-xl group-hover:bg-navy-mid/40 transition-colors duration-500"/>
                  <div className="relative h-full p-8 lg:p-10 flex flex-col items-center text-center z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal/20 to-gold/20 border border-t-white/10 border-l-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out">
                      <i className={`fa-solid ${p.icon} text-3xl text-teal-light`}/>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-pearl mb-4">{p.name}</h3>
                    <p className="font-body text-pearl/50 text-[0.95rem] leading-[1.8]">{p.desc}</p>
                    <div className="mt-8 transition-all duration-300 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                      <span className="text-[0.75rem] font-bold uppercase tracking-widest text-gold flex items-center gap-2">
                        Renueva tu biología <i className="fa-solid fa-arrow-right"/>
                      </span>
                    </div>
                  </div>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  TRAMO 4: CLÍNICA OSTEOPÁTICA                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={sClinica.ref} className="py-24 px-5 lg:px-8 bg-pearl">
        <div className="max-w-[1250px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* LEFT: Tratamos (Glassmorphism List) */}
            <div className={`relative transition-all duration-1000 ${sClinica.vis ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="absolute -inset-4 bg-gradient-to-br from-gold/10 to-teal/10 rounded-[3rem] blur-2xl -z-10"/>
              
              <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(10,22,40,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl"/>
                
                <h3 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-8 flex items-center gap-4">
                  <span className="w-12 h-12 rounded-xl bg-navy text-gold flex items-center justify-center shrink-0 shadow-lg">
                    <i className="fa-solid fa-stethoscope text-xl"/>
                  </span>
                  Lo que Tratamos
                </h3>
                
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 relative z-10">
                  {tratamos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <span className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-gold transition-colors">
                        <i className="fa-solid fa-check text-[0.6rem] text-gold-dark group-hover:text-white"/>
                      </span>
                      <span className="font-body font-medium text-navy-light text-[0.95rem] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT: Terapias y Autorización */}
            <div className={`transition-all duration-1000 delay-200 ${sClinica.vis ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-teal/10 text-teal-dark font-bold uppercase tracking-widest text-[0.7rem] mb-6 border border-teal/20">Metodología Especializada</span>
              <h2 className="font-heading text-[clamp(2.5rem,4vw,3.5rem)] font-bold text-navy leading-[1.1] mb-6">Terapias Aplicadas</h2>
              <p className="font-body text-navy-light/60 text-lg leading-[1.7] mb-10 max-w-[500px]">
                Combinamos tecnología de vanguardia y conocimientos ancestrales para brindarte un tratamiento holístico que va al origen del dolor.
              </p>
              
              <div className="flex flex-wrap gap-2.5 mb-10">
                {terapias.map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-lg bg-pearl-dark/50 text-navy-light font-body font-semibold text-[0.85rem] border border-pearl-dark hover:border-gold/30 hover:bg-white hover:text-navy transition-all cursor-default shadow-sm hover:shadow-md hover:-translate-y-0.5">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Accreditations Banner */}
              <div className="flex items-center gap-5 p-6 bg-white rounded-2xl border border-teal/15 shadow-[0_8px_30px_rgba(126,202,195,0.1)] group">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center text-white shrink-0 group-hover:rotate-12 transition-transform duration-500">
                  <i className="fa-solid fa-certificate text-xl"/>
                </div>
                <p className="font-body text-[0.9rem] font-medium text-navy-light/80 leading-relaxed">
                  Autorizados legalmente por el <strong className="text-teal-dark">Acces</strong> y el <strong className="text-teal-dark">Ministerio de Salud Pública (MSP)</strong> de Ecuador.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  TRAMO 5: ENCICLOPEDIA GLOBAL DE LA SAL                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={sEncy.ref} className="py-28 px-5 lg:px-8 bg-navy-light relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] select-none opacity-[0.03]">
          <svg viewBox="0 0 100 100"><polygon points="50,0 100,25 100,75 50,100 0,75 0,25" fill="#fff"/></svg>
        </div>

        <div className="max-w-[1300px] mx-auto relative z-10">
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="font-heading text-[clamp(2.2rem,4vw,3.5rem)] font-bold text-pearl mb-4">Enciclopedia Global de la Sal</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-gold to-teal mx-auto rounded-full"/>
            <p className="mt-6 font-body text-pearl/50 max-w-[600px] mx-auto text-lg">No toda la sal es igual. Descubre la abismal diferencia anatómica entre un alimento orgánico y un producto industrializado.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 lg:gap-16">
            
            {/* LADO IZQUIERDO: Tipos de Sal */}
            <div className={`xl:col-span-5 flex flex-col gap-5 transition-all duration-1000 ${sEncy.vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              
              <h3 className="font-heading text-xl text-gold mb-2 uppercase tracking-widest font-semibold flex items-center gap-3">
                 Tipos de Sal Anivel Mundial <i className="fa-solid fa-layer-group text-sm"/>
              </h3>
              
              {tiposDeSal.map((sal, idx) => (
                <div key={idx} className="bg-navy rounded-2xl p-6 border border-white/5 flex gap-5 group hover:bg-navy-mid transition-colors duration-300">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-gold/10 group-hover:border-gold/30 transition-colors">
                    <i className={`fa-solid ${idx === 0 || idx === 3 ? 'fa-gem text-gold' : 'fa-cubes text-pearl/30'} text-lg`}/>
                  </div>
                  <div>
                    <h4 className={`font-heading text-[1.1rem] font-bold mb-1.5 ${idx === 0 || idx === 3 ? 'text-pearl' : 'text-pearl/70'}`}>{sal.t}</h4>
                    <p className="font-body text-pearl/40 text-[0.85rem] leading-[1.7]">{sal.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* LADO DERECHO: Composición Periódica */}
            <div className={`xl:col-span-7 bg-navy-mid rounded-[2.5rem] p-8 lg:p-12 border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-1000 delay-300 ${sEncy.vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal/5 blur-[80px]"/>
              
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-5">
                <div>
                  <h3 className="font-heading text-2xl lg:text-3xl text-pearl font-bold mb-3 flex items-center gap-3">
                    Composición Marina <i className="fa-solid fa-flask text-teal"/>
                  </h3>
                  <p className="font-body text-pearl/50 text-[0.95rem] leading-[1.6] max-w-[450px]">
                    El <strong className="text-pearl">Cloruro de Sodio (NaCl)</strong> está sostenido por una matriz viva de minerales y oligoelementos que la naturaleza balanceó a la perfección.
                  </p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-teal/10 border border-teal/20 text-teal font-body text-sm font-bold shadow-[0_0_15px_rgba(126,202,195,0.15)] whitespace-nowrap">
                  84 Oligoelementos
                </div>
              </div>
              
              {/* Grid estilo tabla periódica */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 relative z-10">
                {composicion.map((elem, idx) => (
                  <div key={idx} className="aspect-square bg-navy rounded-xl border border-white/5 flex flex-col items-center justify-center relative group hover:border-gold/30 hover:bg-gold/5 transition-colors duration-300 cursor-default">
                    <span className="absolute top-2 left-2 text-[0.55rem] font-bold text-pearl/20">{elem.no}</span>
                    <span className="font-heading text-2xl font-bold text-pearl group-hover:text-gold transition-colors">{elem.sym}</span>
                    <span className="font-body text-[0.65rem] text-pearl/50 font-bold tracking-wider uppercase mt-1 text-center truncate w-full px-1">{elem.name}</span>
                  </div>
                ))}
              </div>
              
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  TRAMO 6: VIDEOS Y DOCUMENTALES                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={sVid.ref} className="py-24 px-5 lg:px-8 bg-pearl border-t border-pearl-dark">
        <div className="max-w-[1250px] mx-auto">
          <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 transition-all duration-700 ${sVid.vis ? 'opacity-100 translate-y-0':'opacity-0 translate-y-6'}`}>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/15 to-teal/15 flex items-center justify-center border border-gold/15 shrink-0">
                  <i className="fa-solid fa-clapperboard text-gold"/>
                </div>
                <h2 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-bold text-navy leading-tight">Videos Oficiales</h2>
              </div>
              <p className="font-body text-navy-light/60 text-lg">Conoce a profundidad la filosofía detrás de Linda Sal.</p>
            </div>
            {/* Visual separator/decoration */}
            <div className="hidden md:block w-32 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent mb-4"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map((v, i) => (
              <div
                key={i}
                className={`group bg-white rounded-3xl overflow-hidden border border-pearl-dark/60 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(10,22,40,0.08)] ${sVid.vis ? 'opacity-100 translate-y-0':'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Thumbnail / Video */}
                <div className="relative aspect-[4/3] bg-navy flex items-center justify-center overflow-hidden">
                  {v.src ? (
                    <video 
                      src={v.src}
                      controls
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover z-20 bg-black/50"
                      onPlay={(e) => {
                        const allVideos = document.querySelectorAll("video");
                        allVideos.forEach(vid => {
                          if (vid !== e.currentTarget) vid.pause();
                        });
                      }}
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-mid z-0"/>
                      {/* Subtly animated decorative shape */}
                      <div className="absolute inset-0 opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-1000">
                        <svg className="w-full h-full rotate-45" viewBox="0 0 200 200"><path d="M50 50L150 150M150 50L50 150" stroke="#c9a84c" strokeWidth="2"/></svg>
                      </div>

                      <div className="relative z-10 w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center transition-all group-hover:bg-gold/25 group-hover:border-gold/40 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] cursor-not-allowed">
                        <i className="fa-solid fa-play text-white/80 group-hover:text-gold ml-1 text-lg"/>
                      </div>

                      <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-gold/15 text-gold text-[0.7rem] font-bold tracking-widest uppercase border border-gold/20 backdrop-blur-md z-10">{v.tag}</span>
                      <span className="absolute bottom-4 right-4 px-3 py-1 rounded-md bg-navy/80 text-pearl/70 text-[0.7rem] font-semibold backdrop-blur-md border border-white/10 z-10 flex items-center gap-2"><i className="fa-solid fa-clock opacity-50"/> Próximamente</span>
                    </>
                  )}
                </div>

                <div className="p-6 lg:p-8">
                  <h3 className="font-heading text-xl font-bold text-navy mb-3 leading-snug group-hover:text-gold-dark transition-colors">{v.title}</h3>
                  <p className="font-body text-navy-light/60 text-[0.95rem] leading-[1.7]">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  TRAMO 7: CTA                                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section ref={sCta.ref} className="py-24 px-5 lg:px-8 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-teal/[0.04] blur-[100px]"/>
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-gold/[0.04] blur-[100px]"/>
        </div>
        <div className={`max-w-[700px] mx-auto text-center relative z-10 transition-all duration-1000 ${sCta.vis ? 'opacity-100 scale-100':'opacity-0 scale-95'}`}>
          <i className="fa-solid fa-droplet text-3xl text-gold/30 mb-6 block"/>
          <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-bold text-pearl mb-6 leading-[1.1]">
            Únete a la Revolución{" "}
            <span className="bg-gradient-to-r from-gold via-gold-light to-teal bg-clip-text text-transparent italic font-light">Mineral</span>
          </h2>
          <p className="font-body text-pearl/60 mb-10 text-[1.15rem] leading-[1.8] max-w-[500px] mx-auto">
            Descubre una nueva forma de bienestar integral, espiritual y corporal. Vuelve al origen. <strong className="text-pearl">Vuelve a Linda Sal.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/tienda"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-body font-bold text-base bg-gradient-to-r from-gold to-gold-light text-navy shadow-[0_4px_20px_rgba(201,168,76,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(201,168,76,0.4)] relative group overflow-hidden">
              <span className="absolute inset-0 bg-white/40 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out z-0"/>
              <span className="relative z-10 flex items-center gap-2">Explorar Tienda <i className="fa-solid fa-arrow-right"/></span>
            </Link>
            <Link href="/"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-body font-bold text-base border-2 border-pearl/20 text-pearl transition-all hover:-translate-y-1 hover:bg-pearl/10 hover:border-pearl/50">
              <i className="fa-solid fa-house text-sm"/> Volver al Inicio
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-navy border-t border-white/5 py-10 px-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <i className="fa-solid fa-leaf text-gold"/>
          <i className="fa-solid fa-water text-teal"/>
        </div>
        <p className="font-body text-pearl/30 text-sm tracking-wide">© {new Date().getFullYear()} Lindasal — Sal Marina Orgánica · Ecuador</p>
      </footer>
    </main>
  );
}
