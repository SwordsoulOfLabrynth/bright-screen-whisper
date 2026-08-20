import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, ShieldCheck, X } from "lucide-react";

type Msg = { from: "bot" | "user"; text: string };

const quickPrompts = [
  "How does TrustGuard escrow work?",
  "Find me a 1440p gaming PC",
  "What do AI tokens cost?",
];

function reply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("escrow") || q.includes("trustguard") || q.includes("safe"))
    return "TrustGuard holds your payment in a vault. The seller generates a one-time QR at handover, you scan it, and only then is the payout released — minus a 2.5% fee.";
  if (q.includes("token") || q.includes("price") || q.includes("plan"))
    return "Free gives 10 AI searches a month, Plus 150 with deep compatibility reviews, Pro is unlimited with sponsored-listing credits. See the Plans tab.";
  if (q.includes("seller") || q.includes("shop") || q.includes("sell"))
    return "Link your Facebook or TikTok page in the Shop tab, and your posts get recorded as listings automatically. Funds land in your TrustGuard balance the moment a buyer locks payment.";
  if (q.includes("find") || q.includes("search") || q.includes("pc") || q.includes("phone"))
    return "Tell me your budget and must-haves and I'll match them against live social posts. Try: \"quiet 1440p gaming PC under $1,300, must have Wi-Fi 6\".";
  return "I can help with matching listings to your requirements, explaining TrustGuard escrow, or walking you through seller payouts. What are you after?";
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text: "Hi, I'm Guardian — MatchGuard's shopping assistant. Ask me about a product, escrow, or payouts.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, open]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { from: "user", text: value }]);
    setInput("");
    setTimeout(() => setMessages((m) => [...m, { from: "bot", text: reply(value) }]), 400);
  };

  return (
    <>
      {open && (
        <div className="shadow-card fixed bottom-40 right-4 z-40 flex h-[26rem] w-[min(21rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <div className="bg-escrow flex items-center justify-between px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              <div>
                <p className="text-sm font-semibold leading-tight">Guardian assistant</p>
                <p className="text-[11px] text-primary-foreground/75">AI matching · escrow help</p>
              </div>
            </div>
            <button aria-label="Close chat" onClick={() => setOpen(false)}>
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.from === "user"
                    ? "ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary px-3 py-2 text-sm text-secondary-foreground"
                }
              >
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="flex flex-wrap gap-1.5 px-3 pb-2">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {p}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border px-3 py-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Guardian…"
              className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="bg-escrow rounded-xl p-2 text-primary-foreground"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="bg-escrow shadow-card fixed bottom-20 right-4 z-40 flex size-14 items-center justify-center rounded-full text-primary-foreground transition-transform hover:scale-105"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </>
  );
}
