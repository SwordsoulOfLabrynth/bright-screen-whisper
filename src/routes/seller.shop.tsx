import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Mail, Percent, Store, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api, formatMoney } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { sellerNet } from "@/lib/plans";

export const Route = createFileRoute("/seller/shop")({
  head: () => ({
    meta: [
      { title: "Shop profile — MatchGuard seller" },
      {
        name: "description",
        content:
          "Your MatchGuard shop profile: lifetime released payouts, TrustScore and account settings for social sellers.",
      },
      { property: "og:title", content: "Shop profile — MatchGuard seller" },
      { property: "og:description", content: "Payouts, TrustScore and seller account settings." },
    ],
  }),
  component: SellerShop,
});

function SellerShop() {
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();

  const transactions = useQuery({
    queryKey: ["seller-transactions", user?.id],
    queryFn: () => api.sellerTransactions(user!.id),
    enabled: ready && user?.role === "SELLER",
  });

  const released = (transactions.data ?? [])
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <AppShell requireRole="SELLER">
      <h1 className="text-[27px] font-bold tracking-tight">Shop</h1>

      <div className="mt-5 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="bg-escrow grid size-12 place-items-center rounded-full text-primary-foreground">
            <Store className="size-5" />
          </span>
          <div>
            <strong className="block text-base">{user?.name}</strong>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="size-3.5" /> {user?.email}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-escrow mt-3 rounded-3xl p-5 text-primary-foreground shadow-card">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/16 px-2.5 py-1.5 text-xs font-semibold">
          <Wallet className="size-3.5" /> Released payouts
        </span>
        <strong className="mt-4 block text-4xl font-bold tracking-tight">
          {formatMoney(released)}
        </strong>
        <p className="mt-1.5 text-sm text-primary-foreground/85">
          Paid out after buyers scanned the handover QR.
        </p>
      </div>

      <div className="mt-3 flex gap-2.5 rounded-2xl bg-accent p-4 text-xs leading-snug text-accent-foreground">
        <Percent className="size-4 shrink-0" />
        <span>
          MatchGuard deducts a 5% platform fee from every completed transaction. Released this
          period: {formatMoney(released)} gross · {formatMoney(sellerNet(released))} net after fees.
        </span>
      </div>

      <button
        onClick={() => {
          logout();
          void navigate({ to: "/auth" });
        }}
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-bold text-destructive"
      >
        <LogOut className="size-4" /> Sign out
      </button>
    </AppShell>
  );
}
