"use client";

import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { GithubIcon } from "@icons/github";
import { useUser } from "@clerk/nextjs";
import { useIntegrationActions } from "@hooks/use-integration-actions";
import { CheckCircle2, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StatCard } from "@/app/components/shared/stat-card";
import { LanguageDot } from "@/app/components/shared/language-dot";

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: "public" | "private" | null;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  private: boolean;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

export default function GitHubIntegrationPage() {
  const router = useRouter();
  const { connect, disconnect } = useIntegrationActions();
  const { user, isLoaded: userLoaded } = useUser();
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);
  const [githubEmail, setGithubEmail] = useState<string | null>(null);
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

  const publicReposCount = useMemo(() => {
    return githubUser?.public_repos ?? 0;
  }, [githubUser?.public_repos]);

  const mostUsedLanguage = useMemo(() => {
    const counts = new Map<string, number>();
    for (const repo of repos) {
      const lang = repo.language;
      if (!lang) continue;
      counts.set(lang, (counts.get(lang) ?? 0) + 1);
    }

    let bestLang: string | null = null;
    let bestCount = 0;

    for (const [lang, count] of counts.entries()) {
      if (count > bestCount) {
        bestLang = lang;
        bestCount = count;
      }
    }

    return bestLang;
  }, [repos]);

  const lastPush = useMemo(() => {
    const newest = repos.reduce<Date | null>((acc, repo) => {
      const d = new Date(repo.updated_at);
      if (Number.isNaN(d.getTime())) return acc;
      if (!acc || d > acc) return d;
      return acc;
    }, null);

    if (!newest) {
      return { title: "-", subtitle: "" };
    }

    const now = new Date();
    const isToday =
      newest.getFullYear() === now.getFullYear() &&
      newest.getMonth() === now.getMonth() &&
      newest.getDate() === now.getDate();

    const subtitle = newest.toLocaleDateString("es-ES");
    const title = isToday ? "Hoy" : subtitle;

    return { title, subtitle };
  }, [repos]);

  const reposPerPage = 5;

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchJsonWithRetry = useCallback(
    async <T,>(
      input: RequestInfo | URL,
      init?: RequestInit,
      options?: {
        retries?: number;
        initialDelayMs?: number;
      },
    ): Promise<T> => {
      const retries = options?.retries ?? 4;
      const initialDelayMs = options?.initialDelayMs ?? 250;

      let lastError: unknown;

      for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
          const res = await fetch(input, init);
          if (res.ok) return (await res.json()) as T;

          const body = await res.text();
          const err = new Error("Request failed");
          (err as Error & { cause?: unknown }).cause = {
            status: res.status,
            body,
          };

          const retriable =
            res.status === 401 || res.status === 403 || res.status >= 500;
          if (!retriable || attempt === retries) throw err;

          await sleep(initialDelayMs * 2 ** attempt);
        } catch (e) {
          lastError = e;
          if (attempt === retries) break;
          await sleep(initialDelayMs * 2 ** attempt);
        }
      }

      throw lastError instanceof Error
        ? lastError
        : new Error("No se pudo completar la solicitud.");
    },
    [],
  );

  const fetchGitHubUser = useCallback(async () => {
    try {
      return await fetchJsonWithRetry<GitHubUser>(
        "/api/github/user",
        undefined,
        {
          retries: 4,
          initialDelayMs: 250,
        },
      );
    } catch {
      throw new Error("No se pudo obtener el perfil de GitHub.");
    }
  }, [fetchJsonWithRetry]);

  const fetchGitHubReposPage = useCallback(
    async (page: number) => {
      try {
        const ghRepos = await fetchJsonWithRetry<GitHubRepo[]>(
          `/api/github/repos?per_page=${reposPerPage}&page=${page}`,
          undefined,
          {
            retries: 4,
            initialDelayMs: 250,
          },
        );
        return Array.isArray(ghRepos) ? ghRepos : [];
      } catch {
        throw new Error("No se pudieron obtener los repositorios de GitHub.");
      }
    },
    [fetchJsonWithRetry, reposPerPage],
  );

  const fetchGitHubEmails = useCallback(async () => {
    try {
      const emails = await fetchJsonWithRetry<GitHubEmail[]>(
        "/api/github/emails",
        undefined,
        {
          retries: 2,
          initialDelayMs: 250,
        },
      );
      return Array.isArray(emails) ? emails : [];
    } catch {
      return [];
    }
  }, [fetchJsonWithRetry]);

  useEffect(() => {
    async function fetchGitHubData() {
      if (!userLoaded || !isConnected) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

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

        const [ghUser, ghReposFirstPage, ghEmails] = await Promise.all([
          fetchGitHubUser(),
          fetchGitHubReposPage(1),
          fetchGitHubEmails(),
        ]);

        setGithubUser(ghUser);
        setRepos(ghReposFirstPage);
        setHasMoreRepos(ghReposFirstPage.length === reposPerPage);

        const primaryVerified = ghEmails.find((e) => e.primary && e.verified);
        const anyVerified = ghEmails.find((e) => e.verified);
        setGithubEmail((primaryVerified ?? anyVerified)?.email ?? null);
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

    if (isConnected) {
      setError(null);
      setLoading(true);
    }

    fetchGitHubData();
  }, [
    fetchGitHubReposPage,
    fetchGitHubEmails,
    fetchGitHubUser,
    githubAccount?.username,
    isConnected,
    userLoaded,
  ]);

  const handleDisconnect = async () => {
    try {
      if (!githubAccount) {
        throw new Error("No hay una cuenta de GitHub conectada.");
      }

      const result = await disconnect("github");
      if (result.cancelled) return;

      router.push("/integrations");
      router.refresh();
    } catch (err: unknown) {
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

      if (err instanceof Error) {
        setError({
          message: err.message,
          details: (err as Error & { cause?: unknown }).cause,
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

      const nextRepos = await fetchGitHubReposPage(nextPage);

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
        const nextRepos = await fetchGitHubReposPage(nextPage);

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

      const [ghUser, ghReposFirstPage, ghEmails] = await Promise.all([
        fetchGitHubUser(),
        fetchGitHubReposPage(1),
        fetchGitHubEmails(),
      ]);

      setGithubUser(ghUser);
      setRepos(ghReposFirstPage);
      setHasMoreRepos(ghReposFirstPage.length === reposPerPage);

      const primaryVerified = ghEmails.find((e) => e.primary && e.verified);
      const anyVerified = ghEmails.find((e) => e.verified);
      setGithubEmail((primaryVerified ?? anyVerified)?.email ?? null);
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
            <Button onClick={() => connect()}>Conectar GitHub</Button>
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

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => connect()}
            >
              Reconectar GitHub
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
            <p className="text-muted-foreground">Administra tus repositorios</p>
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
              <div className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sincronizando...
              </div>
            ) : (
              <div className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar datos
              </div>
            )}
          </Button>
          <Button variant="outline" onClick={handleDisconnect}>
            Desconectar
          </Button>
        </div>
      </div>

      {githubUser && (
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Image
                  src={githubUser.avatar_url}
                  alt={githubUser.login}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-lg">
                    {githubUser.name ?? githubUser.login}
                  </h3>

                  {githubEmail && (
                    <p className="text-muted-foreground text-sm">
                      {githubEmail}
                    </p>
                  )}

                  {githubUser.bio && (
                    <p className="text-muted-foreground text-sm">
                      {githubUser.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <StatCard
                label="Repos públicos"
                value={publicReposCount}
                subtitle="en tu cuenta"
              />

              <StatCard
                label="Lenguaje principal"
                value={mostUsedLanguage ?? "-"}
                subtitle="más usado"
              />

              <StatCard
                label="Último push"
                value={lastPush.title}
                subtitle={lastPush.subtitle}
              />
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
                  <p className="font-normal text-base text-primary">{repo.full_name}</p>
                  {repo.description && (
                    <p className="text-muted-foreground text-xs">
                      {repo.description}
                    </p>
                  )}
                  {repo.language && (
                    <p className="text-muted-foreground text-sm">
                      {repo.language && <LanguageDot language={repo.language} />}
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
