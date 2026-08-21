import { ImageOff, Receipt, X } from "lucide-react";

function proxied(url: string) {
  return `/api/public/img?url=${encodeURIComponent(url)}`;
}


export function ReceiptViewer({
  url,
  orderId,
  senderPhone,
  onClose,
}: {
  url: string | null;
  orderId: number;
  senderPhone?: string | null;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/60 p-3 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-border bg-card p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <strong className="block text-base tracking-tight">Payment receipt</strong>
            <span className="text-[11px] text-muted-foreground">
              Order #{orderId}
              {senderPhone ? ` · Sender ${senderPhone}` : ""}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close receipt"
            className="grid size-9 place-items-center rounded-xl border border-border"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-muted">
          {url ? (
            <img
              src={proxied(url)}
              alt={`Buyer transfer receipt for order ${orderId}`}
              className="max-h-[60vh] w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 py-12 text-xs text-muted-foreground">
              <ImageOff className="size-5" />
              No screenshot was attached to this order.
            </div>
          )}
        </div>

        {url && (
          <a
            href={proxied(url)}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex min-h-10 items-center justify-center gap-2 rounded-xl border border-border text-xs font-bold"
          >
            <Receipt className="size-3.5" />
            View receipt
          </a>
        )}
      </div>
    </div>
  );
}
