import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, QrCode } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  api,
  formatMoney,

  statusLabel,
  type TransactionResponseDto,
  type TransactionStatus,
} from "@/lib/api";

import { useAuth } from "@/lib/auth";
import { getOrder, mergeOrders, saveOrder } from "@/lib/local-store";

import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order tracker — MatchGuard" },
      {
        name: "description",
        content:
          "Follow your escrow order step by step: receipt verification, escrow lock, QR handover and release of funds to the seller.",
      },
      { property: "og:title", content: "Order tracker — MatchGuard" },
      {
        property: "og:description",
        content: "Escrow status and one-time handover QR for your MatchGuard order.",
      },
    ],
  }),
  component: OrderTracker,
});

const steps: { key: TransactionStatus; title: string; copy: string }[] = [
  {
    key: "PENDING_VERIFICATION",
    title: "Receipt received",
    copy: "Guardian is verifying your transfer screenshot.",
  },
  {
    key: "ESCROW_LOCKED",
    title: "Funds protected in escrow",
    copy: "Seller can prepare the handover. Your money is safe.",
  },
  {
    key: "COMPLETED",
    title: "Handover confirmed",
    copy: "QR scanned and funds released to the seller.",
  },
];

function OrderTracker() {
  const { id } = Route.useParams();
  const orderId = Number(id);
  const queryClient = useQueryClient();
  const [qrToken, setQrToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const { user } = useAuth();
  const order = useQuery({
    queryKey: ["order", orderId, user?.id ?? 0],
    queryFn: async () => {
      if (user) {
        try {
          const live = await api.buyerTransactions(user.id);
          if (Array.isArray(live)) mergeOrders(live);
        } catch {
          /* fall back to cache */
        }
      }
      return getOrder(orderId);
    },
    refetchInterval: 15000,
  });

  const data: TransactionResponseDto | null | undefined = order.data;


  const qr = useQuery({
    queryKey: ["order-qr", orderId],
    queryFn: () => api.transactionQr(orderId),
    enabled: data?.status === "ESCROW_LOCKED",
    retry: false,
  });


  const release = useMutation({
    mutationFn: () => api.releaseTransaction({ transactionId: orderId, qrToken }),
    onSuccess: (updated) => {
      saveOrder(updated);
      setMessage("Funds released. Thanks for confirming the handover.");
      void queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => setMessage(err instanceof Error ? err.message : "Could not release funds"),
  });

  const cancel = useMutation({
    mutationFn: () =>
      api.cancelTransaction({ transactionId: orderId, reason: "Buyer cancelled the order" }),
    onSuccess: (updated) => {
      saveOrder(updated);
      setMessage("Order cancelled. Refund is on its way.");
      void queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => setMessage(err instanceof Error ? err.message : "Could not cancel order"),
  });

  const activeIndex = data ? Math.max(0, steps.findIndex((s) => s.key === data.status)) : 0;

  const qrImage = qr.data ?? null;

  return (
    <AppShell requireRole="CUSTOMER" back="/orders">
      {!data && (
        <p className="rounded-2xl border border-border bg-card px-4 py-8 text-center text-xs text-muted-foreground">
          Order not found on this device.
        </p>
      )}

      {data && (
        <>
          <p className="text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
            Order #{data.id}
          </p>
          <h1 className="mt-1 text-[27px] leading-tight font-bold tracking-tight">
            {data.productTitle}
          </h1>
          <p className="mt-2 text-2xl font-bold">{formatMoney(data.amount)}</p>
          <span className="mt-2 inline-flex rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground">
            {statusLabel[data.status]}
          </span>

          <div className="mt-5 rounded-2xl border border-border bg-card px-4 py-1">
            {steps.map((step, index) => {
              const done = index <= activeIndex && data.status !== "CANCELLED_AND_REFUNDED";
              return (
                <div key={step.key} className="relative flex min-h-17 items-center gap-3.5">
                  {index < steps.length - 1 && (
                    <span className="absolute top-12 left-3.75 h-6 w-0.5 bg-accent" />
                  )}
                  <span
                    className={cn(
                      "z-10 grid size-8 shrink-0 place-items-center rounded-full",
                      done
                        ? "bg-brand-teal text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Check className="size-4" />
                  </span>
                  <span>
                    <strong className="block text-[13px]">{step.title}</strong>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                      {step.copy}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          {data.aiVerificationNotes && (
            <p className="rounded-2xl bg-warning p-3.5 text-xs leading-snug text-warning-foreground">
              Guardian notes: {data.aiVerificationNotes}
            </p>
          )}

          {data.status === "ESCROW_LOCKED" && (
            <div className="mt-4 rounded-3xl border border-border bg-card p-5 text-center">
              <QrCode className="mx-auto size-6 text-brand-teal" />
              <h2 className="mt-2 text-sm font-semibold">Handover QR</h2>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">
                Show this to the seller, or paste the token they scan to release funds.
              </p>
              {qrImage && (
                <img
                  src={qrImage}
                  alt={`Handover QR code for order ${data.id}`}
                  className="mx-auto mt-3 size-44 rounded-xl bg-background p-2"
                />
              )}
              <input
                value={qrToken}
                onChange={(e) => setQrToken(e.target.value)}
                placeholder="Handover token"
                className="mt-3 w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:border-ring"
              />
              <button
                onClick={() => release.mutate()}
                disabled={release.isPending || !qrToken}
                className="mt-3 min-h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-60"
              >
                {release.isPending ? "Releasing…" : "Confirm handover & release"}
              </button>
            </div>
          )}

          {(data.status === "PENDING_VERIFICATION" || data.status === "ESCROW_LOCKED") && (
            <button
              onClick={() => cancel.mutate()}
              disabled={cancel.isPending}
              className="mt-3 min-h-11 w-full rounded-xl border border-border bg-card text-sm font-bold text-destructive disabled:opacity-60"
            >
              {cancel.isPending ? "Cancelling…" : "Cancel & request refund"}
            </button>
          )}

          {message && (
            <p className="mt-3 rounded-xl bg-accent px-3 py-2.5 text-xs text-accent-foreground">
              {message}
            </p>
          )}
        </>
      )}
    </AppShell>
  );
}
