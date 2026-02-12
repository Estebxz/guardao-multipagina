import { createServerSupabaseClient } from "@/app/lib/client";
import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@common/card";

interface DocProps {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export const dynamic = "force-dynamic";


export default async function Items() {
  const client = createServerSupabaseClient();
  await auth.protect();

  const { data: documents, error } = await client
    .from("tasks")
    .select<"*", DocProps>();

  if (error) throw error;

  return (
    <div className="flex-1 space-y-8 p-8 md:flex flex h-full flex-col bg-background text-foreground">
      <main className="flex items-center justify-between space-y-2">
        {documents?.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <CardTitle>{doc.name}</CardTitle>
              <CardDescription className="max-w-20 truncate">
                {doc.description}
              </CardDescription>
              <span className="mt-2">
                {new Date(doc.created_at).toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </CardHeader>
          </Card>
        ))}
      </main>
    </div>
  );
}
