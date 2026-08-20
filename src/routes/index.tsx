import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, ChevronRight, QrCode, Search, ShieldCheck, Sparkles, Store } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/matchguard-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MatchGuard — Escrow-protected social shopping" },
      {
        name: "description",
        content:
          "Your MatchGuard home: AI-powered search across Facebook and TikTok shop posts, escrow-protected payments, and QR handover.",
      },
      { property: "og:title", content: "MatchGuard — Escrow-protected social shopping" },
      {
        property: "og:description",
        content:
          "AI-matched Facebook and TikTok listings with payments held safely until handover is confirmed.",
      },
    ],
  }),
  component: Home,
});

const quickActions = [
  { to: "/search", label: "AI search", icon: Search },
  { to: "/trustguard", label: "Escrow", icon: ShieldCheck },
  { to: "/seller", label: "My shop", icon: Store },
  { to: "/pricing", label: "Plans", icon: Sparkles },
] as const;

function Home() {
  return (
    <AppShell>
      <p className="text-sm text-muted-foreground">Good day,</p>
      <h1 className="text-2xl font-bold leading-tight">Aung Ko</h1>

      <section className="bg-escrow shadow-card mt-4 rounded-2xl p-5 text-primary-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium">
          <ShieldCheck className="size-3.5" /> In escrow now
        </span>
        <p className="mt-3 text-3xl font-bold">$1,180</p>
        <p className="mt-1 text-sm text-primary-foreground/80">
          1 order awaiting QR handover with NightForge Builds.
        </p>
        <Link
          to="/trustguard"
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-sm font-semibold"
        >
          <QrCode className="size-4" /> View handover
        </Link>
      </section>

      <Link
        to="/search"
        className="shadow-card mt-4 flex items-start gap-3 rounded-2xl bg-card p-4"
      >
        <span className="bg-escrow flex size-10 shrink-0 items-center justify-center rounded-full text-primary-foreground">
          <Bot className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            You can search with AI-powered search
            <Sparkles className="ml-1 inline size-3.5 text-primary" />
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Describe what you need in plain words — Guardian ranks real social posts for you.
          </p>
        </div>
        <ChevronRight className="mt-2 size-4 shrink-0 text-muted-foreground" />
      </Link>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {quickActions.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card px-1 py-3 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon className="size-5 text-primary" />
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-semibold">Trending #TrustGuard listings</h2>
        <Link to="/search" className="text-xs font-medium text-primary">
          See all
        </Link>
      </div>

      <div className="mt-3 space-y-3">
        {listings.slice(0, 3).map((listing) => (
          <ListingCard key={listing.slug} listing={listing} />
        ))}
      </div>
    </AppShell>
  );
}
