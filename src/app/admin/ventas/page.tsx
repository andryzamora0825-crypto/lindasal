"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Landmark,
  Receipt,
  TrendingUp,
  PackageOpen,
  Check,
  Clock,
  FileText,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  PageHeader,
  KpiCard,
  Panel,
  BrandLoader,
  EmptyPanelState,
  staggerContainer,
  rowVariant,
} from "@/components/admin/AdminUI";

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
    <div className="flex flex-col gap-7">
      <PageHeader
        eyebrow="Operación"
        title="Historial de"
        accent="ventas."
        subtitle="Revisa el registro de pedidos generados en la tienda web."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          index={1}
          icon={<Landmark className="w-5 h-5" strokeWidth={1.75} />}
          label="Ingresos Totales"
          value={ingresosTotales}
          format={(n) => `$${n.toFixed(2)}`}
          tone="green"
        />
        <KpiCard
          index={2}
          icon={<Receipt className="w-5 h-5" strokeWidth={1.75} />}
          label="Total Pedidos"
          value={totalVentas}
          tone="navy"
        />
        <KpiCard
          index={3}
          icon={<TrendingUp className="w-5 h-5" strokeWidth={1.75} />}
          label="Ticket Promedio"
          value={ticketPromedio}
          format={(n) => `$${n.toFixed(2)}`}
          tone="purple"
        />
        <KpiCard
          index={4}
          icon={<PackageOpen className="w-5 h-5" strokeWidth={1.75} />}
          label="Productos Vendidos"
          value={productosVendidos}
          tone="gold"
        />
      </div>

      {/* Tabla de Ventas */}
      <Panel
        index={5}
        title="Últimos pedidos"
        subtitle="Los pedidos web se registran antes de redirigir a WhatsApp"
        icon={<ShoppingCart className="w-4 h-4" strokeWidth={1.75} />}
      >
        {loading ? (
          <BrandLoader label="Cargando ventas…" />
        ) : ventas.length === 0 ? (
          <EmptyPanelState
            icon={<Receipt className="w-8 h-8" strokeWidth={1.25} />}
            title="No hay ventas registradas"
            description="Los próximos pedidos que se hagan en tu tienda aparecerán aquí automáticamente antes de redirigirse a WhatsApp."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-pearl-dark/50 bg-pearl/40">
                  <th className="text-left px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Fecha / Cliente</th>
                  <th className="text-left px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Productos</th>
                  <th className="text-right px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Total</th>
                  <th className="text-center px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Estado</th>
                  <th className="text-center px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Acciones</th>
                </tr>
              </thead>
              <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                {ventas.map((venta) => {
                  const date = new Date(venta.created_at).toLocaleString('es-ES', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  });

                  const isCompleted = venta.status === "completado";

                  return (
                    <motion.tr
                      key={venta.id}
                      variants={rowVariant}
                      className="border-b border-pearl/70 hover:bg-pearl/30 transition-colors duration-300"
                    >
                      <td className="px-5 py-4">
                        <div className="font-bold text-navy">{venta.customer_name || "Cliente Web"}</div>
                        <div className="text-[0.7rem] text-navy/40 mt-0.5">{date}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          {venta.items?.map((item, i) => (
                            <div key={i} className="text-xs text-navy/60 flex items-center gap-2">
                              <span className="font-bold text-navy bg-gold/15 border border-gold/20 px-1.5 py-0.5 rounded tabular-nums">
                                {item.quantity}x
                              </span>
                              <span className="truncate max-w-[220px]">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-heading text-lg text-navy tabular-nums">
                          ${Number(venta.total_amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          onClick={() => handleUpdateStatus(venta.id, venta.status)}
                          className={`text-[0.62rem] font-bold uppercase tracking-[0.1em] px-3.5 py-1.5 rounded-full border transition-all duration-300 inline-flex items-center gap-1.5 hover:-translate-y-0.5 ${
                            isCompleted
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25 hover:bg-emerald-500/20"
                              : "bg-gold/10 text-gold-dark border-gold/30 hover:bg-gold/20"
                          }`}
                        >
                          {isCompleted ? (
                            <><Check className="w-3 h-3" /> Completado</>
                          ) : (
                            <><Clock className="w-3 h-3" /> Pendiente</>
                          )}
                        </motion.button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.12, rotate: -4 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handlePrintReceipt(venta)}
                            className="w-9 h-9 rounded-full bg-pearl text-navy/60 hover:bg-navy hover:text-gold transition-colors duration-300 flex items-center justify-center"
                            title="Generar Recibo PDF"
                          >
                            <FileText className="w-4 h-4" strokeWidth={1.75} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.12, rotate: 4 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handleDelete(venta.id)}
                            className="w-9 h-9 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300 flex items-center justify-center"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
