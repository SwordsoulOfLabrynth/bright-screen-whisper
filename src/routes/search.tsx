import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { listings, suggestions } from "@/lib/matchguard-data";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "AI search — Match Facebook & TikTok listings | MatchGuard" },
      {
        name: "description",
        content:
          "Describe what you need in plain words and MatchGuard's AI search matches live Facebook and TikTok shop posts against your requirements.",
      },
      { property: "og:title", content: "AI search — MatchGuard" },
      {
        property: "og:description",
        content: "Plain-language search across social shop posts, with escrow-protected checkout.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const results = searched ? listings : listings.slice(0, 2);

  return (
    <AppShell>
      <h1 className="text-xl font-bold tracking-tight">AI search</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Say it like you'd say it to a friend — budget, must-haves, deal breakers.
      </p>

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

      <div className="mt-3 flex items-start gap-3 rounded-2xl border border-border bg-card p-3">
        <span className="bg-escrow flex size-9 shrink-0 items-center justify-center rounded-full text-primary-foreground">
          <Bot className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">
            Guardian here — search with AI, not keywords
            <Sparkles className="ml-1 inline size-3.5 text-primary" />
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Tap a starter below and I'll rank real social posts by how well they fit you.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  setSearched(true);
                }}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
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
