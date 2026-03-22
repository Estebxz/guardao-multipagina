"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { DiscordIcon } from "@/app/components/icons/discord";
import { useIntegrationActions } from "@hooks/use-integration-actions";
import { CheckCircle2 } from "lucide-react";

type DiscordUser = {
  id: string;
  username: string;
  global_name?: string | null;
  avatar?: string | null;
  email?: string | null;
  verified?: boolean;
};

type DiscordGuild = {
  id: string;
  name: string;
  icon?: string | null;
};

function getDiscordAvatarUrl(user: DiscordUser) {
  if (!user.avatar) return null;
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
}

export default function DiscordIntegration() {
  const router = useRouter();
  const { connect, disconnect, user, userLoaded } = useIntegrationActions();

  const discordAccount = user?.externalAccounts?.find(
    (account) => account.provider === "discord",
  );
  const isConnected = Boolean(discordAccount);

  const [profile, setProfile] = useState<DiscordUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [guildsLoading, setGuildsLoading] = useState(false);
  const [guildsError, setGuildsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDiscordProfile() {
      if (!userLoaded || !isConnected) {
        setProfile(null);
        setLoading(false);
        setGuilds([]);
        setGuildsLoading(false);
        setGuildsError(null);
        return;
      }

      setLoading(true);
      setError(null);

      setGuildsLoading(true);
      setGuildsError(null);
      try {
        const [profileRes, guildsRes] = await Promise.all([
          fetch("/api/discord/user", { cache: "no-store" }),
          fetch("/api/discord/guilds", { cache: "no-store" }),
        ]);

        if (!profileRes.ok) {
          const body = await profileRes.text();
          throw new Error(body || "No se pudo obtener el perfil de Discord.");
        }

        const profileData = (await profileRes.json()) as DiscordUser;
        setProfile(profileData);

        if (!guildsRes.ok) {
          const body = await guildsRes.text();
          setGuildsError(
            body || "No se pudieron obtener los servidores (guilds).",
          );
          setGuilds([]);
        } else {
          const guildsData = (await guildsRes.json()) as DiscordGuild[];
          setGuilds(Array.isArray(guildsData) ? guildsData : []);
        }
      } catch (err) {
        setProfile(null);
        setError(err instanceof Error ? err.message : "Error desconocido");
        setGuilds([]);
        setGuildsError(null);
      } finally {
        setLoading(false);
        setGuildsLoading(false);
      }
    }

    fetchDiscordProfile();
  }, [isConnected, userLoaded]);

  const avatarUrl = useMemo(() => {
    if (!profile) return null;
    return getDiscordAvatarUrl(profile);
  }, [profile]);

  const displayName = profile?.global_name || profile?.username || "Discord";

  const handleDisconnect = async () => {
    try {
      const result = await disconnect("discord");
      if (result.cancelled) return;
      router.push("/integrations");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  if (!userLoaded) {
    return (
      <div className="flex h-full flex-col space-y-8 p-4 md:p-8">
        <Card>
          <CardContent className="p-6">Cargando...</CardContent>
        </Card>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex h-full flex-col space-y-8 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DiscordIcon className="size-6" />
              <span>Integración con Discord</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Conecta tu cuenta de Discord para mostrar tu perfil.
            </p>
            <Button onClick={() => connect()}>Conectar Discord</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col space-y-8 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <DiscordIcon className="size-8 shrink-0" />
          <div>
            <h2 className="font-bold text-2xl tracking-tight">
              Integración con Discord
            </h2>
            <p className="text-muted-foreground">Administra tu conexión</p>
          </div>
          <Badge
            variant="default"
            className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Conectada
          </Badge>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={handleDisconnect}>
            Desconectar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-red-500">Error: {error}</p>}

          {loading && (
            <p className="text-muted-foreground">Cargando perfil...</p>
          )}

          {profile && (
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-full"
                />
              ) : (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {displayName.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <h3 className="font-medium text-lg">{displayName}</h3>
                {profile.email && (
                  <p className="text-muted-foreground text-sm truncate">
                    {profile.email}
                  </p>
                )}
              </div>
            </div>
          )}

          {!loading && !profile && !error && (
            <p className="text-muted-foreground">
              No se pudo cargar el perfil. Intenta reconectar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
