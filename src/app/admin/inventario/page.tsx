"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Boxes,
  Layers,
  Landmark,
  TriangleAlert,
  PackageOpen,
  ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/store";
import {
  PageHeader,
  KpiCard,
  Panel,
  BrandLoader,
  EmptyPanelState,
  staggerContainer,
  rowVariant,
} from "@/components/admin/AdminUI";

const BRAND_COLORS: Record<string, string> = {
  LINDASAL: "bg-gold/15 text-gold-dark border border-gold/25",
  "AGUADEMAR QUINTON": "bg-teal/15 text-teal-dark border border-teal/25",
  NAVELLA: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
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
  const maxStock = Math.max(...products.map(p => p.stock || 0), 1);

  return (
    <div className="flex flex-col gap-7">
      <PageHeader
        eyebrow="Operación"
        title="Inventario y"
        accent="contabilidad."
        subtitle="Supervisa tus existencias y el valor total de tu mercancía en tiempo real."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          index={1}
          icon={<Boxes className="w-5 h-5" strokeWidth={1.75} />}
          label="Productos Únicos"
          value={totalProducts}
          tone="navy"
        />
        <KpiCard
          index={2}
          icon={<Layers className="w-5 h-5" strokeWidth={1.75} />}
          label="Total Unidades"
          value={totalStockUnits}
          tone="teal"
        />
        <KpiCard
          index={3}
          icon={<Landmark className="w-5 h-5" strokeWidth={1.75} />}
          label="Valor del Inventario"
          value={totalInventoryValue}
          format={(n) => `$${n.toFixed(2)}`}
          tone="gold"
        />
        <KpiCard
          index={4}
          icon={<TriangleAlert className="w-5 h-5" strokeWidth={1.75} />}
          label="Alertas (Stock Bajo)"
          value={lowStockCount}
          tone="red"
        />
      </div>

      {/* Tabla de Inventario Detallado */}
      <Panel
        index={5}
        title="Detalle por producto"
        subtitle="Existencias y valor por referencia"
        icon={<Boxes className="w-4 h-4" strokeWidth={1.75} />}
        actions={
          <span className="text-[0.6rem] font-bold bg-navy text-gold px-3.5 py-1.5 rounded-full uppercase tracking-[0.18em]">
            Ordenado por menor stock
          </span>
        }
      >
        {loading ? (
          <BrandLoader label="Cargando inventario…" />
        ) : products.length === 0 ? (
          <EmptyPanelState
            icon={<PackageOpen className="w-8 h-8" strokeWidth={1.25} />}
            title="Inventario vacío"
            description="Aún no hay productos reales en tu base de datos."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pearl-dark/50 bg-pearl/40">
                  <th className="text-left px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Producto</th>
                  <th className="text-left px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Marca</th>
                  <th className="text-right px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Stock Actual</th>
                  <th className="text-right px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Precio Unit.</th>
                  <th className="text-right px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Valor Total</th>
                  <th className="text-center px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Estado</th>
                </tr>
              </thead>
              <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                {products.map((p) => {
                  const stockValue = (p.stock || 0) * (p.price || 0);
                  const isLowStock = p.stock < 10;
                  const stockPct = Math.max(4, Math.min(100, ((p.stock || 0) / maxStock) * 100));

                  return (
                    <motion.tr
                      key={p.id}
                      variants={rowVariant}
                      className="group border-b border-pearl/70 hover:bg-pearl/30 transition-colors duration-300"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg border border-pearl-dark/60 bg-white transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-pearl rounded-lg border border-pearl-dark/60 flex items-center justify-center text-navy/30">
                              <ImageIcon className="w-4 h-4" strokeWidth={1.5} />
                            </div>
                          )}
                          <span className="font-semibold text-navy">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {p.brand && (
                          <span className={`text-[0.58rem] font-extrabold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full ${BRAND_COLORS[p.brand] || "bg-pearl text-navy/60 border border-pearl-dark/60"}`}>
                            {p.brand === "AGUADEMAR QUINTON" ? "AGUADEMAR" : p.brand}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`font-heading text-lg leading-none tabular-nums ${isLowStock ? "text-red-500" : "text-navy"}`}>
                            {p.stock}
                          </span>
                          <div className="w-20 h-1 rounded-full bg-pearl-dark/50 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${stockPct}%` }}
                              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                              className={`h-full rounded-full ${isLowStock ? "bg-red-400" : "bg-gradient-to-r from-gold to-teal"}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right text-navy/55 font-medium tabular-nums">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-bold text-navy tabular-nums">${stockValue.toFixed(2)}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {isLowStock ? (
                          <span className="text-[0.6rem] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/20 inline-flex items-center justify-center gap-1.5 animate-pulse-glow">
                            <TriangleAlert className="w-3 h-3" /> Reabastecer
                          </span>
                        ) : (
                          <span className="text-[0.6rem] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 inline-flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3" /> Óptimo
                          </span>
                        )}
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
