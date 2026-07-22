"use client";

import React, { useState, useEffect, useRef } from "react";
import { Product } from "@/types/store";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Leaf, MapPin, Package, Droplet, FlaskConical, Sparkles } from "lucide-react";
import { useBrandLogos, getBrandLogo } from "@/lib/useBrandLogos";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (product: Product, quantity: number) => void;
  onOrderWhatsApp: (product: Product, quantity: number) => void;
}

const BrandIcon: React.FC<{ brand?: string; className?: string }> = ({ brand, className }) => {
  if (brand === "AGUADEMAR QUINTON") return <Droplet className={className} strokeWidth={1.25} />;
  if (brand === "NAVELLA") return <Sparkles className={className} strokeWidth={1.25} />;
  return <FlaskConical className={className} strokeWidth={1.25} />;
};

const getBrandLabel = (brand?: string) => {
  switch (brand) {
    case "LINDASAL":
      return "Lindasal";
    case "AGUADEMAR QUINTON":
      return "Aguademar Quinton";
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

export default function ProductModal({ product, onClose, onAdd, onOrderWhatsApp }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const brandLogos = useBrandLogos();
  const brandLogo = getBrandLogo(brandLogos, product?.brand);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => closeBtnRef.current?.focus(), 100);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && product) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [product, onClose]);

  const hasDiscount = !!(product?.discount_percentage && product.discount_percentage > 0);
  const finalPrice = product
    ? hasDiscount
      ? product.price * (1 - (product.discount_percentage as number) / 100)
      : product.price
    : 0;

  return (
    <AnimatePresence>
      {product && (
        <div
          className="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-name"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-navy/70 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-bone w-full sm:max-w-[1080px] max-h-[92vh] sm:rounded-[2rem] rounded-t-[2rem] overflow-hidden flex flex-col md:flex-row shadow-floating"
          >
            {/* Asa de arrastre (solo móvil) */}
            <span
              aria-hidden="true"
              className="md:hidden absolute top-2.5 left-1/2 -translate-x-1/2 z-30 h-1 w-10 rounded-full bg-navy/15"
            />
            <button
              ref={closeBtnRef}
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full text-navy hover:bg-navy hover:text-pearl transition-colors duration-300 shadow-soft"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            <div className="relative w-full md:w-[52%] shrink-0 bg-gradient-to-br from-pearl via-bone to-pearl-mid flex items-center justify-center min-h-[170px] max-h-[230px] sm:max-h-none sm:min-h-[420px] md:min-h-[600px] p-6 sm:p-16">
              <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" aria-hidden="true" />
              <div className="absolute -top-16 -left-16 w-72 h-72 bg-gold/10 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />

              {product.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <motion.img
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  src={product.image_url}
                  alt={product.name}
                  className="relative z-10 w-full h-full max-h-[190px] sm:max-h-[460px] object-contain mix-blend-multiply"
                />
              ) : brandLogo ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  src={brandLogo}
                  alt={getBrandLabel(product.brand) || "Marca"}
                  className="relative z-10 max-w-[55%] max-h-[60%] sm:max-w-[60%] sm:max-h-[50%] object-contain opacity-90 mix-blend-multiply"
                />
              ) : (
                <div className="relative z-10 text-navy/20">
                  <BrandIcon brand={product.brand} className="w-16 h-16 sm:w-32 sm:h-32" />
                </div>
              )}

              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-row sm:flex-col gap-2 z-20">
                {brandLogo && product.image_url ? (
                  <span className="flex items-center justify-center h-9 px-3 rounded-full bg-white/90 backdrop-blur-md shadow-soft border border-pearl-dark/30" title={getBrandLabel(product.brand) || undefined}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={brandLogo} alt={getBrandLabel(product.brand) || "Marca"} className="h-6 w-auto max-w-[90px] object-contain" />
                  </span>
                ) : getBrandLabel(product.brand) && (
                  <span className="text-eyebrow text-[0.65rem] text-navy/70 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full">
                    {getBrandLabel(product.brand)}
                  </span>
                )}
                {product.is_featured && (
                  <span className="text-eyebrow text-[0.65rem] text-gold-dark bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20">
                    Destacado
                  </span>
                )}
              </div>
            </div>

            <div className="relative w-full md:w-[48%] flex flex-col flex-1 min-h-0">
              {/* Zona de lectura con scroll propio */}
              <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-10 md:p-12 pb-4">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="eyebrow mb-3 sm:mb-4"
              >
                {getCategoryLabel(product.category)}
              </motion.span>

              <motion.h2
                id="modal-name"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-2xl sm:text-4xl md:text-5xl text-navy leading-[1.08] mb-3 sm:mb-5"
              >
                {product.name}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="flex items-baseline gap-3 mb-4 sm:mb-6"
              >
                <span className="font-heading font-semibold text-[1.65rem] sm:text-4xl text-gold-dark">
                  ${finalPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="font-body text-base text-navy/35 line-through">${product.price.toFixed(2)}</span>
                    <span className="text-eyebrow text-[0.6rem] bg-navy text-pearl px-2 py-1 rounded-full">
                      -{product.discount_percentage}%
                    </span>
                  </>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-12 h-px bg-gold/40 mb-4 sm:mb-6"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="text-navy/65 leading-relaxed text-[0.85rem] sm:text-base mb-5 sm:mb-8"
              >
                {product.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="grid grid-cols-3 gap-2 sm:gap-3"
              >
                <div className="flex flex-col items-center sm:items-start gap-1.5 sm:gap-2 rounded-2xl bg-white/60 border border-pearl-dark/40 px-2 py-3 sm:bg-transparent sm:border-0 sm:p-0 text-center sm:text-left">
                  <Leaf className="w-4 h-4 text-teal-dark" strokeWidth={1.5} />
                  <span className="text-[0.65rem] sm:text-[0.7rem] text-navy/60 leading-tight">100% Natural</span>
                </div>
                <div className="flex flex-col items-center sm:items-start gap-1.5 sm:gap-2 rounded-2xl bg-white/60 border border-pearl-dark/40 px-2 py-3 sm:bg-transparent sm:border-0 sm:p-0 text-center sm:text-left">
                  <MapPin className="w-4 h-4 text-gold-dark" strokeWidth={1.5} />
                  <span className="text-[0.65rem] sm:text-[0.7rem] text-navy/60 leading-tight">Origen Ecuador</span>
                </div>
                <div className="flex flex-col items-center sm:items-start gap-1.5 sm:gap-2 rounded-2xl bg-white/60 border border-pearl-dark/40 px-2 py-3 sm:bg-transparent sm:border-0 sm:p-0 text-center sm:text-left">
                  <Package className="w-4 h-4 text-navy/60" strokeWidth={1.5} />
                  <span className="text-[0.65rem] sm:text-[0.7rem] text-navy/60 leading-tight">{product.stock} disponibles</span>
                </div>
              </motion.div>
              </div>

              {/* Barra de compra fija: cantidad + CTAs siempre visibles */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="shrink-0 border-t border-pearl-dark/60 bg-bone/95 backdrop-blur-md px-5 pt-4 sm:px-10 sm:pt-5 md:px-12"
                style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
              >
                <div className="flex items-center justify-between gap-4 mb-3.5 sm:mb-5">
                  <span className="text-eyebrow text-navy/50">Cantidad</span>
                  <div className="flex items-center border border-pearl-dark rounded-full overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                      aria-label="Reducir cantidad"
                      className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-navy hover:bg-gold/10 hover:text-gold-dark transition-colors duration-300"
                    >
                      <Minus className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <span className="w-10 sm:w-11 text-center font-heading text-lg text-navy tabular-nums">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => (q < product.stock ? q + 1 : q))}
                      aria-label="Aumentar cantidad"
                      className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-navy hover:bg-gold/10 hover:text-gold-dark transition-colors duration-300"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-row gap-2.5 sm:gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => onAdd(product, quantity)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-navy text-pearl font-semibold py-3.5 sm:py-4 px-4 sm:px-6 rounded-full hover:bg-navy-light transition-colors duration-300 text-[0.8rem] sm:text-sm tracking-wide"
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" strokeWidth={2} />
                    <span className="truncate">Anadir al carrito</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => onOrderWhatsApp(product, quantity)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-navy font-semibold py-3.5 sm:py-4 px-4 sm:px-6 rounded-full hover:bg-gold-light transition-colors duration-300 text-[0.8rem] sm:text-sm tracking-wide"
                  >
                    <span className="truncate">Comprar por WhatsApp</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
