"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion";

/**
 * Tarjeta con efecto 3D tilt que sigue el cursor + destello (glare).
 * Puramente decorativo: en móvil o con reduced-motion no hace nada.
 */
export default function TiltCard({
  children,
  className = "",
  maxTilt = 7,
  glare = true,
  scale = 1.01,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 26 });
  const sy = useSpring(py, { stiffness: 220, damping: 26 });

  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);
  const glareX = useTransform(sx, [0, 1], ["15%", "85%"]);
  const glareY = useTransform(sy, [0, 1], ["15%", "85%"]);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.22), transparent 55%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    setHovered(false);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={
        reduceMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1000 }
      }
      whileHover={reduceMotion ? undefined : { scale }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {glare && !reduceMotion && (
        <motion.div
          aria-hidden="true"
          style={{ background: glareBg }}
          className={`pointer-events-none absolute inset-0 z-20 rounded-[inherit] transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </motion.div>
  );
}
