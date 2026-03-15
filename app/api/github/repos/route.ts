import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

async function getGitHubAccessToken(userId: string) {
  const client = typeof clerkClient === "function" ? await clerkClient() : clerkClient;

  const tokens = await client.users.getUserOauthAccessToken(userId, "github");
  const token = tokens?.data?.[0]?.token;

  if (!token) {
    throw new Error(
      "No se encontró un access token de GitHub. Re-conecta tu cuenta de GitHub.",
    );
  }

  return token;
}

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);

    const per_page = Math.min(
      Math.max(Number(searchParams.get("per_page") ?? 20), 1),
      100,
    );
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);

    const accessToken = await getGitHubAccessToken(userId);

    // Using /user/repos includes private repos the user has access to.
    const res = await fetch(
      `https://api.github.com/user/repos?per_page=${per_page}&sort=updated&page=${page}&visibility=all&affiliation=owner,collaborator,organization_member`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          message: "No se pudieron obtener los repositorios de GitHub.",
          details: { status: res.status, body: text },
        },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ message }, { status: 500 });
  }
}
