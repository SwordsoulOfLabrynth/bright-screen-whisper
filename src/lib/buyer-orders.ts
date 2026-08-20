import { api, type TransactionResponseDto } from "@/lib/api";
import { getOrders, mergeOrders } from "@/lib/local-store";

// Buyer-side refresh. The backend now authorises buyers on
// GET /transactions/seller/{buyerId}, so it returns the buyer's own
// transactions — merge them into the local cache as the source of truth.
export async function refreshBuyerOrders(buyerId: number): Promise<TransactionResponseDto[]> {
  try {
    const live = await api.buyerTransactions(buyerId);
    if (Array.isArray(live)) return mergeOrders(live);
  } catch {
    /* keep cache */
  }
  return getOrders();
}
