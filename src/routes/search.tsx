import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { ListingCard } from "@/components/ListingCard";
import { api, type ProductRecommendationDto } from "@/lib/api";
import { cacheProducts } from "@/lib/local-store";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "AI search — MatchGuard" },
      {
        name: "description",
        content:
          "Describe what you need in plain words and MatchGuard's Guardian AI ranks verified social listings by fit and trust score.",
      },
      { property: "og:title", content: "AI search — MatchGuard" },
      {
        property: "og:description",
        content: "Natural-language search across verified social marketplace posts.",
      },
    ],
  }),
  component: SearchScreen,
});

const chips = [
  "1440p gaming PC under $1,300",
  "Light laptop for design school",
  "Camera for indoor interviews",
];

function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductRecommendationDto[] | null>(null);

  const search = useMutation({
    mutationFn: (q: string) => api.searchProducts(q),
    onSuccess: (data) => {
      cacheProducts(data);
      setResults(data);
    },
  });

  function run(event: FormEvent) {
    event.preventDefault();
    if (query.trim()) search.mutate(query.trim());
  }

  return (
    <AppShell requireRole="CUSTOMER">
      <h1 className="text-[27px] font-bold tracking-tight">What are you looking for?</h1>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        Guardian reads every social post and scores how well it fits your ask.
      </p>

      <form
        onSubmit={run}
        className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-card p-1.5 pl-3.5 shadow-card"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Gaming PC under $1,300 with upgrade room"
          className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
        />
        <button
          type="submit"
          className="grid size-9.5 place-items-center rounded-xl bg-brand-teal text-primary-foreground"
          aria-label="Search"
        >
          <Search className="size-4" />
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              setQuery(chip);
              search.mutate(chip);
            }}
            className="rounded-full border border-border bg-card px-2.5 py-1.5 text-[11px] font-semibold text-secondary-foreground"
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2.5">
        {search.isPending && (
          <div className="flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-xs font-semibold text-accent-foreground">
            <Sparkles className="size-4 animate-pulse" /> Guardian is ranking listings…
          </div>
        )}
        {search.isError && (
          <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-xs text-destructive">
            {(search.error as Error).message}
          </p>
        )}
        {results?.length === 0 && (
          <p className="rounded-2xl border border-border bg-card px-4 py-8 text-center text-xs text-muted-foreground">
            No matching posts yet. Try describing your budget and use case.
          </p>
        )}
        {results?.map((product) => <ListingCard key={product.productId} product={product} />)}
      </div>
    </AppShell>
  );
}
