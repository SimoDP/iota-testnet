"use client"

import { CheckCircle2, AlertTriangle, Clock } from "lucide-react"

const activityData = [
  {
    id: "#LV-10291",
    asset: "Capucines MM",
    location: "Milan — Via Montenapoleone Boutique",
    timestamp: "2026-02-20 14:32:07 UTC",
    status: "verified" as const,
  },
  {
    id: "#KR-08833",
    asset: "Dionysus GG Supreme",
    location: "Tokyo — Ginza Flagship",
    timestamp: "2026-02-20 14:28:41 UTC",
    status: "verified" as const,
  },
  {
    id: "#PR-05520",
    asset: "Re-Edition 2005",
    location: "Paris — Rue du Faubourg Saint-Honore",
    timestamp: "2026-02-20 14:25:19 UTC",
    status: "pending" as const,
  },
  {
    id: "#LV-08922",
    asset: "Neverfull MM",
    location: "Milan — Multiple IPs Detected",
    timestamp: "2026-02-20 14:21:55 UTC",
    status: "flagged" as const,
  },
  {
    id: "#RM-03177",
    asset: "Santos de Cartier",
    location: "Dubai — The Dubai Mall Boutique",
    timestamp: "2026-02-20 14:18:30 UTC",
    status: "verified" as const,
  },
  {
    id: "#KR-11004",
    asset: "Bamboo 1947 Handle",
    location: "New York — Fifth Avenue Flagship",
    timestamp: "2026-02-20 14:12:08 UTC",
    status: "verified" as const,
  },
]

const statusConfig = {
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    className: "text-success bg-success/10",
  },
  flagged: {
    label: "Flagged",
    icon: AlertTriangle,
    className: "text-destructive bg-destructive/10",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-primary bg-primary/10",
  },
}

export function ActivityTable() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Recent Activity
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Real-time scan log from all connected boutiques
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          Live
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Asset ID
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Product
              </th>
              <th className="hidden px-6 py-3 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground md:table-cell">
                Location
              </th>
              <th className="hidden px-6 py-3 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground lg:table-cell">
                Timestamp
              </th>
              <th className="px-6 py-3 text-right text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {activityData.map((item, index) => {
              const status = statusConfig[item.status]
              const StatusIcon = status.icon
              return (
                <tr
                  key={index}
                  className="border-b border-border/50 transition-colors last:border-0 hover:bg-secondary/50"
                >
                  <td className="px-6 py-3.5">
                    <span className="font-mono text-xs font-medium text-primary">
                      {item.id}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-sm text-foreground">
                      {item.asset}
                    </span>
                  </td>
                  <td className="hidden px-6 py-3.5 md:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {item.location}
                    </span>
                  </td>
                  <td className="hidden px-6 py-3.5 lg:table-cell">
                    <span className="font-mono text-xs text-muted-foreground">
                      {item.timestamp}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${status.className}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
