import { createServerSupabaseClient } from "@/app/lib/client";
import { auth } from "@clerk/nextjs/server";
import DocumentCard from "./document-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface DocProps {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export default async function Items() {
  const client = createServerSupabaseClient();
  await auth.protect();

  const { data: documents, error } = await client
    .from("tasks")
    .select<"*", DocProps>();

  if (error) throw error;

  const hasDocuments = Boolean(documents?.length);

  return (
    <div className="flex h-full flex-1 flex-col gap-8 bg-background p-8 text-foreground">
      {!hasDocuments ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <div className="text-lg font-medium">Aún no tienes documentos</div>
          <div className="text-sm text-muted-foreground">
            Crea tu primer documento para empezar.
          </div>
          <Link
            href="/doc"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent/80"
          >
            Nuevo documento
          </Link>
        </div>
      ) : (
        <main className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {documents?.map((doc) => (
            <DocumentCard
              key={doc.id}
              id={doc.id}
              name={doc.name}
              description={doc.description}
              createdAt={doc.created_at}
            />
          ))}
        </main>
      )}
    </div>
  );
}
