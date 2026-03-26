import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnnouncementBar } from "@common/announcement-bar";

export const metadata: Metadata = {
  metadataBase: new URL("https://guardao.vercel.app"),
  title: "GUARDAO - Aloja, crea y descarga archivos",
  description:
    "Aloja, crea y descarga archivos de manera rápida y segura, personalizando tu experiencia, colaboración en comunidad e integración con aplicaciones externas.",
  keywords: [
    "guardao",
    "GUARDAO",
    "guardao vercel",
    "GUARDAO VERCEL",
    "guardao app",
    "GUARDAO APP",
    "aloja",
    "crea",
    "descarga",
    "archivos",
    "rápido",
    "seguro",
    "personaliza",
    "colaboración",
    "comunidad",
    "integración",
    "aplicaciones",
    "externas",
  ],
  applicationName: "GUARDAO",
  authors: [
    { name: "Joan Esteban Mendez", url: "https://joanmm.netlify.app/" },
  ],
  creator: "Joan Esteban Mendez",
  openGraph: {
    type: "website",
    locale: "es-CO",
    title: "GUARDAO - Construido por Joan Esteban Mendez",
    description:
      "Aloja, crea y descarga archivos de manera rápida y segura, personalizando tu experiencia, colaboración en comunidad e integración con aplicaciones externas.",
    url: "https://guardao.vercel.app",
    images: [
      {
        url: "https://guardao.vercel.app/og.jpg",
        width: 1200,
        height: 630,
        alt: "GUARDAO - Construido por Joan Esteban Mendez",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GUARDAO - Construido por Joan Esteban Mendez",
    description:
      "Aloja, crea y descarga archivos de manera rápida y segura, personalizando tu experiencia, colaboración en comunidad e integración con aplicaciones externas.",
    creator: "Joan Esteban Mendez",
    images: ["https://guardao.vercel.app/og.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "technology",
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
