import { createFileRoute, Link } from "@tanstack/react-router";
import { Banknote, QrCode, ShieldCheck, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/trustguard")({
  head: () => ({
    meta: [
      { title: "TrustGuard escrow — How MatchGuard protects meetups" },
      {
        name: "description",
        content:
          "TrustGuard locks buyer funds, issues a one-time handover QR, and releases payout to the seller minus a transparent 2.5% fee.",
      },
      { property: "og:title", content: "TrustGuard escrow — Built for meetups, not boardrooms" },
      {
        property: "og:description",
        content: "Funds locked, QR handover, buyer scan, payout released. Escrow for social selling.",
      },
    ],
  }),
  component: TrustGuardPage,
});

const steps = [
  { title: "Funds locked", body: "Buyer pays into the TrustGuard vault. The seller can see it, not touch it." },
  { title: "Handover", body: "Seller generates a one-time QR at meetup or on dispatch." },
  { title: "Buyer scans", body: "Scanning confirms the item is in hand and matches the listing." },
  { title: "Payout released", body: "Funds settle to the seller minus the 2.5% escrow fee." },
];

const features = [
  {
    icon: Wallet,
    title: "Money never goes direct",
    body: "Buyers pay MatchGuard, not a stranger's personal wallet. Sellers see funds confirmed before travelling.",
  },
  {
    icon: QrCode,
    title: "One-time QR handshake",
    body: "The release code is generated per order, expires in 5 minutes, and can only be scanned by the paying buyer.",
  },
  {
    icon: Banknote,
    title: "Transparent 2.5% fee",
    body: "Deducted from the released payout. Instant payout to a personal account costs 1% extra.",
  },
];

function TrustGuardPage() {
  return (
    <AppShell>
      <section className="bg-escrow shadow-card rounded-2xl p-5 text-primary-foreground">
        <ShieldCheck className="size-7" />
        <h1 className="mt-3 text-2xl font-bold leading-tight">
          Escrow built for meetups, not boardrooms
        </h1>
        <p className="mt-2 text-sm text-primary-foreground/80">
          Social selling breaks when trust breaks. TrustGuard sits between buyer and seller for the
          four minutes that actually matter.
        </p>
      </section>

      <h2 className="mt-6 font-semibold">The four-step flow</h2>
      <ol className="mt-3 space-y-3">
        {steps.map((step, i) => (
          <li key={step.title} className="shadow-card flex gap-3 rounded-2xl bg-card p-4">
            <span className="bg-escrow flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 space-y-3">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title} className="shadow-card rounded-2xl bg-card p-4">
            <Icon className="size-5 text-primary" />
            <p className="mt-2 font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <Link
        to="/"
        className="bg-cta mt-5 block rounded-2xl py-3.5 text-center font-semibold text-warning-foreground"
      >
        Find a protected listing
      </Link>
    </AppShell>
  );
}
