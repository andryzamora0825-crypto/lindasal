-- ══════════════════════════════════════════════════════════════
-- LINDASAL — Migración completa de base de datos
-- Ejecutar una sola vez en: Supabase Dashboard > SQL Editor > New query
-- Proyecto destino: kmiyxifkbpdelabmfdep (cuenta nueva)
--
-- Este script es idempotente: se puede ejecutar varias veces sin error
-- (usa IF NOT EXISTS / ON CONFLICT DO NOTHING en todas partes).
--
-- Nota de arquitectura: esta app NO usa Supabase Auth. El panel /admin
-- está protegido por Clerk a nivel de Next.js, y todas las operaciones
-- (tienda, dashboard, admin) usan la misma clave "anon/publishable" desde
-- el navegador. Por eso aquí se deshabilita RLS explícitamente en vez de
-- escribir políticas por usuario — es el equivalente exacto a lo que el
-- propio código ya esperaba ("Asegúrate de haber ejecutado el código SQL
-- para desactivar RLS").
-- ══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────
-- 1. PRODUCTOS (catálogo de la tienda)
-- ──────────────────────────────────────────
create table if not exists public.productos (
  id bigint generated always as identity primary key,
  name text not null,
  description text default '',
  price numeric(10, 2) not null default 0,
  stock integer not null default 0,
  category text not null default 'comestible',
  brand text default 'LINDASAL',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  image_url text,
  discount_percentage numeric(5, 2) default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_productos_brand on public.productos (brand);
create index if not exists idx_productos_category on public.productos (category);
create index if not exists idx_productos_is_active on public.productos (is_active);

alter table public.productos disable row level security;

-- ──────────────────────────────────────────
-- 2. VENTAS (pedidos generados desde la tienda / WhatsApp)
-- ──────────────────────────────────────────
create table if not exists public.ventas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text default 'Anónimo',
  items jsonb not null default '[]'::jsonb,
  total_amount numeric(10, 2) not null default 0,
  status text not null default 'pendiente'
);

create index if not exists idx_ventas_created_at on public.ventas (created_at desc);
create index if not exists idx_ventas_status on public.ventas (status);

alter table public.ventas disable row level security;

-- ──────────────────────────────────────────
-- 3. CONFIGURACIÓN (logo de marca, logos por marca, key/value genérico)
-- ──────────────────────────────────────────
create table if not exists public.configuracion (
  key text primary key,
  value text
);

alter table public.configuracion disable row level security;

-- ──────────────────────────────────────────
-- 4. SOCIAL_POSTS (historial de imágenes/publicaciones generadas con IA)
-- ──────────────────────────────────────────
create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  caption text default '',
  image_url text,
  image_prompt text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'published', 'failed', 'rejected')),
  scheduled_at timestamptz,
  published_at timestamptz,
  platform text not null default 'facebook'
    check (platform in ('facebook', 'instagram', 'both')),
  meta_post_id text,
  retry_count integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_social_posts_user_id on public.social_posts (user_id);
create index if not exists idx_social_posts_status on public.social_posts (status);
create index if not exists idx_social_posts_created_at on public.social_posts (created_at desc);

alter table public.social_posts disable row level security;

-- ──────────────────────────────────────────
-- 5. SOCIAL_SETTINGS (config de marca + credenciales Meta por usuario)
-- ──────────────────────────────────────────
create table if not exists public.social_settings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,
  meta_page_id text,
  meta_page_access_token text,
  meta_ig_user_id text,
  agency_name text default 'Lindasal',
  brand_voice text default 'profesional e inspirador',
  primary_color text default '#c9a84c',
  secondary_color text default '#0a1628',
  default_platform text not null default 'facebook'
    check (default_platform in ('facebook', 'instagram', 'both')),
  auto_generate boolean not null default false,
  daily_post_count integer not null default 1,
  custom_prompt_template text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.social_settings disable row level security;

-- ──────────────────────────────────────────
-- 6. SOCIAL_LOGS (auditoría de acciones sobre posts — reservado)
-- ──────────────────────────────────────────
create table if not exists public.social_logs (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.social_posts (id) on delete set null,
  user_id text,
  action text not null,
  details jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_social_logs_post_id on public.social_logs (post_id);

alter table public.social_logs disable row level security;

-- ══════════════════════════════════════════════════════════════
-- STORAGE — Buckets públicos para imágenes
-- ══════════════════════════════════════════════════════════════

-- "logos": logo de marca general + logos por marca (Lindasal, Navella, Aguademar)
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- "ai-generations": fotos de productos y anuncios generados con IA
insert into storage.buckets (id, name, public)
values ('ai-generations', 'ai-generations', true)
on conflict (id) do nothing;

-- Políticas de storage: lectura pública + escritura con la clave anon/publishable
-- (coherente con el resto del esquema, que no usa Supabase Auth)
drop policy if exists "Public read logos" on storage.objects;
create policy "Public read logos"
  on storage.objects for select
  using (bucket_id = 'logos');

drop policy if exists "Public write logos" on storage.objects;
create policy "Public write logos"
  on storage.objects for all
  using (bucket_id = 'logos')
  with check (bucket_id = 'logos');

drop policy if exists "Public read ai-generations" on storage.objects;
create policy "Public read ai-generations"
  on storage.objects for select
  using (bucket_id = 'ai-generations');

drop policy if exists "Public write ai-generations" on storage.objects;
create policy "Public write ai-generations"
  on storage.objects for all
  using (bucket_id = 'ai-generations')
  with check (bucket_id = 'ai-generations');

-- ══════════════════════════════════════════════════════════════
-- FIN. Tras ejecutar esto, la app puede leer/escribir en las 6 tablas
-- y en los 2 buckets de almacenamiento usando la clave publishable/anon.
-- ══════════════════════════════════════════════════════════════
