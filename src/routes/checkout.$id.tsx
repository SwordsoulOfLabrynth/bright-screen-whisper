import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Upload } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { api, formatMoney } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cacheProducts, getCachedProduct, saveOrder } from "@/lib/local-store";

export const Route = createFileRoute("/checkout/$id")({
  head: () => ({
    meta: [
      { title: "Pay safely — MatchGuard escrow checkout" },
      {
        name: "description",
        content:
          "Transfer to the MatchGuard escrow account and upload your payment receipt. Funds release only after the handover QR is scanned.",
      },
      { property: "og:title", content: "Pay safely — MatchGuard escrow checkout" },
      {
        property: "og:description",
        content: "Upload your transfer receipt and lock the payment in escrow.",
      },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { id } = Route.useParams();
  const productId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const productQuery = useQuery({
    queryKey: ["listing", productId],
    queryFn: async () => {
      const cached = getCachedProduct(productId);
      if (cached) return cached;
      const results = await api.searchProducts("all listings");
      cacheProducts(results);
      return results.find((p) => p.productId === productId) ?? null;
    },
  });

  const product = productQuery.data;
  const fee = product ? Math.round(product.price * 0.02) : 0;
  const total = product ? product.price + fee : 0;

  const checkout = useMutation({
    mutationFn: async () => {
      if (!user || !product || !file) throw new Error("Add your receipt screenshot first");
      return api.checkout({
        productId: product.productId,
        buyerId: user.id,
        amount: total,
        senderPhone: phone,
        screenshot: file,
      });
    },
    onSuccess: (order) => {
      saveOrder(order);
      void navigate({ to: "/orders/$id", params: { id: String(order.id) } });
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Checkout failed"),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    checkout.mutate();
  }

  return (
    <AppShell requireRole="CUSTOMER" back="/search">
      <h1 className="text-[27px] font-bold tracking-tight">Pay safely</h1>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        Transfer the total to the MatchGuard escrow account, then upload the receipt.
      </p>

      <div className="mt-5 rounded-2xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">{product?.title ?? "Listing"}</h2>
        <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
          <Row label="Item price" value={formatMoney(product?.price ?? 0)} />
          <Row label="Escrow protection fee" value={formatMoney(fee)} />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm font-bold">
          <span>Total to transfer</span>
          <span>{formatMoney(total)}</span>
        </div>
      </div>

      <div className="mt-3 flex gap-2.5 rounded-2xl bg-warning p-3.5 text-xs leading-snug text-warning-foreground">
        <ShieldCheck className="size-4 shrink-0" />
        <span>
          Send to <strong>MatchGuard Escrow · KBZPay 09 777 000 111</strong>. Never pay the seller
          directly.
        </span>
      </div>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
            Sender phone
          </span>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09 xxx xxx xxx"
            className="w-full rounded-xl border border-border bg-card px-3.5 py-3 text-sm outline-none focus:border-ring"
          />
        </label>

        <label className="grid min-h-30 cursor-pointer place-items-center rounded-2xl border-[1.5px] border-dashed border-ring/40 bg-card/60 p-4 text-center">
          <input
            type="file"
            accept="image/*"
            required
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Upload className="size-5 text-brand-teal" />
          <strong className="mt-1.5 block text-[13px] text-brand-teal">
            {file ? file.name : "Upload transfer receipt"}
          </strong>
          <span className="text-[11px] text-muted-foreground">
            Guardian reads the amount and sender automatically
          </span>
        </label>

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={checkout.isPending}
          className="min-h-12 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {checkout.isPending ? "Locking funds…" : "Submit receipt & lock escrow"}
        </button>
      </form>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
