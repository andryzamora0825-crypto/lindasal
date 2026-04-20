import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "feed.json");

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    const posts = JSON.parse(fileContents);
    
    const initialLength = posts.length;
    const filteredPosts = posts.filter((post: any) => post.id !== id);
    
    if (posts.length === filteredPosts.length) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }
    
    await fs.writeFile(dataFilePath, JSON.stringify(filteredPosts, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
