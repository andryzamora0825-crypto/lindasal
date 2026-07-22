"use client";

// Carga los logos de marca subidos desde Admin > Publicidad IA > Ajustes de logos
// (tabla `configuracion`, claves logo_LINDASAL / logo_NAVELLA / logo_AGUADEMAR QUINTON).
// Usa una promesa cacheada a nivel de módulo: por muchas tarjetas que monten el hook,
// solo se hace UNA petición por sesión.

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type BrandLogos = Record<string, string>;

const LOGO_KEYS = ["logo_LINDASAL", "logo_NAVELLA", "logo_AGUADEMAR QUINTON"];

// Alias de escritura usados en distintas partes del sitio → clave canónica
const BRAND_ALIASES: Record<string, string> = {
  LINDASAL: "LINDASAL",
  Lindasal: "LINDASAL",
  NAVELLA: "NAVELLA",
  Navella: "NAVELLA",
  Nalleva: "NAVELLA",
  "AGUADEMAR QUINTON": "AGUADEMAR QUINTON",
  "Aguademar Quinton": "AGUADEMAR QUINTON",
  Aguademar: "AGUADEMAR QUINTON",
};

let cachePromise: Promise<BrandLogos> | null = null;

async function fetchLogos(): Promise<BrandLogos> {
  try {
    const { data } = await supabase
      .from("configuracion")
      .select("key, value")
      .in("key", LOGO_KEYS);

    const map: BrandLogos = {};
    (data || []).forEach((row: { key: string; value: string | null }) => {
      if (row.value) map[row.key.replace("logo_", "")] = row.value;
    });
    return map;
  } catch {
    return {};
  }
}

export function useBrandLogos(): BrandLogos {
  const [logos, setLogos] = useState<BrandLogos>({});

  useEffect(() => {
    if (!cachePromise) cachePromise = fetchLogos();
    let active = true;
    cachePromise.then((m) => {
      if (active) setLogos(m);
    });
    return () => {
      active = false;
    };
  }, []);

  return logos;
}

export function getBrandLogo(logos: BrandLogos, brand?: string | null): string | null {
  if (!brand) return null;
  const key = BRAND_ALIASES[brand] || brand;
  return logos[key] || null;
}
