import Greeting from "@common/greeting";
import { UseIcon } from "@hooks/use-icons";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home() {
  await auth.protect();

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <main className="flex flex-1 items-center justify-center overflow-auto">
        <div className="container mx-auto flex max-w-full flex-col items-center gap-8 px-4 py-12 text-center">
          <Greeting />

          <section className="flex flex-wrap justify-center gap-3">
            <Link
              href="doc"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-medium text-foreground transition-all duration-300 hover:bg-card/50"
            >
              <UseIcon name="plus" className="size-4 fill-foreground" />
              Nuevo documento
            </Link>
            <Link
              href="items"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-medium text-foreground transition-all duration-300 hover:bg-card/50"
            >
              <UseIcon name="archive-box" className="size-4 fill-foreground" />
              Ver documentos
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
