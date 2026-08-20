import { createFileRoute } from "@tanstack/react-router";

// The MatchGuard Spring backend does not send CORS headers for authenticated
// requests, so browser calls are proxied through this same-origin route.
// It only forwards the caller's own Authorization header — no credentials are
// stored or added here, and the backend still enforces its own auth rules.
const UPSTREAM = "https://www.allkur.uk/api";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "authorization,content-type",
};

async function proxy({ request, params }: { request: Request; params: { _splat?: string } }) {
  const url = new URL(request.url);
  const path = params._splat ?? "";
  const target = `${UPSTREAM}/${path}${url.search}`;

  const headers = new Headers();
  const auth = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");
  if (auth) headers.set("authorization", auth);
  if (contentType) headers.set("content-type", contentType);
  headers.set("accept", "application/json, text/plain, */*");

  const method = request.method;
  const body: ArrayBuffer | null = method === "GET" || method === "HEAD" ? null : await request.arrayBuffer();

  const upstream = await fetch(target, { method, headers, body });
  const payload = await upstream.arrayBuffer();

  return new Response(payload, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
      ...CORS,
    },
  });
}

export const Route = createFileRoute("/api/public/mg/$")({
  server: {
    handlers: {
      GET: proxy,
      POST: proxy,
      PUT: proxy,
      PATCH: proxy,
      DELETE: proxy,
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
    },
  },
});
