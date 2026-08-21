import { createFileRoute } from "@tanstack/react-router";
import {
  BadgeDollarSign,
  Flag,
  LayoutDashboard,
  Lock,
  Receipt,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { formatMoney, statusLabel } from "@/lib/api";
import { adminSubscribers, adminTransactions } from "@/lib/admin-data";
import { useAdminState, type IssueReport } from "@/lib/admin-store";
import { PLANS, SELLER_FEE_RATE, sellerFee } from "@/lib/plans";
import { cn } from "@/lib/utils";

const ADMIN_KEY = "matchguard.admin";
const ADMIN_PASSCODE = "matchguard-admin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin console — MatchGuard" },
      {
        name: "description",
        content:
          "MatchGuard admin console: platform escrow volume, 5% seller fees, transaction oversight, seller trust review and buyer subscriptions.",
      },
      { property: "og:title", content: "Admin console — MatchGuard" },
      {
        property: "og:description",
        content: "Escrow volume, seller fee revenue, trust review and subscription overview.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminConsole,
});

type Tab = "overview" | "transactions" | "sellers" | "reports" | "subscriptions";

function AdminConsole() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    setAuthed(window.localStorage.getItem(ADMIN_KEY) === "1");
  }, []);

  if (!authed) return <AdminGate onUnlock={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/92 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="bg-escrow flex size-9 items-center justify-center rounded-full text-primary-foreground">
              <ShieldCheck className="size-4.5" />
            </span>
            <div>
              <strong className="block text-base tracking-tight">MatchGuard Admin</strong>
              <span className="text-[11px] text-muted-foreground">Platform operations console</span>
            </div>
          </div>
          <button
            onClick={() => {
              window.localStorage.removeItem(ADMIN_KEY);
              setAuthed(false);
            }}
            className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-destructive"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        <nav className="flex flex-wrap gap-2">
          {(
            [
              ["overview", "Overview", LayoutDashboard],
              ["transactions", "Transactions", Receipt],
              ["sellers", "Sellers", Store],
              ["subscriptions", "Subscriptions", Users],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold",
                tab === id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-5">
          {tab === "overview" && <Overview />}
          {tab === "transactions" && <Transactions />}
          {tab === "sellers" && <Sellers />}
          {tab === "subscriptions" && <Subscriptions />}
        </div>
      </main>
    </div>
  );
}

function AdminGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (code.trim() !== ADMIN_PASSCODE) {
      setError("Incorrect passcode.");
      return;
    }
    window.localStorage.setItem(ADMIN_KEY, "1");
    onUnlock();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
      <span className="bg-escrow flex size-12 items-center justify-center rounded-2xl text-primary-foreground">
        <Lock className="size-6" />
      </span>
      <h1 className="mt-5 text-3xl font-bold tracking-tight">Admin console</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Restricted area. Enter the operations passcode to continue.
      </p>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Passcode"
          className="w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm outline-none focus:border-ring"
        />
        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground"
        >
          Unlock console
        </button>
      </form>
      <p className="mt-3 text-[11px] text-muted-foreground">Demo passcode: matchguard-admin</p>
    </div>
  );
}

function Overview() {
  const { sellers } = useAdminState();
  const escrow = adminTransactions
    .filter((t) => t.status === "ESCROW_LOCKED")
    .reduce((s, t) => s + t.amount, 0);
  const completed = adminTransactions.filter((t) => t.status === "COMPLETED");
  const gmv = adminTransactions.reduce((s, t) => s + t.amount, 0);
  const revenue = completed.reduce((s, t) => s + sellerFee(t.amount), 0);
  const paying = adminSubscribers.filter((s) => s.plan !== "free").length;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total GMV" value={formatMoney(gmv)} />
        <Stat label="Held in escrow" value={formatMoney(escrow)} />
        <Stat
          label={`Fee revenue (${Math.round(SELLER_FEE_RATE * 100)}%)`}
          value={`$${revenue.toFixed(2)}`}
        />
        <Stat label="Paying subscribers" value={String(paying)} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Seller fee breakdown">
          <ul className="space-y-2.5">
            {completed.map((t) => (
              <li key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  #{t.id} · {t.seller}
                </span>
                <span className="font-semibold">
                  {formatMoney(t.amount)}{" "}
                  <span className="text-brand-teal">+${sellerFee(t.amount).toFixed(2)}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <BadgeDollarSign className="size-3.5" /> 5% is deducted from each seller payout at
            release.
          </p>
        </Card>

        <Card title="Trust review queue">
          <ul className="space-y-2.5">
            {sellers
              .filter((s) => s.status !== "ACTIVE")
              .map((s) => (
                <li key={s.id} className="flex items-center justify-between text-sm">
                  <span>{s.name}</span>
                  <span className="text-xs font-bold text-destructive">
                    TrustScore {s.trustScore} · {s.status}
                  </span>
                </li>
              ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Transactions() {
  return (
    <Card title="All transactions">
      <Table head={["ID", "Product", "Buyer", "Seller", "Amount", "Fee", "Status"]}>
        {adminTransactions.map((t) => (
          <tr key={t.id} className="border-t border-border">
            <Td>#{t.id}</Td>
            <Td>{t.product}</Td>
            <Td>{t.buyer}</Td>
            <Td>{t.seller}</Td>
            <Td>{formatMoney(t.amount)}</Td>
            <Td>${sellerFee(t.amount).toFixed(2)}</Td>
            <Td>
              <span className="rounded-full bg-accent px-2 py-1 text-[10px] font-bold text-accent-foreground">
                {statusLabel[t.status]}
              </span>
            </Td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

function Sellers() {
  const { sellers, setSellerStatus, addReport } = useAdminState();

  return (
    <Card title="Sellers">
      <Table
        head={["Seller", "Social shop", "Listings", "TrustScore", "Volume", "Status", "Actions"]}
      >
        {sellers.map((s) => (
          <tr key={s.id} className="border-t border-border">
            <Td>{s.name}</Td>
            <Td>{s.shop}</Td>
            <Td>{s.listings}</Td>
            <Td>{s.trustScore}</Td>
            <Td>{formatMoney(s.volume)}</Td>
            <Td>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-[10px] font-bold",
                  s.status === "ACTIVE"
                    ? "bg-accent text-accent-foreground"
                    : s.status === "REVIEW"
                      ? "bg-warning text-warning-foreground"
                      : "bg-destructive/10 text-destructive",
                )}
              >
                {s.status}
              </span>
            </Td>
            <Td>
              <div className="flex flex-wrap gap-1.5">
                {s.status !== "SUSPENDED" ? (
                  <button
                    onClick={() => {
                      setSellerStatus(s.id, "SUSPENDED");
                      addReport({
                        subject: `${s.name} banned by admin`,
                        category: "SCAM",
                        target: s.name,
                        severity: "HIGH",
                        notes: "Account suspended from the seller table.",
                      });
                    }}
                    className="rounded-lg bg-destructive px-2.5 py-1.5 text-[10px] font-bold text-destructive-foreground"
                  >
                    Ban
                  </button>
                ) : (
                  <button
                    onClick={() => setSellerStatus(s.id, "ACTIVE")}
                    className="rounded-lg bg-success px-2.5 py-1.5 text-[10px] font-bold text-success-foreground"
                  >
                    Reinstate
                  </button>
                )}
                {s.status !== "REVIEW" && s.status !== "SUSPENDED" && (
                  <button
                    onClick={() => setSellerStatus(s.id, "REVIEW")}
                    className="rounded-lg border border-border px-2.5 py-1.5 text-[10px] font-bold"
                  >
                    Flag for review
                  </button>
                )}
              </div>
            </Td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

function Reports() {
  const { reports, addReport, setReportStatus, deleteReport, sellers } = useAdminState();
  const [subject, setSubject] = useState("");
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState<IssueReport["category"]>("SCAM");
  const [severity, setSeverity] = useState<IssueReport["severity"]>("MEDIUM");
  const [notes, setNotes] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!subject.trim()) return;
    addReport({ subject: subject.trim(), target: target.trim() || "Platform", category, severity, notes: notes.trim() });
    setSubject("");
    setTarget("");
    setNotes("");
  }

  const open = reports.filter((r) => r.status === "OPEN");

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card title={`Issue reports (${open.length} open)`}>
        <ul className="space-y-2.5">
          {reports.length === 0 && (
            <li className="py-6 text-center text-xs text-muted-foreground">No reports filed.</li>
          )}
          {reports.map((r) => (
            <li key={r.id} className="rounded-xl border border-border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-sm">{r.subject}</strong>
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-[10px] font-bold",
                    r.status === "OPEN"
                      ? "bg-warning text-warning-foreground"
                      : "bg-success text-success-foreground",
                  )}
                >
                  {r.status}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {r.category} · {r.severity} · {r.target} · {r.createdAt}
              </p>
              {r.notes && <p className="mt-1.5 text-xs">{r.notes}</p>}
              <div className="mt-2.5 flex gap-2">
                <button
                  onClick={() => setReportStatus(r.id, r.status === "OPEN" ? "RESOLVED" : "OPEN")}
                  className="rounded-lg border border-border px-2.5 py-1.5 text-[10px] font-bold"
                >
                  {r.status === "OPEN" ? "Mark resolved" : "Reopen"}
                </button>
                <button
                  onClick={() => deleteReport(r.id)}
                  className="rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-destructive"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="File a new report">
        <form onSubmit={submit} className="space-y-2.5">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
          />
          <input
            list="admin-report-targets"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Target (seller, order…)"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
          />
          <datalist id="admin-report-targets">
            {sellers.map((s) => (
              <option key={s.id} value={s.name} />
            ))}
          </datalist>
          <div className="grid grid-cols-2 gap-2.5">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IssueReport["category"])}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            >
              <option value="SCAM">Scam</option>
              <option value="PAYMENT">Payment</option>
              <option value="DELIVERY">Delivery</option>
              <option value="OTHER">Other</option>
            </select>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as IssueReport["severity"])}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Notes"
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground"
          >
            File report
          </button>
        </form>
      </Card>
    </div>
  );
}

function Subscriptions() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <Stat
            key={plan.id}
            label={`${plan.name} members`}
            value={String(adminSubscribers.filter((s) => s.plan === plan.id).length)}
          />
        ))}
      </div>
      <Card title="Subscribers">
        <Table head={["Buyer", "Email", "Plan", "Member since"]}>
          {adminSubscribers.map((s) => (
            <tr key={s.id} className="border-t border-border">
              <Td>{s.name}</Td>
              <Td>{s.email}</Td>
              <Td>{PLANS.find((p) => p.id === s.plan)?.name}</Td>
              <Td>{s.since}</Td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <span className="text-[10px] font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <strong className="mt-1.5 block text-2xl tracking-tight">{value}</strong>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <h2 className="mb-3 text-[15px] font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="pb-2 text-[10px] font-bold tracking-wide text-muted-foreground uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="py-2.5 pr-3">{children}</td>;
}
