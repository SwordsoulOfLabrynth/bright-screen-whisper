import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SellerOrderCard } from "@/components/SellerOrderCard";
import { api, formatMoney } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/seller/")({
  head: () => ({
    meta: [
      { title: "Seller dashboard — MatchGuard" },
      {
        name: "description",
        content:
          "Track protected orders, approve buyer receipts and monitor your MatchGuard TrustScore from one seller dashboard.",
      },
      { property: "og:title", content: "Seller dashboard — MatchGuard" },
      {
        property: "og:description",
        content: "Incoming protected orders, payouts and TrustScore for MatchGuard sellers.",
      },
    ],
  }),
  component: SellerDashboard,
});

function SellerDashboard() {
  const { user, ready } = useAuth();
  const queryClient = useQueryClient();

  const transactions = useQuery({
    queryKey: ["seller-transactions", user?.id],
    queryFn: () => api.sellerTransactions(user!.id),
    enabled: ready && user?.role === "SELLER",
  });

  const products = useQuery({
    queryKey: ["seller-products", user?.id],
    queryFn: () => api.sellerProducts(user!.id),
    enabled: ready && user?.role === "SELLER",
  });

  const approve = useMutation({
    mutationFn: (transactionId: number) => api.approveTransaction(transactionId, user!.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["seller-transactions", user?.id] }),
  });

  const orders = transactions.data ?? [];
  const pending = orders.filter((o) => o.status === "PENDING_VERIFICATION");
  const protectedTotal = orders
    .filter((o) => o.status === "ESCROW_LOCKED")
    .reduce((sum, o) => sum + o.amount, 0);
  const trust = products.data?.length
    ? Math.round(
        products.data.reduce((sum, p) => sum + (p.trustScore ?? 0), 0) / products.data.length,
      )
    : 0;

  return (
    <AppShell requireRole="SELLER">
      <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
        Seller workspace
      </p>
      <h1 className="text-3xl font-bold tracking-tight">{user?.name ?? "Your shop"}</h1>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric label="Pending" value={String(pending.length)} />
        <Metric label="Protected" value={formatMoney(protectedTotal)} />
        <Metric label="TrustScore" value={String(trust)} />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold tracking-tight">Incoming protected orders</h2>
        <Link to="/seller/orders" className="text-xs font-bold text-brand-teal">
          See all
        </Link>
      </div>

      <div className="mt-2 space-y-2.5">
        {transactions.isPending && <div className="h-28 animate-pulse rounded-2xl bg-muted" />}
        {orders.length === 0 && !transactions.isPending && (
          <div className="rounded-2xl border border-border bg-card px-4 py-8 text-center">
            <p className="text-xs text-muted-foreground">
              No orders yet. Import a social post so buyers can pay safely.
            </p>
            <Link
              to="/seller/inventory"
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground"
            >
              Add a product <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
        {orders.slice(0, 3).map((order) => (
          <SellerOrderCard
            key={order.id}
            order={order}
            approving={approve.isPending && approve.variables === order.id}
            onApprove={(o) => approve.mutate(o.id)}
          />
        ))}
      </div>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-2.5 py-3">
      <strong className="block text-lg tracking-tight">{value}</strong>
      <span className="text-[9px] font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}
