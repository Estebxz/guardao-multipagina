import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(120, "60 s"),
  analytics: true,
  prefix: "guardao:rl",
});

function getClientIp(req: Request) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isSameOrigin(req: Request) {
  const url = new URL(req.url);
  const origin = req.headers.get("origin");

  if (origin) {
    return origin === url.origin;
  }

  const secFetchSite = req.headers.get("sec-fetch-site");
  if (secFetchSite) {
    return secFetchSite === "same-origin" || secFetchSite === "same-site";
  }

  return true;
}

async function rateLimit(req: Request) {
  const url = new URL(req.url);
  const ip = getClientIp(req);
  const key = `${ip}:${url.pathname}`;
  return ratelimit.limit(key);
}

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const isApi = url.pathname.startsWith("/api/");

  if (isApi) {
    const rl = await rateLimit(req);
    if (!rl.success) {
      return NextResponse.json(
        { message: "Rate limit excedido" },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(0, Math.ceil((rl.reset - Date.now()) / 1000)),
            ),
          },
        },
      );
    }
  }

  const method = req.method.toUpperCase();
  const isStateChanging =
    method !== "GET" && method !== "HEAD" && method !== "OPTIONS";

  if (isStateChanging) {
    if (!isSameOrigin(req)) {
      return NextResponse.json(
        { message: "CSRF: origen inválido" },
        { status: 403 },
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
