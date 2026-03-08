"use client"

import { AlertTriangle, X } from "lucide-react"
import { useState } from "react"

export function AnomalyAlert() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="flex items-start gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
        <AlertTriangle className="h-4 w-4 text-destructive" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-destructive">
            Stolen Report
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Status: STATUS_FLAGGED
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground">
          Owner-reported theft for{" "}
          <span className="font-mono font-semibold text-primary">
            Asset #8922
          </span>{" "}
          in Milan. Flagged on-chain via verified owner wallet. All subsequent scans will display theft warning to potential buyers.
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Dismiss alert"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
