"use client";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NavbarAuth() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) return <UserButton />;
  return (
    <SignInButton mode="modal">
      <button className="bg-gold text-navy px-5 py-2 rounded-xl font-bold text-sm hover:bg-gold-light hover:shadow-[0_0_15px_rgba(201,168,76,0.4)] transition-all font-[family-name:var(--font-body)]">
        Iniciar Sesión
      </button>
    </SignInButton>
  );
}

export function HeroCTA() {
  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return (
      <Link
        href="/dashboard"
        className="bg-gold text-navy font-bold px-8 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(201,168,76,0.3)] hover:bg-gold-light hover:shadow-[0_0_40px_rgba(201,168,76,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm uppercase tracking-widest font-[family-name:var(--font-body)]"
      >
        Ir al Panel <ArrowRight className="w-4 h-4" />
      </Link>
    );
  }
  return (
    <Link
      href="/tienda"
      className="bg-gold text-navy font-bold px-8 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(201,168,76,0.3)] hover:bg-gold-light hover:shadow-[0_0_40px_rgba(201,168,76,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-sm uppercase tracking-widest font-[family-name:var(--font-body)]"
    >
      Explorar Tienda <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
