"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/store";

const BRAND_COLORS: Record<string, string> = {
  LINDASAL: "bg-[#c9a84c] text-white",
  "AGUADEMAR QUINTON": "bg-teal text-white",
  NAVELLA: "bg-purple-600 text-white",
};

export default function AdminInventarioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos desde Supabase
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("productos").select("*").order("stock", { ascending: true });
        if (error) throw error;
        if (data) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error al cargar inventario:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Cálculos de contabilidad y stock
  const totalProducts = products.length;
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + ((p.stock || 0) * (p.price || 0)), 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Inventario y Contabilidad</h1>
        <p className="text-slate-500 mt-1">Supervisa tus existencias y el valor total de tu mercancía.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Productos */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy/10 text-navy flex items-center justify-center text-xl">
            <i className="fa-solid fa-boxes-stacked"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Productos Únicos</p>
            <p className="text-2xl font-black text-slate-800">{totalProducts}</p>
          </div>
        </div>

        {/* Total Stock */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl">
            <i className="fa-solid fa-cubes"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Unidades</p>
            <p className="text-2xl font-black text-slate-800">{totalStockUnits}</p>
          </div>
        </div>

        {/* Valor Total */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            <i className="fa-solid fa-sack-dollar"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Valor del Inventario</p>
            <p className="text-2xl font-black text-slate-800">${totalInventoryValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Bajo Stock */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-xl">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Alertas (Stock Bajo)</p>
            <p className="text-2xl font-black text-slate-800">{lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* Tabla de Inventario Detallado */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-lg text-slate-800">Detalle por Producto</h2>
          <span className="text-xs font-bold bg-navy text-white px-3 py-1 rounded-full uppercase tracking-wider">
            Ordenado por Menor Stock
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-16">
            <div className="w-8 h-8 border-4 border-navy/20 border-t-navy rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <i className="fa-solid fa-box-open text-5xl text-slate-300 mb-6"></i>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Inventario Vacío</h3>
            <p className="text-slate-500 max-w-[400px]">Aún no hay productos reales en tu base de datos.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Producto</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Marca</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Stock Actual</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Precio Unit.</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Valor Total</th>
                <th className="text-center px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => {
                const stockValue = (p.stock || 0) * (p.price || 0);
                const isLowStock = p.stock < 10;
                
                return (
                  <tr key={p.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-8 h-8 object-cover rounded-md border border-slate-200 bg-white" />
                        ) : (
                          <div className="w-8 h-8 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-slate-400">
                            <i className="fa-solid fa-image text-xs"></i>
                          </div>
                        )}
                        <span className="font-medium text-slate-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {p.brand && (
                        <span className={`text-[0.6rem] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded ${BRAND_COLORS[p.brand] || "bg-slate-200 text-slate-600"}`}>
                          {p.brand === "AGUADEMAR QUINTON" ? "AGUADEMAR" : p.brand}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`font-black text-base ${isLowStock ? "text-red-500" : "text-slate-800"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-slate-500 font-medium">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-bold text-navy">${stockValue.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {isLowStock ? (
                        <span className="text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center justify-center gap-1 w-fit mx-auto">
                          <i className="fa-solid fa-warning"></i> Reabastecer
                        </span>
                      ) : (
                        <span className="text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center justify-center gap-1 w-fit mx-auto">
                          <i className="fa-solid fa-check"></i> Óptimo
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
