import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  Box,
  Home,
  Package,
  Search,
  Store,
  User,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/matchguard-logo.png.asset.json";

const customerNav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/account", label: "Account", icon: User },
] as const;

const sellerNav = [
  { to: "/seller", label: "Home", icon: Home },
  { to: "/seller/orders", label: "Orders", icon: Package },
  { to: "/seller/inventory", label: "Inventory", icon: Box },
  { to: "/seller/shop", label: "Shop", icon: Store },
] as const;

export function AppShell({
  children,
  back,
  requireRole,
  hideNav,
}: {
  children: ReactNode;
  back?: string;
  requireRole?: "CUSTOMER" | "SELLER";
  hideNav?: boolean;
}) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      void navigate({ to: "/auth" });
      return;
    }
    if (requireRole && user.role !== requireRole) {
      void navigate({ to: user.role === "SELLER" ? "/seller" : "/" });
    }
  }, [ready, user, requireRole, navigate]);

  const tabs = user?.role === "SELLER" ? sellerNav : customerNav;

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-24">
      <header className="sticky top-0 z-20 bg-background/90 px-4 pt-4 pb-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <Link
            to={user?.role === "SELLER" ? "/seller" : "/"}
            className="flex items-center gap-2.5 text-xl font-bold tracking-tight"
          >
            <span className="bg-escrow flex size-9 items-center justify-center overflow-hidden rounded-full">
              <img
                src={logoAsset.url}
                alt="MatchGuard"
                className="size-6 object-contain"
              />
            </span>
            MatchGuard
          </Link>
          <span className="rounded-full bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground">
            {user ? `${user.role === "SELLER" ? "Seller" : "Buyer"} · ${user.name.split(" ")[0]}` : "Guest"}
          </span>
        </div>
      </header>

      <main className="px-4 pb-6">
        {back && (
          <Link
            to={back}
            className="mb-3 flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground"
            aria-label="Go back"
          >
            <ArrowLeft className="size-4" />
          </Link>
        )}
        {ready && user ? children : <ShellSkeleton />}
      </main>

      {!hideNav && (
        <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-border bg-card/97 px-2 pt-2 pb-3 backdrop-blur">
          <div className="flex items-stretch justify-around">
            {tabs.map(({ to, label, icon: Icon }) => {
              const active =
                to === "/" || to === "/seller" ? pathname === to : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex w-17 flex-col items-center gap-1 rounded-lg py-1 text-[10px]",
                    active ? "font-bold text-brand-teal" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

function ShellSkeleton() {
  return (
    <div className="space-y-3 pt-6">
      <div className="h-6 w-32 animate-pulse rounded-full bg-muted" />
      <div className="h-40 animate-pulse rounded-3xl bg-muted" />
      <div className="h-24 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}
