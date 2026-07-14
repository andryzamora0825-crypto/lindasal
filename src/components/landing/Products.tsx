"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import TiltCard from "@/components/TiltCard";

type Product = {
  index: string;
  brand: string;
  subtitle: string;
  tagline: string;
  description: string;
  features: string[];
  badge: string;
  surface: "navy" | "pearl" | "bone";
  accent: "gold" | "teal" | "warm";
  hero: string;
};

const products: Product[] = [
  {
    index: "01",
    brand: "Lindasal",
    subtitle: "Sal Marina Gourmet",
    tagline: "La sal que el mar guardó por millones de años.",
    description:
      "Sal marina virgen extraída artesanalmente. 40% menos cloruro de sodio que la sal común y 60% de minerales naturales — potasio, calcio, magnesio, hierro y más.",
    features: ["Gourmet 500 g · 227 g", "Sal Ahumada 227 g", "Sal Parrillera", "Sal con Especias"],
    badge: "100% Orgánica · Sin aditivos",
    surface: "bone",
    accent: "warm",
    hero: "M",
  },
  {
    index: "02",
    brand: "Nalleva",
    subtitle: "Skincare Mineral",
    tagline: "Tu piel hablando el lenguaje del mar.",
    description:
      "Línea de cuidado personal a base de sal marina y minerales naturales. Formulada para potenciar tu piel y bienestar con ingredientes 100% orgánicos.",
    features: ["Jabón Íntimo Natural", "Derma Tonificador", "Previene envejecimiento", "Regeneración celular"],
    badge: "Cuidado Natural",
    surface: "pearl",
    accent: "gold",
    hero: "N",
  },
  {
    index: "03",
    brand: "Aguademar Quinton",
    subtitle: "Suplemento Mineral",
    tagline: "El plasma del mar, dentro de ti.",
    description:
      "Agua de mar hipertónica e isotónica rica en electrolitos. El complemento ideal para regular el balance celular de tu cuerpo al instante.",
    features: ["Terapéutica 1 L · Hipertónica", "Rehidratante 1 L · Isotónica", "Restaura plasma", "Energía profunda"],
    badge: "Máxima energía",
    surface: "navy",
    accent: "teal",
    hero: "Q",
  },
];

const accentClasses = {
  warm: { text: "text-gold-dark", chip: "bg-gold/10 text-gold-dark border-gold/20", line: "from-gold to-gold-light" },
  gold: { text: "text-gold-dark", chip: "bg-gold/10 text-gold-dark border-gold/20", line: "from-gold-dark to-gold" },
  teal: { text: "text-teal-light", chip: "bg-teal/15 text-teal-light border-teal/25", line: "from-teal to-teal-light" },
};

export default function Products() {
  return (
    <section id="productos" className="relative bg-bone overflow-hidden" aria-labelledby="products-title">
      <header className="relative max-w-[1320px] mx-auto px-6 md:px-12 pt-28 pb-16 md:pt-36 md:pb-20 grid grid-cols-12 gap-y-8 md:gap-x-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 md:col-span-7"
        >
          <span className="eyebrow">Catálogo · Tres líneas</span>
          <h2
            id="products-title"
            className="mt-6 font-display text-display-lg text-navy"
          >
            Nacidas del mar.{" "}
            <em className="font-light text-navy/65">Pensadas para ti.</em>
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 md:col-span-5 md:pt-10 font-body text-navy/60 text-[1.02rem] leading-[1.85] max-w-md md:ml-auto"
        >
          Tres marcas, una herencia. Sal gourmet para la mesa, skincare mineral para la piel
          y agua de mar Quinton para tu equilibrio interno.
        </motion.p>
      </header>

      <div className="flex flex-col">
        {products.map((p, i) => (
          <ProductRow key={p.brand} product={p} reverse={i % 2 === 1} index={i} isLast={i === products.length - 1} />
        ))}
      </div>
    </section>
  );
}

function ProductRow({ product: p, reverse, index, isLast }: { product: Product; reverse: boolean; index: number; isLast: boolean }) {
  const acc = accentClasses[p.accent];
  const isDark = p.surface === "navy";
  const surfaceClass =
    p.surface === "navy"
      ? "bg-navy text-pearl"
      : p.surface === "pearl"
      ? "bg-pearl text-navy"
      : "bg-bone text-navy";

  return (
    <section
      className={`relative ${surfaceClass} ${isDark ? "texture-grain" : ""} overflow-hidden ${!isLast ? "border-b border-navy/[0.06]" : ""}`}
      aria-labelledby={`product-${p.index}`}
    >
      {isDark && (
        <>
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-teal/[0.08] blur-[140px]" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-gold/[0.05] blur-[120px]" />
        </>
      )}

      <div className="relative max-w-[1320px] mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className={`grid grid-cols-12 gap-y-12 md:gap-x-12 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
          <motion.div
            initial={{ opacity: 0, x: reverse ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-6 relative"
          >
            <TiltCard maxTilt={5} scale={1.015} className="group rounded-[2rem]">
            <div className={`shine-sweep relative aspect-[4/5] md:aspect-[5/6] rounded-[2rem] overflow-hidden border ${isDark ? "border-pearl/10" : "border-navy/10"}`}>
              <div className={`absolute inset-0 ${
                p.accent === "warm"
                  ? "bg-gradient-to-br from-pearl-dark via-pearl to-bone"
                  : p.accent === "gold"
                  ? "bg-gradient-to-br from-pearl via-pearl-dark to-pearl-mid"
                  : "bg-gradient-to-br from-navy-light via-navy to-navy-deep"
              }`} />
              <div className="absolute inset-0 bg-grid opacity-40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`font-display font-light leading-none select-none animate-drift transition-transform duration-1000 group-hover:scale-110 ${
                    isDark ? "text-pearl/15" : "text-navy/10"
                  }`}
                  style={{ fontSize: "clamp(16rem, 30vw, 28rem)" }}
                  aria-hidden="true"
                >
                  {p.hero}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className={`text-eyebrow ${isDark ? "text-pearl/60" : "text-navy/60"}`}>
                    Línea {p.index}
                  </span>
                  <p className={`mt-2 font-heading text-2xl ${isDark ? "text-pearl" : "text-navy"}`}>
                    {p.brand}
                  </p>
                </div>
                <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                  isDark ? "bg-pearl text-navy" : "bg-navy text-pearl"
                }`}>
                  <i className="fa-solid fa-arrow-up-right text-sm" aria-hidden="true" />
                </span>
              </div>
            </div>
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-6"
          >
            <div className="flex items-center gap-4">
              <span className={`font-heading text-5xl font-light leading-none ${isDark ? "text-pearl/30" : "text-navy/25"}`}>
                {p.index}
              </span>
              <span className={`block w-10 h-px ${isDark ? "bg-pearl/30" : "bg-navy/25"}`} />
              <span className={`text-eyebrow ${acc.text}`}>{p.brand}</span>
            </div>

            <h3
              id={`product-${p.index}`}
              className={`mt-6 font-display text-display-md ${isDark ? "text-pearl" : "text-navy"}`}
            >
              {p.subtitle.split(" ").map((word, i, arr) => (
                <span key={i} className={i === arr.length - 1 ? "italic font-light" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h3>
            <p className={`mt-4 font-body text-lg italic ${isDark ? "text-pearl/70" : "text-navy/70"}`}>
              {p.tagline}
            </p>
            <p className={`mt-6 font-body leading-[1.85] max-w-prose ${isDark ? "text-pearl/65" : "text-navy/60"}`}>
              {p.description}
            </p>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              {p.features.map((f, i) => (
                <li
                  key={f}
                  className={`flex items-start gap-3 py-3 border-b ${isDark ? "border-pearl/10" : "border-navy/10"}`}
                >
                  <span className={`font-body text-[0.65rem] tracking-[0.18em] font-bold mt-1 ${isDark ? "text-pearl/40" : "text-navy/40"}`}>
                    0{i + 1}
                  </span>
                  <span className={`font-body text-[0.92rem] ${isDark ? "text-pearl/85" : "text-navy/80"}`}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link href="/tienda" className={isDark ? "btn-gold" : "btn-ink"}>
                Comprar ahora
                <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
              </Link>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[0.65rem] tracking-[0.18em] uppercase font-bold border ${acc.chip}`}>
                <i className="fa-solid fa-leaf text-[0.6rem]" aria-hidden="true" /> {p.badge}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <span className={`absolute bottom-0 left-0 h-px w-1/3 bg-gradient-to-r ${acc.line} opacity-30`} aria-hidden="true" />
    </section>
  );
}
