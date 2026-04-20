"use client";

import React, { useState } from "react";

export default function AdminSocialPage() {
  const [postText, setPostText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setPostText("🌊 ¡Descubre la pureza de nuestros mares ecuatorianos! 🇪🇨\n\n¿Sabías que nuestra sal marina no pasa por procesos químicos? Extraída artesanalmente y secada al sol, conserva más de 80 minerales esenciales para tu cuerpo.\n\n✨ Beneficios hoy:\n- Equilibra tu pH interno.\n- Mejora tu hidratación celular.\n- Realza el sabor de tus comidas gourmet.\n\n¡Cámbiate a lo natural! Escríbenos y pide tu Sal Marina Gourmet Lindasal. 🛒👇\n\n#SalMarina #Ecuador #Saludable #Lindasal #Bienestar #Gourmet");
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Agente de Redes Sociales</h1>
          <p className="text-slate-500 mt-1">Genera y programa posteos optimizados con IA de manera aislada al sistema principal.</p>
        </div>
        <div className="bg-teal/10 text-teal-700 px-4 py-2 border border-teal-200 rounded-xl text-sm font-semibold flex items-center gap-2">
          <i className="fa-solid fa-robot"></i> Modelo: Zamtools-AI (Beta)
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Editor Side */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-wand-magic-sparkles text-gold"></i> Creador de Contenido
          </h3>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Tono del Mensaje</label>
              <select className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-navy">
                <option>Educativo / Informativo (Propiedades)</option>
                <option>Comercial / Llamado a la Acción</option>
                <option>Motivacional / Salud Preventiva</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Producto a destacar</label>
              <select className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-navy">
                <option>Sal Marina Gourmet</option>
                <option>Nalleva Jabón Íntimo</option>
                <option>Aguademar Hipertónica</option>
                <option>Aceite de Magnesio</option>
              </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="mt-4 bg-navy text-white font-medium py-3 rounded-xl hover:bg-navy-light transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isGenerating ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Generando magia...</>
              ) : (
                <><i className="fa-solid fa-bolt"></i> Generar Posteo (IA)</>
              )}
            </button>
          </div>
        </div>

        {/* Preview Side */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-mobile-screen text-slate-400"></i> Vista Previa (Instagram/Facebook)
          </h3>
          
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative min-h-[300px]">
            {postText ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 border border-slate-300">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">lindasalec</p>
                    <p className="text-xs text-slate-400">Patrocinado</p>
                  </div>
                </div>
                
                <div className="w-full h-48 bg-slate-100 rounded-lg mb-4 flex items-center justify-center border border-slate-200 border-dashed">
                  <i className="fa-regular fa-image text-4xl text-slate-300"></i>
                  {/* Image Generation AI future feature */}
                </div>

                <div className="whitespace-pre-wrap text-sm text-slate-700 font-body leading-relaxed">
                  {postText}
                </div>

                <div className="mt-auto pt-4 flex gap-3">
                  <button className="flex-1 bg-[#25D366] text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-sm">
                    <i className="fa-brands fa-whatsapp"></i> Publicar Ahora
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col justify-center items-center text-slate-400 p-6 text-center">
                <i className="fa-solid fa-pen-nib text-3xl mb-3"></i>
                <p className="text-sm">Configura los parámetros a la izquierda y presiona Generar para ver una vista previa de tu publicación optimizada.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
