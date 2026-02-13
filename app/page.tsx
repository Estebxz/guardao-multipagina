import { SignedIn, UserAvatar } from "@clerk/nextjs";
import GKeyCap from "@common/keycap";
import Footer from "@shell/footer";

export default function LandingPage() {
  return (
    <div className="grid h-screen grid-rows-[1fr_auto]">
      <main className="relative z-10 flex items-center justify-center overflow-hidden px-4 py-8">
        <section className="container mx-auto flex w-full max-w-2xl flex-col items-center justify-center text-center">
          <SignedIn>
            <div className="mb-6 flex items-center justify-center">
              <UserAvatar rounded={false}/>
            </div>
          </SignedIn>

          <header className="mb-10 flex flex-col items-center gap-3">
            <h1 className="font-fusion text-6xl sm:text-7xl md:text-8xl tracking-tight">
              GUARDAO
            </h1>

            <p className="max-w-xl font-mono text-sm sm:text-base leading-relaxed text-muted-foreground uppercase">
              Aloja, crea y descarga archivos de manera rápida y segura,
              personalizando tu experiencia, colaboración en comunidad e
              integración con aplicaciones externas.
            </p>
          </header>

          <div>
            <p className="text-base sm:text-lg text-muted-foreground">
              <span className="md:hidden">Presiona para empezar</span>
              <span className="hidden md:inline">
                Presiona{" "}
                <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-muted bg-muted px-2 font-mono text-xs font-medium text-foreground">
                  T
                </kbd>{" "}
                para empezar
              </span>
            </p>
          </div>

          <div className="mt-10">
            <GKeyCap />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
