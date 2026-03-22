import type { UserResource } from "@clerk/types";
import type { FC } from "react";
import { DiscordIcon } from "@/app/components/icons/discord";
import { GithubIcon } from "@/app/components/icons/github";
import { GmailIcon } from "@/app/components/icons/gmail";
import { GoogleCalendarIcon } from "@/app/components/icons/google-calendar";
import { GoogleDocsIcon } from "@/app/components/icons/google-docs";
import { LinearIcon } from "@/app/components/icons/linear";
import { MsTeamsIcon } from "@/app/components/icons/ms-teams";
import { NotionIcon } from "@/app/components/icons/notion";
import { SlackIcon } from "@/app/components/icons/slack";

type Integration = {
  name: string;
  description: string;
  icon: FC<{ className?: string; size?: number }>;
  getStatus: (
    user: UserResource | null | undefined,
  ) => "connected" | "disconnected";
  bgColor: string;
  iconColor: string;
  link: string;
  provider: string;
  disabled?: boolean;
  status?: string;
};

export const integrationCategories: {
  title: string;
  description: string;
  integrations: Integration[];
}[] = [
  {
    title: "Productividad",
    description:
      "Integra tus herramientas de productividad y gestión de proyectos",
    integrations: [
      {
        name: "GitHub",
        description:
          "Accede a repositorios e incidencias desde tu cuenta de GitHub",
        icon: GithubIcon,
        getStatus: (user: UserResource | null | undefined) =>
          user?.externalAccounts?.some(
            (account) => account.provider === "github",
          )
            ? "connected"
            : "disconnected",
        bgColor: "bg-gray-500/10",
        iconColor: "text-gray-500",
        link: "/integrations/github",
        provider: "github",
      },
      {
        name: "Notion",
        description:
          "Accede a páginas y bases de datos desde tu espacio de trabajo en Notion",
        icon: NotionIcon,
        getStatus: (user: UserResource | null | undefined) =>
          user?.externalAccounts?.some(
            (account) => account.provider === "notion",
          )
            ? "connected"
            : "disconnected",
        bgColor: "bg-stone-500/10",
        iconColor: "text-stone-500",
        link: "/integrations/notion",
        disabled: true,
        status: "Pronto",
        provider: "notion",
      },
      {
        name: "Linear",
        description:
          "Accede a incidencias y equipos desde tu espacio de trabajo en Linear",
        icon: LinearIcon,
        getStatus: (user: UserResource | null | undefined) =>
          user?.externalAccounts?.some(
            (account) => account.provider === "linear",
          )
            ? "connected"
            : "disconnected",
        bgColor: "bg-violet-500/10",
        iconColor: "text-violet-500",
        link: "/integrations/linear",
        disabled: true,
        status: "Pronto",
        provider: "linear",
      },
      {
        name: "Google Calendar",
        description: "Sincroniza eventos y horarios desde Google Calendar",
        icon: GoogleCalendarIcon,
        getStatus: (user: UserResource | null | undefined) =>
          user?.externalAccounts?.some(
            (account) =>
              account.provider === "google" &&
              account.approvedScopes.includes(
                "https://www.googleapis.com/auth/calendar.app.created",
              ) &&
              account.approvedScopes.includes(
                "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
              ),
          )
            ? "connected"
            : "disconnected",
        bgColor: "bg-blue-500/10",
        iconColor: "text-blue-500",
        link: "/integrations/google-calendar",
        provider: "google",
        disabled: true,
        status: "Pronto",
      },
      {
        name: "Google Docs",
        description: "Accede y sincroniza documentos desde Google Docs",
        icon: GoogleDocsIcon,
        getStatus: (user: UserResource | null | undefined) =>
          user?.externalAccounts?.some(
            (account) =>
              account.provider === "google" &&
              account.approvedScopes.includes(
                "https://www.googleapis.com/auth/drive.file",
              ),
          )
            ? "connected"
            : "disconnected",
        bgColor: "bg-blue-500/10",
        iconColor: "text-blue-500",
        link: "/integrations/google-docs",
        provider: "google",
        disabled: true,
        status: "Pronto",
      },
    ],
  },
  {
    title: "Comunicación",
    description:
      "Conecta tus herramientas de comunicación y colaboración en equipo",
    integrations: [
      {
        name: "Discord",
        description: "Importa mensajes y archivos desde canales de Discord",
        icon: DiscordIcon,
        getStatus: (user: UserResource | null | undefined) =>
          user?.externalAccounts?.some(
            (account) => account.provider === "discord",
          )
            ? "connected"
            : "disconnected",
        bgColor: "bg-indigo-500/10",
        iconColor: "text-indigo-500",
        link: "/integrations/discord",
        provider: "discord",
      },
      {
        name: "Slack",
        description:
          "Sincroniza mensajes e hilos desde espacios de trabajo en Slack",
        icon: SlackIcon,
        getStatus: (user: UserResource | null | undefined) =>
          user?.externalAccounts?.some(
            (account) => account.provider === "slack",
          )
            ? "connected"
            : "disconnected",
        bgColor: "bg-green-500/10",
        iconColor: "text-green-500",
        link: "/integrations/slack",
        provider: "slack",
        disabled: true,
        status: "Pronto",
      },
      {
        name: "Gmail",
        description: "Sincroniza correos y adjuntos desde tu cuenta de Gmail",
        icon: GmailIcon,
        getStatus: (user: UserResource | null | undefined) =>
          user?.externalAccounts?.some(
            (account) =>
              account.provider === "google" &&
              account.approvedScopes.includes(
                "https://www.googleapis.com/auth/gmail.addons.current.message.action",
              ),
          )
            ? "connected"
            : "disconnected",
        bgColor: "bg-red-500/10",
        iconColor: "text-red-500",
        link: "/integrations/gmail",
        provider: "google",
        disabled: true,
        status: "Pronto",
      },
      {
        name: "Microsoft Teams",
        description: "Sincroniza mensajes e hilos desde Microsoft Teams",
        icon: MsTeamsIcon,
        getStatus: (user: UserResource | null | undefined) =>
          user?.externalAccounts?.some(
            (account) => account.provider === "microsoft",
          )
            ? "connected"
            : "disconnected",
        bgColor: "bg-blue-500/10",
        iconColor: "text-blue-500",
        link: "/integrations/microsoft-teams",
        disabled: true,
        status: "Pronto",
        provider: "microsoft",
      },
    ],
  },
];