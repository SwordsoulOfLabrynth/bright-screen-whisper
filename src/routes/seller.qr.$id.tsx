import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { QrCode, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { api, formatMoney, statusLabel } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/seller/qr/$id")({
  head: () => ({
    meta: [
      { title: "Handover QR — MatchGuard seller" },
      {
        name: "description",
        content:
          "Show the one-time handover QR so the buyer can confirm delivery and release escrow funds to your account.",
      },
      { property: "og:title", content: "Handover QR — MatchGuard seller" },
      { property: "og:description", content: "One-time QR that releases escrowed funds." },
    ],
  }),
  component: SellerQr,
});

function SellerQr() {
  const { id } = Route.useParams();
  const orderId = Number(id);
  const { user, ready } = useAuth();

  const transactions = useQuery({
    queryKey: ["seller-transactions", user?.id],
    queryFn: () => api.sellerTransactions(user!.id),
    enabled: ready && user?.role === "SELLER",
  });

  const qr = useQuery({
    queryKey: ["order-qr", orderId],
    queryFn: () => api.transactionQr(orderId),
    retry: false,
  });

  const order = transactions.data?.find((o) => o.id === orderId);
  const qrImage = qr.data ?? null;

  return (
    <AppShell requireRole="SELLER" back="/seller/orders">
      <h1 className="text-[27px] font-bold tracking-tight">Handover QR</h1>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        Let the buyer scan this at handover. Funds release the moment it is confirmed.
      </p>

      <div className="mt-5 rounded-3xl border border-border bg-card p-5 text-center">
        {qrImage ? (
          <img
            src={qrImage}
            alt={`Handover QR code for order ${orderId}`}
            className="mx-auto size-52 rounded-xl bg-background p-2"
          />
        ) : (
          <QrCode className="mx-auto size-24 text-muted-foreground" />
        )}
        {qr.isPending && <p className="mt-3 text-xs text-muted-foreground">Loading QR…</p>}
        {qr.isError && (
          <p className="mt-3 text-xs text-destructive">{(qr.error as Error).message}</p>
        )}
        {order && (
          <>
            <h2 className="mt-4 text-sm font-semibold">{order.productTitle}</h2>
            <p className="text-xs text-muted-foreground">
              {formatMoney(order.amount)} · {statusLabel[order.status]}
            </p>
          </>
        )}
      </div>

      <div className="mt-3 flex gap-2.5 rounded-2xl bg-warning p-3.5 text-xs leading-snug text-warning-foreground">
        <ShieldCheck className="size-4 shrink-0" />
        <span>Never hand over the item before the buyer confirms the scan in their app.</span>
      </div>
    </AppShell>
  );
}
