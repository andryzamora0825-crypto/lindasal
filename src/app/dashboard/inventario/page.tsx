"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Warehouse, Loader2, ArrowUpCircle, ArrowDownCircle, AlertTriangle } from "lucide-react";
import type { Product } from "@/types/store";

export default function AdminInventarioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("productos").select("*").order("name", { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateStock = async (id: string | number, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    if (newStock === currentStock) return;
    
    setUpdatingId(id);
    try {
      const { error } = await supabase.from("productos").update({ stock: newStock }).eq("id", id);
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    } catch (err) {
      console.error("Error updating stock", err);
      alert("Error actualizando stock.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStockInputChange = async (id: string | number, value: string) => {
    const newStock = parseInt(value);
    if (isNaN(newStock) || newStock < 0) return;
    
    setUpdatingId(id);
    try {
      const { error } = await supabase.from("productos").update({ stock: newStock }).eq("id", id);
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    } catch (err) {
      console.error("Error updating stock", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Stats
  const totalItems = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockItems = products.filter(p => p.stock < 5 && p.is_active).length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <header className="bg-white p-6 rounded-2xl border border-pearl-dark shadow-sm">
        <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
          <Warehouse className="w-8 h-8 text-gold" /> Inventario
        </h1>
        <p className="text-slate-500 mt-2">Gestiona el número de existencias en tu bodega. Los cambios se guardan automáticamente.</p>
        
        {!loading && products.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {products.length}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Refs. Únicas</span>
                <span className="text-sm font-bold text-navy">en catálogo</span>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold">
                {totalItems}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Unidades</span>
                <span className="text-sm font-bold text-navy">Totales</span>
              </div>
            </div>

            {lowStockItems > 0 && (
              <div className="bg-red-50 border border-red-200 px-4 py-3 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold">
                  {lowStockItems}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-red-500 uppercase font-bold tracking-wider">Alerta</span>
                  <span className="text-sm font-bold text-red-700">Stock Bajo</span>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gold">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <Warehouse className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No hay inventario</h3>
            <p className="text-slate-500 max-w-[400px]">Ve a la pestaña de Productos para registrar tu catálogo primero.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Producto</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold">Stock Actual</th>
                  <th className="p-4 font-semibold">Ajuste Rápido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-navy text-sm">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.category}</p>
                    </td>
                    <td className="p-4">
                      {!p.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-500">Pausado</span>
                      ) : p.stock < 5 ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold bg-red-100 text-red-600">
                          <AlertTriangle className="w-3 h-3" /> Bajo Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-bold bg-green-100 text-green-700">OK</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-navy">{p.stock}</span>
                        <span className="text-xs text-slate-400">uni.</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateStock(p.id, p.stock, -1)}
                          disabled={p.stock === 0 || updatingId === p.id}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50 transition-colors"
                        >
                          <ArrowDownCircle className="w-5 h-5" />
                        </button>
                        
                        <div className="relative">
                          {updatingId === p.id && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded">
                              <Loader2 className="w-4 h-4 animate-spin text-gold" />
                            </div>
                          )}
                          <input 
                            type="number" 
                            min="0"
                            value={p.stock}
                            onChange={(e) => handleStockInputChange(p.id, e.target.value)}
                            className="w-20 text-center bg-slate-50 border border-slate-200 rounded-lg py-1.5 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold font-bold text-navy"
                          />
                        </div>

                        <button 
                          onClick={() => updateStock(p.id, p.stock, 1)}
                          disabled={updatingId === p.id}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50 transition-colors"
                        >
                          <ArrowUpCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
