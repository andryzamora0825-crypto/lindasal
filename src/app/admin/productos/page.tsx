import React from "react";

export default function AdminProductosPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Productos</h1>
          <p className="text-slate-500 mt-1">Gestiona tu catálogo de productos y precios.</p>
        </div>
        <button className="bg-navy text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-navy-light transition-colors flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Nuevo Producto
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 flex flex-col items-center justify-center text-center mt-4">
        <i className="fa-solid fa-box-open text-5xl text-slate-300 mb-6"></i>
        <h3 className="text-xl font-bold text-slate-700 mb-2">Módulo en Construcción</h3>
        <p className="text-slate-500 max-w-[400px]">
          Aquí podrás crear, editar y eliminar productos de la base de datos (Supabase) próximamente.
        </p>
      </div>
    </div>
  );
}
