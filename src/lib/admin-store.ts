// Frontend-only mutable admin state (moderation actions + issue reports).
import { useCallback, useEffect, useState } from "react";
import { adminSellers, type AdminSeller } from "@/lib/admin-data";

export type SellerStatus = AdminSeller["status"];

export type IssueReport = {
  id: number;
  subject: string;
  category: "SCAM" | "PAYMENT" | "DELIVERY" | "OTHER";
  target: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  notes: string;
  status: "OPEN" | "RESOLVED";
  createdAt: string;
};

type AdminState = {
  sellerStatus: Record<number, SellerStatus>;
  reports: IssueReport[];
};

const KEY = "matchguard.admin.state";

const seedReports: IssueReport[] = [
  {
    id: 9001,
    subject: "Buyer says AirPods never shipped",
    category: "DELIVERY",
    target: "QuickDeals",
    severity: "HIGH",
    notes: "Escrow refunded, seller suspended pending review.",
    status: "OPEN",
    createdAt: "2026-08-17",
  },
  {
    id: 9002,
    subject: "Receipt screenshot looks edited",
    category: "PAYMENT",
    target: "Order #1041",
    severity: "MEDIUM",
    notes: "Guardian flagged mismatched timestamp.",
    status: "OPEN",
    createdAt: "2026-08-20",
  },
];

const empty: AdminState = { sellerStatus: {}, reports: seedReports };

function read(): AdminState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...empty, ...(JSON.parse(raw) as AdminState) } : empty;
  } catch {
    return empty;
  }
}

function write(state: AdminState) {
  window.localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("matchguard-admin-state"));
}

export function useAdminState() {
  const [state, setState] = useState<AdminState>(empty);

  useEffect(() => {
    const sync = () => setState(read());
    sync();
    window.addEventListener("matchguard-admin-state", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("matchguard-admin-state", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setSellerStatus = useCallback((id: number, status: SellerStatus) => {
    const next = read();
    next.sellerStatus = { ...next.sellerStatus, [id]: status };
    write(next);
  }, []);

  const addReport = useCallback(
    (report: Omit<IssueReport, "id" | "status" | "createdAt">) => {
      const next = read();
      next.reports = [
        {
          ...report,
          id: Math.floor(Date.now() / 1000),
          status: "OPEN",
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...next.reports,
      ];
      write(next);
    },
    [],
  );

  const setReportStatus = useCallback((id: number, status: IssueReport["status"]) => {
    const next = read();
    next.reports = next.reports.map((r) => (r.id === id ? { ...r, status } : r));
    write(next);
  }, []);

  const deleteReport = useCallback((id: number) => {
    const next = read();
    next.reports = next.reports.filter((r) => r.id !== id);
    write(next);
  }, []);

  const sellers = adminSellers.map((s) => ({
    ...s,
    status: state.sellerStatus[s.id] ?? s.status,
  }));

  return { sellers, reports: state.reports, setSellerStatus, addReport, setReportStatus, deleteReport };
}
