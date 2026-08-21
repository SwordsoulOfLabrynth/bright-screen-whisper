import { createFileRoute } from "@tanstack/react-router";

// Same-origin image proxy for receipt screenshots stored on R2.
// Only the MatchGuard receipts bucket is allowed, and only GET is served.
const ALLOWED_HOSTS = new Set(["pub-11021a51faf24764b674a6afdc69061c.r2.dev"]);

export const Route = createFileRoute("/api/public/img")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const raw = new URL(request.url).searchParams.get("url");
        if (!raw) return new Response("Missing url", { status: 400 });

        let target: URL;
        try {
          target = new URL(raw);
        } catch {
          return new Response("Invalid url", { status: 400 });
        }
        if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
          return new Response("Forbidden host", { status: 403 });
        }

        const upstream = await fetch(target.toString(), {
          headers: { accept: "image/*" },
        });
        if (!upstream.ok) {
          return new Response("Upstream error", { status: upstream.status });
        }

        return new Response(upstream.body, {
          status: 200,
          headers: {
            "content-type": upstream.headers.get("content-type") ?? "image/jpeg",
            "cache-control": "public, max-age=3600",
            "access-control-allow-origin": "*",
          },
        });
      },
    },
  },
});
