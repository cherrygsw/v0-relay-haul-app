"use client"

import { useState } from "react"
import {
  MapPin,
  ArrowRight,
  DollarSign,
  Clock,
  Navigation,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import type { Leg } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function LegCard({ leg, showAccept = true }: { leg: Leg; showAccept?: boolean }) {
  const [accepted, setAccepted] = useState(false)

  const rate = (leg.rateCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })
  const ratePerMile = (leg.rateCents / 100 / leg.miles).toFixed(2)

  return (
    <Card
      className={cn(
        "transition-all hover:border-primary/20",
        accepted && "border-success/40 bg-success/5"
      )}
    >
      <CardContent className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {leg.sequence}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {leg.loadId}
            </span>
          </div>
          <StatusBadge status={accepted ? "ASSIGNED" : leg.status} />
        </div>

        {/* Route */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {leg.origin}
            </div>
            <div className="ml-1.5 h-4 border-l border-dashed border-border" />
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Navigation className="h-3.5 w-3.5 text-success" />
              {leg.destination}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{rate}</p>
            <p className="text-xs text-muted-foreground">
              ${ratePerMile}/mi
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-secondary/50 p-3">
          <div className="flex flex-col items-center gap-0.5">
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              {leg.miles} mi
            </span>
            <span className="text-[10px] text-muted-foreground">Distance</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              {leg.estimatedPickup}
            </span>
            <span className="text-[10px] text-muted-foreground">Pickup</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              {leg.estimatedDelivery}
            </span>
            <span className="text-[10px] text-muted-foreground">Delivery</span>
          </div>
        </div>

        {/* Handoff */}
        <div className="flex items-center gap-2 rounded-md bg-secondary/30 px-3 py-2">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Handoff at{" "}
            <span className="font-medium text-foreground">
              {leg.handoffPoint}
            </span>
          </span>
        </div>

        {/* Accept button */}
        {showAccept && !accepted && leg.status === "OPEN" && (
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={() => setAccepted(true)}
          >
            <CheckCircle2 className="h-4 w-4" />
            Accept Leg
          </Button>
        )}
        {accepted && (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-success/10 py-3 text-sm font-medium text-success">
            <CheckCircle2 className="h-4 w-4" />
            Leg Accepted — Head to {leg.handoffPoint}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
