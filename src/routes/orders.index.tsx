import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { formatMoney, statusLabel } from "@/lib/api";
import { getOrders } from "@/lib/local-store";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "Your orders — MatchGuard" },
      {
        name: "description",
        content:
          "Track every MatchGuard escrow order from payment verification through QR handover and release of funds.",
      },
      { property: "og:title", content: "Your orders — MatchGuard" },
      {
        property: "og:description",
        content: "Escrow order tracking with QR handover status.",
      },
    ],
  }),
  component: OrdersScreen,
});

function OrdersScreen() {
  const orders = useQuery({ queryKey: ["local-orders"], queryFn: async () => getOrders() });

  return (
    <AppShell requireRole="CUSTOMER">
      <h1 className="text-[27px] font-bold tracking-tight">Your orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every payment stays in escrow until you confirm handover.
      </p>

      <div className="mt-5 space-y-2.5">
        {orders.data?.length === 0 && (
          <div className="rounded-2xl border border-border bg-card px-4 py-10 text-center">
            <Package className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-2 text-xs text-muted-foreground">
              No orders yet. Search a listing and pay safely to start one.
            </p>
            <Link
              to="/search"
              className="mt-4 inline-flex min-h-10 items-center rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground"
            >
              Find a listing
            </Link>
          </div>
        )}

        {orders.data?.map((order) => (
          <Link
            key={order.id}
            to="/orders/$id"
            params={{ id: String(order.id) }}
            className="block rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
                {statusLabel[order.status]}
              </span>
              <span className="text-lg font-bold">{formatMoney(order.amount)}</span>
            </div>
            <h2 className="mt-2 text-sm leading-tight font-semibold">{order.productTitle}</h2>
            <p className="mt-1 text-[11px] text-muted-foreground">Order #{order.id}</p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
