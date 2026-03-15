"use client";

import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Input } from "@ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@ui/tabs";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Settings,
} from "lucide-react";
import { DiscordIcon } from "@/app/components/icons/discord";
import { GithubIcon } from "@/app/components/icons/github";
import { GmailIcon } from "@/app/components/icons/gmail";
import { GoogleCalendarIcon } from "@/app/components/icons/google-calendar";
import { GoogleDocsIcon } from "@/app/components/icons/google-docs";
import { LinearIcon } from "@/app/components/icons/linear";
import { MsTeamsIcon } from "@/app/components/icons/ms-teams";
import { NotionIcon } from "@/app/components/icons/notion";
import { SlackIcon } from "@/app/components/icons/slack";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useIntegrationActions } from "@hooks/use-integration-actions";
import type { UserResource } from "@clerk/types";

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

const integrationCategories: {
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

export default function IntegrationsPage() {
  const router = useRouter();
  const { connect, disconnect, user } = useIntegrationActions();
  const [error, setError] = useState<{
    message: string;
    details?: unknown;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDisconnect = async (provider: string) => {
    try {
      setIsLoading(provider);
      const result = await disconnect(provider);
      if (result.cancelled) return;

      // Refresh the route to update the UI
      router.refresh();
    } catch (err) {
      const maybeClerkError = err as {
        clerkError?: boolean;
        code?: string;
      };

      // If user cancels the reverification modal, don't show an error.
      if (maybeClerkError?.clerkError === true && maybeClerkError?.code) {
        if (
          maybeClerkError.code === "reverification_cancelled" ||
          maybeClerkError.code === "reverification_cancelled_error"
        ) {
          return;
        }
      }

      console.error("Error disconnecting account:", err);
      setError({
        message: "No se pudo desconectar la cuenta",
        details: err,
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Integraciones</h2>
          <p className="text-muted-foreground">
            Administra y configura tus integraciones de servicios
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Ajustes
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <p className="text-red-500">Error: {error.message}</p>
            <pre className="mt-2 text-gray-500 text-sm">
              Detalles: {JSON.stringify(error.details ?? {}, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Tabs
        defaultValue="all"
        className="space-y-6"
        onValueChange={setActiveTab}
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="connected">Conectadas</TabsTrigger>
            <TabsTrigger value="available">Disponibles</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Buscar integraciones..."
              className="h-8 w-37.5 lg:w-62.5"
            />
          </div>
        </div>

        <TabsContent value="all" className="space-y-8">
          {integrationCategories.map((category) => (
            <div key={category.title} className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{category.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {category.description}
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.integrations.map((integration) => (
                  <Card key={integration.name}>
                    <CardHeader
                      className={`space-y-1 ${
                        integration.disabled ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`rounded-md p-2 ${integration.bgColor}`}
                        >
                          <integration.icon
                            className={`h-6 w-6 ${integration.iconColor}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                              {integration.name}
                            </CardTitle>
                            {user &&
                            integration.getStatus(user) === "connected" ? (
                              <Badge
                                variant="default"
                                className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Conectada
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className={
                                  integration.disabled
                                    ? "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
                                    : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                                }
                              >
                                {integration.disabled ? (
                                  <>
                                    <AlertCircle className="mr-1 h-3 w-3" />
                                    {integration.status}
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="mr-1 h-3 w-3" />
                                    Configuración requerida
                                  </>
                                )}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent
                      className={`space-y-4 ${
                        integration.disabled ? "opacity-60" : ""
                      }`}
                    >
                      <div className="space-y-2">
                        <CardDescription>
                          {integration.description}
                        </CardDescription>
                        {integration.disabled && (
                          <p className="text-muted-foreground text-sm italic">
                            Esta integración estará disponible pronto
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {user && integration.getStatus(user) === "connected" ? (
                          <>
                            <Button
                              variant="outline"
                              className="flex-1"
                              asChild
                            >
                              <Link href={integration.link || "#"}>
                                Configurar
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() =>
                                handleDisconnect(integration.provider)
                              }
                              disabled={isLoading === integration.provider}
                            >
                              {isLoading === integration.provider ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Desconectando...
                                </>
                              ) : (
                                "Desconectar"
                              )}
                            </Button>
                          </>
                        ) : (
                          <Button
                            className="flex-1"
                            asChild
                            disabled={integration.disabled}
                          >
                            {user ? (
                              <button
                                type="button"
                                onClick={() => connect()}
                                className="inline-flex h-full w-full items-center justify-center"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Conectar
                              </button>
                            ) : (
                              <Link
                                href={`/sign-in?redirect=/integrations/${integration.name.toLowerCase()}`}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Conectar
                              </Link>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="connected" className="space-y-8">
          {integrationCategories.map((category) => {
            const connectedIntegrations = category.integrations.filter(
              (integration) =>
                user && integration.getStatus(user) === "connected",
            );

            if (connectedIntegrations.length === 0) return null;

            return (
              <div key={category.title} className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {connectedIntegrations.map((integration) => (
                    <Card key={integration.name}>
                      <CardHeader
                        className={`space-y-1 ${
                          integration.disabled ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`rounded-md p-2 ${integration.bgColor}`}
                          >
                            <integration.icon
                              className={`h-6 w-6 ${integration.iconColor}`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-xl">
                                {integration.name}
                              </CardTitle>
                              <Badge
                                variant="default"
                                className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Conectada
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent
                        className={`space-y-4 ${
                          integration.disabled ? "opacity-60" : ""
                        }`}
                      >
                        <div className="space-y-2">
                          <CardDescription>
                            {integration.description}
                          </CardDescription>
                          {integration.disabled && (
                            <p className="text-muted-foreground text-sm italic">
                              Esta integración estará disponible pronto
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" className="flex-1" asChild>
                            <Link href={integration.link || "#"}>
                              Configurar
                            </Link>
                          </Button>
                          <Button variant="outline" className="flex-1" disabled>
                            Desconectar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="available" className="space-y-8">
          {integrationCategories.map((category) => {
            const availableIntegrations = category.integrations.filter(
              (integration) =>
                !integration.disabled &&
                (!user || integration.getStatus(user) !== "connected"),
            );

            if (availableIntegrations.length === 0) return null;

            return (
              <div key={category.title} className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{category.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {category.description}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availableIntegrations.map((integration) => (
                    <Card key={integration.name}>
                      <CardHeader
                        className={`space-y-1 ${
                          integration.disabled ? "opacity-60" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`rounded-md p-2 ${integration.bgColor}`}
                          >
                            <integration.icon
                              className={`h-6 w-6 ${integration.iconColor}`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-xl">
                                {integration.name}
                              </CardTitle>
                              <Badge
                                variant="secondary"
                                className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                              >
                                <AlertCircle className="mr-1 h-3 w-3" />
                                Configuración requerida
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent
                        className={`space-y-4 ${
                          integration.disabled ? "opacity-60" : ""
                        }`}
                      >
                        <div className="space-y-2">
                          <CardDescription>
                            {integration.description}
                          </CardDescription>
                          {integration.disabled && (
                            <p className="text-muted-foreground text-sm italic">
                              Esta integración estará disponible pronto
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button className="flex-1" onClick={() => connect()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Conectar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
