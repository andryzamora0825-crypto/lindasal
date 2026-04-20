import React from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Panel de Administración</h1>
        <p className="text-slate-500 mt-1">Bienvenido a tu panel de control central.</p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex-1 flex flex-col items-center justify-center text-center mt-4">
        <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
          <i className="fa-solid fa-chart-line text-4xl text-slate-300"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">Bienvenido al nuevo panel de administración</h3>
        <p className="text-slate-500 max-w-[500px] mb-6">
          Desde aquí podrás gestionar tus productos, revisar el inventario, administrar ventas y utilizar el nuevo módulo de Inteligencia Artificial para tus redes sociales.
        </p>
        <Link href="/dashboard" className="px-6 py-3 bg-navy text-pearl font-bold rounded-xl hover:bg-navy-mid transition-colors">
          Ir al Dashboard Integrado
        </Link>
      </div>
    </div>
  );
}
