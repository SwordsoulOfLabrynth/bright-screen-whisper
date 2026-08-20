import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Facebook, Music2, Plus, QrCode } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/seller")({
  head: () => ({
    meta: [
      { title: "Seller shop dashboard — MatchGuard" },
      {
        name: "description",
        content:
          "Track escrow orders, connected Facebook and TikTok pages, trustscore and payouts from one MatchGuard seller dashboard.",
      },
      { property: "og:title", content: "Seller shop dashboard — MatchGuard" },
      {
        property: "og:description",
        content: "Escrow orders, QR handovers and payout status for social sellers.",
      },
    ],
  }),
  component: SellerPage,
});

const stats = [
  { value: "$1,820", label: "IN ESCROW" },
  { value: "$18.4k", label: "GMV / 30D" },
  { value: "1,203", label: "SEARCH HITS" },
];

const pages = [
  { icon: Facebook, name: "NightForge Builds", sub: "Auto-sync every 15 min" },
  { icon: Music2, name: "@nightforge.tt", sub: "Manual post recording" },
];

const orders = [
  { id: "TG-8841 · AUNG K.", title: "Custom Gaming Rig — RTX 4070", price: "$1,180", status: "Funds locked", tone: "accent", action: "Generate QR", primary: true },
  { id: "TG-8837 · MAY T.", title: "iPad Air M2 + Pencil Pro", price: "$640", status: "Awaiting scan", tone: "warning", action: "Show QR" },
  { id: "TG-8829 · ZIN M.", title: 'MacBook Air M3 15"', price: "$1,090", status: "Released", tone: "success", action: "View receipt" },
];

const inventory = [
  { title: "Custom Gaming Rig — RTX 4070", price: "$1,180", meta: "3 in stock · Facebook" },
  { title: "iPad Air M2 + Pencil Pro", price: "$640", meta: "1 in stock · TikTok" },
  { title: 'MacBook Air M3 15"', price: "$1,090", meta: "Sold out · TikTok" },
];

function SellerPage() {
  const [tab, setTab] = useState<"orders" | "inventory">("orders");

  return (
    <AppShell>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">NightForge Builds</h1>
          <p className="text-sm text-muted-foreground">@nightforge · 412 escrow deals</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">96</p>
          <p className="text-[10px] tracking-wide text-muted-foreground">TRUSTSCORE</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="shadow-card rounded-2xl bg-card p-3">
            <p className="text-lg font-bold">{s.value}</p>
            <p className="text-[10px] tracking-wide text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="shadow-card mt-4 rounded-2xl bg-card p-4">
        <p className="font-semibold">Connected pages</p>
        <div className="mt-3 space-y-2">
          {pages.map(({ icon: Icon, name, sub }) => (
            <div key={name} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
              <Icon className="size-4 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </div>
              <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
                Linked
              </span>
            </div>
          ))}
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground">
            <Plus className="size-4" /> Link another page
          </button>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
        {(["orders", "inventory"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-lg py-2 text-sm font-medium capitalize transition-colors",
              tab === t ? "bg-card text-foreground shadow-card" : "text-muted-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {tab === "orders"
          ? orders.map((o) => (
              <div key={o.id} className="shadow-card rounded-2xl bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] tracking-wide text-muted-foreground">{o.id}</p>
                    <p className="mt-0.5 font-semibold">{o.title}</p>
                  </div>
                  <p className="text-lg font-bold">{o.price}</p>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      o.tone === "accent" && "bg-accent text-primary",
                      o.tone === "warning" && "bg-warning/25 text-warning-foreground",
                      o.tone === "success" && "bg-success/15 text-success",
                    )}
                  >
                    {o.status}
                  </span>
                  <button
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
                      o.primary
                        ? "bg-escrow text-primary-foreground"
                        : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    <QrCode className="size-4" /> {o.action}
                  </button>
                </div>
              </div>
            ))
          : inventory.map((i) => (
              <div key={i.title} className="shadow-card flex items-center justify-between rounded-2xl bg-card p-4">
                <div>
                  <p className="font-semibold">{i.title}</p>
                  <p className="text-xs text-muted-foreground">{i.meta}</p>
                </div>
                <p className="text-lg font-bold">{i.price}</p>
              </div>
            ))}
      </div>

      <button className="bg-cta mt-4 w-full rounded-2xl py-3.5 font-semibold text-warning-foreground">
        Unlock instant payouts with Pro
      </button>
    </AppShell>
  );
}
