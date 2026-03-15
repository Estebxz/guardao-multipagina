import type { SidebarIcon } from "@type/ui";
import { GithubIcon } from "@/app/components/icons/github";
import { NotionIcon } from "@/app/components/icons/notion";
import { LinearIcon } from "@/app/components/icons/linear";
import { DiscordIcon } from "@/app/components/icons/discord";

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
    icon: "grid",
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
  {
    label: "Notion",
    tooltip: "Acceder a Notion",
    icon: NotionIcon,
    url: "/integrations/notion",
  },
  {
    label: "Linear",
    tooltip: "Acceder a Linear",
    icon: LinearIcon,
    url: "/integrations/linear",
  },
  {
    label: "Discord",
    tooltip: "Acceder a Discord",
    icon: DiscordIcon,
    url: "/integrations/discord",
  },
];
