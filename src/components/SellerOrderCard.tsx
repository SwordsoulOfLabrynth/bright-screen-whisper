import { Link } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { useState } from "react";
import { ReceiptViewer } from "@/components/ReceiptViewer";
import { formatMoney, statusLabel, type TransactionResponseDto } from "@/lib/api";
import { cn } from "@/lib/utils";

export function SellerOrderCard({
  order,
  onApprove,
  approving,
}: {
  order: TransactionResponseDto;
  onApprove: (order: TransactionResponseDto) => void;
  approving: boolean;
}) {
  const [receiptOpen, setReceiptOpen] = useState(false);
  return (
    <article className="rounded-2xl border border-border bg-card p-3.5">
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-bold",
            order.status === "PENDING_VERIFICATION"
              ? "bg-warning text-warning-foreground"
              : order.status === "ESCROW_LOCKED"
                ? "bg-accent text-accent-foreground"
                : "bg-success text-success-foreground",
          )}
        >
          {statusLabel[order.status]}
        </span>
        <span className="text-base font-bold whitespace-nowrap">{formatMoney(order.amount)}</span>
      </div>

      <h3 className="mt-2 text-sm leading-tight font-semibold">{order.productTitle}</h3>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Order #{order.id}
        {order.senderPhone ? ` · Sender ${order.senderPhone}` : ""}
      </p>
      {order.aiVerificationNotes && (
        <p className="mt-2 rounded-xl bg-muted px-2.5 py-2 text-[11px] leading-snug text-muted-foreground">
          Guardian: {order.aiVerificationNotes}
        </p>
      )}

      {order.status === "PENDING_VERIFICATION" && (
        <button
          onClick={() => onApprove(order)}
          disabled={approving}
          className="mt-3 min-h-10 w-full rounded-xl bg-primary text-xs font-bold text-primary-foreground disabled:opacity-60"
        >
          {approving ? "Approving…" : "Approve payment"}
        </button>
      )}

      {order.status === "ESCROW_LOCKED" && (
        <Link
          to="/seller/qr/$id"
          params={{ id: String(order.id) }}
          className="mt-3 flex min-h-10 w-full items-center justify-center rounded-xl bg-accent text-xs font-bold text-accent-foreground"
        >
          Show handover QR
        </Link>
      )}
    </article>
  );
}
