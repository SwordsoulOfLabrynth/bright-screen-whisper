import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { trustBand } from "@/lib/api";
import { cn } from "@/lib/utils";

const tone = {
  safe: "bg-success text-success-foreground",
  caution: "bg-warning text-warning-foreground",
  risk: "bg-destructive/12 text-destructive",
} as const;

const bar = {
  safe: "bg-brand-teal",
  caution: "bg-warning-foreground/70",
  risk: "bg-destructive",
} as const;

const Icon = { safe: ShieldCheck, caution: ShieldQuestion, risk: ShieldAlert } as const;

/** Compact TrustScore pill used on cards and lists. */
export function TrustBadge({ score, className }: { score: number; className?: string }) {
  const band = trustBand(score);
  const Glyph = Icon[band.tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold",
        tone[band.tone],
        className,
      )}
    >
      <Glyph className="size-3.5" />
      {band.score} · {band.label}
    </span>
  );
}

/** Full TrustScore meter with Guardian advice, used on detail screens. */
export function TrustMeter({ score, note }: { score: number; note?: string | null }) {
  const band = trustBand(score);
  const Glyph = Icon[band.tone];
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-bold">
          <Glyph
            className={cn(
              "size-4",
              band.tone === "risk"
                ? "text-destructive"
                : band.tone === "caution"
                  ? "text-warning-foreground"
                  : "text-brand-teal",
            )}
          />
          Guardian TrustScore
        </span>
        <span className="text-lg font-bold">{band.score}/100</span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", bar[band.tone])}
          style={{ width: `${band.score}%` }}
        />
      </div>

      <p className="mt-2.5 text-xs font-semibold">{band.label}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note || band.advice}</p>
    </div>
  );
}
