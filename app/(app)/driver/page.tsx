"use client"

import { useState } from "react"
import {
  Clock,
  MapPin,
  Gauge,
  Star,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LegCard } from "@/components/leg-card"
import { AVAILABLE_LEGS, DEMO_DRIVERS } from "@/lib/mock-data"

const driver = DEMO_DRIVERS[0] // Marcus Thompson

export default function DriverDashboardPage() {
  const [filter, setFilter] = useState<"all" | "nearby" | "high-pay">("all")

  const filteredLegs = AVAILABLE_LEGS.filter((leg) => {
    if (filter === "nearby") return leg.miles < 400
    if (filter === "high-pay") return leg.rateCents > 100000
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
          Driver Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Available relay legs near your current location
        </p>
      </div>

      {/* Driver Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <Clock className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {driver.hosRemainingHours}h
              </p>
              <p className="text-xs text-muted-foreground">HOS Remaining</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {driver.currentCity}
              </p>
              <p className="text-xs text-muted-foreground">Current Location</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/10">
              <Gauge className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {driver.trailerType}
              </p>
              <p className="text-xs text-muted-foreground">Trailer Type</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {driver.rating}
              </p>
              <p className="text-xs text-muted-foreground">Driver Rating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filter:</span>
        {(["all", "nearby", "high-pay"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f === "high-pay" ? "High Pay" : f === "all" ? "All Legs" : "Nearby"}
          </Button>
        ))}
        <Badge variant="secondary" className="ml-auto">
          {filteredLegs.length} available
        </Badge>
      </div>

      {/* Legs Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredLegs.map((leg) => (
          <LegCard key={leg.id} leg={leg} />
        ))}
      </div>

      {filteredLegs.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-muted-foreground">
              No legs match your filter
            </CardTitle>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
