"use client"

import { StatusBadge } from "@/components/status-badge"
import type { Leg } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const LEG_COLORS = [
  "bg-primary",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
]

export function RouteVisualizer({ legs }: { legs: Leg[] }) {
  return (
    <div className="relative flex flex-col gap-0">
      {legs.map((leg, i) => (
        <div key={leg.id} className="relative flex items-stretch gap-4">
          {/* Timeline */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "h-4 w-4 rounded-full border-2 border-background ring-2 z-10",
                LEG_COLORS[i % LEG_COLORS.length],
                leg.status === "IN_TRANSIT" && "ring-success/50",
                leg.status === "ASSIGNED" && "ring-primary/50",
                leg.status === "SEARCHING" && "ring-warning/50",
                (leg.status === "OPEN") && "ring-border"
              )}
            />
            {i < legs.length - 1 && (
              <div
                className={cn(
                  "w-0.5 flex-1 min-h-[60px]",
                  leg.status === "COMPLETED" || leg.status === "IN_TRANSIT"
                    ? "bg-success/40"
                    : "bg-border"
                )}
              />
            )}
          </div>

          {/* Leg Info */}
          <div className="flex-1 pb-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-muted-foreground">
                    LEG {leg.sequence}
                  </span>
                  <StatusBadge status={leg.status} />
                </div>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {leg.origin} → {leg.destination}
                </p>
                <p className="text-xs text-muted-foreground">
                  {leg.miles} mi &middot; Handoff: {leg.handoffPoint}
                </p>
                {leg.driverName && (
                  <p className="mt-1 text-xs text-primary font-medium">
                    {leg.driverName}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground">
                  ${(leg.rateCents / 100).toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {leg.estimatedPickup}
                </p>
              </div>
            </div>

            {/* AI Explanation */}
            {leg.driverName && (
              <div className="mt-2 rounded-md bg-primary/5 border border-primary/10 px-3 py-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-primary">AI:</span>{" "}
                  {leg.sequence === 1
                    ? `${leg.driverName} is 8 miles from pickup with ${9.5} hours HOS available. He's hauled this corridor 12 times with a 4.8 rating.`
                    : leg.sequence === 2
                    ? `${leg.driverName} is positioned at the Iowa City Flying J with 7 hours HOS. She specializes in this I-80 corridor and is rated 4.9.`
                    : "Searching for available drivers in the area..."}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Final destination */}
      <div className="relative flex items-center gap-4">
        <div className="flex flex-col items-center">
          <div className="h-4 w-4 rounded-full bg-success ring-2 ring-success/30 z-10" />
        </div>
        <div>
          <span className="text-xs font-bold text-success">DESTINATION</span>
          <p className="text-sm font-semibold text-foreground">
            {legs[legs.length - 1]?.destination}
          </p>
        </div>
      </div>
    </div>
  )
}
