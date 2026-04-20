import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateImage } from "@/lib/services/ai-content.service";

export const maxDuration = 300;

export async function POST(request: Request, context: any) {
  try {
    const { id } = context.params;
    const userId = "lindasal_master";

    const { data: post, error: fetchError } = await supabase
      .from("social_posts")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError || !post) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    }

    const { data: dbSettings } = await supabase
      .from("social_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    const aiSettings = {
      agencyName: dbSettings?.agency_name || "Lindasal",
      agencyDesc: "Marca muy premium de sal marina orgánica",
      primaryColor: dbSettings?.primary_color || "#c9a84c",
      secondaryColor: dbSettings?.secondary_color || "#0a1628",
    };

    const imgRes = await generateImage(post.image_prompt || "Fotografía profesional de alta calidad", userId, "square", aiSettings);

    const { data: updatedPost, error: updateError } = await supabase
      .from("social_posts")
      .update({ image_url: imgRes.imageUrl })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error("Error regenerando imagen:", error);
    return NextResponse.json(
      { error: error?.message || "Error al regenerar la imagen" },
      { status: 500 }
    );
  }
}
