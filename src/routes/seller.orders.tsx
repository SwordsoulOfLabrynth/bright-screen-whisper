import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SellerOrderCard } from "@/components/SellerOrderCard";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/seller/orders")({
  head: () => ({
    meta: [
      { title: "Verify payments — MatchGuard seller" },
      {
        name: "description",
        content:
          "Review buyer transfer receipts, approve verified payments and move orders into escrow-protected handover.",
      },
      { property: "og:title", content: "Verify payments — MatchGuard seller" },
      {
        property: "og:description",
        content: "Approve buyer receipts and manage escrow-protected orders.",
      },
    ],
  }),
  component: SellerOrders,
});

const filters = [
  { key: "ALL", label: "All" },
  { key: "PENDING_VERIFICATION", label: "To verify" },
  { key: "ESCROW_LOCKED", label: "In escrow" },
  { key: "COMPLETED", label: "Completed" },
] as const;

function SellerOrders() {
  const { user, ready } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("ALL");

  const transactions = useQuery({
    queryKey: ["seller-transactions", user?.id],
    queryFn: () => api.sellerTransactions(user!.id),
    enabled: ready && user?.role === "SELLER",
  });

  const approve = useMutation({
    mutationFn: (transactionId: number) => api.approveTransaction(transactionId, user!.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["seller-transactions", user?.id] }),
  });

  const orders = (transactions.data ?? []).filter(
    (o) => filter === "ALL" || o.status === filter,
  );

  return (
    <AppShell requireRole="SELLER">
      <h1 className="text-[27px] font-bold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Approve a receipt only after the transfer lands in the escrow account.
      </p>

      <div className="flex gap-2 overflow-auto py-3.5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-2 text-xs font-semibold",
              filter === f.key
                ? "border-brand-teal bg-brand-teal text-primary-foreground"
                : "border-border bg-card text-secondary-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {transactions.isPending && <div className="h-28 animate-pulse rounded-2xl bg-muted" />}
        {!transactions.isPending && orders.length === 0 && (
          <p className="rounded-2xl border border-border bg-card px-4 py-8 text-center text-xs text-muted-foreground">
            Nothing in this bucket right now.
          </p>
        )}
        {orders.map((order) => (
          <SellerOrderCard
            key={order.id}
            order={order}
            approving={approve.isPending && approve.variables === order.id}
            onApprove={(o) => approve.mutate(o.id)}
          />
        ))}
      </div>

      {approve.isError && (
        <p className="mt-3 rounded-xl bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
          {(approve.error as Error).message}
        </p>
      )}
    </AppShell>
  );
}
