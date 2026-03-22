import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

async function getDiscordAccessToken(userId: string) {
  const client =
    typeof clerkClient === "function" ? await clerkClient() : clerkClient;

  const tokens = await client.users.getUserOauthAccessToken(userId, "discord");
  const token = tokens?.data?.[0]?.token;
  const tokenType = (
    tokens?.data?.[0] as unknown as { tokenType?: string } | undefined
  )?.tokenType;

  if (!token) {
    throw new Error(
      "No se encontró un access token de Discord. Re-conecta tu cuenta de Discord.",
    );
  }

  return { token, tokenType };
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  try {
    const { token, tokenType } = await getDiscordAccessToken(userId);
    const authorization = tokenType
      ? `${tokenType} ${token}`
      : `Bearer ${token}`;

    const res = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: authorization,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          message: "No se pudo obtener el perfil de Discord.",
          details: { status: res.status, body: text },
        },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ message }, { status: 500 });
  }
}
