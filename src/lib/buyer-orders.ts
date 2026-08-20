import { api, type TransactionResponseDto } from "@/lib/api";
import { getOrders, mergeOrders } from "@/lib/local-store";

// Buyer-side refresh. The backend only exposes /transactions/seller/{id}, which
// filters by seller id — a buyer gets an empty list. So we merge whatever the
// endpoint returns and then probe the QR endpoint (200 only once escrow is
// locked) for any order still sitting at PENDING_VERIFICATION locally.
export async function refreshBuyerOrders(buyerId: number): Promise<TransactionResponseDto[]> {
  let orders = getOrders();

  try {
    const live = await api.buyerTransactions(buyerId);
    if (Array.isArray(live) && live.length > 0) orders = mergeOrders(live);
  } catch {
    /* keep cache */
  }

  const pending = orders.filter((o) => o.status === "PENDING_VERIFICATION");
  if (pending.length === 0) return orders;

  const probes = await Promise.all(
    pending.map(async (order) => ({ order, locked: await api.isEscrowLocked(order.id) })),
  );
  const promoted = probes
    .filter((p) => p.locked)
    .map((p) => ({ ...p.order, status: "ESCROW_LOCKED" as const }));

  return promoted.length > 0 ? mergeOrders(promoted) : orders;
}
