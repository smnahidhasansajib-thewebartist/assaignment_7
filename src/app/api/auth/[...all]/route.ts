import { NextResponse } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";
import { auth, authIsConfigured } from "@/lib/auth";

const unavailable = (request: Request) => {
  if (new URL(request.url).pathname.endsWith("/get-session")) {
    return NextResponse.json(null);
  }

  return NextResponse.json(
    {
      message:
        "Authentication is not configured. Set DATABASE_URL and BETTER_AUTH_SECRET to enable sign-in.",
    },
    { status: 503 },
  );
};

const handlers = authIsConfigured && auth ? toNextJsHandler(auth) : null;

export const GET = handlers?.GET ?? unavailable;
export const POST = handlers?.POST ?? unavailable;
