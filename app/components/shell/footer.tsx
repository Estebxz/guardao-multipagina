import { UseIcon } from "@hooks/use-icons";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-black/60 backdrop-blur-sm">
      <div className="container mx-auto flex h-8 max-w-2xl items-center justify-between px-6">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a
            href="https://github.com/Estebxz/guardao-multipagina"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            <UseIcon name="github" className="size-3.5" />
          </a>

          <a
            href="https://www.linkedin.com/in/martinez-esteban/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            <UseIcon name="linkedin" className="size-3.5" />
          </a>
        </div>

        <div className="text-xs text-muted-foreground">
          Construido por{" "}
          <a
            href="https://joanmm.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            @Joan_Esteban
          </a>
        </div>
      </div>
    </footer>
  );
}
