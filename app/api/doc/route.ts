import { getSecureSession } from "@lib/auth/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@lib/client";

const updateDocumentSchema = z.object({
  id: z.number(),
  content: z.string(),
});

export async function PATCH(request: Request) {
  try {
    const session = await getSecureSession();
    const body = await request.json();
    const parser = updateDocumentSchema.safeParse(body);

    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    if (!parser.success) {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    const { error } = await supabase
      .from("tasks")
      .update({ name: parser.data.content })
      .eq("id", parser.data.id);

    if (error) {
      console.error(error);
      return new NextResponse("Database error", { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (e) {
    console.error("[DOCUMENT_UPDATE]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
