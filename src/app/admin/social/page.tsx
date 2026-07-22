"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Palette,
  ChevronDown,
  ImageIcon,
  CloudUpload,
  Camera,
  WandSparkles,
  Zap,
  Eye,
  Info,
  CircleAlert,
  Download,
  Copy,
  Trash2,
  Expand,
  History,
  ArrowUp,
  User,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  PageHeader,
  Panel,
  fadeUp,
  staggerContainer,
  rowVariant,
} from "@/components/admin/AdminUI";

const BRANDS = [
  { id: "LINDASAL", label: "Lindasal", color: "bg-[#c9a84c] text-white", hex: "#c9a84c" },
  { id: "NAVELLA", label: "Navella", color: "bg-[#7c3aed] text-white", hex: "#7c3aed" },
  { id: "AGUADEMAR QUINTON", label: "Aguademar", color: "bg-[#14b8a6] text-white", hex: "#14b8a6" },
];

interface BrandLogos {
  LINDASAL: string;
  NAVELLA: string;
  "AGUADEMAR QUINTON": string;
}

const labelClass =
  "text-[0.62rem] font-bold text-navy/50 uppercase tracking-[0.18em] mb-2 block";
const inputClass =
  "w-full border border-pearl-dark/70 rounded-xl p-3 text-sm bg-pearl/30 placeholder:text-navy/35 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 focus:bg-white transition-all duration-300";

export default function AdminSocialPage() {
  // Form state
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("LINDASAL");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountPercent, setDiscountPercent] = useState("");
  const [productImage, setProductImage] = useState<string | null>(null);
  const [productImageFile, setProductImageFile] = useState<File | null>(null);

  // Brand logos state
  const [brandLogos, setBrandLogos] = useState<BrandLogos>({
    LINDASAL: "",
    NAVELLA: "",
    "AGUADEMAR QUINTON": "",
  });

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // UI state
  const [showLogosConfig, setShowLogosConfig] = useState(false);

  // History state
  const [postHistory, setPostHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from("social_posts")
        .select("id, image_url, caption, created_at, status")
        .eq("user_id", "lindasal_master")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPostHistory(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleDeleteHistoryPost = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta imagen permanentemente del historial?')) return;
    try {
      const { error } = await supabase.from('social_posts').delete().eq('id', id);
      if (error) throw error;
      await loadHistory();
    } catch (e: any) {
      alert("Error eliminando: " + e.message);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load brand logos from configuracion
  useEffect(() => {
    async function loadLogos() {
      try {
        const { data } = await supabase
          .from("configuracion")
          .select("key, value")
          .in("key", ["logo_LINDASAL", "logo_NAVELLA", "logo_AGUADEMAR QUINTON"]);

        if (data) {
          const logos: any = { ...brandLogos };
          data.forEach((item: any) => {
            const brand = item.key.replace("logo_", "");
            logos[brand] = item.value;
          });
          setBrandLogos(logos);
        }
      } catch {}
    }
    loadLogos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Upload brand logo
  const handleUploadBrandLogo = async (brandId: string, file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `logo_${brandId.replace(/\s+/g, "_")}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("logos")
        .getPublicUrl(fileName);

      const url = publicUrlData.publicUrl;

      // Guardar en configuración
      await supabase
        .from("configuracion")
        .upsert({ key: `logo_${brandId}`, value: url }, { onConflict: "key" });

      setBrandLogos(prev => ({ ...prev, [brandId]: url }));
    } catch (err: any) {
      alert("Error subiendo logo: " + err.message);
    }
  };

  // Handle product image upload
  const handleProductImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProductImageFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setProductImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Generate advertisement image
  const handleGenerate = async () => {
    if (!productName.trim()) {
      setErrorMsg("Escribe el nombre del producto.");
      return;
    }
    if (!productImage) {
      setErrorMsg("Sube una foto del producto.");
      return;
    }

    setErrorMsg("");
    setIsGenerating(true);
    setGeneratedImage(null);
    setGeneratedCaption("");

    const brand = BRANDS.find(b => b.id === selectedBrand);
    const finalPrice = hasDiscount && discountPercent
      ? (parseFloat(productPrice) * (1 - parseFloat(discountPercent) / 100)).toFixed(2)
      : productPrice;
    const brandLogoUrl = brandLogos[selectedBrand as keyof BrandLogos];

    try {
      const response = await fetch("/api/social/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `Crea una imagen publicitaria PROFESIONAL para redes sociales del producto "${productName}" de la marca ${brand?.label || selectedBrand}.
Precio: $${productPrice}${hasDiscount && discountPercent ? ` (ANTES $${productPrice}, AHORA $${finalPrice} — ${discountPercent}% de descuento)` : ""}.
Descripción: ${productDesc || "Producto premium de alta calidad"}.
Colores de marca: ${brand?.hex || "#c9a84c"}.
INSTRUCCIONES CRÍTICAS PARA LA IMAGEN:
1. La imagen DEBE ser un anuncio publicitario de ALTA CALIDAD para Instagram/Facebook.
2. El producto (foto adjunta) DEBE ser el PROTAGONISTA ABSOLUTO, centrado y bien iluminado.
3. Integra el nombre del producto "${productName}" y el precio "$${hasDiscount ? finalPrice : productPrice}" como texto elegante y legible dentro de la imagen.
${hasDiscount && discountPercent ? `4. Incluye un badge/etiqueta de descuento llamativo que diga "-${discountPercent}%" y muestra el precio original tachado "$${productPrice}" y el nuevo precio "$${finalPrice}" destacado.` : ""}
5. El fondo debe ser profesional, moderno y acorde a los colores de la marca (${brand?.hex}).
6. NO inventes un producto nuevo, usa EXACTAMENTE el producto de la foto adjunta.
7. La composición debe verse como un anuncio de revista premium.
${brandLogoUrl ? "8. Incluye el LOGO de la marca (adjunto como imagen de referencia) en una esquina de forma elegante." : ""}`,
          platform: "instagram",
          imageFormat: "portrait",
          brandVoice: "comercial, premium y atractivo",
          isProductAd: true,
          productData: {
            name: productName,
            price: productPrice,
            description: productDesc,
            imageUrl: productImage,
            stock: "Disponible",
            usage: "",
            brand: brand?.label || selectedBrand,
            brandLogoUrl: brandLogoUrl,
            hasDiscount: hasDiscount,
            discountValue: discountPercent
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        let errMsg = "Error generando la imagen.";
        if (typeof result.error === "string") errMsg = result.error;
        else if (result.error?.message) errMsg = result.error.message;
        else if (result.error) errMsg = JSON.stringify(result.error);

        throw new Error(errMsg);
      }

      if (result.post?.image_url) {
        setGeneratedImage(result.post.image_url);
      }
      if (result.post?.caption) {
        setGeneratedCaption(result.post.caption);
      }

      // Refresh history with new image
      await loadHistory();
    } catch (err: any) {
      console.error("Error:", err);
      setErrorMsg(err.message || "Error generando la imagen publicitaria.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-7">
      <PageHeader
        eyebrow="Marketing"
        title="Publicidad de"
        accent="productos."
        subtitle="Genera imágenes publicitarias profesionales con IA para tus redes sociales."
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
          className="bg-teal/10 text-teal-dark px-4 py-2 border border-teal/25 rounded-full text-sm font-bold flex items-center gap-2"
        >
          <Bot className="w-4 h-4 animate-float" strokeWidth={1.75} /> Gemini AI
        </motion.div>
      </PageHeader>

      {/* BRAND LOGOS CONFIG (COLLAPSIBLE) */}
      <Panel index={1}>
        <button
          onClick={() => setShowLogosConfig(!showLogosConfig)}
          className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-pearl/30 transition-colors duration-300 group"
        >
          <div className="text-left flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 text-gold-dark flex items-center justify-center transition-transform duration-500 group-hover:-rotate-6">
              <Palette className="w-4 h-4" strokeWidth={1.75} />
            </span>
            <div>
              <h2 className="font-heading text-lg sm:text-xl text-navy leading-tight">Ajustes de logos</h2>
              <p className="text-[0.68rem] sm:text-xs text-navy/45 mt-0.5">Sube los logos PNG sin fondo para cada marca.</p>
            </div>
          </div>
          <motion.span
            animate={{ rotate: showLogosConfig ? 180 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-navy/40"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {showLogosConfig && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="p-6 border-t border-pearl-dark/50 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {BRANDS.map((brand, i) => (
                  <motion.div
                    key={brand.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-pearl-dark bg-pearl/40 flex items-center justify-center overflow-hidden hover:border-gold/50 transition-colors duration-300">
                      {brandLogos[brand.id as keyof BrandLogos] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={brandLogos[brand.id as keyof BrandLogos]}
                          alt={brand.label}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <ImageIcon className="w-7 h-7 text-navy/25" strokeWidth={1.25} />
                      )}
                    </div>
                    <span className={`text-[0.62rem] font-extrabold uppercase tracking-[0.14em] px-3 py-1 rounded-full ${brand.color}`}>
                      {brand.label}
                    </span>
                    <label className="text-xs font-bold text-navy/50 cursor-pointer hover:text-navy transition-colors flex items-center gap-1.5">
                      <CloudUpload className="w-3.5 h-3.5" strokeWidth={1.75} />
                      {brandLogos[brand.id as keyof BrandLogos] ? "Cambiar" : "Subir PNG"}
                      <input
                        type="file"
                        accept="image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadBrandLogo(brand.id, file);
                        }}
                      />
                    </label>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Panel>

      {/* MAIN GENERATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Form */}
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl sm:rounded-3xl border border-pearl-dark/70 shadow-soft p-4 sm:p-7 flex flex-col gap-4 sm:gap-5"
        >
          <h3 className="font-heading text-xl text-navy flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
              <WandSparkles className="w-4 h-4 text-gold-dark" strokeWidth={1.75} />
            </span>
            Datos del producto
          </h3>

          {/* Product Image Upload */}
          <div>
            <label className={labelClass}>Foto del producto</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 rounded-2xl border-2 border-dashed border-pearl-dark bg-pearl/30 flex items-center justify-center cursor-pointer hover:border-gold/50 hover:bg-gold/[0.04] transition-all duration-300 overflow-hidden relative group"
            >
              {productImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={productImage} alt="Producto" className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-navy-deep/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm inline-flex items-center gap-2">
                      <Camera className="w-4 h-4" strokeWidth={1.75} /> Cambiar foto
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center text-navy/35">
                  <CloudUpload className="w-8 h-8 mx-auto mb-2 group-hover:-translate-y-1 group-hover:text-gold-dark transition-all duration-300" strokeWidth={1.5} />
                  <p className="text-sm font-medium">Haz clic para subir la foto del producto</p>
                  <p className="text-xs text-navy/25 mt-1">PNG o JPG recomendado</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProductImage}
              className="hidden"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className={labelClass}>Nombre del producto</label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="Ej: Sal Gourmet Lindasal 500g"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Descripción / Beneficios</label>
            <textarea
              value={productDesc}
              onChange={e => setProductDesc(e.target.value)}
              placeholder="Ej: Sal marina 100% natural, artesanal, con más de 80 minerales..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Brand */}
          <div>
            <label className={labelClass}>Marca</label>
            <div className="flex flex-col sm:flex-row gap-2">
              {BRANDS.map(brand => (
                <motion.button
                  key={brand.id}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-300 ${
                    selectedBrand === brand.id
                      ? `${brand.color} border-transparent shadow-raised scale-[1.02]`
                      : "bg-white border-pearl-dark/70 text-navy/50 hover:border-navy/25 hover:text-navy"
                  }`}
                >
                  {brand.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className={labelClass}>Precio ($)</label>
            <input
              type="number"
              step="0.01"
              value={productPrice}
              onChange={e => setProductPrice(e.target.value)}
              placeholder="Ej: 4.00"
              className={inputClass}
            />
          </div>

          {/* Discount Toggle */}
          <div className="flex items-center justify-between bg-pearl/40 rounded-2xl p-4 border border-pearl-dark/60">
            <div>
              <p className="font-bold text-sm text-navy">¿Tiene descuento?</p>
              <p className="text-xs text-navy/40">Activar para mostrar oferta en la imagen</p>
            </div>
            <button
              type="button"
              onClick={() => setHasDiscount(!hasDiscount)}
              aria-pressed={hasDiscount}
              className={`w-12 h-7 rounded-full transition-colors duration-300 relative ${hasDiscount ? "bg-emerald-500" : "bg-pearl-dark"}`}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 32 }}
                className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow ${hasDiscount ? "left-[26px]" : "left-[3px]"}`}
              />
            </button>
          </div>

          {/* Discount Percentage */}
          <AnimatePresence>
            {hasDiscount && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <label className={labelClass}>Porcentaje de descuento (%)</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={discountPercent}
                      onChange={e => setDiscountPercent(e.target.value)}
                      placeholder="Ej: 20"
                      className={`${inputClass} !w-24 text-center font-bold`}
                    />
                    <span className="text-navy/40 text-sm">%</span>
                  </div>
                  {productPrice && discountPercent && (
                    <div className="flex items-center gap-2 text-sm mt-2 sm:mt-0">
                      <span className="text-navy/35 line-through tabular-nums">${parseFloat(productPrice).toFixed(2)}</span>
                      <span className="font-bold text-emerald-600 tabular-nums">${(parseFloat(productPrice) * (1 - parseFloat(discountPercent) / 100)).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/25 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
              >
                <CircleAlert className="w-4 h-4 shrink-0" strokeWidth={1.75} /> {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <motion.button
            whileHover={isGenerating ? {} : { y: -2 }}
            whileTap={isGenerating ? {} : { scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="relative overflow-hidden mt-2 bg-navy text-pearl font-bold py-4 rounded-2xl hover:bg-navy-light transition-colors duration-500 flex items-center justify-center gap-3 text-base disabled:opacity-70 disabled:cursor-wait shadow-raised group"
          >
            {isGenerating && (
              <span aria-hidden="true" className="absolute inset-0 animate-shimmer" />
            )}
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando imagen publicitaria...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 text-gold transition-transform duration-500 group-hover:scale-125" strokeWidth={1.75} />
                Generar imagen publicitaria
              </>
            )}
          </motion.button>

          {isGenerating && (
            <p className="text-xs text-navy/40 text-center flex items-center justify-center gap-1.5">
              <Info className="w-3.5 h-3.5" strokeWidth={1.75} />
              Esto puede tardar entre 15-45 segundos. La IA está componiendo tu imagen.
            </p>
          )}
        </motion.div>

        {/* RIGHT: Preview */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-b from-pearl/50 to-white rounded-2xl sm:rounded-3xl border border-pearl-dark/70 shadow-soft p-4 sm:p-7 flex flex-col"
        >
          <h3 className="font-heading text-xl text-navy mb-4 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-navy text-gold flex items-center justify-center">
              <Eye className="w-4 h-4" strokeWidth={1.75} />
            </span>
            Vista previa del resultado
          </h3>

          <div className="flex-1 bg-white border border-pearl-dark/60 rounded-2xl shadow-soft relative min-h-[400px] flex flex-col overflow-hidden">
            {generatedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col h-full"
              >
                {/* Instagram-like header */}
                <div className="flex items-center gap-3 p-4 border-b border-pearl/80">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-teal flex items-center justify-center text-white text-xs font-bold shadow-[0_0_14px_rgba(201,168,76,0.35)]">LS</div>
                  <div>
                    <p className="font-bold text-sm text-navy">lindasalec</p>
                    <p className="text-[0.65rem] text-navy/40">Patrocinado</p>
                  </div>
                </div>

                {/* Generated Image */}
                <div className="flex-1 bg-pearl/50 flex items-center justify-center overflow-hidden relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={generatedImage}
                    alt="Imagen publicitaria generada"
                    className="w-full h-full object-contain"
                  />
                  {/* Botones Flotantes (Hover) */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => window.open(generatedImage, '_blank')}
                      className="bg-navy-deep/70 hover:bg-navy-deep text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors shadow-lg"
                      title="Ver en pantalla completa"
                    >
                      <Expand className="w-4 h-4" strokeWidth={1.75} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        if(confirm('¿Estás seguro de descartar esta imagen?')) {
                          setGeneratedImage(null);
                          setGeneratedCaption("");
                        }
                      }}
                      className="bg-red-500/80 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors shadow-lg"
                      title="Descartar imagen"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                    </motion.button>
                  </div>
                </div>

                {/* Caption Preview */}
                {generatedCaption && (
                  <div className="p-4 border-t border-pearl/80 max-h-[150px] overflow-y-auto">
                    <p className="whitespace-pre-wrap text-xs text-navy/60 leading-relaxed">{generatedCaption}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="p-4 border-t border-pearl/80 flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={async () => {
                      if (!generatedImage) return;
                      try {
                        const response = await fetch(generatedImage);
                        const blob = await response.blob();
                        const blobUrl = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = blobUrl;
                        link.download = `lindasal_publicidad_${productName.replace(/\s+/g, "_")}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(blobUrl);
                      } catch (error) {
                        console.error("Error forzando descarga:", error);
                        window.open(generatedImage, '_blank');
                      }
                    }}
                    className="flex-1 bg-navy text-pearl py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-gold hover:text-navy transition-colors duration-500"
                  >
                    <Download className="w-4 h-4" strokeWidth={1.75} /> Descargar imagen
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (generatedCaption) {
                        navigator.clipboard.writeText(generatedCaption);
                        alert("✅ Caption copiado al portapapeles");
                      }
                    }}
                    className="px-5 py-2.5 bg-pearl text-navy/70 rounded-full font-bold text-sm hover:bg-pearl-dark hover:text-navy transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" strokeWidth={1.75} /> Copiar texto
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex flex-col justify-center items-center text-navy/35 p-8 text-center">
                {isGenerating ? (
                  <>
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold/20 to-teal/20 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <WandSparkles className="w-8 h-8 text-gold-dark animate-float" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-navy/60 mb-1">Componiendo tu anuncio…</p>
                    <p className="text-xs text-navy/40 max-w-[280px]">La IA está integrando tu producto, precio y marca en una composición premium.</p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-14 h-14 mb-4 text-navy/15 animate-float" strokeWidth={1} />
                    <p className="text-sm font-semibold text-navy/50 mb-1">Tu imagen publicitaria aparecerá aquí</p>
                    <p className="text-xs text-navy/35 max-w-[280px]">Completa el formulario a la izquierda, sube la foto del producto y presiona &quot;Generar&quot; para crear una imagen lista para publicar.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* HISTORY SECTION */}
      <Panel
        index={4}
        title="Historial"
        subtitle={`${postHistory.length} imágenes generadas`}
        icon={<History className="w-4 h-4" strokeWidth={1.75} />}
      >
        <div className="p-6">
          {isLoadingHistory ? (
            <div className="flex justify-center items-center py-12">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-teal/15" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-teal animate-spin" />
              </div>
            </div>
          ) : postHistory.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {postHistory.map(post => {
                // Formatting time relative or simple date
                const timeAgo = post.created_at ? new Date(post.created_at).toLocaleDateString() : "Reciente";

                return (
                <motion.div
                  key={post.id}
                  variants={rowVariant}
                  whileHover={{ y: -5 }}
                  className="flex flex-col bg-white rounded-2xl overflow-hidden border border-pearl-dark/70 shadow-soft hover:shadow-raised hover:border-gold/30 transition-[box-shadow,border-color] duration-500 group"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[3/4] w-full bg-pearl/40 overflow-hidden">
                    {post.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.image_url} alt="Generado" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-navy/20">
                        <ImageIcon className="w-10 h-10" strokeWidth={1} />
                      </div>
                    )}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex flex-col flex-1 gap-3">
                    <p className="text-navy/55 text-xs line-clamp-3 leading-relaxed">
                      &quot;{post.caption || "Sin texto generado"}&quot;
                    </p>

                    {/* Primary Actions */}
                    <div className="flex flex-col gap-2 mt-auto pt-2">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setGeneratedImage(post.image_url);
                          setGeneratedCaption(post.caption || "");
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full py-2 bg-navy hover:bg-gold hover:text-navy text-pearl rounded-lg text-xs font-semibold transition-colors duration-500 flex items-center justify-center gap-2"
                      >
                        <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.75} /> Cargar al editor
                      </motion.button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={async () => {
                            if (!post.image_url) return;
                            try {
                              // Fuerza la descarga convirtiendo la URL a un Blob local
                              const response = await fetch(post.image_url);
                              const blob = await response.blob();
                              const blobUrl = window.URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = blobUrl;
                              link.download = `lindasal_publicidad_${post.id}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(blobUrl);
                            } catch (error) {
                              console.error("Error forzando descarga:", error);
                              // Fallback por si acaso falla el fetch por CORS
                              window.open(post.image_url, '_blank');
                            }
                          }}
                          className="py-2 bg-teal/5 border border-teal/20 hover:bg-teal/15 hover:-translate-y-0.5 text-teal-dark rounded-lg text-[11px] font-semibold transition-all duration-300 flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-3 h-3" strokeWidth={1.75} /> Bajar
                        </button>
                        <button
                          onClick={() => {
                            if (post.caption) {
                              navigator.clipboard.writeText(post.caption);
                              alert("✅ Texto copiado al portapapeles");
                            }
                          }}
                          className="py-2 bg-gold/5 border border-gold/20 hover:bg-gold/15 hover:-translate-y-0.5 text-gold-dark rounded-lg text-[11px] font-semibold transition-all duration-300 flex items-center justify-center gap-1.5"
                        >
                          <Copy className="w-3 h-3" strokeWidth={1.75} /> Copiar
                        </button>
                        <button
                          onClick={() => window.open(post.image_url, '_blank')}
                          className="py-2 bg-pearl/50 border border-pearl-dark/60 hover:bg-pearl hover:-translate-y-0.5 text-navy/60 rounded-lg text-[11px] font-semibold transition-all duration-300 flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3 h-3" strokeWidth={1.75} /> Ver
                        </button>
                        <button
                          onClick={() => handleDeleteHistoryPost(post.id)}
                          className="py-2 bg-red-500/5 border border-red-500/20 hover:bg-red-500/15 hover:-translate-y-0.5 text-red-500 rounded-lg text-[11px] font-semibold transition-all duration-300 flex items-center justify-center gap-1.5"
                        >
                          <Trash2 className="w-3 h-3" strokeWidth={1.75} /> Borrar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 bg-pearl/40 border-t border-pearl-dark/50 flex items-center justify-between text-[10px] text-navy/45">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-navy flex items-center justify-center text-gold">
                        <User className="w-2.5 h-2.5" strokeWidth={2} />
                      </div>
                      <span className="font-semibold text-navy/60">Lindasal Admin</span>
                    </div>
                    <span>{timeAgo}</span>
                  </div>
                </motion.div>
              )})}
            </motion.div>
          ) : (
            <p className="text-center text-navy/45 py-12">Aún no hay imágenes generadas en el historial.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}
