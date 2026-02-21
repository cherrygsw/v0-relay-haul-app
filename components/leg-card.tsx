"use client"

import { useState } from "react"
import { MapPin, CheckCircle2 } from "lucide-react"
import type { Leg } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function LegCard({ leg, showAccept = true }: { leg: Leg; showAccept?: boolean }) {
  const [accepted, setAccepted] = useState(false)

  const pay = Math.round(leg.rateCents / 100)
  const ratePerMile = (leg.rateCents / 100 / leg.miles).toFixed(2)
  const driveHours = Math.round(leg.miles / 55)

  // AI-style one-liner
  const summary = `${leg.miles} mi to ${leg.handoffPoint.split(" - ")[0]} in ${leg.destination.split(",")[0]} \u2014 about ${driveHours} hrs, $${pay.toLocaleString()} payout.`

  return (
    <div
      className={cn(
        "rounded-2xl border transition-colors",
        accepted
          ? "border-success/40 bg-success/5"
          : "border-border bg-card"
      )}
    >
      <div className="p-5 flex flex-col gap-4">
        {/* Route line */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground truncate">
              {leg.origin} <span className="text-muted-foreground font-normal mx-1">{">"}</span> {leg.destination}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              {leg.loadId}
            </p>
          </div>
        </div>

        {/* Key stats - the 4 things a driver cares about */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-secondary p-3 text-center">
            <p className="text-xl font-bold text-foreground tabular-nums">{leg.miles}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">miles</p>
          </div>
          <div className="rounded-xl bg-secondary p-3 text-center">
            <p className="text-xl font-bold text-success tabular-nums">${pay.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">pay</p>
          </div>
          <div className="rounded-xl bg-secondary p-3 text-center">
            <p className="text-xl font-bold text-foreground tabular-nums">${ratePerMile}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">per mi</p>
          </div>
        </div>

        {/* Handoff truck stop - prominent */}
        <div className="rounded-xl bg-primary/8 border border-primary/15 px-4 py-3">
          <p className="text-xs text-muted-foreground">Handoff at</p>
          <p className="text-sm font-bold text-foreground mt-0.5">{leg.handoffPoint}</p>
        </div>

        {/* AI summary one-liner */}
        <p className="text-xs text-muted-foreground leading-relaxed italic">
          {summary}
        </p>

        {/* Big green accept button - unmissable, full width, 56px tall */}
        {showAccept && !accepted && leg.status === "OPEN" && (
          <button
            onClick={() => setAccepted(true)}
            className="w-full rounded-2xl bg-success text-success-foreground font-bold text-base py-4 min-h-[56px] active:scale-[0.98] transition-transform"
          >
            Accept This Leg
          </button>
        )}
        {accepted && (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-success/15 border border-success/30 py-4 min-h-[56px] text-success font-bold">
            <CheckCircle2 className="h-5 w-5" />
            Accepted - Head to Pickup
          </div>
        )}
      </div>
    </div>
  )
}
