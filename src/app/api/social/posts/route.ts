import { NextResponse } from "next/server";
import { createPost, listPosts, getStatusCounts } from "@/lib/services/social-posts.service";
import type { PostStatus } from "@/lib/types/social.types";

export async function GET(request: Request) {
  try {
    const userId = "lindasal_master";
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as PostStatus | undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const { posts, total } = await listPosts(userId, { status, page, limit });
    const counts = await getStatusCounts(userId);

    return NextResponse.json({ success: true, posts, total, counts });
  } catch (error: any) {
    console.error("[SOCIAL] Error listando posts:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = "lindasal_master";
    const body = await request.json();

    const post = await createPost({
      user_id: userId,
      ...body,
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error("[SOCIAL] Error creando post:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
