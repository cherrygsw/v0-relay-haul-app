"use client"

import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LegCard } from "@/components/leg-card"
import { AVAILABLE_LEGS, DEMO_DRIVERS } from "@/lib/mock-data"

const driver = DEMO_DRIVERS[0]

function hosColor(h: number) {
  if (h >= 8) return "text-success"
  if (h >= 5) return "text-warning"
  return "text-destructive"
}

function hosBg(h: number) {
  if (h >= 8) return "bg-success"
  if (h >= 5) return "bg-warning"
  return "bg-destructive"
}

function hosBarPct(h: number) {
  return Math.min((h / 11) * 100, 100)
}

export default function DriverDashboardPage() {
  const [filter, setFilter] = useState<"all" | "nearby" | "high-pay">("all")

  const filteredLegs = AVAILABLE_LEGS.filter((leg) => {
    if (filter === "nearby") return leg.miles < 400
    if (filter === "high-pay") return leg.rateCents > 100000
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      {/* HOS Banner - the single most important thing on screen */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Hours of Service
          </span>
          <span className={`text-xs font-bold uppercase tracking-widest ${hosColor(driver.hosRemainingHours)}`}>
            {driver.hosRemainingHours >= 8 ? "Good" : driver.hosRemainingHours >= 5 ? "Limited" : "Critical"}
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className={`text-5xl font-bold tabular-nums tracking-tight ${hosColor(driver.hosRemainingHours)}`}>
            {driver.hosRemainingHours}
          </span>
          <span className="text-lg text-muted-foreground font-medium">hours left</span>
        </div>
        {/* HOS Bar */}
        <div className="relative h-3 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${hosBg(driver.hosRemainingHours)}`}
            style={{ width: `${hosBarPct(driver.hosRemainingHours)}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>{driver.currentCity}</span>
          <span>{driver.trailerType}</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(["all", "nearby", "high-pay"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2.5 text-sm font-medium min-h-[44px] transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground active:bg-border"
              }`}
            >
              {f === "high-pay" ? "High Pay" : f === "all" ? "All" : "Nearby"}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredLegs.length} legs
        </span>
      </div>

      {/* Legs list - single column for mobile-first */}
      <div className="flex flex-col gap-4">
        {filteredLegs.map((leg) => (
          <LegCard key={leg.id} leg={leg} />
        ))}
      </div>

      {filteredLegs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 gap-4">
          <SlidersHorizontal className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No legs match this filter</p>
          <Button
            variant="outline"
            className="rounded-lg min-h-[44px]"
            onClick={() => setFilter("all")}
          >
            Show All
          </Button>
        </div>
      )}
    </div>
  )
}
