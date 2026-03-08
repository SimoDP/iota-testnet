"use client"

import { useState } from "react"
import { BrandDashboard } from "@/components/brand-dashboard"
import { ConsumerApp } from "@/components/consumer-app"
import { Shield, Smartphone } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"brand" | "consumer">("brand")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary via-accent to-primary">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-accent/30 to-transparent" />
              <span className="relative font-serif text-lg font-bold text-primary-foreground">E</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                  Ember
                </h1>
                <span className="text-[9px] text-muted-foreground/70">|</span>
                <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground/70">
                  The Burning Proof
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                IOTA Layer 1
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 rounded-lg bg-secondary p-1">
            <button
              onClick={() => setActiveTab("brand")}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium tracking-wide uppercase transition-all ${
                activeTab === "brand"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Brand Admin</span>
            </button>
            <button
              onClick={() => setActiveTab("consumer")}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-medium tracking-wide uppercase transition-all ${
                activeTab === "consumer"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Consumer App</span>
            </button>
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">
              Mainnet Live
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main>
        {activeTab === "brand" ? <BrandDashboard /> : <ConsumerApp />}
      </main>
    </div>
  )
}
