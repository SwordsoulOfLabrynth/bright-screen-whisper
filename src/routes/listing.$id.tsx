import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api, formatMoney, trustBand, type ProductRecommendationDto } from "@/lib/api";
import { TrustMeter } from "@/components/TrustBadge";
import { cacheProducts, getCachedProduct } from "@/lib/local-store";

export const Route = createFileRoute("/listing/$id")({
  head: () => ({
    meta: [
      { title: "Listing review — MatchGuard" },
      {
        name: "description",
        content:
          "See fit score, Guardian trust analysis and evidence for a social marketplace listing before paying into escrow.",
      },
      { property: "og:title", content: "Listing review — MatchGuard" },
      {
        property: "og:description",
        content: "Fit score, trust analysis and escrow checkout for a social listing.",
      },
    ],
  }),
  component: ListingDetail,
});

function ListingDetail() {
  const { id } = Route.useParams();
  const productId = Number(id);

  const query = useQuery({
    queryKey: ["listing", productId],
    queryFn: async (): Promise<ProductRecommendationDto | null> => {
      const cached = getCachedProduct(productId);
      if (cached) return cached;
      const results = await api.searchProducts("all listings");
      cacheProducts(results);
      return results.find((p) => p.productId === productId) ?? null;
    },
  });

  const product = query.data;

  return (
    <AppShell requireRole="CUSTOMER" back="/search">
      {query.isPending && <div className="h-64 animate-pulse rounded-3xl bg-muted" />}
      {!query.isPending && !product && (
        <p className="rounded-2xl border border-border bg-card px-4 py-8 text-center text-xs text-muted-foreground">
          This listing is no longer available. Try a new search.
        </p>
      )}

      {product && (
        <>
          <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
            {product.socialPostUrl?.includes("tiktok") ? "TikTok post" : "Facebook post"}
          </p>
          <h1 className="mt-1 text-[27px] leading-tight font-bold tracking-tight">
            {product.title}
          </h1>
          <p className="mt-2 text-2xl font-bold">{formatMoney(product.price)}</p>

          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-success p-3.5">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-success-foreground" />
            <div>
              <strong className="text-sm text-success-foreground">
                {product.fitScore}% fit for your search
              </strong>
              <p className="mt-1 text-xs leading-snug text-success-foreground/85">
                {product.compatibilityInsight ||
                  product.explanation ||
                  "Guardian matched this post to your requirements."}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <TrustMeter score={product.trustScore} note={product.explanation} />
          </div>

          <div className="mt-3 rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Seller description</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-4 grid grid-cols-2 border-t border-border">
              <Fact label="Trust score" value={`${product.trustScore}/100 · ${trustBand(product.trustScore).label}`} />
              <Fact
                label="Guardian check"
                value={product.isVerifiedSafe ? "Verified safe" : "Needs caution"}
              />
              <Fact label="Escrow" value="Held until QR scan" />
              <Fact label="Payment" value="Bank / wallet receipt" />
            </div>

            {product.socialPostUrl && (
              <a
                href={product.socialPostUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal"
              >
                View original post <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>

          <div
            className={
              product.isVerifiedSafe
                ? "flex gap-2.5 rounded-2xl bg-accent p-3.5 text-xs leading-snug text-accent-foreground"
                : "flex gap-2.5 rounded-2xl bg-warning p-3.5 text-xs leading-snug text-warning-foreground"
            }
          >
            {product.isVerifiedSafe ? (
              <ShieldCheck className="size-4 shrink-0" />
            ) : (
              <ShieldAlert className="size-4 shrink-0" />
            )}
            <span>Guardian scam analysis: {product.explanation ?? "Standard escrow protection applies — never pay outside MatchGuard."}</span>
          </div>

          <Link
            to="/checkout/$id"
            params={{ id: String(product.productId) }}
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground"
          >
            Pay safely with escrow <ArrowRight className="size-4" />
          </Link>
        </>
      )}
    </AppShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border py-2.5 odd:pr-3 even:border-l even:border-l-border even:pl-3">
      <span className="block text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <strong className="mt-0.5 block text-xs">{value}</strong>
    </div>
  );
}
