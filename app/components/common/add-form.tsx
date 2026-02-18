"use client";

import { useRef, useState, useTransition } from "react";
import { addDocument } from "@/app/actions/actions";
import { Button } from "./button";
import { Input } from "./input";
import { sileo } from "sileo";
import { redirect } from "next/navigation";

export default function AddTaskForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await addDocument(formData);

      if (res?.error) {
        setError(res.error);
      } else {
        setError("");
        setTitle("");
        setDescription("");

        sileo.success({
          title: "Documento guardado",
          description: "Se ha guardado el documento correctamente",
          button: {
            title: "Ver documento",
            onClick: () => redirect(`/items`),
          },
          roundness: 5,
        });
      }
    });
  }

  return (
    <form action={handleSubmit} className="mb-2 px-8">
      <Input
        disabled={isPending}
        ref={inputRef}
        name="name"
        placeholder="Título del documento..."
        aria-label="Titulo del documento"
        aria-disabled={isPending}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-3xl! h-8 border-none bg-transparent p-0 font-semibold focus-visible:ring-0"
      />

      <textarea
        name="description"
        placeholder="Empieza a escribir..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="min-h-40 min-w-full resize-none outline-none"
        maxLength={500}
      />

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">
          {description.length}/500 caracteres
        </span>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <Button
          ref={buttonRef}
          type="submit"
          disabled={isPending}
          aria-label="guardar documento"
          className="bg-accent hover:bg-accent/80 text-primary-foreground px-4 py-2 rounded-md disabled:opacity-50"
        >
          {isPending ? "Guardando..." : "Guardar documento"}
        </Button>
      </div>
    </form>
  );
}
