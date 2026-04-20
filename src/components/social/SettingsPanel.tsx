// ══════════════════════════════════════════════
// SettingsPanel (Light Theme) — Social Media Accounts configuration
// ══════════════════════════════════════════════
"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle, ShieldAlert, Loader2 } from "lucide-react";

export default function SettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    agency_name: "",
    brand_voice: "",
    primary_color: "#c9a84c",
    secondary_color: "#0a1628",
    meta_page_id: "",
    meta_page_access_token: "",
    meta_ig_user_id: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/social/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings({
          agency_name: data.settings.agency_name || "",
          brand_voice: data.settings.brand_voice || "",
          primary_color: data.settings.primary_color || "#c9a84c",
          secondary_color: data.settings.secondary_color || "#0a1628",
          meta_page_id: data.settings.meta_page_id || "",
          meta_page_access_token: data.settings.meta_page_access_token || "",
          meta_ig_user_id: data.settings.meta_ig_user_id || "",
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/social/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  const isUnlocked = !!(settings.meta_page_id && settings.meta_page_access_token);

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-navy">
            Panel de Configuración
          </h2>
          <p className="text-gray-500 mt-1">
            Conecta Lindasal con Meta para publicar automáticamente.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Status Banner */}
        <div className={`p-4 flex items-center gap-3 border-b border-gray-100 ${isUnlocked ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
          {isUnlocked ? (
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          )}
          <div>
            <h3 className="font-semibold text-sm">
              {isUnlocked ? "MÓDULO DESBLOQUEADO ✓" : "MÓDULO BLOQUEADO"}
            </h3>
            <p className="text-xs opacity-80 mt-0.5">
              {isUnlocked 
                ? "Las credenciales están configuradas. El auto-publicador está activo." 
                : "Faltan credenciales. Las publicaciones se quedarán solo en esta web."}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* BRAND SETTINGS */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Identidad de Marca (Nano Banana)</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">Nombre de la Marca / Agencia <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ej: Lindasal"
                value={settings.agency_name}
                onChange={(e) => setSettings({ ...settings, agency_name: e.target.value })}
                className="w-full bg-gray-50 text-navy border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">Tono de Voz y Descripción (Prompt) <span className="text-red-500">*</span></label>
              <textarea
                placeholder="Ej: Marca muy premium de sal marina orgánica..."
                value={settings.brand_voice}
                onChange={(e) => setSettings({ ...settings, brand_voice: e.target.value })}
                className="w-full bg-gray-50 text-navy border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-colors h-24 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase">Color Primario (Hex)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="h-10 w-12 rounded cursor-pointer border border-gray-200"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="flex-1 bg-gray-50 text-navy border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 uppercase">Color Secundario (Hex)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="h-10 w-12 rounded cursor-pointer border border-gray-200"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color}
                    onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                    className="flex-1 bg-gray-50 text-navy border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* META SETTINGS */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Conexión con Meta (Facebook & Instagram)</h3>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">Page ID <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="Ej: 1122334455667788"
                value={settings.meta_page_id}
                onChange={(e) => setSettings({ ...settings, meta_page_id: e.target.value })}
                className="w-full bg-gray-50 text-navy border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">Page Access Token (Permanente) <span className="text-red-500">*</span></label>
              <input
                type="password"
                placeholder="EAAI..."
                value={settings.meta_page_access_token}
                onChange={(e) => setSettings({ ...settings, meta_page_access_token: e.target.value })}
                className="w-full bg-gray-50 text-navy border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-colors font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase">Instagram User ID (Opcional)</label>
              <input
                type="text"
                placeholder="Ej: 178414000000000"
                value={settings.meta_ig_user_id}
                onChange={(e) => setSettings({ ...settings, meta_ig_user_id: e.target.value })}
                className="w-full bg-gray-50 text-navy border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
                title="Requerido solo si deseas publicar en Instagram también."
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end items-center">
            {success && (
              <span className="text-emerald-600 text-sm font-medium mr-4 flex items-center gap-1 animate-in fade-in slide-in-from-right-4">
                <CheckCircle className="w-4 h-4" /> Guardado
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-navy hover:bg-gold text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
              ) : (
                <><Save className="w-4 h-4" /> Guardar Ajustes</>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
