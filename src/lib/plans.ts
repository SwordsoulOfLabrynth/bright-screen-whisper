// Frontend-only subscription plans. The backend has no billing endpoints yet,
// so the selected plan is kept in localStorage per signed-in user.

export type PlanId = "free" | "plus" | "pro";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  tagline: string;
  searches: string;
  features: string[];
  highlight?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Starter",
    price: 0,
    tagline: "Shop protected, with the basics.",
    searches: "10 AI searches / month",
    features: [
      "Escrow protection on every order",
      "10 AI semantic searches per month",
      "Standard Guardian scam checks",
    ],
  },
  {
    id: "plus",
    name: "Guardian Plus",
    price: 4.99,
    tagline: "For regular social shoppers.",
    searches: "200 AI searches / month",
    features: [
      "Everything in Starter",
      "200 AI semantic searches per month",
      "Deep fit-score explanations",
      "Priority payment verification",
    ],
    highlight: true,
  },
  {
    id: "pro",
    name: "Guardian Pro",
    price: 12.99,
    tagline: "Power buyers and resellers.",
    searches: "Unlimited AI searches",
    features: [
      "Everything in Guardian Plus",
      "Unlimited AI semantic searches",
      "Price-drop and restock alerts",
      "Dedicated dispute support",
    ],
  },
];

const KEY = "matchguard.plan";

export function getPlan(userId?: number): PlanId {
  if (typeof window === "undefined") return "free";
  try {
    const map = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Record<string, PlanId>;
    return map[String(userId ?? "anon")] ?? "free";
  } catch {
    return "free";
  }
}

export function setPlan(userId: number | undefined, plan: PlanId) {
  if (typeof window === "undefined") return;
  let map: Record<string, PlanId> = {};
  try {
    map = JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Record<string, PlanId>;
  } catch {
    /* ignore */
  }
  map[String(userId ?? "anon")] = plan;
  window.localStorage.setItem(KEY, JSON.stringify(map));
}

/** Platform commission taken from every seller payout. */
export const SELLER_FEE_RATE = 0.05;

export function sellerFee(amount: number) {
  return amount * SELLER_FEE_RATE;
}

export function sellerNet(amount: number) {
  return amount * (1 - SELLER_FEE_RATE);
}
