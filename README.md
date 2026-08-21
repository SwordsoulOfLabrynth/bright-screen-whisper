# MatchGuard

**MatchGuard** is a mobile-first escrow marketplace for social-commerce buyers and sellers in Myanmar. Buyers describe what they need in plain language, Guardian AI ranks verified social posts by fit and trust score, and every payment is held in escrow until the goods are handed over and the QR code is scanned.

- **Live app:** https://bright-screen-whisper.lovable.app
- **Editor:** https://lovable.dev/projects/5626d956-e5f2-4c48-9d1e-77c76e14b13a
- **Backend repo:** https://github.com/YeZawHlaing/MatchGuard
- **API docs (Swagger):** https://www.allkur.uk/swagger-ui/index.html

All prices across the app are in **MMK (Myanmar Kyat)**.

---

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Getting started](#getting-started)
4. [Project structure](#project-structure)
5. [Backend integration](#backend-integration)
6. [Frontend-only modules](#frontend-only-modules)
7. [Roles and screens](#roles-and-screens)
8. [Escrow flow](#escrow-flow)
9. [Admin console](#admin-console)
10. [Conventions](#conventions)

---

## Features

### Buyer (CUSTOMER)
- Natural-language **AI search** with fit score, trust score and compatibility insight per listing.
- Listing review screen with Guardian scam analysis and a link to the original social post.
- **Escrow checkout**: transfer to the MatchGuard escrow account, upload the payment receipt, funds lock in escrow.
- Order tracking with live status polling (`Verifying payment → Protected in escrow → Completed`).
- **Confirm & release** by scanning / entering the seller's handover QR token.
- **Subscription plans** (Starter / Guardian Plus / Guardian Pro) for AI search quota.

### Seller (SELLER)
- Dashboard with protected volume, pending approvals and released payouts.
- Inventory management with an **AI scam pre-check** before publishing a listing.
- Order queue: inspect the buyer's **payment receipt screenshot**, approve or cancel.
- **Handover QR** generation for the release step.
- Mandatory **5% platform fee agreement** at registration; net payout shown in the shop screen.

### Admin
- Passcode-gated console at `/admin` (default passcode `matchguard-admin`).
- Overview of GMV, escrow balance, revenue and subscription mix.
- Transaction log, seller directory, customer directory and reports queue.
- Moderation actions: **ban / reinstate / flag** sellers and customers, with reports filed automatically.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | TanStack Start v1 (React 19, SSR-capable, file-based routing) |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 via `src/styles.css` theme tokens |
| Data | TanStack Query |
| Icons | lucide-react |
| Backend | Spring Boot API at `https://www.allkur.uk/api` (separate repo) |

---

## Getting started

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

The dev server runs on `http://localhost:8080`.

Useful scripts:

```sh
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # eslint
```

---

## Project structure

```text
src/
  components/        AppShell, ListingCard, SellerOrderCard, ReceiptViewer, ui/ (shadcn)
  lib/
    api.ts           Typed client for the Spring backend + formatMoney (MMK)
    auth.tsx         Session context: login, register, role guards, JWT storage
    local-store.ts   Client cache for products and orders
    demo-catalog.ts  Showcase listings across categories (frontend only)
    plans.ts         Subscription plan definitions + per-user selection
    admin-data.ts    Representative admin dataset
    admin-store.ts   Bans, flags and reports (localStorage)
    buyer-orders.ts  Buyer-side order status resolution
  routes/
    index.tsx            Home dashboard
    auth.tsx             Sign in / register (buyer or seller)
    search.tsx           AI search
    listing.$id.tsx      Listing review
    checkout.$id.tsx     Escrow checkout
    orders.index.tsx     Buyer orders
    orders.$id.tsx       Order detail + confirm & release
    plans.tsx            Subscription plans
    account.tsx          Buyer account
    seller.*.tsx         Seller dashboard, inventory, orders, QR, shop
    admin.tsx            Admin console
    api/public/mg.$.ts   Server proxy to the Spring API (CORS bypass)
    api/public/img.ts    Image proxy for receipt screenshots
```

---

## Backend integration

All calls go through a same-origin proxy so the browser never hits CORS or referrer blocks:

```
browser → /api/public/mg/**  → https://www.allkur.uk/api/**
browser → /api/public/img?url=... → remote receipt image
```

`src/lib/api.ts` wraps every endpoint, attaches the JWT `Authorization` header, retries transient blank `403/502/503/504` responses, and refreshes the token on `401`.

Endpoints used:

| Method | Path | Used by |
| --- | --- | --- |
| POST | `/auth/register`, `/auth/login`, `/auth/refresh` | Auth |
| GET | `/products/search?query=` | AI search |
| GET | `/products/seller/{sellerId}` | Seller inventory |
| POST | `/products/seller` | Create listing |
| POST | `/ai/scam-detection` | Pre-publish scam check |
| POST | `/transactions/checkout` (multipart) | Escrow checkout |
| GET | `/transactions/buyer/{buyerId}` | Buyer orders |
| GET | `/transactions/seller/{sellerId}` | Seller orders |
| POST | `/transactions/{id}/approve/{sellerId}` | Seller approval |
| PATCH | `/transactions/{id}/status` | Status update |
| GET | `/transactions/{id}/qr` (image/png) | Handover QR |
| POST | `/transactions/release`, `/transactions/cancel` | Release / refund |

Sessions are stored in `localStorage` under `matchguard.session`.

---

## Frontend-only modules

These exist because the backend has no matching endpoints yet. They are clearly isolated so they can be swapped for real APIs later:

- `demo-catalog.ts` — 18 showcase listings (phones, audio, cameras, fashion, beauty, kitchen, baby, sport, music) merged into search results and de-duplicated against live backend data by product id.
- `plans.ts` — subscription tiers and the selected plan per user.
- `admin-data.ts` / `admin-store.ts` — admin dataset, bans, flags and reports.
- `local-store.ts` — product and order cache used when an endpoint is unavailable.

---

## Roles and screens

| Role | Entry | Main tabs |
| --- | --- | --- |
| CUSTOMER | `/auth` → `/` | Home, Search, Orders, Plans, Account |
| SELLER | `/auth` → `/seller` | Dashboard, Inventory, Orders, Shop |
| ADMIN | `/admin` (passcode) | Overview, Transactions, Sellers, Customers, Reports |

---

## Escrow flow

```text
Buyer pays escrow account   →  uploads receipt        →  PENDING_VERIFICATION
Guardian + seller verify    →  seller approves        →  ESCROW_LOCKED
Handover in person          →  buyer scans seller QR  →  COMPLETED  (seller paid, minus 5%)
Dispute or no-show          →  cancel                 →  CANCELLED_AND_REFUNDED
```

---

## Admin console

Open `/admin` and enter the passcode (`matchguard-admin`). The console is a moderation surface: search and filter transactions, review seller and customer accounts, ban or reinstate them, and work the reports queue. Actions persist locally until backend admin endpoints exist.

---

## Conventions

- **Currency:** MMK everywhere; format through `formatMoney()` in `src/lib/api.ts` — never hardcode a symbol.
- **Design tokens:** colors, shadows and gradients live in `src/styles.css`; components use semantic classes only.
- **Routing:** file-based under `src/routes/`; `src/routeTree.gen.ts` is generated — do not edit.
- **Mobile-first:** the layout targets a phone viewport; `AppShell` provides the header, bottom navigation and role guards.

---

Built with [Lovable](https://lovable.dev). Every change in the editor is committed straight to this repository, and pushes to `main` sync back into Lovable.
