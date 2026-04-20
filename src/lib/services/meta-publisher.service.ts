// ══════════════════════════════════════════════
// Meta Publisher Service — Facebook & Instagram Publishing
// Uses .env.local variables for Lindasal's single-tenant admin
// ══════════════════════════════════════════════

import { supabase } from "@/lib/supabase";
import type { SocialPost, PublishResult } from "@/lib/types/social.types";

const MAX_RETRIES = 3;
const META_GRAPH_URL = "https://graph.facebook.com/v25.0";

/**
 * Check if we're in mock mode (no real Meta credentials configured)
 */
function isMockMode(): boolean {
  return !process.env.META_PAGE_ACCESS_TOKEN;
}

/**
 * Mock publish — simulates a successful publish for development
 */
async function mockPublish(post: SocialPost): Promise<PublishResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const mockPostId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  console.log(`[SOCIAL][MOCK] Published post ${post.id} → ${mockPostId}`);
  
  return {
    success: true,
    metaPostId: mockPostId,
  };
}

/**
 * Publish to Facebook Page via Graph API
 */
async function publishToFacebook(
  pageId: string,
  accessToken: string,
  caption: string,
  imageUrl?: string | null
): Promise<PublishResult> {
  try {
    let endpoint: string;
    let body: Record<string, string>;

    if (imageUrl) {
      // Photo post
      endpoint = `${META_GRAPH_URL}/${pageId}/photos`;
      body = {
        url: imageUrl,
        caption,
        access_token: accessToken,
      };
    } else {
      // Text-only post
      endpoint = `${META_GRAPH_URL}/${pageId}/feed`;
      body = {
        message: caption,
        access_token: accessToken,
      };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || `Facebook API error: ${response.status}`,
      };
    }

    const metaPostId = data.id || data.post_id;
    return {
      success: true,
      metaPostId,
      postUrl: `https://facebook.com/${metaPostId}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Error de red al publicar en Facebook",
    };
  }
}

/**
 * Publish to Instagram via Graph API (2-step process)
 */
async function publishToInstagram(
  igUserId: string,
  accessToken: string,
  caption: string,
  imageUrl: string
): Promise<PublishResult> {
  try {
    // Step 1: Create media container
    const containerRes = await fetch(`${META_GRAPH_URL}/${igUserId}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: accessToken,
      }),
    });

    const containerData = await containerRes.json();
    if (!containerRes.ok) {
      return {
        success: false,
        error: containerData.error?.message || "Error creando container de Instagram",
      };
    }

    const containerId = containerData.id;

    // Step 2: Publish the container
    const publishRes = await fetch(`${META_GRAPH_URL}/${igUserId}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: accessToken,
      }),
    });

    const publishData = await publishRes.json();
    if (!publishRes.ok) {
      return {
        success: false,
        error: publishData.error?.message || "Error publicando en Instagram",
      };
    }

    // Step 3: Fetch the dynamic permalink from Meta
    let postUrl: string | undefined;
    try {
      const permalinkRes = await fetch(`${META_GRAPH_URL}/${publishData.id}?fields=permalink&access_token=${accessToken}`);
      if (permalinkRes.ok) {
        const permalinkData = await permalinkRes.json();
        postUrl = permalinkData.permalink;
      }
    } catch (e) {
      console.warn("[SOCIAL] No se pudo obtener el permalink de Instagram", e);
    }

    return {
      success: true,
      metaPostId: publishData.id,
      postUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Error de red al publicar en Instagram",
    };
  }
}

/**
 * Main publish function — handles mock mode, retries, and platform routing
 */
export async function publishPost(post: SocialPost): Promise<PublishResult> {

  // Fetch settings from DB instead of .env
  const { data: settings } = await supabase
    .from("social_settings")
    .select("meta_page_id, meta_page_access_token, meta_ig_user_id")
    .eq("user_id", post.user_id)
    .single();

  const PAGE_ID = settings?.meta_page_id;
  const ACCESS_TOKEN = settings?.meta_page_access_token;
  const IG_USER_ID = settings?.meta_ig_user_id;

  if (!PAGE_ID || !ACCESS_TOKEN) {
    if (isMockMode()) {
       return mockPublish(post);
    }
    return {
      success: false,
      error: "Falta configurar Página de Facebook y el Token en la pestaña de Ajustes.",
    };
  }

  let result: PublishResult = { success: false, error: "Plataforma no soportada" };
  
  let fbSuccess = post.platform === "instagram"; // Only require FB if asking for FB or both
  let igSuccess = post.platform === "facebook"; // Only require IG if asking for IG or both
  let metaPostId = "";

  // Retry logic with exponential backoff
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if ((post.platform === "facebook" || post.platform === "both") && !fbSuccess) {
        const fbResult = await publishToFacebook(
          PAGE_ID,
          ACCESS_TOKEN,
          post.caption,
          post.image_url
        );
        if (fbResult.success) {
          fbSuccess = true;
          metaPostId = fbResult.metaPostId!;
          result = fbResult;
        } else {
          result = fbResult;
        }
      }

      if ((post.platform === "instagram" || post.platform === "both") && !igSuccess) {
        if (!post.image_url) {
          result = { success: false, error: "Instagram requiere una imagen" };
        } else if (IG_USER_ID) {
          const igResult = await publishToInstagram(
            IG_USER_ID,
            ACCESS_TOKEN,
            post.caption,
            post.image_url
          );
          if (igResult.success) {
            igSuccess = true;
            if (!metaPostId) metaPostId = igResult.metaPostId!;
            result = igResult;
          } else {
            result = igResult;
          }
        } else {
          result = { success: false, error: "Falta META_IG_USER_ID en .env.local" };
        }
      }

      // If both required platforms are successful, break out of retry loop
      if (fbSuccess && igSuccess) {
        result.success = true;
        result.metaPostId = metaPostId; // Return at least one valid meta ID
        break;
      }

      if (attempt < MAX_RETRIES) {
        await delay(attempt * 2000);
      }
    } catch (err: any) {
      result = { success: false, error: err.message };
      if (attempt < MAX_RETRIES) {
        await delay(attempt * 2000);
      }
    }
  }

  return result;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
