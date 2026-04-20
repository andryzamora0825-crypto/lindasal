import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateFullPost } from "@/lib/services/ai-content.service";
import { createPost } from "@/lib/services/social-posts.service";

export const maxDuration = 300; // 5 min timeout for Vercel

export async function POST(request: Request) {
  try {
    const userId = "lindasal_master";

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const {
      topic,
      platform = "facebook",
      imageFormat = "square",
      brandVoice = "profesional e inspirador",
      scheduled_at = null,
      isProductAd = false,
      productData = null
    } = body;

    if (!topic?.trim()) {
      return NextResponse.json({ error: "Falta el tema/topic del post" }, { status: 400 });
    }

    // Fetch settings from DB
    const { data: dbSettings } = await supabase
      .from("social_settings")
      .select("agency_name, brand_voice, primary_color, secondary_color")
      .eq("user_id", userId)
      .single();

    // Default Lindasal Brand Settings for Nano Banana in case DB is empty
    const aiSettings = {
      agencyName: dbSettings?.agency_name || "Lindasal",
      agencyDesc: "Marca muy premium de sal marina orgánica, artesanal 100% natural recolectada en Ecuador.",
      primaryColor: dbSettings?.primary_color || "#c9a84c", // Gold
      secondaryColor: dbSettings?.secondary_color || "#0a1628", // Navy
    };

    // Use brand Voice from DB if form didn't provide one explicitly differently
    const finalBrandVoice = brandVoice === "profesional e inspirador" 
      ? (dbSettings?.brand_voice || brandVoice) 
      : brandVoice;

    let caption = "";
    let imageUrl = "";
    let imagePrompt = topic;
    let modelUsed = "";

    if (isProductAd && productData) {
      const { generateCaption, generateImage } = await import("@/lib/services/ai-content.service");

      // ── 1. GENERAR COPY DE VENTAS ──
      const copyTopic = `El usuario quiere crear un anuncio publicitario de producto.\nInstrucción principal: "${topic}"\n\nDATOS OBLIGATORIOS A INCLUIR:\n- Nombre del producto: ${productData.name}\n- Precio: $${productData.price}\n- Beneficios / Descripción: ${productData.description}\n- Forma de Uso: ${productData.usage}\n- Stock disponible: ${productData.stock || 'Disponible ahora'}\n\nREGLA: Debes vender este producto y mencionar el precio de forma atractiva.`;
      caption = await generateCaption({ topic: copyTopic, brandVoice: finalBrandVoice, platform });

      // ── 2. PREPARAR IMAGEN DEL PRODUCTO COMO BASE64 EN MEMORIA ──
      let productBase64 = "";
      let productMime = "image/png";
      const rawImg = productData.imageUrl as string;

      if (rawImg.startsWith("data:image/")) {
        // Ya viene como base64 del frontend (pegada o subida)
        productBase64 = rawImg.split(",")[1];
        productMime = rawImg.match(/data:(.*?);/)?.[1] || "image/png";
      } else {
        // Es una URL — descargarla directamente aquí para no depender del fetch interno
        try {
          const controller = new AbortController();
          const tid = setTimeout(() => controller.abort(), 10000);
          const dlRes = await fetch(rawImg, { signal: controller.signal });
          clearTimeout(tid);
          if (dlRes.ok) {
            const buf = await dlRes.arrayBuffer();
            productBase64 = Buffer.from(buf).toString("base64");
            productMime = dlRes.headers.get("content-type") || "image/png";
          }
        } catch (dlErr) {
          console.error("[SOCIAL] No se pudo descargar imagen de producto:", dlErr);
        }
      }

      // Subir la imagen original a Supabase para referencia
      let finalImageUrl = rawImg;
      if (productBase64) {
        try {
          const ext = productMime.includes("jpeg") || productMime.includes("jpg") ? "jpg" : "png";
          const fileName = `ad_${userId}_${Date.now()}.${ext}`;
          const imageBuffer = Buffer.from(productBase64, "base64");
          const { error: uploadError } = await supabase.storage
            .from("ai-generations")
            .upload(fileName, imageBuffer, { contentType: productMime, upsert: false });
          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage.from("ai-generations").getPublicUrl(fileName);
            finalImageUrl = publicUrlData.publicUrl;
          }
        } catch (uploadErr) {
          console.error("Error subiendo imagen de producto:", uploadErr);
        }
      }

      // ── 3. GENERAR IMAGEN PUBLICITARIA CON IA ──
      // Pasamos el base64 directamente en aiSettings para evitar re-descargas
      (aiSettings as any).productImageBase64 = productBase64;
      (aiSettings as any).productImageMime = productMime;

      const adImagePrompt = `Crea una FOTOGRAFÍA PUBLICITARIA PROFESIONAL DE ALTA GAMA para este producto. Instrucción del usuario: "${topic}". Nombre comercial: ${productData.name}. MANTÉN FIELMENTE EL LOGOTIPO, FORMA Y DISEÑO ORIGINAL del envase (referencia adjunta). El producto DEBE aparecer como protagonista absoluto de la imagen en una escena inmersiva de alta calidad.`;

      try {
        const imgRes = await generateImage(adImagePrompt, userId, "portrait", aiSettings);
        imageUrl = imgRes.imageUrl;
        imagePrompt = adImagePrompt;
        modelUsed = imgRes.model + " + Copywriter AI";
      } catch (e: any) {
        console.error("Falló la IA imagen de producto, usando imagen original:", e);
        // Fallback: usa la imagen original subida
        imageUrl = finalImageUrl;
        imagePrompt = adImagePrompt;
        modelUsed = "Imagen original + Copywriter AI";
      }
    } else {
      // 2. Generación Completa (Texto + Imagen)
      const fullPost = await generateFullPost(
        { topic, brandVoice: finalBrandVoice, platform, imageFormat },
        userId,
        aiSettings
      );
      caption = fullPost.caption;
      imageUrl = fullPost.imageUrl;
      imagePrompt = fullPost.imagePrompt;
      modelUsed = fullPost.model;
    }

    // Save to DB
    const post = await createPost({
      user_id: userId,
      caption,
      image_url: imageUrl,
      image_prompt: imagePrompt,
      status: "pending",
      scheduled_at,
      platform,
    });

    return NextResponse.json({
      success: true,
      post,
      model: modelUsed,
    });

  } catch (error: any) {
    console.error("[SOCIAL] Error generando contenido:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Error generando contenido con IA." },
      { status: 500 }
    );
  }
}
