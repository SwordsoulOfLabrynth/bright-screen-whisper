import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, ShieldCheck, Store, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/trustguard", label: "TrustGuard", icon: ShieldCheck },
  { to: "/seller", label: "Shop", icon: Store },
  { to: "/pricing", label: "Plans", icon: Sparkles },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-escrow flex size-8 items-center justify-center rounded-full text-primary-foreground">
              <ShieldCheck className="size-4" />
            </span>
            <span className="text-lg font-bold tracking-tight">MatchGuard</span>
          </Link>
          <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
            Plus · 128 tokens
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-stretch gap-1 px-2 py-2">
          {tabs.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
