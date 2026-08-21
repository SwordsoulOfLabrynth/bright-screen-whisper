import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to MatchGuard — Escrow-protected social shopping" },
      {
        name: "description",
        content:
          "Create a MatchGuard buyer or seller account to shop social posts with AI matching and escrow-protected payments.",
      },
      { property: "og:title", content: "Sign in to MatchGuard" },
      {
        property: "og:description",
        content: "Buyer and seller accounts for escrow-protected social commerce.",
      },
    ],
  }),
  component: AuthScreen,
});

function AuthScreen() {
  const { user, ready, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [feeAgreed, setFeeAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) void navigate({ to: user.role === "SELLER" ? "/seller" : "/" });
  }, [ready, user, navigate]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (mode === "register" && role === "SELLER" && !feeAgreed) {
      setError("Please accept the 5% platform fee to create a seller account.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const session =
        mode === "login"
          ? await login({ email: form.email, password: form.password })
          : await register({ ...form, role });
      void navigate({ to: session.role === "SELLER" ? "/seller" : "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }


  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-10">
      <span className="bg-escrow flex size-12 items-center justify-center rounded-2xl text-primary-foreground">
        <ShieldCheck className="size-6" />
      </span>
      <h1 className="mt-5 text-3xl font-bold tracking-tight">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        MatchGuard holds every payment in escrow until the handover QR is scanned.
      </p>

      <div className="mt-6 flex gap-2 rounded-2xl bg-accent p-1">
        {(["login", "register"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={cn(
              "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors",
              mode === value ? "bg-card text-foreground shadow-card" : "text-accent-foreground",
            )}
          >
            {value === "login" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3">
        {mode === "register" && (
          <>
            <Field
              label="Full name"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
            />
            <div>
              <p className="mb-2 text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
                I am a
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["CUSTOMER", "SELLER"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    className={cn(
                      "rounded-xl border py-3 text-sm font-semibold",
                      role === value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {value === "CUSTOMER" ? "Buyer" : "Seller"}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => setForm((f) => ({ ...f, email: v }))}
        />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(v) => setForm((f) => ({ ...f, password: v }))}
        />

        {mode === "register" && role === "SELLER" && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-2 text-sm font-bold">
              <Percent className="size-4 text-brand-teal" /> 5% platform fee
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              MatchGuard deducts a 5% service fee from every completed transaction before your
              escrow payout is released. Example: a $100 sale pays out $95.
            </p>
            <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-xs leading-snug">
              <input
                type="checkbox"
                checked={feeAgreed}
                onChange={(e) => setFeeAgreed(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-primary"
              />
              <span>
                I understand and agree that MatchGuard charges 5% of every transaction I complete as
                a seller.
              </span>
            </label>
          </div>
        )}



        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-2 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm outline-none focus:border-ring"
      />
    </label>
  );
}
