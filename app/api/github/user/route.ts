import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

async function getGitHubAccessToken(userId: string) {
  const client =
    typeof clerkClient === "function" ? await clerkClient() : clerkClient;

  const tokens = await client.users.getUserOauthAccessToken(userId, "github");
  const token = tokens?.data?.[0]?.token;

  if (!token) {
    throw new Error(
      "No se encontró un access token de GitHub. Re-conecta tu cuenta de GitHub.",
    );
  }

  return token;
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  try {
    const accessToken = await getGitHubAccessToken(userId);

    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          message: "No se pudo obtener el perfil de GitHub.",
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
