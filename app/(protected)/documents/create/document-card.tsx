"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Button } from "@ui/button";
import { UseIcon } from "@hooks/use-icons";
import { deleteDocument } from "@/app/actions/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMore((prev) => !prev)}
              >
                {showMore ? "Mostrar menos" : "Mostrar más"}
              </Button>
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

              toast.promise(async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }, {
                loading: "Eliminando documento...",
                success: "Documento eliminado",
                description: "Se ha eliminado el documento correctamente",
              });

              router.refresh();
            });
          }}
        >
          <UseIcon name="trash" className="size-3 fill-transparent" />
          Eliminar
        </Button>
      </CardHeader>
    </Card>
  );
}
