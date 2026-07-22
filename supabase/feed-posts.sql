-- ══════════════════════════════════════════════════════════════
-- LINDASAL — Tabla de publicaciones del Feed
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
--
-- POR QUÉ: el feed guardaba en un archivo del servidor (feed.json),
-- que en el hosting es de solo lectura — por eso no se podía subir
-- ni eliminar publicaciones desde el panel. Esta tabla lo reemplaza.
--
-- Idempotente: se puede correr varias veces sin duplicar nada.
-- ══════════════════════════════════════════════════════════════

create table if not exists public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  title text default '',
  content text not null default '',
  image_url text,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_feed_posts_created_at on public.feed_posts (created_at desc);

alter table public.feed_posts disable row level security;

-- Migrar las publicaciones que ya estaban visibles en el feed
insert into public.feed_posts (title, content, image_url, likes, created_at)
select v.*
from (
  values
  ('',
   'Descubre la esencia de la elegancia con nuestras exclusivas sales. ✨ Cada grano es un viaje de sabor que transforma tus platillos en experiencias gourmet. 🌿✨ ¿Listo para darle un toque premium a tu cocina? ¡Explora nuestra colección y sorpréndete! 🍽️💖',
   'https://ecfgazftlrmacpwgxmiq.supabase.co/storage/v1/object/public/ai-generations/social_lindasal_master_1776061696094.jpg',
   0, '2026-04-13T07:18:50.687Z'::timestamptz),
  ('',
   'Descubre el sabor auténtico de nuestra sal marina 🌊✨. Cada grano es una joya del océano, perfecta para realzar tus platillos favoritos. ¿Listo para elevar tu cocina a un nuevo nivel? 🍽️ Dale un toque gourmet a tus recetas y sorprende a tus seres queridos. ¡Prueba la diferencia! 🧂💖',
   'https://ecfgazftlrmacpwgxmiq.supabase.co/storage/v1/object/public/ai-generations/social_lindasal_master_1776062065822.jpg',
   0, '2026-04-13T07:18:47.574Z'::timestamptz)
) as v(title, content, image_url, likes, created_at)
where not exists (
  select 1 from public.feed_posts f where f.content = v.content
);

-- Verificación
select count(*) as total_publicaciones from public.feed_posts;
