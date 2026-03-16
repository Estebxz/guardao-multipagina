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

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useIntegrationActions } from "@hooks/use-integration-actions";
import { useState } from "react";
import { integrationCategories } from "@lib/integration-nav";

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

      router.refresh();
    } catch (err) {
      const maybeClerkError = err as {
        clerkError?: boolean;
        code?: string;
      };

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
    <div className="flex h-full flex-1 flex-col space-y-8 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Integraciones</h2>
          <p className="text-muted-foreground">
            Administra y configura tus integraciones de servicios
          </p>
        </div>
        <div className="flex items-center shrink-0">
          <Button>
            <Settings className="mr-2 size-4" />
            Ajustes
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        className="space-y-6"
        onValueChange={setActiveTab}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="connected">Conectadas</TabsTrigger>
            <TabsTrigger value="available">Disponibles</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Buscar integraciones..."
              className="h-8 w-full sm:w-40 lg:w-64"
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
