"use client";

import React from "react";
import { Product } from "@/types/store";
import { motion } from "framer-motion";
import { Plus, Eye, Droplet, FlaskConical, Sparkles } from "lucide-react";
import TiltCard from "@/components/TiltCard";

interface ProductCardProps {
  product: Product;
  onQuickView: () => void;
  onAdd: () => void;
  featured?: boolean;
}

const getBrandLabel = (brand?: string) => {
  switch (brand) {
    case "LINDASAL":
      return "Lindasal";
    case "AGUADEMAR QUINTON":
      return "Aguademar";
    case "NAVELLA":
      return "Navella";
    default:
      return null;
  }
};

const getCategoryLabel = (cat: string) => {
  switch (cat) {
    case "comestible":
      return "Comestible";
    case "belleza":
      return "Belleza";
    case "terapeutica":
      return "Terapeutica";
    case "combos":
      return "Combos";
    default:
      return cat;
  }
};

const BrandIcon: React.FC<{ brand?: string; className?: string }> = ({ brand, className }) => {
  if (brand === "AGUADEMAR QUINTON") return <Droplet className={className} strokeWidth={1.25} />;
  if (brand === "NAVELLA") return <Sparkles className={className} strokeWidth={1.25} />;
  return <FlaskConical className={className} strokeWidth={1.25} />;
};

export default function ProductCard({ product, onQuickView, onAdd, featured = false }: ProductCardProps) {
  const isLowStock = product.stock < 10;
  const brandLabel = getBrandLabel(product.brand);
  const hasDiscount = !!(product.discount_percentage && product.discount_percentage > 0);
  const finalPrice = hasDiscount
    ? product.price * (1 - (product.discount_percentage as number) / 100)
    : product.price;

  return (
    <TiltCard maxTilt={featured ? 3 : 6} scale={1.012} className="h-full rounded-3xl">
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-pearl-dark/40 hover:border-gold/40 hover:shadow-raised transition-[border-color,box-shadow] duration-500 ${featured ? "lg:flex-row lg:col-span-2" : ""}`}
    >
      <button
        type="button"
        onClick={onQuickView}
        aria-label={`Ver ${product.name}`}
        className={`shine-sweep relative block bg-gradient-to-br from-pearl/60 via-bone to-white overflow-hidden cursor-pointer ${featured ? "aspect-square lg:aspect-auto lg:w-1/2 lg:min-h-[420px]" : "aspect-[4/5]"}`}
      >
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain p-8 sm:p-10 mix-blend-multiply group-hover:scale-105 transition-transform duration-[900ms] ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy/15 group-hover:text-navy/25 group-hover:scale-105 transition-all duration-[900ms] ease-out">
            <BrandIcon brand={product.brand} className="w-24 h-24" />
          </div>
        )}

        <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-10">
          {brandLabel && (
            <span className="text-eyebrow text-[0.6rem] text-navy/70 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full">
              {brandLabel}
            </span>
          )}
          {product.is_featured && (
            <span className="text-eyebrow text-[0.6rem] text-gold-dark bg-gold/10 px-2.5 py-1 rounded-full border border-gold/20">
              Destacado
            </span>
          )}
        </div>

        {hasDiscount && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-navy text-pearl text-xs font-semibold tracking-wider px-3 py-1.5 rounded-full">
              -{product.discount_percentage}%
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/5 transition-colors duration-500 pointer-events-none" />

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-navy text-[0.7rem] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-soft">
            <Eye className="w-3 h-3" strokeWidth={2} /> Ver
          </span>
        </div>
      </button>

      <div className={`flex flex-col p-6 sm:p-7 flex-1 ${featured ? "lg:p-10 lg:justify-center" : ""}`}>
        <span className="text-eyebrow text-navy/40 mb-3">{getCategoryLabel(product.category)}</span>

        <h3
          className={`font-heading text-navy leading-tight mb-3 ${featured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl sm:text-2xl"}`}
        >
          <button
            type="button"
            onClick={onQuickView}
            className="text-left hover:text-gold-dark transition-colors duration-300"
          >
            {product.name}
          </button>
        </h3>

        {featured && (
          <p className="text-sm text-navy/60 leading-relaxed mb-6 line-clamp-3">{product.description}</p>
        )}

        <div className="mt-auto pt-4 flex items-end justify-between gap-3">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="font-body text-xs text-navy/35 line-through">${product.price.toFixed(2)}</span>
            )}
            <span className="font-heading font-semibold text-2xl sm:text-3xl text-gold-dark leading-none">
              ${finalPrice.toFixed(2)}
            </span>
            {isLowStock && (
              <span className="text-[0.65rem] font-semibold tracking-widest uppercase text-navy/50 mt-1">
                Solo {product.stock}
              </span>
            )}
          </div>

          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.88 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            aria-label={`Agregar ${product.name} al carrito`}
            className="shrink-0 w-12 h-12 rounded-full bg-navy text-pearl flex items-center justify-center hover:bg-gold hover:text-navy transition-colors duration-500 shadow-soft"
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </motion.article>
    </TiltCard>
  );
}
