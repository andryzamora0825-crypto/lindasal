"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminConfigPage() {
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Cargar logo actual
  useEffect(() => {
    async function loadConfig() {
      try {
        const { data } = await supabase
          .from("configuracion")
          .select("value")
          .eq("key", "logo_url")
          .single();
        
        if (data?.value) {
          setLogoUrl(data.value);
        }
      } catch {
        // La tabla puede no existir aún, se creará al guardar
      }
    }
    loadConfig();
  }, []);

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor sube solo imágenes (PNG, JPG, WEBP)");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `logo_marca.${fileExt}`;

      // Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("productos")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from("productos")
        .getPublicUrl(fileName);

      const url = publicUrlData.publicUrl;
      setLogoUrl(url);

      // Guardar en tabla de configuración
      const { error: upsertError } = await supabase
        .from("configuracion")
        .upsert({ key: "logo_url", value: url }, { onConflict: "key" });

      if (upsertError) throw upsertError;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Error al subir logo:", err);
      alert("Error al subir el logo: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!window.confirm("¿Eliminar el logo de marca?")) return;
    try {
      await supabase.from("configuracion").delete().eq("key", "logo_url");
      setLogoUrl("");
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Configuración</h1>
        <p className="text-slate-500 mt-1">Personaliza la identidad de tu marca.</p>
      </header>

      {/* Logo de Marca */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h2 className="font-bold text-lg text-slate-800">Logo de Marca</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sube una imagen PNG sin fondo. Se usará en los recibos PDF y en la identidad del panel.</p>
        </div>

        <div className="p-8 flex flex-col items-center gap-6">
          {/* Preview */}
          <div className="w-[200px] h-[200px] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative group">
            {logoUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={logoUrl} 
                  alt="Logo de marca" 
                  className="w-full h-full object-contain p-4"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={handleRemoveLogo}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
                  >
                    <i className="fa-solid fa-trash mr-2"></i>Eliminar
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-400">
                <i className="fa-solid fa-image text-4xl mb-2 block"></i>
                <p className="text-xs font-medium">Sin logo</p>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <label className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all shadow-sm ${
            uploading 
              ? "bg-slate-200 text-slate-500 cursor-wait" 
              : "bg-navy text-white hover:bg-navy/80"
          }`}>
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Subiendo...
              </>
            ) : (
              <>
                <i className="fa-solid fa-cloud-arrow-up"></i>
                {logoUrl ? "Cambiar Logo" : "Subir Logo PNG"}
              </>
            )}
            <input 
              type="file" 
              accept="image/png,image/webp,image/jpeg" 
              onChange={handleUploadLogo}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-bold animate-fade-in">
              <i className="fa-solid fa-check-circle"></i> Logo guardado correctamente
            </div>
          )}

          <p className="text-xs text-slate-400 text-center max-w-sm">
            Recomendación: PNG transparente de al menos 400×400px. Este logo aparecerá en los <strong>recibos PDF</strong> que generes desde la sección de Ventas.
          </p>
        </div>
      </div>
    </div>
  );
}
