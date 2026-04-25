import { NextResponse } from "next/server";
import { generateCaption } from "@/lib/services/ai-content.service";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { imageUrl, platform = "facebook" } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Falta la URL de la imagen" },
        { status: 400 }
      );
    }

    // Generate a caption based on the image context
    const caption = await generateCaption({
      topic: `Analiza esta imagen y genera un caption publicitario atractivo y creativo para redes sociales de Lindasal (marca premium de sal marina orgánica de Ecuador). La imagen está en: ${imageUrl}`,
      brandVoice: "profesional y elegante, estilo premium",
      platform,
    });

    return NextResponse.json({ success: true, caption });
  } catch (error: any) {
    console.error("[SOCIAL] Error generando caption:", error?.message || error);
    return NextResponse.json(
      { error: error?.message || "Error generando caption con IA." },
      { status: 500 }
    );
  }
}
