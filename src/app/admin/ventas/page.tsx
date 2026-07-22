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
  Download,
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
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
              color: #0a1628;
              background: #f8f5f0;
              padding: 24px 16px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .sheet {
              max-width: 420px; margin: 0 auto; background: #ffffff;
              border-radius: 18px; overflow: hidden;
              border: 1px solid #e8dfd0;
              box-shadow: 0 12px 40px -12px rgba(10,22,40,0.15);
            }
            .head {
              background: #0a1628; color: #f5f0e8;
              padding: 26px 24px 22px; text-align: center; position: relative;
            }
            .head::after {
              content: ""; display: block; position: absolute; left: 0; right: 0; bottom: 0;
              height: 4px; background: linear-gradient(90deg, #a8832a, #c9a84c, #e8d08a, #7ecac3);
            }
            .logo { max-width: 120px; max-height: 64px; margin: 0 auto 10px; display: block; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.35)); }
            h1 { font-family: Georgia, 'Times New Roman', serif; font-size: 1.7rem; letter-spacing: 6px; font-weight: 600; }
            .head .sub { font-size: 0.68rem; letter-spacing: 3px; text-transform: uppercase; color: #c9a84c; margin-top: 6px; font-weight: 700; }
            .head .sub2 { font-size: 0.62rem; letter-spacing: 2px; color: rgba(245,240,232,0.55); margin-top: 3px; }
            .meta { display: flex; padding: 16px 24px; gap: 12px; border-bottom: 1px dashed #e8dfd0; }
            .meta div { flex: 1; }
            .meta .k { font-size: 0.55rem; text-transform: uppercase; letter-spacing: 2px; color: #a8832a; font-weight: 700; margin-bottom: 3px; }
            .meta .v { font-size: 0.78rem; font-weight: 600; }
            table { border-collapse: collapse; width: 100%; }
            .items { padding: 6px 24px 16px; }
            .items th {
              text-align: left; font-size: 0.55rem; text-transform: uppercase; letter-spacing: 2px;
              color: rgba(10,22,40,0.45); font-weight: 700; padding: 12px 0 8px; border-bottom: 1.5px solid #0a1628;
            }
            .items th:last-child { text-align: right; }
            .items td { padding: 9px 0; border-bottom: 1px dashed #e8dfd0; font-size: 0.82rem; }
            .items td:last-child { text-align: right; font-weight: 700; }
            .totalband {
              margin: 4px 24px 20px; background: #0a1628; color: #f5f0e8;
              border-radius: 12px; padding: 14px 18px;
              display: flex; align-items: center; justify-content: space-between;
            }
            .totalband .lbl { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 3px; color: rgba(245,240,232,0.6); font-weight: 700; }
            .totalband .amt { font-family: Georgia, serif; font-size: 1.45rem; color: #e8d08a; font-weight: 600; }
            .foot { text-align: center; padding: 0 24px 24px; }
            .foot .thanks { font-family: Georgia, serif; font-style: italic; font-size: 0.95rem; color: rgba(10,22,40,0.75); }
            .foot .legal { font-size: 0.58rem; color: rgba(10,22,40,0.4); margin-top: 8px; line-height: 1.5; }
            .waves { text-align: center; padding-bottom: 4px; color: #7ecac3; font-size: 0.8rem; letter-spacing: 4px; }
            @media print {
              body { background: #ffffff; padding: 0; }
              .sheet { box-shadow: none; border: none; border-radius: 0; max-width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="head">
              ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="logo" />` : ''}
              <h1>LINDASAL</h1>
              <p class="sub">Sal Marina 100% Orgánica</p>
              <p class="sub2">Ecuador</p>
            </div>

            <div class="meta">
              <div>
                <p class="k">Fecha</p>
                <p class="v">${date}</p>
              </div>
              <div>
                <p class="k">Cliente</p>
                <p class="v">${venta.customer_name || 'Consumidor Final'}</p>
              </div>
              <div>
                <p class="k">Pedido #</p>
                <p class="v">${venta.id.split('-')[0].toUpperCase()}</p>
              </div>
            </div>

            <div class="items">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>

            <div class="totalband">
              <span class="lbl">Total</span>
              <span class="amt">$${Number(venta.total_amount).toFixed(2)}</span>
            </div>

            <div class="foot">
              <p class="thanks">¡Gracias por elegir lo natural!</p>
              <p class="legal">Este es un comprobante de pedido interno, no tiene validez tributaria para el SRI.</p>
            </div>
            <div class="waves">~ ~ ~</div>
          </div>

          <script>
            window.onload = function() { window.print(); window.setTimeout(function() { window.close(); }, 500); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Exportar historial de ventas a CSV (con BOM para Excel)
  const handleExportCsv = () => {
    if (ventas.length === 0) {
      alert("No hay ventas para exportar.");
      return;
    }
    const rows = [
      ["Fecha", "Cliente", "Productos", "Total", "Estado"],
      ...ventas.map((v) => [
        new Date(v.created_at).toLocaleString("es-ES"),
        v.customer_name || "Cliente Web",
        (v.items || []).map((it) => `${it.quantity}x ${it.name}`).join(" | "),
        Number(v.total_amount).toFixed(2),
        v.status,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lindasal_ventas_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    <div className="flex flex-col gap-5 sm:gap-7">
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
        actions={
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-full border border-teal/25 bg-teal/10 px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-teal-dark hover:bg-teal/20 hover:-translate-y-0.5 transition-all duration-300"
            title="Descargar historial en CSV (Excel)"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={2} /> CSV
          </button>
        }
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
          <>
          {/* Vista móvil: tarjetas */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="md:hidden divide-y divide-pearl/70"
          >
            {ventas.map((venta) => {
              const date = new Date(venta.created_at).toLocaleString('es-ES', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
              });
              const isCompleted = venta.status === "completado";
              return (
                <motion.div key={venta.id} variants={rowVariant} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-navy text-sm">{venta.customer_name || "Cliente Web"}</p>
                      <p className="text-[0.68rem] text-navy/40 mt-0.5">{date}</p>
                    </div>
                    <span className="font-heading text-lg text-navy tabular-nums shrink-0">
                      ${Number(venta.total_amount).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-col gap-1">
                    {venta.items?.map((item, i) => (
                      <div key={i} className="text-xs text-navy/60 flex items-center gap-2">
                        <span className="font-bold text-navy bg-gold/15 border border-gold/20 px-1.5 py-0.5 rounded tabular-nums shrink-0">
                          {item.quantity}x
                        </span>
                        <span className="truncate">{item.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleUpdateStatus(venta.id, venta.status)}
                      className={`text-[0.6rem] font-bold uppercase tracking-[0.08em] px-3 py-1.5 rounded-full border transition-colors inline-flex items-center gap-1.5 ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                          : "bg-gold/10 text-gold-dark border-gold/30"
                      }`}
                    >
                      {isCompleted ? (
                        <><Check className="w-3 h-3" /> Completado</>
                      ) : (
                        <><Clock className="w-3 h-3" /> Pendiente</>
                      )}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePrintReceipt(venta)}
                        className="w-9 h-9 rounded-full bg-pearl text-navy/60 active:bg-navy active:text-gold transition-colors flex items-center justify-center"
                        title="Generar Recibo PDF"
                      >
                        <FileText className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => handleDelete(venta.id)}
                        className="w-9 h-9 rounded-full bg-red-500/10 text-red-500 active:bg-red-500 active:text-white transition-colors flex items-center justify-center"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Vista escritorio: tabla */}
          <div className="hidden md:block overflow-x-auto">
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
          </>
        )}
      </Panel>
    </div>
  );
}
