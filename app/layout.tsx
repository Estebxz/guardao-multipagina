import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AnnouncementBar } from "@common/announcement-bar";

export const metadata: Metadata = {
  title: "GUARDAO - Aloja, crea y descarga archivos",
  description: "Aloja, crea y descarga archivos de manera rápida y segura, personalizando tu experiencia, colaboración en comunidad e integración con aplicaciones externas.",
  keywords: ["guardao", "GUARDAO", "guardao vercel", "GUARDAO VERCEL", "guardao app", "GUARDAO APP", "aloja", "crea", "descarga", "archivos", "rápido", "seguro", "personaliza", "colaboración", "comunidad", "integración", "aplicaciones", "externas"],
  applicationName: "GUARDAO",
  authors: [{ name: "Joan Esteban Mendez", url: "https://joanmm.netlify.app/" }],
  creator: "Joan Esteban Mendez",
  metadataBase: new URL("https://guardao.vercel.app")
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <AnnouncementBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
