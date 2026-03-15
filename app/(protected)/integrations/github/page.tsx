"use client";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { GithubIcon } from "@/app/components/icons/github";
import { useUser } from "@clerk/nextjs";
import { CheckCircle2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

export default function GitHubIntegrationPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [repoPage, setRepoPage] = useState(1);
  const [hasMoreRepos, setHasMoreRepos] = useState(false);
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [error, setError] = useState<{
    message: string;
    details?: unknown;
  } | null>(null);

  const githubAccount = user?.externalAccounts?.find(
    (account) => account.provider === "github",
  );
  const isConnected = Boolean(githubAccount);

  const reposPerPage = 20;

  const fetchGitHubUser = async (username: string) => {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) {
      throw new Error("No se pudo obtener el perfil de GitHub.");
    }
    return (await userRes.json()) as GitHubUser;
  };

  const fetchGitHubReposPage = async (username: string, page: number) => {
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${reposPerPage}&sort=updated&page=${page}`,
    );
    if (!reposRes.ok) {
      throw new Error("No se pudieron obtener los repositorios de GitHub.");
    }
    const ghRepos = (await reposRes.json()) as GitHubRepo[];
    return Array.isArray(ghRepos) ? ghRepos : [];
  };

  useEffect(() => {
    async function fetchGitHubData() {
      if (!userLoaded || !isConnected) {
        setLoading(false);
        return;
      }

      try {
        const username = githubAccount?.username;
        if (!username) {
          throw new Error(
            "No se pudo obtener el usuario de GitHub desde tu cuenta conectada.",
          );
        }

        setRepoPage(1);
        setHasMoreRepos(false);
        setShowAllRepos(false);

        const [ghUser, ghReposFirstPage] = await Promise.all([
          fetchGitHubUser(username),
          fetchGitHubReposPage(username, 1),
        ]);

        setGithubUser(ghUser);
        setRepos(ghReposFirstPage);
        setHasMoreRepos(ghReposFirstPage.length === reposPerPage);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError({
            message: err.message,
            details: (err.cause as { details?: unknown })?.details,
          });
        } else {
          setError({ message: "Ocurrió un error desconocido" });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, [userLoaded, isConnected, githubAccount?.username]);

  const handleDisconnect = async () => {
    try {
      if (!githubAccount) {
        throw new Error("No hay una cuenta de GitHub conectada.");
      }

      await githubAccount.destroy();

      // Redirect to the integrations page after disconnecting
      window.location.href = "/integrations";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError({
          message: err.message,
          details: (err.cause as { details?: unknown })?.details,
        });
      } else {
        setError({ message: "Ocurrió un error desconocido" });
      }
    }
  };

  const handleLoadMoreRepos = async () => {
    try {
      if (!githubAccount?.username) return;
      if (!hasMoreRepos || isLoadingMore) return;

      setIsLoadingMore(true);
      const nextPage = repoPage + 1;

      const nextRepos = await fetchGitHubReposPage(
        githubAccount.username,
        nextPage,
      );

      setRepos((prev) => [...prev, ...nextRepos]);
      setRepoPage(nextPage);
      setHasMoreRepos(nextRepos.length === reposPerPage);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError({ message: err.message, details: err.cause });
      } else {
        setError({ message: "Ocurrió un error desconocido" });
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleShowAllRepos = async () => {
    try {
      if (!githubAccount?.username) return;
      if (showAllRepos) return;

      setShowAllRepos(true);
      setIsLoadingMore(true);

      let page = repoPage;
      let more = hasMoreRepos;

      while (more) {
        const nextPage = page + 1;
        const nextRepos = await fetchGitHubReposPage(
          githubAccount.username,
          nextPage,
        );

        setRepos((prev) => [...prev, ...nextRepos]);
        page = nextPage;
        more = nextRepos.length === reposPerPage;
        setRepoPage(page);
        setHasMoreRepos(more);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError({ message: err.message, details: err.cause });
      } else {
        setError({ message: "Ocurrió un error desconocido" });
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      setLoading(true);
      setError(null);
      const username = githubAccount?.username;
      if (!username) {
        throw new Error(
          "No se pudo obtener el usuario de GitHub desde tu cuenta conectada.",
        );
      }

      setRepoPage(1);
      setHasMoreRepos(false);
      setShowAllRepos(false);

      const [ghUser, ghReposFirstPage] = await Promise.all([
        fetchGitHubUser(username),
        fetchGitHubReposPage(username, 1),
      ]);

      setGithubUser(ghUser);
      setRepos(ghReposFirstPage);
      setHasMoreRepos(ghReposFirstPage.length === reposPerPage);
      console.log("Se sincronizó la información desde GitHub.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError({
          message: err.message,
          details: (err.cause as { details?: unknown })?.details,
        });
        console.error("Error al sincronizar:", err.message);
      } else {
        console.error("Error al sincronizar: Ocurrió un error desconocido");
      }
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  if (!userLoaded || loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GithubIcon className="h-6 w-6" />
              <span>Integración con GitHub</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Conecta tu cuenta de GitHub para acceder a tus repositorios y
              notificaciones.
            </p>
            <Button asChild>
              <Link href="/sign-in?redirect=/integrations/github">
                Conectar GitHub
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent>
            <p className="text-red-500">Error: {error.message}</p>
            <pre className="mt-2 text-gray-500 text-sm">
              {JSON.stringify(error.details ?? {}, null, 2)}
            </pre>

            <Button variant="outline" className="mt-4" asChild>
              <Link href="/sign-in?redirect=/integrations/github">
                Reconectar GitHub
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <GithubIcon className="h-8 w-8" />
          <div>
            <h2 className="font-bold text-2xl tracking-tight">
              Integración con GitHub
            </h2>
            <p className="text-muted-foreground">
              Administra tus repositorios (y próximamente tus notificaciones)
            </p>
          </div>
          <Badge
            variant="default"
            className="bg-green-500/10 text-green-500 hover:bg-green-500/20"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Conectada
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="default" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar datos
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleDisconnect}>
            Desconectar
          </Button>
        </div>
      </div>

      {/* User Profile */}
      {githubUser && (
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <img
              src={githubUser.avatar_url}
              alt={githubUser.login}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h3 className="font-medium text-lg">
                {githubUser.name ?? githubUser.login}
              </h3>

              {githubUser.bio && (
                <p className="text-muted-foreground text-sm">
                  {githubUser.bio}
                </p>
              )}
              <p className="text-muted-foreground text-sm">
                Repositorios: {githubUser.public_repos}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Repositorios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {repos.length === 0 && (
              <p className="text-muted-foreground">
                No se encontraron repositorios.
              </p>
            )}
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <p className="font-medium text-sm">{repo.full_name}</p>
                  {repo.description && (
                    <p className="text-muted-foreground text-sm">
                      {repo.description}
                    </p>
                  )}
                  <p className="text-muted-foreground text-sm">
                    Actualizado:{" "}
                    {new Date(repo.updated_at).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href={repo.html_url} target="_blank">
                    Ver
                  </Link>
                </Button>
              </div>
            ))}
            {hasMoreRepos && (
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleLoadMoreRepos}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Cargando..." : "Ver más"}
                </Button>
                <Button
                  variant="default"
                  onClick={handleShowAllRepos}
                  disabled={isLoadingMore || showAllRepos}
                >
                  Mostrar todos
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
