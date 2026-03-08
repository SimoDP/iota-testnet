"use client"

import { Fingerprint, ScanLine, AlertTriangle } from "lucide-react"

const metrics = [
  {
    label: "Total Minted Twins",
    value: "12,847",
    change: "+124 this month",
    icon: Fingerprint,
    iconColor: "text-primary",
  },
  {
    label: "Global Scans Today",
    value: "3,291",
    change: "+18% vs yesterday",
    icon: ScanLine,
    iconColor: "text-foreground",
  },
  {
    label: "Active Stolen Reports",
    value: "3",
    change: "1 recovered this week",
    icon: AlertTriangle,
    iconColor: "text-destructive",
  },
]

export function MetricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              {metric.label}
            </span>
            <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
          </div>
          <p className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            {metric.value}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{metric.change}</p>
        </div>
      ))}
    </div>
  )
}
