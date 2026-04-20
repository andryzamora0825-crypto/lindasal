"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { FeedPost } from "@/data/mockPosts";
import { Loader2 } from "lucide-react";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

function PostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <article className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(10,22,40,0.08)] overflow-hidden transition-all hover:shadow-[0_4px_24px_rgba(10,22,40,0.12)]">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold to-teal flex items-center justify-center text-white font-heading font-bold text-lg shadow-md">
          L
        </div>
        <div className="flex-1">
          <p className="font-body font-semibold text-navy text-[0.95rem] leading-tight">
            {post.author.name}
            <i className="fa-solid fa-circle-check text-teal text-xs ml-1.5" aria-label="Verificado"/>
          </p>
          <p className="text-navy/50 text-xs font-body">{timeAgo(post.createdAt)}</p>
        </div>
        <button className="text-navy/30 hover:text-navy/60 transition-colors p-1">
          <i className="fa-solid fa-ellipsis text-lg"/>
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-navy/85 text-[0.92rem] font-body leading-relaxed whitespace-pre-line">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative w-full bg-pearl/20 border-y border-pearl/60 overflow-hidden flex items-center justify-center">
          <img
            src={post.image}
            alt="Publicación de Lindasal"
            className="w-full h-auto max-h-[85vh] object-contain"
            loading="lazy"
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-pearl-dark/40">
        <div className="flex items-center gap-1.5 text-sm text-navy/50">
          <span className="w-5 h-5 rounded-full bg-gradient-to-r from-gold to-teal flex items-center justify-center">
            <i className="fa-solid fa-thumbs-up text-[0.55rem] text-white"/>
          </span>
          <span>{likeCount}</span>
        </div>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-sm text-navy/50 hover:text-navy/70 transition-colors"
        >
          {post.comments.length} comentario{post.comments.length !== 1 && "s"}
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center border-b border-pearl-dark/40">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-body font-semibold text-sm transition-all ${
            liked ? "text-gold" : "text-navy/50 hover:text-navy/70 hover:bg-pearl/50"
          }`}
        >
          <i className={`${liked ? "fa-solid" : "fa-regular"} fa-thumbs-up`}/>
          Me gusta
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 font-body font-semibold text-sm text-navy/50 hover:text-navy/70 hover:bg-pearl/50 transition-all"
        >
          <i className="fa-regular fa-comment"/>
          Comentar
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 font-body font-semibold text-sm text-navy/50 hover:text-navy/70 hover:bg-pearl/50 transition-all">
          <i className="fa-solid fa-share"/>
          Compartir
        </button>
      </div>

      {/* Comments */}
      {showComments && post.comments.length > 0 && (
        <div className="p-4 space-y-3 bg-pearl/30">
          {post.comments.map((comment, i) => (
            <div key={i} className="flex gap-2.5">
              <div className="w-8 h-8 rounded-full bg-navy-light/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-navy/60">{comment.user[0]}</span>
              </div>
              <div className="bg-white rounded-xl px-3.5 py-2 flex-1">
                <p className="font-body font-semibold text-xs text-navy">{comment.user}</p>
                <p className="font-body text-[0.82rem] text-navy/80 leading-snug">{comment.text}</p>
                <p className="text-[0.65rem] text-navy/35 mt-1">{timeAgo(comment.date)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feed")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPosts(data.posts);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-pearl">
      {/* Header */}
      <header className="bg-navy text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <i className="fa-solid fa-arrow-left text-sm"/>
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">
              Lindasal
            </span>
          </Link>
          <h1 className="font-heading text-lg font-semibold text-gold-light">Feed</h1>
          <div className="w-8"/>
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Notice */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-gold/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-bullhorn text-gold text-sm"/>
          </div>
          <p className="text-sm text-navy/70 font-body">
            <span className="font-semibold text-navy">¡Bienvenido al Feed de Lindasal!</span> Aquí encontrarás nuestras últimas novedades, promociones y contenido exclusivo.
          </p>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-navy/50" />
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-navy/40 text-sm font-body">— Has visto todas las publicaciones —</p>
        </div>
      </main>
    </div>
  );
}
