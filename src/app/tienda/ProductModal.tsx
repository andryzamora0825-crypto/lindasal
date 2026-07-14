"use client";

import React, { useState, useEffect, useRef } from "react";
import { Product } from "@/types/store";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Leaf, MapPin, Package, Droplet, FlaskConical, Sparkles } from "lucide-react";

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
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
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
            className="relative bg-bone w-full sm:max-w-[1080px] sm:max-h-[92vh] max-h-[95vh] sm:rounded-[2rem] rounded-t-[2rem] overflow-hidden flex flex-col md:flex-row shadow-floating"
          >
            <button
              ref={closeBtnRef}
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-11 h-11 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full text-navy hover:bg-navy hover:text-pearl transition-colors duration-300 shadow-soft"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            <div className="relative w-full md:w-[52%] bg-gradient-to-br from-pearl via-bone to-pearl-mid flex items-center justify-center min-h-[280px] sm:min-h-[420px] md:min-h-[600px] p-10 sm:p-16">
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
                  className="relative z-10 w-full h-full max-h-[460px] object-contain mix-blend-multiply"
                />
              ) : (
                <div className="relative z-10 text-navy/20">
                  <BrandIcon brand={product.brand} className="w-32 h-32" />
                </div>
              )}

              <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                {getBrandLabel(product.brand) && (
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

            <div className="relative w-full md:w-[48%] p-6 sm:p-10 md:p-12 flex flex-col max-h-[60vh] md:max-h-none overflow-y-auto">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="eyebrow mb-4"
              >
                {getCategoryLabel(product.category)}
              </motion.span>

              <motion.h2
                id="modal-name"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-3xl sm:text-4xl md:text-5xl text-navy leading-[1.05] mb-5"
              >
                {product.name}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="flex items-baseline gap-3 mb-6"
              >
                <span className="font-heading font-semibold text-3xl sm:text-4xl text-gold-dark">
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
                className="w-12 h-px bg-gold/40 mb-6"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="text-navy/65 leading-relaxed text-sm sm:text-base mb-8"
              >
                {product.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="grid grid-cols-3 gap-3 mb-8 pb-8 border-b border-pearl-dark/60"
              >
                <div className="flex flex-col items-start gap-2">
                  <Leaf className="w-4 h-4 text-teal-dark" strokeWidth={1.5} />
                  <span className="text-[0.7rem] text-navy/60 leading-tight">100% Natural</span>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <MapPin className="w-4 h-4 text-gold-dark" strokeWidth={1.5} />
                  <span className="text-[0.7rem] text-navy/60 leading-tight">Origen Ecuador</span>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Package className="w-4 h-4 text-navy/60" strokeWidth={1.5} />
                  <span className="text-[0.7rem] text-navy/60 leading-tight">{product.stock} disponibles</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-auto"
              >
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-eyebrow text-navy/50">Cantidad</span>
                  <div className="flex items-center border border-pearl-dark rounded-full overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                      aria-label="Reducir cantidad"
                      className="w-11 h-11 flex items-center justify-center text-navy hover:bg-gold/10 hover:text-gold-dark transition-colors duration-300"
                    >
                      <Minus className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <span className="w-11 text-center font-heading text-lg text-navy">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => (q < product.stock ? q + 1 : q))}
                      aria-label="Aumentar cantidad"
                      className="w-11 h-11 flex items-center justify-center text-navy hover:bg-gold/10 hover:text-gold-dark transition-colors duration-300"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => onAdd(product, quantity)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-navy text-pearl font-semibold py-4 px-6 rounded-full hover:bg-navy-light transition-colors duration-300 text-sm tracking-wide"
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                    Anadir al carrito
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => onOrderWhatsApp(product, quantity)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-navy font-semibold py-4 px-6 rounded-full hover:bg-gold-light transition-colors duration-300 text-sm tracking-wide"
                  >
                    Comprar por WhatsApp
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
