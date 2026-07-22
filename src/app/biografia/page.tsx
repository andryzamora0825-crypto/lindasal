"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  ArrowUpRight,
  Compass,
  Eye,
  Gem,
  Droplets,
  Leaf,
  Waves,
  Stethoscope,
  ShieldCheck,
  FlaskConical,
  Layers,
  Sparkles,
  PlayCircle,
  Quote,
  ArrowRight,
  Home,
} from "lucide-react";
import TiltCard from "@/components/TiltCard";
import ScrollProgress from "@/components/landing/ScrollProgress";
import { useBrandLogos, getBrandLogo } from "@/lib/useBrandLogos";

/* ── Riel de capítulos (solo escritorio ancho): navegación de lectura ── */
const CHAPTERS = [
  { id: "cap-historia", label: "Historia" },
  { id: "cap-hitos", label: "Hitos" },
  { id: "cap-filosofia", label: "Filosofía" },
  { id: "cap-bienestar", label: "Bienestar" },
  { id: "cap-terapias", label: "Terapias" },
  { id: "cap-sal", label: "La sal" },
  { id: "cap-documental", label: "Documental" },
];

function ChapterRail() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const handler = () => {
      let current = "";
      for (const c of CHAPTERS) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.45) {
          current = c.id;
        }
      }
      setActive(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      aria-label="Capítulos de la biografía"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3.5 xl:flex"
    >
      {CHAPTERS.map((c) => {
        const isActive = active === c.id;
        return (
          <a key={c.id} href={`#${c.id}`} className="group flex items-center gap-3">
            <span
              className={`rounded-full bg-white/85 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] shadow-soft backdrop-blur transition-all duration-300 ${
                isActive
                  ? "translate-x-0 text-gold-dark opacity-100"
                  : "translate-x-1 text-navy/50 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {c.label}
            </span>
            <span
              className={`rounded-full transition-all duration-500 ${
                isActive
                  ? "h-2.5 w-2.5 bg-gold shadow-[0_0_0_3px_rgba(201,168,76,0.25),0_0_12px_rgba(201,168,76,0.6)]"
                  : "h-1.5 w-1.5 bg-navy/30 shadow-[0_0_0_2px_rgba(255,255,255,0.5)] group-hover:bg-gold/70"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}

const infoCard = {
  nombre: "Enrique Avellán Portes",
  rol: "Fundador de Lindasal",
  redes: {
    instagram: "https://www.instagram.com/lindasalec",
    whatsapp: "https://wa.me/message/MYAWP2XPANQSH1",
  },
  datos: [
    { label: "Industria", value: "Alimentos naturales" },
    { label: "Sede", value: "Ecuador" },
    { label: "Productos", value: "Sal marina, Aguademar, Aceite de Magnesio" },
    { label: "Filosofía", value: "100% Natural, sin químicos" },
    { label: "Minerales", value: "84 oligoelementos" },
    { label: "Sodio", value: "40% menos que sal común" },
  ],
  marcas: ["Lindasal", "Nalleva", "Aguademar Quinton"],
};

const milestones = [
  {
    year: "Origen",
    title: "Del manantial al cristal",
    body: "Enrique descubre fuentes de salmuera a 500 metros de altura, intactas, vivas, esperando ser reveladas con paciencia.",
  },
  {
    year: "Método",
    title: "Cristalización al sol",
    body: "Bajo el sol y el viento andino, cada cristal de sal nace sin químicos ni procesos industriales. La naturaleza dicta el tiempo.",
  },
  {
    year: "Marca",
    title: "Nace Lindasal",
    body: "Una marca que defiende la pureza, la mineralidad y la dignidad del trabajo artesanal en cada empaque.",
  },
  {
    year: "Hoy",
    title: "Una revolución mineral",
    body: "Tres líneas — Sal Gourmet, Aguademar Quinton y Aceite de Magnesio — que devuelven al cuerpo lo que la modernidad le quitó.",
  },
];

const identidad = [
  {
    id: "mision",
    label: "Misión",
    Icon: Compass,
    desc: "Transformar la riqueza de nuestras fuentes naturales a 500 metros de altura en un ingrediente esencial para la vida. Mediante la cristalización artesanal y el respeto por los tiempos de la naturaleza, entregamos una sal orgánica, rica en minerales y libre de procesos industriales.",
  },
  {
    id: "vision",
    label: "Visión",
    Icon: Eye,
    desc: "Consolidarnos como el proyecto líder en la revalorización de sales ancestrales, siendo el puente entre la pureza del manantial y la mesa del consumidor. Innovamos promoviendo un consumo consciente y sostenible que proteja nuestro ecosistema de altura.",
  },
  {
    id: "valores",
    label: "Valores",
    Icon: Gem,
    list: [
      { n: "Pureza de Origen", v: "Integridad total de la materia prima." },
      { n: "Sustentabilidad Activa", v: "Respeto absoluto al sol y al viento." },
      { n: "Excelencia Artesanal", v: "Valoración del trabajo manual." },
      { n: "Bienestar Integral", v: "Salud desde el equilibrio mineral." },
    ],
  },
];

const oceanoInterno = [
  {
    id: 1,
    name: "Solución Hipertónica",
    desc: "Una fuente natural de 118 minerales que apoya el bienestar general, potencia tu sistema inmune y regenera tus células desde la raíz.",
    Icon: Waves,
  },
  {
    id: 2,
    name: "Aceite de Magnesio",
    desc: "Absorción directa por vía tópica. Ideal para relajar músculos, disminuir el voltaje y favorecer el equilibrio del sistema nervioso.",
    Icon: Droplets,
  },
  {
    id: 3,
    name: "Sal Gourmet Lindasal",
    desc: "El sabor que tu cocina merece con la pureza que tu salud necesita. Tu alimentación cotidiana, transformada en experiencia.",
    Icon: Leaf,
  },
];

const tratamos = [
  "Rectificación Cervical",
  "Capsulitis Adhesiva (Hombro)",
  "Hipercifosis",
  "Hernias Discales",
  "Inflamación de Nervio Ciático",
  "Rectificación Lumbar",
  "Iliacos Desalineados",
  "Dolores de Rodillas",
  "Esguinces",
  "Luxaciones",
];

const terapias = [
  "Percutor",
  "Infrarrojos",
  "Ventosas",
  "Electroestimulación",
  "Ultrasonido",
  "Láser",
  "Acupuntura",
  "Masaje Craneal",
  "Masaje Visceral",
  "Ajustes Quiroprácticos",
];

const tiposDeSal = [
  {
    t: "Marina Integral",
    desc: "No refinada, secada al sol. Mantiene toda su matriz de minerales y oligoelementos intactos.",
    highlight: true,
  },
  {
    t: "Refinada / Yodada",
    desc: "Lavadura industrial a altas temperaturas. Pierde valor nutricional. Se le añade yodo y flúor químico.",
  },
  {
    t: "Cristal o Himalaya",
    desc: "Proveniente de minas terrestres (fósil). Destaca por su color rosado debido a su alto contenido en hierro.",
  },
  {
    t: "Flor de Sal",
    desc: "La capa superior que cristaliza al atardecer. Exclusiva, gourmet, rica en magnesio y yodo natural.",
    highlight: true,
  },
  {
    t: "Negra / Roja",
    desc: "Enriquecida naturalmente en regiones volcánicas con carbón activado o arcillas volcánicas de hierro.",
  },
];

const composicion = [
  { sym: "Na", name: "Sodio", no: 11 },
  { sym: "Mg", name: "Magnesio", no: 12 },
  { sym: "K", name: "Potasio", no: 19 },
  { sym: "Ca", name: "Calcio", no: 20 },
  { sym: "I", name: "Yodo", no: 53 },
  { sym: "Zn", name: "Zinc", no: 30 },
  { sym: "Fe", name: "Hierro", no: 26 },
  { sym: "Mn", name: "Manganeso", no: 25 },
  { sym: "Se", name: "Selenio", no: 34 },
  { sym: "B", name: "Boro", no: 5 },
  { sym: "Si", name: "Silicio", no: 14 },
  { sym: "P", name: "Fósforo", no: 15 },
  { sym: "Cu", name: "Cobre", no: 29 },
  { sym: "Cr", name: "Cromo", no: 24 },
  { sym: "Mo", name: "Molibdeno", no: 42 },
];

const videos = [
  {
    title: "Entrevista a Enrique Avellán — Parte 1",
    desc: "Primer segmento de la entrevista donde Enrique comparte la visión y los orígenes de Lindasal.",
    tag: "Entrevista",
    src: "/entrevistaaenrique/WhatsApp Video 2026-04-19 at 10.46.39 PM.mp4",
  },
  {
    title: "Entrevista a Enrique Avellán — Parte 2",
    desc: "Segundo segmento: Enrique explica a profundidad los beneficios y el impacto del agua de mar.",
    tag: "Entrevista",
    src: "/entrevistaaenrique/WhatsApp Video 2026-04-19 at 10.46.39 PM (3).mp4",
  },
  {
    title: "El proceso artesanal de Lindasal",
    desc: "Explora la recolección, el secado solar y el trabajo de Enrique en nuestras fuentes naturales.",
    tag: "Galería",
    photos: [
      "/fotosenrique/WhatsApp Image 2026-04-19 at 10.46.40 PM.jpeg",
      "/fotosenrique/WhatsApp Image 2026-04-19 at 10.46.40 PM (1).jpeg",
      "/fotosenrique/WhatsApp Image 2026-04-19 at 10.46.40 PM (2).jpeg",
      "/fotosenrique/WhatsApp Image 2026-04-19 at 10.46.40 PM (3).jpeg",
    ],
  },
];

function AutoCarousel({ photos }: { photos: string[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!photos || photos.length === 0) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % photos.length),
      3500,
    );
    return () => clearInterval(t);
  }, [photos]);

  return (
    <div className="absolute inset-0 h-full w-full">
      {photos.map((p, i) => (
        <img
          key={i}
          src={p}
          alt="Galería Lindasal"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent"
      />
    </div>
  );
}

function MagazineNav() {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-10">
        <Link
          href="/"
          aria-label="Lindasal — volver al inicio"
          className="group flex items-center gap-2.5"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-gold/10 transition-colors group-hover:bg-gold/20"
          >
            <Droplets className="h-4 w-4 text-gold" />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight text-pearl">
            Lindasal
          </span>
          <span
            aria-hidden="true"
            className="ml-1 hidden font-body text-[0.6rem] uppercase tracking-[0.22em] text-pearl/40 sm:inline"
          >
            Magazine
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-body text-[0.72rem] font-semibold text-pearl/80 transition-all hover:border-gold/40 hover:bg-white/10 hover:text-pearl"
          >
            <ArrowLeft aria-hidden="true" className="h-3 w-3" />
            <span>Inicio</span>
          </Link>
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-body text-[0.72rem] font-semibold text-pearl/80 transition-all hover:border-gold/40 hover:bg-white/10 hover:text-pearl"
          >
            <span>Feed</span>
          </Link>
          <Link
            href="/tienda"
            className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 font-body text-[0.72rem] font-bold text-navy transition-all hover:-translate-y-0.5 hover:bg-gold-light"
          >
            <ShoppingBag aria-hidden="true" className="h-3 w-3" />
            <span className="hidden sm:inline">Tienda</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default function BiografiaPage() {
  const heroRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const brandLogos = useBrandLogos();

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const portraitY = useTransform(
    heroProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -120],
  );
  const portraitScale = useTransform(
    heroProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [1, 1.08],
  );
  const headlineY = useTransform(
    heroProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, 60],
  );
  const headlineOpacity = useTransform(heroProgress, [0, 0.8], [1, 0.2]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            const vid = entry.target as HTMLVideoElement;
            if (!vid.paused) vid.pause();
          }
        });
      },
      { threshold: 0.1 },
    );
    const videoEls = document.querySelectorAll("video");
    videoEls.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-bone text-navy">
      <ScrollProgress />
      <ChapterRail />
      <MagazineNav />

      {/* ─── HERO EDITORIAL ─── */}
      <header
        ref={heroRef}
        className="relative isolate overflow-hidden bg-navy pt-32 pb-24 lg:min-h-screen lg:pb-40"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-32 right-0 h-[640px] w-[640px] rounded-full bg-gold/10 blur-[140px]" />
          <div className="absolute bottom-0 left-0 h-[520px] w-[520px] rounded-full bg-teal/10 blur-[120px]" />
          <div className="bg-grid absolute inset-0 opacity-[0.05]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:gap-16 lg:px-10">
          <motion.div
            style={{ y: headlineY, opacity: headlineOpacity }}
            className="lg:col-span-7"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-body text-[0.62rem] font-bold uppercase tracking-[0.22em] text-gold-light">
                <Sparkles aria-hidden="true" className="h-3 w-3" />
                Edición Bio · Vol. I
              </span>
              <span
                aria-hidden="true"
                className="hidden h-px w-16 bg-gradient-to-r from-gold/40 to-transparent sm:block"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-8 font-heading text-[clamp(3rem,7.5vw,6.5rem)] leading-[0.95] text-pearl"
            >
              La flor de sal que{" "}
              <span className="italic font-light text-gold-light">
                renueva
              </span>{" "}
              tu cuerpo desde la{" "}
              <span className="relative inline-block">
                <span className="italic font-light gradient-text">raíz.</span>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-[6px] w-full -rotate-1 rounded-sm bg-gold/25"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-10 max-w-xl border-l-2 border-gold/40 pl-6 font-body text-lg leading-[1.75] text-pearl/75"
            >
              <strong className="text-pearl">Linda Sal</strong> es la primera
              flor de sal en el mundo capaz de sanar, restaurar y regenerar,
              llevando cada mineral esencial desde las células hasta los
              tejidos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <a
                href={infoCard.redes.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                Agendar consulta
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a
                href={infoCard.redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Síguenos en Instagram
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.85 }}
              className="mt-16 hidden items-center gap-4 lg:flex"
            >
              <span
                aria-hidden="true"
                className="h-12 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent"
              />
              <span className="font-body text-[0.65rem] uppercase tracking-[0.32em] text-pearl/40">
                Desplázate para leer
              </span>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-5">
            <motion.aside
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 1,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ y: portraitY, scale: portraitScale }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-navy-mid/70 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-gold/15 via-transparent to-teal/15 opacity-50"
                />

                <div className="relative aspect-[4/5] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-mid to-navy-light">
                    <AutoCarousel
                      photos={videos[2].photos as string[]}
                    />
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/30 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                    <span className="font-body text-[0.6rem] uppercase tracking-[0.28em] text-gold">
                      Retrato
                    </span>
                    <h2 className="mt-2 font-heading text-3xl text-pearl">
                      {infoCard.nombre}
                    </h2>
                    <p className="mt-1 font-body text-sm text-pearl/60">
                      {infoCard.rol}
                    </p>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 p-6 lg:p-8">
                  {infoCard.datos.map((d) => (
                    <div key={d.label}>
                      <dt className="font-body text-[0.62rem] uppercase tracking-[0.18em] text-gold/70">
                        {d.label}
                      </dt>
                      <dd className="mt-1 font-body text-sm font-medium text-pearl/85">
                        {d.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="border-t border-white/10 p-6 lg:p-8">
                  <span className="font-body text-[0.62rem] uppercase tracking-[0.22em] text-pearl/40">
                    Marcas
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {infoCard.marcas.map((m) => {
                      const logo = getBrandLogo(brandLogos, m);
                      return logo ? (
                        <span
                          key={m}
                          title={m}
                          className="flex items-center justify-center h-9 px-3 rounded-full bg-white/95 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.4)]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logo}
                            alt={`Logo ${m}`}
                            loading="lazy"
                            className="h-5 w-auto max-w-[88px] object-contain"
                          />
                        </span>
                      ) : (
                        <span
                          key={m}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-body text-[0.7rem] font-semibold text-pearl/80"
                        >
                          {m}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </header>

      {/* ─── ARTICLE OPENING WITH DROP CAP ─── */}
      <section id="cap-historia" className="relative bg-bone py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4"
            >
              <span className="eyebrow">Capítulo I</span>
              <h2 className="mt-5 font-heading text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.05] text-navy">
                Una vida dedicada a la pureza del{" "}
                <span className="italic gradient-text-warm">cristal.</span>
              </h2>
              <div className="divider-mark mt-8" aria-hidden="true" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lg:col-span-8"
            >
              <p className="font-body text-lg leading-[1.95] text-navy/75 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-heading first-letter:text-7xl first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-gold">
                Hay quienes ven la sal como un grano más en la cocina. Enrique
                Avellán Portes la mira distinto: la observa nacer, la escucha
                cristalizar, la respeta. Desde un manantial andino, a 500
                metros sobre el mar, Lindasal emerge como la materialización de
                una idea simple y radical — devolverle al cuerpo aquello que la
                industrialización le quitó.
              </p>
              <p className="mt-6 font-body text-lg leading-[1.95] text-navy/70">
                Cada cristal es un acto de fe. Sin químicos, sin atajos, sin
                lavados industriales. Solo el sol, el viento y la mano de quien
                sabe esperar. El resultado no es un producto: es un manifiesto
                que se sirve en la mesa, una pequeña revolución mineral que
                reconcilia al consumidor con su origen.
              </p>

              <figure className="mt-12">
                <Quote
                  aria-hidden="true"
                  className="h-8 w-8 text-gold/60"
                />
                <blockquote className="mt-4 font-heading text-3xl italic leading-[1.25] text-navy/90 sm:text-4xl">
                  &ldquo;La sal verdadera no se fabrica. Se acompaña hasta que
                  decide nacer.&rdquo;
                </blockquote>
                <figcaption className="mt-4 font-body text-xs uppercase tracking-[0.22em] text-navy/45">
                  — Enrique Avellán
                </figcaption>
              </figure>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TIMELINE / KINETIC YEARS ─── */}
      <section id="cap-hitos" className="relative overflow-hidden bg-navy py-28 lg:py-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50"
        >
          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-teal/10 blur-[140px]" />
          <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <span className="eyebrow text-gold">Capítulo II · Hitos</span>
            <h2 className="mt-5 font-heading text-[clamp(2.25rem,5vw,4rem)] leading-[1] text-pearl">
              Cuatro momentos que{" "}
              <span className="italic gradient-text-cool">tallaron</span> la
              marca.
            </h2>
            <p className="mt-6 max-w-lg font-body text-pearl/60">
              Una bitácora breve para entender cómo una intuición se convirtió
              en una práctica, y luego en un legado.
            </p>
          </motion.div>

          <ol className="mt-20 space-y-12 lg:space-y-20">
            {milestones.map((m, i) => (
              <motion.li
                key={m.year}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="grid items-baseline gap-6 border-t border-white/10 pt-10 lg:grid-cols-12 lg:gap-12"
              >
                <div className="lg:col-span-4">
                  <p className="font-heading text-[clamp(4rem,9vw,7.5rem)] leading-[0.85] italic font-light text-gold-light">
                    {m.year}
                  </p>
                </div>
                <div className="lg:col-span-2 lg:pt-6">
                  <span className="font-body text-[0.65rem] uppercase tracking-[0.28em] text-pearl/40">
                    0{i + 1}
                  </span>
                </div>
                <div className="lg:col-span-6">
                  <h3 className="font-heading text-2xl text-pearl sm:text-3xl">
                    {m.title}
                  </h3>
                  <p className="mt-4 max-w-xl font-body text-base leading-[1.85] text-pearl/65">
                    {m.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── IDENTIDAD / FILOSOFÍA ─── */}
      <section id="cap-filosofia" className="relative bg-bone py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="eyebrow">Capítulo III · Filosofía</span>
            <h2 className="mt-5 font-heading text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] text-navy">
              Tres pilares que{" "}
              <span className="italic gradient-text-warm">sostienen</span> cada
              cristal.
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {identidad.map((item, i) => (
              <TiltCard key={item.id} maxTilt={5} scale={1.01} className="h-full rounded-[2rem]">
              <motion.article
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="surface-card group relative flex h-full flex-col rounded-[2rem] p-8 lg:p-10"
              >
                <div className="mb-8 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold-dark transition-all duration-500 group-hover:rotate-[-6deg] group-hover:bg-gold/20">
                    <item.Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="font-body text-[0.62rem] uppercase tracking-[0.28em] text-navy/40">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-heading text-3xl text-navy">
                  {item.label}
                </h3>
                <div className="divider-mark mt-4" aria-hidden="true" />

                {item.desc && (
                  <p className="mt-6 font-body text-[0.95rem] leading-[1.85] text-navy/65">
                    {item.desc}
                  </p>
                )}

                {item.list && (
                  <ul className="mt-6 space-y-5">
                    {item.list.map((li) => (
                      <li key={li.n}>
                        <p className="font-heading text-lg text-navy">
                          {li.n}
                        </p>
                        <p className="mt-1 font-body text-sm text-navy/55">
                          {li.v}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.article>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── OCÉANO INTERNO ─── */}
      <section id="cap-bienestar" className="relative overflow-hidden bg-navy py-28 lg:py-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute right-0 top-0 h-[700px] w-[700px] rounded-full bg-teal/10 blur-[140px]" />
          <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="eyebrow justify-center text-gold">
              Capítulo IV · Bienestar
            </span>
            <h2 className="mt-5 font-heading text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1] text-pearl">
              Tu cuerpo es, en esencia,{" "}
              <span className="italic gradient-text-cool">
                un océano interno.
              </span>
            </h2>
            <p className="mt-7 font-body text-lg leading-[1.85] text-pearl/65">
              La falta de magnesio y minerales esenciales es la causa oculta de
              muchos malestares modernos. Devuélvele a tu vida la alcalinidad
              que pide a gritos.
            </p>
          </motion.div>

          <div className="mt-20 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {oceanoInterno.map((p, i) => (
              <TiltCard key={p.id} maxTilt={6} scale={1.015} className="h-full rounded-[2rem]">
              <motion.article
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-navy-mid/60 p-10 backdrop-blur-xl transition-colors duration-500 hover:border-gold/30 hover:bg-navy-mid/80"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-teal/30 bg-teal/10 text-teal-light">
                  <p.Icon aria-hidden="true" className="h-6 w-6" />
                </span>

                <h3 className="mt-8 font-heading text-2xl text-pearl">
                  {p.name}
                </h3>
                <p className="mt-4 font-body text-[0.95rem] leading-[1.8] text-pearl/55">
                  {p.desc}
                </p>

                <span className="mt-8 inline-flex items-center gap-2 font-body text-[0.65rem] font-bold uppercase tracking-[0.22em] text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  Renueva tu biología
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </span>
              </motion.article>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLÍNICA / TRATAMIENTOS ─── */}
      <section id="cap-terapias" className="relative bg-pearl py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div className="surface-glass texture-grain relative overflow-hidden rounded-[2.5rem] p-10 lg:p-14">
                <div
                  aria-hidden="true"
                  className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gold/10 blur-3xl"
                />
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-gold">
                    <Stethoscope aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <h3 className="font-heading text-3xl text-navy lg:text-4xl">
                    Lo que tratamos
                  </h3>
                </div>

                <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  {tratamos.map((item, idx) => (
                    <li
                      key={item}
                      className="group flex items-baseline gap-3 border-b border-navy/5 pb-3"
                    >
                      <span className="font-heading text-sm font-light text-gold-dark/60 tabular-nums">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="font-body text-[0.95rem] text-navy/85 transition-colors group-hover:text-navy">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="lg:col-span-5"
            >
              <span className="eyebrow-pill">Metodología especializada</span>
              <h2 className="mt-6 font-heading text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.05] text-navy">
                Terapias{" "}
                <span className="italic gradient-text-warm">aplicadas.</span>
              </h2>
              <p className="mt-6 font-body text-lg leading-[1.85] text-navy/65">
                Combinamos tecnología de vanguardia y conocimientos
                ancestrales. Tratamientos holísticos que van al origen del
                dolor, no solo al síntoma.
              </p>

              <div className="mt-10 flex flex-wrap gap-2.5">
                {terapias.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-navy/10 bg-white/80 px-3.5 py-1.5 font-body text-xs font-semibold text-navy/75 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:bg-white hover:text-navy"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-12 flex items-center gap-5 rounded-2xl border border-teal/20 bg-white p-6 shadow-[0_8px_30px_-10px_rgba(126,202,195,0.25)]">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal to-teal-dark text-white">
                  <ShieldCheck aria-hidden="true" className="h-5 w-5" />
                </span>
                <p className="font-body text-sm leading-relaxed text-navy/75">
                  Autorizados legalmente por el{" "}
                  <strong className="text-teal-dark">Acces</strong> y el{" "}
                  <strong className="text-teal-dark">
                    Ministerio de Salud Pública (MSP)
                  </strong>{" "}
                  de Ecuador.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── ENCICLOPEDIA DE LA SAL ─── */}
      <section id="cap-sal" className="relative overflow-hidden bg-navy-light py-28 lg:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
        >
          <div className="bg-grid absolute inset-0 opacity-[0.06]" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="eyebrow text-gold">Capítulo V · Anatomía</span>
            <h2 className="mt-5 font-heading text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] text-pearl">
              No toda la sal es{" "}
              <span className="italic gradient-text-warm">igual.</span>
            </h2>
            <p className="mt-6 font-body text-lg leading-[1.85] text-pearl/60">
              Una breve enciclopedia para distinguir un alimento orgánico de un
              producto industrializado.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-10 xl:grid-cols-12 xl:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 xl:col-span-5"
            >
              <h3 className="flex items-center gap-3 font-body text-[0.65rem] font-bold uppercase tracking-[0.22em] text-gold">
                <Layers aria-hidden="true" className="h-3.5 w-3.5" />
                Tipos de sal a nivel mundial
              </h3>

              {tiposDeSal.map((sal) => (
                <TiltCard key={sal.t} maxTilt={4} scale={1.01} className="rounded-2xl">
                <article
                  className={`group rounded-2xl border p-6 transition-colors ${
                    sal.highlight
                      ? "border-gold/25 bg-navy/40 hover:border-gold/40"
                      : "border-white/5 bg-navy/30 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4
                      className={`font-heading text-xl ${
                        sal.highlight ? "text-pearl" : "text-pearl/70"
                      }`}
                    >
                      {sal.t}
                    </h4>
                    {sal.highlight && (
                      <span className="shrink-0 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-body text-[0.6rem] font-bold uppercase tracking-[0.18em] text-gold-light">
                        Lindasal
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-body text-sm leading-relaxed text-pearl/45">
                    {sal.desc}
                  </p>
                </article>
                </TiltCard>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-navy-mid/70 p-8 backdrop-blur-xl lg:p-12 xl:col-span-7"
            >
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 h-80 w-80 rounded-full bg-teal/10 blur-3xl"
              />

              <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <h3 className="flex items-center gap-3 font-heading text-2xl text-pearl lg:text-3xl">
                    Composición marina
                    <FlaskConical
                      aria-hidden="true"
                      className="h-5 w-5 text-teal"
                    />
                  </h3>
                  <p className="mt-3 max-w-md font-body text-sm leading-[1.7] text-pearl/55">
                    El{" "}
                    <strong className="text-pearl/80">
                      Cloruro de Sodio (NaCl)
                    </strong>{" "}
                    se sostiene sobre una matriz viva de minerales que la
                    naturaleza balanceó a la perfección.
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-teal/25 bg-teal/10 px-3.5 py-1.5 font-body text-xs font-bold text-teal-light">
                  84 oligoelementos
                </span>
              </div>

              <div className="relative mt-10 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:gap-3">
                {composicion.map((elem, idx) => (
                  <motion.div
                    key={elem.sym}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.025,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group relative aspect-square cursor-default rounded-xl border border-white/5 bg-navy/60 p-2 transition-all duration-500 hover:-translate-y-1 hover:border-gold/30 hover:bg-gold/5"
                  >
                    <span className="absolute left-2 top-1.5 font-body text-[0.55rem] font-bold tabular-nums text-pearl/25">
                      {elem.no}
                    </span>
                    <div className="flex h-full flex-col items-center justify-center">
                      <span className="font-heading text-2xl font-medium text-pearl transition-colors group-hover:text-gold">
                        {elem.sym}
                      </span>
                      <span className="mt-0.5 truncate font-body text-[0.6rem] uppercase tracking-wider text-pearl/45">
                        {elem.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── VIDEOS / GALERÍA ─── */}
      <section id="cap-documental" className="relative bg-bone py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end"
          >
            <div className="max-w-2xl">
              <span className="eyebrow">Capítulo VI · Documental</span>
              <h2 className="mt-5 font-heading text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] text-navy">
                La filosofía detrás de cada{" "}
                <span className="italic gradient-text-warm">cristal.</span>
              </h2>
            </div>
            <p className="max-w-sm font-body text-base text-navy/55">
              Material audiovisual para conocer el método, el lugar y la voz
              del fundador.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 md:grid-cols-3 lg:gap-8">
            {videos.map((v, i) => (
              <motion.article
                key={v.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group overflow-hidden rounded-[2rem] border border-pearl-dark/60 bg-white shadow-[0_4px_24px_-8px_rgba(10,22,40,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(10,22,40,0.18)]"
              >
                <div className="shine-sweep relative aspect-[4/3] overflow-hidden bg-navy">
                  {v.src ? (
                    <video
                      src={v.src}
                      controls
                      preload="metadata"
                      className="absolute inset-0 z-20 h-full w-full bg-black/50 object-cover"
                      onPlay={(e) => {
                        const all = document.querySelectorAll("video");
                        all.forEach((vid) => {
                          if (vid !== e.currentTarget) vid.pause();
                        });
                      }}
                    />
                  ) : v.photos ? (
                    <>
                      <AutoCarousel photos={v.photos} />
                      <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/15 px-3 py-1 font-body text-[0.6rem] font-bold uppercase tracking-[0.22em] text-gold-light backdrop-blur-md">
                        {v.tag}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-mid to-navy-light" />
                      <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <PlayCircle
                          aria-hidden="true"
                          className="h-16 w-16 text-pearl/40 transition-colors group-hover:text-gold"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="p-7 lg:p-8">
                  <span className="font-body text-[0.6rem] uppercase tracking-[0.22em] text-gold-dark">
                    {v.tag}
                  </span>
                  <h3 className="mt-2 font-heading text-2xl leading-tight text-navy">
                    {v.title}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-[1.75] text-navy/55">
                    {v.desc}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="relative overflow-hidden bg-navy py-28 lg:py-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-teal/10 blur-[120px]" />
          <div className="absolute -bottom-32 -left-32 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto max-w-3xl px-5 text-center lg:px-10"
        >
          <Droplets
            aria-hidden="true"
            className="mx-auto h-8 w-8 text-gold/60"
          />
          <h2 className="mt-6 font-heading text-[clamp(2.5rem,5vw,4rem)] leading-[1] text-pearl">
            Únete a la revolución{" "}
            <span className="italic gradient-text-warm">mineral.</span>
          </h2>
          <p className="mt-7 font-body text-lg leading-[1.85] text-pearl/60">
            Una nueva forma de bienestar integral, espiritual y corporal.
            Vuelve al origen.{" "}
            <strong className="text-pearl">Vuelve a Linda Sal.</strong>
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/tienda" className="btn-gold">
              Explorar tienda
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link href="/" className="btn-ghost">
              <Home aria-hidden="true" className="h-4 w-4" />
              Volver al inicio
            </Link>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 bg-navy py-10 px-5 text-center">
        <div
          className="mx-auto mb-4 inline-flex items-center gap-2 opacity-50"
          aria-hidden="true"
        >
          <Leaf className="h-4 w-4 text-gold" />
          <Waves className="h-4 w-4 text-teal" />
        </div>
        <p className="font-body text-sm tracking-wide text-pearl/30">
          © {new Date().getFullYear()} Lindasal — Sal Marina Orgánica · Ecuador
        </p>
      </footer>
    </main>
  );
}
