"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  Calendar,
  Filter,
} from "lucide-react";
import type { FeedPost } from "@/data/mockPosts";
import TiltCard from "@/components/TiltCard";

/* Icono Instagram local: lucide-react eliminó los iconos de marcas */
function Instagram({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} mes${months > 1 ? "es" : ""}`;
  const years = Math.floor(months / 12);
  return `hace ${years} año${years > 1 ? "s" : ""}`;
}

function formatLongDate(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("es-EC", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

const FILTERS = [
  { id: "all", label: "Todo" },
  { id: "with-image", label: "Visual" },
  { id: "text-only", label: "Palabra" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const SPAN_PATTERN = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

const ASPECT_PATTERN = [
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[16/10]",
  "aspect-square",
  "aspect-[4/5]",
];

const INSTAGRAM_URL = "https://www.instagram.com/lindasalec";

function PostMosaicCard({
  post,
  index,
  spanClass,
  aspectClass,
}: {
  post: FeedPost;
  index: number;
  spanClass: string;
  aspectClass: string;
}) {
  const hasImage = Boolean(post.image);
  const truncated =
    post.content.length > 140 ? post.content.slice(0, 137) + "…" : post.content;
  const likeCount = post.likes ?? 0;
  const commentCount = post.comments?.length ?? 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative ${spanClass}`}
    >
      <TiltCard maxTilt={4} scale={1.008} className="h-full rounded-[1.75rem]">
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Ver publicación de ${formatLongDate(post.createdAt)} en Instagram`}
        className="relative block h-full w-full overflow-hidden rounded-[1.75rem] border border-pearl-dark/60 bg-white shadow-[0_4px_24px_-8px_rgba(10,22,40,0.08)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(10,22,40,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        {hasImage ? (
          <div className={`relative w-full overflow-hidden ${aspectClass}`}>
            <img
              src={post.image}
              alt={post.content.slice(0, 80)}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-br from-gold/0 via-transparent to-teal/0 opacity-0 transition-opacity duration-700 group-hover:from-gold/20 group-hover:to-teal/15 group-hover:opacity-100"
            />

            <div className="absolute left-5 top-5 z-10 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-2.5 py-1 font-body text-[0.62rem] font-bold uppercase tracking-[0.18em] text-pearl backdrop-blur-md">
                <Calendar aria-hidden="true" className="h-2.5 w-2.5" />
                {formatLongDate(post.createdAt)}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
              <p className="font-body text-[0.85rem] leading-relaxed text-pearl/95 line-clamp-3 sm:text-[0.92rem]">
                {truncated}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-pearl/70">
                  {likeCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold">
                      <Heart aria-hidden="true" className="h-3.5 w-3.5" />
                      {likeCount}
                    </span>
                  )}
                  {commentCount > 0 && (
                    <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold">
                      <MessageCircle aria-hidden="true" className="h-3.5 w-3.5" />
                      {commentCount}
                    </span>
                  )}
                </div>

                <span className="inline-flex translate-y-1 items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 font-body text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold-light opacity-0 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                  Ver en Instagram
                  <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`relative flex w-full items-end overflow-hidden bg-gradient-to-br from-navy via-navy-mid to-navy-light p-7 ${aspectClass}`}
          >
            <div
              aria-hidden="true"
              className="bg-dots absolute inset-0 opacity-30 mix-blend-overlay"
            />
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal/15 blur-3xl"
            />

            <div className="relative z-10 w-full">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 font-body text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold">
                <Sparkles aria-hidden="true" className="h-2.5 w-2.5" />
                Reflexión
              </span>
              <p className="font-heading text-[1.4rem] leading-[1.25] text-pearl sm:text-[1.6rem]">
                &ldquo;{truncated}&rdquo;
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-pearl/10 pt-4">
                <span className="font-body text-[0.7rem] uppercase tracking-[0.18em] text-pearl/55">
                  {formatLongDate(post.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1.5 font-body text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  Ver en Instagram
                  <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        )}
      </a>
      </TiltCard>
    </motion.article>
  );
}

function FeaturedPost({ post }: { post: FeedPost }) {
  const hasImage = Boolean(post.image);

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-[2rem] border border-pearl-dark/60 bg-white shadow-[0_24px_60px_-20px_rgba(10,22,40,0.18)]"
    >
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Publicación destacada — ver en Instagram"
        className="relative grid grid-cols-1 lg:grid-cols-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <div className="relative lg:col-span-3 aspect-[4/3] lg:aspect-auto lg:min-h-[460px] overflow-hidden bg-navy">
          {hasImage ? (
            <>
              <img
                src={post.image}
                alt={post.content.slice(0, 80)}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-tr from-navy/40 via-transparent to-transparent"
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-mid to-navy-light">
              <div
                aria-hidden="true"
                className="bg-dots absolute inset-0 opacity-25"
              />
            </div>
          )}

          <span className="absolute left-6 top-6 z-10 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1.5 font-body text-[0.62rem] font-bold uppercase tracking-[0.22em] text-gold-light backdrop-blur-md">
            <Sparkles aria-hidden="true" className="h-3 w-3" />
            Destacado
          </span>
        </div>

        <div className="relative flex flex-col justify-between gap-8 p-8 lg:col-span-2 lg:p-12">
          <div>
            <span className="eyebrow mb-5 text-gold">Última publicación</span>
            <p className="font-heading text-[1.6rem] leading-[1.2] text-navy sm:text-[1.9rem] lg:text-[2.1rem]">
              {post.content.length > 220
                ? post.content.slice(0, 217) + "…"
                : post.content}
            </p>
          </div>

          <div className="flex items-end justify-between gap-6 border-t border-pearl-dark/60 pt-6">
            <div>
              <p className="font-body text-[0.65rem] uppercase tracking-[0.22em] text-navy/40">
                Publicado
              </p>
              <p className="mt-1 font-heading text-lg text-navy">
                {formatLongDate(post.createdAt)}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-navy px-5 py-2.5 font-body text-[0.7rem] font-bold uppercase tracking-[0.18em] text-pearl transition-all duration-500 group-hover:bg-gold group-hover:text-navy">
              Ver en Instagram
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </a>
    </motion.article>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="surface-glass texture-grain relative mx-auto max-w-xl overflow-hidden rounded-[2rem] px-8 py-16 text-center"
    >
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10">
        <ImageIcon aria-hidden="true" className="h-7 w-7 text-gold-dark" />
      </div>
      <p className="eyebrow mx-auto mb-4 justify-center">Sin publicaciones</p>
      <h2 className="font-heading text-3xl text-navy">
        Aún no hay nada por aquí
      </h2>
      <p className="mt-3 font-body text-navy/60">
        Pronto compartiremos novedades, recetas y reflexiones desde el manantial.
        Síguenos en Instagram para no perderte el siguiente capítulo.
      </p>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 font-body text-sm font-bold text-pearl transition-all hover:-translate-y-0.5 hover:bg-navy-light"
      >
        <Instagram aria-hidden="true" className="h-4 w-4" />
        Ir a Instagram
      </a>
    </motion.div>
  );
}

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterId>("all");

  useEffect(() => {
    let active = true;
    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.success) setPosts(data.posts);
      })
      .catch(() => {
        if (active) setPosts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    if (filter === "with-image") return posts.filter((p) => p.image);
    if (filter === "text-only") return posts.filter((p) => !p.image);
    return posts;
  }, [posts, filter]);

  const featured = filteredPosts[0];
  const rest = filteredPosts.slice(1);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bone">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[520px] bg-gradient-to-b from-pearl via-bone to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-32 -z-0 h-[420px] w-[420px] rounded-full bg-teal/10 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-72 -z-0 h-[460px] w-[460px] rounded-full bg-gold/10 blur-3xl animate-float-slow"
      />

      <header className="sticky top-0 z-40 border-b border-pearl-dark/60 bg-bone/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <Link
            href="/"
            aria-label="Volver al inicio"
            className="group inline-flex items-center gap-2 font-body text-sm font-semibold text-navy/70 transition-colors hover:text-navy"
          >
            <ArrowLeft
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
            />
            <span className="hidden sm:inline">Inicio</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-gold"
            />
            <span className="font-body text-[0.65rem] uppercase tracking-[0.22em] text-navy/55">
              Lindasal Diario
            </span>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Seguir a Lindasal en Instagram"
            className="group inline-flex items-center gap-2 rounded-full border border-navy/10 bg-white/70 px-3.5 py-1.5 font-body text-xs font-semibold text-navy/80 backdrop-blur transition-all hover:border-gold/30 hover:bg-white hover:text-navy"
          >
            <Instagram aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Seguir</span>
          </a>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pt-16 pb-10 lg:px-10 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <span className="eyebrow text-gold">Feed editorial</span>
          <h1 className="mt-5 font-heading text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] text-navy">
            Bitácora desde el{" "}
            <span className="italic gradient-text-warm">manantial.</span>
          </h1>
          <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-navy/65 sm:text-lg">
            Reflexiones, momentos y descubrimientos de Lindasal. Una colección
            curada de nuestras publicaciones, vista como una revista visual y no
            como un muro infinito.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <span className="hidden items-center gap-1.5 pr-2 font-body text-[0.65rem] uppercase tracking-[0.22em] text-navy/40 sm:inline-flex">
              <Filter aria-hidden="true" className="h-3 w-3" />
              Filtrar
            </span>
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={active}
                  className={`relative shrink-0 rounded-full border px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
                    active
                      ? "border-gold bg-gold text-navy shadow-[0_8px_20px_-8px_rgba(201,168,76,0.55)]"
                      : "border-navy/10 bg-white/70 text-navy/65 hover:border-navy/20 hover:bg-white hover:text-navy"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 font-body text-xs text-navy/45">
            <span
              aria-hidden="true"
              className="h-px w-10 bg-gradient-to-r from-transparent via-navy/30 to-transparent"
            />
            <span className="tabular-nums">
              {filteredPosts.length} publicación
              {filteredPosts.length === 1 ? "" : "es"}
            </span>
          </div>
        </motion.div>
      </section>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-24 lg:px-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32">
            <Loader2
              aria-hidden="true"
              className="h-8 w-8 animate-spin text-gold"
            />
            <p className="font-body text-sm uppercase tracking-[0.22em] text-navy/40">
              Hilando la bitácora…
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-12">
            {featured && <FeaturedPost post={featured} />}

            {rest.length > 0 && (
              <div>
                <div className="mb-8 flex items-baseline justify-between">
                  <h2 className="font-heading text-3xl text-navy lg:text-4xl">
                    Mosaico
                  </h2>
                  <span
                    aria-hidden="true"
                    className="hidden h-px flex-1 origin-left scale-x-100 bg-gradient-to-r from-pearl-dark via-gold/30 to-transparent sm:mx-6 sm:block"
                  />
                  <span className="font-body text-[0.65rem] uppercase tracking-[0.22em] text-navy/40">
                    Visual diary
                  </span>
                </div>

                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={filter}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-5 sm:grid-cols-2 md:auto-rows-[260px] md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
                  >
                    {rest.map((post, i) => (
                      <PostMosaicCard
                        key={post.id}
                        post={post}
                        index={i}
                        spanClass={SPAN_PATTERN[i % SPAN_PATTERN.length]}
                        aspectClass={ASPECT_PATTERN[i % ASPECT_PATTERN.length]}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {!loading && filteredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-24 flex flex-col items-center gap-4 text-center"
          >
            <div className="divider-mark mx-auto" aria-hidden="true" />
            <p className="font-heading text-2xl italic text-navy/70">
              fin de la bitácora
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.22em] text-navy/55 link-underline hover:text-navy"
            >
              Continuar en Instagram
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        )}
      </main>
    </div>
  );
}
