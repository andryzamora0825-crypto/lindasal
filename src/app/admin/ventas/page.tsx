import React from "react";

export default function AdminVentasPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Historial de Ventas</h1>
        <p className="text-slate-500 mt-1">Revisa el registro de pedidos realizados y enviados a WhatsApp.</p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center text-center mt-4">
        <i className="fa-solid fa-cash-register text-5xl text-slate-300 mb-6"></i>
        <h3 className="text-xl font-bold text-slate-700 mb-2">Módulo en Construcción</h3>
        <p className="text-slate-500 max-w-[400px]">
          Aquí podrás ver análisis de ventas y confirmaciones de pedidos.
        </p>
      </div>
    </div>
  );
}
