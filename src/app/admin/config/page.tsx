"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  CloudUpload,
  Trash2,
  CheckCircle2,
  Palette,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PageHeader, Panel } from "@/components/admin/AdminUI";

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
        .from("logos")
        .upload(fileName, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from("logos")
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
    <div className="flex flex-col gap-7">
      <PageHeader
        eyebrow="Sistema"
        title="Configuración de"
        accent="marca."
        subtitle="Personaliza la identidad visual de tu negocio."
      />

      {/* Logo de Marca */}
      <Panel
        index={1}
        title="Logo de marca"
        subtitle="Sube una imagen PNG sin fondo. Se usará en los recibos PDF y en la identidad del panel."
        icon={<Palette className="w-4 h-4" strokeWidth={1.75} />}
        className="max-w-3xl"
      >
        <div className="p-8 flex flex-col items-center gap-6">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative w-[220px] h-[220px] rounded-3xl border-2 border-dashed border-pearl-dark bg-gradient-to-br from-pearl/60 to-white flex items-center justify-center overflow-hidden group hover:border-gold/50 transition-colors duration-500"
          >
            <div
              aria-hidden="true"
              className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gold/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
            {logoUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt="Logo de marca"
                  className="w-full h-full object-contain p-5 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy-deep/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRemoveLogo}
                    className="bg-red-500 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-red-600 transition-colors inline-flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.75} /> Eliminar
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="text-center text-navy/30">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 animate-float" strokeWidth={1.25} />
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">Sin logo</p>
              </div>
            )}
          </motion.div>

          {/* Upload Button */}
          <motion.label
            whileHover={uploading ? {} : { y: -2 }}
            whileTap={uploading ? {} : { scale: 0.97 }}
            className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm cursor-pointer transition-colors duration-500 ${
              uploading
                ? "bg-pearl text-navy/40 cursor-wait"
                : "bg-navy text-pearl hover:bg-gold hover:text-navy shadow-raised"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4" strokeWidth={1.75} />
                {logoUrl ? "Cambiar logo" : "Subir logo PNG"}
              </>
            )}
            <input
              type="file"
              accept="image/png,image/webp,image/jpeg"
              onChange={handleUploadLogo}
              className="hidden"
              disabled={uploading}
            />
          </motion.label>

          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-emerald-600 text-sm font-bold bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full"
              >
                <CheckCircle2 className="w-4 h-4" /> Logo guardado correctamente
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-navy/40 text-center max-w-sm leading-relaxed">
            Recomendación: PNG transparente de al menos 400×400px. Este logo aparecerá en los{" "}
            <strong className="text-navy/60">recibos PDF</strong> que generes desde la sección de Ventas.
          </p>
        </div>
      </Panel>
    </div>
  );
}
