import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Box, Plus, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/AppShell";
import { api, formatMoney } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/seller/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — MatchGuard seller" },
      {
        name: "description",
        content:
          "Import Facebook and TikTok posts into MatchGuard, run Guardian scam analysis and publish escrow-ready listings.",
      },
      { property: "og:title", content: "Inventory — MatchGuard seller" },
      {
        property: "og:description",
        content: "Import social posts and publish escrow-ready listings.",
      },
    ],
  }),
  component: SellerInventory,
});

function SellerInventory() {
  const { user, ready } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "", socialPostUrl: "" });
  const [error, setError] = useState<string | null>(null);

  const products = useQuery({
    queryKey: ["seller-products", user?.id],
    queryFn: () => api.sellerProducts(user!.id),
    enabled: ready && user?.role === "SELLER",
  });

  const create = useMutation({
    mutationFn: () =>
      api.createProduct({
        sellerId: user!.id,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        socialPostUrl: form.socialPostUrl,
      }),
    onSuccess: () => {
      setForm({ title: "", description: "", price: "", socialPostUrl: "" });
      setOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["seller-products", user?.id] });
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Could not save product"),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    create.mutate();
  }

  return (
    <AppShell requireRole="SELLER">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-[27px] font-bold tracking-tight">Inventory</h1>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-10 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground"
        >
          <Plus className="size-4" /> {open ? "Close" : "Import post"}
        </button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Guardian scans every listing for scam signals before buyers see it.
      </p>

      {open && (
        <form onSubmit={submit} className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-4">
          <Field
            label="Title"
            value={form.title}
            onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          />
          <Field
            label="Description"
            value={form.description}
            onChange={(v) => setForm((f) => ({ ...f, description: v }))}
            textarea
          />
          <Field
            label="Price (MMK)"
            value={form.price}
            onChange={(v) => setForm((f) => ({ ...f, price: v }))}
            type="number"
          />
          <Field
            label="Social post URL"
            value={form.socialPostUrl}
            onChange={(v) => setForm((f) => ({ ...f, socialPostUrl: v }))}
          />
          {error && (
            <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={create.isPending}
            className="min-h-11 w-full rounded-xl bg-primary text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {create.isPending ? "Running Guardian scan…" : "Publish listing"}
          </button>
        </form>
      )}

      <div className="mt-4 space-y-2.5">
        {products.isPending && <div className="h-20 animate-pulse rounded-2xl bg-muted" />}
        {!products.isPending && products.data?.length === 0 && (
          <p className="rounded-2xl border border-border bg-card px-4 py-8 text-center text-xs text-muted-foreground">
            No listings yet. Import your first social post.
          </p>
        )}
        {products.data?.map((product) => (
          <article
            key={product.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <span className="grid size-11.5 shrink-0 place-items-center rounded-xl bg-accent text-brand-teal">
              <Box className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-[13px] font-semibold">{product.title}</h2>
              <p className="text-[11px] text-muted-foreground">
                {formatMoney(product.price)} · Trust {product.trustScore}
              </p>
            </div>
            <span className="ml-auto shrink-0">
              {product.isVerifiedSafe ? (
                <ShieldCheck className="size-4 text-brand-teal" />
              ) : (
                <ShieldAlert className="size-4 text-destructive" />
              )}
            </span>
          </article>
        ))}
      </div>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  textarea?: boolean;
}) {
  const className =
    "w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none focus:border-ring";
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      {textarea ? (
        <textarea
          required
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      ) : (
        <input
          required
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={className}
        />
      )}
    </label>
  );
}
