"use client"

import { useState } from "react"
import {
  MapPin,
  ArrowRight,
  DollarSign,
  Clock,
  Navigation,
  CheckCircle2,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import type { Leg } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function LegCard({ leg, showAccept = true }: { leg: Leg; showAccept?: boolean }) {
  const [accepted, setAccepted] = useState(false)

  const rate = (leg.rateCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  })
  const ratePerMile = (leg.rateCents / 100 / leg.miles).toFixed(2)
  const isHighPay = leg.rateCents / leg.miles > 250

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300",
        accepted
          ? "border-success/30 glow-success"
          : "border-border/60 hover:border-primary/30 hover:glow-sm-primary",
        "bg-card"
      )}
    >
      {/* Subtle top accent line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-px",
        accepted
          ? "bg-gradient-to-r from-transparent via-success/60 to-transparent"
          : "bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
      )} />

      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">
              {leg.sequence}
            </span>
            <div>
              <span className="text-[11px] font-mono font-medium text-muted-foreground tracking-wider">
                {leg.loadId}
              </span>
              {isHighPay && (
                <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                  <Zap className="h-2.5 w-2.5" />
                  HIGH PAY
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={accepted ? "ASSIGNED" : leg.status} />
        </div>

        {/* Route */}
        <div className="flex items-center gap-4">
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
                <MapPin className="h-3 w-3 text-primary" />
              </div>
              {leg.origin}
            </div>
            <div className="ml-2.5 flex items-center gap-2">
              <div className="h-5 border-l border-dashed border-primary/20" />
              <span className="text-[10px] text-muted-foreground font-mono">{leg.miles} mi</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-success/10">
                <Navigation className="h-3 w-3 text-success" />
              </div>
              {leg.destination}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tracking-tight text-foreground">{rate}</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              ${ratePerMile}/mi
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-px rounded-xl overflow-hidden bg-border/30">
          {[
            { icon: ArrowRight, value: `${leg.miles} mi`, label: "Distance" },
            { icon: Clock, value: leg.estimatedPickup, label: "Pickup" },
            { icon: DollarSign, value: leg.estimatedDelivery, label: "Delivery" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 bg-secondary/50 py-3">
              <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">{item.value}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Handoff */}
        <div className="flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-2 ring-1 ring-border/30">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">
            Handoff at{" "}
            <span className="font-semibold text-foreground">
              {leg.handoffPoint}
            </span>
          </span>
        </div>

        {/* Accept button */}
        {showAccept && !accepted && leg.status === "OPEN" && (
          <Button
            size="lg"
            className="w-full gap-2 rounded-xl h-12 text-sm font-semibold"
            onClick={() => setAccepted(true)}
          >
            <CheckCircle2 className="h-4 w-4" />
            Accept Leg
          </Button>
        )}
        {accepted && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-success/8 py-3 text-sm font-semibold text-success ring-1 ring-success/20">
            <CheckCircle2 className="h-4 w-4" />
            Accepted — Head to {leg.handoffPoint}
          </div>
        )}
      </div>
    </div>
  )
}
