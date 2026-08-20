import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { api, formatMoney, statusLabel } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cacheProducts, getOrders } from "@/lib/local-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MatchGuard — Escrow-protected social shopping" },
      {
        name: "description",
        content:
          "Buyer home for MatchGuard: AI-matched social listings, protected escrow balance and QR handover in one mobile app.",
      },
      { property: "og:title", content: "MatchGuard — Escrow-protected social shopping" },
      {
        property: "og:description",
        content: "AI-matched social listings with payments held safely until handover.",
      },
    ],
  }),
  component: CustomerHome,
});

function CustomerHome() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && user?.role === "SELLER") void navigate({ to: "/seller" });
  }, [ready, user, navigate]);

  const ordersQuery = useQuery({
    queryKey: ["local-orders"],
    queryFn: async () => getOrders(),
    enabled: ready && !!user,
  });

  const suggestions = useQuery({
    queryKey: ["suggested"],
    queryFn: async () => {
      const results = await api.searchProducts("popular verified listings");
      cacheProducts(results);
      return results;
    },
    enabled: ready && user?.role === "CUSTOMER",
  });

  const active = (ordersQuery.data ?? []).find(
    (o) => o.status === "PENDING_VERIFICATION" || o.status === "ESCROW_LOCKED",
  );

  return (
    <AppShell requireRole="CUSTOMER">
      <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
        Good day,
      </p>
      <h1 className="text-3xl font-bold tracking-tight">{user?.name ?? "there"}</h1>

      <section className="bg-escrow mt-5 rounded-3xl p-5 text-primary-foreground shadow-card">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/16 px-2.5 py-1.5 text-xs font-semibold">
          <ShieldCheck className="size-3.5" /> Payment protected
        </span>
        <strong className="mt-4 block text-4xl font-bold tracking-tight">
          {formatMoney(active?.amount ?? 0)}
        </strong>
        <p className="mt-1.5 text-sm leading-relaxed text-primary-foreground/85">
          {active
            ? `${active.productTitle} — ${statusLabel[active.status]}.`
            : "No funds in escrow yet. Find a listing and pay safely."}
        </p>
        <Link
          to={active ? "/orders" : "/search"}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-card px-4 text-sm font-bold text-foreground"
        >
          {active ? "View order" : "Start searching"} <ArrowRight className="size-4" />
        </Link>
      </section>

      <Link
        to="/search"
        className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
      >
        <span className="flex size-10.5 items-center justify-center rounded-full bg-accent text-brand-teal">
          <Search className="size-5" />
        </span>
        <span>
          <strong className="block text-sm">Search with AI</strong>
          <span className="mt-1 block text-xs leading-snug text-muted-foreground">
            Describe what you need. Guardian ranks verified social posts.
          </span>
        </span>
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold tracking-tight">Suggested for you</h2>
        <Link to="/search" className="text-xs font-bold text-brand-teal">
          See all
        </Link>
      </div>

      <div className="mt-2 space-y-2.5">
        {suggestions.isPending && <SkeletonList />}
        {suggestions.isError && (
          <p className="rounded-2xl bg-warning px-4 py-3 text-xs text-warning-foreground">
            Couldn't load suggestions right now. Pull up search to try a query.
          </p>
        )}
        {suggestions.data?.length === 0 && (
          <p className="rounded-2xl border border-border bg-card px-4 py-6 text-center text-xs text-muted-foreground">
            No listings published yet. Check back soon.
          </p>
        )}
        {suggestions.data?.slice(0, 4).map((product) => (
          <ListingCard key={product.productId} product={product} />
        ))}
      </div>
    </AppShell>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-2.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}
