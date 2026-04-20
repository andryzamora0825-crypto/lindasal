"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Package,
  Warehouse,
  CircleCheck,
  TriangleAlert,
  Plus,
  Boxes,
  BarChart3,
  Share2,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  image_url?: string;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .order("id", { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const activeProducts = products.filter((p) => p.is_active).length;
  const alertProducts = products.filter((p) => (p.stock || 0) < 5).length;

  const stats = [
    { label: "Total Productos", value: totalProducts, icon: Package, color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    { label: "Stock Total", value: totalStock, icon: Warehouse, color: "bg-green-500/15 text-green-400 border-green-500/20" },
    { label: "Productos Activos", value: activeProducts, icon: CircleCheck, color: "bg-teal/15 text-teal-dark border-teal/20" },
    { label: "En Alerta Stock", value: alertProducts, icon: TriangleAlert, color: "bg-amber-500/15 text-amber-500 border-amber-500/20" },
  ];

  const quickActions = [
    { title: "Nuevo Producto", desc: "Agregar al catálogo", href: "/dashboard/productos", icon: Plus, color: "bg-gold/10 text-gold border-gold/20" },
    { title: "Gestionar Stock", desc: "Actualizar inventario", href: "/dashboard/inventario", icon: Boxes, color: "bg-teal/10 text-teal-dark border-teal/20" },
    { title: "Ver Ventas", desc: "Historial de pedidos", href: "/dashboard/ventas", icon: BarChart3, color: "bg-green-500/10 text-green-600 border-green-500/20" },
    { title: "Social Media", desc: "Gestionar publicaciones", href: "/dashboard/social", icon: Share2, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3.5 bg-gradient-to-br from-gold to-gold-light rounded-2xl shadow-[0_0_15px_rgba(201,168,76,0.3)]">
          <BarChart3 className="w-7 h-7 text-navy" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight font-[family-name:var(--font-heading)]">
            Resumen General
          </h1>
          <p className="text-gray-500 mt-0.5">Vista general del estado de tu tienda</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-pearl-dark shadow-[0_1px_3px_rgba(10,22,40,0.06)] hover:shadow-[0_8px_24px_rgba(10,22,40,0.1)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className={`w-11 h-11 rounded-xl ${stat.color} border flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-navy">{stat.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-pearl-dark shadow-[0_1px_3px_rgba(10,22,40,0.06)] p-6">
          <h3 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-gold" />
            Acciones Rápidas
          </h3>
          <div className="space-y-2.5">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-pearl-dark hover:border-gold/30 hover:bg-pearl/50 hover:shadow-[0_4px_12px_rgba(10,22,40,0.06)] transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl ${action.color} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-navy">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.desc}</p>
                </div>
                <span className="text-gray-300 group-hover:text-gold transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl border border-pearl-dark shadow-[0_1px_3px_rgba(10,22,40,0.06)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-navy text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-gold" />
              Últimos Productos
            </h3>
            <Link href="/dashboard/productos" className="text-xs text-gold font-bold hover:underline">
              Ver todos
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">No hay productos aún</p>
              <p className="text-xs">Configura Supabase y agrega tu primer producto</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {products.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-pearl-dark hover:border-gold/20 transition-colors"
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-pearl-dark"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-pearl flex items-center justify-center">
                      <Package className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">${Number(p.price).toFixed(2)} · Stock: {p.stock}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      p.is_active
                        ? "bg-green-500/10 text-green-600 border border-green-500/20"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {p.is_active ? "Activo" : "Inactivo"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
