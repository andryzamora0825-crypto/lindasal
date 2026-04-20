import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const userId = "lindasal_master";

    const { data, error } = await supabase
      .from("social_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return NextResponse.json({ success: true, settings: data || null });
  } catch (error: any) {
    console.error("[SETTINGS] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = "lindasal_master";
    const body = await request.json();

    const {
      meta_page_id,
      meta_page_access_token,
      meta_ig_user_id,
      agency_name,
      brand_voice,
      primary_color,
      secondary_color,
    } = body;

    const settingsData = {
      user_id: userId,
      agency_name: agency_name || "Lindasal",
      brand_voice: brand_voice || "profesional e inspirador",
      primary_color: primary_color || "#c9a84c",
      secondary_color: secondary_color || "#0a1628",
      meta_page_id: meta_page_id || null,
      meta_page_access_token: meta_page_access_token || null,
      meta_ig_user_id: meta_ig_user_id || null,
      updated_at: new Date().toISOString()
    };

    const { data: existing } = await supabase
      .from("social_settings")
      .select("id")
      .eq("user_id", userId)
      .single();

    let result;

    if (existing) {
      result = await supabase
        .from("social_settings")
        .update(settingsData)
        .eq("user_id", userId)
        .select()
        .single();
    } else {
      result = await supabase
        .from("social_settings")
        .insert(settingsData)
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return NextResponse.json({ success: true, settings: result.data });
  } catch (error: any) {
    console.error("[SETTINGS] Error guardando:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
