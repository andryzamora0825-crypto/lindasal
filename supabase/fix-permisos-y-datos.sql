-- ══════════════════════════════════════════════════════════════
-- LINDASAL — Arreglo de permisos (RLS) + datos iniciales
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
--
-- POR QUÉ: las escrituras desde la app fallan con el error
--   "new row violates row-level security policy for table productos"
-- Eso significa que RLS quedó ACTIVADO en las tablas (pasa por defecto
-- si se crean desde el Table Editor). Este script lo desactiva en todas
-- las tablas de la app y, de paso, inserta el catálogo inicial de
-- productos (los "productos antiguos" que se veían en el panel eran
-- datos de ejemplo del código, no filas reales de la base de datos).
--
-- Es idempotente: correrlo varias veces no duplica productos.
-- ══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────
-- 1. DESACTIVAR RLS EN TODAS LAS TABLAS DE LA APP
-- ──────────────────────────────────────────
alter table if exists public.productos       disable row level security;
alter table if exists public.ventas          disable row level security;
alter table if exists public.configuracion   disable row level security;
alter table if exists public.social_posts    disable row level security;
alter table if exists public.social_settings disable row level security;
alter table if exists public.social_logs     disable row level security;

-- ──────────────────────────────────────────
-- 2. CATÁLOGO INICIAL (solo inserta los que no existan por nombre)
-- ──────────────────────────────────────────
insert into public.productos
  (name, description, price, stock, category, brand, is_featured, is_active, image_url, discount_percentage)
select v.*
from (
  values
  -- ─── LINDASAL ───
  ('Lindasal Sal Gourmet 500g',
   'Sal gourmet de salmuera natural, rica en minerales esenciales que nutren y equilibran tu organismo. Combínala con agua + limón para un boost natural. 40% menos sodio que la sal común.',
   5.00, 80, 'comestible', 'LINDASAL', true, true, null::text, 20.00),
  ('Lindasal Sal Gourmet 1kg',
   'Presentación familiar de nuestra sal gourmet de salmuera natural. Ideal para el hogar, aporta minerales esenciales en cada uso. La sal que no solo realza el sabor, sino que nutre.',
   10.00, 60, 'comestible', 'LINDASAL', false, true, null, 0),
  ('Lindasal Sal Ahumada 227g',
   'Sal marina natural con proceso de ahumado artesanal. Ideal para cortes de carne, parrillas y marinados. Aporta un toque ahumado premium a tus preparaciones.',
   4.00, 45, 'comestible', 'LINDASAL', false, true, null, 0),
  ('Lindasal Sal con Especias 100g',
   'Mezcla exclusiva de sal gourmet con especias seleccionadas. Perfecta para darle un giro gourmet a tus comidas sin esfuerzo.',
   3.00, 55, 'comestible', 'LINDASAL', false, true, null, 0),
  ('Hipertensal 250g',
   'Fórmula especial con bajo contenido de sodio, enriquecida con minerales esenciales. Ideal para personas con hipertensión que no quieren renunciar al sabor.',
   5.00, 35, 'terapeutica', 'LINDASAL', true, true, null, 0),
  ('Sal Termal con Pétalos de Rosa 227g',
   'Sal termal natural con pétalos de rosa secos. Perfecta para baños relajantes y rituales de cuidado personal. Ayuda a regenerar la piel y liberar el estrés.',
   4.00, 30, 'belleza', 'LINDASAL', false, true, null, 0),
  ('Sal Termal con Pétalos de Rosa 1lt',
   'Presentación grande de nuestra sal termal con pétalos de rosa. Ideal para uso frecuente en spa y rituales de bienestar prolongados.',
   10.00, 20, 'belleza', 'LINDASAL', false, true, null, 0),
  -- ─── AGUADEMAR QUINTON ───
  ('Aceite de Magnesio (ATM) 200ml',
   'Cloruro de Magnesio 100% orgánico para absorción transdérmica. Cumple con más de 350 funciones en el organismo: purifica la sangre, equilibra el pH, estimula las funciones cerebrales y promueve la salud renal. Aplicar directamente en la piel.',
   10.00, 40, 'terapeutica', 'AGUADEMAR QUINTON', true, true, null, 0),
  ('Agua Hipertónica Quinton 1lt',
   'Agua de mar hipertónica naturalmente rica en minerales y electrolitos. Complemento dietético ideal para deportistas y quienes buscan una hidratación profunda con trazas minerales del océano.',
   10.00, 35, 'terapeutica', 'AGUADEMAR QUINTON', true, true, null, 0),
  ('Agua Isotónica Quinton',
   'Agua de mar isotónica en proporción perfecta con agua dulce. Rehidrata y remineraliza a nivel celular. Ideal para el consumo diario como suplemento mineral natural.',
   8.00, 25, 'terapeutica', 'AGUADEMAR QUINTON', false, true, null, 0),
  -- ─── NAVELLA ───
  ('Jabón Íntimo Navella 250ml',
   'Jabón íntimo formulado con ingredientes naturales para mantener el balance del pH. Suave y eficaz, protege la flora natural y brinda sensación de frescura todo el día.',
   9.00, 30, 'belleza', 'NAVELLA', true, true, null, 0),
  ('Jabón de Bebé Navella',
   'Fórmula ultra suave para la piel delicada de los bebés. Sin químicos agresivos, con ingredientes naturales que limpian y cuidan suavemente.',
   7.00, 20, 'belleza', 'NAVELLA', false, true, null, 0),
  ('Derma Tonificador Navella',
   'Tonificador facial mineralizante que previene el envejecimiento prematuro. Con minerales marinos que restauran la luminosidad natural de la piel.',
   12.00, 15, 'belleza', 'NAVELLA', false, true, null, 0),
  ('Gotas Oculares Navella',
   'Solución ocular natural con propiedades calmantes y restauradoras. Alivia la irritación y sequedad. Para uso diario como soporte al bienestar visual.',
   8.00, 18, 'terapeutica', 'NAVELLA', false, true, null, 0)
) as v(name, description, price, stock, category, brand, is_featured, is_active, image_url, discount_percentage)
where not exists (
  select 1 from public.productos p where lower(p.name) = lower(v.name)
);

-- ──────────────────────────────────────────
-- 3. VERIFICACIÓN (los resultados aparecen abajo al ejecutar)
-- ──────────────────────────────────────────
select
  c.relname  as tabla,
  c.relrowsecurity as rls_activado -- debe decir "false" en todas
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('productos','ventas','configuracion','social_posts','social_settings','social_logs');

select count(*) as total_productos from public.productos;
