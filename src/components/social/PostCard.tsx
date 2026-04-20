"use client";

import { useState } from "react";
import type { SocialPost } from "@/lib/types/social.types";
import StatusBadge from "./StatusBadge";
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `hace ${Math.floor(interval)} años`;
  interval = seconds / 2592000;
  if (interval > 1) return `hace ${Math.floor(interval)} meses`;
  interval = seconds / 86400;
  if (interval > 1) return `hace ${Math.floor(interval)} días`;
  interval = seconds / 3600;
  if (interval > 1) return `hace ${Math.floor(interval)} horas`;
  interval = seconds / 60;
  if (interval > 1) return `hace ${Math.floor(interval)} min`;
  return "hace un momento";
}
import {
  CheckCircle,
  Edit3,
  Trash2,
  Send,
  Eye,
  X,
  Globe,
  Camera,
  Calendar,
  RotateCcw,
  Loader2,
  Image as ImageIcon,
  AlertTriangle,
  Sparkles,
  Newspaper,
} from "lucide-react";

interface PostCardProps {
  post: SocialPost;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onEdit: (post: SocialPost) => void;
  onSave: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onPublishNow: (id: string) => Promise<void>;
  onRetry: (id: string) => Promise<void>;
  onRegenerateImage?: (post: SocialPost) => Promise<void>;
}

export default function PostCard({
  post,
  onApprove,
  onReject,
  onEdit,
  onSave,
  onDelete,
  onPublishNow,
  onRetry,
  onRegenerateImage
}: PostCardProps) {
  const [lightbox, setLightbox] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleAction = async (action: string, fn: () => Promise<void>) => {
    setLoading(action);
    try {
      await fn();
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateCaption = async () => {
    if (!post.image_url) return;
    setLoading("generate_caption");
    try {
      const res = await fetch("/api/social/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: post.image_url, platform: post.platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generando caption");
      
      await onSave(post.id, { caption: data.caption });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al analizar imagen.");
    } finally {
      setLoading(null);
    }
  };

  const handleShareToFeed = async () => {
    setLoading("shareFeed");
    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: post.caption, image: post.image_url })
      });
      if (!res.ok) throw new Error("Error publicando en el feed");
      alert("¡Publicado en el Feed Local exitosamente!");
    } catch (err: any) {
      alert(err.message || "Hubo un error compartiendo al feed.");
    } finally {
      setLoading(null);
    }
  };

  const PlatformIcon = post.platform === "instagram" ? Camera : Globe;
  const platformLabel =
    post.platform === "both" ? "FB + IG" : post.platform === "instagram" ? "Instagram" : "Facebook";

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 group relative flex flex-col hover:border-gold/30 transition-all duration-300 shadow-md hover:shadow-lg h-full">
        {/* Image Preview */}
        <div className="relative w-full bg-gray-100 flex items-center justify-center overflow-hidden border-b border-gray-100 min-h-[200px] max-h-[480px]">
          {post.image_url ? (
            <>
              <img
                src={post.image_url}
                alt="Post"
                className="w-full h-auto max-h-[480px] object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <button
                onClick={() => setLightbox(true)}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <Eye className="w-8 h-8 text-white drop-shadow-lg" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500 py-12">
              <ImageIcon className="w-12 h-12" />
              <span className="text-xs font-bold">Sin imagen</span>
            </div>
          )}

          {/* Status badge overlay */}
          <div className="absolute top-3 left-3">
            <StatusBadge status={post.status} />
          </div>

          {/* Platform badge */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5 border border-white/10">
            <PlatformIcon className="w-3 h-3 text-gold" />
            <span className="text-[9px] font-black text-gray-200 uppercase tracking-wider">
              {platformLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between border-t border-gray-100">
          {/* Caption */}
          <p className="text-sm text-navy line-clamp-3 leading-relaxed mb-3">
            {post.caption}
          </p>

          {/* Schedule info */}
          {post.scheduled_at && (
            <div className="flex items-center gap-1.5 mb-3 text-[10px] font-bold text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>
                Programado:{" "}
                {new Date(post.scheduled_at).toLocaleString("es-EC", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}

          {/* Error message */}
          {post.last_error && (
            <div className={`bg-red-500/10 border border-red-500/20 rounded-lg p-2 mb-3 ${post.status === "failed" ? "opacity-100" : "opacity-80"}`}>
              <p className="text-[10px] text-red-400 font-bold line-clamp-2">
                <AlertTriangle className="w-3 h-3 shrink-0 inline mr-1" />
                {post.last_error}
              </p>
              {post.retry_count > 0 && post.status !== "published" && (
                <p className="text-[9px] text-red-500/60 mt-1">
                  Intentos de publicación: {post.retry_count}/3
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-gray-100">
            {/* Approve (only for pending) */}
            {post.status === "pending" && (
              <button
                onClick={() => handleAction("approve", () => onApprove(post.id))}
                disabled={loading !== null}
                className="flex-1 min-w-[70px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-2 py-2 rounded-lg flex justify-center items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border border-emerald-500/20 disabled:opacity-40"
              >
                {loading === "approve" ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                Aprobar
              </button>
            )}

            {/* Reject (only for pending) */}
            {post.status === "pending" && (
              <button
                onClick={() => handleAction("reject", () => onReject(post.id))}
                disabled={loading !== null}
                className="bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 px-2 py-2 rounded-lg flex justify-center items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border border-gray-500/20 disabled:opacity-40"
              >
                {loading === "reject" ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
              </button>
            )}

            {/* Edit (pending or approved) */}
            {(post.status === "pending" || post.status === "approved") && (
              <button
                onClick={() => onEdit(post)}
                className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-navy px-2 py-2 rounded-lg flex justify-center items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all"
                title="Editar Texto y Datos"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            )}

            {/* AI Image Regenerate (Pending/Approved) */}
            {(post.status === "pending" || post.status === "approved") && onRegenerateImage && (
              <button
                onClick={() => handleAction("regenerate_img", () => onRegenerateImage(post))}
                disabled={loading !== null}
                className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 px-2 py-2 rounded-lg flex justify-center items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border border-purple-500/20 disabled:opacity-40"
                title="Regenerar Imagen con IA"
              >
                {loading === "regenerate_img" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              </button>
            )}

            {/* AI Caption (only for approved) */}
            {post.status === "approved" && (
              <button
                onClick={handleGenerateCaption}
                disabled={loading !== null || !post.image_url}
                className="flex-1 bg-teal/10 hover:bg-teal/20 text-teal px-2 py-2 rounded-lg flex justify-center items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border border-teal/20 disabled:opacity-40"
                title="Generar formato de texto con IA"
              >
                {loading === "generate_caption" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Caption
              </button>
            )}

            {/* Publish Now (only for approved) */}
            {post.status === "approved" && (
              <button
                onClick={() => handleAction("publish", () => onPublishNow(post.id))}
                disabled={loading !== null}
                className="flex-1 bg-gold/10 hover:bg-gold/20 text-gold px-2 py-2 rounded-lg flex justify-center items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border border-gold/20 disabled:opacity-40"
              >
                {loading === "publish" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Publicar
              </button>
            )}

            {/* Share to Feed (for approved or published) */}
            {(post.status === "approved" || post.status === "published") && (
              <button
                onClick={handleShareToFeed}
                disabled={loading !== null}
                className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 px-2 py-2 rounded-lg flex justify-center items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border border-blue-500/20 disabled:opacity-40"
                title="Compartir en el Feed Interno"
              >
                {loading === "shareFeed" ? <Loader2 className="w-3 h-3 animate-spin text-blue-500" /> : <Newspaper className="w-3 h-3" />}
              </button>
            )}

            {/* Retry (only for failed) */}
            {post.status === "failed" && (
              <button
                onClick={() => handleAction("retry", () => onRetry(post.id))}
                disabled={loading !== null}
                className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-2 py-2 rounded-lg flex justify-center items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border border-amber-500/20 disabled:opacity-40"
              >
                {loading === "retry" ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                Reintentar
              </button>
            )}

            {/* Delete (not for published) */}
            {post.status !== "published" && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2 py-2 rounded-lg flex justify-center items-center transition-all border border-red-500/20"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}

            {/* Ver Link (only for published) */}
            {post.status === "published" && post.meta_post_id && (
              <a
                href={post.meta_post_id.startsWith("http") ? post.meta_post_id : `https://facebook.com/${post.meta_post_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-teal/10 hover:bg-teal/20 text-teal-light px-2 py-2 rounded-lg flex justify-center items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border border-teal/20"
              >
                <Eye className="w-3 h-3" />
                Ver Link
              </a>
            )}
          </div>

          {/* Timestamp */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
              {timeAgo(post.created_at)}
            </span>
            {post.published_at && (
              <span className="text-[9px] text-gold/80 font-bold">
                Pub: {new Date(post.published_at).toLocaleDateString("es-EC")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox && post.image_url && (
        <div
          className="fixed inset-0 bg-navy/95 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors z-50"
            onClick={() => setLightbox(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={post.image_url}
            alt="Vista completa"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-navy/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div
            className="bg-navy border border-white/10 rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-black text-white">¿Eliminar este post?</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Esta acción es permanente. El post y su imagen serán eliminados del servidor.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={loading !== null}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-sm border border-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  handleAction("delete", async () => {
                    await onDelete(post.id);
                    setConfirmDelete(false);
                  })
                }
                disabled={loading !== null}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading === "delete" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {loading === "delete" ? "Borrando..." : "Sí, Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
