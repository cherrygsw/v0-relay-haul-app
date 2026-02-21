"use client"

import { useState } from "react"
import {
  MapPin,
  ArrowRight,
  DollarSign,
  Clock,
  Navigation,
  CheckCircle2,
  Sparkles,
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
          ? "border-success/40 bg-success/5"
          : "border-border bg-card hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5",
      )}
    >
      <div className="p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-serif font-semibold text-foreground">
              {leg.sequence}
            </span>
            <div>
              <span className="text-xs font-mono text-muted-foreground tracking-wide">
                {leg.loadId}
              </span>
              {isHighPay && (
                <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                  <Sparkles className="h-2.5 w-2.5" />
                  HIGH PAY
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={accepted ? "ASSIGNED" : leg.status} />
        </div>

        {/* Route */}
        <div className="flex items-center gap-6">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-3 w-3 text-primary" />
              </div>
              {leg.origin}
            </div>
            <div className="ml-3 flex items-center gap-2.5">
              <div className="h-6 border-l border-dashed border-border" />
              <span className="text-[10px] text-muted-foreground font-mono">{leg.miles} mi</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/10">
                <Navigation className="h-3 w-3 text-success" />
              </div>
              {leg.destination}
            </div>
          </div>
          <div className="text-right">
            <p className="font-serif text-3xl font-medium text-foreground">{rate}</p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              ${ratePerMile}/mi
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: ArrowRight, value: `${leg.miles} mi`, label: "Distance" },
            { icon: Clock, value: leg.estimatedPickup, label: "Pickup" },
            { icon: DollarSign, value: leg.estimatedDelivery, label: "Delivery" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 rounded-xl bg-secondary/60 py-3">
              <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">{item.value}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Handoff */}
        <div className="flex items-center gap-2.5 rounded-xl bg-secondary/40 px-4 py-2.5 border border-border/60">
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
            className="w-full gap-2 rounded-full h-12 text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
            onClick={() => setAccepted(true)}
          >
            <CheckCircle2 className="h-4 w-4" />
            Accept Leg
          </Button>
        )}
        {accepted && (
          <div className="flex items-center justify-center gap-2 rounded-full bg-success/10 py-3 text-sm font-semibold text-success border border-success/20">
            <CheckCircle2 className="h-4 w-4" />
            Accepted
          </div>
        )}
      </div>
    </div>
  )
}
