import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { listings, suggestions } from "@/lib/matchguard-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MatchGuard — Escrow-protected social shopping search" },
      {
        name: "description",
        content:
          "Describe what you need and MatchGuard matches real Facebook and TikTok shop posts, then locks payment in escrow until handover is verified.",
      },
      { property: "og:title", content: "MatchGuard — Escrow-protected social shopping search" },
      {
        property: "og:description",
        content:
          "AI-matched Facebook and TikTok listings with payments held safely until handover is confirmed.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const results = searched ? listings : listings.filter((l) => !l.sponsored || l.match > 90).slice(0, 2);

  return (
    <AppShell>
      <section className="bg-escrow shadow-card rounded-2xl p-5 text-primary-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium">
          <ShieldCheck className="size-3.5" /> Escrow-protected discovery
        </span>
        <h1 className="mt-3 text-2xl font-bold leading-tight">
          Tell us what you need.
          <br />
          We match it, then guard the money.
        </h1>
        <p className="mt-2 text-sm text-primary-foreground/80">
          MatchGuard reads real Facebook and TikTok shop posts, checks them against your
          requirements, and locks your payment until handover is verified.
        </p>
      </section>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(true);
        }}
        className="shadow-card mt-4 flex items-center gap-2 rounded-2xl bg-card p-2 pl-4"
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. quiet 1440p gaming PC under $1,300"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="bg-escrow rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Match
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s);
              setSearched(true);
            }}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      {searched ? (
        <div className="mt-6 flex items-center justify-between">
          <h2 className="font-semibold">{listings.length} matches found</h2>
          <span className="text-xs text-muted-foreground">1 AI token used</span>
        </div>
      ) : (
        <h2 className="mt-6 font-semibold">Trending #TrustGuard listings</h2>
      )}

      <div className="mt-3 space-y-3">
        {results.map((listing) => (
          <ListingCard key={listing.slug} listing={listing} />
        ))}
      </div>
    </AppShell>
  );
}
