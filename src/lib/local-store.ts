import type { ProductRecommendationDto, TransactionResponseDto } from "@/lib/api";

// The backend exposes no "product by id" or "buyer transactions" endpoint yet,
// so the app keeps a small client-side cache of what the user has already seen.

const PRODUCT_KEY = "matchguard.products";
const ORDER_KEY = "matchguard.orders";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function cacheProducts(products: ProductRecommendationDto[]) {
  const map = read<Record<string, ProductRecommendationDto>>(PRODUCT_KEY, {});
  for (const product of products) map[String(product.productId)] = product;
  write(PRODUCT_KEY, map);
}

export function getCachedProduct(id: number): ProductRecommendationDto | null {
  const map = read<Record<string, ProductRecommendationDto>>(PRODUCT_KEY, {});
  return map[String(id)] ?? null;
}

export function saveOrder(order: TransactionResponseDto) {
  const orders = read<TransactionResponseDto[]>(ORDER_KEY, []).filter((o) => o.id !== order.id);
  write(ORDER_KEY, [order, ...orders]);
}

export function mergeOrders(incoming: TransactionResponseDto[]) {
  const existing = read<TransactionResponseDto[]>(ORDER_KEY, []);
  const map = new Map<number, TransactionResponseDto>();
  for (const o of existing) map.set(o.id, o);
  for (const o of incoming) map.set(o.id, { ...map.get(o.id), ...o });
  const merged = [...map.values()].sort((a, b) => b.id - a.id);
  write(ORDER_KEY, merged);
  return merged;
}


export function getOrders(): TransactionResponseDto[] {
  return read<TransactionResponseDto[]>(ORDER_KEY, []);
}

export function getOrder(id: number): TransactionResponseDto | null {
  return getOrders().find((o) => o.id === id) ?? null;
}
