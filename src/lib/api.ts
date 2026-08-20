// MatchGuard API client — talks directly to the Spring backend from the browser.
export const API_BASE = "/api/public/mg";

export type Role = "CUSTOMER" | "SELLER";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string | null;
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type ProductResponseDto = {
  id: number;
  sellerId: number;
  title: string;
  description: string;
  price: number;
  socialPostUrl: string | null;
  trustScore: number;
  scamAnalysisSummary: string | null;
  isVerifiedSafe: boolean;
  createdAt: string;
};

export type ProductRecommendationDto = {
  productId: number;
  title: string;
  description: string;
  price: number;
  socialPostUrl: string | null;
  trustScore: number;
  isVerifiedSafe: boolean;
  fitScore: number;
  compatibilityInsight: string | null;
  explanation?: string | null;
};

export type TransactionStatus =
  | "PENDING_VERIFICATION"
  | "ESCROW_LOCKED"
  | "COMPLETED"
  | "CANCELLED_AND_REFUNDED";

export type TransactionResponseDto = {
  id: number;
  productId: number;
  productTitle: string;
  amount: number;
  status: TransactionStatus;
  senderPhone: string | null;
  screenshotUrl: string | null;
  aiVerificationNotes?: string | null;
  createdAt?: string | null;
  qrToken?: string | null;
};

export type AiScamDetectionResult = {
  trustScore: number;
  scamAnalysisSummary: string;
  isVerifiedSafe: boolean;
};

const SESSION_KEY = "matchguard.session";

export function readSession(): AuthResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  } catch {
    return null;
  }
}

export function writeSession(session: AuthResponse | null) {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(SESSION_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let message = text;
    try {
      const parsed = JSON.parse(text) as { message?: string; error?: string };
      message = parsed.message || parsed.error || text;
    } catch {
      /* plain text */
    }
    if (!message) {
      message =
        res.status === 403
          ? "Access denied. Please sign in again."
          : `Request failed (${res.status})`;
    }
    throw new ApiError(res.status, message);
  }
  return (text ? JSON.parse(text) : null) as T;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
  raw?: boolean;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = {};
  const session = readSession();
  if (auth && session?.accessToken) headers["Authorization"] = `Bearer ${session.accessToken}`;

  let payload: BodyInit | null = null;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  // The upstream gateway intermittently rejects perfectly valid calls with an
  // empty 403/502, so transient blank rejections are retried a couple of times.
  const send = async () => {
    let res = await fetch(`${API_BASE}${path}`, { method, headers, body: payload });
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (![403, 502, 503, 504].includes(res.status)) break;
      const clone = res.clone();
      const text = await clone.text();
      if (text.trim().length > 0) break;
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
      res = await fetch(`${API_BASE}${path}`, { method, headers, body: payload });
    }
    return res;
  };

  const res = await send();

  if (res.status === 401 && auth && session?.refreshToken) {
    const refreshed = await refreshSession(session.refreshToken);
    if (refreshed) {
      headers["Authorization"] = `Bearer ${refreshed.accessToken}`;
      return parse<T>(await send());
    }
  }

  return parse<T>(res);
}

async function refreshSession(refreshToken: string): Promise<AuthResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const next = (await res.json()) as AuthResponse;
    const current = readSession();
    const merged = { ...(current ?? ({} as AuthResponse)), ...next };
    writeSession(merged);
    return merged;
  } catch {
    return null;
  }
}

export const api = {
  register: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
  }) => request<AuthResponse>("/auth/register", { method: "POST", body: input, auth: false }),

  login: (input: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: input, auth: false }),

  searchProducts: (query: string) =>
    request<ProductRecommendationDto[]>(`/products/search?query=${encodeURIComponent(query)}`),

  sellerProducts: (sellerId: number) =>
    request<ProductResponseDto[]>(`/products/seller/${sellerId}`),

  createProduct: (input: {
    sellerId: number;
    title: string;
    description: string;
    price: number;
    socialPostUrl: string;
  }) => request<ProductResponseDto>("/products/seller", { method: "POST", body: input }),

  scamCheck: (input: {
    sellerId: number;
    title: string;
    description: string;
    price: number;
    socialPostUrl: string;
  }) => request<AiScamDetectionResult>("/ai/scam-detection", { method: "POST", body: input }),

  checkout: (input: {
    productId: number;
    buyerId: number;
    amount: number;
    senderPhone: string;
    screenshot: File;
  }) => {
    const form = new FormData();
    form.append("productId", String(input.productId));
    form.append("buyerId", String(input.buyerId));
    form.append("amount", String(input.amount));
    form.append("senderPhone", input.senderPhone);
    form.append("screenshot", input.screenshot);
    return request<TransactionResponseDto>("/transactions/checkout", {
      method: "POST",
      body: form,
    });
  },

  sellerTransactions: (sellerId: number) =>
    request<TransactionResponseDto[]>(`/transactions/seller/${sellerId}`),

  approveTransaction: (transactionId: number, sellerId: number) =>
    request<TransactionResponseDto>(`/transactions/${transactionId}/approve/${sellerId}`, {
      method: "POST",
    }),

  transactionQr: (transactionId: number) =>
    request<unknown>(`/transactions/${transactionId}/qr`),

  releaseTransaction: (input: { transactionId: number; qrToken: string }) =>
    request<TransactionResponseDto>("/transactions/release", { method: "POST", body: input }),

  cancelTransaction: (input: { transactionId: number; reason: string }) =>
    request<TransactionResponseDto>("/transactions/cancel", { method: "POST", body: input }),
};

export const statusLabel: Record<TransactionStatus, string> = {
  PENDING_VERIFICATION: "Verifying payment",
  ESCROW_LOCKED: "Protected in escrow",
  COMPLETED: "Completed",
  CANCELLED_AND_REFUNDED: "Cancelled & refunded",
};

export function formatMoney(amount: number | null | undefined) {
  if (amount == null) return "$0";
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
