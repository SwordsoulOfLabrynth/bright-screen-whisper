import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Plans and AI tokens — MatchGuard" },
      {
        name: "description",
        content:
          "Free, Plus and Pro plans for MatchGuard: AI match tokens, escrow protection on every order and instant payouts for sellers.",
      },
      { property: "og:title", content: "Plans and AI tokens — MatchGuard" },
      {
        property: "og:description",
        content: "Pick the match volume you need. Escrow protection is included on every plan.",
      },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Try matching on a few listings a week.",
    features: ["20 AI match tokens / month", "Escrow on every order", "Trustscore visibility"],
    cta: "Current plan",
  },
  {
    name: "Plus",
    price: "$4",
    cadence: "per month",
    blurb: "For buyers hunting deals across both platforms.",
    features: [
      "300 AI match tokens / month",
      "Deep compatibility reviews",
      "Price history vs 30-day median",
      "Priority match queue",
    ],
    cta: "Your plan",
    highlight: true,
  },
  {
    name: "Pro seller",
    price: "$12",
    cadence: "per month",
    blurb: "For shops running daily escrow handovers.",
    features: [
      "Unlimited page auto-sync",
      "Instant payouts (1% fee)",
      "Bulk QR handover",
      "Shop analytics dashboard",
    ],
    cta: "Upgrade to Pro",
  },
];

function PricingPage() {
  return (
    <AppShell>
      <section className="bg-escrow shadow-card rounded-2xl p-5 text-primary-foreground">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium">
          <Sparkles className="size-3.5" /> Tokens, not subscriptions to trust
        </span>
        <h1 className="mt-3 text-2xl font-bold leading-tight">
          Escrow is always free. You only pay for matching.
        </h1>
        <p className="mt-2 text-sm text-primary-foreground/80">
          Every order is protected by TrustGuard at 2.5%. Plans only change how much AI matching you
          get each month.
        </p>
      </section>

      <div className="mt-4 space-y-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "shadow-card rounded-2xl bg-card p-5",
              plan.highlight && "ring-2 ring-primary",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{plan.name}</p>
                <p className="text-sm text-muted-foreground">{plan.blurb}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-2xl font-bold">{plan.price}</p>
                <p className="text-[10px] tracking-wide text-muted-foreground">{plan.cadence}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <button
              className={cn(
                "mt-4 w-full rounded-xl py-3 text-sm font-semibold",
                plan.highlight
                  ? "bg-escrow text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Prototype interface — no payments are processed.
      </p>
    </AppShell>
  );
}
