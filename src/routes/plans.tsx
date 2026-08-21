import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { getPlan, PLANS, setPlan, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "Subscription plans — MatchGuard" },
      {
        name: "description",
        content:
          "Pick a MatchGuard buyer plan: AI semantic search limits, Guardian scam checks and escrow-protected payments.",
      },
      { property: "og:title", content: "Subscription plans — MatchGuard" },
      {
        property: "og:description",
        content: "Starter, Guardian Plus and Guardian Pro plans for MatchGuard buyers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlansScreen,
});

function PlansScreen() {
  const { user, ready } = useAuth();
  const [current, setCurrent] = useState<PlanId>("free");
  const [saved, setSaved] = useState<PlanId | null>(null);

  useEffect(() => {
    if (ready && user) setCurrent(getPlan(user.id));
  }, [ready, user]);

  function choose(plan: PlanId) {
    setPlan(user?.id, plan);
    setCurrent(plan);
    setSaved(plan);
  }

  return (
    <AppShell requireRole="CUSTOMER" back="/account">
      <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
        Membership
      </p>
      <h1 className="text-[27px] font-bold tracking-tight">Subscription plans</h1>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Escrow protection is always free. Plans unlock how much AI-powered semantic search you get.
      </p>

      {saved && (
        <p className="mt-3 rounded-xl bg-accent px-3 py-2.5 text-xs font-semibold text-accent-foreground">
          You are now on {PLANS.find((p) => p.id === saved)?.name}.
        </p>
      )}

      <div className="mt-4 space-y-3">
        {PLANS.map((plan) => {
          const active = plan.id === current;
          return (
            <div
              key={plan.id}
              className={cn(
                "rounded-3xl border bg-card p-5",
                active ? "border-primary shadow-card" : "border-border",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-lg tracking-tight">{plan.name}</strong>
                    {plan.highlight && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-[10px] font-bold text-accent-foreground">
                        <Sparkles className="size-3" /> Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{plan.tagline}</p>
                </div>
                <div className="text-right">
                  <strong className="block text-xl tracking-tight">
                    {plan.price === 0 ? "Free" : `${plan.price.toLocaleString("en-US")} MMK`}
                  </strong>
                  {plan.price > 0 && (
                    <span className="text-[10px] text-muted-foreground">per month</span>
                  )}
                </div>
              </div>

              <p className="mt-3 text-xs font-bold text-brand-teal">{plan.searches}</p>

              <ul className="mt-3 space-y-1.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-xs text-muted-foreground">
                    <Check className="size-3.5 shrink-0 text-brand-teal" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={active}
                onClick={() => choose(plan.id)}
                className={cn(
                  "mt-4 min-h-11 w-full rounded-xl text-sm font-bold",
                  active
                    ? "border border-border bg-card text-muted-foreground"
                    : "bg-primary text-primary-foreground",
                )}
              >
                {active ? "Current plan" : plan.price === 0 ? "Switch to Starter" : "Choose plan"}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        Plans are billed monthly and can be changed at any time. Sellers are charged a separate 5%
        platform fee on each completed transaction.
      </p>
    </AppShell>
  );
}
