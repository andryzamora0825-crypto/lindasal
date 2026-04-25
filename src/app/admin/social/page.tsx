"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

const BRANDS = [
  { id: "LINDASAL", label: "Lindasal", color: "bg-[#c9a84c] text-white", hex: "#c9a84c" },
  { id: "NAVELLA", label: "Navella", color: "bg-purple-600 text-white", hex: "#7c3aed" },
  { id: "AGUADEMAR QUINTON", label: "Aguademar", color: "bg-teal text-white", hex: "#14b8a6" },
];

interface BrandLogos {
  LINDASAL: string;
  NAVELLA: string;
  "AGUADEMAR QUINTON": string;
}

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
          },
        }),
      });

      const result = await response.json();
      
      if (!response.ok || result.error) {
        throw new Error(result.error || "Error generando la imagen.");
      }

      if (result.post?.image_url) {
        setGeneratedImage(result.post.image_url);
      }
      if (result.post?.caption) {
        setGeneratedCaption(result.post.caption);
      }
    } catch (err: any) {
      console.error("Error:", err);
      setErrorMsg(err.message || "Error generando la imagen publicitaria.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Publicidad de Productos</h1>
          <p className="text-slate-500 mt-1">Genera imágenes publicitarias profesionales con IA para tus redes sociales.</p>
        </div>
        <div className="bg-teal/10 text-teal-700 px-4 py-2 border border-teal-200 rounded-xl text-sm font-semibold flex items-center gap-2">
          <i className="fa-solid fa-robot"></i> Gemini AI
        </div>
      </header>

      {/* BRAND LOGOS CONFIG */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <i className="fa-solid fa-palette text-gold"></i> Logos de Marca
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Sube los logos PNG sin fondo de cada marca para usarlos en la generación de imágenes.</p>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {BRANDS.map(brand => (
            <div key={brand.id} className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                {brandLogos[brand.id as keyof BrandLogos] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={brandLogos[brand.id as keyof BrandLogos]} 
                    alt={brand.label} 
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <i className="fa-solid fa-image text-2xl text-slate-300"></i>
                )}
              </div>
              <span className={`text-[0.65rem] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${brand.color}`}>
                {brand.label}
              </span>
              <label className="text-xs font-bold text-slate-500 cursor-pointer hover:text-navy transition-colors flex items-center gap-1">
                <i className="fa-solid fa-cloud-arrow-up"></i>
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
            </div>
          ))}
        </div>
      </div>

      {/* MAIN GENERATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <i className="fa-solid fa-wand-magic-sparkles text-gold"></i> Datos del Producto
          </h3>

          {/* Product Image Upload */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Foto del Producto</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:border-navy/30 hover:bg-slate-100 transition-all overflow-hidden relative group"
            >
              {productImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={productImage} alt="Producto" className="w-full h-full object-contain p-4" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold text-sm"><i className="fa-solid fa-camera mr-2"></i>Cambiar Foto</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-400">
                  <i className="fa-solid fa-cloud-arrow-up text-3xl mb-2 block"></i>
                  <p className="text-sm font-medium">Haz clic para subir la foto del producto</p>
                  <p className="text-xs text-slate-300 mt-1">PNG o JPG recomendado</p>
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
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Nombre del Producto</label>
            <input 
              type="text" 
              value={productName} 
              onChange={e => setProductName(e.target.value)}
              placeholder="Ej: Sal Gourmet Lindasal 500g"
              className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-navy"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Descripción / Beneficios</label>
            <textarea
              value={productDesc}
              onChange={e => setProductDesc(e.target.value)}
              placeholder="Ej: Sal marina 100% natural, artesanal, con más de 80 minerales..."
              rows={3}
              className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-navy resize-none"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Marca</label>
            <div className="flex gap-2">
              {BRANDS.map(brand => (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    selectedBrand === brand.id 
                      ? `${brand.color} border-transparent shadow-md` 
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {brand.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Precio ($)</label>
            <input 
              type="number" 
              step="0.01"
              value={productPrice} 
              onChange={e => setProductPrice(e.target.value)}
              placeholder="Ej: 4.00"
              className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-navy"
            />
          </div>

          {/* Discount Toggle */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div>
              <p className="font-bold text-sm text-slate-700">¿Tiene descuento?</p>
              <p className="text-xs text-slate-400">Activar para mostrar oferta en la imagen</p>
            </div>
            <button
              type="button"
              onClick={() => setHasDiscount(!hasDiscount)}
              className={`w-12 h-7 rounded-full transition-colors relative ${hasDiscount ? "bg-green-500" : "bg-slate-300"}`}
            >
              <span className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow transition-transform ${hasDiscount ? "left-[26px]" : "left-[3px]"}`}></span>
            </button>
          </div>

          {/* Discount Percentage */}
          {hasDiscount && (
            <div className="animate-fade-in">
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Porcentaje de Descuento (%)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={discountPercent} 
                  onChange={e => setDiscountPercent(e.target.value)}
                  placeholder="Ej: 20"
                  className="w-24 border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-navy text-center font-bold"
                />
                <span className="text-slate-400 text-sm">%</span>
                {productPrice && discountPercent && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400 line-through">${parseFloat(productPrice).toFixed(2)}</span>
                    <span className="font-bold text-green-600">${(parseFloat(productPrice) * (1 - parseFloat(discountPercent) / 100)).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="mt-2 bg-navy text-white font-bold py-4 rounded-xl hover:bg-navy/80 transition-all flex items-center justify-center gap-3 text-base disabled:opacity-60 disabled:cursor-wait shadow-lg"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generando imagen publicitaria...
              </>
            ) : (
              <>
                <i className="fa-solid fa-bolt"></i>
                Generar Imagen Publicitaria
              </>
            )}
          </button>

          {isGenerating && (
            <p className="text-xs text-slate-400 text-center">
              <i className="fa-solid fa-circle-info mr-1"></i> 
              Esto puede tardar entre 15-45 segundos. La IA está componiendo tu imagen.
            </p>
          )}
        </div>

        {/* RIGHT: Preview */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-eye text-slate-400"></i> Vista Previa del Resultado
          </h3>

          <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm relative min-h-[400px] flex flex-col">
            {generatedImage ? (
              <div className="flex flex-col h-full">
                {/* Instagram-like header */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-teal flex items-center justify-center text-white text-xs font-bold">LS</div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">lindasalec</p>
                    <p className="text-[0.65rem] text-slate-400">Patrocinado</p>
                  </div>
                </div>

                {/* Generated Image */}
                <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={generatedImage} 
                    alt="Imagen publicitaria generada" 
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Caption Preview */}
                {generatedCaption && (
                  <div className="p-4 border-t border-slate-100 max-h-[150px] overflow-y-auto">
                    <p className="whitespace-pre-wrap text-xs text-slate-600 leading-relaxed">{generatedCaption}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="p-4 border-t border-slate-100 flex gap-3">
                  <a 
                    href={generatedImage} 
                    download={`ad_${productName.replace(/\s+/g, "_")}.png`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-navy text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-navy/80 transition-colors"
                  >
                    <i className="fa-solid fa-download"></i> Descargar Imagen
                  </a>
                  <button
                    onClick={() => {
                      if (generatedCaption) {
                        navigator.clipboard.writeText(generatedCaption);
                        alert("✅ Caption copiado al portapapeles");
                      }
                    }}
                    className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
                  >
                    <i className="fa-solid fa-copy"></i> Copiar Texto
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col justify-center items-center text-slate-400 p-8 text-center">
                <i className="fa-solid fa-image text-5xl mb-4 text-slate-200"></i>
                <p className="text-sm font-medium text-slate-500 mb-1">Tu imagen publicitaria aparecerá aquí</p>
                <p className="text-xs text-slate-400 max-w-[280px]">Completa el formulario a la izquierda, sube la foto del producto y presiona &quot;Generar&quot; para crear una imagen lista para publicar.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
