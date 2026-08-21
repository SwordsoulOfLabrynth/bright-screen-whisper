// Frontend-only admin dataset. The backend exposes no admin endpoints yet, so
// the console renders a representative snapshot of platform activity.
import type { TransactionStatus } from "@/lib/api";
import type { PlanId } from "@/lib/plans";

export type AdminTransaction = {
  id: number;
  product: string;
  buyer: string;
  seller: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
};

export type AdminSeller = {
  id: number;
  name: string;
  shop: string;
  listings: number;
  trustScore: number;
  volume: number;
  status: "ACTIVE" | "REVIEW" | "SUSPENDED";
};

export type AdminSubscriber = {
  id: number;
  name: string;
  email: string;
  plan: PlanId;
  since: string;
};

export const adminTransactions: AdminTransaction[] = [
  { id: 1042, product: "Gaming PC RTX 4070", buyer: "Win Htut", seller: "TechNest", amount: 3150000, status: "ESCROW_LOCKED", createdAt: "2026-08-20" },
  { id: 1041, product: "Sun Cream SPF50", buyer: "Papa Aung", seller: "GlowLab", amount: 42000, status: "PENDING_VERIFICATION", createdAt: "2026-08-20" },
  { id: 1038, product: "iPhone 14 Pro", buyer: "May Thu", seller: "MobileHub", amount: 1250000, status: "COMPLETED", createdAt: "2026-08-19" },
  { id: 1035, product: "Office Chair Ergo", buyer: "Kyaw Zin", seller: "HomeFit", amount: 265000, status: "COMPLETED", createdAt: "2026-08-18" },
  { id: 1030, product: "Fake AirPods listing", buyer: "Su Su", seller: "QuickDeals", amount: 88000, status: "CANCELLED_AND_REFUNDED", createdAt: "2026-08-17" },
];

export const adminSellers: AdminSeller[] = [
  { id: 2, name: "TechNest", shop: "facebook.com/technest", listings: 24, trustScore: 92, volume: 24850000, status: "ACTIVE" },
  { id: 5, name: "GlowLab", shop: "instagram.com/glowlab", listings: 12, trustScore: 88, volume: 6240000, status: "ACTIVE" },
  { id: 7, name: "MobileHub", shop: "facebook.com/mobilehub", listings: 31, trustScore: 76, volume: 40360000, status: "REVIEW" },
  { id: 9, name: "QuickDeals", shop: "telegram.me/quickdeals", listings: 8, trustScore: 41, volume: 1280000, status: "SUSPENDED" },
];

export const adminSubscribers: AdminSubscriber[] = [
  { id: 3, name: "Papa Aung", email: "papa@example.com", plan: "plus", since: "2026-06-02" },
  { id: 4, name: "Win Htut", email: "win@example.com", plan: "pro", since: "2026-05-14" },
  { id: 6, name: "May Thu", email: "may@example.com", plan: "free", since: "2026-07-21" },
  { id: 8, name: "Kyaw Zin", email: "kyaw@example.com", plan: "plus", since: "2026-08-01" },
];

export type AdminCustomer = {
  id: number;
  name: string;
  email: string;
  orders: number;
  spend: number;
  disputes: number;
  plan: PlanId;
  status: "ACTIVE" | "REVIEW" | "SUSPENDED";
};

export const adminCustomers: AdminCustomer[] = [
  { id: 3, name: "Papa Aung", email: "papa@example.com", orders: 12, spend: 3680000, disputes: 0, plan: "plus", status: "ACTIVE" },
  { id: 4, name: "Win Htut", email: "win@example.com", orders: 27, spend: 18240000, disputes: 1, plan: "pro", status: "ACTIVE" },
  { id: 6, name: "May Thu", email: "may@example.com", orders: 4, spend: 2420000, disputes: 0, plan: "free", status: "ACTIVE" },
  { id: 8, name: "Kyaw Zin", email: "kyaw@example.com", orders: 9, spend: 1280000, disputes: 3, plan: "plus", status: "REVIEW" },
  { id: 11, name: "Su Su", email: "susu@example.com", orders: 2, spend: 260000, disputes: 4, plan: "free", status: "SUSPENDED" },
];
