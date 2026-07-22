"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ImageIcon,
  CloudUpload,
  Loader2,
  Newspaper,
  ExternalLink,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  PageHeader,
  Panel,
  BrandLoader,
  EmptyPanelState,
  staggerContainer,
  rowVariant,
} from "@/components/admin/AdminUI";

interface FeedRow {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  likes: number;
  created_at: string;
}

const EMPTY_FORM = { title: "", content: "", image_url: "" };

const inputClass =
  "w-full border border-pearl-dark/70 rounded-xl px-4 py-2.5 text-sm bg-white placeholder:text-navy/35 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all duration-300";

function formatDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("es-EC", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default function AdminFeedPage() {
  const [posts, setPosts] = useState<FeedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("feed_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPosts(data || []);
      setLoadError(null);
    } catch (err: any) {
      setPosts([]);
      setLoadError(
        String(err?.message || "").includes("feed_posts")
          ? "La tabla feed_posts no existe todavía. Ejecuta supabase/feed-posts.sql en el SQL Editor de Supabase."
          : err?.message || "No se pudo conectar con la base de datos."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openModal = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setImageFile(null);
    setSaveMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (post: FeedRow) => {
    setForm({
      title: post.title || "",
      content: post.content,
      image_url: post.image_url || "",
    });
    setEditingId(post.id);
    setImageFile(null);
    setSaveMsg(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSaveMsg(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) {
      setSaveMsg({ type: "error", text: "La descripción es requerida." });
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      let finalImageUrl = form.image_url || null;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `feed/feed_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("ai-generations")
          .upload(fileName, imageFile);

        if (uploadError) throw new Error("Error al subir la imagen: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("ai-generations")
          .getPublicUrl(fileName);
        finalImageUrl = publicUrlData.publicUrl;
      }

      const postData = {
        title: form.title.trim(),
        content: form.content.trim(),
        image_url: finalImageUrl,
      };

      if (editingId) {
        const { data: updated, error } = await supabase
          .from("feed_posts")
          .update(postData)
          .eq("id", editingId)
          .select();
        if (error) throw error;
        if (!updated || updated.length === 0) {
          throw new Error("la base de datos no aplicó el cambio (0 filas afectadas — RLS activo)");
        }
        setPosts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...postData } : p)));
        setSaveMsg({ type: "ok", text: "✅ Publicación actualizada." });
      } else {
        const { data, error } = await supabase.from("feed_posts").insert([postData]).select();
        if (error) throw error;
        if (data && data.length > 0) {
          setPosts((prev) => [data[0], ...prev]);
          setSaveMsg({ type: "ok", text: "✅ Publicación creada. Ya es visible en el feed." });
        }
      }
      setTimeout(() => closeModal(), 1200);
    } catch (err: any) {
      console.error(err);
      setSaveMsg({ type: "error", text: `❌ No se pudo guardar: ${err?.message || "error desconocido"}` });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: FeedRow) => {
    if (!window.confirm("¿Eliminar esta publicación del feed? Esta acción no se puede deshacer.")) return;
    try {
      const { data: deleted, error } = await supabase
        .from("feed_posts")
        .delete()
        .eq("id", post.id)
        .select();
      if (error) throw error;
      if (!deleted || deleted.length === 0) {
        throw new Error("La base de datos no eliminó nada (0 filas afectadas — RLS activo).");
      }
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err: any) {
      console.error(err);
      alert("ERROR AL ELIMINAR: " + err.message);
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <PageHeader
        eyebrow="Contenido"
        title="Publicaciones del"
        accent="feed."
        subtitle="Crea, edita y elimina lo que aparece en el feed público del sitio."
      >
        <Link
          href="/feed"
          target="_blank"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white border border-pearl-dark/70 text-navy/70 px-4 sm:px-5 py-2.5 rounded-full font-semibold text-[0.8rem] sm:text-sm hover:border-gold/50 hover:text-navy transition-colors duration-300 shadow-soft"
        >
          <ExternalLink className="w-4 h-4" strokeWidth={1.75} /> Ver feed
        </Link>
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={openModal}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-navy text-pearl px-4 sm:px-6 py-2.5 rounded-full font-semibold text-[0.8rem] sm:text-sm hover:bg-gold hover:text-navy transition-colors duration-500 shadow-raised"
        >
          <Plus className="w-4 h-4" strokeWidth={2} /> Nueva publicación
        </motion.button>
      </PageHeader>

      {loadError && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600"
        >
          {loadError}
        </motion.div>
      )}

      <Panel
        index={1}
        title="Publicaciones"
        subtitle={`${posts.length} en el feed público`}
        icon={<Newspaper className="w-4 h-4" strokeWidth={1.75} />}
      >
        {loading ? (
          <BrandLoader label="Cargando publicaciones…" />
        ) : posts.length === 0 ? (
          <EmptyPanelState
            icon={<Newspaper className="w-8 h-8" strokeWidth={1.25} />}
            title="Sin publicaciones"
            description="Aún no hay publicaciones en el feed. Crea la primera o publica contenido desde Publicidad IA."
          />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-5"
          >
            <AnimatePresence mode="popLayout">
              {posts.map((post) => (
                <motion.article
                  layout
                  key={post.id}
                  variants={rowVariant}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-pearl-dark/70 bg-white shadow-soft hover:shadow-raised hover:border-gold/30 transition-[box-shadow,border-color] duration-500"
                >
                  <div className="relative aspect-[16/10] bg-pearl/40 overflow-hidden">
                    {post.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.image_url}
                        alt={post.title || "Publicación"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-navy/20">
                        <ImageIcon className="w-10 h-10" strokeWidth={1} />
                      </div>
                    )}
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-navy-deep/60 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-pearl backdrop-blur-md">
                      <Calendar className="w-2.5 h-2.5" /> {formatDate(post.created_at)}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    {post.title && (
                      <h3 className="font-heading text-lg text-navy leading-snug mb-1">{post.title}</h3>
                    )}
                    <p className="text-xs text-navy/55 leading-relaxed line-clamp-3">{post.content}</p>

                    <div className="mt-auto pt-3 flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => openEditModal(post)}
                        className="w-9 h-9 rounded-full bg-pearl text-navy/60 hover:bg-navy hover:text-gold transition-colors duration-300 flex items-center justify-center"
                        title="Editar publicación"
                      >
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleDelete(post)}
                        className="w-9 h-9 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300 flex items-center justify-center"
                        title="Eliminar publicación"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Panel>

      {/* MODAL CREAR / EDITAR */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-navy-deep/70 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white w-full sm:max-w-[560px] rounded-t-3xl sm:rounded-3xl shadow-floating overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col"
            >
              <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-pearl-dark/50 flex items-center justify-between bg-gradient-to-r from-pearl/60 to-transparent">
                <div>
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-gold-dark">
                    {editingId ? "Edición" : "Nueva publicación"}
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl text-navy leading-tight">
                    {editingId ? "Editar publicación" : "Publicar en el feed"}
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

              <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                <div className="p-5 sm:p-6 flex flex-col gap-4 sm:gap-5">
                  <div>
                    <label className="text-[0.62rem] font-bold text-navy/50 uppercase tracking-[0.18em] mb-1.5 block">
                      Título <span className="text-navy/30 normal-case tracking-normal">(opcional)</span>
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Ej: Nueva cosecha de sal"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-[0.62rem] font-bold text-navy/50 uppercase tracking-[0.18em] mb-1.5 block">
                      Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.content}
                      onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                      rows={4}
                      required
                      placeholder="Escribe el texto de la publicación…"
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div>
                    <label className="text-[0.62rem] font-bold text-navy/50 uppercase tracking-[0.18em] mb-1.5 block">Foto</label>
                    <div className="flex flex-col gap-3">
                      <div className="relative border-2 border-dashed border-pearl-dark rounded-2xl p-5 text-center hover:border-gold/60 hover:bg-gold/[0.04] transition-colors duration-300 cursor-pointer group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setImageFile(e.target.files[0]);
                              setForm((f) => ({ ...f, image_url: "" }));
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <CloudUpload className="w-7 h-7 text-navy/30 group-hover:text-gold-dark group-hover:-translate-y-0.5 transition-all duration-300" strokeWidth={1.5} />
                          <span className="text-sm font-medium text-navy/60">
                            {imageFile ? <span className="text-navy font-semibold">{imageFile.name}</span> : "Haz clic o arrastra una imagen aquí"}
                          </span>
                          <span className="text-xs text-navy/35">PNG, JPG, WEBP</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <hr className="flex-1 border-pearl-dark/60" />
                        <span className="text-[0.6rem] text-navy/35 font-bold uppercase tracking-[0.18em]">O ingresa URL</span>
                        <hr className="flex-1 border-pearl-dark/60" />
                      </div>

                      <input
                        value={form.image_url}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, image_url: e.target.value }));
                          if (e.target.value) setImageFile(null);
                        }}
                        type="url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className={inputClass}
                      />

                      <AnimatePresence>
                        {(imageFile || form.image_url) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="relative mt-1 aspect-[16/9] rounded-2xl overflow-hidden border border-gold/20 bg-pearl/40">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imageFile ? URL.createObjectURL(imageFile) : form.image_url}
                                alt="Vista previa"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImageFile(null);
                                  setForm((f) => ({ ...f, image_url: "" }));
                                }}
                                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-navy-deep/70 text-pearl backdrop-blur flex items-center justify-center hover:bg-red-500 transition-colors"
                                title="Quitar imagen"
                              >
                                <X className="w-4 h-4" strokeWidth={2} />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

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

                <div className="px-5 sm:px-6 py-4 border-t border-pearl-dark/50 bg-pearl/40 flex justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 sm:px-6 py-2.5 rounded-full border border-pearl-dark text-navy/60 text-sm font-semibold hover:bg-white hover:text-navy transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={saving}
                    className="px-6 sm:px-7 py-2.5 rounded-full bg-navy text-pearl text-sm font-bold hover:bg-gold hover:text-navy transition-colors duration-500 flex items-center gap-2 disabled:opacity-60 shadow-raised"
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                    ) : (
                      <><Save className="w-4 h-4" strokeWidth={1.75} /> {editingId ? "Actualizar" : "Publicar"}</>
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
