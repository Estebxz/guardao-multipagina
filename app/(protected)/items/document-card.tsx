"use client";

import { useMemo, useState, useTransition } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@common/card";
import { Button } from "@common/button";
import { TrashIcon } from "@ico/trash";
import { deleteDocument } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";

type DocumentCardProps = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
};

export default function DocumentCard({
  id,
  name,
  description,
  createdAt,
}: DocumentCardProps) {
  const [showMore, setShowMore] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const hasDescription = Boolean(description?.trim().length);

  const formattedDate = useMemo(() => {
    return new Date(createdAt).toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });
  }, [createdAt]);

  const shortDescription =
    description && description.length > 200
      ? `${description.substring(0, 200)}...`
      : description;

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <CardTitle>{name}</CardTitle>
        <span className="text-xs text-muted-foreground">{formattedDate}</span>

        {hasDescription && (
          <div className="space-y-2">
            <CardDescription
              className={
                showMore
                  ? "whitespace-pre-wrap wrap-break-word text-sm leading-relaxed"
                  : "wrap-break-word text-sm leading-relaxed"
              }
            >
              {showMore ? description : shortDescription}
            </CardDescription>

            {description!.length > 100 && (
              <button
                type="button"
                onClick={() => setShowMore((prev) => !prev)}
                className="w-fit text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground"
              >
                {showMore ? "Mostrar menos" : "Mostrar más"}
              </button>
            )}
          </div>
        )}
        <Button
          type="button"
          variant={"destructive"}
          className="w-fit sm:w-auto"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const res = await deleteDocument(id);

              if (res?.error) {
                console.error(res.error);
                return;
              }

              sileo.error({
                title: "Documento eliminado",
                description: "Se ha eliminado el documento correctamente",
                autopilot: true,
                roundness: 5,
              });

              router.refresh();
            });
          }}
        >
          <TrashIcon />
          Eliminar
        </Button>
      </CardHeader>
    </Card>
  );
}
