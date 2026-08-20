import { Link } from "@tanstack/react-router";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { formatMoney, type ProductRecommendationDto } from "@/lib/api";

export function ListingCard({ product }: { product: ProductRecommendationDto }) {
  return (
    <Link
      to="/listing/$id"
      params={{ id: String(product.productId) }}
      className="block rounded-2xl border border-border bg-card p-4"
    >
      <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {product.socialPostUrl?.includes("tiktok") ? "TikTok" : "Facebook"} · Social post
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <h3 className="text-[15px] leading-tight font-semibold tracking-tight">{product.title}</h3>
        <span className="text-lg font-bold whitespace-nowrap">{formatMoney(product.price)}</span>
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {product.compatibilityInsight || product.description}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
          {product.isVerifiedSafe ? (
            <ShieldCheck className="size-3.5 text-brand-teal" />
          ) : (
            <ShieldAlert className="size-3.5 text-destructive" />
          )}
          Trust {product.trustScore}
        </span>
        <span className="rounded-full bg-success px-2 py-1 text-[11px] font-bold text-success-foreground">
          {product.fitScore}% match
        </span>
      </div>
    </Link>
  );
}
