"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Share2,
  Sparkles,
  Loader2,
  RefreshCw,
  Zap,
  Square,
  Smartphone,
  Monitor,
  RectangleHorizontal,
  Globe,
  Camera,
  X,
  AlertTriangle,
  Bot,
  Package,
  UploadCloud,
  Image as ImageIcon
} from "lucide-react";
import PostCard from "@/components/social/PostCard";
import PostFilters from "@/components/social/PostFilters";
import PostEditor from "@/components/social/PostEditor";
import EmptyState from "@/components/social/EmptyState";
import SettingsPanel from "@/components/social/SettingsPanel";
import type { SocialPost, PostStatus, Platform } from "@/lib/types/social.types";

const FORMAT_OPTIONS = [
  { id: "square", label: "Cuadrado", ratio: "1:1", icon: Square },
  { id: "vertical", label: "Vertical", ratio: "9:16", icon: Smartphone },
  { id: "horizontal", label: "Horizontal", ratio: "16:9", icon: Monitor },
  { id: "portrait", label: "Retrato", ratio: "4:5", icon: RectangleHorizontal },
];

const PLATFORM_OPTIONS: { value: Platform; label: string; icon: React.ElementType }[] = [
  { value: "facebook", label: "Facebook", icon: Globe },
  { value: "instagram", label: "Instagram", icon: Camera },
  { value: "both", label: "Ambas", icon: Share2 },
];

export default function SocialDashboardPage() {
  // State
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PostStatus | "all">("all");
  const [activeTab, setActiveTab] = useState<"posts" | "settings">("posts");
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);

  // Generate form state
  const [showGenerator, setShowGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [imageFormat, setImageFormat] = useState("square");
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [brandVoice, setBrandVoice] = useState("profesional y elegante, estilo premium");
  const [scheduledAt, setScheduledAt] = useState("");
  const [genError, setGenError] = useState<string | null>(null);
  const [genSuccess, setGenSuccess] = useState<string | null>(null);

  // Product Ad Mode
  const [isProductAd, setIsProductAd] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    usage: "",
    price: "",
    stock: "",
    imageUrl: ""
  });

  // Handle pasting images
  const handleImagePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) handleImageFile(file);
        break;
      }
    }
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result && typeof result === "string") {
        setProductData(prev => ({ ...prev, imageUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (activeFilter !== "all") params.set("status", activeFilter);
      params.set("limit", "50");

      const res = await fetch(`/api/social/posts?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setPosts(data.posts);
        setCounts(data.counts || {});
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Generate new post
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || generating) return;

    setGenerating(true);
    setGenError(null);
    setGenSuccess(null);

    try {
      const res = await fetch("/api/social/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          platform,
          imageFormat,
          brandVoice,
          scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
          isProductAd,
          productData: isProductAd ? productData : null
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setGenSuccess(`¡Post generado con ${data.model || "Nano Banana"}!`);
        setTopic("");
        setScheduledAt("");
        setShowGenerator(false);
        fetchPosts();
      } else {
        setGenError(data.error || "Error generando el post.");
      }
    } catch (err) {
      setGenError("Error de conexión con el servidor.");
    } finally {
      setGenerating(false);
    }
  };

  // Post actions
  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/social/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    if (res.ok) fetchPosts();
  };

  const handleReject = async (id: string) => {
    const res = await fetch(`/api/social/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    if (res.ok) fetchPosts();
  };

  const handleEdit = async (
    id: string,
    data: { caption?: string; platform?: Platform; scheduled_at?: string | null }
  ) => {
    const res = await fetch(`/api/social/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchPosts();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/social/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      fetchPosts();
    }
  };

  const handlePublishNow = async (id: string) => {
    await fetch(`/api/social/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduled_at: new Date().toISOString() }),
    });
    await fetch("/api/social/publish", { method: "POST" });
    fetchPosts();
  };

  const handleRetry = async (id: string) => {
    await fetch(`/api/social/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pending" }),
    });
    fetchPosts();
  };

  const handleRegenerateImage = async (post: any) => {
    const res = await fetch(`/api/social/posts/${post.id}/regenerate`, { method: "POST" });
    if (res.ok) {
      fetchPosts();
    } else {
      const error = await res.json();
      alert("Error regenerando la imagen: " + (error.error || ""));
    }
  };

  return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* ═══ Header ═══ */}
        <div className="relative">
          <div className="absolute top-0 left-0 w-40 h-40 bg-gold/15 rounded-full blur-[80px] -z-10" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gold/10 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-navy tracking-tight flex items-center gap-3 drop-shadow-sm">
                <div className="bg-gradient-to-r from-gold to-gold-light p-2.5 rounded-xl shadow-sm">
                  <Share2 className="w-8 h-8 text-navy" />
                </div>
                Social Media IA
              </h1>
              <p className="text-gray-500 mt-2 text-base flex items-center gap-2">
                Genera, aprueba y publica contenido para Lindasal con{" "}
                <span className="text-gold font-black flex items-center gap-1">
                  <Bot className="w-4 h-4" /> Nano Banana
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab("posts")}
                className={`font-semibold px-4 py-2 rounded-lg transition-all ${
                  activeTab === "posts" ? "bg-navy text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                Publicaciones
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`font-semibold px-4 py-2 rounded-lg transition-all ${
                  activeTab === "settings" ? "bg-navy text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                Ajustes Meta
              </button>
            </div>
          </div>
        </div>

        {activeTab === "settings" ? (
           <SettingsPanel />
        ) : (
          <>
            <div className="flex justify-end gap-3 mb-4">
              <button
                onClick={() => fetchPosts()}
                className="bg-white hover:bg-gray-50 text-gray-400 hover:text-navy p-3 rounded-xl border border-gray-200 transition-all shadow-sm"
                title="Recargar"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowGenerator(!showGenerator)}
                className={`font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-sm ${
                  showGenerator
                    ? "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                    : "bg-gold text-navy hover:bg-gold-light"
                }`}
              >
                <Sparkles className={`w-5 h-5 ${showGenerator ? "" : "fill-navy"}`} />
                {showGenerator ? "Ocultar Creador" : "Crear Publicación"}
              </button>
            </div>
            {/* ═══ Success Message ═══ */}
        {genSuccess && (
          <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl border border-emerald-500/20 font-bold text-sm flex items-center gap-2 animate-in">
            <Zap className="w-4 h-4 shrink-0" /> {genSuccess}
            <button
              onClick={() => setGenSuccess(null)}
              className="ml-auto text-emerald-600 hover:text-emerald-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ═══ Generator Panel ═══ */}
        {showGenerator && (
          <div className="bg-white rounded-3xl border border-gold/20 p-5 sm:p-8 shadow-xl relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border bg-gold/10 border-gold/20 text-gold">
                <Bot className="w-3.5 h-3.5" />
                Doble IA — Texto (OpenAI) + Imagen (Gemini)
              </div>
            </div>

            {genError && (
              <div className="mb-6 bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 font-semibold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {genError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-6 border-b border-gray-100 pb-6">
              <button
                type="button"
                onClick={() => setIsProductAd(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  !isProductAd ? "bg-navy text-white shadow-md transform scale-[1.02]" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                📝 Post General
                <span className="block text-[10px] font-normal text-white/70 mt-0.5">IA crea Imagen y Texto</span>
              </button>
              <button
                type="button"
                onClick={() => setIsProductAd(true)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
                  isProductAd ? "bg-gold text-navy shadow-md transform scale-[1.02]" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Package className="w-4 h-4" /> 🛍️ Anuncio Producto
                </div>
                <span className="block text-[10px] font-normal text-navy/70 mt-0.5">IA solo crea Texto de Venta</span>
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              
              {isProductAd && (
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 mb-6 space-y-4">
                  <h4 className="font-bold text-navy flex items-center gap-2 text-sm uppercase tracking-widest"><Package className="w-4 h-4" /> Datos del Producto</h4>
                  
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Imagen del Producto (Pega Ctrl+V o Sube)</label>
                    <div 
                      className={`relative w-full border-2 border-dashed ${productData.imageUrl.startsWith("data:image/") || productData.imageUrl.startsWith("http") ? 'border-gold/50 bg-gold/5' : 'border-gray-300 bg-white hover:bg-gray-50'} rounded-xl transition-all overflow-hidden flex flex-col items-center justify-center p-4`}
                      onPaste={handleImagePaste}
                    >
                      {productData.imageUrl && (productData.imageUrl.startsWith("data:image/") || productData.imageUrl.startsWith("http")) ? (
                        <div className="relative w-full h-40 flex items-center justify-center">
                          <img src={productData.imageUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg shadow-sm" />
                          <button 
                            type="button" 
                            onClick={() => setProductData({...productData, imageUrl: ""})}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md hover:bg-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-6 pointer-events-none">
                          <UploadCloud className="w-8 h-8 text-gold mx-auto mb-2 opacity-80" />
                          <p className="text-sm font-medium text-navy">Haz clic, Pega (Ctrl+V) o ingresa URL</p>
                          <p className="text-xs text-gray-400 mt-1">Soporta PNG, JPG</p>
                        </div>
                      )}
                      
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => e.target.files && e.target.files[0] && handleImageFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Subir imagen"
                      />
                    </div>
                    {/* Fallback manual URL input */}
                    <input 
                      type="url" 
                      value={productData.imageUrl} 
                      onChange={e => setProductData({...productData, imageUrl: e.target.value})} 
                      className="w-full mt-2 bg-white text-navy border border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold/50 text-xs" 
                      placeholder="... o ingresa una URL de imagen directamente" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Nombre</label>
                      <input required type="text" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} className="w-full bg-white text-navy border border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold/50 text-sm" placeholder="Ej: Sal Marina Premium" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Precio ($)</label>
                      <input required type="number" step="0.01" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} className="w-full bg-white text-navy border border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold/50 text-sm" placeholder="9.99" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Descripción / Beneficios</label>
                      <input required type="text" value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} className="w-full bg-white text-navy border border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold/50 text-sm" placeholder="Ej: Sin procesar, rica en oligoelementos" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Forma de Uso</label>
                      <input required type="text" value={productData.usage} onChange={e => setProductData({...productData, usage: e.target.value})} className="w-full bg-white text-navy border border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold/50 text-sm" placeholder="Ej: Ideal para parrilladas y asados" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5 block">Stock (Opcional)</label>
                      <input type="number" value={productData.stock} onChange={e => setProductData({...productData, stock: e.target.value})} className="w-full bg-white text-navy border border-gray-200 rounded-xl px-4 py-2.5 focus:border-gold/50 text-sm" placeholder="Ej: 50" />
                    </div>
                  </div>
                </div>
              )}

              {/* Topic Input */}
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
                  {isProductAd ? "Instrucciones de Venta / Hook Principal" : "Tema / Idea del post para Lindasal"}
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={isProductAd ? "Ej: Crea un post enfocado en urgencia diciendo que es perfecto para regalos..." : "Ej: Destaca que nuestra sal marina no pasa por procesos químicos de refinamiento a diferencia de la sal de mesa tradicional..."}
                  className="w-full bg-gray-50 text-navy border border-gray-200 rounded-2xl p-5 focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/50 resize-none h-28 transition-all text-base font-medium shadow-inner placeholder-gray-400"
                />
              </div>

              {/* Brand Voice */}
              <div>
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
                  Tono de voz (Personalizado)
                </label>
                <input
                  type="text"
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  className="w-full bg-gray-50 text-navy border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gold/50 text-sm"
                  placeholder="profesional y elegante"
                />
              </div>

              {/* Format + Platform Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Image Format - Hidden for product ads */}
                {!isProductAd && (
                  <div>
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
                      Formato visual
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FORMAT_OPTIONS.map((fmt) => {
                        const selected = imageFormat === fmt.id;
                        const Icon = fmt.icon;
                        return (
                          <button
                            key={fmt.id}
                            type="button"
                            onClick={() => setImageFormat(fmt.id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-xs font-bold ${
                              selected
                                ? "bg-gold/10 border-gold/40 text-gold-dark shadow-sm"
                                : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-white"
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {fmt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Platform */}
                <div>
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
                    Red Social Destino
                  </label>
                  <div className="flex gap-2">
                    {PLATFORM_OPTIONS.map((opt) => {
                      const active = platform === opt.value;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setPlatform(opt.value)}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-xs font-bold ${
                            active
                              ? "bg-teal-light/20 border-teal/40 text-teal-dark shadow-sm"
                              : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-white"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={generating || !topic.trim() || (isProductAd && !productData.imageUrl)}
                className="w-full bg-gold text-navy font-black px-8 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gold-light transition-all shadow-md disabled:opacity-30 active:scale-[0.98] text-base"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {isProductAd ? "Escribiendo anuncio..." : "Generando recursos visuales..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 fill-navy" />
                    {isProductAd ? "Generar Anuncio de Venta" : "Generar Post con Inteligencia Artificial"}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ═══ Filters ═══ */}
        <PostFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />

        {/* ═══ Posts Grid ═══ */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-gold" />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            onGenerate={() => setShowGenerator(true)}
            filterActive={activeFilter !== "all"}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onApprove={handleApprove}
                onReject={handleReject}
                onEdit={(p) => setEditingPost(p)}
                onSave={handleEdit}
                onDelete={handleDelete}
                onPublishNow={handlePublishNow}
                onRetry={handleRetry}
                onRegenerateImage={handleRegenerateImage}
              />
            ))}
          </div>
        )}
        </>
        )}

      {/* ═══ Editor Modal ═══ */}
      {editingPost && (
        <PostEditor
          post={editingPost}
          onSave={handleEdit}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
}
