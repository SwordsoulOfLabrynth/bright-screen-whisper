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

const STOP_WORDS = new Set([
  "a","an","the","for","with","and","or","under","over","about","of","in","on","to","my","me","i",
  "need","want","looking","best","good","cheap","please","find","buy",
]);

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9$.,\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function budgetOf(query: string) {
  const match = query.replace(/,/g, "").match(/(?:under|below|max|less than)?\s*\$?\s*(\d{2,7})/i);
  return match ? Number(match[1]) : null;
}

/** The backend returns the whole catalogue for any query, so ranking happens here. */
function rankResults(items: ProductRecommendationDto[], query: string) {
  const tokens = tokenize(query);
  const budget = /under|below|max|less than|\$/i.test(query) ? budgetOf(query) : null;

  const scored = items.map((item) => {
    const haystack = `${item.title} ${item.description}`.toLowerCase();
    const hits = tokens.filter((t) => haystack.includes(t)).length;
    const priceOk = budget == null || item.price <= budget;
    const fit = tokens.length
      ? Math.round((hits / tokens.length) * 100)
      : (item.fitScore ?? 50);
    return {
      ...item,
      fitScore: Math.max(5, Math.min(99, fit + (priceOk ? 0 : -40) + (item.isVerifiedSafe ? 5 : 0))),
      compatibilityInsight:
        hits > 0
          ? `Matches ${hits} of ${tokens.length} things you asked for${priceOk ? "" : " but is above your budget"}.`
          : "Loosely related to your search.",
      _hits: hits,
      _priceOk: priceOk,
    };
  });

  // Only genuinely relevant listings are shown — never the whole catalogue.
  const strict = scored.filter((s) => s._hits > 0 && s._priceOk);
  const loose = scored.filter((s) => s._hits > 0);
  const list = (strict.length ? strict : loose).sort((a, b) => b.fitScore - a.fitScore);
  return list.map(({ _hits, _priceOk, ...rest }) => rest) as ProductRecommendationDto[];
}

function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductRecommendationDto[] | null>(null);

  const search = useMutation({
    mutationFn: async (q: string) => rankResults(await api.searchProducts(q), q),
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
