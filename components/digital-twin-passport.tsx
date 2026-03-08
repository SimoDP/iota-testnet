"use client"

import { CheckCircle2, MapPin, Clock, Copy, ExternalLink, BadgeCheck, FileCheck, ShieldCheck } from "lucide-react"
import { IntegrityRing } from "@/components/integrity-ring"
import { useState } from "react"

interface DigitalTwinPassportProps {
  integrityScore: number
  scanCount: number
  objectId?: string
  txDigest?: string
}

const ASSET_DID = "did:iota:0x7f3a...9c2e"

const verifiableCredentials = [
  {
    issuer: "Louis Vuitton Maison",
    credential: "Certificate of Authenticity",
    icon: BadgeCheck,
    date: "Jun 15, 2026",
    verified: true,
  },
  {
    issuer: "Milan — Via Montenapoleone",
    credential: "Point of Sale VC",
    icon: FileCheck,
    date: "Jun 15, 2026",
    verified: true,
  },
  {
    issuer: "Tokyo — Ginza Boutique",
    credential: "Boutique Verification VC",
    icon: ShieldCheck,
    date: "Jun 22, 2026",
    verified: true,
  },
]

const provenanceLog = [
  {
    location: "Milan — Via Montenapoleone Boutique",
    event: "Purchased & First Scan",
    date: "Jun 15, 2026",
    type: "purchase" as const,
  },
  {
    location: "Milan — Malpensa Airport",
    event: "Departure Scan",
    date: "Jun 18, 2026",
    type: "scan" as const,
  },
  {
    location: "Tokyo — Narita Airport",
    event: "Arrival Scan",
    date: "Jun 19, 2026",
    type: "scan" as const,
  },
  {
    location: "Tokyo — Ginza Boutique",
    event: "Boutique Verification",
    date: "Jun 22, 2026",
    type: "boutique" as const,
  },
  {
    location: "Paris — Rue du Faubourg",
    event: "Consignment Authentication",
    date: "Sep 04, 2026",
    type: "scan" as const,
  },
  {
    location: "Current Location",
    event: "Just Scanned",
    date: "Now",
    type: "scan" as const,
  },
]

function truncateId(id: string, chars: number = 8): string {
  if (id.length <= chars * 2 + 3) return id
  return `${id.slice(0, chars)}...${id.slice(-chars)}`
}

export function DigitalTwinPassport({
  integrityScore,
  scanCount,
  objectId,
  txDigest,
}: DigitalTwinPassportProps) {
  const [copied, setCopied] = useState(false)

  const displayObjectId = objectId ? truncateId(objectId) : "0x8a4f...d12b"
  const explorerBaseUrl = "https://explorer.iota.org"

  const copyObjectId = () => {
    navigator.clipboard.writeText(objectId ?? "")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
      {/* Authentic Badge */}
      <div className="flex items-center justify-center gap-2 rounded-xl bg-success/10 py-3">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <span className="text-sm font-bold uppercase tracking-[0.15em] text-success">
          Authentic
        </span>
      </div>

      {/* On-Chain Object ID + Explorer Link */}
      <div className="rounded-xl border border-border bg-secondary p-4">
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          On-Chain Object (IOTA Testnet)
        </p>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-sm text-foreground">{displayObjectId}</p>
            {txDigest && (
              <a
                href={`${explorerBaseUrl}/txblock/${txDigest}?network=testnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                View tx on Explorer
              </a>
            )}
          </div>
          <button
            onClick={copyObjectId}
            className="rounded-lg border border-border bg-muted p-2 transition-colors hover:border-primary/50"
            aria-label="Copy Object ID to clipboard"
          >
            {copied ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Asset DID */}
      <div className="rounded-xl border border-border bg-secondary p-4">
        <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Asset Decentralized Identifier
        </p>
        <p className="font-mono text-sm text-foreground">{ASSET_DID}</p>
      </div>

      {/* Verifiable Credentials */}
      <div className="rounded-xl border border-border bg-secondary p-4">
        <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Verifiable Credentials
        </p>
        <div className="space-y-2">
          {verifiableCredentials.map((vc, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-3 py-2"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-success/10">
                <vc.icon className="h-3.5 w-3.5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">
                  {vc.credential}
                </p>
                <p className="text-[10px] text-muted-foreground">{vc.issuer}</p>
              </div>
              <div className="text-right">
                <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-success" />
                <p className="mt-0.5 font-mono text-[9px] text-muted-foreground/70">
                  {vc.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrity Score Section */}
      <div className="rounded-xl border border-border bg-secondary p-4">
        <p className="mb-3 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Integrity Score
        </p>
        <div className="flex items-center justify-center">
          <IntegrityRing score={integrityScore} />
        </div>
        <div className="mt-3 flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="font-mono text-sm font-semibold text-foreground">
              {scanCount}
            </p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
              Total Scans
            </p>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="text-center">
            <p className="font-mono text-sm font-semibold text-foreground">8</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
              Locations
            </p>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="text-center">
            <p className="font-mono text-sm font-semibold text-foreground">2</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
              Boutique Visits
            </p>
          </div>
        </div>
      </div>

      {/* Immutable Provenance Log */}
      <div className="rounded-xl border border-border bg-secondary p-4">
        <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Immutable Provenance Log
        </p>
        <div className="space-y-0">
          {provenanceLog.map((entry, index) => (
            <div key={index} className="flex gap-3">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${
                    index === provenanceLog.length - 1
                      ? "bg-primary shadow-[0_0_6px_var(--primary)]"
                      : entry.type === "boutique"
                        ? "bg-success"
                        : entry.type === "purchase"
                          ? "bg-primary"
                          : "bg-muted-foreground/50"
                  }`}
                />
                {index < provenanceLog.length - 1 && (
                  <div className="h-full w-px bg-border" />
                )}
              </div>

              {/* Entry */}
              <div className="pb-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">
                    {entry.location}
                  </p>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {entry.event}
                </p>
                <div className="mt-0.5 flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5 text-muted-foreground/50" />
                  <span className="font-mono text-[10px] text-muted-foreground/70">
                    {entry.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
