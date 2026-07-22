"use client";

import React, { useEffect, useRef } from "react";
import { CartItem } from "@/types/store";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, FlaskConical } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string | number) => void;
  onChangeQty: (id: string | number, delta: number) => void;
  onCheckout: (customerName: string) => void;
}

export default function CartDrawer({ isOpen, onClose, cart, onRemove, onChangeQty, onCheckout }: CartDrawerProps) {
  const [customerName, setCustomerName] = React.useState("");
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const total = cart.reduce((acc, item) => {
    const finalPrice = item.discount_percentage ? item.price * (1 - item.discount_percentage / 100) : item.price;
    return acc + finalPrice * item.quantity;
  }, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => closeBtnRef.current?.focus(), 200);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 surface-glass-dark z-[1100]"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-bone z-[1110] flex flex-col shadow-floating"
            role="complementary"
            aria-label="Carrito de compras"
          >
            <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-6 border-b border-pearl-dark/60 bg-white/50">
              <div>
                <span className="eyebrow">Tu seleccion</span>
                <h3 className="font-display text-2xl sm:text-3xl text-navy mt-0.5 sm:mt-1">
                  Carrito
                  {totalItems > 0 && (
                    <span className="text-gold-dark italic ml-2">({totalItems})</span>
                  )}
                </h3>
              </div>
              <button
                ref={closeBtnRef}
                onClick={onClose}
                aria-label="Cerrar carrito"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white border border-pearl-dark text-navy hover:bg-navy hover:text-pearl hover:border-navy transition-colors duration-300"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4">
              {cart.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center px-4"
                >
                  <div className="w-20 h-20 rounded-full bg-pearl flex items-center justify-center mb-6">
                    <ShoppingBag className="w-8 h-8 text-navy/30" strokeWidth={1.25} />
                  </div>
                  <p className="font-display text-2xl text-navy mb-2">Tu carrito espera</p>
                  <p className="text-sm text-navy/55 mb-8 max-w-[260px]">
                    Aun no has elegido ninguna pieza de nuestra coleccion.
                  </p>
                  <button
                    onClick={onClose}
                    className="text-eyebrow text-navy link-underline hover:text-gold-dark transition-colors"
                  >
                    Explorar la tienda
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false}>
                  {cart.map((item) => {
                    const finalPrice = item.discount_percentage
                      ? item.price * (1 - item.discount_percentage / 100)
                      : item.price;
                    const subtotal = finalPrice * item.quantity;
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="flex gap-4 py-4 border-b border-pearl-dark/40 last:border-b-0 group"
                      >
                        {item.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-20 h-20 rounded-2xl object-contain bg-pearl/50 p-2"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-pearl/50 flex items-center justify-center text-navy/25">
                            <FlaskConical className="w-7 h-7" strokeWidth={1.25} />
                          </div>
                        )}

                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="font-heading text-base sm:text-lg text-navy leading-snug truncate">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => onRemove(item.id)}
                              aria-label={`Eliminar ${item.name}`}
                              className="shrink-0 w-7 h-7 flex items-center justify-center text-navy/40 hover:text-navy transition-colors"
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          </div>

                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-heading font-semibold text-gold-dark text-base">
                              ${finalPrice.toFixed(2)}
                            </span>
                            {item.discount_percentage && item.discount_percentage > 0 ? (
                              <span className="text-[0.7rem] text-navy/35 line-through">
                                ${item.price.toFixed(2)}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-pearl-dark rounded-full overflow-hidden h-9">
                              <button
                                onClick={() => onChangeQty(item.id, -1)}
                                aria-label="Reducir cantidad"
                                className="w-9 h-full flex items-center justify-center text-navy hover:bg-gold/10 hover:text-gold-dark transition-colors"
                              >
                                <Minus className="w-3 h-3" strokeWidth={2} />
                              </button>
                              <span className="w-9 text-center text-sm font-semibold text-navy">{item.quantity}</span>
                              <button
                                onClick={() => onChangeQty(item.id, 1)}
                                aria-label="Aumentar cantidad"
                                className="w-9 h-full flex items-center justify-center text-navy hover:bg-gold/10 hover:text-gold-dark transition-colors"
                              >
                                <Plus className="w-3 h-3" strokeWidth={2} />
                              </button>
                            </div>
                            <span className="text-xs text-navy/50 font-medium">
                              Subtotal <span className="text-navy font-semibold">${subtotal.toFixed(2)}</span>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {cart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="px-5 sm:px-7 pt-4 sm:pt-6 border-t border-pearl-dark/60 bg-white"
                style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
              >
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-eyebrow text-navy/60">Total</span>
                  <span className="font-heading font-semibold text-2xl sm:text-3xl text-navy tabular-nums">${total.toFixed(2)}</span>
                </div>
                <p className="text-[0.7rem] text-navy/45 mb-4">
                  El total no incluye costos de envio.
                </p>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Tu nombre (opcional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-bone border border-pearl-dark rounded-full py-3 px-5 text-sm focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/40 transition-all"
                  />
                </div>

                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => onCheckout(customerName)}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-navy text-pearl font-semibold py-4 rounded-full hover:bg-navy-light transition-colors duration-300 text-sm tracking-wide"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0 text-[#25D366]" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-8.5 15.32L2 22l4.82-1.45A10 10 0 1 0 12 2Zm0 18.18c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-2.86.86.86-2.79-.2-.32A8.18 8.18 0 1 1 12 20.18Zm4.47-5.8c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.73-.65-1.22-1.45-1.36-1.69-.14-.24-.02-.38.1-.5.11-.11.25-.28.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.3-.22.24-.85.83-.85 2.04 0 1.2.87 2.37 1 2.53.12.16 1.72 2.63 4.17 3.69.58.25 1.04.4 1.39.51.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
                  </svg>
                  Finalizar por WhatsApp
                </motion.button>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
