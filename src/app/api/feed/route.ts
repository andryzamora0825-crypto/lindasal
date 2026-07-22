import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";

const dataFilePath = path.join(process.cwd(), "src", "data", "feed.json");

// Mapea una fila de feed_posts al formato FeedPost que consume la página pública
function mapRow(row: any) {
  return {
    id: row.id,
    title: row.title || "",
    author: { name: "Lindasal", avatar: "" },
    content: row.content,
    image: row.image_url || undefined,
    createdAt: row.created_at,
    likes: row.likes || 0,
    comments: [],
  };
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("feed_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, posts: (data || []).map(mapRow) });
  } catch {
    // Respaldo: archivo local (solo útil si la tabla feed_posts aún no existe)
    try {
      const fileContents = await fs.readFile(dataFilePath, "utf8");
      const posts = JSON.parse(fileContents);
      return NextResponse.json({ success: true, posts });
    } catch (error: any) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("feed_posts")
      .insert({
        title: body.title || "",
        content: body.content || "",
        image_url: body.image || body.image_url || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, post: mapRow(data) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
