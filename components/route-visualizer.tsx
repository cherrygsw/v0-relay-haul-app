"use client"

import { StatusBadge } from "@/components/status-badge"
import type { Leg } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function RouteVisualizer({ legs }: { legs: Leg[] }) {
  return (
    <div className="relative flex flex-col gap-0">
      {legs.map((leg, i) => (
        <div key={leg.id} className="relative flex items-stretch gap-5">
          {/* Timeline */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                className={cn(
                  "h-5 w-5 rounded-full z-10 ring-4 ring-card",
                  leg.status === "IN_TRANSIT" && "bg-success",
                  leg.status === "ASSIGNED" && "bg-primary",
                  leg.status === "SEARCHING" && "bg-warning",
                  leg.status === "COMPLETED" && "bg-success",
                  leg.status === "OPEN" && "bg-muted-foreground/40",
                )}
              />
              {(leg.status === "IN_TRANSIT" || leg.status === "SEARCHING") && (
                <div
                  className={cn(
                    "absolute inset-0 rounded-full animate-ping opacity-30",
                    leg.status === "IN_TRANSIT" && "bg-success",
                    leg.status === "SEARCHING" && "bg-warning",
                  )}
                />
              )}
            </div>
            {i < legs.length - 1 && (
              <div className="relative w-px flex-1 min-h-[80px]">
                <div className={cn(
                  "absolute inset-0 w-px",
                  (leg.status === "COMPLETED" || leg.status === "IN_TRANSIT")
                    ? "bg-gradient-to-b from-success/60 to-success/20"
                    : "bg-border/60"
                )} />
              </div>
            )}
          </div>

          {/* Leg Info */}
          <div className="flex-1 pb-8">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-muted-foreground tracking-[0.15em] uppercase">
                    Leg {leg.sequence}
                  </span>
                  <StatusBadge status={leg.status} />
                </div>
                <p className="mt-1.5 text-sm font-bold text-foreground">
                  {leg.origin}
                  <span className="mx-1.5 text-muted-foreground/40">{">"}</span>
                  {leg.destination}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                  {leg.miles} mi
                </p>
                {leg.driverName && (
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-primary font-semibold bg-primary/8 rounded-md px-2 py-0.5">
                    {leg.driverName}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-bold text-foreground">
                  ${(leg.rateCents / 100).toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {leg.estimatedPickup}
                </p>
              </div>
            </div>

            {/* AI Explanation */}
            {leg.driverName && (
              <div className="mt-3 rounded-xl bg-primary/5 border border-primary/10 px-4 py-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-bold text-primary text-gradient">AI</span>{" "}
                  {leg.sequence === 1
                    ? `${leg.driverName} is 8 miles from pickup with 9.5h HOS. He's hauled this corridor 12 times with a 4.8 rating.`
                    : leg.sequence === 2
                    ? `${leg.driverName} is positioned at the Iowa City Flying J with 7h HOS. She specializes in I-80 corridor, rated 4.9.`
                    : "Searching for available drivers in the area..."}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Final destination */}
      <div className="relative flex items-center gap-5">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-5 w-5 rounded-full bg-success ring-4 ring-card z-10" />
            <div className="absolute inset-0 rounded-full bg-success/30 animate-pulse" />
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-success tracking-[0.15em] uppercase">
            Destination
          </span>
          <p className="text-sm font-bold text-foreground">
            {legs[legs.length - 1]?.destination}
          </p>
        </div>
      </div>
    </div>
  )
}
