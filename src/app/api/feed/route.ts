import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "feed.json");

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    const posts = JSON.parse(fileContents);
    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    const posts = JSON.parse(fileContents);
    
    const newPost = {
      id: Date.now().toString(),
      author: { name: "Lindasal", avatar: "" },
      content: body.content,
      image: body.image || undefined,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    
    posts.unshift(newPost);
    await fs.writeFile(dataFilePath, JSON.stringify(posts, null, 2));
    
    return NextResponse.json({ success: true, post: newPost });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
