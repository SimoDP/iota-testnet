"use client"

import { useState } from "react"
import { X, Loader2, CheckCircle2, ExternalLink } from "lucide-react"

interface MintDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MintDialog({ open, onOpenChange }: MintDialogProps) {
  const [minting, setMinting] = useState(false)
  const [minted, setMinted] = useState(false)
  const [physicalIdHash, setPhysicalIdHash] = useState("0x4e8f...a2c1")
  const [productName, setProductName] = useState("Capucines BB — Taurillon")
  const [resultAssetId, setResultAssetId] = useState<string | null>(null)
  const [resultDigest, setResultDigest] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!open) return null

  const handleMint = async () => {
    setMinting(true)
    setErrorMsg(null)

    try {
      const res = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ physicalIdHash, productName }),
      })
      const data = await res.json()

      if (!data.success) {
        throw new Error(data.error ?? "Mint failed")
      }

      setResultAssetId(data.assetId)
      setResultDigest(data.digest)
      setMinting(false)
      setMinted(true)
    } catch (err: any) {
      console.error("Mint error:", err)
      setErrorMsg(err.message ?? "Unknown error")
      setMinting(false)
    }
  }

  const handleClose = () => {
    if (minting) return
    setMinted(false)
    setResultAssetId(null)
    setResultDigest(null)
    setErrorMsg(null)
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Mint New Luxury Asset
          </h3>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              Physical ID Hash (NFC UID)
            </label>
            <input
              type="text"
              value={physicalIdHash}
              onChange={(e) => setPhysicalIdHash(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                Scan Cooldown
              </span>
              <span className="font-mono text-sm text-foreground">60s</span>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground/70">
              Hardcoded in Move smart contract for security
            </p>
          </div>
        </div>

        <div className="mt-6">
          {minted ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 rounded-lg bg-success/10 py-3 text-success">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Asset minted on IOTA Layer 1
                </span>
              </div>
              {resultAssetId && (
                <div className="rounded-lg border border-border bg-secondary px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    New Asset Object ID
                  </p>
                  <p className="mt-1 break-all font-mono text-xs text-foreground">
                    {resultAssetId}
                  </p>
                  {resultDigest && (
                    <a
                      href={`https://explorer.iota.org/txblock/${resultDigest}?network=testnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                    >
                      <ExternalLink className="h-2.5 w-2.5" />
                      View on IOTA Explorer
                    </a>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={handleMint}
                disabled={minting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60"
              >
                {minting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Broadcasting to Mysticeti...
                  </>
                ) : (
                  "Mint Asset (Shared Object)"
                )}
              </button>
              {errorMsg && (
                <div className="mt-3 rounded-lg bg-destructive/10 px-4 py-2 text-center">
                  <p className="text-xs text-destructive">{errorMsg}</p>
                </div>
              )}
            </>
          )}
        </div>

        <p className="mt-4 text-center text-[10px] text-muted-foreground">
          Gas sponsored via Burning Proof Oracle. No crypto exposure for brand.
        </p>
      </div>
    </div>
  )
}
