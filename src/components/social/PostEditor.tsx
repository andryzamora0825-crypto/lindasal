"use client";

import { useState } from "react";
import type { SocialPost, Platform } from "@/lib/types/social.types";
import { Save, X, Globe, Camera, Loader2 } from "lucide-react";

interface PostEditorProps {
  post: SocialPost;
  onSave: (id: string, data: any) => Promise<void>;
  onClose: () => void;
}

export default function PostEditor({ post, onSave, onClose }: PostEditorProps) {
  const [caption, setCaption] = useState(post.caption);
  const [scheduledAt, setScheduledAt] = useState(
    post.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0, 16) : ""
  );
  const [platform, setPlatform] = useState<Platform>(post.platform);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(post.id, {
        caption,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        platform,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error guardando los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div 
        className="bg-white border border-gold/20 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-navy tracking-tight">Editar Post</h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-navy rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Caption */}
          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
              Texto de la publicación
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-gray-50 text-navy border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-1 focus:ring-gold/50 resize-none h-40 text-sm leading-relaxed placeholder-gray-400"
              placeholder="Escribe el texto de tu publicación aquí..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Platform */}
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
                Plataforma
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPlatform("facebook")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all text-xs font-bold ${
                    platform === "facebook"
                      ? "bg-blue-50 border-blue-400 text-blue-600"
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Globe className="w-4 h-4" /> Facebook
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform("instagram")}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all text-xs font-bold ${
                    platform === "instagram"
                      ? "bg-pink-50 border-pink-400 text-pink-600"
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Camera className="w-4 h-4" /> Instagram
                </button>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">
                Fecha de publicación
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-gray-50 text-navy border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-gold/50 text-sm [color-scheme:light]"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Dejar vacío para publicar ahora mismo al cambiar el estado a "Aprobado"
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-3 rounded-xl font-black text-sm bg-gold text-navy hover:bg-gold-light transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
