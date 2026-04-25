"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { mockProducts } from "@/data/mockProducts";
import { Product } from "@/types/store";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "comestible",
  brand: "LINDASAL",
  is_featured: false,
  is_active: true,
  image_url: "",
  discount_percentage: "",
};

const BRAND_COLORS: Record<string, string> = {
  LINDASAL: "bg-[#c9a84c] text-white",
  "AGUADEMAR QUINTON": "bg-teal text-white",
  NAVELLA: "bg-purple-600 text-white",
};

export default function AdminProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [search, setSearch] = useState("");

  // Load products
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await supabase.from("productos").select("*").order("created_at", { ascending: false });
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(mockProducts);
        }
      } catch {
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openModal = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setImageFile(null);
    setSaveMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      brand: product.brand || "LINDASAL",
      is_featured: product.is_featured,
      is_active: product.is_active,
      image_url: product.image_url || "",
      discount_percentage: product.discount_percentage?.toString() || "",
    });
    setEditingId(product.id);
    setImageFile(null);
    setSaveMsg(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSaveMsg(null);
    setImageFile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      setSaveMsg({ type: "error", text: "Nombre, precio y stock son requeridos." });
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      let finalImageUrl = form.image_url || null;

      // Handle file upload to Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `productos/prod_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("ai-generations")
          .upload(fileName, imageFile);
          
        if (uploadError) {
          throw new Error("Error al subir la imagen: " + uploadError.message);
        }
        
        const { data: publicUrlData } = supabase.storage
          .from("ai-generations")
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrlData.publicUrl;
      }

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: form.category,
        brand: form.brand,
        is_featured: form.is_featured,
        is_active: form.is_active,
        image_url: finalImageUrl,
        discount_percentage: Number(form.discount_percentage) || 0,
      };

      if (editingId) {
        const { error } = await supabase.from("productos").update(productData).eq("id", editingId);
        if (error) throw error;
        
        setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...productData } : p));
        setSaveMsg({ type: "ok", text: "✅ Producto actualizado correctamente en Supabase." });
      } else {
        const { data, error } = await supabase.from("productos").insert([productData]).select();
        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(prev => [data[0], ...prev]);
          setSaveMsg({ type: "ok", text: "✅ Producto agregado correctamente en Supabase." });
        }
      }
      setTimeout(() => closeModal(), 1500);
    } catch (err: any) {
      console.error(err);
      alert("ERROR AL GUARDAR EN BASE DE DATOS: " + err.message + "\n\nAsegúrate de haber ejecutado el código SQL para desactivar RLS.");
      
      const mockImageUrl = imageFile ? URL.createObjectURL(imageFile) : (form.image_url || null);
      
      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: form.category,
        brand: form.brand,
        is_featured: form.is_featured,
        is_active: form.is_active,
        image_url: mockImageUrl,
        discount_percentage: Number(form.discount_percentage) || 0,
      };
      
      // Fallback: add to local state as mock
      if (editingId) {
        setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...productData } : p));
        setSaveMsg({ type: "error", text: `❌ Solo se guardó temporalmente. Error: ${err.message}` });
      } else {
        const mockId = `local-${Date.now()}`;
        const localProduct: Product = {
          id: mockId,
          ...productData
        };
        setProducts(prev => [localProduct, ...prev]);
        setSaveMsg({ type: "error", text: `❌ Solo se guardó temporalmente. Error: ${err.message}` });
      }
      setTimeout(() => closeModal(), 3000);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand || "").toLowerCase().includes(search.toLowerCase())
  );

  // Delete Product
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      const { error } = await supabase.from("productos").delete().eq("id", id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
      // Mostrar alerta de éxito momentánea o usar el state de mensajes si tuvieras uno global
      alert("✅ Producto eliminado correctamente");
    } catch (err: any) {
      console.error(err);
      alert("ERROR AL ELIMINAR: " + err.message);
    }
  };

  // Clean Duplicates
  const handleCleanDuplicates = async () => {
    if (!window.confirm("¿Limpiar productos duplicados? Se conservará solo una copia de cada producto con el mismo nombre.")) return;
    
    // Identificar duplicados
    const seenNames = new Set<string>();
    const duplicateIds: string[] = [];
    
    // Sort by created_at ascending to keep the oldest one
    const sorted = [...products].sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
    
    for (const p of sorted) {
      const normalizedName = p.name.trim().toLowerCase();
      if (seenNames.has(normalizedName)) {
        duplicateIds.push(p.id);
      } else {
        seenNames.add(normalizedName);
      }
    }
    
    if (duplicateIds.length === 0) {
      alert("No se encontraron productos duplicados.");
      return;
    }
    
    try {
      // Eliminar de supabase
      const { error } = await supabase.from("productos").delete().in("id", duplicateIds);
      if (error) throw error;
      
      // Actualizar estado local
      setProducts(prev => prev.filter(p => !duplicateIds.includes(p.id)));
      alert(`✅ Limpieza completada. Se eliminaron ${duplicateIds.length} productos duplicados.`);
    } catch (err: any) {
      console.error(err);
      alert("ERROR AL LIMPIAR: " + err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Productos</h1>
          <p className="text-slate-500 mt-1">Gestiona tu catálogo de productos y precios.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCleanDuplicates}
            className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl font-medium shadow-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
            title="Eliminar duplicados automáticamente"
          >
            <i className="fa-solid fa-broom"></i> Limpiar Repetidos
          </button>
          <button
            onClick={openModal}
            className="bg-navy text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-navy/80 transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i> Nuevo Producto
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o marca..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-navy/40"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-16">
            <div className="w-8 h-8 border-4 border-navy/20 border-t-navy rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <i className="fa-solid fa-box-open text-5xl text-slate-300 mb-6"></i>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Sin productos</h3>
            <p className="text-slate-500 max-w-[400px]">No hay productos que coincidan. Agrega tu primer producto.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Producto</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Marca</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Categoría</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Precio</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Stock</th>
                <th className="text-center px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Estado</th>
                <th className="text-center px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, idx) => (
                <tr key={p.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded-md border border-slate-200 bg-white" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-slate-400">
                          <i className="fa-solid fa-image"></i>
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-slate-800 flex items-center gap-2">
                          {p.name}
                          {p.discount_percentage && p.discount_percentage > 0 ? (
                            <span className="text-[0.6rem] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-sm">-{p.discount_percentage}%</span>
                          ) : null}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]">{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {p.brand && (
                      <span className={`text-[0.65rem] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded ${BRAND_COLORS[p.brand] || "bg-slate-200 text-slate-600"}`}>
                        {p.brand === "AGUADEMAR QUINTON" ? "AGUADEMAR" : p.brand}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-500 capitalize">{p.category}</td>
                  <td className="px-5 py-4 text-right">
                    {p.discount_percentage && p.discount_percentage > 0 ? (
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-navy">${(p.price * (1 - p.discount_percentage / 100)).toFixed(2)}</span>
                        <span className="text-[0.65rem] text-slate-400 line-through">${p.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-navy">${p.price.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className={`font-medium ${p.stock < 10 ? "text-red-500" : "text-slate-700"}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full ${p.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      {p.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4 flex justify-center items-center gap-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-navy hover:text-white transition-colors flex items-center justify-center"
                      title="Editar producto"
                    >
                      <i className="fa-solid fa-pen text-xs"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                      title="Eliminar producto"
                    >
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD/EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-[600px] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="font-bold text-lg text-slate-800">{editingId ? "Editar Producto" : "Nuevo Producto"}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Completa la información del producto</p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
              <div className="p-6 flex flex-col gap-5">
                {/* Nombre */}
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
                    Nombre del Producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Lindasal Sal Gourmet 500g"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-navy/50 focus:ring-1 focus:ring-navy/20"
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Descripción</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe el producto, sus beneficios y características..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-navy/50 focus:ring-1 focus:ring-navy/20 resize-none"
                  />
                </div>

                {/* Precio, Stock y Descuento */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
                      Precio <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        required
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full border border-slate-200 rounded-xl pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:border-navy/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      required
                      type="number"
                      min="0"
                      placeholder="0"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-navy/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                      Descuento
                    </label>
                    <div className="relative">
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                      <input
                        name="discount_percentage"
                        value={form.discount_percentage}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0"
                        className="w-full border border-slate-200 rounded-xl pl-4 pr-8 py-2.5 text-sm focus:outline-none focus:border-navy/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Marca y Categoría */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Marca</label>
                    <select
                      name="brand"
                      value={form.brand}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-navy/50 bg-white"
                    >
                      <option value="LINDASAL">LINDASAL</option>
                      <option value="AGUADEMAR QUINTON">AGUADEMAR QUINTON</option>
                      <option value="NAVELLA">NAVELLA</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Categoría</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-navy/50 bg-white"
                    >
                      <option value="comestible">Comestible</option>
                      <option value="belleza">Belleza</option>
                      <option value="terapeutica">Terapéutica</option>
                      <option value="combos">Combos</option>
                    </select>
                  </div>
                </div>

                {/* File / URL Imagen */}
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 block">Imagen del Producto</label>
                  <div className="flex flex-col gap-3">
                    {/* File Upload Zone */}
                    <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-navy/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                            setForm(prev => ({ ...prev, image_url: "" })); // Clear URL when file selected
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-400 group-hover:text-navy transition-colors"></i>
                        <span className="text-sm font-medium text-slate-600">
                          {imageFile ? <span className="text-navy">{imageFile.name}</span> : "Haz clic o arrastra una imagen aquí"}
                        </span>
                        <span className="text-xs text-slate-400">Archivos PNG, JPG, WEBP</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <hr className="flex-1 border-slate-200" />
                      <span className="text-xs text-slate-400 font-medium uppercase">O ingresa URL</span>
                      <hr className="flex-1 border-slate-200" />
                    </div>

                    {/* URL Input */}
                    <input
                      name="image_url"
                      value={form.image_url}
                      onChange={(e) => {
                        handleChange(e);
                        if (e.target.value) setImageFile(null); // Clear file if URL typed
                      }}
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-navy/50"
                    />

                    {/* Image Preview Area */}
                    {(imageFile || form.image_url) && (
                      <div className="mt-2 flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          <img 
                            src={imageFile ? URL.createObjectURL(imageFile) : form.image_url} 
                            alt="Vista previa" 
                            className="max-w-full max-h-full object-cover" 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement?.classList.add('bg-slate-200');
                            }} 
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">Vista previa activa</span>
                          <button 
                            type="button" 
                            onClick={() => {
                              setImageFile(null);
                              setForm(prev => ({ ...prev, image_url: "" }));
                            }}
                            className="text-xs text-red-500 font-medium hover:text-red-700 text-left mt-0.5"
                          >
                            Quitar imagen
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={form.is_featured}
                      onChange={handleChange}
                      className="w-4 h-4 accent-navy rounded"
                    />
                    <span className="text-sm text-slate-700 font-medium">Producto destacado</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                      className="w-4 h-4 accent-green-600 rounded"
                    />
                    <span className="text-sm text-slate-700 font-medium">Activo en tienda</span>
                  </label>
                </div>

                {/* Feedback */}
                {saveMsg && (
                  <div className={`rounded-xl px-4 py-3 text-sm font-medium ${saveMsg.type === "ok" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {saveMsg.text}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-navy text-white text-sm font-bold hover:bg-navy/80 transition-colors flex items-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Guardando...</>
                  ) : (
                    <><i className="fa-solid fa-floppy-disk"></i> {editingId ? "Actualizar Producto" : "Guardar Producto"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
