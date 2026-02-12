import { DonutIcon } from "@ico/donut";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center px-4 py-12">
      <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12" aria-hidden="true">
        <span className="flex items-center justify-center rounded-lg border border-border bg-card/50 backdrop-blur-sm w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 text-4xl sm:text-5xl md:text-6xl font-light text-foreground/80 transition-all duration-300 hover:scale-95 hover:bg-card/70">
          4
        </span>

        <DonutIcon className="size-20 sm:size-24 md:size-28 text-foreground transition-transform duration-700 hover:rotate-360" />

        <span className="flex items-center justify-center rounded-lg border border-border bg-card/50 backdrop-blur-sm w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 text-4xl sm:text-5xl md:text-6xl font-light text-foreground/80 transition-all duration-300 hover:scale-95 hover:bg-card/70">
          4
        </span>
      </div>

      <h1 className="font-fusion text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-tight mb-6 sm:mb-8">
        Pagina No
        <br />
        Encontrada
      </h1>

      <section className="max-w-sm sm:max-w-md">
        <p className="max-w-xl font-mono text-sm sm:text-base leading-relaxed text-muted-foreground uppercase">
          Lo siento, la página que estás buscando no existe o ha sido removida.
          Sigue explorando nuestro sitio.
        </p>
      </section>

      <div className="flex flex-col items-center justify-center gap-4 text-nowrap sm:flex-row mt-10">
        <Link
          href="/"
          rel="noopener noreferrer"
          target="_self"
          className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-border rounded-lg font-medium text-foreground transition-all duration-300 hover:bg-card/50"
        >
          Volver al inicio
        </Link>
        <span className="flex items-center justify-center text-sm md:hidden">
          •
        </span>
        <span className="font-light text-base leading-normal text-foreground">
          Hora de hacer alguna otra cosa
        </span>
      </div>
    </main>
  );
}
