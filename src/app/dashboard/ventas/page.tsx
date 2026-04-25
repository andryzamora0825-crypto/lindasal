"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Receipt, Loader2, Calendar, User, Package, CheckCircle2 } from "lucide-react";

export default function AdminVentasPage() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVentas() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("ventas")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setVentas(data || []);
      } catch (err) {
        console.error("Error cargando ventas", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVentas();
  }, []);

  const totalVentas = ventas.reduce((acc, v) => acc + (v.total_amount || 0), 0);
  const pedidosCompletados = ventas.length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <header className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-pearl-dark shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy flex items-center gap-2 sm:gap-3">
          <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-gold" /> Historial de Ventas
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1 sm:mt-2">Revisa todos los pedidos realizados a través de la tienda y derivados a WhatsApp.</p>
        
        {!loading && ventas.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-green-50 border border-green-200 px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold">
                $
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-green-600 uppercase font-bold tracking-wider">Ingresos Totales</span>
                <span className="text-sm font-bold text-green-700">${totalVentas.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {pedidosCompletados}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Pedidos</span>
                <span className="text-sm font-bold text-navy">Registrados</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gold">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : ventas.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 sm:p-16 text-center">
            <Receipt className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-2">Aún no hay ventas</h3>
            <p className="text-sm sm:text-base text-slate-500 max-w-[400px]">Cuando un cliente realice un pedido por la tienda, aparecerá guardado aquí.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Fecha</th>
                  <th className="p-4 font-semibold">Cliente</th>
                  <th className="p-4 font-semibold">Detalle de Compra</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ventas.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors align-top">
                    <td className="p-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(v.created_at).toLocaleDateString()} <br/>
                        <span className="text-xs text-slate-400">{new Date(v.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 font-bold text-navy text-sm">
                        <User className="w-4 h-4 text-slate-400" />
                        {v.customer_name || "Cliente General"}
                      </div>
                    </td>
                    <td className="p-4">
                      <ul className="space-y-2">
                        {(v.items || []).map((item: any, idx: number) => (
                          <li key={idx} className="flex gap-2 text-sm">
                            <Package className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <span>
                              <span className="font-semibold text-navy">{item.quantity}x</span> {item.name}
                              <span className="text-xs text-slate-500 block">${(item.price * item.quantity).toFixed(2)}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 font-bold text-navy text-lg">
                      ${Number(v.total_amount).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal/10 text-teal-dark border border-teal/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Enviado a WA
                      </span>
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
