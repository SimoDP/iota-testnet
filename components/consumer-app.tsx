"use client"

import { useState, useCallback } from "react"
import { ScanButton } from "@/components/scan-button"
import { DigitalTwinPassport } from "@/components/digital-twin-passport"
import Image from "next/image"

type ScanState = "idle" | "scanning" | "complete" | "error"

const DEMO_ASSET_ID = process.env.NEXT_PUBLIC_DEMO_ASSET_ID ?? ""

export function ConsumerApp() {
  const [scanState, setScanState] = useState<ScanState>("idle")
  const [integrityScore, setIntegrityScore] = useState(0)
  const [scanCount, setScanCount] = useState(0)
  const [txDigest, setTxDigest] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleScan = useCallback(async () => {
    if (scanState === "scanning") return
    setScanState("scanning")
    setErrorMsg(null)

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId: DEMO_ASSET_ID }),
      })
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error ?? "Scan failed")
      }

      setIntegrityScore(data.integrityScore)
      setScanCount(data.scanCount)
      setTxDigest(data.digest)
      setScanState("complete")
    } catch (err: any) {
      console.error("Scan error:", err)
      setErrorMsg(err.message ?? "Unknown error")
      setScanState("error")
    }
  }, [scanState])

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-start justify-center px-4 py-8">
      {/* Phone Frame */}
      <div className="w-full max-w-[400px]">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
          {/* Phone Status Bar */}
          <div className="flex items-center justify-between bg-secondary px-5 py-2">
            <span className="font-mono text-[10px] text-muted-foreground">
              9:41
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">NFC</span>
              <div className="h-2.5 w-5 rounded-sm border border-muted-foreground/50">
                <div className="m-0.5 h-1.5 w-3 rounded-[1px] bg-success" />
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="relative aspect-[4/3] w-full bg-secondary">
            <Image
              src="/images/luxury-bag.jpg"
              alt="Luxury leather handbag — authenticated digital twin"
              fill
              className="object-cover"
              priority
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card" />
          </div>

          {/* Content */}
          <div className="px-5 pb-6 pt-4">
            {/* Product Name */}
            <div className="mb-1 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ember-dim">
                Digital Twin #LV-10291
              </p>
              <h3 className="font-serif text-xl font-semibold text-foreground">
                Capucines MM
              </h3>
              <p className="text-xs text-muted-foreground">
                Taurillon Leather — Magnolia
              </p>
            </div>

            {/* Scan Button */}
            <div className="my-6">
              <ScanButton state={scanState === "error" ? "idle" : scanState} onScan={handleScan} />
            </div>

            {/* Scanning State */}
            {scanState === "scanning" && (
              <div className="mb-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  <p className="text-xs text-primary">
                    Verifying on IOTA Layer 1...
                  </p>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Mysticeti consensus — ~200ms finality
                </p>
              </div>
            )}

            {/* Error State */}
            {scanState === "error" && errorMsg && (
              <div className="mb-4 rounded-xl bg-destructive/10 px-4 py-3 text-center">
                <p className="text-xs text-destructive">{errorMsg}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Check .env.local and oracle funding
                </p>
              </div>
            )}

            {/* Digital Twin Passport */}
            {scanState === "complete" && (
              <DigitalTwinPassport
                integrityScore={integrityScore}
                scanCount={scanCount}
                objectId={DEMO_ASSET_ID}
                txDigest={txDigest ?? undefined}
              />
            )}

            {/* Footer */}
            <div className="mt-6 border-t border-border pt-4 text-center">
              <p className="text-[10px] text-muted-foreground">
                <span className="font-semibold text-primary">Ember</span>
                <span className="mx-1.5 text-muted-foreground/50">|</span>
                <span className="text-muted-foreground/70">The Burning Proof</span>
                <span className="mx-1.5 text-muted-foreground/50">·</span>
                <span className="text-muted-foreground/70">IOTA Layer 1</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
