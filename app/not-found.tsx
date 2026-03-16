import { UseIcon } from "@hooks/use-icons";
import Link from "next/link";
import styles from "./page-background.module.css";
import Footer from "@layout/footer";

export default function NotFound() {
  return (
    <div className={styles.background}>
      <div className="grid min-h-dvh grid-rows-[1fr_auto]">
        <main className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <div
            className="mb-8 flex items-center justify-center gap-4 sm:mb-12 sm:gap-6 md:gap-8"
            aria-hidden="true"
          >
            <span className={styles.digit}>4</span>
            <UseIcon
              name="donut"
              className="size-20 transition-transform duration-700 hover:rotate-360 sm:size-24 md:size-28"
            />
            <span className={styles.digit}>4</span>
          </div>

          <h1 className="mb-6 font-fusion text-5xl leading-tight tracking-tight sm:mb-8 sm:text-6xl md:text-7xl lg:text-8xl">
            Pagina No
            <br />
            Encontrada
          </h1>

          <p className="max-w-md font-mono text-sm uppercase leading-relaxed text-muted-foreground sm:text-base">
            Lo siento, la página que estás buscando no existe o ha sido
            removida. Sigue explorando nuestro sitio.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-6 py-3 font-medium text-foreground transition-all duration-300 hover:bg-card/50"
            >
              <UseIcon name="arrow-up-left" className="size-5" />
              Volver al inicio
            </Link>
            <span
              className="flex items-center justify-center text-sm md:hidden"
              aria-hidden="true"
            >
              •
            </span>
            <span className="font-light text-base leading-normal text-foreground">
              Hora de hacer alguna otra cosa
            </span>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
