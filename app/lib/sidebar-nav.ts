import type { SidebarIcon } from "@type/ui";
import { GithubIcon } from "@/app/components/icons/github";

export type SidebarNavItemConfig = {
  label: string;
  tooltip: string;
  icon: SidebarIcon;
  url: string;
};

export const mainNav: SidebarNavItemConfig[] = [
  {
    label: "Inicio",
    tooltip: "Navegar al inicio",
    icon: "home",
    url: "/dashboard",
  },
];

export const documentsNav: SidebarNavItemConfig[] = [
  {
    label: "Ver documentos",
    tooltip: "Ver todos los documentos",
    icon: "archive-box",
    url: "/documents",
  },
  {
    label: "Crear documento",
    tooltip: "Crear nuevo documento",
    icon: "plus",
    url: "/documents/create",
  },
];

export const integrationsNav: SidebarNavItemConfig[] = [
  {
    label: "GitHub",
    tooltip: "Acceder a GitHub",
    icon: GithubIcon,
    url: "/integrations/github",
  },
];
