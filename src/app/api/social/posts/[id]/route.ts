import { NextResponse } from "next/server";
import { getPost, updatePost, deletePost } from "@/lib/services/social-posts.service";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = "lindasal_master";
    const { id } = await context.params;
    const post = await getPost(id, userId);

    if (!post) {
      return NextResponse.json({ success: false, error: "Post no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = "lindasal_master";
    const { id } = await context.params;
    const body = await request.json();

    const updatedPost = await updatePost(id, userId, body);
    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const userId = "lindasal_master";
    const { id } = await context.params;
    
    await deletePost(id, userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
