"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, MessageSquare, ThumbsUp, ImageIcon, Newspaper, Loader2 } from "lucide-react";
import type { FeedPost } from "@/data/mockPosts";

export default function AdminFeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // New post state
  const [newContent, setNewContent] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.posts);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() && !newImage.trim()) return;

    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent, image: newImage })
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setNewContent("");
        setNewImage("");
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta publicación?")) {
      try {
        const res = await fetch(`/api/feed/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          setPosts(posts.filter((p) => p.id !== id));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">
            Gestión del Feed
          </h1>
          <p className="text-gray-400 mt-2">
            Administra las publicaciones que ven tus clientes en el Feed tipo Facebook.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-navy font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          {showForm ? "Cancelar" : <><Plus className="w-5 h-5" /> Nueva Publicación</>}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreatePost} className="bg-navy-light/40 border border-gold/20 rounded-2xl p-6 shadow-xl animate-fade-in-up">
          <h2 className="text-xl font-bold text-white mb-4">Crear nueva publicación</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Contenido (Texto)</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-navy/50 border border-white/10 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-gold/50"
                placeholder="Escribe lo que quieres compartir con tus clientes..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">URL de Imagen (Opcional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-navy/50 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-8 py-2.5 bg-teal text-navy font-semibold rounded-xl hover:bg-teal-light transition-colors shadow-lg"
              >
                Publicar en el Feed
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-navy-light/30 border border-white/5 rounded-2xl overflow-hidden shadow-lg flex flex-col transition-all hover:border-gold/30 hover:bg-navy-light/40">
            {/* Header info */}
            <div className="p-5 border-b border-white/5 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-teal flex items-center justify-center text-white font-bold shadow-md">
                  L
                </div>
                <div>
                  <p className="font-semibold text-white">{post.author.name}</p>
                  <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString('es-ES')}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(post.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                title="Eliminar publicación"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Content preview */}
            <div className="p-5 flex-1">
              <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed mb-4">
                {post.content}
              </p>
              
              {post.image && (
                <div className="w-full rounded-xl overflow-hidden border border-white/5 bg-black/40 flex items-center justify-center">
                  <img src={post.image} alt="Preview" className="w-full h-auto max-h-[400px] object-contain opacity-90 hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>

            {/* Metrics footer */}
            <div className="bg-black/20 px-5 py-3 border-t border-white/5 flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <ThumbsUp className="w-4 h-4 text-gold" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MessageSquare className="w-4 h-4 text-teal" />
                <span>{post.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-gold" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-navy-light/20 rounded-2xl border border-white/5">
          <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No hay publicaciones</h3>
          <p className="text-gray-400">Crea tu primera publicación para el Feed de Lindasal.</p>
        </div>
      ) : null}
    </div>
  );
}
