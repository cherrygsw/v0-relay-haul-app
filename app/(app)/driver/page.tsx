"use client"

import { useState } from "react"
import {
  Clock,
  MapPin,
  Gauge,
  Star,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LegCard } from "@/components/leg-card"
import { AVAILABLE_LEGS, DEMO_DRIVERS } from "@/lib/mock-data"

const driver = DEMO_DRIVERS[0]

const STAT_CARDS = [
  {
    icon: Clock,
    value: `${driver.hosRemainingHours}h`,
    label: "HOS Remaining",
  },
  {
    icon: MapPin,
    value: driver.currentCity,
    label: "Current Location",
    isText: true,
  },
  {
    icon: Gauge,
    value: driver.trailerType,
    label: "Trailer Type",
    isText: true,
  },
  {
    icon: Star,
    value: `${driver.rating}`,
    label: "Driver Rating",
  },
]

export default function DriverDashboardPage() {
  const [filter, setFilter] = useState<"all" | "nearby" | "high-pay">("all")

  const filteredLegs = AVAILABLE_LEGS.filter((leg) => {
    if (filter === "nearby") return leg.miles < 400
    if (filter === "high-pay") return leg.rateCents > 100000
    return true
  })

  return (
    <div className="flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          Driver Portal
        </p>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl font-medium text-foreground lg:text-4xl">
            Dashboard
          </h1>
          <Badge className="rounded-full bg-success/10 text-success border-0 text-[10px] font-semibold">
            Active
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Available relay legs near {driver.currentCity}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-md hover:shadow-primary/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <stat.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
                {stat.label}
              </span>
            </div>
            <p className={`${stat.isText ? 'text-lg' : 'text-3xl'} font-serif font-medium text-foreground`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-1 rounded-full bg-secondary p-1">
            {(["all", "nearby", "high-pay"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  filter === f
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "high-pay" ? "High Pay" : f === "all" ? "All Legs" : "Nearby"}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredLegs.length}</span> available
        </p>
      </div>

      {/* Legs Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {filteredLegs.map((leg) => (
          <LegCard key={leg.id} leg={leg} />
        ))}
      </div>

      {filteredLegs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No legs match your filter</p>
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setFilter("all")}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
