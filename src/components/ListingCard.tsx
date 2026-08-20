import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Sparkles, TrendingUp } from "lucide-react";
import type { Listing } from "@/lib/matchguard-data";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      to="/listing/$slug"
      params={{ slug: listing.slug }}
      className="shadow-card block rounded-2xl bg-card p-4 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
            {listing.source} <span className="px-1">·</span> {listing.posted}
          </p>
          <h3 className="mt-1 font-semibold leading-snug text-foreground">{listing.title}</h3>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-bold">{listing.price}</p>
          {listing.sponsored && (
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-warning/25 px-2 py-0.5 text-[10px] font-medium text-warning-foreground">
              <Sparkles className="size-3" /> Sponsored
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{listing.verdict}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 font-semibold text-primary">
          <TrendingUp className="size-3.5" /> {listing.match}% match
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
          <BadgeCheck className="size-3.5 text-primary" /> {listing.seller} · Trust {listing.trust}
        </span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <MapPin className="size-3.5" /> {listing.city}
        </span>
      </div>
    </Link>
  );
}
