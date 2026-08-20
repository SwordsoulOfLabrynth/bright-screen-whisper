import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, BadgeCheck, Check, MapPin, ShieldCheck, Sparkles, TrendingUp, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { listings } from "@/lib/matchguard-data";

export const Route = createFileRoute("/listing/$slug")({
  loader: ({ params }) => {
    const listing = listings.find((l) => l.slug === params.slug);
    if (!listing) throw notFound();
    return listing;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Listing"} — MatchGuard` },
      { name: "description", content: loaderData?.verdict ?? "Escrow-protected listing on MatchGuard." },
      { property: "og:title", content: `${loaderData?.title ?? "Listing"} — MatchGuard` },
      { property: "og:description", content: loaderData?.verdict ?? "Escrow-protected listing on MatchGuard." },
    ],
  }),
  component: ListingPage,
});

function ListingPage() {
  const listing = Route.useLoaderData();

  return (
    <AppShell>
      <article className="shadow-card rounded-2xl bg-card p-5">
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
          {listing.source} POST <span className="px-1">·</span> {listing.posted}
        </p>
        <h1 className="mt-1 text-xl font-bold leading-snug">{listing.title}</h1>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-3xl font-bold">{listing.price}</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-primary">
            <TrendingUp className="size-3.5" /> {listing.match}% match
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{listing.description}</p>
        <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5" /> {listing.meta}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {listing.tags.map((t) => (
            <span key={t} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
              {t}
            </span>
          ))}
        </div>
      </article>

      <section className="shadow-card mt-4 rounded-2xl bg-card p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 font-semibold">
            <Sparkles className="size-4 text-primary" /> AI compatibility review
          </p>
          <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
            {listing.reviewBadge}
          </span>
        </div>
        <p className="mt-3 font-semibold">{listing.verdict}</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {listing.pros.map((p) => (
            <li key={p} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-success" /> {p}
            </li>
          ))}
          {listing.cons.map((c) => (
            <li key={c} className="flex gap-2">
              <X className="mt-0.5 size-4 shrink-0 text-destructive" /> {c}
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-secondary p-3 text-sm text-muted-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" /> {listing.note}
        </p>
      </section>

      <section className="shadow-card mt-4 rounded-2xl bg-card p-5">
        <p className="font-semibold">Specs pulled from the post</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {listing.specs.map((s) => (
            <div key={s.label} className="rounded-xl bg-secondary px-3 py-2">
              <p className="text-[10px] tracking-wide text-muted-foreground">{s.label}</p>
              <p className="text-sm font-medium">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shadow-card mt-4 flex items-center justify-between rounded-2xl bg-card p-5">
        <div>
          <p className="inline-flex items-center gap-1.5 font-semibold">
            {listing.seller} <BadgeCheck className="size-4 text-primary" />
          </p>
          <p className="text-sm text-muted-foreground">
            @{listing.seller.toLowerCase().replace(/[^a-z]/g, "")} · 412 escrow deals
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{listing.trust}</p>
          <p className="text-[10px] tracking-wide text-muted-foreground">TRUSTSCORE</p>
        </div>
      </section>

      <button className="bg-escrow shadow-card mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-primary-foreground">
        <ShieldCheck className="size-4" /> Pay with TrustGuard escrow
      </button>
      <Link
        to="/trustguard"
        className="mt-2 block rounded-2xl border border-border bg-card py-3 text-center text-sm font-medium"
      >
        How does escrow work?
      </Link>
    </AppShell>
  );
}
