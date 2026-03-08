"use client"

import { Nfc, Loader2 } from "lucide-react"

interface ScanButtonProps {
  state: "idle" | "scanning" | "complete"
  onScan: () => void
}

export function ScanButton({ state, onScan }: ScanButtonProps) {
  const isScanning = state === "scanning"

  return (
    <button
      onClick={onScan}
      disabled={isScanning}
      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 px-6 py-5 transition-all hover:border-primary/70 hover:from-primary/15 hover:to-accent/10 active:scale-[0.98] disabled:pointer-events-none"
    >
      {/* Animated ember glow rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 ${
            isScanning ? "animate-ping" : "animate-pulse"
          }`}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`h-12 w-12 rounded-full border border-primary/30 ${
            isScanning ? "animate-ping" : ""
          }`}
          style={{ animationDelay: "150ms" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        {isScanning ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <Nfc className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
        )}
        <span className="text-sm font-bold uppercase tracking-[0.15em] text-primary">
          {isScanning ? "Scanning..." : "Tap to Scan (NFC)"}
        </span>
      </div>
    </button>
  )
}
