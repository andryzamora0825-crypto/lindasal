"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import type { Product } from "@/types/store";

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // State for form
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("productos").select("*").order("id", { ascending: false });
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

  const openNewProduct = () => {
    setCurrentProduct({
      name: "",
      description: "",
      price: 0,
      category: "comestible",
      stock: 0,
      is_active: true,
      is_featured: false,
      image_url: ""
    });
    setIsModalOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setCurrentProduct(p);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;
    setSaving(true);
    
    try {
      if (currentProduct.id) {
        // Update
        const { error } = await supabase.from("productos").update(currentProduct).eq("id", currentProduct.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from("productos").insert([currentProduct]);
        if (error) throw error;
      }
      await fetchProducts();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error guardando producto", err);
      alert("Hubo un error guardando el producto. Revisa la conexión a Supabase.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("¿Segur@ que deseas eliminar este producto?")) return;
    try {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (error) throw error;
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el producto.");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      <header className="flex justify-between items-end bg-white p-6 rounded-2xl border border-pearl-dark shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
            <i className="fa-solid fa-box text-gold"></i> Productos
          </h1>
          <p className="text-slate-500 mt-2">Gestiona el catálogo, categorías y precios de tu tienda.</p>
        </div>
        <button 
          onClick={openNewProduct}
          className="bg-navy text-white px-5 py-2.5 rounded-xl font-medium shadow-[0_4px_15px_rgba(10,22,40,0.15)] hover:bg-navy-light hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Nuevo Producto
        </button>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gold">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <i className="fa-solid fa-box-open text-5xl text-slate-300 mb-4"></i>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No hay productos</h3>
            <p className="text-slate-500 mb-6">Aún no has agregado ningún producto a tu base de datos Supabase.</p>
            <button onClick={openNewProduct} className="text-navy font-bold hover:text-gold flex items-center gap-2">
              <Plus className="w-4 h-4" /> Agregar el primero
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Producto</th>
                  <th className="p-4 font-semibold">Categoría</th>
                  <th className="p-4 font-semibold">Precio</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-white" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-navy text-sm">{p.name}</p>
                        <p className="text-xs text-slate-500 max-w-[200px] truncate">{p.description}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600 capitalize">{p.category}</td>
                    <td className="p-4 font-medium text-navy">${Number(p.price).toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                        {p.stock} uni.
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${p.is_active ? 'bg-teal/10 text-teal-dark' : 'bg-slate-100 text-slate-500'}`}>
                          {p.is_active ? 'Activo' : 'Pausado'}
                        </span>
                        {p.is_featured && <span className="inline-flex w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gold/10 text-gold-dark">Destacado</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditProduct(p)} className="p-2 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-lg transition-colors" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
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

      {isModalOpen && currentProduct && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-navy">{currentProduct.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-navy mb-1.5">Nombre del Producto</label>
                  <input required type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-navy mb-1.5">Descripción</label>
                  <textarea required value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-navy mb-1.5">Precio (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input required type="number" step="0.01" min="0" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-navy mb-1.5">Stock Inicial</label>
                  <input required type="number" min="0" value={currentProduct.stock} onChange={e => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-navy mb-1.5">Categoría</label>
                  <select required value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold">
                    <option value="comestible">Comestible</option>
                    <option value="belleza">Belleza</option>
                    <option value="terapeutica">Terapéutica</option>
                    <option value="combos">Combos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-navy mb-1.5">URL de Imagen (Opcional)</label>
                  <input type="url" value={currentProduct.image_url || ""} onChange={e => setCurrentProduct({...currentProduct, image_url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" placeholder="https://..." />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" checked={currentProduct.is_active} onChange={e => setCurrentProduct({...currentProduct, is_active: e.target.checked})} className="peer sr-only" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700">Producto Activo (Visible en tienda)</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" checked={currentProduct.is_featured} onChange={e => setCurrentProduct({...currentProduct, is_featured: e.target.checked})} className="peer sr-only" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700">Destacado (Página Principal)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
                <button type="submit" disabled={saving} className="bg-navy text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-navy-light transition-colors flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
