"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  ImageIcon,
  PackageOpen,
  CloudUpload,
  Loader2,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { mockProducts } from "@/data/mockProducts";
import { Product } from "@/types/store";
import {
  PageHeader,
  Panel,
  BrandLoader,
  EmptyPanelState,
  fadeUp,
  staggerContainer,
  rowVariant,
} from "@/components/admin/AdminUI";

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
  LINDASAL: "bg-gold/15 text-gold-dark border border-gold/25",
  "AGUADEMAR QUINTON": "bg-teal/15 text-teal-dark border border-teal/25",
  NAVELLA: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
};

const inputClass =
  "w-full border border-pearl-dark/70 rounded-xl px-4 py-2.5 text-sm bg-white placeholder:text-navy/35 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all duration-300";

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
  const handleDelete = async (id: string | number, name: string) => {
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
    const duplicateIds: (string | number)[] = [];

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
    <div className="flex flex-col gap-7">
      <PageHeader
        eyebrow="Catálogo"
        title="Tus"
        accent="productos."
        subtitle="Gestiona tu catálogo de productos, precios y descuentos."
      >
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleCleanDuplicates}
          className="inline-flex items-center gap-2 bg-white border border-pearl-dark/70 text-navy/70 px-5 py-2.5 rounded-full font-semibold text-sm hover:border-gold/50 hover:text-navy transition-colors duration-300 shadow-soft"
          title="Eliminar duplicados automáticamente"
        >
          <Sparkles className="w-4 h-4" strokeWidth={1.75} /> Limpiar repetidos
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={openModal}
          className="inline-flex items-center gap-2 bg-navy text-pearl px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-gold hover:text-navy transition-colors duration-500 shadow-raised"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> Nuevo producto
        </motion.button>
      </PageHeader>

      {/* Search */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible" className="relative">
        <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-navy/35 w-4 h-4" strokeWidth={1.75} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre o marca..."
          className="w-full bg-white border border-pearl-dark/70 rounded-full py-3.5 pl-12 pr-4 text-sm placeholder:text-navy/35 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all shadow-soft"
        />
      </motion.div>

      {/* Products Table */}
      <Panel index={2}>
        {loading ? (
          <BrandLoader label="Cargando catálogo…" />
        ) : filteredProducts.length === 0 ? (
          <EmptyPanelState
            icon={<PackageOpen className="w-8 h-8" strokeWidth={1.25} />}
            title="Sin productos"
            description="No hay productos que coincidan. Agrega tu primer producto."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-pearl-dark/50 bg-pearl/40">
                  <th className="text-left px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Producto</th>
                  <th className="text-left px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Marca</th>
                  <th className="text-left px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Categoría</th>
                  <th className="text-right px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Precio</th>
                  <th className="text-right px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Stock</th>
                  <th className="text-center px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Estado</th>
                  <th className="text-center px-5 py-3.5 font-bold text-navy/45 text-[0.62rem] uppercase tracking-[0.18em]">Acciones</th>
                </tr>
              </thead>
              <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p) => (
                    <motion.tr
                      layout
                      key={p.id}
                      variants={rowVariant}
                      exit={{ opacity: 0, x: -16 }}
                      className="group border-b border-pearl/70 hover:bg-pearl/30 transition-colors duration-300"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-11 h-11 object-cover rounded-xl border border-pearl-dark/60 bg-white transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-11 h-11 bg-pearl rounded-xl border border-pearl-dark/60 flex items-center justify-center text-navy/30">
                              <ImageIcon className="w-4.5 h-4.5" strokeWidth={1.5} />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-navy flex items-center gap-2">
                              {p.name}
                              {p.discount_percentage && p.discount_percentage > 0 ? (
                                <span className="text-[0.58rem] font-bold bg-red-500/10 border border-red-500/20 text-red-500 px-1.5 py-0.5 rounded-full">
                                  -{p.discount_percentage}%
                                </span>
                              ) : null}
                            </div>
                            <div className="text-xs text-navy/40 mt-0.5 line-clamp-1 max-w-[220px]">{p.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {p.brand && (
                          <span className={`text-[0.58rem] font-extrabold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full ${BRAND_COLORS[p.brand] || "bg-pearl text-navy/60 border border-pearl-dark/60"}`}>
                            {p.brand === "AGUADEMAR QUINTON" ? "AGUADEMAR" : p.brand}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-navy/55 capitalize">{p.category}</td>
                      <td className="px-5 py-4 text-right">
                        {p.discount_percentage && p.discount_percentage > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="font-heading text-base text-navy tabular-nums">${(p.price * (1 - p.discount_percentage / 100)).toFixed(2)}</span>
                            <span className="text-[0.65rem] text-navy/35 line-through tabular-nums">${p.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="font-heading text-base text-navy tabular-nums">${p.price.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`font-semibold tabular-nums ${p.stock < 10 ? "text-red-500" : "text-navy/75"}`}>{p.stock}</span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`text-[0.6rem] font-bold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full ${p.is_active ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-pearl text-navy/40 border border-pearl-dark/60"}`}>
                          {p.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.12, rotate: -4 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => openEditModal(p)}
                            className="w-9 h-9 rounded-full bg-pearl text-navy/60 hover:bg-navy hover:text-gold transition-colors duration-300 flex items-center justify-center"
                            title="Editar producto"
                          >
                            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.12, rotate: 4 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handleDelete(p.id, p.name)}
                            className="w-9 h-9 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300 flex items-center justify-center"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </motion.tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* ADD/EDIT PRODUCT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-navy-deep/70 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white w-full max-w-[600px] rounded-3xl shadow-floating overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-pearl-dark/50 flex items-center justify-between bg-gradient-to-r from-pearl/60 to-transparent">
                <div>
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-gold-dark">
                    {editingId ? "Edición" : "Nuevo registro"}
                  </span>
                  <h2 className="font-heading text-2xl text-navy leading-tight">
                    {editingId ? "Editar producto" : "Nuevo producto"}
                  </h2>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                  onClick={closeModal}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-pearl hover:bg-navy hover:text-gold text-navy/60 transition-colors duration-300"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </motion.button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                <div className="p-6 flex flex-col gap-5">
                  {/* Nombre */}
                  <div>
                    <label className="text-[0.62rem] font-bold text-navy/50 uppercase tracking-[0.18em] mb-1.5 block">
                      Nombre del producto <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Ej: Lindasal Sal Gourmet 500g"
                      className={inputClass}
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="text-[0.62rem] font-bold text-navy/50 uppercase tracking-[0.18em] mb-1.5 block">Descripción</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe el producto, sus beneficios y características..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {/* Precio, Stock y Descuento */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[0.62rem] font-bold text-navy/50 uppercase tracking-[0.18em] mb-1.5 block">
                        Precio <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/35 font-bold">$</span>
                        <input
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                          required
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className={`${inputClass} !pl-7`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[0.62rem] font-bold text-navy/50 uppercase tracking-[0.18em] mb-1.5 block">
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
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-[0.62rem] font-bold text-navy/50 uppercase tracking-[0.18em] mb-1.5 block">
                        Descuento
                      </label>
                      <div className="relative">
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/35 font-bold">%</span>
                        <input
                          name="discount_percentage"
                          value={form.discount_percentage}
                          onChange={handleChange}
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          className={`${inputClass} !pr-8`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Marca y Categoría */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[0.62rem] font-bold text-navy/50 uppercase tracking-[0.18em] mb-1.5 block">Marca</label>
                      <select
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        className={`${inputClass} cursor-pointer`}
                      >
                        <option value="LINDASAL">LINDASAL</option>
                        <option value="AGUADEMAR QUINTON">AGUADEMAR QUINTON</option>
                        <option value="NAVELLA">NAVELLA</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[0.62rem] font-bold text-navy/50 uppercase tracking-[0.18em] mb-1.5 block">Categoría</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={`${inputClass} cursor-pointer`}
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
                    <label className="text-[0.62rem] font-bold text-navy/50 uppercase tracking-[0.18em] mb-1.5 block">Imagen del producto</label>
                    <div className="flex flex-col gap-3">
                      {/* File Upload Zone */}
                      <div className="relative border-2 border-dashed border-pearl-dark rounded-2xl p-5 text-center hover:border-gold/60 hover:bg-gold/[0.04] transition-colors duration-300 cursor-pointer group">
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
                          <CloudUpload className="w-7 h-7 text-navy/30 group-hover:text-gold-dark group-hover:-translate-y-0.5 transition-all duration-300" strokeWidth={1.5} />
                          <span className="text-sm font-medium text-navy/60">
                            {imageFile ? <span className="text-navy font-semibold">{imageFile.name}</span> : "Haz clic o arrastra una imagen aquí"}
                          </span>
                          <span className="text-xs text-navy/35">Archivos PNG, JPG, WEBP</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <hr className="flex-1 border-pearl-dark/60" />
                        <span className="text-[0.6rem] text-navy/35 font-bold uppercase tracking-[0.18em]">O ingresa URL</span>
                        <hr className="flex-1 border-pearl-dark/60" />
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
                        className={inputClass}
                      />

                      {/* Image Preview Area */}
                      <AnimatePresence>
                        {(imageFile || form.image_url) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1 flex items-center gap-3 p-3 rounded-2xl border border-gold/20 bg-gold/[0.05]">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-pearl-dark/60 flex-shrink-0 flex items-center justify-center">
                                <img
                                  src={imageFile ? URL.createObjectURL(imageFile) : form.image_url}
                                  alt="Vista previa"
                                  className="max-w-full max-h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('bg-pearl');
                                  }}
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-navy">Vista previa activa</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setImageFile(null);
                                    setForm(prev => ({ ...prev, image_url: "" }));
                                  }}
                                  className="text-xs text-red-500 font-medium hover:text-red-600 text-left mt-0.5"
                                >
                                  Quitar imagen
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={form.is_featured}
                        onChange={handleChange}
                        className="w-4 h-4 accent-[#c9a84c] rounded"
                      />
                      <span className="text-sm text-navy/75 font-medium group-hover:text-navy transition-colors">Producto destacado</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 accent-green-600 rounded"
                      />
                      <span className="text-sm text-navy/75 font-medium group-hover:text-navy transition-colors">Activo en tienda</span>
                    </label>
                  </div>

                  {/* Feedback */}
                  <AnimatePresence>
                    {saveMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`rounded-xl px-4 py-3 text-sm font-medium ${saveMsg.type === "ok" ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/25" : "bg-red-500/10 text-red-600 border border-red-500/25"}`}
                      >
                        {saveMsg.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-pearl-dark/50 bg-pearl/40 flex justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2.5 rounded-full border border-pearl-dark text-navy/60 text-sm font-semibold hover:bg-white hover:text-navy transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={saving}
                    className="px-7 py-2.5 rounded-full bg-navy text-pearl text-sm font-bold hover:bg-gold hover:text-navy transition-colors duration-500 flex items-center gap-2 disabled:opacity-60 shadow-raised"
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                    ) : (
                      <><Save className="w-4 h-4" strokeWidth={1.75} /> {editingId ? "Actualizar producto" : "Guardar producto"}</>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
