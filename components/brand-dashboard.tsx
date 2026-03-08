"use client"

import { useState } from "react"
import { MetricCards } from "@/components/metric-cards"
import { ActivityTable } from "@/components/activity-table"
import { AnomalyAlert } from "@/components/anomaly-alert"
import { MintDialog } from "@/components/mint-dialog"
import { Plus } from "lucide-react"

export function BrandDashboard() {
  const [mintOpen, setMintOpen] = useState(false)

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Page Title */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.2em] text-ember-dim">
            Enterprise Dashboard
          </p>
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Brand Command Center
          </h2>
        </div>
        <button
          onClick={() => setMintOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Mint New Luxury Asset
        </button>
      </div>

      {/* Metrics */}
      <MetricCards />

      {/* Alert */}
      <div className="mt-6">
        <AnomalyAlert />
      </div>

      {/* Activity Table */}
      <div className="mt-8">
        <ActivityTable />
      </div>

      {/* Mint Dialog */}
      <MintDialog open={mintOpen} onOpenChange={setMintOpen} />
    </div>
  )
}
