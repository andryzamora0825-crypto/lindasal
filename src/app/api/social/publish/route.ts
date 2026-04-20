// ══════════════════════════════════════════════
// POST /api/social/publish — Publish approved posts
// Triggered by: Cron job (every 30 min) or manual admin trigger
// ══════════════════════════════════════════════

import { NextResponse } from "next/server";
import { getPublishablePosts } from "@/lib/services/social-posts.service";
import { publishPost } from "@/lib/services/meta-publisher.service";
import { supabase } from "@/lib/supabase";

const MAX_RETRIES = 3;

export async function POST(request: Request) {
  try {
    const userId = "lindasal_master";

    // Get all publishable posts FOR THIS isolated user ONLY
    const posts = await getPublishablePosts(userId);

    if (posts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No hay posts pendientes de publicación.",
        published: 0,
      });
    }

    const results = [];

    for (const post of posts) {
      try {
        const result = await publishPost(post);

        if (result.success) {
          // Mark as published
          await supabase
            .from("social_posts")
            .update({
              status: "published",
              published_at: new Date().toISOString(),
              meta_post_id: result.postUrl || result.metaPostId || null,
            })
            .eq("id", post.id);

          results.push({ id: post.id, status: "published", metaPostId: result.metaPostId });
        } else {
          // Handle failure
          const newRetryCount = (post.retry_count || 0) + 1;
          const shouldFail = newRetryCount >= MAX_RETRIES;

          await supabase
            .from("social_posts")
            .update({
              status: shouldFail ? "failed" : "approved", // Keep approved for retry
              retry_count: newRetryCount,
              last_error: result.error || "Error desconocido",
            })
            .eq("id", post.id);

          results.push({
            id: post.id,
            status: shouldFail ? "failed" : "retrying",
            error: result.error,
            retryCount: newRetryCount,
          });
        }
      } catch (err: any) {
        results.push({ id: post.id, status: "error", error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });

  } catch (error: any) {
    console.error("[SOCIAL] Error en publish cron:", error);
    return NextResponse.json(
      { error: "Error procesando publicaciones." },
      { status: 500 }
    );
  }
}
