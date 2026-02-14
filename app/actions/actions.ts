"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@lib/client";
import { revalidatePath } from "next/cache";

const documentSchema = z.object({
  name: z.string().min(1, "El titulo es requerido"),
  description: z.string().max(500, "Maximo 500 caracteres").optional(),
});

export async function addDocument(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No autorizado" };
  }

  const parsed = documentSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description")?.toString() || "",
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      error: firstError?.message || "Error de validación",
    };
  }

  const client = createServerSupabaseClient();
  const { error } = await client.from("tasks").insert({
    name: parsed.data.name,
    description: parsed.data.description,
  });

  if (error) {
    return { error: "Error al guardar documento" };
  }

  return { success: true };
}

export async function deleteDocument(id: number) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "No autorizado" };
  }

  const client = createServerSupabaseClient();
  const { error } = await client.from("tasks").delete().eq("id", id);

  if (error) {
    return { error: "Error al eliminar documento" };
  }

  revalidatePath("/items");
  return { success: true };
}
