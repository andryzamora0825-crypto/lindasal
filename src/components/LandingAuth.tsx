"use client";

import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function NavbarAuth() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div
        aria-hidden="true"
        className="h-9 w-28 rounded-full bg-pearl-dark/40 animate-pulse"
      />
    );
  }

  if (isSignedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <span
          aria-hidden="true"
          className="absolute -inset-1 rounded-full bg-gradient-to-tr from-gold/40 to-teal/30 blur-md opacity-70"
        />
        <div className="relative">
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "h-9 w-9 ring-2 ring-gold/50 ring-offset-2 ring-offset-navy",
              },
            }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <SignInButton mode="modal">
      <motion.button
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Iniciar sesión en Lindasal"
        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold px-5 py-2 font-body text-sm font-bold text-navy shadow-[0_8px_24px_-8px_rgba(201,168,76,0.5)] transition-shadow hover:shadow-[0_12px_32px_-8px_rgba(201,168,76,0.65)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
        />
        <span className="relative">Iniciar Sesión</span>
        <ArrowUpRight
          aria-hidden="true"
          className="relative h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </motion.button>
    </SignInButton>
  );
}

export function HeroCTA() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div
        aria-hidden="true"
        className="h-12 w-44 rounded-full bg-pearl-dark/40 animate-pulse"
      />
    );
  }

  const href = isSignedIn ? "/dashboard" : "/tienda";
  const label = isSignedIn ? "Ir al Panel" : "Explorar Tienda";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="inline-block"
    >
      <Link
        href={href}
        aria-label={label}
        className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-br from-gold via-gold-soft to-gold-light px-8 py-3.5 font-body text-sm font-bold uppercase tracking-[0.18em] text-navy shadow-[0_18px_50px_-16px_rgba(201,168,76,0.55)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_rgba(201,168,76,0.7)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
        />
        <span className="relative">{label}</span>
        <ArrowRight
          aria-hidden="true"
          className="relative h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        />
      </Link>
    </motion.div>
  );
}
