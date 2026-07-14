"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Barra de progreso de lectura */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left bg-gradient-to-r from-gold-dark via-gold to-teal"
      />

      {/* Botón volver arriba */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Volver arriba"
            className="fixed bottom-6 left-6 z-[90] w-11 h-11 rounded-full surface-glass text-navy shadow-floating flex items-center justify-center hover:text-gold-dark transition-colors duration-300"
          >
            <ArrowUp className="w-4 h-4" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
