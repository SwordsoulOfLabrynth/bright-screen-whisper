import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, LogOut, Mail, ShieldCheck, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { getPlan, PLANS, type PlanId } from "@/lib/plans";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — MatchGuard" },
      {
        name: "description",
        content:
          "Manage your MatchGuard buyer profile, escrow protection settings and sign-in session.",
      },
      { property: "og:title", content: "Account — MatchGuard" },
      { property: "og:description", content: "Your MatchGuard buyer profile and settings." },
    ],
  }),
  component: AccountScreen,
});

function AccountScreen() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppShell requireRole="CUSTOMER">
      <h1 className="text-[27px] font-bold tracking-tight">Account</h1>

      <div className="mt-5 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="bg-escrow grid size-12 place-items-center rounded-full text-primary-foreground">
            <User className="size-5" />
          </span>
          <div>
            <strong className="block text-base">{user?.name}</strong>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="size-3.5" /> {user?.email}
            </span>
          </div>
        </div>
      </div>

      <Link
        to="/plans"
        className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-card p-4"
      >
        <span className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-foreground">
            <Sparkles className="size-4" />
          </span>
          <span>
            <strong className="block text-sm">Subscription plan</strong>
            <span className="text-xs text-muted-foreground">
              {PLANS.find((p) => p.id === plan)?.name} · manage AI search limits
            </span>
          </span>
        </span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>

      <div className="mt-3 flex gap-2.5 rounded-2xl bg-accent p-4 text-xs leading-snug text-accent-foreground">
        <ShieldCheck className="size-4 shrink-0" />
        <span>
          Escrow protection is active on every order. Funds only move after you confirm handover.
        </span>
      </div>


      <button
        onClick={() => {
          logout();
          void navigate({ to: "/auth" });
        }}
        className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-bold text-destructive"
      >
        <LogOut className="size-4" /> Sign out
      </button>
    </AppShell>
  );
}
