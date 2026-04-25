"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface VentaItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  discount_percentage?: number;
}

interface Venta {
  id: string;
  created_at: string;
  customer_name: string;
  items: VentaItem[];
  total_amount: number;
  status: string;
}

export default function AdminVentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string>("");

  // Cargar logo de marca
  useEffect(() => {
    async function loadLogo() {
      try {
        const { data } = await supabase
          .from("configuracion")
          .select("value")
          .eq("key", "logo_url")
          .single();
        if (data?.value) setLogoUrl(data.value);
      } catch {}
    }
    loadLogo();
  }, []);

  // Cargar ventas desde Supabase
  useEffect(() => {
    async function loadVentas() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("ventas")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        if (data) {
          setVentas(data);
        }
      } catch (err) {
        console.error("Error al cargar ventas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVentas();
  }, []);

  // Marcar como completado
  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "completado" ? "pendiente" : "completado";
    try {
      const { error } = await supabase
        .from("ventas")
        .update({ status: newStatus })
        .eq("id", id);
      
      if (error) throw error;
      
      setVentas(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      alert("Error al actualizar el estado de la venta.");
    }
  };

  // Eliminar venta
  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este registro de venta?")) return;
    try {
      const { error } = await supabase.from("ventas").delete().eq("id", id);
      if (error) throw error;
      setVentas(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar la venta.");
    }
  };

  // Imprimir recibo PDF
  const handlePrintReceipt = (venta: Venta) => {
    const date = new Date(venta.created_at).toLocaleString('es-ES', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const itemsHtml = venta.items?.map(item => {
      const price = item.discount_percentage ? item.price * (1 - item.discount_percentage / 100) : item.price;
      return `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px dashed #ccc;">${item.quantity}x ${item.name}</td>
        <td style="padding: 8px 0; border-bottom: 1px dashed #ccc; text-align: right;">$${(price * (item.quantity || 1)).toFixed(2)}</td>
      </tr>
    `}).join('') || '';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Recibo de Pedido - Lindasal</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; color: #333; max-width: 350px; margin: 0 auto; padding: 20px; }
            h1 { font-size: 1.5rem; text-align: center; margin-bottom: 5px; font-weight: bold; letter-spacing: 2px; }
            p { font-size: 0.9rem; margin: 5px 0; }
            .text-center { text-align: center; }
            .divider { border-top: 1px dashed #333; margin: 15px 0; }
            table { border-collapse: collapse; font-size: 0.9rem; width: 100%; }
            th { text-align: left; border-bottom: 1px solid #333; padding-bottom: 5px; }
            .total { font-weight: bold; font-size: 1.2rem; text-align: right; margin-top: 15px; }
            .footer { font-size: 0.8rem; text-align: center; margin-top: 30px; color: #666; font-style: italic; }
            .logo { max-width: 150px; max-height: 80px; margin: 0 auto 10px; display: block; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="text-center">
            ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="logo" />` : ''}
            <h1>LINDASAL</h1>
            <p>Sal Marina 100% Orgánica</p>
            <p>Ecuador</p>
          </div>
          
          <div class="divider"></div>
          
          <p><strong>Fecha:</strong> ${date}</p>
          <p><strong>Cliente:</strong> ${venta.customer_name || 'Consumidor Final'}</p>
          <p><strong>Pedido #:</strong> ${venta.id.split('-')[0].toUpperCase()}</p>
          
          <div class="divider"></div>
          
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="total">
            TOTAL: $${Number(venta.total_amount).toFixed(2)}
          </div>
          
          <div class="divider"></div>
          
          <div class="footer">
            <p>¡Gracias por elegir lo natural!</p>
            <p style="font-size: 0.65rem; margin-top: 10px;">Este es un comprobante de pedido interno, no tiene validez tributaria para el SRI.</p>
          </div>
          
          <script>
            window.onload = function() { window.print(); window.setTimeout(function() { window.close(); }, 500); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Cálculos de KPI
  const totalVentas = ventas.length;
  const ingresosTotales = ventas.reduce((sum, v) => sum + (Number(v.total_amount) || 0), 0);
  const ticketPromedio = totalVentas > 0 ? ingresosTotales / totalVentas : 0;
  
  // Agrupar items vendidos
  const productosVendidos = ventas.reduce((sum, v) => {
    const itemsCount = v.items?.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0) || 0;
    return sum + itemsCount;
  }, 0);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Historial de Ventas</h1>
        <p className="text-slate-500 mt-1">Revisa el registro de pedidos generados en la tienda web.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ingresos Totales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl">
            <i className="fa-solid fa-sack-dollar"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Ingresos Totales</p>
            <p className="text-2xl font-black text-slate-800">${ingresosTotales.toFixed(2)}</p>
          </div>
        </div>

        {/* Total Pedidos */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-navy/10 text-navy flex items-center justify-center text-xl">
            <i className="fa-solid fa-receipt"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Pedidos</p>
            <p className="text-2xl font-black text-slate-800">{totalVentas}</p>
          </div>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Ticket Promedio</p>
            <p className="text-2xl font-black text-slate-800">${ticketPromedio.toFixed(2)}</p>
          </div>
        </div>

        {/* Productos Vendidos */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
            <i className="fa-solid fa-box-open"></i>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Productos Vendidos</p>
            <p className="text-2xl font-black text-slate-800">{productosVendidos}</p>
          </div>
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-lg text-slate-800">Últimos Pedidos</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-16">
            <div className="w-8 h-8 border-4 border-navy/20 border-t-navy rounded-full animate-spin"></div>
          </div>
        ) : ventas.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <i className="fa-solid fa-cash-register text-5xl text-slate-300 mb-6"></i>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No hay ventas registradas</h3>
            <p className="text-slate-500 max-w-[400px]">Los próximos pedidos que se hagan en tu tienda aparecerán aquí automáticamente antes de redirigirse a WhatsApp.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Fecha / Cliente</th>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Productos</th>
                  <th className="text-right px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Total</th>
                  <th className="text-center px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Estado</th>
                  <th className="text-center px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventas.map((venta, idx) => {
                  const date = new Date(venta.created_at).toLocaleString('es-ES', { 
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  });
                  
                  const isCompleted = venta.status === "completado";
                  
                  return (
                    <tr key={venta.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">{venta.customer_name || "Cliente Web"}</div>
                        <div className="text-[0.7rem] text-slate-400 mt-0.5">{date}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          {venta.items?.map((item, i) => (
                            <div key={i} className="text-xs text-slate-600 flex items-center gap-2">
                              <span className="font-bold text-navy bg-slate-100 px-1.5 rounded">{item.quantity}x</span>
                              <span className="truncate max-w-[200px]">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-bold text-navy text-base">${Number(venta.total_amount).toFixed(2)}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button 
                          onClick={() => handleUpdateStatus(venta.id, venta.status)}
                          className={`text-[0.65rem] font-bold uppercase px-3 py-1 rounded-full border transition-colors ${
                            isCompleted 
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
                              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          {isCompleted ? (
                            <><i className="fa-solid fa-check mr-1"></i> Completado</>
                          ) : (
                            <><i className="fa-solid fa-clock mr-1"></i> Pendiente</>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4 flex justify-center items-center gap-2">
                        <button
                          onClick={() => handlePrintReceipt(venta)}
                          className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-navy hover:text-white transition-colors flex items-center justify-center"
                          title="Generar Recibo PDF"
                        >
                          <i className="fa-solid fa-file-invoice"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(venta.id)}
                          className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                          title="Eliminar registro"
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
