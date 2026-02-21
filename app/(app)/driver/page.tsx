"use client"

import { useState } from "react"
import {
  Clock,
  MapPin,
  Gauge,
  Star,
  Zap,
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
    value: `${DEMO_DRIVERS[0].hosRemainingHours}h`,
    label: "HOS Remaining",
    color: "success" as const,
  },
  {
    icon: MapPin,
    value: DEMO_DRIVERS[0].currentCity,
    label: "Current Location",
    color: "primary" as const,
    isText: true,
  },
  {
    icon: Gauge,
    value: DEMO_DRIVERS[0].trailerType,
    label: "Trailer Type",
    color: "warning" as const,
    isText: true,
  },
  {
    icon: Star,
    value: `${DEMO_DRIVERS[0].rating}`,
    label: "Driver Rating",
    color: "primary" as const,
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
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <Badge className="bg-success/8 text-success ring-1 ring-success/20 border-0 text-[10px] font-bold uppercase tracking-wider">
            Active
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Available relay legs near {driver.currentCity}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => {
          const colorClasses = {
            success: "bg-success/8 text-success ring-success/20",
            primary: "bg-primary/8 text-primary ring-primary/20",
            warning: "bg-warning/8 text-warning ring-warning/20",
          }
          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/60 p-5 transition-all hover:border-border/60"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${colorClasses[stat.color]}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                  {stat.label}
                </span>
              </div>
              <p className={`mt-3 ${stat.isText ? 'text-lg' : 'text-3xl'} font-bold tracking-tight text-foreground`}>
                {stat.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/60 ring-1 ring-border/30">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-secondary/40 p-1 ring-1 ring-border/30">
            {(["all", "nearby", "high-pay"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  filter === f
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter === f && (
                  <span className="absolute inset-0 rounded-lg bg-primary glow-sm-primary" />
                )}
                <span className="relative">
                  {f === "high-pay" ? "High Pay" : f === "all" ? "All Legs" : "Nearby"}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-1.5 ring-1 ring-border/30">
          <Zap className="h-3 w-3 text-primary" />
          <span className="text-xs font-semibold text-foreground">{filteredLegs.length}</span>
          <span className="text-xs text-muted-foreground">available</span>
        </div>
      </div>

      {/* Legs Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredLegs.map((leg) => (
          <LegCard key={leg.id} leg={leg} />
        ))}
      </div>

      {filteredLegs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-card/30 py-16 gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/60 ring-1 ring-border/30">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">No legs match your filter</p>
          <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setFilter("all")}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
